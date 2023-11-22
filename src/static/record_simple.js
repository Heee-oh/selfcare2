
var urlParams = new URLSearchParams(window.location.search);
var keywords = decodeURIComponent(urlParams.get('keywords')).split(',');

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

document.getElementById('record').addEventListener('click', function() {
var inputValue = document.getElementById('contentA').value;

$.ajax({
    url: '/save_data',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCookie('csrf_access_token'),   // 필수 csrf 토큰 보내야 post 작성 가능 위 getCookie함수도 같이 쓸 것
    },
    data: JSON.stringify({ keywords: keywords, content: inputValue }),
    success: function(data) {
        console.log(data);
        window.location.href = '/test';
    },
    error: function(error) {
        console.error('Error:', error);
    }
});
});