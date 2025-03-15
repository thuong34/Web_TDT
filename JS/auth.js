const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// 🔹 Gửi yêu cầu API Đăng nhập (Dùng API test từ Reqres)
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let email = loginForm.querySelector('input[name="email"]').value.trim();
    let password = loginForm.querySelector('input[name="password"]').value.trim();

    if (!validateEmail(email)) {
        showError('Email không hợp lệ!');
        return;
    }
    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }

    try {
        let response = await fetch("https://reqres.in/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        let data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Đăng nhập thành công!");
            window.location.href = "../page/connect_wallet.html";
        } else {
            showError(data.error || "Đăng nhập thất bại!");
        }
    } catch (error) {
        showError("Lỗi kết nối API!");
    }
});

// 🔹 Gửi yêu cầu API Đăng ký (Dùng API test từ Reqres)
registerForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    let username = registerForm.querySelector('input[name="username"]').value.trim();
    let email = registerForm.querySelector('input[name="email"]').value.trim();
    let password = registerForm.querySelector('input[name="password"]').value.trim();
    let checkbox = registerForm.querySelector('input[type="checkbox"]').checked;

    if (username.length < 3) {
        showError('Tên người dùng phải có ít nhất 3 ký tự!');
        return;
    }
    if (!validateEmail(email)) {
        showError('Email không hợp lệ!');
        return;
    }
    if (password.length < 6) {
        showError('Mật khẩu phải có ít nhất 6 ký tự!');
        return;
    }
    if (!checkbox) {
        showError('Bạn phải đồng ý với điều khoản và điều kiện!');
        return;
    }

    try {
        let response = await fetch("https://reqres.in/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });
        let data = await response.json();

        if (response.ok) {
            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            wrapper.classList.remove('active');
        } else {
            showError(data.error || "Đăng ký thất bại!");
        }
    } catch (error) {
        showError("Lỗi kết nối API!");
    }
});

//  Hàm kiểm tra email hợp lệ
function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

//  Hàm hiển thị lỗi
function showError(message) {
    alert(message);
}
//Hàm kết nối connect_wallet
function connect() {
    window.location.href = "../page/metamask_connect.html";
}
//ham quay lai install-metamask
function goBack() {
    window.history.back();
}