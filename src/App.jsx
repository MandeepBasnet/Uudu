import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuMain from "./pages/Menu/MenuMain";
import Cook from "./pages/Cook";
import Location from "./pages/Location";
import Events from "./pages/Events";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuMain />} />
        <Route path="/cook" element={<Cook />} />
        <Route path="/location" element={<Location />} />
        <Route path="/events" element={<Events />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
