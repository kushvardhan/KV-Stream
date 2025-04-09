import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/templates/ErrorBoundary";
import ScrollToTop from "./components/templates/ScrollToTop";
import "./index.css";
import store from "./store/store.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </Provider>
);
