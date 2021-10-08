const express = require('express')
const cookieParser = require('cookie-parser')
const sessions = require('express-session')
const { log } = require('console')
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
const namesMap = new Map()
const sidsMap = new Map()

app.get('/', (req, res) => {
  const username = req.session.username
  if (!username) return res.render('index')
  if (!namesMap.has(username)) {
    req.session.destroy()
    return res.render('index')
  }
  res.redirect('room')
})

app.post('/user', (req, res) => {
  const username = req.body.username
  if (namesMap.has(username)) {
    return res.send('すでに使われている名前です。別の名前を入力してください。')
  }
  req.session.username = req.body.username
  res.redirect('room')
})

app.get('/room', (req, res) => {
  if (!req.session.username) return res.redirect('/')
  res.render('room', { username: req.session.username })
})

server.listen(process.env.PORT || 3000)

io.on('connection', (socket) => {
  socket.on('new-user', (username) => {
    socket.join(ROOM_NAME)
    namesMap.set(username, socket.id)
    sidsMap.set(socket.id, username)
    socket.to(ROOM_NAME).emit('user-connected', username)
  })

  socket.on('send-chat-message', (message) => {
    socket.to(ROOM_NAME).emit('chat-message', {
      message: message,
      name: sidsMap.get(socket.id),
    })
  })

  socket.on('logout', (username) => {
    socket.to(ROOM_NAME).emit('user-disconnected', sidsMap.get(socket.id))
    namesMap.delete(username)
    sidsMap.delete(socket.id)
  })
})
