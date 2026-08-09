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
      <div className="brand">
        <div className="brand-icon">F</div>

        <div>
          <h2>ForgeIntel</h2>
          <span>Product Intelligence</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MAIN</p>

        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `nav-item ${isActive ? "active" : ""}`
          }
        >
          <Package size={19} />
          <span>Products</span>
        </NavLink>

        <a className="nav-item" href="#">
          <PlusCircle size={19} />
          <span>Add Product</span>
        </a>

        <a className="nav-item" href="#">
          <ClipboardCheck size={19} />
          <span>Reviews</span>
        </a>

        <p className="nav-label settings-label">
          SYSTEM
        </p>

        <a className="nav-item" href="#">
          <Settings size={19} />
          <span>Settings</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="status-dot"></div>

        <div>
          <strong>ForgeIntel Engine</strong>
          <span>System operational</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;