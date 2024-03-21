<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message App</title>
  <link rel="stylesheet" href="style.css">
  <link rel="shortcut icon" href="./files/unnamed.png" type="image/x-icon">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" /></head>

<body>

  <div class="app">
    <div class="profileHeader">  <?php
  session_start();
  if (isset($_SESSION['user'])) {
    echo '<a href="./auth/logout.php"class="authButton">Logout</a>';
    echo '<div class="profile">' . $_SESSION['user']['userFirstname'] . '</div>';
  } else {
    echo '<a href="./auth/auth.php"class="authButton">Login</a>';
  }
  ?></div>
    <div class="wrapper">
      <div class="conversation-area">
      </div>
      <div class="chat-area-start">
        <h1 class="text-start">Select a user to start chatting
        </h1>
      </div>
      <div class="chat-area hidden">
        <div class="header">
          Users
        </div>
        <div class="chat-area-main">
        </div>
        <div class="chat-area-footer">
          <input class="msgInput" id="messageInput" onchange="addMessage(this.value)" type="text" placeholder="Type something here..." />
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <script src="./script.js"></script>

 </body>

</html>