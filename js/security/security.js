// // (function (globalScope) {
// //   "use strict";

// //   const MAX_EMAIL_LENGTH = 254;
// //   const MAX_NAME_LENGTH = 200;
// //   const MAX_JSON_LENGTH = 1048576;
// //   const SESSION_ID_LENGTH = 20;
// //   const VALID_PLANS = ["FREE", "PRO", "PREMIUM"];
// //   const VALID_DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

// //   function hasControlCharacters(value) {
// //     return /[\u0000-\u001F\u007F]/.test(value);
// //   }

// //   function isString(value) {
// //     return typeof value === "string";
// //   }

// //   function decodeSafely(value) {
// //     if (!isString(value) || value.length === 0) {
// //       return value;
// //     }

// //     let decoded = value;
// //     for (let i = 0; i < 3; i += 1) {
// //       try {
// //         const nextValue = decodeURIComponent(decoded);
// //         if (nextValue === decoded) {
// //           break;
// //         }
// //         decoded = nextValue;
// //       } catch (error) {
// //         break;
// //       }
// //     }

// //     return decoded;
// //   }

// //   function containsHtml(value) {
// //     if (!isString(value) || value.length === 0) {
// //       return false;
// //     }

// //     const normalized = value.toLowerCase();
// //     if (/(?:&lt;|&gt;|&#x3c;|&#x3e;)/i.test(normalized)) {
// //       return true;
// //     }

// //     if (/[<>]/.test(value)) {
// //       return /(?:<\s*(?:script|iframe|object|embed|svg|img|style|link|meta)|<\s*\/\s*(?:script|iframe|object|embed|svg|img|style|link|meta))/i.test(value);
// //     }

// //     return false;
// //   }

// //   function containsJavascriptPattern(value) {
// //     if (!isString(value) || value.length === 0) {
// //       return false;
// //     }

// //     const normalized = value.toLowerCase();
// //     return /(?:javascript\s*:|vbscript\s*:|data\s*:\s*text\/html|on\w+\s*=|srcdoc\s*=)/i.test(normalized);
// //   }

// //   function containsEncodedAttack(value) {
// //     if (!isString(value) || value.length === 0) {
// //       return false;
// //     }

// //     const decodedValue = decodeSafely(value);
// //     if (decodedValue !== value && (containsHtml(decodedValue) || containsJavascriptPattern(decodedValue))) {
// //       return true;
// //     }

// //     return /%(?:3c|3e|3c|2f|3d|27|22)|(?:%0a|%0d)/i.test(value) && (containsHtml(decodeSafely(value)) || containsJavascriptPattern(decodeSafely(value)));
// //   }

// //   function containsSuspiciousContent(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     return containsHtml(value) || containsJavascriptPattern(value) || containsEncodedAttack(value);
// //   }

// //   function sanitizeText(value) {
// //     if (!isString(value)) {
// //       return "";
// //     }

// //     let sanitized = value.replace(/[\u0000-\u001F\u007F]+/g, " ");
// //     sanitized = sanitized.replace(/<script[\s\S]*?<\/script>/gi, " ");
// //     sanitized = sanitized.replace(/<[^>]*>/g, " ");
// //     sanitized = sanitized.replace(/&nbsp;/gi, " ");
// //     sanitized = sanitized.replace(/\s+/g, " ").trim();
// //     return sanitized;
// //   }

// //   function ensureDomPurify() {
// //     if (typeof globalScope.DOMPurify === "function") {
// //       return true;
// //     }

// //     if (typeof document === "undefined") {
// //       return false;
// //     }

// //     const scriptTag = document.querySelector('script[data-clarity-dompurify="true"]');
// //     if (scriptTag) {
// //       return true;
// //     }

// //     const script = document.createElement("script");
// //     script.src = "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js";
// //     script.async = false;
// //     script.setAttribute("data-clarity-dompurify", "true");
// //     document.head.appendChild(script);
// //     return true;
// //   }

// //   function sanitizeWithDOMPurify(value) {
// //     if (!isString(value)) {
// //       return "";
// //     }

// //     if (typeof globalScope.DOMPurify === "function") {
// //       return globalScope.DOMPurify.sanitize(value, {
// //         ALLOWED_TAGS: [],
// //         ALLOWED_ATTR: []
// //       });
// //     }

