import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import store from "./store";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* Toast container */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontSize: "0.85rem",
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
