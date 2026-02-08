import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Employee from "./Employee";
import Asset from "./Asset";
import AssetAllocation from "./AssetAllocation";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/employee" />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/asset" element={<Asset />} />
        <Route path="/asset-allocation" element={<AssetAllocation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


