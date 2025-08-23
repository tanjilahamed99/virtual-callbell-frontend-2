import {
  ControlBar,
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
import { useSearchParams, useNavigate } from "react-router-dom";

const serverUrl = import.meta.env.VITE_LIVEKIT_URL;

export default function RoomPage() {
  const [token, setToken] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  let roomName = searchParams.get("roomName");
  let username = searchParams.get("username");

  const [room] = useState(
    () =>
      new Room({
        adaptiveStream: true,
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

      // ✅ instant redirect when disconnected
      room.on("disconnected", () => {
        navigate("/", { replace: true });
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
        <MyVideoConference />
        <RoomAudioRenderer />
        <ControlBar />
      </div>
    </RoomContext.Provider>
  );
}

function MyVideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  const localTrack = tracks.find((t) => t.participant.isLocal);
  const remoteTracks = tracks.filter((t) => !t.participant.isLocal);

  return (
    <div className="w-full h-[90vh] relative bg-black">
      {/* Remote participant(s) full screen */}
      <div className="w-full h-full flex items-center justify-center">
        {remoteTracks.length > 0 ? (
          remoteTracks.map((track) => (
            <ParticipantTile
              key={track.participant.identity + track.source}
              trackRef={track}
              className="w-full h-full object-cover"
            />
          ))
        ) : (
          <div className="text-white text-xl">Waiting for other user...</div>
        )}
      </div>

      {/* Local participant small top-right corner */}
      {localTrack && (
        <div className="absolute top-4 right-4 w-40 h-28 rounded-lg overflow-hidden shadow-lg border-2 border-white">
          <ParticipantTile trackRef={localTrack} />
        </div>
      )}
    </div>
  );
}
