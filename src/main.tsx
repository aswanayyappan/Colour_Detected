import { createRoot } from "react-dom/client";

// 1. Tailwind preflight + theme — loaded FIRST
import "./styles/index.css";

// 2. Custom app styles — loaded SECOND so they override Tailwind resets
import "./styles/color-detector.css";

// 3. App
import App from "./app/App.tsx";

createRoot(document.getElementById("root")!).render(<App />);