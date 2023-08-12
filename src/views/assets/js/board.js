const params = new URLSearchParams(window.location.search);
let projectId = params.get('projectId');
let columnId = params.get('columnId');
let boardId = params.get('boardId');
const commentContainer = document.querySelector('#count-comments-container');

$(document).ready(async () => {
  await getColumns();
  getBoards();
});

// 댓글 수
let countComments = 0;
const refreshToken = document.cookie.split('=')[1];
const accessToken = localStorage.getItem('accessToken');
const printColumns = document.querySelector('#columns-container');

// 컬럼 조회
async function getColumns() {
  const projectId = 11; // 임시

  await $.ajax({
    method: 'GET',
    url: `/projects/${projectId}/columns`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    success: (data) => {
      let result = '';
      data.forEach((column) => {
        result += `<div class="col-lg-4">
                    <div class="card">
                      <div class="card-header" data-sequence=${column.sequence}>${column.name}</div>
                      <div class="card-body" data-column-id="${column.id}">
                      </div>
                        <!-- 보드 카드 추가 될 부분 -->
                      <div class="card-footer">
                          <button type="button" id="add-board-btn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#scrollingModal">
                          보드 추가
                        </button>
                      </div>
                    </div>
                  </div>`;
      });
      printColumns.innerHTML = result;

      $('#columns-container').sortable({
        handle: '.card-header',
        opacity: 0.5,
        update: function (event, ui) {
          const targetColumn = ui.item;
          const columnId = targetColumn.find('.card-body').attr('data-column-id');
          // 엘리먼트 순서가 0부터시작하므로 +1하여 DB와 동기화
          const newSequence = targetColumn.index() + 1;

          moveColumnSequence(columnId, newSequence);
        },
      });
    },
    error: (error) => {
      console.error(error);
    },
  });
}

async function moveColumnSequence(columnId, newSequence) {
  try {
    const projectId = 11; // 프로젝트 ID

    await $.ajax({
      method: 'PATCH',
      url: `/projects/${projectId}/columns/${columnId}/order`,
      headers: {
        Accept: 'application/json',
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', accessToken);
      },
      data: JSON.stringify({ newSequence }),
      success: function (data) {
        // window.location.reload();
      },
      error: function (error) {
        console.error('컬럼 순서 변경 에러:', error);
        // window.location.reload();
      },
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.responseJSON.message,
    });
  }
}

// 컬럼 생성
async function createColumn() {
  const columnName = document.querySelector('#columnName-input').value;
  const projectId = 11;
  try {
    await $.ajax({
      method: 'POST',
      url: `/projects/${projectId}/columns`,
      headers: {
        Accept: 'application/json',
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', accessToken);
      },
      data: JSON.stringify({ columnName }),
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: '컬럼 생성 완료',
        }).then(() => {
          window.location.reload();
        });
      },
      error: () => {},
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.responseJSON.message,
    });
  }
}

// 컬럼명 수정 추가

// 컬럼 삭제 추가

// 보드 조회
async function getBoards() {
  const projectId = 11; // 임시

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
    success: (data) => {
      const columns = {};

      // 컬럼 아이디별로 보드를 묶어줌
      data.forEach((board) => {
        const columnId = board.boardColumn.id;

        // 컬럼객체에 컬럼아이디가 없으면 추가
        if (!columns[columnId]) {
          columns[columnId] = [];
        }

        // 컬럼아이디가 있는경우 해당배열에 보드를 추가
        columns[columnId].push(board);
      });

      for (const columnId in columns) {
        const column = columns[columnId];
        let columnHtml = '';

        column.forEach((board) => {
          columnHtml += `<div class="card mb-3">
                          <div id="boards-container" class="card-body">
                            <h6 class="card-title" data-board-id=${board.id}>${board.title}</h6>
                            <p class="card-text" id=${board.id} onclick="boardDetail(this)" style="cursor: pointer;"> ${board.content}</p>
                            <p class="card-deadline">${board.deadlineAt}</p>
                            <div class="d-flex justify-content-between">
                           </div>
                          </div>
                        </div>`;
        });

        // 컬럼 아래에 보드 카드 추가
        const columnElement = document.querySelector(`[data-column-id="${columnId}"]`);

        if (columnElement) {
          columnElement.innerHTML = columnHtml;

          $(columnElement).sortable({
            handle: '.card-title',
            connectWith: `.card-body[data-column-id]`,
            opacity: 0.5,
            update: function (event, ui) {
              const targetBoard = ui.item;
              const boardId = targetBoard.find('.card-title').attr('data-board-id');
              const columnId = targetBoard.closest('.card-body').attr('data-column-id');
              // 엘리먼트 순서가 0부터시작하므로 +1하여 DB와 동기화
              const newBoardSequence = targetBoard.index() + 1;

              orderBoardSequence(boardId, newBoardSequence);
              moveBoard(boardId, columnId);
            },
          });
        }
      }
      // 빈 컬럼에 보드 이동을 허용하기 위한 설정
      $('.card-body').sortable({
        handle: '.card-title',
        connectWith: `.card-body[data-column-id]`,
        opacity: 0.5,
        update: function (event, ui) {
          const targetBoard = ui.item;
          const boardId = targetBoard.find('.card-title').attr('data-board-id');
          const newColumnId = targetBoard.closest('.card-body').attr('data-column-id');
          const newBoardSequence = targetBoard.index() + 1;

          orderBoardSequence(boardId, newBoardSequence);
          moveBoard(boardId, newColumnId); // 보드를 새로운 컬럼으로 이동
        },
      });
    },
    error: (error) => {
      console.error(error);
    },
  });
}

