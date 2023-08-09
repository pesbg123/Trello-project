const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
  const api = await fetch('/users/logout', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('accessToken'),
    },
    body: JSON.stringify({ refreshToken: document.cookie.split('=')[1] }),
  });
  const { result } = await api.json();

  if (result) {
    localStorage.removeItem('accessToken');
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.reload();
  }
});
