
document.querySelectorAll(".clickable").forEach(function(element) {
    element.addEventListener("click", function() {
        handleClick(this);
    });
});


function handleClick(element) {
    var parsedData = JSON.parse(element.getAttribute("data-item"));
    Completion(parsedData.todolist, element);
}

function Completion(task, element) {
    const isCompleted = confirm(`완료하셨나요? (${task})`);

    if (isCompleted) {
        element.classList.add('completed'); // 완료시 취소선
    }
}