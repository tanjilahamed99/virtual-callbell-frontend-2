/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import socket from "../utils/soket";
import { useNavigate } from "react-router-dom";

const CallContext = createContext();

export const Provider = ({ children }) => {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = useState(null);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null);
  console.log(user);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on("connection", () => {
      console.log("✅ Socket connected");
    });

    if (user) {
      socket.emit("register", user.id);
    }

    socket.on("incoming-call", ({ from, roomName }) => {
      setIncomingCall({ from, roomName });
      setModalOpen(true);
    });

    socket.on("call-accepted", ({ roomName, peerSocketId }) => {
      navigate(
        `/room?roomName=${roomName}&username=${user.name}&peerSocketId=${peerSocketId}`
      );
    });

    socket.on("call-declined", () => {});

    socket.on("callCanceled", (data) => {
      if (data.success) {
        setModalOpen(false);
        setIncomingCall(null);
      }
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-declined");
      socket.off("callCanceled");
    };
  }, [user, navigate, incomingCall]);

  const declineCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call-declined", { guestSocketId: incomingCall.from.socketId });
    setModalOpen(false);
    setIncomingCall(null);
  }, [incomingCall]);

  const acceptCall = useCallback(() => {
    if (!incomingCall) return;
    socket.emit("call-accepted", {
      roomName: incomingCall.roomName,
      guestSocketId: incomingCall.from.socketId,
    });
    setModalOpen(false);
    navigate(
      `/room?roomName=${incomingCall.roomName}&username=${user.name}&peerSocketId=${incomingCall.from.socketId}`
    );
  }, [incomingCall, navigate, user]);

  const data = {
    incomingCall,
    declineCall,
    acceptCall,
    modalOpen,
    user,
    setUser,
    token,
    setToken,
  };
  return <CallContext.Provider value={data}>{children}</CallContext.Provider>;
};

export const useCall = () => useContext(CallContext);
