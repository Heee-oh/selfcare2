const userinput = document.getElementById('contentA');
const autocomplete = document.getElementById('autocomplete');
const tabpanel = document.getElementById('tabpanel');

window.onload = function() {
  const myanswer = document.querySelector('.myanswer p');
  const keywordsave = JSON.parse(localStorage.getItem('tags'));
  if (keywordsave) {
    myanswer.textContent = keywordsave.join(', ');
  }
};

const keywords = ['학업/고시','연애','정신건강']; // Replace this with your actual keywords
let situation = []; // This array will hold the selected tags

// Load tags from localStorage
const savedTags = JSON.parse(localStorage.getItem('situation'));
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
            localStorage.setItem('situation', JSON.stringify(situation));
        });
        tabpanel.appendChild(newTag);
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
          if (situation.length < 3) {
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
                localStorage.setItem('situation', JSON.stringify(situation));
            });
  
            // Add the new tag to the tabpanel
            tabpanel.appendChild(newTag);
  
            // Add the new tag to the tags array
            situation.push(keyword);
  
            // Update localStorage
            localStorage.setItem('situation', JSON.stringify(situation));
  
            // Clear the user input
            userinput.value = '';
            autocomplete.innerHTML = '';
          } else {
            Swal.fire({
                icon: 'error',
                title: '원인 제한',
                text: '원인 3개까지만 입력해주세요',
              });

            userinput.value = '';
            autocomplete.innerHTML = '';
          }

        });
        autocomplete.appendChild(keywordElement);
      });
    }
  });