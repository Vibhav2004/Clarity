

// async function getRazorpayKey() {
//     const response = await fetch("/config");

//     if (!response.ok) {
//         throw new Error("Failed to load Razorpay Key ID");
//     }

//     const config = await response.json();
//     return config.razorpayKeyId;
// }

async function buyPlan(plan) {

    try {

        // ==========================================
        // GET SESSION
        // ==========================================

        const sessionId =
            sessionStorage.getItem("sessionId");


        // ==========================================
        // GET CURRENT USER
        // ==========================================

        const state =
            JSON.parse(
                localStorage.getItem(
                    "clarity_state_v1"
                )
            );

        const email =
            state?.currentUser;


        // ==========================================
        // BASIC VALIDATION
        // ==========================================

        if (!email) {

            alert(
                "User session not found. Please login again."
            );

            return;
        }


        if (!sessionId) {

            alert(
                "Session expired. Please login again."
            );

            return;
        }


        if (!plan) {

            alert(
                "Please select a plan."
            );

            return;
        }


        // ==========================================
        // NORMALIZE PLAN
        // ==========================================

        plan =
            String(plan)
                .trim()
                .toUpperCase();


        // ==========================================
        // ALLOWED PLANS
        // ==========================================

        if (
            plan !== "PRO" &&
            plan !== "PREMIUM"
        ) {

            alert(
                "Invalid subscription plan."
            );

            return;
        }


        console.log(
            "Starting payment:",
            plan
        );


        // ==========================================
        // CREATE RAZORPAY ORDER
        // ==========================================

        const orderResponse =
            await fetch(
                API.createPaymentOrder(),
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            email: email,

                            plan: plan,

                            sessionID:
                                sessionId
                        })
                }
            );


        // ==========================================
        // CHECK CREATE-ORDER RESPONSE
        // ==========================================

        if (!orderResponse.ok) {

            const errorText =
                await orderResponse.text();

            console.error(
                "Create order failed:",
                errorText
            );

            alert(
                "Unable to create payment order."
            );

            return;
        }


        // ==========================================
        // GET RAZORPAY ORDER
        // ==========================================

        const order =
            await orderResponse.json();


        if (!order.id) {

            console.error("Invalid Razorpay order response.");

            alert(
                "Invalid payment order received."
            );

            return;
        }


        // ==========================================
        // RAZORPAY OPTIONS
        // ==========================================


const razorpayKeyId = await getRazorpayKey();
        const options = {

            key: razorpayKeyId,

            amount:
                order.amount,

            currency:
                order.currency || "INR",

            name:
                "CLARITY",

            description:
                plan + " Subscription",

            order_id:
                order.id,


            // ======================================
            // PAYMENT SUCCESS
            // ======================================

            handler:
                async function(paymentResponse) {

                    try {

                        // ==================================
                        // VERIFY PAYMENT
                        //
                        // NO PLAN IS SENT HERE.
                        // ==================================

                        const verifyResponse =
                            await fetch(
                                API.verifyPayment(),
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body:
                                        JSON.stringify({

                                            razorpayOrderId:
                                                paymentResponse
                                                    .razorpay_order_id,

                                            razorpayPaymentId:
                                                paymentResponse
                                                    .razorpay_payment_id,

                                            razorpaySignature:
                                                paymentResponse
                                                    .razorpay_signature,

                                            email:
                                                email,

                                            sessionID:
                                                sessionId
                                        })
                                }
                            );


                        // ==================================
                        // BACKEND REJECTED PAYMENT
                        // ==================================

                        if (!verifyResponse.ok) {

                            const errorText =
                                await verifyResponse.text();

                            console.error("Payment verification rejected by the server.");

                            alert(
                                "Payment verification failed. Your subscription was not activated."
                            );

                            return;
                        }


                        // ==================================
                        // PAYMENT VERIFIED
                        // ==================================

                        const result =
                            await verifyResponse.text();

                        let verificationRejected = !result.trim();
                        try {
                            const parsedResult = JSON.parse(result);
                            const responseState = [
                                parsedResult.status,
                                parsedResult.code,
                                parsedResult.message,
                                parsedResult.error
                            ].filter(Boolean).join(" ");
                            verificationRejected = verificationRejected ||
                                parsedResult.success === false ||
                                parsedResult.verified === false ||
                                parsedResult.status === false ||
                                parsedResult.ok === false ||
                                /(?:PAYMENT.*(?:FAIL|REJECT|INVALID|NOT VERIFIED)|\b(?:FAILED|ERROR|INVALID|NOT_VERIFIED|REJECTED)\b)/i.test(responseState);
                        } catch {
                            verificationRejected = verificationRejected ||
                                /(?:PAYMENT.*(?:FAIL|REJECT|INVALID|NOT VERIFIED)|\b(?:FAILED|ERROR|INVALID|NOT_VERIFIED|REJECTED)\b)/i.test(result.trim());
                        }

                        if (verificationRejected) {
                            showWarning(
                                "Payment Verification Pending",
                                "We could not confirm your payment yet. Please check your payment status before attempting another payment."
                            );
                            return;
                        }


                        alert(
                            "Subscription Activated"
                        );


                        window.location.href =
                            "/app/profile.html";
                    }

                    catch (error) {

                        console.error(
                            "Payment verification error:",
                            error
                        );

                        alert(
                            "Something went wrong while verifying the payment."
                        );
                    }
                },


            // ==========================================
            // RAZORPAY CLOSED
            // ==========================================

       modal: {

    ondismiss: async function() {

        try {

            await fetch(
                "https://claritybackend.onrender.com/payment/failed",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({

                        razorpayOrderId:
                            order.id,

                        email:
                            email,

                        sessionID:
                            sessionId

                    })
                }
            );

        } catch(err) {

            console.error(err);
        }

    }
}
        };


        // ==========================================
        // CREATE RAZORPAY INSTANCE
        // ==========================================

        const rzp =
            new Razorpay(options);


        // ==========================================
        // PAYMENT FAILED
        // ==========================================
rzp.on(
    "payment.failed",
    async function(response) {

        console.error(
            "Razorpay payment failed:",
            response
        );

        try {

            await fetch(
                "https://claritybackend.onrender.com/payment/failed",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({

                        razorpayOrderId:
                            response.error.metadata.order_id,

                        email:
                            email,

                        sessionID:
                            sessionId

                    })
                }
            );

        } catch(err) {

            console.error(
                "Failed status update error:",
                err
            );
        }

        alert(
            "Payment failed. Please try again."
        );
    }
);



        // ==========================================
        // OPEN RAZORPAY
        // ==========================================

        rzp.open();

    }

    catch (error) {

        console.error(
            "buyPlan error:",
            error
        );

        alert(
            "Unable to start payment. Please try again."
        );
    }
}
async function getRazorpayKey() {
    const response = await fetch("/config");

    if (!response.ok) {
        throw new Error("Failed to load Razorpay Key ID");
    }

    const config = await response.json();

    if (!config.razorpayKeyId) {
        throw new Error("Razorpay Key ID is missing");
    }

    return config.razorpayKeyId;
}