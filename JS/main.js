const navItems = document.querySelectorAll('.nav_item')
const contentItems = document.querySelectorAll('.content__item')
const navTitle = document.querySelector('.header__nav--title h1')

// xóa class active
function removeActive(arrItems){
    for(let i of arrItems){
        if(i.classList.contains('active')){
            i.classList.remove('active')
            break;
        }
    }
}

// chuyển nav main khi click
navItems.forEach((item, index)=>{
    item.addEventListener('click',()=>{
        removeActive(navItems)
        removeActive(contentItems)

        item.classList.add('active')
        contentItems[index].classList.add('active')
        navTitle.innerText = item.innerText
    })
})

const btnAwards = document.querySelectorAll(".task__item.success .btn__task--submit")
const btnConvert = document.querySelector(".btn__recent--convert")
const modals = document.querySelectorAll(".modal__wrapper")
const modalConvert = modals[0]
const modalAward = modals[1]

// mở modal convert
btnConvert.addEventListener('click',(e)=>{
    modalConvert.classList.add("modal__convert")
    const formConvert = modalConvert.querySelector('form.modal__content')
    let inputUsdt = formConvert.querySelector('[name="input__usdt"]')
    let inputCoin = formConvert.querySelector('[name="input__coin"]')
    
    formConvert.onsubmit = (e)=>{
        e.preventDefault()
        inputCoin.value = (Number(inputUsdt.value.trim())*100).toString()
        inputUsdt.focus()
        inputUsdt.value=""
    }
    // dong modal khi click button "hủy"
    closeModal(modalConvert,'modal__convert',formConvert)
    // dong modal khi click vao cung ngoai modal??
    modalConvert.onclick = (e)=>{
        if(!e.target.closest('.modal')){
            modalConvert.classList.remove('modal__convert')
        }
    }
})
//mo modal nhan thuong
btnAwards.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        modalAward.classList.add("modal__award")
        const formAward = modalAward.querySelector('.modal__btn')
        closeModal(modalAward,'modal__award',formAward)
        // dong modal khi click vao cung ngoai modal??
        modalAward.onclick = (e)=>{
            if(!e.target.closest('.modal')){
                modalAward.classList.remove('modal__award')
            }
        }
    })
})

// dong modal
function closeModal(modal,modalClass,modalForm){
    const btnDestroy = modalForm.querySelector('.modal__btn--nochange')
    btnDestroy.addEventListener('click',()=>{
        modal.classList.remove(modalClass)
    })
}

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
            window.location.href = "../HTML/Layout1.html"; // Chuyển trang
        });

        cancelLogout.addEventListener('click', () => {
            logoutPopup.style.display = "none"; // Đóng popup
        });
    }
});
//xoa tk

// Lấy các phần tử popup xóa tài khoản
const deletePopup = document.getElementById('delete-popup');
const deleteBtn = document.querySelector('.delete-link');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

// Hiển thị popup xóa tài khoản
deleteBtn.addEventListener('click', () => {
    deletePopup.style.display = 'flex';
});

// Đóng popup khi nhấn Hủy
cancelDeleteBtn.addEventListener('click', () => {
    deletePopup.style.display = 'none';
});

// Xử lý xóa tài khoản
confirmDeleteBtn.addEventListener('click', () => {
    alert("Tài khoản của bạn đã bị xóa!");
    window.location.href = "../HTML/Layout1.html"; // Điều hướng sau khi xóa
});