// //     ensureDomPurify();
// //     if (typeof globalScope.DOMPurify === "function") {
// //       return globalScope.DOMPurify.sanitize(value, {
// //         ALLOWED_TAGS: [],
// //         ALLOWED_ATTR: []
// //       });
// //     }

// //     return sanitizeText(value);
// //   }

// //   function ensureTextLength(value, maxLength) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     if (maxLength && value.length > maxLength) {
// //       return false;
// //     }

// //     return true;
// //   }

// //   function validateEmail(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     if (value.length > MAX_EMAIL_LENGTH || value !== value.trim()) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(value) || hasControlCharacters(value)) {
// //       return false;
// //     }

// //     const emailPattern = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
// //     return emailPattern.test(value);
// //   }

// //   function validateUsername(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     const username = value.trim();
// //     if (username.length < 3 || username.length > 30) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(username) || hasControlCharacters(username)) {
// //       return false;
// //     }

// //     return /^[A-Za-z0-9_.-]+$/.test(username);
// //   }

// //   function validatePassword(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     if (value.length < 12 || value.length > 128) {
// //       return false;
// //     }

// //     if (hasControlCharacters(value)) {
// //       return false;
// //     }

// //     return true;
// //   }

// //   function validateSessionId(value) {
// //     if (!isString(value) || value.length !== SESSION_ID_LENGTH) {
// //       return false;
// //     }

// //     if (value.trim() !== value || hasControlCharacters(value)) {
// //       return false;
// //     }

// //     return /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?~`|]+$/.test(value);
// //   }

// //   function validateName(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     const trimmed = value.trim();
// //     if (trimmed.length === 0 || trimmed.length > MAX_NAME_LENGTH) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(trimmed) || hasControlCharacters(trimmed)) {
// //       return false;
// //     }

// //     return true;
// //   }

// //   function validateText(value, maxLength) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     const safeMaxLength = Number.isFinite(maxLength) ? maxLength : 2000;
// //     const trimmed = value.trim();

// //     if (trimmed.length === 0 || trimmed.length > safeMaxLength) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(trimmed) || hasControlCharacters(trimmed)) {
// //       return false;
// //     }

// //     return true;
// //   }

// //   function validateOptionalText(value, maxLength) {
// //     if (value === null || typeof value === "undefined" || value === "") {
// //       return true;
// //     }

// //     return validateText(value, maxLength);
// //   }

// //   function validateCategory(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     const trimmed = value.trim();
// //     if (!trimmed || trimmed.length > 100) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(trimmed) || hasControlCharacters(trimmed)) {
// //       return false;
// //     }

// //     return /^[A-Za-z0-9][A-Za-z0-9 _./-]*$/.test(trimmed);
// //   }

// //   function validateDifficulty(value) {
// //     return VALID_DIFFICULTIES.includes(value);
// //   }

// //   function validatePositiveInteger(value) {
// //     return Number.isInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
// //   }

// //   function validateId(value) {
// //     if (Number.isInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER) {
// //       return true;
// //     }

// //     if (!isString(value)) {
// //       return false;
// //     }

// //     const trimmed = value.trim();
// //     if (!trimmed || trimmed.length > 64) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(trimmed) || hasControlCharacters(trimmed)) {
// //       return false;
// //     }

// //     return /^[A-Za-z0-9_-]+$/.test(trimmed);
// //   }

// //   function validateUrl(value) {
// //     if (!isString(value) || value.length > 2048) {
// //       return false;
// //     }

// //     if (value !== value.trim() || containsSuspiciousContent(value) || hasControlCharacters(value)) {
// //       return false;
// //     }

// //     try {
// //       const parsedUrl = new URL(value);
// //       return (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") && !/^(?:javascript:|data:)/i.test(value);
// //     } catch (error) {
// //       return false;
// //     }
// //   }

// //   function validatePlan(value) {
// //     if (!isString(value)) {
// //       return false;
// //     }

// //     return VALID_PLANS.includes(value.trim().toUpperCase());
// //   }

// //   function validateBoolean(value) {
// //     return value === true || value === false;
// //   }

// //   function validateJsonString(value) {
// //     if (!isString(value) || value.length === 0 || value.length > MAX_JSON_LENGTH) {
// //       return false;
// //     }

// //     if (containsSuspiciousContent(value) || hasControlCharacters(value)) {
// //       return false;
// //     }

