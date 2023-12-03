
window.onload = function() {
  const myanswer = document.querySelector('.myanswer p');
  const keywordsave = JSON.parse(localStorage.getItem('situation'));
  alert(JSON.stringify(localStorage.getItem('situation')));
  if (keywordsave) {
    myanswer.textContent = keywordsave.join(', ');
  }
};


const input = document.getElementById('contentA');

input.addEventListener('input', function() {
  const maxLength = 200;
  const currentLength = [...this.value].length;

  if (currentLength > maxLength) {
    Swal.fire({
      icon: 'error',
      title: '글자수 제한',
      text: '200글자까지만 입력해주세요',
    });
    this.value = this.value.substring(0, maxLength);
  }
});


goToNextPage = function() {
  var inputValue = document.getElementById('contentA').value;

  localStorage.setItem('content', JSON.stringify(inputValue));

  window.location.href = '/test4';
}