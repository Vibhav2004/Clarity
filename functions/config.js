export async function onRequest(context) {
const keyId = context.env.RAZORPAY_KEY_ID;

if (!keyId) {
    return Response.json(
        { error: "Razorpay Key ID is not configured" },
        { status: 500 }
    );
}

return Response.json({ razorpayKeyId: keyId });

}