// //     try {
// //       JSON.parse(value);
// //       return true;
// //     } catch (error) {
// //       return false;
// //     }
// //   }

// //   function validateLoginPayload(email, password) {
// //     if (!validateEmail(email)) {
// //       return { valid: false, field: "email", message: "Please enter a valid email address." };
// //     }

// //     if (!validatePassword(password)) {
// //       return { valid: false, field: "password", message: "Password must be 12–128 characters with no control characters." };
// //     }

// //     return { valid: true, field: null, message: "Payload is valid." };
// //   }

// //   function validateRegisterPayload(username, email, password) {
// //     if (!validateUsername(username)) {
// //       return { valid: false, field: "username", message: "Username must be 3–30 characters using letters, numbers, underscore, dot, or hyphen." };
// //     }

// //     if (!validateEmail(email)) {
// //       return { valid: false, field: "email", message: "Please enter a valid email address." };
// //     }

// //     if (!validatePassword(password)) {
// //       return { valid: false, field: "password", message: "Password must be 12–128 characters with no control characters." };
// //     }

// //     return { valid: true, field: null, message: "Payload is valid." };
// //   }

// //   function validateEditPasswordPayload(email, password, sessionId) {
// //     if (!validateEmail(email)) {
// //       return { valid: false, field: "email", message: "Please enter a valid email address." };
// //     }

// //     if (!validatePassword(password)) {
// //       return { valid: false, field: "password", message: "Password must be 12–128 characters with no control characters." };
// //     }

// //     if (!validateSessionId(sessionId)) {
// //       return { valid: false, field: "sessionID", message: "Session ID is invalid or missing." };
// //     }

// //     return { valid: true, field: null, message: "Payload is valid." };
// //   }

// //   function validateOtpPayload(email, otp) {
// //     if (!validateEmail(email)) {
// //       return { valid: false, field: "email", message: "Please enter a valid email address." };
// //     }

// //     if (!validateText(otp, 12) || !/^[0-9]+$/.test(otp.trim())) {
// //       return { valid: false, field: "otp", message: "OTP must be a numeric code." };
// //     }

// //     return { valid: true, field: null, message: "Payload is valid." };
// //   }

// //   const security = {
// //     MAX_EMAIL_LENGTH,
// //     MAX_NAME_LENGTH,
// //     SESSION_ID_LENGTH,
// //     VALID_DIFFICULTIES,
// //     VALID_PLANS,
// //     containsHtml,
// //     containsJavascriptPattern,
// //     containsEncodedAttack,
// //     containsSuspiciousContent,
// //     sanitizeText,
// //     sanitizeWithDOMPurify,
// //     validateEmail,
// //     validateUsername,
// //     validatePassword,
// //     validateSessionId,
// //     validateName,
// //     validateText,
// //     validateOptionalText,
// //     validateCategory,
// //     validateDifficulty,
// //     validatePositiveInteger,
// //     validateId,
// //     validateUrl,
// //     validatePlan,
// //     validateBoolean,
// //     validateJsonString,
// //     validateLoginPayload,
// //     validateRegisterPayload,
// //     validateEditPasswordPayload,
// //     validateOtpPayload
// //   };

// //   if (typeof module !== "undefined" && module.exports) {
// //     module.exports = security;
// //   }

// //   globalScope.CLARITY_SECURITY = security;
// // })(typeof window !== "undefined" ? window : globalThis);
// (function (globalScope) {
//   "use strict";

//   /*
//    * CLARITY centralized frontend security/validation module.
//    *
//    * IMPORTANT:
//    * This is a frontend validation layer.
//    * It does NOT replace backend validation, authentication,
//    * authorization, ownership checks, rate limiting, etc.
//    */

//   const MAX_EMAIL_LENGTH = 254;
//   const MIN_USERNAME_LENGTH = 3;
//   const MAX_USERNAME_LENGTH = 30;

//   const MIN_PASSWORD_LENGTH = 12;
//   const MAX_PASSWORD_LENGTH = 128;

//   const MAX_NAME_LENGTH = 200;
//   const MAX_TEXT_LENGTH = 5000;
//   const MAX_CATEGORY_LENGTH = 100;
//   const MAX_DIFFICULTY_LENGTH = 50;
//   const MAX_ID_LENGTH = 64;
//   const MAX_URL_LENGTH = 2048;

