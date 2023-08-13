const params = new URLSearchParams(window.location.search);
let projectId = params.get('projectId');
let columnId = params.get('columnId');
let boardId = params.get('boardId');

$(document).ready(async () => {
  await getColumns();
  getBoards();
  $('#post-details-modal').modal('hide');
});

const refreshToken = document.cookie.split('=')[1];
const accessToken = localStorage.getItem('accessToken');
const printColumns = document.querySelector('#columns-container');

// 컬럼 조회
async function getColumns() {
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
                      <div class="card-header" data-sequence=${column.sequence} onclick="openUpdateColumnModal(this)" id=${column.id}>${column.name}</div>
                      <div class="card-body" data-column-id="${column.id}">
                      </div>
                        <!-- 보드 카드 추가 될 부분 -->
                      <div class="card-footer">
                          <button type="button" id="add-board-btn" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#scrollingModal">
                          보드 추가
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="deleteColumn(this)" id=${column.id}>컬럼 삭제</button>
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

// 컬럼 이동
async function moveColumnSequence(columnId, newSequence) {
  try {
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
        window.location.reload();
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

// 컬럼 수정 모달 열기
function openUpdateColumnModal(element) {
  const columnNameInput = document.querySelector('#update-columnName-input');
  columnNameInput.value = '';

  const columnId = element.getAttribute('id');

  $('#update-column-modal').modal('show');

  // 업데이트버튼에 id값을 넣고 updateColumn에 넘겨줌
  const updateButton = document.querySelector('#update-column-modal .btn-primary');
  updateButton.setAttribute('id', columnId);
}

// 컬럼명 수정
async function updateColumn() {
  const columnName = document.querySelector('#update-columnName-input').value;
  const updateButton = document.querySelector('#update-column-modal .btn-primary');
  const columnId = updateButton.getAttribute('id');

  try {
    await $.ajax({
      method: 'PATCH',
      url: `projects/${projectId}/columns/${columnId}`,
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
          text: '컬럼 수정 완료',
        }).then(() => {
          window.location.reload();
        });

        $('#update-column-modal').modal('hide');
      },
      error: () => {},
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.responseJSON.message,
    });
  }
}

