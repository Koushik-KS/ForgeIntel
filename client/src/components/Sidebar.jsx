import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardCheck,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="brand">
        <div className="brand-icon">
          F
        </div>

        <div>
          <h2>ForgeIntel</h2>
          <span>Product Intelligence</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <p className="nav-label">
          MAIN
        </p>

        {/* DASHBOARD */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        {/* PRODUCTS */}
        <NavLink
          to="/products"
          end
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Package size={19} />
          <span>Products</span>
        </NavLink>

        {/* ADD PRODUCT */}
        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <PlusCircle size={19} />
          <span>Add Product</span>
        </NavLink>

        {/* REVIEWS */}
        <NavLink
          to="/reviews"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <ClipboardCheck size={19} />
          <span>Reviews</span>
        </NavLink>

        <p className="nav-label settings-label">
          SYSTEM
        </p>

        {/* SETTINGS */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Settings size={19} />
          <span>Settings</span>
        </NavLink>

      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">

        <div className="status-dot"></div>

        <div>
          <strong>
            ForgeIntel Engine
          </strong>

          <span>
            System operational
          </span>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;