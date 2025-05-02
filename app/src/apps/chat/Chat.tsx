import { useEffect, useMemo, useState } from "react";
import styles from "./chat.module.css";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";
import restClient from "../../common/rest-client/restClient";
import websocket from "websocket";

// TEMPORARY
const CHAT_ID = "7d133660-fc23-4dec-96d6-3097409be2da";
const WebSocketClient = websocket.w3cwebsocket;
const client = new WebSocketClient("ws://localhost:3000/", "chat");

const Chat = (): JSX.Element => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");

  useMemo(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send(
        JSON.stringify({
          type: "connect",
          data: {
            userId: localStorage.getItem("userId"),
          },
        }),
      );
    };

    client.onmessage = (message) => {
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

    client.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    client.onclose = () => {
      console.log("WebSocket Client Disconnected");
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const response = await restClient.get(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/message/chat/${CHAT_ID}`,
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    })();
  }, []);

  const handleSend = () => {
    client.send(
      JSON.stringify({
        type: "message",
        data: {
          srcUserId: localStorage.getItem("userId"),
          chatId: CHAT_ID,
          message: input,
        },
      }),
    );

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        content: input,
        created_at: new Date().toISOString(),
        message_id: "dummy-message-id",
        user_id: localStorage.getItem("userId") as string,
        user_name: localStorage.getItem("userName") as string,
      },
    ]);

    if (input.trim()) {
      setInput("");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.map((message, index) => (
          <div key={index} className={styles.message}>
            {message.user_name}: {message.content} <br />
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
