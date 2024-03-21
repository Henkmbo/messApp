async function Auth(event) {
    event.preventDefault(); // Prevent the default form submission
    const userName = document.querySelector(".userName").value;
    const userEmail = document.querySelector(".userEmail").value;
    const userPassword = document.querySelector(".userPassword").value;
    if (userEmail === "" || userPassword === "") {
      Toastify({
        text: "Please fill in all fields",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
      return; // Don't proceed further if fields are empty
    }
    if (!userEmail.includes("@")) {
      Toastify({
        text: "Please enter a valid email address",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
      return; // Don't proceed further if email is invalid
    }
  
    // Proceed with authentication logic if all checks pass
    const call = await fetch("../upload.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "auth",
        action: "register",
        userFirstname: userName,
        userEmail: userEmail,
        userPassword: userPassword,
      }),
    });
  
    const response = await call.json();
    if (response.status === 200) {
      Toastify({
        text: "Successfully Registered!",
        className: "info",
        position: "left",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      window.location.href = "../index.php";
    } else if (response.status === 400) {
      Toastify({
        text: "User already exists!",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
    } else {
      console.error("Error getting users:", response.data);
    }
  }


  async function login(event) {
    console.log("login");
    event.preventDefault(); // Prevent the default form submission
    const userEmail = document.querySelector(".loginUserEmail").value;
    const userPassword = document.querySelector(".loginUserPassword").value;
    if (userEmail === "" || userPassword === "") {
      Toastify({
        text: "Please fill in all fields",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
      return; // Don't proceed further if fields are empty
    }
    if (!userEmail.includes("@")) {
      Toastify({
        text: "Please enter a valid email address",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
      return; // Don't proceed further if email is invalid
    }
  
    // Proceed with authentication logic if all checks pass
    const call = await fetch("../upload.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "auth",
        action: "login",
        userEmail: userEmail,
        userPassword: userPassword,
      }),
    });
    const response = await call.json();
    if (response.status === 200) {
        Toastify({
            text: "Successfully Logged in!",
            className: "info",
        position: "left",
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
      window.location.href = "../index.php";
    } else if (response.status === 400) {
      Toastify({
        text: "User not found!",
        className: "info",
        position: "left",
        style: {
          background: "#ff3333",
          color: "#dddddd",
        },
      }).showToast();
    } else {
      console.error("Error getting users:", response.data);
    }
  }
