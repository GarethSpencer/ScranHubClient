import React from "react";

interface RealtimeContextType {
  watchGroup: (groupId: string) => void;

  unwatchGroup: (groupId: string) => void;

  isConnected: boolean;
}

const RealtimeContext = React.createContext<RealtimeContextType>({
  watchGroup: () => {},
  unwatchGroup: () => {},
  isConnected: false,
});

export default RealtimeContext;
