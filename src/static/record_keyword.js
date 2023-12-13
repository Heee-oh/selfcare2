userinput = document.getElementById('contentA');
autocomplete = document.getElementById('autocomplete');
tabpanel = document.getElementById('tabpanel');

keywords = ['불확실한', '막막한', '걱정되는', '조심하는', '아득한', '이상한', '미지수의', '생소한', '고민되는', '시기심 드는', '부족한', '조급한', '성에 안차는', '약오르는', '찝찝한', '경쟁심 드는', '질투심 드는', '놀라운', '당황스러운', '감격스러운', '충격적인', '흥분되는', '골치아픈',
'슬픈', '측은한', '상처받는', '서러운', '소외감 드는', '우울한', '처량한', '공허한', '안타까운', '불행한', '절망스러운', '불쌍한', '외로운', '좌절감드는', '싫은', '방해되는', '답답한', '지겨운', '속상한', '숨막히는', '억울한', '화난', '공격적인', '실증나는', '신경질적인', '역겨운', '불쾌한', 
'혐오하는', '약오르는', '나쁜', '귀찮은', '열받는', '짜증나는', '무능한', '지겨운', '쉬고싶은', '의존적인', '게으른', '낙담한', '피곤한', '가치없는', '지친','행복한',
'감동받은', '고마운', '관심가는', '기분 좋은', '기쁜', '끝내주는', '낙관적인', '다정한', '대단한', '두근거리는', '든든한', '만족스러운', '반가운', '반한', '뿌듯한', '사랑받는', '사랑스러운', '살맛 나는', '성장한', '쉬운', '신나는', '안심되는', 
'유능한', '유쾌한', '이긴 것 같은', '인정받는', '자랑스러운', '존경심 드는', '즐거운', '짜릿한', '황홀한', '흐믓한', '희망적인',
 '실망스러운', '바쁜','설레는'
]; // Replace this with your actual keywords
tags = []; // This array will hold the selected tags

// Load tags from localStorage
savedTags = [];

get_name();

if(localStorage.getItem('tags_u')) {
  savedTags = JSON.parse(localStorage.getItem('tags_u'));
  
}else{
  savedTags = JSON.parse(localStorage.getItem('tags'));

}



if (savedTags) {
    tags = savedTags;
    
    tags.forEach(tag => {
        const newTag = document.createElement('span');
        newTag.className = 'tag';
        newTag.textContent = '#' + tag;

        newTag.addEventListener('click', function() {
            // Remove the tag from the DOM
            newTag.remove();

            // Remove the tag from the tags array
            const index = tags.indexOf(tag);
            if (index > -1) {
                tags.splice(index, 1);
            }

            // Update localStorage
            localStorage.setItem('tags', JSON.stringify(tags));
        });
        tabpanel.appendChild(newTag);
        localStorage.setItem('tags', JSON.stringify(tags));
        
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
          if (tags.length < 5) {
            // Create a new tag
            const newTag = document.createElement('span');
            newTag.className = 'tag';
            newTag.textContent = '#' + keyword;
            newTag.addEventListener('click', function() {
                // Remove the tag from the DOM
                newTag.remove();
  
                // Remove the tag from the tags array
                const index = tags.indexOf(keyword);
                if (index > -1) {
                    tags.splice(index, 1);
                }
  
                // Update localStorage
                localStorage.setItem('tags', JSON.stringify(tags));
            });
  
            // Add the new tag to the tabpanel
            tabpanel.appendChild(newTag);
  
            // Add the new tag to the tags array
            tags.push(keyword);
  
            // Update localStorage
            localStorage.setItem('tags', JSON.stringify(tags));
  
            // Clear the user input
            userinput.value = '';
            autocomplete.innerHTML = '';
          } else {
            Swal.fire({
                icon: 'error',
                title: '키워드 제한',
                text: '키워드는 5개까지만 입력해주세요',
              });

            userinput.value = '';
            autocomplete.innerHTML = '';
          }

        });
        autocomplete.appendChild(keywordElement);
      });
    }
  });



async function get_name() {
  await fetch('/get_name')
  .then(response => response.json())
  .then(data => {
    localStorage.setItem('name', JSON.stringify(data.user));
    
  });
}