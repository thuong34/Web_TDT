const todosAPI = "https://dummyjson.com/todos/1";

start();

function start() {
    getTasks(renderTasks);
}

function getTasks(callback) {
    fetch(todosAPI)
        .then(response => response.json())
        .then(callback)
        .catch(err => console.error("Lỗi API:", err));
}

function renderTasks(todos) {
    const newTaskList = document.querySelector(".task__newList");
    const processingTaskList = document.querySelector(".task__processingList");

    const fakeNewTasks = [
        { id: 132, todo: "Do something nice for someone you care about", time: "0:3:00", coin: 152 },
        { id: 21, todo: "Memorize a poem", time: "3:3:05", coin: 133 },
        { id: 176, todo: "Watch a classic movie", time: "0:0:10", coin: 68 },
        { id: 400, todo: "Watch a documentary", time: "1:3:00", coin: 84 }
    ];

    const fakeUsers = [{
        id: 1,
        name: "Hai Nam",
        balance: {
            usdt: 0,
            coin: 0
        },
        task_status: [
            { task_id: 10, todo: "Memorize a classic", time: "00:05:05", coin: 90, status: "over", accepted_at:"2025-03-08T07:23:02.741Z" },
            { task_id: 12, todo: "Do something nice classic", time: "01:03:12", coin: 213, status: "new", accepted_at:"2025-03-08T07:10:02.741Z" }
        ]
    }];

    const fakeProcessingTasks = fakeUsers[0]["task_status"];

    newTaskList.innerHTML = fakeNewTasks.map(task => createTaskHTML(task, "new")).join("");
    processingTaskList.innerHTML = fakeProcessingTasks.map(task => createTaskHTML(task, checkTaskStatus(task))).join("");

    document.querySelectorAll(".task__item.processing").forEach(taskItem => {
        startCountdown(taskItem);
    });

    newTaskList.addEventListener("click", (event) => handleAddTask(event, processingTaskList));
    processingTaskList.addEventListener("click", handleProcessingTask);
    // nhiệm vụ đề xuất
    renderSuggestTasks(newTaskList)
    // hiển thị tất cả lịch sử giao dịch
    renderHistoryTransactions()
}

