import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error handling for development
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
} else {
  console.error('Root element not found');
}
