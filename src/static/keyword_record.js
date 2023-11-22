
var selectedKeywords = [];

function markClicked(element) {
    element.classList.toggle("selected");
    var keyword = element.textContent;
    var index = selectedKeywords.indexOf(keyword);
    if (index > -1) {
        selectedKeywords.splice(index, 1);
    } else {
        selectedKeywords.push(keyword);
    }
    document.getElementById("selectedKeywords").textContent = selectedKeywords.join(", ");
}


function goToNextPage() {
    window.location.href = "/test2?keywords=" + encodeURIComponent(selectedKeywords.join(","));
}

