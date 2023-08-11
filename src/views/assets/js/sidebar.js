document.addEventListener('DOMContentLoaded', async () => {
  await getProjects();
  await getMyProjects();
});
const projectList = document.getElementById('allProjects');
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

async function getMyProjects() {
  const accessToken = localStorage.getItem('accessToken');
  await $.ajax({
    method: 'GET',
    url: '/projects/getProjects/myProject',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
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
