import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouterCounter from "./router/routerContainer";

function App() {
  return (
    <BrowserRouter>
      <RouterCounter />
    </BrowserRouter>
  );
}

export default App;
