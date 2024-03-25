import { useEffect } from "react";

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

const VideoChat = () => {
  useEffect(() => {
    (async () => {
      let localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    })();
    let pc = new RTCPeerConnection(servers);

    let remoteStream = null;
  }, []);
  return <div>VideoChat</div>;
};

export default VideoChat;
