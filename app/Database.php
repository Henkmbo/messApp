<?php
$user = 'root';
$pass = '';
try {
    $dbh = new PDO('mysql:host=localhost;dbname=messengerapp', $user, $pass);
} catch (PDOException $e) {
    if ($e->getCode() == 1452) {
        // Foreign key violation
        $response['status'] = 500;
        $response['message'] = 'Error: Invalid user in messageOwner';
    } else {
        // Other PDO exceptions
        $response['status'] = 500;
        $response['message'] = 'Error during database operation';
    }

    echo json_encode($response);
    exit;
}