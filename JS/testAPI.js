var todosAPI = "https://dummyjson.com/todos"

fetch(todosAPI)
    .then((response) => {
        return response.json()
    })
    .then((todos) => {
        const fakeTask = [{
            "id": 132,
            "todo": "Do something nice for someone you care about",
            "completed": "0:3:00",
            "userId": 152
        },
        {
            "id": 21,
            "todo": "Memorize a poem",
            "completed": "3:3:05",
            "userId": 133
        },
        {
            "id": 176,
            "todo": "Watch a classic movie",
            "completed": "0:0:50",
            "userId": 68
        },
        {
            "id": 400,
            "todo": "Watch a documentary",
            "completed": "1:3:00",
            "userId": 84
        }]
        const newTaskList = document.querySelector('.task__newList')
        const processingTaskList = document.querySelector('.task__processingList')
        const todoList = todos["todos"]

        const htmlNew = fakeTask.map((task) => {
            return `<div class="col l-12 m-12 c-12">                                        
                <div class="task__item new">
                    <div class="task__item--title">Nhiệm vụ ${task.id}:</div>
                    <div class="task__item--info f-between">
                        <div class="task__item--text">${task.todo}</div>
                        <div class="task__item--number">
                            <div class="task__item--coin"><span>${task.userId} </span>Coin</div>
                            <div class="task__item--time">${task.completed}</div>
                            <button class="btn__task--submit btn">Nhận nhiệm vụ</button>
                        </div>
                    </div>
                </div>                
            </div>`
        }).join('')
        newTaskList.innerHTML = htmlNew;
        // Bắt sự kiện khi nhấn "Nhận nhiệm vụ"
        document.querySelector('.task__newList').addEventListener('click', function (e) {
            if (e.target.classList.contains('btn__task--submit')) {
                let taskItem = e.target.closest('.task__item');
                let timeElement = taskItem.querySelector('.task__item--time');
                let btnContainer = taskItem.querySelector(".task__item--number");
                let coinElement = taskItem.querySelector(".task__item--coin"); // Lưu số Coin
        
                let timeStr = timeElement.innerText.trim();
                let [hours, minutes, seconds] = timeStr.split(":").map(Number);
                let totalTime = hours * 3600 + minutes * 60 + seconds;
        
                // Đổi nút thành "Đang thực hiện"
                e.target.innerText = "Đang thực hiện";
                e.target.disabled = true;
        
                // Thêm nút "Hoàn thành"
                let completeButton = document.createElement("button");
                completeButton.innerText = "Hoàn thành";
                completeButton.classList.add("btn__task--complete", "btn");
                completeButton.style.backgroundColor = "#007BFF";
                btnContainer.appendChild(completeButton);
        
                let countdown = setInterval(() => {
                    if (totalTime <= 0) {
                        clearInterval(countdown);
                        timeElement.innerText = "00:00:00";
                        taskItem.classList.remove("new");
                        if (!taskItem.classList.contains("completed")) { 
                            taskItem.classList.add("over");
                            btnContainer.innerHTML = `
                                ${coinElement.outerHTML} 
                                <div class="task__item--time">00:00:00</div>
                                <button class="btn__task--expired btn over-btn" style="background-color: #FE2020; color: white;">Quá hạn</button>
                            `;
                            processingTaskList.appendChild(taskItem);
                        }
                        return;
                    }
                    totalTime--;
                    let h = Math.floor(totalTime / 3600);
                    let m = Math.floor((totalTime % 3600) / 60);
                    let s = totalTime % 60;
        
                    timeElement.innerText = `${h}:${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
                }, 1000);
            }
        });
        
        // Sự kiện khi nhấn "Hoàn thành"
        document.querySelector('.task__newList').addEventListener('click', function (e) {
            if (e.target.classList.contains('btn__task--complete')) {
                let taskItem = e.target.closest('.task__item');
                let btnContainer = taskItem.querySelector(".task__item--number");
                let coinElement = taskItem.querySelector(".task__item--coin"); 
                let timeElement = taskItem.querySelector('.task__item--time');
        
                taskItem.classList.add("completed");
                taskItem.classList.remove("new");
                taskItem.classList.add("success");
        
                btnContainer.innerHTML = `
                    ${coinElement.outerHTML}
                    <div class="task__item--time">${timeElement.innerText}</div>
                    <button class="btn__task--submit btn" style="background-color: #00FF00; color: white;">Nhận thưởng</button>
                `;
                processingTaskList.appendChild(taskItem);
            }
        });
        

        const htmlProcessing = todoList.map((todo) => {
            return `<div class="col l-12 m-12 c-12">                                        
                <div class="task__item ${todo.completed ? 'success' : 'over'}">
                    <div class="task__item--title">Nhiệm vụ ${todo.id}:</div>
                    <div class="task__item--info f-between">
                        <div class="task__item--text">${todo.todo}</div>
                        <div class="task__item--number">
                            <div class="task__item--coin"><span>${todo.userId} </span>Coin</div>
                            <div class="task__item--time">${todo.completed}</div>
                            <button class="btn__task--submit btn">${todo.completed ? "Nhận thưởng" : "Quá hạn"}</button>
                        </div>
                    </div>
                </div>                
            </div>`
        }).join('')
        processingTaskList.innerHTML = htmlProcessing
        // console.log(htmlNew)
    })
    .catch((error) => {
        console.log(error)
    })