import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;