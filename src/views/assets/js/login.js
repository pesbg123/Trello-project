const email = document.getElementById('yourEmail');
const password = document.getElementById('yourPassword');
const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  if (!email.value) return alert('이메일을 입력해 주세요.');
  if (!password.value) return alert('패스워드를 입력해 주세요.');

  if (!/^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email.value)) return alert('이메일 형식이 일치하지 않습니다.');
  if (!/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/.test(password.value))
    return alert('패스워드는 영문, 숫자, 특수문자를 최소 1가지 이상 조합해야 합니다.');

  const api = await fetch(`/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new loginData()),
  });

  const result = await api.json();

  if (result.result) {
    window.location.href = '/';
  } else {
    alert(result.message);
  }
});

class loginData {
  constructor() {
    this.email = email.value;
    this.password = password.value;
  }
}
