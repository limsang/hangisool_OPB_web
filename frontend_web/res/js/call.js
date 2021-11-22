// CAR_HASH and WEBRTC_SIGNALING_ADDR must be defined in parent HTML document
// ... or you can define here

'use strict';

/* =====        U I        ===== */
/* =====     Variables     ===== */
let   wasEmergency        = false;
/* ============================= */

/* ===  DOM-jQuery  Objects  === */
const $callNavigation     = $("nav#call_nav");
const $callEndEmergency   = $callNavigation.find("#topright_endemerg_container");
const $callGoToBack       = $callNavigation.find("#topleft_gotoback_container");
/* ============================= */

/* ===      Event Setup      === */
$callEndEmergency.click(callUI_EndEmergency);
$callGoToBack.click(callUI_EndCallAndGoToBack);
/* ============================= */

/* === Functions / Callbacks === */
function callUI_EndEmergency() {
    if(confirm("비상 상황을 종료하시겠습니까?")) {
        $.ajax({
            method: "POST",
            url: "/action/set-car-emergency-flag.php",
            data: {
                hash: CAR_HASH,
                set_to:      0,
                set_calling: 0
            }
        }).done(function(data) {
            if(data.result === "success") {
                alert("비상 상황을 종료했습니다.");
                window.location.href = "/";
            } else {
                alert("비상 상황 플래그를 설정할 수 없습니다. " + data.message);
                window.location.href = "/";
            }
        }).fail(function() {
            alert("비상 상황 플래그를 설정할 수 없습니다. (AJAX 실패)");
            window.location.href = "/";
        }).always(function() {
            connectionCleanup();
        });
    }
}

function callUI_EndCallAndGoToBack() {
    if(!callStarted || confirm("통화를 종료하고 메인 페이지로 돌아가시겠습니까?")) {
        $.ajax({
            method: "POST",
            url: "/action/set-car-emergency-flag.php",
            data: {
                hash: CAR_HASH,
                set_calling: 0
            }
        }).done(function(data) {
            if(data.result === "success") {
                window.location.href = "/";
            } else {
                alert("통화 진행 플래그를 설정할 수 없습니다. " + data.message);
                window.location.href = "/";
            }
        }).fail(function() {
            alert("통화 진행 플래그를 설정할 수 없습니다. (AJAX 실패)");
            window.location.href = "/";
        }).always(function() {
            wasEmergency = true;
            connectionCleanup();
        });
    }
}
/* ============================= */
/* ============================= */


/* =====    W e b R T C    ===== */
/* === Variable&&Definitions === */
const WEBRTC_VIDEO_WIDTH   = 640;
const WEBRTC_VIDEO_HEIGHT  = 480;
const WEBRTC_VIDEO_MIN_FPS = 5;
const WEBRTC_VIDEO_MAX_FPS = 20;

const localVideoElement   = $("video#local_video")[0];
const remoteVideoElement  = $("video#remote_video")[0];
let   localMediaStream;
let   remoteMediaStream;

let   peerConnection;
const peerConnectionConfig = {      // FOR TESTING PURPOSE ONLY. Should build our own STUN and TURN servers while in production.
    "iceServers": [
        // STUN servers
        { urls: [ "stun:stun.l.google.com:19302",
                  "stun:stun1.l.google.com:19302" ] },
        /* { urls: [ "stun:hgstest.b.lue.blue" ],
          username: "hangisool",
          credential: "hangisool_test" }, */

        // TURN servers
        /* { urls: [ "turn:hgstest.b.lue.blue" ],
          username: "hangisool",
          credential: "hangisool_test" }, */
        { urls: [ 'turn:numb.viagenie.ca' ],
          username: 'webrtc@live.com',
          credential: 'muazkh' }
    ]
}

let   callStarted = false;
let   anotherJoined = false;
let   anotherGotUserMedia = false;
let   isInitiator = false;
/* ============================= */

/* ===       Socket.io       === */
const socket = io.connect(WEBRTC_SIGNALING_ADDR, { secure: true });

if(CAR_HASH !== "") {
    socket.emit("join", CAR_HASH);
} else {
    alert("Car 정보를 확인할 수 없습니다. 메인 페이지로 돌아갑니다.");
    window.location.href = "/";
}

socket.on("roomFull", function() {
    alert("다른 담당자가 현재 통화 중입니다. 메인 페이지로 돌아갑니다.");
    window.location.href = "/";
});

socket.on("roomCreated", function() {
    console.debug("roomCreated");
    isInitiator = true;
});

socket.on("roomJoined", function() {
    console.debug("roomJoined");
    isInitiator = false;
    anotherJoined = true;
});

socket.on("roomSomeoneLeft", function() {
    alert("상대방이 통화를 종료했습니다.");
    connectionCleanup();
});

socket.on("roomSomeoneJoined", function(socketId) {
    console.debug("roomSomeoneJoined : ", socketId);
    anotherJoined = true;
});