// 컬럼 삭제
async function deleteColumn(element) {
  const columnId = element.getAttribute('id');

  try {
    await $.ajax({
      method: 'DELETE',
      url: `projects/${projectId}/columns/${columnId}`,
      headers: {
        Accept: 'application/json',
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', accessToken);
      },
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: '컬럼 삭제 완료',
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

// 보드 조회
async function getBoards() {
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
          columnHtml += `<div class="card mb-3" style="border:1px solid ${board.color}; background-color: ${board.color}10;">
                          <div id="boards-container" class="card-body">
                            <h6 class="card-title" data-board-id=${board.id}>${board.title}</h6>
                            <p class="card-text" id=${board.id} onclick="boardDetail(this)"> ${board.content}</p>
                            <p class="card-deadline">${'마감일:' + board.deadlineAt.substring(0, 10).replace('-', '.').replace('-', '.')}</p>
                            <span class="badge bg-primary">${'담당자:' + board.collaborators}</span>
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

// 보드디테일 조회 추가
async function boardDetail(element) {
  const boardId = element.getAttribute('id');
  const modal = document.querySelector('#post-details-modal');

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
        ? (profileImg = `<img src= "${data.user.imageUrl}"/>`)
        : (profileImg = '<img src="/assets/img/apple-touch-icon.png" id="default-img"/>');

      let Img = '';

      data.file ? (Img = `<img src= "${data.file}"/>`) : (Img = '<img src="/assets/img/apple-touch-icon.png" id="default-img"/>');

      modal.querySelector('.modal-title').textContent = data.title;
      modal.querySelector('.profile-img').innerHTML = profileImg;
      modal.querySelector('.profile-name').textContent = data.user.name;
      modal.querySelector('.board-img').innerHTML = Img;
      modal.querySelector('.content').textContent = data.content;
      modal.querySelector('.button-container').innerHTML = `
      <button type="button" class="btn btn-primary" onclick="openEditBoardModal(this)" id=${data.id}>수정</button>
      <button type="button" class="btn btn-secondary" onclick="deleteBoard(this)" id=${data.id}>삭제</button>
      `;
      modal.querySelector('.comment-container').innerHTML = `
      <input type="text" id="comment-input" placeholder="댓글을 입력하세요" />
      <button type="button" class="comment-create-btn" data-bs-dismiss="modal" onclick="createComment(this)" id=${data.id}>작성</button>`;
      $('#post-details-modal').modal('show');
    },
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드 수정 모달
async function openEditBoardModal(element) {
  const boardId = element.getAttribute('id');

  const editModal = document.querySelector('#scrollingEditModal');
  const memberList = editModal.querySelector('#editMemberList');
  const titleInput = editModal.querySelector('#editTitle');
  const contentInput = editModal.querySelector('#editContent');
  const colorInput = editModal.querySelector('#editColor');
  const deadDateInput = editModal.querySelector('#editDeadDate');

  const api = await fetch(`/projects/${projectId}`);
  const result = await api.json();

  result.project.projectMembers.forEach((info) => {
    memberList.innerHTML += `<div class="form-check">
                      <input class="form-check-input" type="checkbox" name="createMembers" value="${info.id}" id="user${info.id}">
                      <label class="form-check-label" for="user${info.id}"> ${info.user.name}</label>
                    </div>`;
  });

  await $.ajax({
    method: 'GET',
    url: `/projects/${projectId}/boards/${boardId}`,
    headers: {
      Accept: 'application/json',
    },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', accessToken);
    },
    success: (data) => {
      titleInput.value = data.title;
      contentInput.value = data.content;
      colorInput.value = data.color;
      deadDateInput.value = data.deadlineAt;

      $('#scrollingEditModal').modal('show');

      // 업데이트버튼에 id값을 넣고 editBoard에 넘겨줌
      const editButton = document.querySelector('#editBoardBtn');
      editButton.setAttribute('id', boardId);
    },
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드 수정
async function editBoard(button) {
  const boardId = button.getAttribute('id');
  const editTitle = document.getElementById('editTitle');
  const editContent = document.getElementById('editContent');
  const editDeadDate = document.getElementById('editDeadDate');
  const editColor = document.getElementById('editColor');
  const editFile = document.getElementById('editFile');

  let formData = new FormData();

  const editMembers = document.getElementsByName('createMembers');
  let memberList = [];
  editMembers.forEach((x) => {
    if (x.checked) {
      memberList.push(x.value);
    }
  });

  formData.append('newFile', editFile.files[0]);
  formData.append('title', editTitle.value);
  formData.append('content', editContent.value);
  formData.append('collaborators', memberList);
  formData.append('color', editColor.value);
  formData.append('deadlineAt', editDeadDate.value);

  try {
    await $.ajax({
      method: 'PATCH',
      url: `/projects/${projectId}/boards/${boardId}`,
      headers: {
        Accept: 'application/json',
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('authorization', accessToken);
      },
      data: formData,
      processData: false,
      contentType: false,
      dataType: 'json',
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: '보드 수정완료!',
        }).then(() => {
          window.location.reload();
        });
      },
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.responseJSON.message,
    });
  }
}

// 보드 삭제
async function deleteBoard(element) {
  const boardId = element.getAttribute('id');

  try {
    await $.ajax({
      method: 'DELETE',
      url: `/projects/${projectId}/boards/${boardId}`,
      headers: {
        Accept: 'application/json',
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', accessToken);
      },
      success: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: '보드 삭제완료!',
        }).then(() => {
          window.location.reload();
        });
      },
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.responseJSON.message,
    });
  }
}

// 보드 동일 컬럼 내 이동
async function orderBoardSequence(boardId, newBoardSequence) {
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
    success: () => {},
    error: (error) => {
      console.error(error);
    },
  });
}

// 보드 다른 컬럼으로 이동
async function moveBoard(boardId, columnId) {
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
    success: () => {},
    error: (error) => {
      console.error(error);
    },
  });
}

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
  // const urlParams = new URL('http://localhost:3000/projects?projectId=18').searchParams;
  // const projectId = urlParams.get('projectId');

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
  // const urlParams = new URL('http://localhost:3000/projects?projectId=18').searchParams;
  // const projectId = urlParams.get('projectId');

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
  formData.append('newFile', createFile.files[0]);

  const api = await fetch(`/projects/${projectId}/boards`, {
    method: 'POST',
    body: formData,
  });

  const result = await api.json();

  if (result.result) {
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: '보드 생성완료!',
    }).then(() => {
      window.location.reload();
    });
  }
});

statusAndMembers();
