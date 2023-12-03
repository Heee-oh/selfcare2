      
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
      document.getElementById('delete-post').addEventListener('click', function(e) {
        e.preventDefault();
        var postId = this.closest('.feed_box').id; // Get the ID of the post
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
      });


      // 업데이트 버튼 누르면 update/해당글 mr_id 로 이동
      document.getElementById('update-post').addEventListener('click', function(e) {
        e.preventDefault();
        fetch('/update/' + this.closest('.feed_box').id, {
            method: 'GET',
          })
          .then(response => response.json())
          .then(data => {
               // data.mr_id xx
               // 왜 data.record.mr_id로 접근해야하는지 의문? 
               // record라는 키와 record.serialize()의 결과로 얻은 객체 이기 때문에
               // data.record를 사용해서 record 속성에 접근 한다음 mr_id에 접근해야함!
        

               console.log(data.record.mr_id);
               console.log(data.record.situation);
               console.log(data.record.keyword);
               console.log(data.record.content);
               console.log(data.record.happy);
               console.log(data.record.image);
               console.log(data.record.open_close);

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
            
            // console.log(localStorage.getItem('mr_id'));
            // console.log(localStorage.getItem('situation'));
            // console.log(localStorage.getItem('tags'));
            // console.log(localStorage.getItem('content'));
            // console.log(localStorage.getItem('contenthappy'));
            // console.log(localStorage.getItem('imageData'));
            // console.log(localStorage.getItem('anonymous'));

            window.location.href = '/test1';
          })
          .catch(error => {
              console.error('Error:', error);
          });

        });

        


    });



    