import { useEffect, useRef } from "react";
import websocket from "websocket";
import { getEnvConfig } from "../../common/env-config/envConfig";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getItem } from "../../common/local-storage/localStorage";
import { ILoginConfig, StorageKeys } from "../../common/types/storage.types";
import { IMessage } from "./chat.types";

const useSocketCommunication = (
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>,
): { client: websocket.w3cwebsocket | null } => {
  const client = useRef<websocket.w3cwebsocket | null>(null);

  useEffect(() => {
    const WebSocketClient = websocket.w3cwebsocket;
    const accessToken = getItem<ILoginConfig>(
      StorageKeys.LOGIN_CONFIG,
    )?.accessToken;
    client.current = new WebSocketClient(
      `${getEnvConfig(ENV_CONFIG_KEY.WEBSOCKET)}?token=${accessToken}`,
      "chat",
    );

    client.current.onopen = function onOpen() {
      console.log("WebSocket Client Connected");
    };

    client.current.onmessage = (message) => {
      if (typeof message.data === "string") {
        const parsedMessage = JSON.parse(message.data);
        const type = parsedMessage.type;
        const data = parsedMessage.data;

        switch (type) {
          case "message":
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                content: data.content,
                created_at: data.created_at,
                message_id: data.message_id,
                user_id: data.user_id,
                user_name: data.user_name,
              },
            ]);
            break;
        }
      }
    };

    client.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    client.current.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };

    return () => {};
  }, []);

  return { client: client.current };
};

export default useSocketCommunication;
