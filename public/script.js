const socket = io(location.host)
const msgForm = document.querySelector('#send-container')
const msgInput = document.querySelector('#message-input')
const msgContainer = document.querySelector('#message-container')
const logout = document.getElementById('logout')

function AppendMessage(message) {
  const msgElem = document.createElement('div')
  const span = document.createElement('span')
  msgElem.classList.add('message')
  msgElem.appendChild(span).innerText = message
  msgContainer.append(msgElem)
  msgContainer.scrollTop = msgContainer.scrollHeight
}

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
  AppendMessage(`${data} が参加しました`)
})

socket.on('user-disconnected', (data) => {
  AppendMessage(`${data} が退出しました`)
})
