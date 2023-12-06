
var swiper = new Swiper(".mySwiper", {
  spaceBetween: 40,   // slide 사이의 간격
  autoplay: {
  delay: 2000,   // 자동 슬라이드 지연 시간
  },

  pagination: { // 페이징 설정
    el: ".swiper-pagination",
    clickable: true,
  },
  
});

var days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
var date = new Date();
var dayName = days[date.getDay()];
var day = date.getDate();
var month = date.getMonth() + 1; // JavaScript counts months from 0 to 11
document.getElementById('date').innerHTML = month + '월 ' + day + '일 ' + dayName;


document.addEventListener('DOMContentLoaded', function() {
  // 이벤트 위임을 사용하여 동적으로 생성된 요소에 이벤트 바인딩
  document.body.addEventListener('click', function(e) {
    if (e.target.id === 'delete-post') {
      e.preventDefault();
      var postId = e.target.closest('.feed_box').id; // Get the ID of the post
      fetch('/delete/' + postId, { // Update this URL with your delete route
        method: 'DELETE',
      })
      .then(console.log(postId))
      .then(response => response.json())
      .then(data => {
        // Remove the post from the DOM
        document.getElementById(postId).remove();
        window.location.reload();
        document.getElementById('today_log').style.display = 'block';
      });
    }

    if (e.target.id === 'update-post') {
      e.preventDefault();
      fetch('/update/' + e.target.closest('.feed_box').id, {
        method: 'GET',
      })
      .then(response => response.json())
      .then(data => {
         // data.mr_id xx
         // 왜 data.record.mr_id로 접근해야하는지 의문? 
         // record라는 키와 record.serialize()의 결과로 얻은 객체 이기 때문에
         // data.record를 사용해서 record 속성에 접근 한다음 mr_id에 접근해야함!


         let keywordArray;
         let situationArray;

         keywordArray = data.record.keyword.split(',');
         

         situationArray = data.record.situation.split(',');

      
      localStorage.setItem('mr_id_u', data.record.mr_id);
      localStorage.setItem('situation_u', JSON.stringify(situationArray));
      localStorage.setItem('tags_u', JSON.stringify(keywordArray));
      localStorage.setItem('content_u', data.record.content);
      localStorage.setItem('contenthappy_u', data.record.happy);
      localStorage.setItem('imageData_u', data.record.image);
      localStorage.setItem('anonymous_u', data.record.open_close);
      

      window.location.href = '/test1';
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
});

// document.addEventListener('DOMContentLoaded', function() {
//   document.getElementById('delete-post').addEventListener('click', function(e) {
//     e.preventDefault();
//     var postId = this.closest('.feed_box').id; // Get the ID of the post
//     fetch('/delete/' + postId, { // Update this URL with your delete route
//       method: 'DELETE',
//     })
//     .then(console.log(postId))
//     .then(response => response.json())
//     .then(data => {
//     // Remove the post from the DOM
//       document.getElementById(postId).remove();
//       window.location.reload();
//       document.getElementById('today_log').style.display = 'block';
//     });
//   });


//   // 업데이트 버튼 누르면 update/해당글 mr_id 로 이동
//   document.getElementById('update-post').addEventListener('click', function(e) {
//     e.preventDefault();
//     fetch('/update/' + this.closest('.feed_box').id, {
//         method: 'GET',
//       })
//       .then(response => response.json())
//       .then(data => {
//            // data.mr_id xx
//            // 왜 data.record.mr_id로 접근해야하는지 의문? 
//            // record라는 키와 record.serialize()의 결과로 얻은 객체 이기 때문에
//            // data.record를 사용해서 record 속성에 접근 한다음 mr_id에 접근해야함!


//            let keywordArray;
//            let situationArray;

//            keywordArray = data.record.keyword.split(',');
         

//            situationArray = data.record.situation.split(',');

      
//         localStorage.setItem('mr_id_u', data.record.mr_id);
//         localStorage.setItem('situation_u', JSON.stringify(situationArray));
//         localStorage.setItem('tags_u', JSON.stringify(keywordArray));
//         localStorage.setItem('content_u', data.record.content);
//         localStorage.setItem('contenthappy_u', data.record.happy);
//         localStorage.setItem('imageData_u', data.record.image);
//         localStorage.setItem('anonymous_u', data.record.open_close);
      

//         window.location.href = '/test1';
//       })
//       .catch(error => {
//           console.error('Error:', error);
//       });

//     });

  


// });


document.querySelectorAll('.btn:not(.close)').forEach(function(button) {
button.addEventListener('click', function(event) {
    var id = event.target.id;

    window.location.href = '/community/' + id;      

});
});






///////////////////////////////////////////////////////////////////////////////////////////////////////
// 캘린더 관련 코드 시작
///////////////////////////////////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', (event) => {
document.getElementById('date').addEventListener('click', function() {
  $('#calendarModal').modal('show');

  buildCalendar();   // 달력 생성

});
document.getElementById('back').addEventListener('click', function() {
  $('#calendarModal').modal('hide');
});
});



let nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
let today = new Date();     // 페이지를 로드한 날짜를 저장
today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화

// 날짜별 기록을 저장할 객체
let recordsByDate = {}; 

// 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
async function buildCalendar() {



let firstDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);     // 이번달 1일

let lastDate = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

let tbody_Calendar = document.querySelector(".Calendar > tbody");
document.getElementById("calYear").innerText = nowMonth.getFullYear();             // 연도 숫자 갱신
document.getElementById("calMonth").innerText = leftPad(nowMonth.getMonth() + 1);  // 월 숫자 갱신


// 년,월에 따른 게시물 가져오기



while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
  tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
}

let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가           

for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
  let nowColumn = nowRow.insertCell();        // 열 추가
}
let record_month = await getCalendar_record(document.getElementById("calYear").innerText, document.getElementById("calMonth").innerText);
let records = record_month.records;

// 기록 날짜 배열 

for(let record of records) {
let recordDate = new Date(record.mind_time);

// 년, 월, 일을 문자열로 변환합니다. 월과 일은 0부터 시작하므로 1을 더해줍니다.
let recordYear = recordDate.getFullYear();
let recordMonth = recordDate.getMonth() + 1;
let recordDay = recordDate.getDate();

// 년, 월, 일을 '년-월-일' 형태의 문자열로 합칩니다.
let dateKey = `${recordYear}-${recordMonth}-${recordDay}`;

if (!recordsByDate[dateKey]) {
    recordsByDate[dateKey] = [];
}

recordsByDate[dateKey].push(record);


}

let i = 0;
for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  
  
  let nowColumn = nowRow.insertCell();        // 새 열을 추가하고

  let newDIV = document.createElement("p");
  newDIV.innerHTML = leftPad(nowDay.getDate());        // 추가한 열에 날짜 입력
  nowColumn.appendChild(newDIV);

  if (nowDay.getDay() == 6) {                 // 토요일인 경우
      nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
  }

  if (nowDay < today) {                       // 지난날인 경우
      newDIV.className = "futureDay";         // Change class to "futureDay"
      newDIV.onclick = function () { choiceDate(this); }
// nowDay의 년, 월, 일을 문자열로 변환합니다. 월과 일은 0부터 시작하므로 1을 더해줍니다.
  let nowYear = nowDay.getFullYear();
  let nowMonth = nowDay.getMonth() + 1;
  let nowDayOfMonth = nowDay.getDate();

  // 년, 월, 일을 '년-월-일' 형태의 문자열로 합칩니다.
  let dateKey = `${nowYear}-${nowMonth}-${nowDayOfMonth}`;

  if(recordsByDate[dateKey]) {
      newDIV.style.backgroundColor = "#F5D042";   // 배경색 변경
      newDIV.style.color = "#fff12";
      newDIV.style.fontWeight = "600";
      newDIV.style.cursor = "pointer";
      newDIV.dataset.time = dateKey;

      newDIV.id = recordsByDate[dateKey][i].mr_id;
    
      
      
    }
  }
  else if (nowDay.getFullYear() == today.getFullYear() && nowDay.getMonth() == today.getMonth() && nowDay.getDate() == today.getDate()) { // 오늘인 경우           
      newDIV.className = "today";
      newDIV.onclick = function () { choiceDate(this); }
      
  }
  else {                                      // 미래인 경우
      newDIV.className = "pastDay";           // Change class to "pastDay"
      newDIV.onclick = function () { choiceDate(this); }


  }
}



}



