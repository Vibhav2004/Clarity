// import { store, redirectIfAuthed, toast } from './shared/store.js';
// redirectIfAuthed();
// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const fd = new FormData(e.target);

//     const username = fd.get('username').toString().trim();
//     const email = fd.get('email').toString().trim();
//     const password = fd.get('password').toString();

//     const userData = {
//         userName: username,
//         email: email.toLowerCase(),
//         password: password
//     };

//     try {
//         const response = await fetch(API.registerUser(), {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(userData)
//         });

//         if (!response.ok) {
//             throw new Error('Registration failed');
//         }

//         const user = await response.json();

//         console.log('Registered User:', user);

//         toast('Registration Successful!');
//         window.location.href = 'dashboard.html';

//     } catch (error) {
//         console.error(error);
//         alert('Failed to register user');
//     }
// });

// import { redirectIfAuthed, toast } from './shared/store.js';
// import { getRecaptchaToken } from './shared/recaptcha.js';

// redirectIfAuthed();

// const registerForm = document.getElementById('registerForm');

// registerForm.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const submitButton = registerForm.querySelector(
//         'button[type="submit"]'
//     );

//     if (submitButton.disabled) return;

//     submitButton.disabled = true;

//     try {
//         const fd = new FormData(registerForm);

//         const username = fd.get('username').toString().trim();
//         const email = fd.get('email').toString().trim().toLowerCase();
//         const password = fd.get('password').toString();

//         // Generate a fresh token for this registration attempt.
//         const recaptchaToken = await getRecaptchaToken('register');

//         const userData = {
//             userName: username,
//             email: email,
//             password: password,
//             recaptchaToken: recaptchaToken
//         };

//         const response = await fetch(API.registerUser(), {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(userData)
//         });

//         if (!response.ok) {
//             const message = await response.text();

//             if (message.includes('CAPTCHA_VERIFICATION_FAILED')) {
//                 throw new Error(
//                     'Security verification failed. Please refresh and try again.'
//                 );
//             }

//             throw new Error(
//                 message || 'Registration failed. Please try again.'
//             );
//         }

//         const user = await response.json();

//         // Avoid logging user details or authentication-related data.
//         console.log('Registration successful.');

//         toast('Registration Successful!');
//         window.location.href = 'dashboard.html';

//     } catch (error) {
//         console.error('Registration error:', error);
//         alert(error.message || 'Failed to register user.');
//     } finally {
//         submitButton.disabled = false;
//     }
// });




import { redirectIfAuthed, toast } from './shared/store.js';
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
}, { once: true });
redirectIfAuthed();

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (e) => {
e.preventDefault();

const submitButton = registerForm.querySelector(
    'button[type="submit"]'
);

if (submitButton.disabled) return;
submitButton.disabled = true;

try {
    const fd = new FormData(registerForm);

    const username = String(fd.get('username') ?? '').trim();
    const email = String(fd.get('email') ?? '')
        .trim()
        .toLowerCase();
    const password = String(fd.get('password') ?? '');

    if (!username || !email || !password) {
        throw new Error('Please complete all required fields.');
    }

    // Read the completed v2 checkbox token.
  const recaptchaToken = await getRecaptchaToken();

console.log("CAPTCHA token type:", typeof recaptchaToken);
console.log("CAPTCHA token received:", Boolean(recaptchaToken));

    const userData = {
        userName: username,
        email,
        password,
        recaptchaToken
    };
console.log('User Data:', userData); // Log the user data for debugging purposes
    const response = await fetch(API.registerUser(), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });

    if (!response.ok) {
        const message = await response.text();

        if (message.includes('CAPTCHA_VERIFICATION_FAILED')) {
            throw new Error(
                'Security verification failed. Please complete the CAPTCHA again.'
            );
        }

        throw new Error(
            message || 'Registration failed. Please try again.'
        );
    }

    await response.json();

    console.log('Registration successful.');
    toast('Registration Successful!');
    window.location.href = 'dashboard.html';

} catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'Failed to register user.');

    resetRecaptcha();

} finally {
    submitButton.disabled = false;
}

});