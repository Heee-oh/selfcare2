let currentQuestion = 1;
const totalQuestions = 5; // 전체 질문 수
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const scoreButtons = document.getElementById('scoreButtons');
let isNextBtnClicked = false;
let isPrevBtnClicked = false;
let totalScore = 0;
let backhomebtn = false;
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

            if (totalScore < 2) {
              resultText = "(정상)일상생활 적응에 지장을 초래할만한 외상 사건 경험이나 이와 관련된 인지적, 정서적, 행동문제를 거의 보고하지 않았습니다.";
          } else if (totalScore == 2) {
              resultText = "(주의요망)외상 사건과 관련된 반응으로 불편감을 호소하고 있습니다, 평소보다 일상생활에 적응하는데 어려움을 느끼신다면 추가적인 평가나 정신건강 전문가의 도움을 받아보시기를 권해드립니다.";
          } else  {
              resultText = "(심한수준) 외상 사건과 관련된 반응으로 심한 불편감을 호소하고 있습니다, 평소보다 일상생활에 적응하는데 어려움을 느낄 수 있습니다. 추가적인 평가나 정신건강 전문가의 도움을 받아보시기를 권해드립니다";
          } 

            // 결과 계산

            const resultContainer = document.getElementById('result-container');
            resultContainer.textContent = resultText;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// 초기에 첫 번째 질문 로드
updateQuestion();
