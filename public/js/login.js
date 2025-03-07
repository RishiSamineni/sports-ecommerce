document.getElementById("loginForm").addEventListener("submit", async (e) => {
    let valid = true;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous error messages
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validate email
    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required.';
        valid = false;
    }

    // Validate password
    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required.';
        valid = false;
    }

    // Prevent form submission if validation fails
    if (!valid) {
        e.preventDefault();
    }
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        window.location.href = "/shop.html";
    } else {
        alert(data.msg);
    }
});
