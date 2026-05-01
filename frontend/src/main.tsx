import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// entry point of the  application. It renders the App component inside a StrictMode wrapper for highlighting potential issues in development. 
// The root element is obtained from the HTML document, and the React application is mounted there.

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);