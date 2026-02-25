import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router/AppRoutes";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster richColors position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
