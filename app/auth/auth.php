<!DOCTYPE html>
<html>

<head>
	<title>Auth</title>
	<link href="https://fonts.googleapis.com/css2?family=Jost:wght@500&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="./auth.css">
	<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
	<link rel="shortcut icon" href="../files/unnamed.png" type="image/x-icon">

</head>

<body>
	<div class="main">
		<input type="checkbox" id="chk" aria-hidden="true">

		<div class="signup">
			<form onsubmit="Auth(event)">
				<label for="chk" aria-hidden="true">Sign up</label>
				<input type="text" name="txt" placeholder="User name" class="userName">
				<input type="text" name="email" placeholder="Email" class="userEmail">
				<input type="password" name="pswd" placeholder="Password" class="userPassword">
				<button>Sign up</button>
			</form>
		</div>

		<div class="login">
			<form onsubmit="login(event)">
				<label for="chk" aria-hidden="true">Login</label>
				<input type="email" name="email" class="loginUserEmail" placeholder="Email" required="">
				<input type="password" name="pswd" class="loginUserPassword" placeholder="Password" required="">
				<button>Login</button>
			</form>
		</div>
	</div>
	<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
	<script src="auth.js"></script>
</body>
</html>