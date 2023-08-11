document.addEventListener('DOMContentLoaded', async () => {
  await getProjects();
});
const projectList = document.getElementById('allProjects');

async function getProjects() {
  $.ajax({
    method: 'GET',
    url: '/projects',
    success: (data) => {
      const result = data.projects;
      result.forEach((array) => {
        const project = `<li>
                            <a href="/projects?projectId=${array.id}"> <i class="bi bi-circle"></i><span>${array.name}</span> </a>
                        </li>`;
        projectList.innerHTML += project;
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
}
