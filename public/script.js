const socket = io(location.host);
const msgForm = document.querySelector("#send-container");
const msgInput = document.querySelector("#message-input");
const msgContainer = document.querySelector("#message-container");
const roomContainer = document.querySelector("#room-container");

if (msgForm != null) {
  const name = prompt(`Welcome to now
Enter your name`);
  AppendMessage(`You joined as ${name}`);
  socket.emit("new-user", roomName, name);

  socket.on("chat-message", (data) => {
    console.log(data);
    AppendMessage(`${data.name}: ${data.message}`);
  });

  msgForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = msgInput.value;
    var msg = AppendMessage(`You: ${message}`);
    socket.emit("send-chat-message", roomName, message);
    msgInput.value = "";
  });
}

/*
      <div>
        <p class="room-label"><%= room %></p>
        <a class="btn" href="/<%= room %> "
          >Join <span class="material-icons">chevron_right</span></a
        >
      </div>
*/

socket.on("room-created", (room) => {
  const roomDiv = document.createElement("div");
  roomDiv.innerHTML = ` 
  <div class="room-item">
  <p class="room-label">${room}</p>
  <a class="btn" href="/${room} "
    >Join <span class="material-icons">chevron_right</span></a
  >
  </div>
  `;
  roomContainer.append(roomDiv);
});

socket.on("user-connected", (data) => {
  console.log("New User: " + data);
  AppendMessage(`${data} joined`);
  CreateToast(`${data} joined`);
});

socket.on("user-disconnected", (data) => {
  console.log(data + " left");
  AppendMessageFromSender(`${data} left`);
});

function AppendMessage(message) {
  const msgElem = document.createElement("div");
  msgElem.innerText = message;
  msgContainer.append(msgElem);
}

function AppendMessageFromSender(message) {
  const msgElem = document.createElement("div");
  msgElem.classList.add("message");
  msgElem.innerText = message;
  msgContainer.append(msgElem);
}