// 날짜 선택
function choiceDate(newDIV) {
if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
  document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
}
newDIV.classList.add("choiceDay");           // 선택된 날짜에 "choiceDay" class 추가

let recordContainer = document.getElementById('record_content');
let recordId = newDIV.id; // 문제없음




try{
let record = recordsByDate[newDIV.dataset.time][0];
var imageHTML = record.image ? `<img class="feed_img" src="../${record.image}">` : '';
let recordHtml = `
<div class="border feed_box" id="${record.mr_id}">
<div class="feed_name d-flex flex-column justify-content-between" style="width: 100%;">
<div class="d-flex justify-content-between align-items-start" style="width: 100%;">
        <p class="tag_size">
        ${
            record.situation.split(',').map(s => '#' + s.trim()).join(' ') + ' ' +
            record.keyword.split(',').map(k => '#' + k.trim()).join(' ')
        }
        </p>
        <div class="dropdown ml-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" id="update-post">수정</a>
                <a class="dropdown-item" id="delete-post">삭제</a>
            </div>
        </div>
    </div>
    ${imageHTML}
    <div class="feed_content mt-3">
        <p class="feed_txt" style="margin-left: 5px;">${record.content}</p>
        <p class="feed_txt" style="margin-left: 5px;">${record.happy}</p>
    </div>
</div>
</div>
`
recordContainer.innerHTML = recordHtml;
}catch(error){
recordContainer.innerHTML = '기록이 없습니다.';
}

}

// 이전달 버튼 클릭
function prevCalendar() {
nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() - 1, nowMonth.getDate());   // 현재 달을 1 감소
buildCalendar();    // 달력 다시 생성
}
// 다음달 버튼 클릭
function nextCalendar() {
nowMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, nowMonth.getDate());   // 현재 달을 1 증가
buildCalendar();    // 달력 다시 생성
}

// input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
function leftPad(value) {
if (value < 10) {
  value = "0" + value;
  return value;
}
return value;
}



async function getCalendar_record(year, month) {
const response = await fetch('/calendar/' + year + '/' + month, {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
  },
});
const myJson = await response.json();
console.log(myJson);
return myJson;
}


function record_move() {
  
  localStorage.removeItem('mr_id');
  localStorage.removeItem('situation');
  localStorage.removeItem('tags');
  localStorage.removeItem('content');
  localStorage.removeItem('contenthappy');
  localStorage.removeItem('imageData');
  localStorage.removeItem('anonymous');

  window.location.href = '/test1';
}