const API_USER_URL = "http://localhost:3000/users"; 

export async function getUsers() {
    try {
        const response = await fetch(API_USER_URL);
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi lấy danh sách user:", error);
        return [];
    }
}

export async function addUser(user) {
    try {
        const response = await fetch(API_USER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        });
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi thêm user:", error);
    }
}

export async function updateUser(userId, updatedUser) {
    try {
        const response = await fetch(`${API_USER_URL}/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser),
        });
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật user:", error);
    }
}

export async function deleteUser(userId) {
    try {
        await fetch(`${API_USER_URL}/${userId}`, { method: "DELETE" });
    } catch (error) {
        console.error("Lỗi khi xóa user:", error);
    }
}