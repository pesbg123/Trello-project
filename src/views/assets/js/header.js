const logoutBtn = document.getElementById('logoutBtn');
$(document).ready(async () => {
  getAlarmList();
  await getMyProjectMessage();
});

logoutBtn.addEventListener('click', async () => {
  const api = await fetch('/users/logout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { result } = await api.json();

  if (result) {
    window.localStorage.clear();
    window.location.href = '/';
  }
});

function getAlarmList() {
  if (localStorage.getItem('alarmList')) {
    const alarmList = document.getElementById('alarmList');
    const alarmCount = document.getElementById('alarmCount');

    let list = localStorage.getItem('alarmList').split(',');
    const count = localStorage.getItem('alarmCount');
    list.forEach((list) => {
      alarmList.innerHTML += list;
    });
    alarmCount.innerHTML = count;
  }
}

async function getMyProjectMessage() {
  const messageList = document.getElementById('recentMessageList');
  const recentMessageContainer = document.getElementById('recent-message-container');

  let room = [];
  let name;

  await $.ajax({
    method: 'GET',
    url: '/projects/getProjects/joinProject',
    success: (data) => {
      const result = data.joinProject;
      name = data.userName;
      result.forEach((array) => {
        if (localStorage.getItem(`recentMessageroom${array.project_id}`)) {
          const recentMessage = localStorage.getItem(`recentMessageroom${array.project_id}`);
          const messageHtml = ` <li>
                              <hr class="dropdown-divider" />
                              </li>
                              
                                <li class="message-item">
                                <a href="/chatRoom?projectId=${array.project_id}">
                                <div>
                                  <h4>${array.project_name}</h4>
                                  ${recentMessage}
                                </div>
                                </a>
                            </li>`;
          messageList.innerHTML += messageHtml;
        }

        room.push(array.project_id);
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
  recentMessageContainer.scrollTop = recentMessageContainer.scrollHeight;
  joinRoom(room, name);
}

function joinRoom(rooms, name) {
  rooms.forEach((roomId) => {
    socket.emit('join', { room: 'room' + roomId, name });
  });
}
