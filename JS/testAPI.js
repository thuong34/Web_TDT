const BASE_URL_API = "http://localhost:3000";
let currentUser = null

start();

async function start() {
    await getUser();
    await renderInfoUser();
    getTasks(renderTasks);
}

async function getUser(){
    if(!currentUser){
        try {
            const response = await fetch(`${BASE_URL_API}/users/1`);
            currentUser =  await response.json();
            return currentUser
        } catch (error) {
            console.log(error);
            return {};
        }
    }
    return currentUser
}
async function renderInfoUser(){
    if(!currentUser) return;
    let userName = document.querySelector('.user__name');
    let balanceNumbers = document.querySelectorAll('.card__item--number');
    // let addressWallet 
    userName.innerText = currentUser.name || "User Name";
    balanceNumbers[0].innerText = currentUser?.balance?.coin || 0;
    balanceNumbers[1].innerText = currentUser?.balance?.usdt || 0;
    // addressWallet.innerText = user.address_wallet
}

function getTasks(callback) {
    fetch(`${BASE_URL_API}/tasks`)
        .then(response => response.json())
        .then(callback)
        .catch(err => console.error("Lỗi API:", err));
}

async function renderTasks(tasksData) {
    const newTaskList = document.querySelector(".task__newList");
    const processingTaskList = document.querySelector(".task__processingList");
    
    const fakeNewTasks = tasksData;
    if(!currentUser) return;
    if(!currentUser.task_status) currentUser.task_status = [];
    const fakeProcessingTasks = currentUser.task_status;

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
function renderProcessingTasks(){

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
                    <div class="task__item--text">${task.content}</div>
                    <div class="task__item--number">
                        <div class="task__item--coin"><span>${task.coin} </span>Coin</div>
                        <div class="task__item--time">${task.time}</div>
                    </div>
                </div>
                <div class="task__item--footer">
                    <button class="btn__task--submit" type="button">${textBtn}</button>
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
    if(!taskItem) return;
    // xóa nhiệm vụ
    if (event.target.classList.contains("btn__task--delete")) {
        let isDelete = confirm("Bạn có chắc chắn xóa nhiệm vụ này?");
        if (isDelete) {
            taskItem.remove();
        }
    }
    if (event.target.classList.contains("btn__task--submit")) {
        // cập nhật trạng thái nhiệm vụ -> success
        if(taskItem.classList.contains("processing")){
            cancelAnimationFrame(taskItem.dataset.timerId);
            taskItem.classList.replace("processing", "success");
            event.target.innerText = "Nhận thưởng";
            return;
        }
        if (taskItem.classList.contains("success")){
            handleModalAward(taskItem);
        }
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
        let text = taskItem.querySelector('.task__item--text').innerText || "Nothing"
        let coin = taskItem.querySelector('.task__item--coin').innerText || "Not found"

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
const btnFilterHistorys = document.querySelectorAll('.history__filterBtn button')

btnFilterHistorys.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.history__filterBtn button.active').classList.remove('active')
        btn.classList.add('active')
        
        const filterType = btn.getAttribute("data-filter")
        renderHistoryTransactions(filterType)
    }
})

async function renderHistoryTransactions(filterType = "all"){
    if(!currentUser) return;
    const transacionsData = currentUser.transacion_history || [];

    const tableBody = document.getElementById("transacionTable");
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
// Thêm (cập nhật) lịch sử giao dịch
import { formatDate } from "./main.js";

async function addHistoryTransacion({type="task",details="Nhận thưởng",amount="+0",time=formatDate(new Date()),status="fail"}){
    if(!currentUser) return;
    if(!currentUser.transacion_history) currentUser.transacion_history = [];
    const new_transacion_history = {type, details, amount, time, status}

    try {
        const updatedHistory = [...currentUser.transacion_history, new_transacion_history]
        // currentUser.transacion_history.push(new_transacion_history)
        const updateResponse = await fetch(`${BASE_URL_API}/users/1`,{
            method: "PATCH",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({transacion_history: updatedHistory}),
            // keepalive: true,
        })

        if(!updateResponse.ok) throw new Error("thêm lịch sử giao dịch thất bại")
        console.log("thêm lịch sử giao dịch thành công")
        console.log("🔎 API Response:", updateResponse);
        console.log("🔎 Response URL:", updateResponse.url);
        console.log("🔎 Response Status:", updateResponse.status);
        console.log("🔎 Response Text:", await updateResponse.text());
    } catch (error) {
        console.log(error)
    }
}
import { closeModal, modalAward } from "./main.js";

function handleModalAward(taskItem){
    modalAward.classList.add("modal__award")
    // lấy số coin ở task--item
    let coins = taskItem.querySelector('.task__item--coin span').innerText
    // gán vào content__coin--value ở modal
    let coinModal = modalAward.querySelector('.content__coin--value')
    coinModal.innerHTML = coins

    // dong modal khi click vao button / vung ngoai modal
    const contentAward = modalAward.querySelector('.modal__content')
    closeModal(modalAward,'modal__award',contentAward)
    modalAward.onclick = (e)=>{
        if(!e.target.closest('.modal')){
            modalAward.classList.remove('modal__award')
        }
    }
    // disable btn lại để tránh nhận coin nhiều lần:)))
    taskItem.querySelector('.btn__task--submit').classList.add('btn__disable')
    // cập nhật transacion history (lịch sử giao dịch)
    addHistoryTransacion({
        type: "task",
        details: "Nhận thưởng",
        amount: `+${coins} coin`,
        time: formatDate(new Date()),
        status: "Thành công"
    }) 
    
}