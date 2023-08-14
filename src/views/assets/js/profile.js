const mainName = document.getElementById('mainName');
const mainEmail = document.getElementById('mainEmail');
const mainImage = document.getElementById('mainImage');

const infoName = document.getElementById('infoName');
const infoEmail = document.getElementById('infoEmail');

const editName = document.getElementById('editName');
const editImage = document.getElementById('editImage');
const editProfileImage = document.getElementById('editProfileImage');
const editBtn = document.getElementById('editBtn');

const editCurrentPassword = document.getElementById('editCurrentPassword');
const editNewPassword = document.getElementById('editNewPassword');
const editNewConfirmPassword = document.getElementById('editNewConfirmPassword');
const passowrdEditBtn = document.getElementById('passowrdEditBtn');

const removePassword = document.getElementById('removePassword');
const removeUserBtn = document.getElementById('removeUserBtn');

removeUserBtn.addEventListener('click', async () => {
  if (!removePassword.value) return alert('패스워드를 입력해 주세요.');
  if (removePassword.value.length < 8 || removePassword.value.length > 20) return alert('신규 패스워드는 최소 8자 최대 20자 이내로 입력해 주세요.');
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/.test(removePassword.value))
    return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');

  const api = await fetch('/users', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password: removePassword.value }),
  });

  const result = await api.json();

  if (result.result) {
    window.localStorage.clear();
    alert('회원 탈퇴가 완료되었습니다.');
    return (window.location.href = '/');
  }

  alert(result.message);
});

passowrdEditBtn.addEventListener('click', async () => {
  if (!editCurrentPassword.value) return alert('현재 패스워드를 입력해 주세요.');
  if (!editNewPassword.value) return alert('신규 패스워드를 입력해 주세요.');
  if (!editNewConfirmPassword.value) return alert('신규 확인 패스워드를 입력해 주세요.');
  if (editNewConfirmPassword.value !== editNewPassword.value) return alert('신규 패스워드와 신규 확인 패스워드가 일치하지 않습니다.');
  if (editNewPassword.value.length < 8 || editNewPassword.value.length > 20) return alert('신규 패스워드는 최소 8자 최대 20자 이내로 입력해 주세요.');
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/.test(editNewPassword.value))
    return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');

  console.log(new EditPassword());
  const api = await fetch('/users/password', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new EditPassword()),
  });

  const { status } = await api;
  const result = await api.json();
  if (status !== 200) return alert(result.message);
  if (result.result) {
    alert('패스워드 변경이 완료되었습니다.\n보안정책상 재 로그인이 필요합니다.');
    window.location.href = '/login';
  }
});

editBtn.addEventListener('click', async () => {
  if (!editName.value) return alert('이름을 입력해 주세요.');
  let formData = new FormData();
  formData.append('name', editName.value);
  formData.append('newFile', editProfileImage.files[0]);

  const api = await fetch('/users', {
    method: 'PATCH',
    body: formData,
  });

  const { result } = await api.json();

  if (result) {
    alert('프로필 수정이 완료되었습니다.');
    window.location.reload();
  }
});

const getProfile = async () => {
  const api = await fetch('/users');
  const result = await api.json();

  mainName.innerText = result.name;
  mainEmail.innerText = result.email;
  mainImage.setAttribute('src', result.imageUrl);

  infoName.innerText = result.name;
  infoEmail.innerText = result.email;

  editName.value = result.name;
  editImage.setAttribute('src', result.imageUrl);
};

class EditPassword {
  constructor() {
    this.oldPassword = editCurrentPassword.value;
    this.newPassword = editNewPassword.value;
  }
}

getProfile();
