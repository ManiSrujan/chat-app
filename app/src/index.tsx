import ReactDOM from "react-dom/client";
import "@radix-ui/themes/styles.css";
import "./normalize.css";
import App from "./App";

const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootEl);

root.render(<App />);
