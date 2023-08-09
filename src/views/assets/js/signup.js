const email = document.getElementById('yourEmail');
const name = document.getElementById('yourName');
const password = document.getElementById('yourPassword');
const confirmPassword = document.getElementById('yourConfirmPassword');
const image = document.getElementById('yourImage');
const createBtn = document.getElementById('createBtn');

createBtn.addEventListener('click', async () => {
  if (!email.value) return alert('이메일을 입력해 주세요.');
  if (!name.value) return alert('이름을 입력해 주세요.');
  if (!password.value) return alert('패스워드를 입력해 주세요.');
  if (!confirmPassword.value) return alert('확인 패스워드를 입력해 주세요.');

  if (email.value.length > 40) return alert('이메일은 최대 40자 미만으로 입력해 주세요.');
  if (name.value.length > 20) return alert('이름은 최대 20자 미만으로 입력해 주세요.');
  if (password.value.length < 8 || password.value.length > 20) return alert('패스워드는 최소 8자 최대 20자 이내로 입력해 주세요.');

  if (!/^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email.value)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/.test(password.value))
    return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');

  if (password.value !== confirmPassword.value) return alert('패스워드와 확인 패스워드가 일치하지 않습니다.');

  let formData = new FormData();
  formData.append('email', email.value);
  formData.append('name', name.value);
  formData.append('password', password.value);
  formData.append('confirmPassword', confirmPassword.value);
  formData.append('newFile', image.files[0]);

  const api = await fetch('/users/signup', {
    method: 'POST',
    body: formData,
  });
  const { result } = await api.json();

  if (result) {
    alert('회원가입이 완료되었습니다.');
    window.location.href = '/login';
  } else {
    alert('잘못된 요청으로 인해 오류가 발생하였습니다.');
  }
});
