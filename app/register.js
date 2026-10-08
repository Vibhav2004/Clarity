import { store, redirectIfAuthed, toast } from './shared/store.js';
redirectIfAuthed();
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);

    const username = fd.get('username').toString().trim();
    const email = fd.get('email').toString().trim();
    const password = fd.get('password').toString();

    const userData = {
        userName: username,
        email: email.toLowerCase(),
        password: password
    };

    try {
        const response = await fetch(API.registerUser(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const user = await response.json();

        console.log('Registered User:', user);

        toast('Registration Successful!');
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error(error);
        alert('Failed to register user');
    }
});
