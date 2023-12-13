window.onload = function() {
  var tags = JSON.parse(localStorage.getItem('tags'));
  var situation = JSON.parse(localStorage.getItem('situation'));
  var contenthappy = JSON.parse(localStorage.getItem('contenthappy'));
  var content = JSON.parse(localStorage.getItem('content'));

  var text = `나는 오늘 "${tags}"을(를) 느꼈고,<br>그 이유는 "${situation}" 때문이다. <br><br>더 자세한 감정이나 원인은 "${content}" 이다. <br><br>오늘 기뻤던 일 3가지는 "${contenthappy}"`;

  document.querySelector('.question2 p').innerHTML = text;
}

if(localStorage.getItem('mr_id_u')) {
  document.getElementById('next').addEventListener('click', function() {
    window.location.href = '/update-post';
  });
  
}else{
  document.getElementById('next').addEventListener('click', function() {
    window.location.href = '/test6';
  });
}


document.getElementById('nickname').innerText = localStorage.getItem('name') + '의 오늘은 이렇게 정리할 수 있겠다.';
