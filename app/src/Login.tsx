import { useState } from 'react';
import { useLocation } from 'wouter';
import styles from './login.module.css';

const Login = () => {
  const [, setLoc] = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Placeholder for login logic
    console.log('Logging in with', username, password);
    setLoc('/chat'); // Redirect to chat page after login
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
        <button onClick={handleLogin} className={styles.button}>Login</button>
      </div>
    </div>
  );
};

export default Login;