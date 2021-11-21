const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const ROOM_NAME = 'TECHチャットの部屋'

app.get('/', (_, res) => {
  res.redirect('room')
})

app.get('/room', (_, res) => {
  res.render('room')
})

server.listen(process.env.PORT || 3000)

io.on('connection', (socket) => {
  socket.on('new-user', () => {
    socket.join(ROOM_NAME)
    socket.to(ROOM_NAME).emit('user-connected')
  })

  socket.on('send-chat-message', (message) => {
    socket.to(ROOM_NAME).emit('chat-message', {
      message,
    })
  })
})
