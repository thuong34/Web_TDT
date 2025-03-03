document.addEventListener("DOMContentLoaded", function () {
    const newTaskBtn = document.querySelector(".btn__filter--new");
    const currentTaskBtn = document.querySelector(".btn__filter--current");

    // Xử lý sự kiện khi nhấn vào "Nhiệm vụ mới"
    newTaskBtn.addEventListener("click", function () {
        newTaskBtn.classList.add("active");
        currentTaskBtn.classList.remove("active");
    });

    // Xử lý sự kiện khi nhấn vào "Đang thực hiện"
    currentTaskBtn.addEventListener("click", function () {
        currentTaskBtn.classList.add("active");
        newTaskBtn.classList.remove("active");
    });
});
