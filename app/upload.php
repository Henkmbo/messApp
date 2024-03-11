<?php
include 'Database.php';

header('Content-Type: application/json');
$decodedParams = json_decode(file_get_contents('php://input'));
$response = [
    'status' => 404,
    'message' => 'Unknown error occurred!'
];


if (isset($decodedParams->scope) && !empty($decodedParams->scope)) {
    if ($decodedParams->scope == 'users') {
        if (isset($decodedParams->action) && !empty($decodedParams->action)) {
            if ($decodedParams->action == 'getUsers') {
                $stmt = $dbh->prepare("SELECT userId, userFirstname, userEmail, userCreatedate FROM users where userId != :userId");
                session_start();
                $userId = $_SESSION['user']['userId'];
                session_write_close();
                $stmt->bindParam(':userId', $userId);
                $stmt->execute();
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                if ($users) {
                    $response['status'] = 200;
                    $response['message'] = 'Users fetched successfully';
                    $response['data'] = $users;
                    $response['userId'] = $userId;
                } else {
                    $response['status'] = 500;
                    $response['message'] = 'Error fetching users';
                }
            }
        }
    }

    if ($decodedParams->scope == 'message') {
        if (isset($decodedParams->action) && !empty($decodedParams->action)) {
            if ($decodedParams->action == 'sendMessage') {
                if (isset($decodedParams->message)) {
                    $timestamp = time();
                    $datetime = date("Y-m-d H:i:s", $timestamp);
                    $message = $decodedParams->message;
                    $to = $decodedParams->to;
                    session_start();
                    $from = $_SESSION['user']['userId'];
                    session_write_close();
                    $stmt = $dbh->prepare("INSERT INTO fapgar_1_chat (`id`, `from`, `to`, `message`, `sent`, `timestamp`) 
                    VALUES (NULL, :from, :to, :message, :sent, :timestamp)");
                    $stmt->bindParam(':from', $from);
                    $stmt->bindParam(':to', $to);
                    $stmt->bindParam(':message', $message);
                    $stmt->bindParam(':sent', $datetime);
                    $stmt->bindParam(':timestamp', $timestamp);

                    if ($stmt->execute()) {
                        $response['status'] = 200;
                        $response['message'] = 'Message successfully uploaded to db';
                    } else {
                        $response['status'] = 500;
                        $response['message'] = 'Error uploading message to db';
                    }
                } else {
                    $response['status'] = 400;
                    $response['message'] = 'Missing message parameter';
                }
            } elseif ($decodedParams->action == 'getMessages') {
                if (isset($decodedParams->from) && isset($decodedParams->to)) {
                    $from = $decodedParams->from;
                    $to = $decodedParams->to;
            
                    $stmt = $dbh->prepare("SELECT id, `from`, `to`, message, sent, recd, timestamp 
                                           FROM fapgar_1_chat 
                                           WHERE (`from` = :from AND `to` = :to) OR (`from` = :to AND `to` = :from) 
                                           ");
                    $stmt->bindParam(':from', $from);
                    $stmt->bindParam(':to', $to);
                    $stmt->execute();
                    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            
                    if ($messages) {
                        $response['status'] = 200;
                        $response['message'] = 'Messages fetched successfully';
                        $response['data'] = $messages;
                    } else {
                        $response['status'] = 404;
                        $response['message'] = 'No messages found';
                    }
                } else {
                    $response['status'] = 400;
                    $response['message'] = 'Missing from or to parameter';
                }
            } elseif ($decodedParams->action == 'getLatestMessage') {
                if (isset($decodedParams->from) && isset($decodedParams->to)) {
                    $from = $decodedParams->from;
                    $to = $decodedParams->to;
                    $stmt = $dbh->prepare("SELECT id, `from`, `to`, message, sent, recd, timestamp 
                                           FROM fapgar_1_chat 
                                           WHERE (`from` = :from AND `to` = :to) OR (`from` = :to AND `to` = :from) 
                                           ORDER BY id DESC LIMIT 1");
                    $stmt->bindParam(':from', $from);
                    $stmt->bindParam(':to', $to);
                    $stmt->execute();
                    $message = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($message) {
                        $response['status'] = 200;
                        $response['message'] = 'Latest message fetched successfully';
                        $response['data'] = $message;
                    } else {
                        $response['status'] = 404;
                        $response['message'] = 'No messages found';
                    }
                } else {
                    $response['status'] = 400;
                    $response['message'] = 'Missing from or to parameter';
                }
            }
        }
    }


    function isEmailExists($email, $dbh)
    {
        $stmt = $dbh->prepare("SELECT COUNT(*) FROM users WHERE userEmail = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $count = $stmt->fetchColumn();
        return $count > 0;
    }

    if (isset($decodedParams->action) && !empty($decodedParams->action)) {
        if ($decodedParams->action == 'register') {
            if (isset($decodedParams->userFirstname) && isset($decodedParams->userEmail) && isset($decodedParams->userPassword)) {
                $userFirstname = $decodedParams->userFirstname;
                $userEmail = $decodedParams->userEmail;
                $userPassword = $decodedParams->userPassword;
                $timestamp = time();

                if (isEmailExists($userEmail, $dbh)) {
                    $response['status'] = 400;
                    $response['message'] = 'Email already exists';
                } else {
                    $stmt = $dbh->prepare("INSERT INTO users (userFirstname, userEmail, userPassword, userCreatedate) 
                    VALUES (:userFirstname, :userEmail, :userPassword, :userCreateDate)");
                    $stmt->bindParam(':userFirstname', $userFirstname);
                    $stmt->bindParam(':userEmail', $userEmail);
                    $stmt->bindParam(':userPassword', $userPassword);
                    $stmt->bindParam(':userCreateDate', $timestamp);
                    $stmt->execute();

                    $stmt = $dbh->prepare("SELECT userId, userFirstname, userEmail, userPassword, userCreatedate FROM users WHERE userEmail = :userEmail");
                    $stmt->bindParam(':userEmail', $userEmail);
                    $stmt->execute();
                    $user = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($user) {
                        session_start();
                        $_SESSION['user'] = $user;
                        session_write_close();
                        $response['status'] = 200;
                        $response['message'] = 'User registered successfully';
                    } else {
                        $response['status'] = 500;
                        $response['message'] = 'Error registering user';
                    }
                }
            } else {
                $response['status'] = 400;
                $response['message'] = 'Missing user data';
            }
        }

        if ($decodedParams->action == 'login') {
            if (isset($decodedParams->userEmail) && isset($decodedParams->userPassword)) {
                $userEmail = $decodedParams->userEmail;
                $userPassword = $decodedParams->userPassword;

                $stmt = $dbh->prepare("SELECT userId, userFirstname, userEmail, userPassword, userCreatedate FROM users WHERE userEmail = :userEmail AND userPassword = :userPassword");
                $stmt->bindParam(':userEmail', $userEmail);
                $stmt->bindParam(':userPassword', $userPassword);
                $stmt->execute();
                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user) {
                    session_start();
                    $_SESSION['user'] = $user;
                    session_write_close();
                    $response['status'] = 200;
                    $response['message'] = 'User logged in successfully';
                } else {
                    $response['status'] = 400;
                    $response['message'] = 'Invalid email or password';
                }
            } else {
                $response['status'] = 400;
                $response['message'] = 'Missing email or password';
            }
        }
    }
}
echo json_encode($response);
exit;
