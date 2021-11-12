const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
  })
)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const ROOM_NAME = 'TECHチャットの部屋'
const name_sid = new Map()
const sid_name = new Map()
const pass_name = new Map()

app.get('/', (req, res) => {
  const username = req.session.username
  const sid = name_sid.get(username)

  if (!username) return res.render('index')
  if (!sid_name.has(sid)) {
    req.session.destroy()
    return res.render('index')
  }
  res.redirect('room')
})

app.post('/user', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (name_sid.has(username) && pass_name.get(username) !== password) {
    return res.send('ユーザー名かパスワードに誤りがあります。')
  }
  pass_name.set(username, password)
  req.session.username = username
  res.redirect('room')
})

app.get('/room', (req, res) => {
  if (!req.session.username) return res.redirect('/')
  res.render('room', { username: req.session.username })
})

server.listen(process.env.PORT || 3000)

io.on('connection', (socket) => {
  socket.on('new-user', (username) => {
    const sid = name_sid.get(username)

    socket.join(ROOM_NAME)
    name_sid.set(username, socket.id)
    sid_name.set(socket.id, username)
    if (name_sid.has(username) && sid_name.has(sid)) return
    socket.to(ROOM_NAME).emit('user-connected', username)
  })

  socket.on('send-chat-message', (message) => {
    socket.to(ROOM_NAME).emit('chat-message', {
      message: message,
      name: sid_name.get(socket.id),
    })
  })

  socket.on('logout', (username) => {
    socket.to(ROOM_NAME).emit('user-disconnected', sid_name.get(socket.id))
    sid_name.delete(socket.id)
  })
})
