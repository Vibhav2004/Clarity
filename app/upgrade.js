// async function buyPlan(plan){
//      const sessionId= sessionStorage.getItem("sessionId");
//    const Customer = JSON.parse(localStorage.getItem("clarity_state_v1"));
//      console.log("buyPlan called with plan:", plan, "and email:", Customer.currentUser);
//     const response =
//         await fetch(
//             API.createPaymentOrder(),
//             {
//                 method:"POST",
//                 headers:{
//                     "Content-Type":
//                         "application/json"
//                 },
//                 body:JSON.stringify({
//                     email:Customer.currentUser,
//                     plan:"PRO",
//                     sessionID:sessionId
//                 })
//             });

//     const order =
//         await response.json();
// const sessionIds = sessionStorage.getItem("sessionId");
//     const options = {

//         key:"rzp_test_Td04r8T5FdCMGv",

//         amount:order.amount,

//         currency:"INR",

//         name:"CLARITY",

//         description:
//             plan + " Subscription",

//         order_id:order.id,

//         handler:
//             async function(response){

//                 await fetch(
//                     API.verifyPayment(),
//                     {
//                         method:"POST",

//                         headers:{
//                             "Content-Type":
//                                 "application/json"
//                         },

//                         body:JSON.stringify({

//                             razorpayOrderId:
//                             response.razorpay_order_id,

//                             razorpayPaymentId:
//                             response.razorpay_payment_id,

//                             razorpaySignature:
//                             response.razorpay_signature,

//                             email:Customer.currentUser,

//                             plan:"PREMIUM",
//                             sessionID:sessionIds
//                         })
//                     });

//                 alert(
//                     "Subscription Activated");
//                     window.location.href = "/app/profile.html";
//             }
//     };

//     const rzp =
//         new Razorpay(options);

//     rzp.open();
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

            console.error(
                "Invalid Razorpay order:",
                order
            );

            alert(
                "Invalid payment order received."
            );

            return;
        }


        console.log(
            "Razorpay order:",
            order.id
        );


        // ==========================================
        // RAZORPAY OPTIONS
        // ==========================================
const RAZORPAY_KEY_SECRET=`${process.env.RAZORPAY_KEY_SECRET}`;
        const options = {

            key:RAZORPAY_KEY_SECRET,
                

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

                        console.log(
                            "Razorpay payment completed:",
                            paymentResponse
                        );


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

                            console.error(
                                "Payment verification failed:",
                                errorText
                            );

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

                        console.log(
                            "Payment verification result:",
                            result
                        );


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

        console.log(
            "Payment window closed."
        );
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