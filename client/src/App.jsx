import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AddProduct from "./pages/AddProduct";
import Processing from "./pages/Processing";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <Sidebar />

        <div className="main-content">

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />

            <Route
  path="/add-product"
  element={<AddProduct />}
/>

<Route
  path="/processing"
  element={<Processing />}
/>

<Route
  path="/reviews"
  element={<Reviews />}
/>

<Route
  path="/settings"
  element={<Settings />}
/>

          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;