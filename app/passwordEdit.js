const saveButton = document.querySelector(".Save");

saveButton.addEventListener("click", async function (event) {

    event.preventDefault();

    const password = document.querySelector(".newpassword").value;
    const confirmPassword = document.querySelector(".repeatpassword").value;

    if (!password || !confirmPassword) {
        alert("Please fill all fields");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }

    const email = sessionStorage.getItem("otp_email");
    const sessionId = sessionStorage.getItem("sessionId");

    try {

        const response = await fetch(
            API.editPassword(),
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password,
                    sessionID: sessionId
                })
            }
        );

        const result =
            await response.text();

        if (!response.ok) {

            alert(result);
            return;
        }

        alert("Password updated successfully");
       window.location.href = "profile.html";
        console.log(result);

    } catch (error) {

        console.error(error);

        alert(
            "Failed to update password"
        );
    }
});