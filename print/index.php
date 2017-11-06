<?php
$id  = time();
$email = isset($_POST['email']) ? $_POST['email'] : null;

$email = str_replace('stud.fh-wedel.de', 'fh-wedel.de', $email);

$comp = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $_POST['comp']));
file_put_contents('./print/'.$id.'.jpg', $comp);

print $id.": ".$email."\n";

// Foto per Email versenden...