//   const MAX_JSON_LENGTH = 1024 * 1024; // 1 MB

//   const SESSION_ID_LENGTH = 20;

//   const VALID_PLANS = Object.freeze([
//     "FREE",
//     "PRO",
//     "PREMIUM"
//   ]);

//   const VALID_DIFFICULTIES = Object.freeze([
//     "Beginner",
//     "Intermediate",
//     "Advanced"
//   ]);

//   /*
//    * Characters allowed in the session ID generated by CLARITY.
//    *
//    * Keep this synchronized with your session ID generator.
//    */
//   const SESSION_ID_PATTERN =
//     /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.?/~`|]+$/;

//   /*
//    * ------------------------------------------------------------
//    * Basic helpers
//    * ------------------------------------------------------------
//    */

//   function isString(value) {
//     return typeof value === "string";
//   }

//   function hasControlCharacters(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     /*
//      * Reject ASCII control characters.
//      *
//      * TAB (09), LF (0A), CR (0D) are also rejected intentionally
//      * because API fields such as email, username, session ID, etc.
//      * should not contain them.
//      */
//     return /[\u0000-\u001F\u007F]/.test(value);
//   }

//   function isNullOrUndefined(value) {
//     return value === null || typeof value === "undefined";
//   }

//   function normalizeForSecurity(value) {
//     if (!isString(value)) {
//       return "";
//     }

//     let normalized = value;

//     /*
//      * Decode multiple layers because attackers can encode payloads.
//      */
//     for (let i = 0; i < 5; i += 1) {
//       try {
//         const decoded = decodeURIComponent(normalized);

//         if (decoded === normalized) {
//           break;
//         }

//         normalized = decoded;
//       } catch (error) {
//         break;
//       }
//     }

//     /*
//      * Decode common HTML entities.
//      *
//      * This is intentionally lightweight and only used for
//      * detection, not as an HTML parser.
//      */
//     normalized = normalized
//       .replace(/&lt;/gi, "<")
//       .replace(/&gt;/gi, ">")
//       .replace(/&quot;/gi, '"')
//       .replace(/&#39;/gi, "'")
//       .replace(/&#x27;/gi, "'")
//       .replace(/&#x2f;/gi, "/")
//       .replace(/&#47;/gi, "/")
//       .replace(/&#x3c;/gi, "<")
//       .replace(/&#x3e;/gi, ">");

//     return normalized;
//   }

//   /*
//    * ------------------------------------------------------------
//    * XSS / suspicious input detection
//    * ------------------------------------------------------------
//    *
//    * These functions are intentionally detection-oriented.
//    * They are NOT intended to be a complete XSS engine.
//    */

//   function containsHtml(value) {
//     if (!isString(value) || value.length === 0) {
//       return false;
//     }

//     const normalized = normalizeForSecurity(value);

//     /*
//      * Any actual HTML tag is suspicious for fields that are
//      * expected to contain plain text.
//      */
//     if (/<\s*\/?\s*[a-z][^>]*>/i.test(normalized)) {
//       return true;
//     }

//     /*
//      * HTML comments / declarations.
//      */
//     if (/<!--[\s\S]*?-->/i.test(normalized)) {
//       return true;
//     }

//     if (/<!(?:doctype|--)/i.test(normalized)) {
//       return true;
//     }

//     return false;
//   }

//   function containsJavascriptPattern(value) {
//     if (!isString(value) || value.length === 0) {
//       return false;
//     }

//     const normalized = normalizeForSecurity(value);

//     /*
//      * javascript:, vbscript:, data:text/html
//      */
//     if (
//       /(?:javascript\s*:|vbscript\s*:)/i.test(normalized) ||
//       /data\s*:\s*(?:text\/html|application\/javascript|text\/javascript)/i.test(
//         normalized
//       )
//     ) {
//       return true;
//     }

//     /*
//      * Inline event handlers:
//      * onclick=
//      * onerror=
//      * onload=
//      * onfocus=
//      * etc.
//      */
//     if (/\bon[a-z]+\s*=/i.test(normalized)) {
//       return true;
//     }

//     /*
//      * iframe srcdoc.
//      */
//     if (/\bsrcdoc\s*=/i.test(normalized)) {
//       return true;
//     }

