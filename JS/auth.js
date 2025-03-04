const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');
const logoutLink = document.querySelector('.logout-link');
const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    if (window.innerWidth <= 768) {
        navigation.classList.remove('active');
    }
});

iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});
 
//  Validate Đăng nhập
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let emailInput = loginForm.querySelector('input[type="email"]');
    let passwordInput = loginForm.querySelector('input[type="password"]');
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    if (!validateEmail(email)) {
        showError(emailInput, 'Email không hợp lệ!');
        return;
    }
    if (password.length < 6) {
        showError(passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    setTimeout(() => {
        window.location.href = "../HTML/connect_wallet.html";
    }, 500);
});

//  Validate Đăng ký
registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let usernameInput = registerForm.querySelector('input[type="text"]');
    let emailInput = registerForm.querySelector('input[type="email"]');
    let passwordInput = registerForm.querySelector('input[type="password"]');
    let checkboxInput = registerForm.querySelector('input[type="checkbox"]');

    let username = usernameInput.value.trim();
    let email = emailInput.value.trim();
    let password = passwordInput.value.trim();

    if (username.length < 3) {
        showError(usernameInput, 'Tên người dùng phải có ít nhất 3 ký tự!');
        return;
    }
    if (!validateEmail(email)) {
        showError(emailInput, 'Email không hợp lệ!');
        return;
    }
    if (password.length < 6) {
        showError(passwordInput, 'Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    if (!checkboxInput.checked) {
        alert('Bạn phải đồng ý với điều khoản và điều kiện!');
        return;
    }
    wrapper.classList.remove('active');
    this.submit();
});

//  Hàm kiểm tra email hợp lệ
function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//  Hàm hiển thị lỗi
function showError(inputElement, message) {
    alert(message);
    inputElement.focus();
}
//Hàm kết nối connect_wallet
function connect() {
    window.location.href = "../HTML/metamask-connect.html";
}
//ham quay lai install-metamask
function goBack() {
    window.history.back();
}
