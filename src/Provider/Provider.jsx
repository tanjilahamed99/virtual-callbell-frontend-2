/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import setAuthToken from "../config/setAuthToken";
import { BASE_URL } from "../config/constant";
import socket from "../utils/soket";

const CallContext = createContext();

export const Provider = ({ children }) => {
  const navigate = useNavigate();

  // Global states
  const [incomingCall, setIncomingCall] = useState(null);
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState(null);

  console.log(user);

  // ✅ INIT LOGIC (moved from your init.js)
  useEffect(() => {
    const init = async () => {
      document.addEventListener("gesturestart", (e) => {
        e.preventDefault();
      });

      // Version check
      if (localStorage.getItem("app") !== "Virtual 2.x.x") {
        localStorage.clear();
        localStorage.setItem("app", "Virtual 2.x.x");
      }

      let token = localStorage.getItem("token");
      let userString = localStorage.getItem("user");
      let user = userString ? JSON.parse(userString) : null;

      if (token) {
        const decoded = jwtDecode(token, { complete: true });
        const dateNow = new Date();
        const isExpired = decoded.exp * 1000 < dateNow.getTime();

        let result;
        if (!isExpired) {
          try {
            const res = await axios.post(`${BASE_URL}/auth/check-user`, {
              id: decoded.id,
            });
            result = res.data;
          } catch (err) {
            console.log(err);
            result = null;
          }
        }

        if (!result || result.error) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          token = null;
          user = null;
        }
      }

      if (token) {
        setAuthToken(token);
      }

      // Push values into global state
      setToken(token);
      setUser(user);
    };

    init();
  }, []);

  // ✅ SOCKET HANDLING
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
  }, [user, navigate]);

  // ✅ Helper functions
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

  // ✅ Data available everywhere
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
