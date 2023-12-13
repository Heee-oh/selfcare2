

get_comment()


// 댓글 목록 조회
async function get_comment() {
  let path = window.location.pathname; // "/community/5"
  let parts = path.split('/'); // ["", "community", "5"]
  let id = parts[parts.length - 1]; // "5"

  fetch('/get-comments/' + id)
    .then(response => response.json())
    .then(data => {
      let comment_main = document.getElementById('comment_main');
      comment_main.innerHTML = '';
      document.getElementById('count').textContent = data.comments.length;;
      // 댓글개수


      data.comments.forEach((comment, index) => {
        let newCommentHTML = `
    <div class="container-fluid row mt-2${index !== 0 ? ' border-top' : ''} comment_box" id="${comment.comment_id}">
      <div class="col-2">
          <img class="mt-2" style="margin-left: -20px; width: 40px;" src="../static/icon/캐릭터.png">
        </div>
        <div class="col-9 mt-2">
        <p>${comment.comment} </p> 
        </div>
        `
        if (comment.id == data.user_id) {
          newCommentHTML +=`
          <div class="dropdown col-1 position-relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
        </svg>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a class="dropdown-item position-relative" id="delete-comment">삭제</a>
        </div>`
            }
            newCommentHTML += `</div>`;

        comment_main.innerHTML += newCommentHTML;
      }); 
    });

} 

// 삭제버튼 클릭 이벤트
document.addEventListener('DOMContentLoaded', function() {
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'delete-comment') {
      e.preventDefault();
      let commentId = e.target.closest('.comment_box').id; 
      let mr_id = id;
      delete_comment(commentId, mr_id);

    }
  });
});


// 삭제 요청 
async function delete_comment(commentId, mr_id) {
  await fetch('/delete_comment/' + commentId + '/' + mr_id, {
          method: 'DELETE',
          
        })
        .then(response => response.json())
        .then(data => {
        
          document.getElementById(commentId).remove();
          get_comment()
        });

}

function getCookie(name) {
  var cookieArr = document.cookie.split(";");

  for(var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    
    if(name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

// 좋아요 클릭 이벤트 및 db 요청
let path = window.location.pathname; // "/community/5"
let parts = path.split('/'); // ["", "community", "5"]
let id = parts[parts.length - 1]; // "5"

let increment = true;
let isProcessing = false; // 추가된 변수

getFirstlike()

document.querySelector('.material-icons-outlined').addEventListener('click', async function() {
  
  if (isProcessing) return; // 처리 중이면 추가 클릭을 무시

  isProcessing = true; // 처리 시작

  await update_like();
  
  fetch('/get_like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
    body: JSON.stringify({mr_id: id}),
  })
  .then(response => response.json())
  .then(data => {
    
    document.getElementById('sympathy-count').textContent = data.sympathy;
    increment = !increment;
    
  })
  .finally(() => {
    isProcessing = false; // 처리 완료
    
  });

  
});

// 처음 좋아요 상태 조회 
async function getFirstlike() {
    await fetch('/get_first_like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
    body: JSON.stringify({mr_id: id}),
  })
  .then(response => response.json())
  .then(data => {
    document.querySelector('.material-icons-outlined').textContent = data.like ? 'favorite' : 'favorite_border';
  })
  .catch(error => {
    document.querySelector('.material-icons-outlined').textContent = 'favorite_border';
  });
}

// 좋아요 업데이트
async function update_like() {
  
  await fetch('/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
    body: JSON.stringify({mr_id: id})
  }).then(response => response.json())
  .then(data => {
    document.querySelector('.material-icons-outlined').textContent = data.like ? 'favorite' : 'favorite_border';
  }
  )
}

// 댓글 작성

document.querySelector('#comment input').addEventListener('keypress', function(e) {

  if (e.key === 'Enter') {

    e.preventDefault();


    let newCommentHTML = `
  <div class="container-fluid row mt-2" id="{{ record.comment_id }}">
    <div class="col-2">
      <img class="mt-2" style="margin-left: -20px; width: 40px;" src="../static/icon/캐릭터.png">
    </div>
    <div class="col-10 mt-2">
      <p>${this.value}</p> <!-- Use the input's current value -->
    </div>
  </div>
  `;
  let comment_main = document.getElementById('comment_main')
  if (comment_main.childElementCount === 0) {
    comment_main.innerHTML += newCommentHTML;
  } else {
    let newCommentHTML = `
  <div class="container-fluid row mt-2 border-top" id="{{ record.comment_id }}">
    <div class="col-2">
      <img class="mt-2" style="margin-left: -20px; width: 40px;" src="../static/icon/캐릭터.png">
    </div>
    <div class="col-10 mt-2">
      <p>${this.value}</p> <!-- Use the input's current value -->
    </div>
  </div>
      `;
  comment_main.innerHTML += newCommentHTML;
  }
    
    //db에 댓글 저장
    fetch('/add-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCookie('csrf_access_token'),
      },
      body: JSON.stringify({ mr_id:id, content: this.value }) 
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Update the comment count
        get_comment();
        
        

        
      }
    });

    // Clear the input
    this.value = '';
  }


});