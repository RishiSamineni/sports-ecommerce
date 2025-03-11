document.getElementById("signupForm").addEventListener("submit", async (e) => {
    let valid = true;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Clear previous error messages
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validate username
    if (!username) {
        document.getElementById('usernameError').textContent = 'Username is required.';
        valid = false;
    }

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
    const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        alert("Signup successful. Please login.");
        window.location.href = "/login.html";
    } else {
        alert(data.msg);
    }
});
