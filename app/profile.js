


import {
  renderShell,
  toast,
  applyLanguage
} from "./shared/store.js";

const user = renderShell("profile");
if (!user) throw new Error("redir");

async function render() {

  try {
  console.log("Fetching profile for user:", user.email);
    // const response = await fetch(
    //   API.profile(user.email)
    // );
    const sessionId = sessionStorage.getItem("sessionId");

const response = await fetch(
    API.profile(user.email),
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sessionID: sessionId
        })
    }
);
 
    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const u = await response.json();
   console.log(u);
    document.getElementById("content").innerHTML = `
      <div class="card slide-up" style="display:flex; gap:20px; align-items:center; flex-wrap:wrap">

        <div class="avatar" style="width:72px; height:72px; font-size:28px">
          ${u.userName[0].toUpperCase()}
        </div>

        <div style="flex:1; min-width:200px">
          <div style="font-size:22px; font-weight:800">
            ${u.userName}
          </div>

          <div style="color:var(--text-muted); font-size:13px">
            ${u.email}
          </div>

          <div style="margin-top:6px">
            <span class="badge">
              ${u.plan } plan
            </span>
          </div>
        </div>
        
        <div style="display:flex; flex-wrap:wrap; gap:24px; text-align:center">

          <div>
            <div style="font-size:24px; font-weight:800">
              ${u.roadmaps || 0}
            </div>
            

            <div style="
              font-size:11px;
              color:var(--text-muted);
              text-transform:uppercase;
              letter-spacing:.08em
            ">
              Roadmaps
            </div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:800">
              ${u.completedMileStones || 0}
            </div>
            

            <div style="
              font-size:11px;
              color:var(--text-muted);
              text-transform:uppercase;
              letter-spacing:.08em
            ">
              completedMileStones
            </div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:800">
              ${u.totalMileStones || 0}
            </div>
            

            <div style="
              font-size:11px;
              color:var(--text-muted);
              text-transform:uppercase;
              letter-spacing:.08em
            ">
              totalMileStones
            </div>
          </div>
          <div>
            <div style="font-size:24px; font-weight:800">
              ${u.trackers || 0}
            </div>
            

            <div style="
              font-size:11px;
              color:var(--text-muted);
              text-transform:uppercase;
              letter-spacing:.08em
            ">
              trackers
            </div>
          </div>

        </div>

      </div>

      <div class="card slide-up" style="margin-top:20px">

        <div style="
          font-size:11px;
          color:var(--text-muted);
          text-transform:uppercase;
          letter-spacing:.1em;
          font-weight:600;
          margin-bottom:14px
        " data-i18n="profile.account">
          Account
        </div>

        <form id="profileForm"
          style="display:flex; flex-direction:column; gap:14px">

         <div class="field">
            <label>User Name</label>
            <div class="input"
            style="display:flex; gap:10px; justify-content:space-between; align-items:center"
            >
           
            <p>
            ${u.userName}
            </p>
            <button type="button" class="edit1">✎</button>
            </div>
            
          </div>

         <div class="field">
            <label>Email</label>
            <div class="input"
            style="display:flex; gap:10px; justify-content:space-between; align-items:center"
            >
           
            <p>
            ${u.email}
            </p>
            <button type="button" class="edit2">✎</button>
            </div>
            
          </div>

          <div class="field">
            <label>Password</label>
            <div class="input"
            style="display:flex; gap:10px; justify-content:space-between; align-items:center"
            >
           
            <p>
            ************
            </p>
            <button type="button" class="edit3">✎</button>
            </div>
            
          </div>

          <div class="buttons">
            <button
              class="btn btn-primary"
              type="submit">
              Save Changes
            </button>

            <button
              type="button"
              class="upgrade"
              >
              <a href="/app/upgrade.html" style="color:inherit; text-decoration:none">
              Upgrade
              </a>
            </button>
          </div>

        </form>

      </div>

      <div class="card slide-up" style="margin-top:20px">

        <div style="
          font-size:11px;
          color:var(--text-muted);
          text-transform:uppercase;
          letter-spacing:.1em;
          font-weight:600;
          margin-bottom:6px
        ">
          Member Since
        </div>

        <div style="font-weight:600">
          ${
  u.joinedDate
    ? new Date(
        u.joinedDate.replace(" ", "T")
      ).toLocaleDateString(
        undefined,
        {
          year: "numeric",
          month: "long",
          day: "numeric"
        }
      )
    : "-"
}
        </div>

      </div>
      <div>
      <button class="btn btn-danger" id="deleteAccount">Delete Account</button>
      </div>
    `;

    await applyLanguage();

  } catch (err) {

    console.error(err);

    document.getElementById("content").innerHTML = `
      <div class="card">
        Failed to load profile
      </div>
    `;
  }
}
document.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit1");

    if (!editButton) return;

    event.preventDefault();
 
    console.log("Username Edit button clicked");
     const field = editButton.closest(".field");
    const username = field.querySelector("p").textContent.trim();

    console.log("Username:", username);
});

document.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit2");

    if (!editButton) return;

    event.preventDefault();

    console.log("Email Edit button clicked");
     const field = editButton.closest(".field");
    const email = field.querySelector("p").textContent.trim();

    console.log("Email:", email);
});


document.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit3");

    if (!editButton) return;

    event.preventDefault();
   const email =user.email;
   
    console.log("Password Edit button clicked");
     const field = editButton.closest(".field");
    const password = field.querySelector("p").textContent.trim();

OtpVerification(email)
         
    console.log("Password:", password);
});




 
async function OtpVerification(email) {

  

    try {
        const sessionId = sessionStorage.getItem("sessionId");

        const response =
            await fetch(
                API.sendOtp(),
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                    email: email,
                    sessionID: sessionId
                })
                }
            );

        if (!response.ok) {

            throw new Error(
                "OTP send failed"
            );
        }

        sessionStorage.setItem(
            "otp_email",
            email
        );

        window.location.href =
            "otp_verify.html";

    } catch (error) {

        console.error(error);

        alert(
            "Failed to send OTP"
        );
    }
}
document.addEventListener("click", async function (event) {
   const email = user.email;
   console.log("Email for account deletion:", email);
    const deleteButton =
        event.target.closest("#deleteAccount");
 console.log("Delete Account button clicked");
    if (!deleteButton) return;

    event.preventDefault();

    const confirmation = prompt(
        'Type "Delete Account" to continue'
    );

    if (confirmation === null) {
        return;
    }

    if (confirmation.trim() !== "Delete Account") {

        alert(
            'Please type exactly "Delete Account"'
        );

        return;
    }

    try {
        const sessionId = sessionStorage.getItem("sessionId");

        const response = await fetch(
          API.deleteAccount(),
            {
                method: "DELETE",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    email: email,
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

        alert(
            "Account deleted successfully"
        );

        localStorage.clear();
        sessionStorage.clear();

        window.location.href =
            "login.html";

    } catch (error) {

        console.error(error);

        alert(
            "Failed to delete account"
        );
    }
});
render();