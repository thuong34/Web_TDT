const API_URL = "http://localhost:3000/tasks"; 
export async function getTasks() {
    try {
        const response = await fetch(API_URL);
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi lấy nhiệm vụ:", error);
        return [];
    }
}

export async function addTask(task) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi thêm nhiệm vụ:", error);
    }
}

export async function updateTask(taskId, updatedTask) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedTask),
        });
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật nhiệm vụ:", error);
    }
}

export async function deleteTask(taskId) {
    try {
        await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
    } catch (error) {
        console.error("Lỗi khi xóa nhiệm vụ:", error);
    }
}