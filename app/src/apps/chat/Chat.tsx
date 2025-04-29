import { useEffect, useState } from "react";
import styles from "./chat.module.css";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";
import restClient from "../../common/rest-client/restClient";

// TEMPORARY
const CHAT_ID = "7d133660-fc23-4dec-96d6-3097409be2da";

const Chat = (): JSX.Element => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");

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
