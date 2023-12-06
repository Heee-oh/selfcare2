var imageData = null;



document.getElementById('imageUpload').addEventListener('change', function(e) {
  var file = e.target.files[0];
  var reader = new FileReader();

  reader.onloadend = function() {
    imageData = reader.result;

    // Update the src attribute of the image element
    document.getElementById('ma').src = imageData;
  }

  reader.readAsDataURL(file);

});



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

document.getElementById('an_post').addEventListener('click', function(event) {
  var situation = JSON.parse(localStorage.getItem('situation'));
  var tags = JSON.parse(localStorage.getItem('tags'));
  var content = JSON.parse(localStorage.getItem('content'));
  var contenthappy = JSON.parse(localStorage.getItem('contenthappy'));
  event.target.removeEventListener('click', arguments.callee);
  if(!situation || !tags) {
    Swal.fire({
      icon: 'error',
      title: '잘못된 접근입니다.',
      text: '올바른 경로로 접근 후 작성해주세요',
      willClose: function() {
        window.location.href = '/test';
      }
    })
  }


  var anonymous = 0;

  var data = {
    'situation': situation,
    'tags': tags,
    'content': content,
    'contenthappy': contenthappy,
    'anonymous': anonymous,
    'imageData': imageData
  };
  document.getElementById('loading').classList.remove('display_none');
  $.ajax({
    url: '/update-post/' + localStorage.getItem('mr_id_u'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token')
    },
    data: JSON.stringify(data),
    success: function(response) {
      console.log(response);

      localStorage.removeItem('situation');
      localStorage.removeItem('tags');
      localStorage.removeItem('content');
      localStorage.removeItem('contenthappy');

      localStorage.removeItem('mr_id_u');
      localStorage.removeItem('situation_u');
      localStorage.removeItem('tags_u');
      localStorage.removeItem('content_u');
      localStorage.removeItem('contenthappy_u');
      localStorage.removeItem('imageData_u');
      localStorage.removeItem('anonymous_u');
      document.getElementById('loading').classList.add('display_none');
      Swal.fire({
        icon: 'success',
        title: '수정 완료',
        text: '성공적으로 수정했습니다.',
        willClose: function() {
          
          window.location.href = '/test';
        }
      })
  
    },
    error: function(error) {
      console.error('Error:', error);
      document.getElementById('loading').classList.add('display_none');
    }
  });
});

// upload_community id를 이용해서 버튼 누르면 post로 서버에 데이터 보내기 
// 이땐 비밀글이 아니라서 익명은 1로 
document.getElementById('upload_community').addEventListener('click', function(event) {
  var situation = JSON.parse(localStorage.getItem('situation'));
  var tags = JSON.parse(localStorage.getItem('tags'));
  var content = JSON.parse(localStorage.getItem('content'));
  var contenthappy = JSON.parse(localStorage.getItem('contenthappy'));

  event.target.removeEventListener('click', arguments.callee);

  if(!situation || !tags ) {
    Swal.fire({
      icon: 'error',
      title: '잘못된 접근입니다.',
      text: '올바른 경로로 접근 후 작성해주세요',
      willClose: function() {
        window.location.href = '/test';
      }
    })
  }

  var anonymous = 1;

  var data = {
    'situation': situation,
    'tags': tags,
    'content': content,
    'contenthappy': contenthappy,
    'anonymous': anonymous,
    'imageData': imageData
  };
  document.getElementById('loading').classList.remove('display_none');
  $.ajax({
    url: '/update-post/' + localStorage.getItem('mr_id_u'),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token')
    },
    data: JSON.stringify(data),
    success: function(response) {
      console.log(response);

      localStorage.removeItem('situation');
      localStorage.removeItem('tags');
      localStorage.removeItem('content');
      localStorage.removeItem('contenthappy');
      
      localStorage.removeItem('mr_id_u');
      localStorage.removeItem('situation_u');
      localStorage.removeItem('tags_u');
      localStorage.removeItem('content_u');
      localStorage.removeItem('contenthappy_u');
      localStorage.removeItem('imageData_u');
      localStorage.removeItem('anonymous_u');
    
      document.getElementById('loading').classList.add('display_none');
      Swal.fire({
        icon: 'success',
        title: '수정 완료',
        text: '성공적으로 수정했습니다.',
        willClose: function() {
          window.location.href = '/test';
        }
      })
      
    },
    error: function(error) {
      console.error('Error:', error);
      document.getElementById('loading').classList.add('display_none');
    }
  });
});