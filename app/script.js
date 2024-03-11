function addMessage(value) {
  const chatContainer = document.querySelector(".chat-area-main");
  const message = document.createElement("div");
  message.classList.add("fromMsg");
  const messageInput = document.querySelector(".msgInput");
  message.textContent = value;
  chatContainer.appendChild(message);
  messageInput.value = "";
  sendMessage(value);
}

async function sendMessage(value) {
  const receiverId =  localStorage.getItem("senderId");
  const message = value;
  const call = await fetch("upload.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: "message",
      action: "sendMessage",
      message: message,
      to: receiverId,
    }),
  });
  const response = await call.json();

  if (response.status === 200) {
  } else {
    console.log(response);
  }
}

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

async function drawUsers() {
  try {
    const call = await fetch("upload.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scope: "users",
        action: "getUsers",
      }),
    });

    const response = await call.json();

    if (response.status === 200) {
      const users = response.data;
      const userList = document.querySelector(".conversation-area");
      userList.innerHTML = "";

      users.forEach(async (user) => {
        const userContent = document.createElement("div");
          userContent.classList.add("userContent");
          userContent.innerHTML = `
              <h3>${user.userFirstname}</h3>
              <p class="lastestMessageContent bold"></p>
            `;
          userList.appendChild(userContent);
          
          startMessageUpdates();
          startLatestMessageUpdates(userContent, user.userId, response.userId);
        userContent.addEventListener("click", () => {
          const lastestMessageContent = userContent.querySelector('.lastestMessageContent');
          lastestMessageContent.classList.remove("bold");
          const chatContainer = document.querySelector(".chat-area-main");
          chatContainer.innerHTML = "";
          document.getElementById("messageInput").focus();
          
          document.querySelectorAll(".userContent").forEach((element) => {
            element.classList.remove("active");
          });

          userContent.classList.add("active");
          localStorage.setItem("senderId", user.userId);
          localStorage.setItem("receiverId", response.userId);

          const chatHeader = document.querySelector(".header");
          chatHeader.innerHTML = `<h3>${user.userFirstname}</h3>`;

          const chatArea = document.querySelector(".chat-area");
          chatArea.classList.remove("hidden");
          const chatAreaStart = document.querySelector(".chat-area-start");
          chatAreaStart.classList.add("hidden");
        });
      });
    } else {
      console.log(response);
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
  }
}




async function getMessages(from, to) {
  const receiverId = localStorage.getItem("senderId");
  const call = await fetch("upload.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: "message",
      action: "getMessages",
      from: from,
      to: receiverId,
    }),
  });
  const response = await call.json();
  if (response.status === 200) {
    const chatContainer = document.querySelector(".chat-area-main");
    chatContainer.innerHTML = "";
    response.data.forEach((message) => {
      const msg = document.createElement("div");
      if (message.from === from) {
        msg.classList.add("fromMsg");
      } else if (message.from === to) {
        msg.classList.add("toMsg");
      }
      msg.textContent = message.message;
      chatContainer.appendChild(msg);
    });
  } else if (response.status === 404) {
    const chatContainer = document.querySelector(".chat-area-main");
    chatContainer.innerHTML = "";
    document.getElementById("messageInput").focus();
  } else {
  }
}
function startMessageUpdates() {
  setInterval(() => {
    const to = localStorage.getItem("senderId");
    const from = localStorage.getItem("receiverId");
    getMessages(from, to);
  }, 5000);
}async function startLatestMessageUpdates(userContent, senderId, receiverId) {
  setInterval(async () => {
    try {
      const call = await fetch("upload.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scope: "message",
          action: "getLatestMessage",
          from: receiverId,
          to: senderId,
        }),
      });

      const response = await call.json();
      if (response.status === 200) {
        const lastestMessage = response.data;
        const latestMessageContent = userContent.querySelector('.lastestMessageContent');
        latestMessageContent.textContent = lastestMessage.message;

        // Check if the chat is currently active
        const isActiveChat = userContent.classList.contains("active");

        // If the message is from a user not in the chat and the chat is not active, apply bold styling
        if (!isActiveChat && lastestMessage.from !== receiverId) {
          latestMessageContent.classList.add("bold");
        }
      } else {
        console.log(response);
      }
    } catch (error) {
      console.error("Error fetching latest message:", error);
    }
  }, 5000);

  // Add event listener to set active chat and remove bold styling when user clicks on the chat
  userContent.addEventListener("click", () => {
    const latestMessageContent = userContent.querySelector('.lastestMessageContent');
    const chatContainer = document.querySelector(".conversation-area");

    // Remove bold styling from all chat elements
    chatContainer.querySelectorAll(".lastestMessageContent").forEach(content => {
      content.classList.remove("bold");
    });

    // Set this chat as active
    userContent.classList.add("active");
    latestMessageContent.classList.remove("bold");
  });
}


drawUsers();
