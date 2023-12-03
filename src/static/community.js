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
  
    // User is at the bottom of the page
    fetch(`/community/data?page=${page}&limit=${perPage}`)
      .then(response => response.json())
      .then(records => {
        // If there are no more records, stop making requests
        if (records.length === 0) {
          isLoading = false;
          return;
        }
  
        var postsContainer = document.getElementById('list');
  
        records.forEach(record => {
          var post = document.createElement('div');
            post.className = 'border feed_box';
            post.id = `${record.mr_id}`;
            console.log(record.image);
            var imageHTML = record.image ? `<img class="feed_img" src="../${record.image}">` : '';
  
            post.innerHTML = `
                <div class="feed_name d-flex justify-content-between" >
                  <p class="tag_size">${
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
  