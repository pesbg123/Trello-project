const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  const api = await fetch('/users/logout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { result } = await api.json();
  console.log(result);

  if (result) {
    window.location.href = '/';
  }
});
