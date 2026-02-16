import { useEffect, useState } from "react";

function AssetAllocation() {
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employee_id: "",
    asset_id: "",
    allocated_quantity: ""
  });

  useEffect(() => {
    fetchEmployees();
    fetchAssets();
    fetchAllocations();
  }, []);

  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:3001/employee");
    setEmployees(await res.json());
  };

  const fetchAssets = async () => {
    const res = await fetch("http://localhost:3001/asset");
    const data = await res.json();
    setAssets(data);
  };

  const fetchAllocations = async () => {
    const res = await fetch("http://localhost:3001/asset-allocation");
    const data = await res.json();
    setAllocations(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If selecting a unique asset, auto-set quantity = 1
    if (name === "asset_id") {
      const selectedAsset = assets.find(a => a.asset_id === Number(value));
      if (selectedAsset?.track_type === "Unique") {
        setForm({
          ...form,
          asset_id: Number(value),
          allocated_quantity: 1
        });
        return;
      }
    }

    setForm({ ...form, [name]: name === "asset_id" ? Number(value) : value });
  };

  const submitAllocation = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3001/asset-allocation/${editId}`
      : "http://localhost:3001/asset-allocation";

    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!res.ok) {
      const error = await res.json();
      return alert(error.message);
    }

    setForm({ employee_id: "", asset_id: "", allocated_quantity: "" });
    setEditId(null);
    fetchAllocations();
    fetchAssets(); // refresh available assets
  };

  const editAllocation = (a) => {
    setForm({
      employee_id: a.employee_id,
      asset_id: a.asset_id,
      allocated_quantity: a.allocated_quantity
    });
    setEditId(a.allocation_id);
  };

  // Filter assets for dropdown (Unique assets already allocated are removed)
  const availableAssets = assets.filter(a => {
    if (a.track_type === "Unique") {
      const allocated = allocations.find(al => al.asset_id === a.asset_id);
      return !allocated;
    }
    return true; // Bulk assets remain available
  });

  return (
    <div>
      <h2>Asset Allocation</h2>

      <form onSubmit={submitAllocation}>
        <select
          name="employee_id"
          value={form.employee_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(e => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.employee_name}
            </option>
          ))}
        </select>

        <select
          name="asset_id"
          value={form.asset_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Asset</option>
          {availableAssets.map(a => (
            <option key={a.asset_id} value={a.asset_id}>
              {a.asset_name} {a.track_type === "Unique" ? "(Unique)" : ""}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="allocated_quantity"
          value={form.allocated_quantity}
          onChange={handleChange}
          required
          min={1}
          disabled={
            assets.find(a => a.asset_id === Number(form.asset_id))?.track_type === "Unique"
          }
        />

        <button type="submit">
          {editId ? "Update" : "Allocate"}
        </button>
      </form>

      <br />

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Asset</th>
            <th>Qty</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {allocations.map(a => (
            <tr key={a.allocation_id}>
              <td>{a.employee_id}</td>
              <td>{a.asset_name}</td>
              <td>{a.allocated_quantity}</td>
              <td>
                <button onClick={() => editAllocation(a)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AssetAllocation;



