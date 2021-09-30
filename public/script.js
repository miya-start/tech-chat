const socket = io(location.host)
const msgForm = document.querySelector('#send-container')
const msgInput = document.querySelector('#message-input')
const msgContainer = document.querySelector('#message-container')
const roomContainer = document.querySelector('#room-container')

if (msgForm != null) {
  const name = prompt(`名前を入力してください`)
  AppendMessage(`あなたは ${name} として参加しました。`)
  socket.emit('new-user', roomName, name)

  socket.on('chat-message', (data) => {
    console.log(data)
    AppendMessage(`${data.name}: ${data.message}`)
  })

  msgForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const message = msgInput.value
    AppendMessage(`あなた: ${message}`)
    socket.emit('send-chat-message', roomName, message)
    msgInput.value = ''
  })
}

/*
      <div>
        <p class="room-label"><%= room %></p>
        <a class="btn" href="/<%= room %> "
          >Join <span class="material-icons">chevron_right</span></a
        >
      </div>
*/

socket.on('room-created', (room) => {
  const roomDiv = document.createElement('div')
  roomDiv.innerHTML = `
  <div class="room-item">
  <p class="room-label">${room}</p>
  <a class="btn" href="/${room} "
    >参加する <span class="material-icons">chevron_right</span></a
  >
  </div>
  `
  roomContainer.append(roomDiv)
})

socket.on('user-connected', (data) => {
  console.log('New User: ' + data)
  AppendMessage(`${data} が参加しました`)
  CreateToast(`${data} が参加しました`)
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