// Hàm tạo HTML cho nhiệm vụ
export function createTaskHTML(task, status) {
    let textBtn = {
        "new": "Nhận nhiệm vụ",
        "processing": "Xác nhận hoàn thành",
        "over": "Quá hạn",
        "success": "Nhận thưởng"
    }[status] || "Nhận nhiệm vụ";

    return `
        <div class="col l-12 m-12 c-12">
            <div class="task__item ${status}" data-id="${task.id || task.task_id}" data-time="${task.time}">
                <div class="task__item--title">Nhiệm vụ ${task.id || task.task_id}:</div>
                <div class="task__item--body f-between">
                    <div class="task__item--text">${task.todo}</div>
                    <div class="task__item--number">
                        <div class="task__item--coin"><span>${task.coin} </span>Coin</div>
                        <div class="task__item--time">${task.time}</div>
                    </div>
                </div>
                <div class="task__item--footer">
                    <button class="btn__task--submit">${textBtn}</button>
                    <button class="btn__task--delete btn__danger ${status === 'new' ? 'hidden' : ''}">Xóa</button>
                </div>
            </div>
        </div>`;
}
// time to seconds
function toSeconds(timestr){
    let [hours, minutes, seconds] = timestr.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
// check status task
function checkTaskStatus(task) {
    let now = new Date();
    let acceptedAt = new Date(task.accepted_at);
    let expiresAt = new Date(acceptedAt.getTime() + toSeconds(task.time) * 1000);
    return now > expiresAt ? "over" : "processing";
}
// Xử lý khi bấm "Nhận nhiệm vụ"
function handleAddTask(event, processingTaskList) {
    if (!event.target.classList.contains("btn__task--submit")) return;

    const taskItem = event.target.closest(".task__item.new");
    if (!taskItem) return;
    // lấy thời gian thực
    let acceptedAt = new Date().toISOString();
    taskItem.dataset.accepted = acceptedAt;

    event.target.innerText = "Xác nhận hoàn thành";
    taskItem.classList.replace("new", "processing");

    // Xóa nhiệm vụ khỏi danh sách "Nhiệm vụ mới"
    taskItem.parentElement.remove();

    // bỏ hidden ở btn delete
    taskItem.querySelector('.btn__task--delete').classList.remove('hidden')

    // Thêm vào danh sách "Đang thực hiện"
    processingTaskList.prepend(taskItem);

    startCountdown(taskItem);
}

//Hàm đếm ngược (chỉ chạy với nhiệm vụ "processing")
function startCountdown(taskItem){
    let acceptedAt = new Date(taskItem.dataset.accepted)
    let duration = toSeconds(taskItem.dataset.time)
    let expiresAt = new Date(acceptedAt.getTime() + duration * 1000)

    function updateTimer(){
        if(!taskItem.classList.contains('processing') ) return

        let now = new Date()
        let remaining = Math.max(0, Math.floor((expiresAt - now) / 1000))

        if(remaining <= 0){
            taskItem.classList.replace('processing','over')
            taskItem.querySelector('.task__item--time').innerText = "00:00:00"
            taskItem.querySelector('.btn__task--submit').innerText = "Quá hạn"
            return
        }else{
            taskItem.dataset.timerId = requestAnimationFrame(updateTimer)
        }
        let h = Math.floor(remaining / 3600);
        let m = Math.floor((remaining % 3600) / 60);
        let s = remaining % 60;

        taskItem.querySelector('.task__item--time').innerText = `${h < 10 ? "0" : ""}${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`
    }
    updateTimer()
}

// Xử lý khi bấm vào nhiệm vụ trong "Đang thực hiện"
function handleProcessingTask(event) {
    const taskItem = event.target.closest(".task__item");

    if (event.target.classList.contains("btn__task--delete")) {
        let isDelete = confirm("Bạn có chắc chắn xóa nhiệm vụ này?");
        if (isDelete) {
            taskItem.remove();
        }
    } else if (event.target.classList.contains("btn__task--submit") && taskItem.classList.contains("processing")) {
        cancelAnimationFrame(taskItem.dataset.timerId);
        taskItem.classList.replace("processing", "success");
        event.target.innerText = "Nhận thưởng";
    }
}

// nhiệm vụ đề xuất
function renderSuggestTasks(newTaskList) {
    const taskContainer = document.querySelector('.suggest__task')
    if (!taskContainer) return
    taskContainer.innerHTML = createSuggestTaskHTML(newTaskList)
}

function createSuggestTaskHTML(newTaskList) {
    if (!newTaskList) return ""

    const taskItems = Array.from(newTaskList.querySelectorAll('.task__item')).slice(0, 2)
    if (!taskItems) return

    return taskItems.map((taskItem, index) => {
        let id = taskItem.dataset.id || "NA"
        let time = taskItem.dataset.time || "Not found"
        let text = taskItem.querySelector('.task__item--text')?.innerText || "Nothing"
        let coin = taskItem.querySelector('.task__item--coin')?.innerText || "Not found"

        return `<div class="col l-5 ${index === 1 ? "l-o-2 m-o-2" : ""} m-5 c-12">
                    <div class="task__card">
                        <div class="task__card--title">Nhiệm vụ ${id}:</div>
                        <div class="task__card--content">${text}</div>
                        <div class="task__card--footer f-between">
                            <div class="card__coin">${coin}</div>
                            <div class="card__time">${time}</div>
                        </div>
                    </div>
                </div>`
    }).join("")
}

// lịch sử giao dịch
const transacionsData = [
    { id: 1, type: "convert", details: "Quy đổi USDT -> Coin", amount: "10 USDT -> 1000 Coin", time: "27/02/2025 - 10:10", status: "Thành công" },
    { id: 2, type: "convert", details: "Quy đổi Coin -> USDT", amount: "100 Coin -> 1 USDT", time: "8/03/2025 - 00:40", status: "Thành công" },
    { id: 3, type: "task", details: "Nhận thưởng", amount: "+50 Coin", time: "8/03/2025 - 07:00", status: "Thành công" }
];

const tableBody = document.getElementById("transacionTable");
const btnFilterHistorys = document.querySelectorAll('.history__filterBtn button')

btnFilterHistorys.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.history__filterBtn button.active').classList.remove('active')
        btn.classList.add('active')
        
        const filterType = btn.getAttribute("data-filter")
        renderHistoryTransactions(filterType)
    }
})

function renderHistoryTransactions(filterType = "all"){
    tableBody.innerHTML = ""

    const filteredTransacion = transacionsData.filter(transacion=>{
        return filterType === "all" || transacion.type === filterType
    })

    filteredTransacion.forEach(transacion=>{
        const row = `<tr>
            <td>${transacion.details}</td>
            <td>${transacion.amount}</td>
            <td>${transacion.time}</td>
            <td>${transacion.status}</td>
        </tr>`
        tableBody.innerHTML += row
    })
}