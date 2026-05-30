import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { preloadCommonFonts } from "@/lib/google-fonts";

preloadCommonFonts();
createRoot(document.getElementById("root")!).render(<App />);