//     /*
//      * Common JavaScript execution constructs.
//      *
//      * We intentionally do NOT reject every occurrence of words such
//      * as "eval" because legitimate text may contain them.
//      */
//     if (
//       /\b(?:window|document)\s*\.\s*(?:location|cookie|write|writeln)\b/i.test(
//         normalized
//       )
//     ) {
//       return true;
//     }

//     return false;
//   }

//   function containsEncodedAttack(value) {
//     if (!isString(value) || value.length === 0) {
//       return false;
//     }

//     const normalized = normalizeForSecurity(value);

//     if (normalized !== value) {
//       if (
//         containsHtml(normalized) ||
//         containsJavascriptPattern(normalized)
//       ) {
//         return true;
//       }
//     }

//     /*
//      * Explicit encoded markers.
//      */
//     if (
//       /%(?:3c|3e|2f|22|27|3d|00|0a|0d)/i.test(value)
//     ) {
//       if (
//         containsHtml(normalized) ||
//         containsJavascriptPattern(normalized)
//       ) {
//         return true;
//       }
//     }

//     return false;
//   }

//   function containsSuspiciousContent(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     return (
//       containsHtml(value) ||
//       containsJavascriptPattern(value) ||
//       containsEncodedAttack(value)
//     );
//   }

//   /*
//    * ------------------------------------------------------------
//    * Sanitization
//    * ------------------------------------------------------------
//    *
//    * Validation and sanitization are intentionally separate.
//    *
//    * For CLARITY's normal API fields, REJECT suspicious input rather
//    * than silently modifying it.
//    */

//   function sanitizeText(value) {
//     if (!isString(value)) {
//       return "";
//     }

//     return value
//       .replace(/[\u0000-\u001F\u007F]/g, " ")
//       .replace(/<[^>]*>/g, " ")
//       .replace(/\s+/g, " ")
//       .trim();
//   }

//   let domPurifyPromise = null;

//   function loadDOMPurify() {
//     if (typeof globalScope.DOMPurify === "object") {
//       return Promise.resolve(globalScope.DOMPurify);
//     }

//     if (typeof globalScope.DOMPurify === "function") {
//       return Promise.resolve(globalScope.DOMPurify);
//     }

//     if (typeof document === "undefined") {
//       return Promise.resolve(null);
//     }

//     if (domPurifyPromise) {
//       return domPurifyPromise;
//     }

//     domPurifyPromise = new Promise(function (resolve) {
//       const existingScript = document.querySelector(
//         'script[data-clarity-dompurify="true"]'
//       );

//       if (existingScript) {
//         if (typeof globalScope.DOMPurify !== "undefined") {
//           resolve(globalScope.DOMPurify);
//           return;
//         }

//         existingScript.addEventListener(
//           "load",
//           function () {
//             resolve(globalScope.DOMPurify || null);
//           },
//           { once: true }
//         );

//         existingScript.addEventListener(
//           "error",
//           function () {
//             resolve(null);
//           },
//           { once: true }
//         );

//         return;
//       }

//       const script = document.createElement("script");

//       script.src =
//         "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js";

//       script.async = true;
//       script.setAttribute(
//         "data-clarity-dompurify",
//         "true"
//       );

//       script.onload = function () {
//         resolve(globalScope.DOMPurify || null);
//       };

//       script.onerror = function () {
//         resolve(null);
//       };

//       document.head.appendChild(script);
//     });

//     return domPurifyPromise;
//   }

//   async function sanitizeWithDOMPurify(value) {
//     if (!isString(value)) {
//       return "";
//     }

//     const purify = await loadDOMPurify();

//     if (!purify || typeof purify.sanitize !== "function") {
//       return sanitizeText(value);
//     }

//     return purify.sanitize(value, {
//       ALLOWED_TAGS: [],
//       ALLOWED_ATTR: []
//     });
//   }

//   /*
//    * ------------------------------------------------------------
//    * Generic validation helpers
//    * ------------------------------------------------------------
//    */

//   function validateStringLength(value, minLength, maxLength) {
//     if (!isString(value)) {
//       return false;
//     }

//     return (
//       value.length >= minLength &&
//       value.length <= maxLength
//     );
//   }

//   function isSafePlainText(value, maxLength) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (value.length > maxLength) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     if (containsSuspiciousContent(value)) {
//       return false;
//     }

//     return true;
//   }

