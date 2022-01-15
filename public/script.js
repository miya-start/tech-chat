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
  msgElem.appendChild(span).innerHTML = renderHTML(message)
  msgContainer.append(msgElem)
  containerWrapper.scrollTop = containerWrapper.scrollHeight
}

function appendMyMessage(message) {
  appendMessage(message, 'myself')
}

function appendOthersMessage(message) {
  appendMessage(message, 'other')
}

appendMyMessage(`あなたは ${username} として参加しました`)
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

function renderHTML(message) {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
  const strip = (regex, html) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.innerText.replace(regex, (url) => '\n' + url)
  }

  return strip(urlRegex, message).replace(urlRegex, (url) => {
    if (
      url.indexOf('.jpg') > 0 ||
      url.indexOf('.png') > 0 ||
      url.indexOf('.gif') > 0
    ) {
      return `<img src="${url}"><br/>`
    }

    return `<a class="text-blue-300 visited:text-purple-600 underline" href="${url}" target=_blank rel="noopener">${url}</a><br/>`
  })
}
