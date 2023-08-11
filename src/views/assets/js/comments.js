// $(document).ready(() => {});

// const btn = document.querySelector('#click-board');
// console.log(btn);

// // btn.addEventListener('click', () => {
// //   console.log('Modal button clicked');
// //   $('#post-details-modal').modal('show');
// // });

async function createComment(element) {
  const boardId = element.getAttribute('id');

  $.ajax({
    method: 'POST',
    url: `url넣어주시고`,
  });
}
