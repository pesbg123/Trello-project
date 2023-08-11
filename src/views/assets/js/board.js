const params = new URLSearchParams(window.location.search);
let projectId = params.get('projectId');
let columnId = params.get('columnId');
let boardId = params.get('boardId');

$(document).ready(async () => {
  await getColumns();
  getBoards();
});

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
                        <!-- 보드 카드 추가 될 부분 -->
                      </div>
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
                            <p class="card-text">${board.content}</p>
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
        }
      }

      $('#boards-container').sortable({
        handle: '.card-title',
        update: function (event, ui) {
          const targetBoard = ui.item;
          const boardId = targetBoard.find('.card-title').attr('data-board-id');
          // 엘리먼트 순서가 0부터시작하므로 +1하여 DB와 동기화
          const newBoardSequence = targetBoard.index() + 1;

          orderBoardSequence(boardId, newBoardSequence);
        },
      });
    },
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드디테일 조회 추가

// 보드 생성
async function createBoard() {}

// 보드 수정

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
async function moveBoard() {
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

  console.log(result);
};

statusAndMembers();
