document.addEventListener('DOMContentLoaded', async () => {
  await getProjects();
  await getChattingRooms();
  await getMyProjects();
});
const projectList = document.getElementById('allProjects');
const projectChattingRoomList = document.getElementById('projectChattingRooms');
const myProjectList = document.getElementById('myProjects');

async function getProjects() {
  await $.ajax({
    method: 'GET',
    url: '/projects',
    success: (data) => {
      const result = data.projects;
      result.forEach((array) => {
        const project = `<li>
                            <a href="/project?projectId=${array.id}"> <i class="bi bi-circle"></i><span>${array.name}</span> </a>
                        </li>`;
        projectList.innerHTML += project;
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
}

async function getChattingRooms() {
  await $.ajax({
    method: 'GET',
    url: '/projects/getProjects/joinProject',
    success: (data) => {
      const result = data.joinProject;
      result.forEach((array) => {
        const chattingRoom = `<li>
                                <a href="/chatRoom?projectId=${array.project_id}"> <i class="bi bi-circle"></i><span>${array.project_name}</span> </a>
                              </li>`;
        projectChattingRoomList.innerHTML += chattingRoom;
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
}

async function getMyProjects() {
  await $.ajax({
    method: 'GET',
    url: '/projects/getProjects/myProject',
    success: (data) => {
      const result = data.myProject;
      result.forEach((array) => {
        const project = `<li>
                              <a href="/myProject?projectId=${array.id}"> <i class="bi bi-circle"></i><span>${array.name}</span> </a>
                        </li>`;
        myProjectList.innerHTML += project;
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
}
