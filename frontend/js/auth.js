async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:4000/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("message").innerText = data.message;
    }
}

// Login on Enter key press
function handleLoginEnter(event) {
    if (event.key === "Enter") {
        login();
    }
}