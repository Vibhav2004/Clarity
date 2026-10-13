


import { store, redirectIfAuthed } from './shared/store.js';
import {
    renderRecaptcha,
    getRecaptchaToken,
    resetRecaptcha
} from "./shared/recaptcha.js";

window.addEventListener("recaptcha-api-ready", function () {
    renderRecaptcha(
        "registerCaptcha",
        "6LfZQ-gtAAAAAJ4oMYDd44mAyrKP9nw3iBMkboQ9"
    );
},)
redirectIfAuthed();

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
e.preventDefault();

const submitButton = loginForm.querySelector(
    'button[type="submit"]'
);

if (submitButton.disabled) return;
submitButton.disabled = true;

try {
    const fd = new FormData(loginForm);

    const email = String(fd.get('email') ?? '')
        .trim()
        .toLowerCase();

    const password = String(fd.get('password') ?? '');

    if (!email || !password) {
        throw new Error('Enter your email and password.');
    }

    // Read the completed v2 checkbox token.
     const recaptchaToken = await getRecaptchaToken();



    const loginData = {
        email,
        password,
        recaptchaToken
    };

    const response = await fetch(API.loginUser(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    });

    if (!response.ok) {
        const message = await response.text();

        if (message.includes('CAPTCHA_VERIFICATION_FAILED')) {
            throw new Error(
                'Security verification failed. Please complete the CAPTCHA again.'
            );
        }

        if (response.status === 401) {
            throw new Error('Invalid email or password.');
        }

        throw new Error('Login failed. Please try again.');
    }

    const data = await response.json();

    if (!data.sessionID || !data.email) {
        throw new Error('Invalid login response from the server.');
    }

    // Preserve your existing session and application state logic.
    const s = store.load();

    s.currentUser = data.email;
    localStorage.setItem('sessionId', data.sessionID);

    s.users[data.email] = {
        id: data.id,
        username: data.userName,
        email: data.email,
        plan: data.plan
    };

    store.save(s);

   
    window.location.href = 'dashboard.html';

} catch (error) {
    console.error('Login error:', error);
    alert(
        error.message ||
        'Unable to connect to server. Please try again.'
    );

    resetRecaptcha();

} finally {
    submitButton.disabled = false;
}

});
