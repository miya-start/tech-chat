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

msgForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const message = msgInput.value
  appendMyMessage(message)
  // TODO6: サーバーにイベントを送る。イベントだけでなく、チャットのメッセージも送る
  // socket.???('send-chat-message', message)
  msgInput.value = ''
})

// TODO1: 自分のブラウザにメッセージを表示する
// appendMyMessage('TECHチャットに参加しました。')

// TODO2: サーバーにイベントを送る
// socket.emit('new-user')

// TODO5: サーバーからイベントを受け取る。
// socket.on('???', () => {
//   appendOthersMessage('新たなユーザーが参加しました')
// })
//
// TODO9: サーバーからイベントを受け取る。イベントだけでなく、チャットメッセージも受け取る
// socket.on('???', (data) => {
//   console.log(data.message)
// })
//
// TODO10: ブラウザに、サーバーから受け取ったチャットメッセージを表示する
// ???(data.message)
