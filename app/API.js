// import { logout } from "./shared/store";

// const API_BASE_URL = "http://localhost:8080";
const API_BASE_URL = "https://claritybackend.onrender.com";
 //const API_BASE_URL = "http://192.168.0.178:8080";
const notificationStyles = document.createElement("link");
notificationStyles.rel = "stylesheet";
notificationStyles.href = "/app/notifications.css";
document.head.appendChild(notificationStyles);

const notificationIcons = { error: "!", warning: "!", success: "+", info: "i" };
let lastApiFailureAt = 0;

function showNotification({ title = "Notice", message = "", type = "info", duration = 6000, actionLabel, onAction } = {}) {
  if (!document.body) return;
  let region = document.getElementById("clarity-notifications");
  if (!region) {
    region = document.createElement("div");
    region.id = "clarity-notifications";
    region.className = "clarity-notifications";
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-relevant", "additions text");
    region.setAttribute("aria-label", "Notifications");
    document.body.appendChild(region);
  }
  const normalizedType = ["error", "warning", "success", "info"].includes(type) ? type : "info";
  const noticeKey = `${normalizedType}|${title}|${message}`;
  const duplicate = [...region.children].find((item) => item.dataset.noticeKey === noticeKey);
  if (duplicate) return duplicate;

  const notice = document.createElement("section");
  notice.className = `clarity-notice clarity-notice-${normalizedType}`;
  notice.dataset.noticeKey = noticeKey;
  notice.setAttribute("role", normalizedType === "error" ? "alert" : "status");
  const icon = document.createElement("span");
  icon.className = "clarity-notice-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = notificationIcons[normalizedType];
  const content = document.createElement("div");
  content.className = "clarity-notice-content";
  const heading = document.createElement("strong");
  heading.className = "clarity-notice-title";
  heading.textContent = title;
  const detail = document.createElement("p");
  detail.className = "clarity-notice-message";
  detail.textContent = message;
  content.append(heading, detail);
  notice.append(icon, content);

  if (actionLabel && typeof onAction === "function") {
    const action = document.createElement("button");
    action.className = "clarity-notice-action";
    action.type = "button";
    action.textContent = actionLabel;
    action.addEventListener("click", () => { onAction(); dismissNotification(notice); });
    notice.appendChild(action);
  }
  const dismiss = document.createElement("button");
  dismiss.className = "clarity-notice-dismiss";
  dismiss.type = "button";
  dismiss.setAttribute("aria-label", "Dismiss notification");
  dismiss.textContent = "x";
  dismiss.addEventListener("click", () => dismissNotification(notice));
  notice.appendChild(dismiss);
  region.appendChild(notice);
  if (duration > 0) window.setTimeout(() => dismissNotification(notice), duration);
  return notice;
}

function dismissNotification(notice) {
  if (!notice.isConnected || notice.classList.contains("is-leaving")) return;
  notice.classList.add("is-leaving");
  window.setTimeout(() => notice.remove(), 220);
}

function friendlyApiError(status, responseText = "") {
  let code = "";
  try {
    const body = JSON.parse(responseText.slice(0, 4000));
    code = String(body.code || body.errorCode || body.error || body.message || "").toUpperCase();
  } catch {
    code = responseText.toUpperCase();
  }
  if (/TRACKER_LIMIT_EXCEEDED/.test(code)) return { title: "Tracker Limit Reached", message: "Your current plan does not allow another tracker. Upgrade your plan to create more.", type: "warning" };
  if (/TRACKER_ALREADY_EXISTS|ALREADY_EXISTS|DUPLICATE/.test(code)) return { title: "This Item Already Exists", message: "A matching record already exists. Check your existing items before trying again.", type: "warning" };
  if (/PREMIUM_REQUIRED|PLAN_REQUIRED|UPGRADE_REQUIRED/.test(code)) return { title: "Plan Upgrade Required", message: "This feature is not included in your current plan.", type: "warning" };
  if (/INVALID_OTP|OTP_INVALID|OTP_EXPIRED|INVALID OR EXPIRED OTP/.test(code)) return { title: "OTP Could Not Be Verified", message: "The code is incorrect or has expired. Request a new code and try again.", type: "error" };
  if (/INVALID_CREDENTIALS|BAD_CREDENTIALS|INCORRECT_PASSWORD|INVALID EMAIL OR PASSWORD/.test(code)) return { title: "Sign-In Details Not Recognized", message: "Check your email and password, then try again.", type: "error" };
  if (/SESSION_EXPIRED|INVALID_SESSION|UNAUTHORIZED/.test(code)) return { title: "Session Expired", message: "Please log-out and  sign in again to continue.", type: "warning" };
  if (status === 400) return { title: "Check Your Request", message: "Some information is missing or invalid. Review the form and try again.", type: "warning" };
  if (status === 401) return { title: "Log-out Required", message: "Your session may have expired. Sign in again to continue.", type: "warning" };
  if (status === 4088) return { title: "Access Not Available", message: "You do not have permission to use this feature, or your plan may need an upgrade.", type: "warning", actionLabel: "View Plans", onAction: () => { window.location.href = "/app/upgrade.html"; } };
  if (status === 404) return { title: "Item Not Found", message: "The requested information could not be found. Refresh and try again.", type: "warning" };
  if (status === 409) return { title: "Request Conflict", message: "This change conflicts with an existing record. Review your current items and try again.", type: "warning" };
  if (status === 429) return { title: "Please Wait Before Trying Again", message: "Too many requests were made. Wait a little and try again.", type: "warning" };
  if (status >= 500) return { title: "Server Temporarily Unavailable", message: "CLARITY could not complete this request. Please try again shortly.", type: "error" };
  return { title: "Request Could Not Be Completed", message: "The server did not complete the request. Please try again.", type: "error" };
}

