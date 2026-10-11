async function getRazorpayKey() {
    const response = await fetch("/config");

    if (!response.ok) {
        throw new Error("Failed to load Razorpay Key ID");
    }

    const config = await response.json();
    return config.razorpayKeyId;
}