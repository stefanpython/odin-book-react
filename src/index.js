import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import RouterSwitch from "./components/RouterSwitch";
import { LayoutProvider } from "./components/LayoutContext";
import { CookiesProvider } from "react-cookie";
// eslint-disable-next-line
import "bootstrap/dist/css/bootstrap.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <CookiesProvider>
      <LayoutProvider>
        <RouterSwitch />
      </LayoutProvider>
    </CookiesProvider>
  </>
);
