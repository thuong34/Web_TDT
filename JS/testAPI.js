const todosAPI = "https://dummyjson.com/todos"
       
function getTasks(callback){
    fetch(todosAPI)
        .then((response)=>{
            return response.json()
        })
        .then(callback)
        .catch(err=>{
            console.log(err)
        })
}

function renderTasks(todos){
    const newTaskList = document.querySelector('.task__newList')
    const processingTaskList = document.querySelector('.task__processingList')

    const fakeTask = [
        { "id": 132, "todo": "Do something nice for someone you care about", "completed": "0:3:00", "userId": 152 },
        { "id": 21, "todo": "Memorize a poem", "completed": "3:3:05", "userId": 133 },
        { "id": 176, "todo": "Watch a classic movie", "completed": "0:0:10", "userId": 68 },
        { "id": 400, "todo": "Watch a documentary", "completed": "1:3:00", "userId": 84 }
    ]
    const todoList = todos["todos"]

    newTaskList.innerHTML = fakeTask.map((task)=>{
        return `<div class="col l-12 m-12 c-12">                                        
            <div class="task__item new">
                <div class="task__item--title">Nhiệm vụ ${task.id}:</div>
                <div class="task__item--body f-between">
                    <div class="task__item--text">${task.todo}</div>
                    <div class="task__item--number">
                        <div class="task__item--coin"><span>${task.userId} </span>Coin</div>
                        <div class="task__item--time">${task.completed}</div>
                    </div>
                </div>
                <div class="task__item--footer">
                    <button class="btn__task--submit">Nhận nhiệm vụ</button>
                    <button class="btn__task--delete btn__danger hidden">Xóa</button>
                </div>
            </div>                
        </div>`
    }).join('')

    processingTaskList.innerHTML = todoList.map((todo)=>{            
        return `<div class="col l-12 m-12 c-12">                                        
            <div class="task__item ${todo.completed ? 'success' : 'over'}">
                <div class="task__item--title">Nhiệm vụ ${todo.id}:</div>
                <div class="task__item--body f-between">
                    <div class="task__item--text">${todo.todo}</div>
                    <div class="task__item--number">
                        <div class="task__item--coin"><span>${todo.userId} </span>Coin</div>
                        <div class="task__item--time">${todo.completed}</div>
                    </div>
                </div>
                <div class="task__item--footer">
                    <button class="btn__task--submit" data-id="${todo.id}">${todo.completed ? "Nhận thưởng" : "Quá hạn"}</button>
                    <button class="btn__task--delete btn__danger" data-id="${todo.id}">Xóa</button>
                </div>
            </div>                
        </div>`
    }).join('')

    // Lắng nghe sự kiện click vào danh sách nhiệm vụ mới
    newTaskList.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn__task--submit")) {
            const taskItem = event.target.closest(".task__item.new");

            if (taskItem) {
                event.target.innerText = "Xác nhận hoàn thành";

                // Cập nhật class để phân biệt
                taskItem.classList.remove("new");
                taskItem.classList.add("processing");
                taskItem.querySelector('.btn__task--delete').classList.remove('hidden')

                // Thêm vào danh sách nhiệm vụ đang thực hiện
                processingTaskList.prepend(taskItem);
            }
        }
    }); 
    document.querySelector('.task__newList').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn__task--submit')) {
            let taskItem = e.target.closest('.task__item');
            let timeElement = taskItem.querySelector('.task__item--time');
            let btnContainer = taskItem.querySelector(".task__item--number");
            let coinElement = taskItem.querySelector(".task__item--coin"); 
    
            let timeStr = timeElement.innerText.trim();
            let [hours, minutes, seconds] = timeStr.split(":").map(Number);
            let totalTime = hours * 3600 + minutes * 60 + seconds;
    
            e.target.innerText = "Xác nhận hoàn thành";
            taskItem.classList.add("processing");
    
            let countdown = setInterval(() => {
                if (totalTime <= 0) {
                    clearInterval(countdown);
                    timeElement.innerText = "00:00:00";
                    taskItem.classList.remove("processing");
                    taskItem.classList.add("over");
    
                    taskItem.querySelector(".btn__task--submit").innerText = "Quá hạn";
                    btnContainer.innerHTML = `
                        ${coinElement.outerHTML} 
                        <div class="task__item--time">00:00:00</div>
                    `;
                    processingTaskList.appendChild(taskItem);
                    return;
                }
                totalTime--;
                let h = Math.floor(totalTime / 3600);
                let m = Math.floor((totalTime % 3600) / 60);
                let s = totalTime % 60;
    
                timeElement.innerText = `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
            }, 1000);
    
            // Lưu bộ đếm vào taskItem
            taskItem.countdown = countdown;
        }
    });
    // Xác nhận hoàn thành
    document.querySelector('.task__processingList').addEventListener("click", function (event) {
        if (event.target.innerText === "Xác nhận hoàn thành") {
            let taskItem = event.target.closest(".task__item.processing");
            if (!taskItem) return;
            // Dừng đếm ngược
            clearInterval(taskItem.countdown);
            // Chuyển trạng thái hoàn thành
            taskItem.classList.remove("processing");
            taskItem.classList.add("completed", "success");
            let timeElement = taskItem.querySelector(".task__item--time");
            // Cập nhật nút "Xác nhận hoàn thành" thành "Nhận thưởng"
            event.target.innerText = "Nhận thưởng";
            event.target.style.backgroundColor = "#00FF00";
            event.target.style.color = "white";
        }
    });
    // Xóa nhiệm vụ khỏi giao diện
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("btn__task--delete")) {
            let taskElement = event.target.closest(".task__item");
            if (taskElement) {
                taskElement.remove(); 
            }
        }
    }); 
    //chuyen huong nut quay lailai
    document.querySelector(".modal__btn--back").addEventListener("click", function () {
        window.location.href = "../html/index.html"; 
    });
}    
function start(){
    getTasks(renderTasks)
}
start()

