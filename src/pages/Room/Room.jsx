import {
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  RoomContext,
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import "@livekit/components-styles";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../config/constant";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const serverUrl = import.meta.env.VITE_LIVEKIT_URL;

export default function RoomPage() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  let roomName = searchParams.get("roomName");
  let username = searchParams.get("username");
  const navigate = useNavigate();

  const [room] = useState(
    () =>
      new Room({
        // Optimize video quality for each participant's screen
        adaptiveStream: true,
        // Enable automatic audio/video quality optimization
        dynacast: true,
      })
  );

  // Connect to room
  useEffect(() => {
    if (token) {
      let mounted = true;
      const connect = async () => {
        if (mounted) {
          await room.connect(serverUrl, token);
        }
      };
      connect();

      // listen for disconnect → redirect home
      room.on("disconnected", () => {
        navigate("/");
      });

      return () => {
        mounted = false;
        room.disconnect();
      };
    }
  }, [room, token, navigate]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios(
        `${BASE_URL}/liveKit/get-token?roomName=${roomName}&username=${username}`
      );
      const { token } = data;
      setToken(token);
    };
    fetch();
  }, [roomName, username]);

  return (
    <RoomContext.Provider value={room}>
      <div data-lk-theme="default" style={{ height: "100vh" }}>
        {/* Your custom component with basic video conferencing functionality. */}
        <MyVideoConference />
        {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
        <RoomAudioRenderer />
        {/* Controls for the user to start/stop audio, video, and screen share tracks */}
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  // `useTracks` returns all camera and screen share tracks. If a user
  // joins without a published camera track, a placeholder track is returned.
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  return (
    <GridLayout
      tracks={tracks}
      style={{ height: "calc(100vh - var(--lk-control-bar-height))" }}>
      {/* The GridLayout accepts zero or one child. The child is used
      as a template to render all passed in tracks. */}
      <ParticipantTile />
    </GridLayout>
  );
}
