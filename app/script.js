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
  const receiverId = localStorage.getItem("senderId");
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


async function drawUsers() {
  receiveMessage();
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
      users.sort((a, b) => {
        return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
      });
      const userList = document.querySelector(".conversation-area");
      userList.innerHTML = "";
      
      const last30Users = users.slice(0, 30);
      
      last30Users.forEach(async (user) => {
          const userContent = document.createElement("div");
          userContent.classList.add("userContent");
          userContent.innerHTML = `
            <div class="userContent">
              <h3>${user.userFirstname}</h3>
              <div class="messageContent">              
                  <i class="fa-solid fa-check js-chat-check-marks js-chat-check-0" style="display:none;"></i>
                  <i class="fa-solid fa-check-double js-chat-check-marks js-chat-check-1" style="display:none;"></i>
                  <i class="fa-solid fa-check-double js-chat-check-marks js-chat-check-2" style="color: #74C0FC; display:none;"></i>
                  <p class="lastestMessageContent bold lastmessage"></p>
              </div>
            </div>
          `;
      
          userList.appendChild(userContent);
        startLatestMessageUpdates(userContent, user.userId, response.userId, 'list');
        checkMessageUpdates();
        userContent.addEventListener("click", () => {
          const lastestMessageContent = userContent.querySelector(
            ".lastestMessageContent"
          );
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
          chatHeader.innerHTML = `<div class="header-info">
                                <h3 class="headerTitle">${user.userFirstname}</h3>
                                <p class="status"></p>
                            </div>`;

          const chatArea = document.querySelector(".chat-area");
          chatArea.classList.remove("hidden");
          const chatAreaStart = document.querySelector(".chat-area-start");
          chatAreaStart.classList.add("hidden");
          startMessageUpdates();
        });
      });
      const header = document.createElement("div");
      header.classList.add("listHeader");
      header.textContent = "Recent Chats";
    userList.insertBefore(header, userList.firstChild); 
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
        msg.innerHTML = `<p>${message.message}</p>
        <i class="fa-solid fa-check js-chat-check-marks js-chat-check-0" style="display:none;"></i>
        <i class="fa-solid fa-check-double js-chat-check-marks js-chat-check-1" style="display:none;"></i>
        <i class="fa-solid fa-check-double js-chat-check-marks js-chat-check-2" style="color: #74C0FC; display:none;"></i>`;
        if(message.recd === 1){
          msg.querySelector(".fa-check-double").style.display = "block";
        } else if (message.recd === 2){
          msg.querySelector(".fa-check-double").style.display = "block";
          msg.querySelector(".fa-check-double").style.color = "#74C0FC";
        } else if (message.recd === 0){
          msg.querySelector(".fa-check").style.display = "block";
        }
        
      } else if (message.from === to) {
        msg.classList.add("toMsg");
        msg.textContent = message.message;
      }
      chatContainer.appendChild(msg);
    });
    getSeenMessage();

    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
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
}

function checkMessageUpdates() {
  setInterval(() => {
    receiveMessage();
  }, 5000);
}

async function startLatestMessageUpdates(userContent, chatUserId, userId, Type) {
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
          from: userId,
          to: chatUserId,
        }),
      });

      const response = await call.json();
      if (response.status === 200) {
        const latestMessage = response.data;
        if (latestMessage.from === userId) {
          const allChatCheckmarks = userContent.querySelectorAll(".js-chat-check-marks");
          allChatCheckmarks.forEach((element) => {
            element.style.display = "none";
          });
          if (latestMessage.recd === 0) {
            const chatCheckMartkIcon = userContent.querySelector(".js-chat-check-0");
            chatCheckMartkIcon.style.display = "block";
          } else if (latestMessage.recd === 1) {
            const chatCheckMartkIcon = userContent.querySelector(".js-chat-check-1");
            chatCheckMartkIcon.style.display = "block";
          } else if (latestMessage.recd === 2) {
            const chatCheckMartkIcon = userContent.querySelector(".js-chat-check-2");
            chatCheckMartkIcon.style.display = "block";
          }
        }
        if (Type === 'list'){
          const latestMessageContent = userContent.querySelector(".lastestMessageContent");
          latestMessageContent.textContent = latestMessage.message;
          if (latestMessage.to === userId && latestMessage.recd === 0) {
            latestMessageContent.classList.add("bold");
           } else if(latestMessage.to === userId && latestMessage.recd === 1){
            latestMessageContent.classList.add("bold");
        } else {
          latestMessageContent.classList.remove("bold");
        }
      }
        
      } else {
        // console.log(response);
      }
    } catch (error) {
      console.error("Error fetching latest message:", error);
    }
  }, 5000);
}



async function receiveMessage() {
  const from = localStorage.getItem("receiverId");
  const call = await fetch("upload.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scope: "checkMessage",
      action: "receiveMessage",
      from: from,
    }),
  });
  const response = await call.json();
  if (response.status === 200) {

  } else {
    console.log("Error receiving message:", response);
  }
}

async function getSeenMessage() {
  const from = localStorage.getItem("receiverId");
  const call = await fetch("upload.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          scope: "checkMessage",
          action: "seenMessage",
          from: from,
      }),
  });
  const response = await call.json();
  if (response.status === 200) {
  } else {
      console.log("Error seeing message:", response);
  }
}




drawUsers();
