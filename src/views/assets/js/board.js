$(document).ready(async () => {
  getBoards();
});
/* 리프레시토큰을 쿠키로 받아오고 엑세스토큰은 헤더로*/

const refreshToken = document.cookie.split('=')[1];
const accessToken = localStorage.getItem('accessToken');

// 컬럼 생성
async function createColumn(column) {}

// 보드 조회
async function getBoards() {
  const payload = {
    refreshToken,
  };

  const projectId = 2; // 임시

  await $.ajax({
    method: 'GET',
    url: `/projects/${projectId}/boards`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      console.log(data);
    },
    error: (error) => {
      console.error(error);
    },
  });
}