//   /*
//    * ------------------------------------------------------------
//    * Field validators
//    * ------------------------------------------------------------
//    */

//   function validateEmail(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (
//       value.length === 0 ||
//       value.length > MAX_EMAIL_LENGTH
//     ) {
//       return false;
//     }

//     if (value !== value.trim()) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     if (containsSuspiciousContent(value)) {
//       return false;
//     }

//     /*
//      * Practical email validation.
//      *
//      * The backend should still perform authoritative email
//      * validation and verification.
//      */
//     const emailPattern =
//       /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;

//     if (!emailPattern.test(value)) {
//       return false;
//     }

//     /*
//      * Prevent malformed local/domain components.
//      */
//     if (value.includes("..")) {
//       return false;
//     }

//     const parts = value.split("@");

//     if (parts.length !== 2) {
//       return false;
//     }

//     const localPart = parts[0];
//     const domainPart = parts[1];

//     if (
//       localPart.length === 0 ||
//       localPart.length > 64 ||
//       domainPart.length === 0
//     ) {
//       return false;
//     }

//     if (
//       domainPart.startsWith("-") ||
//       domainPart.endsWith("-")
//     ) {
//       return false;
//     }

//     return true;
//   }

//   function validateUsername(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     const username = value.trim();

//     if (
//       username.length < MIN_USERNAME_LENGTH ||
//       username.length > MAX_USERNAME_LENGTH
//     ) {
//       return false;
//     }

//     if (username !== value) {
//       return false;
//     }

//     if (hasControlCharacters(username)) {
//       return false;
//     }

//     if (containsSuspiciousContent(username)) {
//       return false;
//     }

//     /*
//      * Existing CLARITY contract:
//      * letters, numbers, underscore, dot, hyphen.
//      */
//     return /^[A-Za-z0-9_.-]+$/.test(username);
//   }

//   function validatePassword(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (
//       value.length < MIN_PASSWORD_LENGTH ||
//       value.length > MAX_PASSWORD_LENGTH
//     ) {
//       return false;
//     }

//     /*
//      * Passwords are NOT sanitized.
//      *
//      * Spaces and special characters are allowed.
//      * Only control characters are rejected.
//      */
//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     return true;
//   }

//   function validateSessionId(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (value.length !== SESSION_ID_LENGTH) {
//       return false;
//     }

//     if (value !== value.trim()) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     /*
//      * Session IDs generated by CLARITY should never contain
//      * HTML delimiters.
//      */
//     if (/[<>]/.test(value)) {
//       return false;
//     }

//     return SESSION_ID_PATTERN.test(value);
//   }

//   function validateName(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     const trimmed = value.trim();

//     if (
//       trimmed.length === 0 ||
//       trimmed.length > MAX_NAME_LENGTH
//     ) {
//       return false;
//     }

//     if (trimmed !== value) {
//       return false;
//     }

//     return isSafePlainText(trimmed, MAX_NAME_LENGTH);
//   }

//   function validateText(value, maxLength) {
//     if (!isString(value)) {
//       return false;
//     }

//     const limit =
//       Number.isInteger(maxLength) && maxLength > 0
//         ? maxLength
//         : MAX_TEXT_LENGTH;

//     const trimmed = value.trim();

//     if (
//       trimmed.length === 0 ||
//       trimmed.length > limit
//     ) {
//       return false;
//     }

//     if (trimmed !== value) {
//       return false;
//     }

//     return isSafePlainText(trimmed, limit);
//   }

//   function validateOptionalText(value, maxLength) {
//     if (
//       isNullOrUndefined(value) ||
//       value === ""
//     ) {
//       return true;
//     }

//     return validateText(value, maxLength);
//   }

//   function validateCategory(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     const category = value.trim();

//     if (
//       category.length === 0 ||
//       category.length > MAX_CATEGORY_LENGTH
//     ) {
//       return false;
//     }

//     if (category !== value) {
//       return false;
//     }

//     if (hasControlCharacters(category)) {
//       return false;
//     }

//     if (containsSuspiciousContent(category)) {
//       return false;
//     }

//     /*
//      * Allows examples such as:
//      * Web Development
//      * AI/ML
//      * Data Science
//      * Java-Spring
//      */
//     return /^[A-Za-z0-9][A-Za-z0-9 _./&+-]*$/.test(category);
//   }

