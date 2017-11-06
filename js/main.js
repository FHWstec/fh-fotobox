var $canvas = document.getElementById('canvas');
var ctx = $canvas.getContext('2d');
var $start = document.getElementById('start');
var $help = document.getElementById('help');
var $camera = document.getElementById('camera');
var $countdown = document.getElementById('countdown');
var $overlay = document.getElementById('overlay');
var $result = document.getElementById('result');
var $print = document.getElementById('print');
var $printing = document.getElementById('printing');
var $email = document.getElementById('email');
var $email_inpt = document.getElementById('email_inpt');

var mask = new Image();
mask.src = "img/mask_hd.png";
mask.onload = function () {
    ctx.drawImage(mask, 0, 0);
};

Webcam.attach('#camera');
Webcam.set({
    width: 640,
    height: 480,
    dest_width: 1618,
    dest_height: 1214,
    crop_width: 1618,
    crop_height: 1028,
    image_format: 'png',
    // jpeg_quality: 90,
    enable_flash: false,
    force_flash: false,
    flip_horiz: true,
    fps: 45
});

function startBooth() {
    $start.style.display = "none";
    $help.style.display = "none";
    takePicture(function (snap_1) {
        takePicture(function (snap_2) {
            takePicture(function (snap_3) {
                $countdown.style.display = "none";
                $overlay.style.display = "none";
                $camera.style.display = "none";
                $result.style.display = "block";

                ctx.drawImage(snap_1, 0, 0, 1618, 1028);
                ctx.drawImage(snap_2, 0, 1334, 1618, 1028);
                ctx.drawImage(snap_3, 1924, 1334, 1618, 1028);
                ctx.drawImage(mask, 0, 0);
            });
        });
    });
};

function takePicture(cb) {
    $countdown.innerHTML = "3";
    $countdown.style.display = "block";
    window.setTimeout(function () {
        $countdown.innerHTML = "2";
        window.setTimeout(function () {
            $countdown.innerHTML = "1";
            window.setTimeout(function () {
                $overlay.style.display = "block";
                Webcam.snap(function(data_uri, snap, context) {
                    window.setTimeout(function () {
                        $overlay.style.display = "none";
                        cb(snap);
                    }, 300);
                });
            }, 1000);
        }, 1000);
    }, 1000);
};

function startOver() {
    $result.style.display = "none";
    $print.style.display = "block";
    $countdown.style.display = "none";
    $overlay.style.display = "none";
    $start.style.display = "block";
    $help.style.display = "block";
    $camera.style.display = "block";
}

function print() {
    $print.style.display = "none";
    $email.style.display = "block";
}

function email_close() {
    $print.style.display = "block";
    $email.style.display = "none";
    $email_inpt.value = "";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function email_send() {
    var email = $email_inpt.value;

    if(!validateEmail(email)) {
        alert('Bitte gebe eine gültige E-Mail-Adresse ein.');
        return;
    }

    email_close();
    $printing.style.display = "block";
    $print.style.display = "none";
    var data_uri = $canvas.toDataURL("image/jpeg", 0.8);
    
    $.post("./print/", {
        email: email,
        comp: data_uri,
    }).done(function(data) {
        console.log(data);
        window.setTimeout(function () {
            $printing.style.display = "none";
            startOver();
        }, 3000);
    });
}

$('#email_inpt').keyboard({
    display: {
        'bksp'   : '\u2190',
        'enter'  : 'return',
        'normal' : 'ABC',
        'meta1'  : '.?123',
        'meta2'  : '#+=',
        'accept' : 'return'
    },
    layout: 'custom',
    customLayout: {
        'normal': [
            '1 2 3 4 5 6 7 8 9 0',
            'q w e r t z u i o p {bksp}',
            'a s d f g h j k l {accept}',
            '{s} y x c v b n m @ . {s}',
            '{meta1} {space} _ -'
        ],
        'shift': [
            'Q W E R T Y U I O P {bksp}',
            'A S D F G H J K L {accept}',
            '{s} Z X C V B N M @ . {s}',
            '{meta1} {space} _ -'
        ],
        'meta1': [
            '1 2 3 4 5 6 7 8 9 0 {bksp}',
            '` | { } % ^ * / \' {accept}',
            '{meta2} $ & ~ # = + . {meta2}',
            '{normal} {space} ! ?'
        ],
        'meta2': [
            '[ ] { } \u2039 \u203a ^ * " , {bksp}',
            '\\ | / < > $ \u00a3 \u00a5 \u2022 {accept}',
            '{meta1} \u20ac & ~ # = + . {meta1}',
            '{normal} {space} ! ?'
        ]
    }
});