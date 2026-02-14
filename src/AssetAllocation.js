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
    setAssets(await res.json());
  };

  const fetchAllocations = async () => {
    const res = await fetch("http://localhost:3001/asset-allocation");
    setAllocations(await res.json());
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitAllocation = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3001/asset-allocation/${editId}`
      : "http://localhost:3001/asset-allocation";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ employee_id: "", asset_id: "", allocated_quantity: "" });
    setEditId(null);
    fetchAllocations();
  };

  const editAllocation = (a) => {
    setForm({
      employee_id: a.employee_id,
      asset_id: a.asset_id,
      allocated_quantity: a.allocated_quantity
    });
    setEditId(a.allocation_id);
  };

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
          <option value="">Employee</option>
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
          <option value="">Asset</option>
          {assets.map(a => (
            <option key={a.asset_id} value={a.asset_id}>
              {a.asset_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="allocated_quantity"
          value={form.allocated_quantity}
          onChange={handleChange}
          required
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
              <td>{a.asset_id}</td>
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

