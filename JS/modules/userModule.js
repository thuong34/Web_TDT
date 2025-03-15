import { getUsers, addUser, updateUser, deleteUser } from "../api/userApi.js";

const userList = document.getElementById("userList");
const userForm = document.getElementById("userForm");

//  Biến lưu user đang chỉnh sửa
let editingUserId = null;

//  Load danh sách người dùng
export async function renderUsers() {
    const users = await getUsers();
    userList.innerHTML = ""; 
    users.forEach(addUserToDOM);
}

//  Thêm hoặc cập nhật user
userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(userForm);
    const userData = {
        name: formData.get("name"),
        balance: { coin: Number(formData.get("coin")), usdt: 0 }, // Mặc định usdt = 0
    };

    if (editingUserId) {
        // Nếu đang chỉnh sửa → Cập nhật user
        await updateUser(editingUserId, userData);
        updateUserInDOM(editingUserId, userData);
        editingUserId = null; // Reset trạng thái
    } else {
        // Nếu không → Thêm mới user
        const newUser = await addUser(userData);
        if (newUser) addUserToDOM(newUser);
    }

    userForm.reset(); 
});

//  Thêm user vào DOM
function addUserToDOM(user) {
    const row = document.createElement("tr");
    row.dataset.id = user.id;
    row.innerHTML = `
        <td>${user.name}</td>
        <td>${user?.balance?.coin}</td>
        <td>
            <button class="btn-update" data-id="${user.id}">Sửa</button>
            <button class="btn-delete" data-id="${user.id}">Xóa</button>
        </td>
    `;
    userList.appendChild(row);
}

//  Cập nhật user trong DOM (không reload toàn bộ)
function updateUserInDOM(userId, updatedUser) {
    const row = document.querySelector(`tr[data-id='${userId}']`);
    if (row) {
        row.cells[0].textContent = updatedUser.name;
        row.cells[1].textContent = updatedUser.balance.coin;
    }
}

//  Xử lý sự kiện Sửa / Xóa bằng Event Delegation
userList.addEventListener("click", async (e) => {
    const userId = e.target.dataset.id;
    const row = e.target.closest("tr");

    //  Sửa user
    if (e.target.classList.contains("btn-update")) {
        editingUserId = userId; // Lưu ID user đang sửa
        userForm.elements["name"].value = row.cells[0].textContent;
        userForm.elements["coin"].value = row.cells[1].textContent;
        userForm.elements["name"].focus(); // Focus vào input để sửa
    }

    //  Xóa user
    if (e.target.classList.contains("btn-delete")) {
        if (confirm("Bạn có chắc muốn xóa?")) {
            await deleteUser(userId);
            row.remove(); 
        }
    }
});

renderUsers();