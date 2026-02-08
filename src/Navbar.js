import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      background: "#222",
      padding: "12px",
      display: "flex",
      gap: "25px"
    }}>
      <Link style={{ color: "white", textDecoration: "none" }} to="/employee">
        Employee
      </Link>

      <Link style={{ color: "white", textDecoration: "none" }} to="/asset">
        Asset
      </Link>

      <Link style={{ color: "white", textDecoration: "none" }} to="/asset-allocation">
        Asset Allocation
      </Link>
    </div>
  );
}

export default Navbar;
