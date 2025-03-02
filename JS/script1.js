const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnlogin-popup');
const iconClose = document.querySelector('.icon-close');
// const menuToggle = document.querySelector('.menu-toggle');
// const navigation = document.querySelector('.navigation');
const logoutLink = document.querySelector('.logout-link');
// Lấy form đăng nhập & đăng ký
const loginForm = document.querySelector('.form-box.login form');
const registerForm = document.querySelector('.form-box.register form');

// Xử lý chuyển đổi giữa đăng nhập & đăng ký
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// Mở form đăng nhập
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
    if (window.innerWidth <= 768) {
        navigation.classList.remove('active');
    }
});

// Đóng form đăng nhập
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});



// document.addEventListener("DOMContentLoaded", function () {
//     const menuToggle = document.querySelector(".menu-toggle");
//     const mobileNav = document.querySelector(".mobile-nav");
//     const navItems = document.querySelectorAll(".main__nav li a");

//     // Hiển thị hoặc ẩn menu khi nhấn vào biểu tượng 3 gạch
//     menuToggle.addEventListener("click", function (event) {
//         event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
//         mobileNav.classList.toggle("active");
//     });

//     // Ẩn menu khi chọn một mục bất kỳ
//     navItems.forEach((item) => {
//         item.addEventListener("click", function () {
//             mobileNav.classList.remove("active");
//         });
//     });

//     // Ẩn menu khi click ra ngoài
//     document.addEventListener("click", function (event) {
//         if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
//             mobileNav.classList.remove("active");
//         }
//     });
// });


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

        // alert('Đăng nhập thành công!');
        // Chuyển hướng sau khi đăng nhập
        setTimeout(() => {
            window.location.href = "../HTML/Layout2.html";
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

        // alert('Đăng ký thành công!');
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
    //ham quay lai layout3
    function goBack() {
        window.history.back();
    }

    //connect Metamask
    function connect() {
        window.location.href = "../HTML/Layout4.html";
    }
    //connnect trang chuchu
    function connectMetaMask() {
        window.location.href = "../HTML/Layout5.html";
    }

