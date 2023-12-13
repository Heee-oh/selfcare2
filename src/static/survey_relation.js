let currentQuestion = 1;
const totalQuestions = 18; // 전체 질문 수
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const scoreButtons = document.getElementById('scoreButtons');
let isNextBtnClicked = false;
let isPrevBtnClicked = false;
let totalScore = 0;
let backhomebtn = false;
function fetchQuestion(question_realton_Id) {
    fetch(`/get_question_relation/${question_realton_Id}`)
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
        label.style.backgroundColor = "#80dae4"; // 클릭시 변경될 배경색으로 수정하세요.
        label.style.color = "#ffffff"; // 클릭시 변경될 텍스트 색으로 수정하세요.
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

            if (totalScore <= 5) {
              resultText = "일반적으로 정상적인 수준입니다. 원만한 대인관계 속에서 때로는 상대방으로 인해 짜증이 나거나 상처를 받을 수도 있지만, 누구나 겪을 수 있는 감정이겠거니 하며, 금방 가볍게 이겨낼 수 있는 건강한 상태로 보여집니다.";
          } else if (totalScore <= 11) {
              resultText = "상대방을 너무 의식하거나, 자기 자신을 너무 상대방에 맞추려 하기 보다는, 때로는 내가 원하는 것을 요구하거나, 표현하려는 노력이 필요합니다. 다만, 혼자서 극복하기가 어렵다고 생각되시면, 전문가와의 상담을 권합니다.";
          } else  {
              resultText = "타인에 의한, 타인을 위한 삶을 살아가고 있는 듯 합니다. 상대방에게서 자신의 의미를 찾거나, 상대방이 원하는 것에만 맞추려는 경향이 매우 강합니다. 자존감을 더 잃기 전에 전문가와의 상담을 진행해보시기 바랍니다.";
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
