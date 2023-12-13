let currentQuestion = 1;
const totalQuestions = 13; // 전체 질문 수

const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const scoreButtons = document.getElementById('scoreButtons');
let isNextBtnClicked = false;
let isPrevBtnClicked = false;
let totalScore = 0;
let backhomebtn = false;
function fetchQuestion(question_panic_Id) {
    fetch(`/get_question_panic/${question_panic_Id}`)
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
document.addEventListener('DOMContentLoaded', function() {
  var radios = document.querySelectorAll('.btn-check');

  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      var label = this.nextElementSibling;
      if (this.checked) {
        label.style.backgroundColor = "#00A8BA"; // 클릭시 변경될 배경색으로 수정하세요.
        label.style.color = "white"; // 클릭시 변경될 텍스트 색으로 수정하세요.
      }
      var others = document.querySelectorAll('.btn-check:not(:checked) + label');
      others.forEach(function(other) {
        other.style.backgroundColor = "#808080"; // 초기 배경색으로 수정하세요.
        other.style.color = "aliceblue"; // 초기 텍스트 색으로 수정하세요.
      });
    });
  });
});
function updateQuestion() {
    fetchQuestion(currentQuestion);
    const sendDataBtn = document.getElementById('sendDataBtn');
    const scoreButtons = document.querySelector('.btn-group-vertical');

    if (currentQuestion === totalQuestions) {
        sendDataBtn.style.display = 'block';
        if (scoreButtons) {
            scoreButtons.style.display = 'none';
        }
    } else {
        sendDataBtn.style.display = 'none';
        if (scoreButtons) {
            scoreButtons.style.display = 'block';
        }
    }
}

function goToNextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        updateQuestion();
    } else if (currentQuestion === totalQuestions) {
        saveScore();
        displayResult();
    }
}

function displayResult() {
    console.log('Total Score:', totalScore);
}

function goToPreviousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        updateQuestion();
        setTimeout(() => {
            isPrevBtnClicked = false;
        }, 1000);
    }
}

document.getElementById('sendDataBtn').addEventListener('click', function() {
  if (!backhomebtn) {
      sendDataToFlask(totalScore);
      getResultFromFlask(totalScore);
      const questionContainer = document.getElementById('question-container');
      questionContainer.style.display = 'none';
      this.textContent = '홈으로';
      backhomebtn = true;
      this.addEventListener('click', function() {
          window.location.href = '/test';
      });
  }

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

            const totalScore = data.totalScore;
            let resultText = '';

            if (totalScore < 5) {
                resultText = "정상 수치에 해당합니다. 만약 동일 증상이 반복된다면, 다른 원인에 의한 것은 아닌지 검진이 필요할 수도 있겠으나, 심리적인 요인이 크다고 느껴진다면, 상담 전문가와 상의를 해보실 것을 권해드립니다.";
            } else {
                resultText = "공황장애가 의심되니 전문가의 상담을 받아보시기 바랍니다. 심각한 스트레스를 받은 직후이거나, 불편한 장소, 긴장의 상태에서 중증 정도의 증상을 빈번하게 겪고 계시다면, 빠른 시일 내에 전문가를 찾아주시기 바랍니다.";
            }

            const resultContainer = document.getElementById('result-container');
            resultContainer.textContent = resultText;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 초기에 첫 번째 질문 로드
updateQuestion();
