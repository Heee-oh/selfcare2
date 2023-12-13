let currentQuestion = 1;
const totalQuestions = 15; // 전체 질문 수
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const scoreButtons = document.getElementById('scoreButtons');
let isNextBtnClicked = false;
let isPrevBtnClicked = false;
let totalScore = 0;
let backhomebtn = false;

function fetchQuestion(questionId) {
    fetch(`/get_question/${questionId}`)
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
        if (currentQuestion < totalQuestions) {
          goToNextQuestion();
      } else {
          displayResult();
      }
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
        sendDataBtn.style.display = 'block'; //마지막 질문일 때 결과확인하기 버튼 표시
        //대답 버튼 숨기기
        if (scoreButtons) {
            scoreButtons.style.display = 'none';
        }
    } else {
        sendDataBtn.style.display = 'none'; //다른 질문일 때 결과 버튼 숨기기 
        //질문 숨김
        if (scoreButtons) {
            scoreButtons.style.display = 'block';
        }
    }
}

function goToNextQuestion() {
  currentQuestion++;
  updateQuestion();
  displayResult(); 
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
        body: JSON.stringify({ totalScore }),
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

        if (totalScore < 7) {
          resultText = "일반적으로 정상인이 느낄 수 있는 수준입니다. 고민을 나눌 수 있는 가까운 친구나 동료, 또는 지인이 있다면, 대화를 나눠 보세요. 속으로 앓고 있는 것을 털어놓는 것 만으로도 충분히 해소될 수 있습니다.";
      } else if (totalScore >= 8 && totalScore < 13) {
          resultText = "번아웃의 초기 단계 수준으로 보여집니다. 업무가 아닌, 관심이 있는 활동을 찾아, 기분전환의 기회를 꾸준히 가져보세요. 고민을 나눌 수 있는 가까운 친구나 동료, 또는 지인이 있다면 대화도 함께 병행하시면서 답답한 마음을 표출하는 것도 많은 도움이 됩니다. 다만, 혼자서 극복하기가 어렵다고 생각되시면 전문가와의 상담을 권합니다.";
      } else if (totalScore >= 14 && totalScore < 20) {
          resultText = "중증 수준의 번아웃증후군을 보여 일상생활에 어려움을 겪고 계실 것으로 예상됩니다. 가급적 전문가와의 상담을 통한 치료를 진행해 보시길 권합니다.";
      } else {
          resultText = "매우 심각한 수준의 결과이며, 이러한 상황이 지속되는 동안, 많은 괴로움과 심적인 피로감에 지쳐 계실 것 같습니다. 더 이상 자신을 방치하지 말고, 전문가의 도움을 받아보실 것을 권해드립니다.";
      }
        const resultContainer = document.getElementById('result-container');
        resultContainer.textContent = resultText;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

updateQuestion();
