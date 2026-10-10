// import { store, toast, redirectIfAuthed } from './shared/store.js';
// redirectIfAuthed();
// document.getElementById('loginForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const fd = new FormData(e.target);

//     const email = fd.get('email').toString().trim();
//     const password = fd.get('password').toString();

//     const loginData = {
//         email: email.toLowerCase(),
//         password: password
//     };

//     try {
//         const response = await fetch(API.loginUser(), {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(loginData)
//         });

//         if (!response.ok) {
//             alert('Invalid email or password');
//             return;
//         }

        

//         const data = await response.json();

// const s = store.load();
// console.log('Login Response:', data);
// s.currentUser = data.email;
// sessionStorage.setItem('sessionId', data.sessionID);
// s.users[data.email] = {
//     id: data.id,
//     username: data.userName,
//     email: data.email,
//     plan: data.plan
// };

// store.save(s);

// window.location.href = "dashboard.html";



//     } catch (error) {
//         console.error('Login Error:', error);
//         alert('Unable to connect to server');
//     }
// });

// import { store, redirectIfAuthed } from './shared/store.js';
// import { getRecaptchaToken } from './shared/recaptcha.js';

// redirectIfAuthed();

// const loginForm = document.getElementById('loginForm');

// loginForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const submitButton = loginForm.querySelector(
//         'button[type="submit"]'
//     );

//     if (submitButton.disabled) return;

//     submitButton.disabled = true;

//     try {
//         const fd = new FormData(loginForm);

//         const email = fd.get('email').toString().trim().toLowerCase();
//         const password = fd.get('password').toString();

//         // Generate a fresh token for this login attempt.
//         const recaptchaToken = await getRecaptchaToken('login');

//         const loginData = {
//             email: email,
//             password: password,
//             recaptchaToken: recaptchaToken
//         };

//         const response = await fetch(API.loginUser(), {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(loginData)
//         });

//         if (!response.ok) {
//             const message = await response.text();

//             if (message.includes('CAPTCHA_VERIFICATION_FAILED')) {
//                 alert(
//                     'Security verification failed. Please refresh and try again.'
//                 );
//             } else {
//                 // Keep login errors generic.
//                 alert('Invalid email or password');
//             }

//             return;
//         }

//         const data = await response.json();

//         // Preserve your existing session and application state logic.
//         const s = store.load();

//         s.currentUser = data.email;

//         sessionStorage.setItem('sessionId', data.sessionID);

//         s.users[data.email] = {
//             id: data.id,
//             username: data.userName,
//             email: data.email,
//             plan: data.plan
//         };

//         store.save(s);

//         console.log('Login successful.');

//         window.location.href = 'dashboard.html';

//     } catch (error) {
//         console.error('Login error:', error);

//         alert(
//             error.message || 'Unable to connect to server. Please try again.'
//         );
//     } finally {
//         submitButton.disabled = false;
//     }
// });


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

console.log("CAPTCHA token type:", typeof recaptchaToken);
console.log("CAPTCHA token received:", Boolean(recaptchaToken));

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
    sessionStorage.setItem('sessionId', data.sessionID);

    s.users[data.email] = {
        id: data.id,
        username: data.userName,
        email: data.email,
        plan: data.plan
    };

    store.save(s);

    console.log('Login successful.');
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