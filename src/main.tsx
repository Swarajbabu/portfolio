import { PostHogProvider } from "posthog-js/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const apiKey = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

const root = createRoot(document.getElementById("root")!);

if (apiKey) {
  root.render(
    <PostHogProvider apiKey={apiKey} options={options}>
      <App />
    </PostHogProvider>
  );
} else {
  root.render(<App />);
}
