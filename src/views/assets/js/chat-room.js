function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}
const projectId = searchParam('projectId');
const roomNumber = `room${projectId}`;

$(document).ready(async () => {
  await getChatRoomInfo();
  await getChatMessageInfo();
  const sendBtn = document.getElementById('sendBtn');
  const inputMessage = document.getElementById(`room${projectId}-messageInput`);

  sendBtn.addEventListener('click', sendRoomMessage);
  inputMessage.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      sendRoomMessage('room1');
    }
  });
});

async function getChatRoomInfo() {
  const chatRoom = document.getElementById('chatRoom');

  await $.ajax({
    method: 'GET',
    url: `/projects/${projectId}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
    },
    success: (data) => {
      const project = data.project;
      const myName = data.name;
      const chatRoomHtml = `
                        <h3 class="chatRoom-title">Project : ${project.name}</h3>
                        <p>내 이름 : <span id="myName">${myName}</span></p>
                        <div class="room" id="room${project.id}">
                          <div class="users" id="room${project.id}Users"></div>
                          <p style="margin-top:20px; font-size:20px; font-weight:bold; color:#5173e0"><채팅 창><p>
                          <div class="chat-container" id="room${project.id}-chat-container">
                            <ul class="chat-list" id="room${project.id}-chat-list"></ul>
                          </div>
                          <div class="chat-input">
                            <input type="text" id="room${project.id}-messageInput" placeholder="메시지를 입력해주세요." />
                            <button id="sendBtn">보내기</button>
                          </div>
                        </div>`;
      chatRoom.innerHTML = chatRoomHtml;
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.message,
      });
    },
  });
}

async function getChatMessageInfo() {
  if (localStorage.getItem(roomNumber)) {
    const chatList = document.getElementById(`${roomNumber}-chat-list`);
    const roomChatContainer = document.getElementById(`${roomNumber}-chat-container`);

    let list = localStorage.getItem(roomNumber).split(',');
    list.forEach((list) => {
      chatList.innerHTML += list;
    });

    // 스크롤 아래로 이동
    roomChatContainer.scrollTop = roomChatContainer.scrollHeight;
  }
}

function sendRoomMessage() {
  const inputMessage = document.getElementById(`room${projectId}-messageInput`);
  const message = inputMessage.value;

  if (message.trim() !== '') {
    socket.emit('chatMessage', { message, room: roomNumber });
    inputMessage.value = '';
  }
}

function appendMessage(room, userId, message) {
  if (room !== roomNumber) {
    return;
  }
  const chatList = document.getElementById(`${room}-chat-list`);
  const roomChatContainer = document.getElementById(`${room}-chat-container`);
  const messageHtml = `
                        <li class="chat-item">
                          <p>${userId} : ${message}</p>
                        </li>
                      `;
  chatList.innerHTML += messageHtml;

  let localStorageList = [];
  if (localStorage.getItem(roomNumber)) {
    localStorageList.push(localStorage.getItem(roomNumber));
  }
  localStorageList.push(messageHtml);
  localStorage.setItem(roomNumber, localStorageList);
  localStorage.setItem(`recentMessage${roomNumber}`, `<p>${userId} : ${message}</p>`);

  // 스크롤 아래로 이동
  roomChatContainer.scrollTop = roomChatContainer.scrollHeight;
  socket.emit('newMessage', { room: roomNumber, message: `<p>${userId} : ${message}</p>`, userName: userId });
}

socket.on('userList', ({ room, userList }) => {
  if (!room) return;
  if (room !== roomNumber) {
    return;
  }
  const roomUsers = document.getElementById(`room${projectId}Users`);
  if (!roomUsers) {
    window.location.reload();
  }
  roomUsers.innerHTML = '접속 중인 유저 : ';

  userList.forEach((userId) => {
    roomUsers.innerHTML += ' ' + userId;
  });
});

socket.on('chatMessage', ({ userId, message, room }) => {
  appendMessage(room, userId, message);
});
