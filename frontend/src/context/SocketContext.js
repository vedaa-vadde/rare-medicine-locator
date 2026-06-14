import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL || "http://localhost:5000");

    socketRef.current.on("medicine:stockUpdated", ({ medicineName, pharmacyName, stock }) => {
      toast(`📦 ${medicineName} at ${pharmacyName}: ${stock} units left`, {
        icon: stock < 10 ? "⚠️" : "✅",
        duration: 4000,
      });
    });

    socketRef.current.on("medicine:added", ({ medicineName, pharmacyName }) => {
      toast.success(`🆕 New medicine added: ${medicineName} at ${pharmacyName}`);
    });

    return () => socketRef.current?.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