function notifyApiFailure(notification) {
  lastApiFailureAt = Date.now();
  showNotification({ ...notification, duration: 8000 });
}

function businessResponseFailure(body) {
  if (!body || typeof body !== "object") return null;
  const code = String(body.code || body.errorCode || body.error || body.message || "").toUpperCase();
  const failureStatus = /^(?:ERROR|FAILED|FAILURE|REJECTED|INVALID)$/i.test(String(body.status || ""));
  const hasError = body.error !== undefined && body.error !== null && body.error !== false && body.error !== "";
  if (body.success === false || body.status === false || body.ok === false || failureStatus || hasError || /TRACKER_LIMIT_EXCEEDED|TRACKER_ALREADY_EXISTS|PREMIUM_REQUIRED|INVALID_OTP|OTP_EXPIRED|INVALID_CREDENTIALS|SESSION_EXPIRED/.test(code)) {
    return friendlyApiError(400, JSON.stringify(body));
  }
  return null;
}

window.showNotification = showNotification;
window.showError = (title, message, options = {}) => showNotification({ title, message, type: "error", ...options });
window.showWarning = (title, message, options = {}) => showNotification({ title, message, type: "warning", ...options });
window.showSuccess = (title, message, options = {}) => showNotification({ title, message, type: "success", ...options });
window.handleApiError = (error, fallbackTitle = "Request Failed") => {
  if (error?.name === "TimeoutError" || error?.code === "CLARITY_TIMEOUT") {
    notifyApiFailure({ title: "Server Took Too Long", message: "The server took too long to respond. Please try again.", type: "error" });
  } else if (error instanceof TypeError && /fetch|network/i.test(error.message)) {
    notifyApiFailure({ title: "Connection Problem", message: "CLARITY could not reach the server. Check your internet connection and try again.", type: "error" });
  } else if (Number.isInteger(error?.status)) {
    notifyApiFailure(friendlyApiError(error.status, error.responseText || ""));
  } else {
    showNotification({ title: fallbackTitle, message: error?.message || "Please try again.", type: "error" });
  }
};

