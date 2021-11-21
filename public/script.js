const socket = io(location.host)
const msgForm = document.querySelector('#send-container')
const msgInput = document.querySelector('#message-input')
const msgContainer = document.querySelector('#message-container')
const containerWrapper = document.querySelector('#container-wrapper')
const logout = document.getElementById('logout')

function appendMessage(message, userType) {
  const msgElem = document.createElement('div')
  const span = document.createElement('span')
  msgElem.classList.add('max-w-lg')
  if (userType === 'myself') {
    msgElem.classList.add('place-self-end')
  } else if (userType === 'other') {
    msgElem.classList.add('place-self-start')
  }
  msgElem.appendChild(span).innerText = message
  msgContainer.append(msgElem)
  containerWrapper.scrollTop = containerWrapper.scrollHeight
}

function appendMyMessage(message) {
  appendMessage(message, 'myself')
}

function appendOthersMessage(message) {
  appendMessage(message, 'other')
}

appendMyMessage(`あなたは ${username} として参加しました。`)
socket.emit('new-user', username)

socket.on('chat-message', (data) => {
  appendOthersMessage(`${data.name}: ${data.message}`)
})

msgForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const message = msgInput.value
  appendMyMessage(`${message}`)
  socket.emit('send-chat-message', message)
  msgInput.value = ''
})

logout.addEventListener('click', () => {
  socket.emit('logout', username)
  window.location.href = './'
})

socket.on('user-connected', (data) => {
  appendOthersMessage(`${data} が参加しました`)
})

socket.on('user-disconnected', (data) => {
  if (username === data) return
  appendOthersMessage(`${data} が退出しました`)
})
