async function getUserInfo() {
    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:3000/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        const user = await response.json();
        console.log("User Info:", user);
    } else {
        console.log("Unauthorized! Redirecting to login...");
        localStorage.removeItem('accessToken');
        window.location.href = "/assets/login.html";
    }
}

getUserInfo();