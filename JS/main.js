const navItems = document.querySelectorAll('.nav__item')
const contentItems = document.querySelectorAll('.content__item')
const navTitle = document.querySelector('.header__nav--title h1')

// xóa class active
function removeActive(arrItems) {
    for (let i of arrItems) {
        if (i.classList.contains('active')) {
            i.classList.remove('active')
            break;
        }
    }
}

// chuyển nav main khi click
navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        removeActive(navItems)
        removeActive(contentItems)

        item.classList.add('active')
        contentItems[index].classList.add('active')
        navTitle.innerText = item.innerText
        document.querySelector('input#nav__mobile').checked = false
    })
})

const btnConvert = document.querySelector(".btn__recent--convert")
const modals = document.querySelectorAll(".modal__wrapper")
const modalConvert = modals[0]
const modalAward = modals[1]

// mở modal convert
btnConvert.addEventListener('click', (e) => {
    modalConvert.classList.add("modal__convert")
    const formConvert = modalConvert.querySelector('form.modal__content')
    let inputUsdt = formConvert.querySelector('[name="input__usdt"]')
    let inputCoin = formConvert.querySelector('[name="input__coin"]')

    formConvert.onsubmit = (e) => {
        e.preventDefault()
        inputCoin.value = (Number(inputUsdt.value.trim()) * 100).toString()
        inputUsdt.focus()
        inputUsdt.value = ""
    }
    // dong modal khi click button "hủy"
    closeModal(modalConvert, 'modal__convert', formConvert)
    // dong modal khi click vao vung ngoai modal??
    modalConvert.onclick = (e) => {
        if (!e.target.closest('.modal')) {
            modalConvert.classList.remove('modal__convert')
        }
    }
})
// mở modal nhận thưởng
document.querySelector('.task__processingList').addEventListener('click', (e) => {
    const btnTaskSubmit = e.target.closest('.task__item.success .btn__task--submit')
    if (btnTaskSubmit) {
        modalAward.classList.add("modal__award")
        // lấy số coin ở task--item
        let taskItem = btnTaskSubmit.closest('.task__item.success')
        let coins = taskItem.querySelector('.task__item--coin span').innerText
        // gán vào content__coin--value ở modal
        let coinModal = modalAward.querySelector('.content__coin--value')
        coinModal.innerHTML = coins

        // dong modal khi click vao button / vung ngoai modal
        const formAward = modalAward.querySelector('.modal__btn')
        closeModal(modalAward, 'modal__award', formAward)
        modalAward.onclick = (e) => {
            if (!e.target.closest('.modal')) {
                modalAward.classList.remove('modal__award')
            }
        }
    }
})

// dong modal
function closeModal(modal, modalClass, modalForm) {
    const btnDestroy = modalForm.querySelector('.modal__btn--nochange')
    btnDestroy.addEventListener('click', () => {
        modal.classList.remove(modalClass)
    })
}

//dsach nhiệm vụ: bấm button chuyển task list
const toggleTaskList = (showNew) => {
    document.querySelector('.task__newList').classList.toggle('hidden', !showNew)
    document.querySelector('.task__processingList').classList.toggle('hidden', showNew)
}
// có thể dùng removeActive()
function toggleBtnOutline(btnCurrent, btnOther, isNotOutline) {
    btnCurrent.classList.toggle('active', isNotOutline)
    btnOther.classList.toggle('active', !isNotOutline)

}
const btnFilterNew = document.querySelector('.btn__filter--new')
const btnFilterCurrent = document.querySelector('.btn__filter--current')
btnFilterNew.addEventListener('click', function () {
    toggleTaskList(true)
    toggleBtnOutline(this, btnFilterCurrent, true) //###
})
btnFilterCurrent.addEventListener('click', function () {
    toggleTaskList(false)
    toggleBtnOutline(this, btnFilterNew, true)
})
// lọc nhiệm vụ bằng select điểm thưởng, thời gian
let selectTaskInput = document.querySelector('.task__filter--input')
selectTaskInput.onchange = (e) => {
    const sortBy = e.target.value
    // lấy newList ko có .hidden hoặc lấy processingList ko có .hidden
    const taskListContainer = document.querySelector('.task__newList:not(.hidden), .task__processingList:not(.hidden)')
    const tasks = Array.from(taskListContainer.querySelectorAll('.col'))

    tasks.sort((a, b) => {
        //doi tgian ra giay
        const timeToSeconds = (timeStr) => {
            const [hours, minutes, seconds] = timeStr.split(":").map(Number)
            return hours * 3600 + minutes * 60 + seconds
        }

        const aValue =
            sortBy === "1" ? timeToSeconds(a.querySelector('.task__item--time').innerText) : Number(a.querySelector('.task__item--coin span').innerText)
        const bValue =
            sortBy === "1" ? timeToSeconds(b.querySelector('.task__item--time').innerText) : Number(b.querySelector('.task__item--coin span').innerText)

        return aValue > bValue ? 1 : -1 //nếu a>b thì đổi vị trí
    })

    taskListContainer.innerHTML = "" //xóa để tránh bị trùng lặp dl
    tasks.forEach((task) => {
        taskListContainer.appendChild(task)
    })
}
// history button
const btnFilterHistorys = document.querySelectorAll('.history__filterBtn button')
btnFilterHistorys.forEach(btn => {
    btn.onclick = () => {
        document.querySelector('.history__filterBtn button.active').classList.remove('active')
        btn.classList.add('active')
    }
})
// Note: chưa đổi lại coin--> usdt
// chưa chuyển lại trang chủ khi bấm button ở modal
//logout
document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.querySelector('.logout-link');
    const logoutPopup = document.getElementById('logout-popup');
    const confirmLogout = document.getElementById('confirm-logout');
    const cancelLogout = document.getElementById('cancel-logout');

    if (logoutLink) {
        logoutLink.addEventListener('click', () => {
            logoutPopup.style.display = "flex"; // Hiển thị popup
        });

        confirmLogout.addEventListener('click', () => {
            window.location.href = "../HTML/auth.html"; // Chuyển trang
        });

        cancelLogout.addEventListener('click', () => {
            logoutPopup.style.display = "none"; // Đóng popup
        });
    }
});
//xoa tk

function handleDeleteTask(event) {
    if (event.target.classList.contains('btn__task--delete')) {
        let btnDelete = event.target
        let isDelete = confirm("Bạn có chắc chắn xóa nhiệm vụ này?")
        if (isDelete) {
            const taskItem = btnDelete.closest('.task__item')
            taskItem.remove()
        }
    }
}