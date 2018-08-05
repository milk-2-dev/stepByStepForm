<?php

if (isset($_POST)) {

    $response = 'Thanks, dear '.$_POST["surname"].' '.$_POST["name"].', we are very glad';

    echo json_encode($response);
}

?>