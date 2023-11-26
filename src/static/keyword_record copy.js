var selectedKeywords = [];
var keywordCategories = { positive: 0, neutral: 0, negative: 0 };

function markClicked(element) {
    if (selectedKeywords.length >= 5 && !element.classList.contains("selected")) {
        return; // Don't allow more than 5 tags to be selected
    }

    element.classList.toggle("selected");
    var keyword = element.textContent;
    var category = element.dataset.category;
    var index = selectedKeywords.findIndex(function(kw) {
        return kw.text === keyword;
    });

    if (index > -1) {
        selectedKeywords.splice(index, 1);
        keywordCategories[category]--;
    } else {
        selectedKeywords.push({ text: keyword, category: category });
        keywordCategories[category]++;
    }

    document.getElementById("selectedKeywords").textContent = selectedKeywords.map(function(kw) {
        return kw.text;
    }).join(", ");
}

function goToNextPage() {
    localStorage.setItem("selectedKeywords", JSON.stringify(selectedKeywords));
    localStorage.setItem("keywordCategories", JSON.stringify(keywordCategories));

    var keywordTexts = selectedKeywords.map(function(kw) {
        return kw.text;
    });
    window.location.href = "/test2?keywords=" + encodeURIComponent(keywordTexts.join(","));
}