//   function validateDifficulty(value) {
//     return (
//       isString(value) &&
//       VALID_DIFFICULTIES.includes(value)
//     );
//   }

//   function validateNonNegativeInteger(value) {
//     return (
//       Number.isInteger(value) &&
//       value >= 0 &&
//       value <= Number.MAX_SAFE_INTEGER
//     );
//   }

//   function validatePositiveInteger(value) {
//     return (
//       Number.isInteger(value) &&
//       value > 0 &&
//       value <= Number.MAX_SAFE_INTEGER
//     );
//   }

//   function validateId(value) {
//     /*
//      * Numeric database IDs.
//      */
//     if (Number.isInteger(value)) {
//       return (
//         value >= 0 &&
//         value <= Number.MAX_SAFE_INTEGER
//       );
//     }

//     if (!isString(value)) {
//       return false;
//     }

//     if (value.length === 0 || value.length > MAX_ID_LENGTH) {
//       return false;
//     }

//     if (value !== value.trim()) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     if (containsSuspiciousContent(value)) {
//       return false;
//     }

//     return /^[A-Za-z0-9_-]+$/.test(value);
//   }

//   function validateUrl(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (
//       value.length === 0 ||
//       value.length > MAX_URL_LENGTH
//     ) {
//       return false;
//     }

//     if (value !== value.trim()) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     /*
//      * Never allow JavaScript/data/vbscript schemes.
//      */
//     if (
//       /^(?:javascript|vbscript|data):/i.test(value)
//     ) {
//       return false;
//     }

//     try {
//       const parsedUrl = new URL(value);

//       if (
//         parsedUrl.protocol !== "http:" &&
//         parsedUrl.protocol !== "https:"
//       ) {
//         return false;
//       }

//       /*
//        * HTTP/HTTPS URL itself is acceptable.
//        * Suspicious HTML/JS payloads are still rejected.
//        */
//       if (containsSuspiciousContent(value)) {
//         return false;
//       }

//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   function validatePlan(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     return VALID_PLANS.includes(
//       value.trim().toUpperCase()
//     );
//   }

//   function validateBoolean(value) {
//     return value === true || value === false;
//   }

//   /*
//    * JSON validation is deliberately separate from XSS validation.
//    *
//    * JSON can legitimately contain strings such as:
//    * "<div>"
//    *
//    * Whether those strings are allowed depends on the schema
//    * of the individual JSON field.
//    */
//   function validateJsonString(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     if (
//       value.length === 0 ||
//       value.length > MAX_JSON_LENGTH
//     ) {
//       return false;
//     }

//     if (hasControlCharacters(value)) {
//       return false;
//     }

//     try {
//       const parsed = JSON.parse(value);

//       return (
//         parsed !== undefined &&
//         parsed !== null
//       );
//     } catch (error) {
//       return false;
//     }
//   }

//   /*
//    * ------------------------------------------------------------
//    * OTP
//    * ------------------------------------------------------------
//    */

//   function validateOtp(value) {
//     if (!isString(value)) {
//       return false;
//     }

//     const otp = value.trim();

//     /*
//      * Adjust this if your backend uses a fixed OTP length.
//      */
//     if (!/^[0-9]{4,12}$/.test(otp)) {
//       return false;
//     }

//     return true;
//   }

//   /*
//    * ------------------------------------------------------------
//    * Payload validators
//    * ------------------------------------------------------------
//    */

//   function validResult() {
//     return {
//       valid: true,
//       field: null,
//       message: "Payload is valid."
//     };
//   }

//   function invalidResult(field, message) {
//     return {
//       valid: false,
//       field: field,
//       message: message
//     };
//   }

//   function validateLoginPayload(email, password) {
//     if (!validateEmail(email)) {
//       return invalidResult(
//         "email",
//         "Please enter a valid email address."
//       );
//     }

//     if (!validatePassword(password)) {
//       return invalidResult(
//         "password",
//         "Password must be 12–128 characters and must not contain control characters."
//       );
//     }

//     return validResult();
//   }

//   function validateRegisterPayload(
//     username,
//     email,
//     password
//   ) {
//     if (!validateUsername(username)) {
//       return invalidResult(
//         "username",
//         "Username must be 3–30 characters using letters, numbers, underscore, dot, or hyphen."
//       );
//     }

//     if (!validateEmail(email)) {
//       return invalidResult(
//         "email",
//         "Please enter a valid email address."
//       );
//     }

