// async function getRazorpayKey() {
//     const response = await fetch("/config");

//     if (!response.ok) {
//         throw new Error("Failed to load Razorpay Key ID");
//     }

//     const config = await response.json();
//     return config.razorpayKeyId;
// }

export async function onRequest(context) {
    const keyId = context.env.RAZORPAY_KEY_ID;

    if (!keyId) {
        return Response.json(
            { error: "Razorpay Key ID is not configured" },
            { status: 500 }
        );
    }

    return Response.json({
        razorpayKeyId: keyId
    });
}