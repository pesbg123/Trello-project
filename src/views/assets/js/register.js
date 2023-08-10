const projectName = document.getElementById('projectName');
const projectDesc = document.getElementById('projectDesc');
const backgroundColor = document.getElementById('exampleColorInput');
const registerBtn = document.getElementById('registerBtn');

function projectRegister(event) {
  event.preventDefault();
  const payload = {
    name: projectName.value,
    desc: projectDesc.value,
    backgroundColor: backgroundColor.value,
  };

  $.ajax({
    type: 'POST',
    url: '/projects',
    data: payload,
    success: (data) => {
      console.log(data);
    },
    error: (error) => {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.message,
      });
    },
  });
}

registerBtn.addEventListener('click', projectRegister);
