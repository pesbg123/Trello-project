function searchParam(key) {
  return new URLSearchParams(location.search).get(key);
}
const projectId = searchParam('projectId');
const accessToken = localStorage.getItem('accessToken');
const sendMailBtn = document.querySelector('#sendMail');
const updateBtn = document.querySelector('#updateBtn');
let deleteBtn;

$(document).ready(async () => {
  await getProjectInfo();
  deleteBtn = document.getElementById('deleteBtn');

  function deleteProject() {
    if (confirm('정말로 해당 프로젝트를 삭제하시겠습니까?')) {
      $.ajax({
        method: 'DELETE',
        url: `/projects/${projectId}`,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-type', 'application/json');
          xhr.setRequestHeader('authorization', accessToken);
        },
        success: (data) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: data.message,
          }).then(() => {
            window.location.href = '/';
          });
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.responseJSON.message,
          });
        },
      });
    } else {
      return;
    }
  }

  deleteBtn.addEventListener('click', deleteProject);
});

async function getProjectInfo() {
  const projectTitle = document.querySelector('#projectTitle');
  const projectDesc = document.querySelector('#projectDesc');
  const projectBody = document.querySelector('#projectBody');
  const projectMember = document.querySelector('#projectMember');
  const projectColor = document.querySelector('#projectColor');

  let projectName = document.querySelector('#projectName');
  const projectDescription = document.querySelector('#projectDescription');
  let backgroundColor = document.getElementById('backgroundColor1');
  await $.ajax({
    method: 'GET',
    url: `/projects/${projectId}`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    success: (data) => {
      const result = data.project;
      const members = data.members;
      members.forEach((member) => {
        projectMember.innerHTML += member.user_email + ' ';
      });
      projectMember.style.marginLeft = '20px';
      projectTitle.innerText = result.name;
      projectDesc.innerText = result.desc;
      projectDesc.style.marginLeft = '20px';
      projectColor.style.backgroundColor = result.background_color;
      projectColor.style.marginLeft = '20px';

      const innerHTML = ` <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#inviteMember">멤버 초대하기</button>
                          <button style="margin-left: 10px;" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#updateProject">수정하기</button>
                          <button style="margin-left: 10px;" class="btn btn-primary" id="deleteBtn" >삭제하기</button>
                        `;
      projectBody.innerHTML += innerHTML;

      projectName.value = result.name;
      projectDescription.innerText = result.desc;
      backgroundColor.value = result.background_color;
    },
    error: (error) => {
      console.log(error);
    },
  });
}

async function inviteUser() {
  const email = document.getElementById('userMail').value;
  const payload = { email };
  let header = {};
  await $.ajax({
    method: 'POST',
    url: `/projects/${projectId}/invitation`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      const { userId, projectName, name } = data;
      header.userId = userId;
      header.userName = name;
      header.projectName = projectName;
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.message,
      });
    },
  });

  socket.emit('inviteUser', header);
}

function updateProject() {
  const name = document.querySelector('#projectName').value;
  const desc = document.querySelector('#projectDescription').value;
  const backgroundColor = document.getElementById('backgroundColor1').value;

  const payload = {
    name,
    desc,
    backgroundColor,
  };

  $.ajax({
    method: 'PATCH',
    url: `/projects/${projectId}`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
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

sendMailBtn.addEventListener('click', inviteUser);
updateBtn.addEventListener('click', updateProject);
