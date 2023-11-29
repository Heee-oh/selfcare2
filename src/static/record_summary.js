window.onload = function() {
  var tags = JSON.parse(localStorage.getItem('tags'));
  var situation = JSON.parse(localStorage.getItem('situation'));
  var contenthappy = JSON.parse(localStorage.getItem('contenthappy'));

  var text = `나는 오늘 "${tags}"을(를) 느꼈고,<br>그 이유는 "${situation}" 때문이다.<br><br>오늘 기뻤던 일 3가지는 "${contenthappy}"`;

  document.querySelector('.question2 p').innerHTML = text;
}