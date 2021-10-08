const socket = io(location.host)
const msgForm = document.querySelector('#send-container')
const msgInput = document.querySelector('#message-input')
const msgContainer = document.querySelector('#message-container')
const roomContainer = document.querySelector('#room-container')
const logout = document.getElementById('logout')

if (msgForm != null) {
  AppendMessage(`あなたは ${username} として参加しました。`)
  socket.emit('new-user', username)

  socket.on('chat-message', (data) => {
    AppendMessage(`${data.name}: ${data.message}`)
  })

  msgForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const message = msgInput.value
    AppendMessage(`${username}: ${message}`)
    socket.emit('send-chat-message', message)
    msgInput.value = ''
  })

  logout.addEventListener('click', () => {
    socket.emit('logout', username)
    window.location.href = './'
  })
}

socket.on('user-connected', (data) => {
  console.log('New User: ' + data)
  AppendMessage(`${data} が参加しました`)
})

socket.on('user-disconnected', (data) => {
  console.log(data + ' が退出しました')
  AppendMessageFromSender(`${data} が退出しました`)
})

function AppendMessage(message) {
  const msgElem = document.createElement('div')
  msgElem.innerText = message
  msgContainer.append(msgElem)
}

function AppendMessageFromSender(message) {
  const msgElem = document.createElement('div')
  msgElem.classList.add('message')
  msgElem.innerText = message
  msgContainer.append(msgElem)
}
