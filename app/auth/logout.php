<?php
// Start the session
session_start();
session_unset();
// Destroy the session
session_destroy();
// Redirect to the auth page

header('Location: ./auth.php');
?>