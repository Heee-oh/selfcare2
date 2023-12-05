function getCookie(name) {
  var cookieArr = document.cookie.split(";");

  for(var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    
    if(name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

// 무한스크롤
let page = 1;
let perPage = 10;
let isLoading = false;

fetchPosts();

window.onscroll = function() {
  if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    fetchPosts();
  }
};

async function fetchPosts() {
  isLoading = true;
  console.log('Fetching data...');

  var savedTags = JSON.parse(localStorage.getItem('situation_filter')) || []; // 필터링 단어 있는지 확인

  fetch(`/community/data?page=${page}&limit=${perPage}`)
    .then(response => response.json())
    .then(records => {

      if (records.length === 0) {
        isLoading = false;
        return;
      }

      var postsContainer = document.getElementById('list');

      records.forEach(record => {
        var postTags = record.situation.split(',').concat(record.keyword.split(',')).map(s => s.trim());  //필터링 단어들 

        var shouldSkipPost = postTags.some(tag => savedTags.includes(tag));

        if (shouldSkipPost) {  // 포함되어있다면 리턴으로 생성방지
          return;
        }

        var post = document.createElement('div');
          post.className = 'border feed_box mx-auto';
          post.id = `${record.mr_id}`;
          console.log(record.image);
          var imageHTML = record.image ? `<img class="feed_img" src="../${record.image}">` : '';

          post.innerHTML = `
              <div class="feed_name d-flex justify-content-between" >
                <p class="tag_size" id="tags">${
                  record.situation.split(',').map(s => '#' + s.trim()).join(' ') + ' ' +
                  record.keyword.split(',').map(k => '#' + k.trim()).join(' ')
                }</p>
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                  </svg>
                </div>
              </div>
              ${imageHTML}
              <div class="feed_content mt-3">
                  <p class="feed_txt">${record.content}</p> <!-- 내용 데이터 -->
              </div>
              <div class="feed_icon">
                  <div>
                      <span class="material-icons-outlined" data-id="${record.mr_id}"></span>
                      <a id="count" style="font-size: 15px; margin-left: -8px;">${record.sympathy}</a> <!-- 좋아요 데이터 -->
                      <span class="material-icons-outlined">mode_comment</span>
                      <a id="count" style="font-size: 15px; margin-left: -8px;">${record.comment_count}</a> <!-- 댓글 데이터 -->
                  </div>
              </div>
          `;

          getFirstlike(post.id);

          post.addEventListener('click', function() {
              console.log(post.id);
              var id = post.id;
              window.location.href = "/community/" + id;
          });

          

          if (postsContainer.firstChild) {
            postsContainer.insertBefore(post, postsContainer.firstChild);
          } else {
            postsContainer.appendChild(post);
          }
    });

        var ad = document.createElement('div');
        ad.className = 'border feed_box ad';
        ad.id = 'advertisement';
        //광고이미지 // var imageHTML = record.image ? `<img class="feed_img" src="../${record.image}">` : '';
        ad.innerHTML = `
        <div class="ad feed_content">
            <h2>광고 자리</h2>
            <p>10게시물당 1개씩 나옵니다.</p>
        </div>
      `;
      postsContainer.appendChild(ad);

      

      page++;
      isLoading = false;
});
}


function getFirstlike(id) {
  fetch('/get_first_like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': getCookie('csrf_access_token'),
    },
    body: JSON.stringify({mr_id: id}),
  })
  .then(response => response.json())
  .then(data => {
    // Use the post ID to select the icon of the specific post
    if(data.like) {
      document.querySelector('.material-icons-outlined[data-id="' + id + '"]').textContent = data.like ? 'favorite' : 'favorite_border';
    }else{
      document.querySelector('.material-icons-outlined[data-id="' + id + '"]').textContent = 'favorite_border';
    }
    
  })
  
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 필터링 코드 시작
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function stopword() {
  $('#keywordModal').modal('show');
}

document.getElementById('close_modal').addEventListener('click', function() {

  $('#keywordModal').modal('hide');
});

document.getElementById('applyKeyword').addEventListener('click', function() {
  
  $('#keywordModal').modal('hide');
  window.location.reload();
});



const userinput = document.getElementById('contentA');
const autocomplete = document.getElementById('autocomplete');
const tabpanel = document.getElementById('tabpanel');


const keywords = ['학업/고시','연애','정신건강','가족', '대인관계', '직장', '금전', '사업', '이별', '이혼', '결혼', '육아', '성생활', '외모', 
                  '취업/진로', '자아', '성격', 'LGBT', '건강', '중독', '집착', '불안', '자살생각', '자해', '스트레스', '공포증']; // Replace this with your actual keywords


let situation = []; 

let savedTags = [];

if(localStorage.getItem('situation_x')) {
  savedTags = JSON.parse(localStorage.getItem('situation_x'));


}else{
  savedTags = JSON.parse(localStorage.getItem('situation_filter'));

}


if (savedTags) {
    situation = savedTags;
    situation.forEach(tag => {
        const newTag = document.createElement('span');
        newTag.className = 'tag';
        newTag.textContent = '#' + tag;
        newTag.addEventListener('click', function() {
            // Remove the tag from the DOM
            newTag.remove();

            // Remove the tag from the tags array
            const index = situation.indexOf(tag);
            if (index > -1) {
                situation.splice(index, 1);
            }

            // Update localStorage
            localStorage.setItem('situation_filter', JSON.stringify(situation));
            
        });
        tabpanel.appendChild(newTag);
        localStorage.setItem('situation_filter', JSON.stringify(situation));
    });
}
userinput.addEventListener('input', function() {
    // Clear the autocomplete box
    autocomplete.innerHTML = '';
  
    // Check if the user input is not empty
    if (userinput.value.length > 0) {
      // Search for related keywords
      const relatedKeywords = keywords.filter(keyword => keyword.includes(userinput.value));
  
      // Add the related keywords to the autocomplete box
      relatedKeywords.forEach(keyword => {
        const keywordElement = document.createElement('div');
        keywordElement.textContent = keyword;
        keywordElement.addEventListener('click', function() {
          // Check if the number of tags is less than 5
            // Create a new tag
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = '#' + keyword;
            newTag.addEventListener('click', function() {
                // Remove the tag from the DOM
                newTag.remove();
  
                // Remove the tag from the tags array
                const index = situation.indexOf(keyword);
                if (index > -1) {
                    situation.splice(index, 1);
                }
  
                // Update localStorage
                localStorage.setItem('situation_filter', JSON.stringify(situation));
            });
  
            // Add the new tag to the tabpanel
            tabpanel.appendChild(newTag);
  
            // Add the new tag to the tags array
            situation.push(keyword);
  
            // Update localStorage
            localStorage.setItem('situation_filter', JSON.stringify(situation));
  
            // Clear the user input
            userinput.value = '';
            autocomplete.innerHTML = '';
          


        });
        autocomplete.appendChild(keywordElement);
      });
    }
  });


