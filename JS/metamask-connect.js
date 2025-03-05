document.addEventListener("DOMContentLoaded", function () {
    const walletInput = document.getElementById("wallet-address");
    const connectBtn = document.querySelector(".connect-btn");

    // Danh sách ví gợi ý
    const walletSuggestions = [
        "vitalik.eth",
        "alicewallet.eth",
        "bobcrypto.eth",
        "mywallet.eth",
        "testaccount.eth",
        "dappuser.eth",
        "smartcontract.eth"
    ];

    // Tạo phần tử danh sách gợi ý
    let suggestionBox = document.createElement("div");
    suggestionBox.classList.add("wallet-list");
    suggestionBox.style.display = "none";
    walletInput.parentNode.appendChild(suggestionBox);

    // Hiển thị danh sách gợi ý khi nhập
    walletInput.addEventListener("input", function () {
        let value = walletInput.value.trim();
        suggestionBox.innerHTML = ""; 
        if (value.length > 0) {
            let filtered = walletSuggestions.filter(wallet => wallet.includes(value));
            if (filtered.length > 0) {
                suggestionBox.style.display = "block";
                filtered.forEach(wallet => {
                    let option = document.createElement("div");
                    option.classList.add("wallet-option");
                    option.textContent = wallet;
                    option.addEventListener("click", function () {
                        walletInput.value = wallet;
                        suggestionBox.style.display = "none"; 
                    });
                    suggestionBox.appendChild(option);
                });
            } else {
                suggestionBox.style.display = "none";
            }
        } else {
            suggestionBox.style.display = "none";
        }
    });
    connectBtn.addEventListener("click", function () {
        let walletAddress = walletInput.value.trim();
        if (walletAddress === "") {
            alert("Vui lòng nhập địa chỉ ví trước khi kết nối!");
            return;
        }
        window.location.href = "../html/index.html";
    });
});
//xem tat ca index
document.addEventListener("DOMContentLoaded", function () {
    const viewAllTasksBtn = document.getElementById("viewAllTasks");
    const homeContent = document.querySelector(".content__home");
    const taskListContent = document.querySelector(".content__task");

    if (viewAllTasksBtn && homeContent && taskListContent) {
        viewAllTasksBtn.addEventListener("click", function () {
            // Ẩn trang chủ
            homeContent.classList.remove("active");

            // Hiển thị danh sách nhiệm vụ
            taskListContent.classList.add("active");

            // Cuộn lên đầu trang (tùy chọn)
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