socket.on("roomMessageRelayed", function(socketId, message) {
    if(typeof(message) !== "undefined") {
        if(socketId !== socket.id) {
            console.debug("RECV ", socketId, message);
            if(typeof(message) === "string") message = message.trim();

            if(message === "gotUserMedia") {
                anotherGotUserMedia = true;
                tryStartWebRTC();
            }
            
            // Signaling part
            if(message.type === "offer") {
                anotherGotUserMedia = true;     // Assuming another got user media already when an offer incomes.
                if(!isInitiator && !callStarted) {
                    console.debug("Offer incoming: I'm not the initiator, and call was not started.");
                    tryStartWebRTC();
                }
    
                if(typeof(peerConnection) !== "undefined") {
                    peerConnection.setRemoteDescription(new RTCSessionDescription(message));
                    peerConnection.createAnswer().then(setLocalDescriptionAndSendMessage);
                }
            } else if(message.type === "answer" && callStarted) {
                peerConnection.setRemoteDescription(new RTCSessionDescription(message));
            } else if(message.type === "candidate" && callStarted) {
                peerConnection.addIceCandidate(new RTCIceCandidate({
                    sdpMLineIndex: message.label,
                    candidate:     message.candidate
                }));
            }
        }
    }
});
/* ============================= */

$(window).on("beforeunload", function() {
    if(!wasEmergency) {
        $.ajax({
            method: "POST",
            url: "/action/set-car-emergency-flag.php",
            data: {
                hash: CAR_HASH,
                set_calling: 0
            }
        }).always(function() {
            connectionCleanup();
        });
    }
});

navigator.mediaDevices.getUserMedia({
    audio: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
    },
    video: {
        width:   WEBRTC_VIDEO_WIDTH,
        height:  WEBRTC_VIDEO_HEIGHT,
        frameRate: {
            min: WEBRTC_VIDEO_MIN_FPS,
            max: WEBRTC_VIDEO_MAX_FPS
        }
    }
}).then(gotUserMediaCallback).catch(function(error) {
    alert("카메라 혹은 마이크를 활성화하는데 실패했습니다. " + error.name);
});

function gotUserMediaCallback(stream) {
    sendRoomMessage("gotUserMedia");
    localMediaStream = stream;
    localVideoElement.srcObject = stream;

    if(isInitiator && anotherGotUserMedia) {
        tryStartWebRTC();
    }
}

function tryStartWebRTC() {
    console.debug("Call sequence function called: tryStartWebRTC()");

    if(!callStarted && typeof(localMediaStream) !== "undefined" && anotherJoined && anotherGotUserMedia) {
        console.debug("Call sequence requirements fulfilled.");

        createPeerConnection();
        peerConnection.addStream(localMediaStream);
        callStarted = true;

        if(isInitiator) {
            peerConnection.createOffer().then(setLocalDescriptionAndSendMessage);
        }
    } else {
        console.debug("Call sequence requirements not fulfilled; [callStarted, Type of localMediaStream, anotherJoined, anotherGotUserMedia]",
                      callStarted, typeof(localMediaStream), anotherJoined, anotherGotUserMedia);
    }
}

function setLocalDescriptionAndSendMessage(sessionDescription) {
    peerConnection.setLocalDescription(sessionDescription);
    sendRoomMessage(sessionDescription);
}

function createPeerConnection() {
    try {
        // peerConnection = new RTCPeerConnection(null);
        peerConnection = new RTCPeerConnection(peerConnectionConfig);        // Enable STUN/TURN servers
        
        peerConnection.onicecandidate = function(event) {
            if(event.candidate) {
                sendRoomMessage({
                    type:      "candidate",
                    label:     event.candidate.sdpMLineIndex,
                    id:        event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                });
            }
        };
        peerConnection.ontrack = function(event) {
            remoteMediaStream = event.streams[0];
            remoteVideoElement.srcObject = remoteMediaStream;
        };
        peerConnection.onremovestream = function() {
            alert("영상 통화 스트림 종료.");
        };
    } catch(error) {
        console.error("Failed to create PeerConnection. ", error.message);
        alert("장치 간 연결을 만들 수 없습니다. 잠시 후 다시 시도해 주세요.");
        return;
    }
}

function sendRoomMessage(obj) {
    console.debug("SEND ", obj);
    socket.emit("roomMessage", CAR_HASH, obj);
}

function connectionCleanup() {
    console.debug("connectionCleanup");
    socket.emit("leave", CAR_HASH);
    console.debug("connectionCleanup - Socket.IO `leave` message sent");

    setTimeout(function() {
        isInitiator = false;
        callStarted = false;
        anotherJoined = false;
        anotherGotUserMedia = false;
    
        if(typeof(socket) !== "undefined" && socket != null) {
            socket.disconnect();
            socket.close();
        }
    
        if(typeof(peerConnection) !== "undefined" && peerConnection != null) {
            peerConnection.close();
            peerConnection = null;
        }
        
        console.debug("Socket.IO client instance and Peer Connection closed");
    }, 500);
}
/* ============================= */