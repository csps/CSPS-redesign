import { BrowserRouter } from "react-router-dom";
import "./App.css";
import RouteContainer from "./router/RouteContainer";
import AOS from "aos";
import { useEffect } from "react";
import 'aos/dist/aos.css';
import { ScrollToTop } from "./components/ScrollToTop";

function App() {

    useEffect(() => {
    AOS.init({
      duration: 600, 
      easing: "ease-out-cubic",
      once: false,    
      offset: 100,   
    });
  }, [])
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteContainer />
    </BrowserRouter>
  );
}

export default App;