const nativeFetch = window.fetch.bind(window);
window.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url || "";
  const isPaymentFailureReport = url.endsWith("/payment/failed");
  const isPaymentConfigRequest = /(?:^|\/)config(?:\?|$)/i.test(url);
  const isBackendRequest = url.startsWith(API_BASE_URL) || isPaymentConfigRequest;
  const controller = new AbortController();
  const requestSignal = init.signal || (typeof Request !== "undefined" && input instanceof Request ? input.signal : null);
  let timedOut = false;
  const abortFromCaller = () => controller.abort(requestSignal?.reason);
  if (requestSignal?.aborted) abortFromCaller();
  else requestSignal?.addEventListener("abort", abortFromCaller, { once: true });
  const timeoutId = window.setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
  try {
    const response = await nativeFetch(input, { ...init, signal: controller.signal });
    if (isBackendRequest && !response.ok && !isPaymentFailureReport) {
      let responseText = "";
      try { responseText = await response.clone().text(); } catch { /* Keep status-only message. */ }
      const paymentError = url.includes("/payment/verify")
        ? { title: "Payment Verification Pending", message: "We could not confirm your payment yet. Check your payment status before trying another payment.", type: "warning" }
        : url.includes("/payment/create-order")
          ? { title: "Unable to Create Payment Order", message: "Razorpay could not start this payment. No new payment was confirmed; please try again shortly.", type: "error" }
          : isPaymentConfigRequest
            ? { title: "Checkout Temporarily Unavailable", message: "CLARITY could not load payment settings. Please try again shortly.", type: "error" }
            : friendlyApiError(response.status, responseText);
      notifyApiFailure(paymentError);
    } else if (isBackendRequest && response.ok && /application\/(?:[^;]+\+)?json/i.test(response.headers.get("content-type") || "")) {
      try {
        const body = await response.clone().text();
        if (!body.trim()) notifyApiFailure({ title: "Unexpected Server Response", message: "The server returned an empty response. Please try again.", type: "error" });
        else {
          const parsedBody = JSON.parse(body);
          const businessError = businessResponseFailure(parsedBody);
          if (businessError) {
            notifyApiFailure(url.includes("/payment/verify")
              ? { title: "Payment Verification Pending", message: "We could not confirm your payment yet. Please check your payment status before attempting another payment.", type: "warning" }
              : businessError);
            return new Response(body, {
              status: 422,
              statusText: "Unprocessable Entity",
              headers: response.headers,
            });
          }
        }
      } catch {
        notifyApiFailure({ title: "Unexpected Server Response", message: "The server returned data in an unexpected format. Please try again.", type: "error" });
      }
    }
    return response;
  } catch (error) {
    if (requestSignal?.aborted && !timedOut) throw error;
    if (timedOut) {
      const timeoutError = new Error("Request timed out");
      timeoutError.code = "CLARITY_TIMEOUT";
      notifyApiFailure({ title: "Server Took Too Long", message: "The server took too long to respond. Please try again.", type: "error" });
      throw timeoutError;
    }
    if (isBackendRequest && !isPaymentFailureReport) notifyApiFailure({ title: "Connection Problem", message: "CLARITY could not reach the server. Check your internet connection and try again.", type: "error" });
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    requestSignal?.removeEventListener("abort", abortFromCaller);
  }
};

window.alert = (message) => {
  if (Date.now() - lastApiFailureAt < 1600) return;
  const text = String(message ?? "");
  const success = /success|saved|activated|verified|deleted/i.test(text);
  showNotification({ title: success ? "Completed" : "Notice", message: text, type: success ? "success" : "warning" });
};

window.API = Object.freeze({
  loginUser: () => `${API_BASE_URL}/Login-User`,
  registerUser: () => `${API_BASE_URL}/Register-User`,
  profile: (email) => `${API_BASE_URL}/Profile/${encodeURIComponent(email)}`,
  sendOtp: () => `${API_BASE_URL}/send`,
  verifyOtp: () => `${API_BASE_URL}/verify`,
  editPassword: () => `${API_BASE_URL}/editPassword`,
  deleteAccount: () => `${API_BASE_URL}/deleteAccount`,
  customRoadmap: () => `${API_BASE_URL}/Custom_Roadmap`,
  customTracker: () => `${API_BASE_URL}/Custom_Tracker`,
  allRoadmaps: (email) => `${API_BASE_URL}/All_RoadMap/${encodeURIComponent(email)}`,
  roadmapCategories: () => `${API_BASE_URL}/Static_Roadmaps/Category`,
  roadmapsInCategory: (category) =>
    `${API_BASE_URL}/Static_Roadmaps/Category/${encodeURIComponent(category)}`,
  roadmapTemplate: (category, name, level, email) =>
    `${API_BASE_URL}/Static_Roadmaps/Category/${encodeURIComponent(category)}/${encodeURIComponent(name)}/${encodeURIComponent(level)}/${encodeURIComponent(email)}`,
  allTrackers: (email) =>
    `${API_BASE_URL}/all_trackers?email=${encodeURIComponent(email)}`,
  deleteTrackers: () =>
    `${API_BASE_URL}/delete_trackers`,
  saveTracker: () => `${API_BASE_URL}/tracker`,
  saveIndividualTracker: () => `${API_BASE_URL}/save_tracker`,
  plan: () => `${API_BASE_URL}/plan`,
  createPaymentOrder: () => `${API_BASE_URL}/payment/create-order`,
  verifyPayment: () => `${API_BASE_URL}/payment/verify`,
  logout:() => `${API_BASE_URL}/LogOut-User`,
});