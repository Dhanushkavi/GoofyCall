import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import "./index.css";
import "./styles/ui.css";

// Polyfills for simple-peer in Vite
import { Buffer } from "buffer";
window.Buffer = Buffer;
window.process = { env: {} };

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
