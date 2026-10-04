import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./cinematic.css";
import "./refinements.css";
import "./project-galleries.css";

const root = document.getElementById("root");
if (root.hasChildNodes()) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
