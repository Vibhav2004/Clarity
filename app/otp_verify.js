const verifyButton = document.querySelector(".form-card-button");

verifyButton.addEventListener("click", async function (event) {

    event.preventDefault();

    const otpInput = document.querySelector(".form-card-input");
    const otp = otpInput.value.trim();

    const email = sessionStorage.getItem("otp_email");
  
    try {

        const response = await fetch(
            API.verifyOtp(),
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    otp: otp
                })
            }
        );

     const result = await response.text();

        console.log("Verify response:", result);

        if (!response.ok) {
            throw new Error("OTP verification failed");
        }

      if (result === "Verified") {

            alert("OTP verified successfully");

            // Continue to next page
            window.location.href = "passwordEdit.html";

        } else {

            alert("Invalid or expired OTP");
        }

    } catch (error) {

        console.error("Verification Error:", error);

        // alert("Failed to verify OTP");
    }
});

