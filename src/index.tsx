import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/root";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { MainRoute } from "./routes/MainRoute";
import { injectStore } from "./api/APIServices";
import { injectMediaStore } from "./api/APIMediaServer";

injectStore(store);
injectMediaStore(store);

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <MainRoute />
  </Provider>
);

reportWebVitals();
