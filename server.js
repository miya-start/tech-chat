const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

const ROOM_NAME = 'TECHチャット'

app.get('/', (_, res) => {
  res.redirect('room')
})

app.get('/room', (_, res) => {
  res.render('room')
})

server.listen(process.env.PORT || 3000)

io.on('connection', (socket) => {
  // TODO3: ブラウザからのイベントを受け取る。新たなユーザが入室したことを検知する
  // socket.on('new-user', () => {
  //   console.log('新たなユーザが入室しました！')
  // })
  //
  // TODO4: ブラウザにイベントを送る。新たなユーザが入室したことをブラウザに通知する
  // socket.join(ROOM_NAME)
  // socket.to(ROOM_NAME).emit('user-connected')
  //
  //
  // TODO7: ブラウザからのイベントを受け取る。イベントだけでなく、チャットメッセージも受け取る
  // socket.on('???', (message) => {
  //   console.log(message)
  // })
  //
  // TODO8: ブラウザにイベントを送る。イベントだけでなく、チャットメッセージもブラウザに送る
  // socket.to(???).emit('chat-message', {
  //   message,
  // })
})