function getDaysAgoFromNow(dateString) {
  const givenDate = new Date(dateString);
  const currentDate = new Date(); // 현재 시간
  const oneDay = 24 * 60 * 60 * 1000; // 하루의 밀리초

  // 날짜만 비교하도록 설정
  givenDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // 날짜를 비교하여 날짜 차이 계산
  const timeDifference = currentDate - givenDate;
  const daysAgo = Math.floor(timeDifference / oneDay);

  if (daysAgo === 0) {
    return '오늘';
  } else if (daysAgo === 1) {
    return '어제';
  } else if (daysAgo > 1 && daysAgo < 7) {
    return `${daysAgo}일 전`;
  } else {
    // 7일 이상 차이나면 날짜 형식으로 반환
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return givenDate.toLocaleDateString('ko-KR', options);
  }
}

// 보드디테일 조회 추가
async function boardDetail(element) {
  const boardId = element.getAttribute('id');
  const modal = document.querySelector('#post-details-modal');

  const projectId = 11; // 임시

  modal.querySelector('.comments-container').innerHTML = '';
  await $.ajax({
    method: 'GET',
    url: `projects/${projectId}/boards/${boardId}`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    success: (data) => {
      let profileImg = '';
      data.user.imageUrl
        ? (profileImg = data.user.imageUrl)
        : (profileImg = '<img src="/src/views/assets/img/apple-touch-icon.png" id="default-img"/>');

      let Img = '';

      data.file ? (Img = data.file) : (Img = '<img src="/src/views/assets/img/apple-touch-icon.png" id="default-img"/>');

      modal.querySelector('.modal-title').textContent = data.title;
      modal.querySelector('.profile-img').innerHTML = ` <img src="${profileImg}">`;
      modal.querySelector('.profile-name').textContent = data.user.name;
      modal.querySelector('.board-img').innerHTML = Img;
      modal.querySelector('.content').textContent = data.content;
      modal.querySelector('.input-group').innerHTML = `<div>
      <input id="comment-input" type="text" class="form-control" placeholder="댓글을 입력해주세요.">
      <button id="comment-create-btn" data-id="${boardId}"  class="btn btn-primary">작성</button>
    </div>`;

      const cbtn = document.getElementById('comment-create-btn');

      // 댓글 작성 버튼 온클릭
      cbtn.addEventListener('click', () => {
        const commentInput = document.querySelector('#comment-input').value;
        if (!commentInput) {
          alert('댓글을 입력해주세요.');
          return;
        }
        createComment(cbtn, commentInput);
      });

      // 댓글 저장 함수
      async function createComment(element, content, reply) {
        const boardId = element.getAttribute('data-id'); // boardId 추출
        let replyId = '';
        if (reply) {
          replyId = reply;
        } else {
          replyId = null;
        }
        const req = {
          replyId,
          content,
        };
        // 제이쿼리 AJAX POST메서드를 사용해서 POST요청
        await $.post(
          `/projects/${projectId}/boards/${boardId}/comments`,
          req, // 서버가 필요한 정보를 같이 보냄.
          (data, status) => {
            console.log(data, status);
            if (status === 'success') {
              alert(data.message);
              location.reload();
              $('#post-details-modal').modal('show');
            } else {
              alert('댓글 저장 실패');
            }
          },
        );
      }

      const arrData = [data];
      arrData.forEach((item) => {
        countComments = item.comments.length;
      });

      commentContainer.innerHTML = `<div>
                                      <h5 class="count-comments">댓글 수 (${countComments})</h5>
                                      </div>`;
      data.comments.forEach((item) => {
        const daysAgoStr = getDaysAgoFromNow(item.createdAt);
        let username = '';
        // arrData.
        // console.log(datauser);
        let tempHtml = ` <div class="row  d-flex justify-content-center" style="margin-top: 0.8rem;">
                            <div class="col-md-10">
                              <!-- 댓글 하나  -->
                              <div class="card p-3 mt-2">
                                <div class="d-flex justify-content-between align-items-center">
                                  <div class="user d-flex flex-row align-items-center">
                                    <img src=""
                                      width="40" class="user-img rounded-circle mr-2">
                                    <span class="comment-name">
                                    <p class="font-weight-bold text-primary"style="margin-left: 1rem; font-size: 1rem;">${username}</p>
                                    </span>
                                  </div>
                                  <small>${daysAgoStr}</small>
                                </div>
                                <div class="comment-txt">
                                  <p>${item.content}</p>
                                </div>

                                <div class="action d-flex justify-content-between mt-2 align-items-center">
                                  <div class="reply px-4">
                                    <small data-comment-id=${item.id}>답글</small>
                                    <span class="dots"></span>
                                    <small data-comment-id=${item.id}>수정</small>
                                    <span class="dots"></span>
                                    <small data-comment-id=${item.id}>삭제</small>
                                  </div>
                                  <div class="icons align-items-center">
                                    <i class="fa fa-check-circle-o check-icon text-primary"></i>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>`;
        $('.comments-container').append(tempHtml);
      });
      $('#post-details-modal').modal('show');
    },
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드 수정
async function editBoard(boardId) {
  const projectId = 11;

  const formData = new FormData();
  const title = await $.ajax({
    method: '',
  });
}
// 보드 삭제

// 보드 동일 컬럼 내 이동
async function orderBoardSequence(boardId, newBoardSequence) {
  const projectId = 11; // 임시

  await $.ajax({
    method: 'PATCH',
    url: `/projects/${projectId}/boards/${boardId}/order`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    data: JSON.stringify({ newBoardSequence }),
    success: (data) => {},
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드 다른 컬럼으로 이동
async function moveBoard(boardId, columnId) {
  const projectId = 11; // 임시

  await $.ajax({
    method: 'PATCH',
    url: `/projects/${projectId}/boards/${boardId}/${columnId}/move`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    success: (data) => {},
    error: (error) => {
      console.error(error);
    },
  });
}

// 파일다운로드 테스트필요

/** GET DATA */
const createStatus = document.getElementById('createStatus');
const createMemberList = document.getElementById('createMemberList');

/** DATA */
const createTitle = document.getElementById('createTitle');
const createContent = document.getElementById('createContent');
const createDeadDate = document.getElementById('createDeadDate');
const createColor = document.getElementById('createColor');
const createFile = document.getElementById('createFile');
const createMembers = document.getElementsByName('createMembers');
const createBoardBtn = document.getElementById('createBoardBtn');

const statusAndMembers = async () => {
  // const searchParams = new URL(location.href).searchParams;
  const urlParams = new URL('http://localhost:3000/projects?projectId=15').searchParams;
  const projectId = urlParams.get('projectId');

  const api = await fetch(`/projects/${projectId}`);
  const result = await api.json();

  result.project.boardColumns.forEach((info) => {
    createStatus.innerHTML += `<option value="${info.id}">${info.name}</option>`;
  });

  result.project.projectMembers.forEach((info) => {
    createMemberList.innerHTML += `<div class="form-check">
                      <input class="form-check-input" type="checkbox" name="createMembers" value="${info.id}" id="user${info.id}">
                      <label class="form-check-label" for="user${info.id}"> ${info.user.name}</label>
                    </div>`;
  });
};

createBoardBtn.addEventListener('click', async () => {
  // const searchParams = new URL(location.href).searchParams;
  const urlParams = new URL('http://localhost:3000/projects?projectId=15').searchParams;
  const projectId = urlParams.get('projectId');

  let memberList = [];
  createMembers.forEach((x) => {
    if (x.checked) {
      memberList.push(x.value);
    }
  });

  if (memberList.length == 0) return alert('참여자를 선택해 주세요.');
  if (!createStatus.value) return alert('구분을 선택해 주세요.');
  if (!createTitle.value) return alert('제목을 입력해 주세요.');
  if (!createContent.value) return alert('내용을 입력해 주세요');
  if (!createDeadDate.value) return alert('마감일을 설정해 주세요.');
  if (!createColor.value) return alert('색상을 선택해 주세요.');

  let formData = new FormData();
  formData.append('columnId', createStatus.value);
  formData.append('title', createTitle.value);
  formData.append('content', createContent.value);
  formData.append('collaborators', memberList);
  formData.append('color', createColor.value);
  formData.append('deadlineAt', createDeadDate.value);
  formData.append('newFile', createFile.file);

  const api = await fetch(`/projects/${projectId}/boards`, {
    method: 'POST',
    body: formData,
  });

  const result = await api.json();

  if (result.result) {
    alert('보드가 생성되었습니다.');
    window.location.hr;
  }
});

statusAndMembers();
