const projectName = document.getElementById('projectName');
const projectDesc = document.getElementById('projectDesc');
const backgroundColor = document.getElementById('exampleColorInput');
const registerBtn = document.getElementById('registerBtn');

function projectRegister(event) {
  event.preventDefault();
  const accessToken = localStorage.getItem('accessToken');
  const payload = {
    name: projectName.value,
    desc: projectDesc.value,
    backgroundColor: backgroundColor.value,
  };

  $.ajax({
    type: 'POST',
    url: '/projects',
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
}

registerBtn.addEventListener('click', projectRegister);
