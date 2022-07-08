import React from "react";
import { createRoot } from "react-dom/client";

import "./index.scss";

const App = () => {
  return (
    <div>
      <p>Hello!</p>
    </div>
  );
};

const root = createRoot(document.getElementById("app"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
