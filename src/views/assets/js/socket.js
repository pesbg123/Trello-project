const socket = io.connect('/');

function projectInviteToUser(userName, projecName, date) {
  const alarmList = document.getElementById('alarmList');
  let alarmCount = document.getElementById('alarmCount');

  let localStorageList = [];
  if (localStorage.getItem('alarmList')) {
    localStorageList.push(localStorage.getItem('alarmList'));
  }
  const messageHtml = `
                        <li>
                          <hr class="dropdown-divider" />
                        </li>

                        <li class="notification-item">
                          <i class="bi bi-check-circle text-success"></i>
                          <div>
                            <h4>${projecName} 프로젝트 초대 알림</h4>
                            <p>${userName}님이 ${projecName} 프로젝트에 초대하셨습니다. 이메일을 확인해 주세요.</p>
                            <p>${date}</p>
                          </div>
                        </li>
                      `;
  alarmList.innerHTML += messageHtml;
  alarmCount.innerHTML = Number($('#alarmCount').text()) + 1;
  localStorageList.push(messageHtml);
  localStorage.setItem('alarmCount', Number($('#alarmCount').text()));
  localStorage.setItem('alarmList', localStorageList);
}

function updateRoomMessage(room, message, date) {
  let localStorageList = [];
  const existSave = localStorage.getItem(`existSave${room}`);
  const dateNow = date.split('.')[0];
  if (!existSave) {
    const messageHtml = `
                      <li class="chat-item">
                        ${message}
                      </li>`;
    if (localStorage.getItem(room)) {
      localStorageList.push(localStorage.getItem(room));
    }
    localStorageList.push(messageHtml);
    localStorage.setItem(room, localStorageList);
    localStorage.setItem(`existSave${room}`, message + ',' + dateNow);
  } else {
    if (existSave.split(',')[0] === message && existSave.split(',')[1] === dateNow) return false;
    const messageHtml = `
                        <li class="chat-item">
                          ${message}
                        </li>`;
    if (localStorage.getItem(room)) {
      localStorageList.push(localStorage.getItem(room));
    }
    localStorageList.push(messageHtml);
    localStorage.setItem(room, localStorageList);
    localStorage.setItem(`existSave${room}`, message + ',' + dateNow);
    localStorage.setItem(`recentMessage${room}`, message);
  }
}

async function announceMessage(room, message) {
  const messageList = document.getElementById('recentMessageList');
  let recentMessageCount = document.getElementById('recentMessageCount');
  const projectId = room.split('room')[1];
  await $.ajax({
    method: 'GET',
    url: `projects/${projectId}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
    },
    success: (data) => {
      const project = data.project;
      const messageHtml = ` <li>
                              <hr class="dropdown-divider" />
                              </li>

                                <li class="message-item">
                                <a href="/chatRoom?projectId=${project.id}">
                                <div>
                                  <h4>${project.name}</h4>
                                  <p>${message}</p>
                                </div>
                                </a>
                            </li>`;
      messageList.innerHTML += messageHtml;
      recentMessageCount.innerHTML = Number($('#recentMessageCount').text()) + 1;
    },
    error: (error) => {
      console.log(error);
    },
  });
}

socket.on('projectUser', (payload) => {
  const { userName, projectName } = payload.data;
  let { date } = payload.data;
  date = date.replace('T', ' ').split('.')[0];
  projectInviteToUser(userName, projectName, date);
});

socket.on('newMessage', ({ userId, message, room, date }) => {
  if (document.getElementById(`${room}-chat-container`)) return;

  const result = updateRoomMessage(room, message, date);
  if (result === false) return;
  announceMessage(room, message, userId, date);
});
