import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import axios from "axios";
import styles from "./login.module.css";
import { ENV_CONFIG_KEY } from "../../common/env-config/constants";
import { getEnvConfig } from "../../common/env-config/envConfig";

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
}

const Login = () => {
  const [, setLoc] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken && refreshToken) {
      setLoc("/chat"); // Redirect to chat page if tokens are available
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post<LoginResponse>(
        `${getEnvConfig(ENV_CONFIG_KEY.AUTH)}/auth/login`,
        {
          username,
          password,
        },
      );
      const { accessToken, refreshToken, userId } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId);

      console.log("Login successful:", response.data);
      setLoc("/chat"); // Redirect to chat page after login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className={styles.content}>
      <h1 className={styles.title}>Login</h1>
      <div className={styles.loginForm}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleLogin} className={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
