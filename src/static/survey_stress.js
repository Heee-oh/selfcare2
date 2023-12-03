let currentQuestion = 1;
const totalQuestions = 5; // 전체 질문 수
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn')
const questionContainer = document.getElementById('question-container')
const scoreButtons = document.getElementById('scoreButtons');
let isNextBtnClicked = false;
let isPrevBtnClicked = false;
let totalScore = 0;

function fetchQuestion(question_stress_Id) {
  fetch(`/get_question_stress/${question_stress_Id}`)
  .then(response => response.json())
  .then(data => {
      questionContainer.innerHTML = `<p>${data.question_text}</p>`;
  })
  .catch(error => console.error('Error fetching question:', error));
 }
  function saveScore() {
      const selectedScore = document.querySelector('input[name="score"]:checked');

      if (selectedScore) { 
          const scoreValue = parseInt(selectedScore.value);
          console.log('Selected score:', scoreValue);
          totalScore += scoreValue;
          goToNextQuestion();
      } else {
          console.log('Please select a score.');
      }
  }
  function updateQuestion() {
    fetchQuestion(currentQuestion);
    const sendDataBtn = document.getElementById('sendDataBtn');
    const scoreButtons = document.querySelector('.btn-group-vertical');

    if (currentQuestion === totalQuestions) {
        sendDataBtn.style.display = 'block'; // 마지막 질문일 때 Send Data 버튼 표시

        // 아니오, 가끔, 자주 버튼 숨기기
        if (scoreButtons) {
            scoreButtons.style.display = 'none';
        }
    } else {
        sendDataBtn.style.display = 'none'; // 다른 질문일 때 Send Data 버튼 숨김

        // 아니오, 가끔, 자주 버튼 보이기
        if (scoreButtons) {
            scoreButtons.style.display = 'block';
        }
    }
}


function goToNextQuestion() {
if (currentQuestion < totalQuestions) {
  currentQuestion++;
  updateQuestion();
} else if (currentQuestion === totalQuestions) { // 마지막 질문에서는 결과 창으로 이동
saveScore(); // 마지막 질문의 점수 저장
displayResult(); // 결과 창 표시 함수 호출
}
}
function displayResult() {
console.log('Total Score:', totalScore); // 콘솔에 점수 표시
}

function goToPreviousQuestion() {
if (currentQuestion > 1) {
  currentQuestion--;
  updateQuestion();
  setTimeout(() => {
      isPrevBtnClicked = false; // 일정 시간 후 다음 버튼 활성화
  }, 1000);
}
}
document.getElementById('sendDataBtn').addEventListener('click', function() {
sendDataToFlask(totalScore);
getResultFromFlask(totalScore);
const questionContainer = document.getElementById('question-container');
questionContainer.style.display = 'none';

const resultContainer = document.getElementById('result-container');
resultContainer.style.display = 'block';

});

function sendDataToFlask(totalScore) {
fetch('/save_result', {
  method: 'POST',
  headers: {
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({ totalScore }), // 선택된 점수를 Flask로 전송
})
.then(response => response.json())
.then(data => {
  console.log('Server response:', data);
  getResultFromFlask();
})
.catch(error => {
  console.error('Error:', error);
});
}
function getResultFromFlask() {
fetch('/get_result', { method: 'GET' })
.then(response => response.json())
.then(data => {
  console.log('Server response:', data);

  // 받아온 설문 결과를 변수에 저장
  const totalScore = data.totalScore;

  // 점수를 계산하여 결과를 처리
  let resultText = '';

  if (totalScore < 2) {
      resultText = "(정상)일상생활 적응에 지장을 초래할만한 외상 사건 경험이나 이와 관련된 인지적, 정서적, 행동문제를 거의 보고하지 않았습니다.";
  } else if (totalScore == 2) {
      resultText = "(주의요망)외상 사건과 관련된 반응으로 불편감을 호소하고 있습니다, 평소보다 일상생활에 적응하는데 어려움을 느끼신다면 추가적인 평가나 정신건강 전문가의 도움을 받아보시기를 권해드립니다.";
  } else  {
      resultText = "(심한수준) 외상 사건과 관련된 반응으로 심한 불편감을 호소하고 있습니다, 평소보다 일상생활에 적응하는데 어려움을 느낄 수 있습니다. 추가적인 평가나 정신건강 전문가의 도움을 받아보시기를 권해드립니다";
  } 

  // 결과를 화면에 표시
  const resultContainer = document.getElementById('result-container');
  resultContainer.textContent = resultText;
})
.catch(error => {
  console.error('Error:', error);
});
}
// 초기에 첫 번째 질문 로드
updateQuestion();