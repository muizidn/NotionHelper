import React from "react";
import ReactDOM from "react-dom/client";
import { Language } from "./language";
import createDraggableContainer from "./createDraggableContainer";
import FAB from "./FAB";

import "./../index.css";

function Fab() {
  return (
    <FAB/>
  );
}

const __ID = "honyaku-app-fab";

ReactDOM.createRoot(createDraggableContainer(__ID, document.body)).render(
  <React.StrictMode>
    <Fab/>
  </React.StrictMode>
);
