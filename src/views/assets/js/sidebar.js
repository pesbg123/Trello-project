document.addEventListener('DOMContentLoaded', async () => {
  await getProjects();
});
const projects = document.getElementById('allProjects');
{
  /* <ul id="projects-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav" >
</ul> */
}
async function getProjects() {
  console.log(projects);
  $.ajax({
    method: 'GET',
    url: '/projects',
    success: (data) => {
      const result = data.projects;

      result.forEach((projectList) => {
        const project = `<li>
                            <a href="/project"> <i class="bi bi-circle"></i><span>${projectList.name}</span> </a>
                        </li>`;
      });
    },
    error: (error) => {
      console.log(error);
    },
  });
}
