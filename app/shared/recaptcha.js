let widgetId = null;
let renderPromise = null;
let resolveRender;
let rejectRender;

function createRenderPromise() {
if (!renderPromise) {
renderPromise = new Promise((resolve, reject) => {
resolveRender = resolve;
rejectRender = reject;
});
}


return renderPromise;


}
export async function getRecaptchaToken() {
    await createRenderPromise();

    if (widgetId === null) {
        throw new Error("CAPTCHA widget has not been rendered.");
    }

    const token = window.grecaptcha.getResponse(widgetId);

    if (!token) {
        throw new Error(
            "Please complete the 'I'm not a robot' CAPTCHA."
        );
    }

    return token;
}
export function renderRecaptcha(
containerId,
siteKey
) {
if (widgetId !== null) {
return;
}


createRenderPromise();

function renderWhenReady() {
    if (!window.grecaptcha ||
        typeof window.grecaptcha.render !== "function") {
        return;
    }

    try {
        widgetId = window.grecaptcha.render(
            containerId,
            {
                sitekey: siteKey,
                theme: "dark",
                callback: function () {},
                "expired-callback": function () {},
                "error-callback": function () {
                    console.error("reCAPTCHA encountered an error.");
                }
            }
        );

        resolveRender();
    } catch (error) {
        rejectRender(error);
        console.error("Unable to render reCAPTCHA:", error);
    }
}

if (window.grecaptcha?.render) {
    renderWhenReady();
} else {
    window.addEventListener(
        "recaptcha-api-ready",
        renderWhenReady,
        { once: true }
    );
}


}

// export async function getRecaptchaToken() {
// await createRenderPromise();


// if (widgetId === null ||
//     typeof window.grecaptcha?.getResponse !== "function") {
//     throw new Error("CAPTCHA is not ready. Please refresh and try again.");
// }

// const token = window.grecaptcha.getResponse(widgetId);

// if (!token) {
//     throw new Error(
//         "Please complete the 'I'm not a robot' CAPTCHA."
//     );
// }

// return token;


// }

export function resetRecaptcha() {
if (
widgetId !== null &&
typeof window.grecaptcha?.reset === "function"
) {
window.grecaptcha.reset(widgetId);
}
}
