




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



    const userData = {
        userName: username,
        email,
        password,
        recaptchaToken
    };
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

   
    toast('Registration Successful!');
    window.location.href = 'login.html';

} catch (error) {
    console.error('Registration error:', error);
    alert(error.message || 'Failed to register user.');

    resetRecaptcha();

} finally {
    submitButton.disabled = false;
}

});