import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
    <ToastContainer
      autoClose={500}
      position="top-right"
      theme="dark"
      toastClassName="!bg-gray-900 !border !border-gray-700 !text-white !rounded-xl !shadow-lg"
      bodyClassName="!text-sm !font-medium"
      progressClassName="!bg-white"
    />
  </BrowserRouter>,
);
