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
  if(!situation || !tags || !content || !contenthappy) {
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

  $.ajax({
    url: '/save_data',
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

      Swal.fire({
        icon: 'success',
        title: '작성 완료',
        text: '성공적으로 작성했습니다.',
        willClose: function() {
          window.location.href = '/test';
        }
      })
  
    },
    error: function(error) {
      console.error('Error:', error);
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

  if(!situation || !tags || !content || !contenthappy) {
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

  $.ajax({
    url: '/save_data',
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
      
      Swal.fire({
        icon: 'success',
        title: '작성 완료',
        text: '성공적으로 작성했습니다.',
        willClose: function() {
          window.location.href = '/test';
        }
      })
      
    },
    error: function(error) {
      console.error('Error:', error);
    }
  });
});