//     if (!validatePassword(password)) {
//       return invalidResult(
//         "password",
//         "Password must be 12–128 characters and must not contain control characters."
//       );
//     }

//     return validResult();
//   }

//   function validateEditPasswordPayload(
//     email,
//     password,
//     sessionID
//   ) {
//     if (!validateEmail(email)) {
//       return invalidResult(
//         "email",
//         "Please enter a valid email address."
//       );
//     }

//     if (!validatePassword(password)) {
//       return invalidResult(
//         "password",
//         "Password must be 12–128 characters and must not contain control characters."
//       );
//     }

//     if (!validateSessionId(sessionID)) {
//       return invalidResult(
//         "sessionID",
//         "Session ID is invalid or missing."
//       );
//     }

//     return validResult();
//   }

//   function validateOtpPayload(email, otp) {
//     if (!validateEmail(email)) {
//       return invalidResult(
//         "email",
//         "Please enter a valid email address."
//       );
//     }

//     if (!validateOtp(otp)) {
//       return invalidResult(
//         "otp",
//         "OTP must contain only numeric digits."
//       );
//     }

//     return validResult();
//   }

//   function validateSessionPayload(email, sessionID) {
//     if (!validateEmail(email)) {
//       return invalidResult(
//         "email",
//         "Please enter a valid email address."
//       );
//     }

//     if (!validateSessionId(sessionID)) {
//       return invalidResult(
//         "sessionID",
//         "Session ID is invalid or missing."
//       );
//     }

//     return validResult();
//   }

//   /*
//    * Generic object validation helper.
//    *
//    * Example:
//    *
//    * validateRequiredFields({
//    *   email: validateEmail,
//    *   sessionID: validateSessionId
//    * }, payload)
//    */
//   function validateRequiredFields(
//     validators,
//     payload
//   ) {
//     if (
//       !validators ||
//       typeof validators !== "object" ||
//       !payload ||
//       typeof payload !== "object"
//     ) {
//       return invalidResult(
//         null,
//         "Invalid validation input."
//       );
//     }

//     const fields = Object.keys(validators);

//     for (const field of fields) {
//       const validator = validators[field];

//       if (typeof validator !== "function") {
//         return invalidResult(
//           field,
//           "Validator is invalid."
//         );
//       }

//       if (!validator(payload[field])) {
//         return invalidResult(
//           field,
//           `Invalid ${field}.`
//         );
//       }
//     }

//     return validResult();
//   }

//   /*
//    * ------------------------------------------------------------
//    * Public API
//    * ------------------------------------------------------------
//    */

//   const security = Object.freeze({
//     MAX_EMAIL_LENGTH,
//     MAX_NAME_LENGTH,
//     MAX_JSON_LENGTH,
//     SESSION_ID_LENGTH,

//     MIN_USERNAME_LENGTH,
//     MAX_USERNAME_LENGTH,

//     MIN_PASSWORD_LENGTH,
//     MAX_PASSWORD_LENGTH,

//     VALID_PLANS,
//     VALID_DIFFICULTIES,

//     hasControlCharacters,

//     containsHtml,
//     containsJavascriptPattern,
//     containsEncodedAttack,
//     containsSuspiciousContent,

//     sanitizeText,
//     sanitizeWithDOMPurify,
//     loadDOMPurify,

//     validateStringLength,

//     validateEmail,
//     validateUsername,
//     validatePassword,
//     validateSessionId,

//     validateName,
//     validateText,
//     validateOptionalText,

//     validateCategory,
//     validateDifficulty,

//     validateNonNegativeInteger,
//     validatePositiveInteger,
//     validateId,

//     validateUrl,
//     validatePlan,
//     validateBoolean,
//     validateJsonString,

//     validateOtp,

//     validateLoginPayload,
//     validateRegisterPayload,
//     validateEditPasswordPayload,
//     validateOtpPayload,
//     validateSessionPayload,

//     validateRequiredFields
//   });

//   /*
//    * Node.js test support.
//    */
//   if (
//     typeof module !== "undefined" &&
//     module.exports
//   ) {
//     module.exports = security;
//   }

//   /*
//    * Browser global.
//    */
//   globalScope.CLARITY_SECURITY = security;

// })(typeof window !== "undefined" ? window : globalThis);