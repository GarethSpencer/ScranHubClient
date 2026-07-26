import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../auth/useAuth";
import RealtimeContext from "./realtimeContext";
import {
  createRealtimeInvalidator,
  invalidateAfterReconnect,
  type GroupChangedEvent,
  type UserChangedEvent,
} from "./realtimeEvents";

interface Props {
  children: React.ReactNode;
}

const getHubUrl = () => {
  try {
    return new URL("/hubs/group", import.meta.env.VITE_API_BASE_URL).toString();
  } catch {
    console.warn(
      "VITE_API_BASE_URL is missing or malformed, so live updates are disabled.",
    );
    return null;
  }
};

const RealtimeProvider = ({ children }: Props) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const connectionRef = useRef<HubConnection | null>(null);
  const watchedGroupsRef = useRef<Set<string>>(new Set());

  const getAccessTokenRef = useRef(getAccessTokenSilently);
  useEffect(() => {
    getAccessTokenRef.current = getAccessTokenSilently;
  }, [getAccessTokenSilently]);

  const joinWatchedGroups = useCallback((connection: HubConnection) => {
    for (const groupId of watchedGroupsRef.current) {
      connection.invoke("JoinGroup", groupId).catch((error: unknown) => {
        console.warn(`Could not watch group ${groupId} for changes:`, error);
      });
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const hubUrl = getHubUrl();
    if (!hubUrl) return;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getAccessTokenRef.current(),
      })
      .withAutomaticReconnect()
      .configureLogging(
        import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning,
      )
      .build();

    const invalidator = createRealtimeInvalidator(queryClient);

    connection.on("GroupChanged", (event: GroupChangedEvent) =>
      invalidator.groupChanged(event),
    );

    connection.on("UserChanged", (event: UserChangedEvent) =>
      invalidator.userChanged(event),
    );

    connection.onreconnecting(() => setIsConnected(false));
    connection.onclose(() => setIsConnected(false));

    connection.onreconnected(() => {
      setIsConnected(true);

      joinWatchedGroups(connection);

      invalidateAfterReconnect(queryClient);
    });

    connectionRef.current = connection;

    let cancelled = false;

    connection
      .start()
      .then(() => {
        if (cancelled) return;
        setIsConnected(true);
        joinWatchedGroups(connection);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.warn("Could not open the live updates connection:", error);
      });

    return () => {
      cancelled = true;
      connectionRef.current = null;
      setIsConnected(false);
      invalidator.dispose();
      connection.stop().catch(() => {});
    };
  }, [isAuthenticated, queryClient, joinWatchedGroups]);

  const watchGroup = useCallback((groupId: string) => {
    if (!groupId || watchedGroupsRef.current.has(groupId)) return;
    watchedGroupsRef.current.add(groupId);

    const connection = connectionRef.current;
    if (connection?.state === HubConnectionState.Connected) {
      connection.invoke("JoinGroup", groupId).catch((error: unknown) => {
        console.warn(`Could not watch group ${groupId} for changes:`, error);
      });
    }
  }, []);

  const unwatchGroup = useCallback((groupId: string) => {
    if (!watchedGroupsRef.current.delete(groupId)) return;

    const connection = connectionRef.current;
    if (connection?.state === HubConnectionState.Connected) {
      connection.invoke("LeaveGroup", groupId).catch(() => {});
    }
  }, []);

  const value = useMemo(
    () => ({ watchGroup, unwatchGroup, isConnected }),
    [watchGroup, unwatchGroup, isConnected],
  );

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeProvider;
