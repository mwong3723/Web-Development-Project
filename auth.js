document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        // API call to the backend
        console.log('Login attempt:', { email, password });
        
        // Simulate successful login
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            name: this.querySelector('input[type="text"]').value,
            email: this.querySelector('input[type="email"]').value,
            password: this.querySelectorAll('input[type="password"]')[0].value,
            confirmPassword: this.querySelectorAll('input[type="password"]')[1].value
        };

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // API call to the backend
        console.log('Register attempt:', formData);
        
        // Simulate successful registration
        alert('Registration successful! Please login.');
        document.querySelector('[data-bs-target="#login"]').click();
    });
});