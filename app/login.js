import { store, toast, redirectIfAuthed } from './shared/store.js';
redirectIfAuthed();
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fd = new FormData(e.target);

    const email = fd.get('email').toString().trim();
    const password = fd.get('password').toString();

    const loginData = {
        email: email.toLowerCase(),
        password: password
    };

    try {
        const response = await fetch(API.loginUser(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (!response.ok) {
            alert('Invalid email or password');
            return;
        }

        

        const data = await response.json();

const s = store.load();
console.log('Login Response:', data);
s.currentUser = data.email;
sessionStorage.setItem('sessionId', data.sessionID);
s.users[data.email] = {
    id: data.id,
    username: data.userName,
    email: data.email,
    plan: data.plan
};

store.save(s);

window.location.href = "dashboard.html";



    } catch (error) {
        console.error('Login Error:', error);
        alert('Unable to connect to server');
    }
});
