import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [assets, setAssets] = useState([]);
  const [mode, setMode] = useState("list"); // list | add | edit
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    category_id: "",
    asset_name: "",
    brand: "",
    model: "",
    track_type: "Bulk",
    connection_type: "",
    total_quantity: "",
    status: true
  });

  // Load assets
  const loadAssets = () => {
    fetch("http://localhost:3001/asset")
      .then(res => res.json())
      .then(data => setAssets(data));
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD
  const addAsset = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: Number(form.category_id),
        total_quantity: Number(form.total_quantity)
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Asset Added");
    setMode("list");
    loadAssets();
  };

  // EDIT
  const editAsset = (asset) => {
    setForm(asset);
    setEditId(asset.asset_id);
    setMode("edit");
  };

  // UPDATE
  const updateAsset = async (e) => {
    e.preventDefault();

    const res = await fetch(`http://localhost:3001/asset/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        total_quantity: Number(form.total_quantity)
      })
    });

    const data = await res.json();
    if (!res.ok) return alert(data);

    alert("Asset Updated");
    setMode("list");
    loadAssets();
  };

  

  if (mode === "list") {
    return (
      <div>
        <h2>Asset List</h2>
        <button onClick={() => setMode("add")}>Add Asset</button>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Track Type</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.asset_id}>
                <td>{a.asset_name}</td>
                <td>{a.track_type}</td>
                <td>{a.total_quantity}</td>
                <td>{a.status ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => editAsset(a)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ADD / EDIT FORM
  return (
    <div>
      <h2>{mode === "add" ? "Add Asset" : "Edit Asset"}</h2>

      <form onSubmit={mode === "add" ? addAsset : updateAsset}>
        <input
          name="category_id"
          placeholder="Category ID"
          value={form.category_id}
          onChange={handleChange}
        />

        <input
          name="asset_name"
          placeholder="Asset Name"
          value={form.asset_name}
          onChange={handleChange}
        />

        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={handleChange}
        />

        <input
          name="model"
          placeholder="Model"
          value={form.model}
          onChange={handleChange}
        />

        <select
          name="track_type"
          value={form.track_type}
          onChange={handleChange}
        >
          <option value="Bulk">Bulk</option>
          <option value="Unique">Unique</option>
        </select>

        <input
          name="total_quantity"
          placeholder="Quantity"
          disabled={form.track_type === "Unique"}
          value={form.track_type === "Unique" ? 1 : form.total_quantity}
          onChange={handleChange}
        />

        <button type="submit">
          {mode === "add" ? "Save" : "Update"}
        </button>

        <button type="button" onClick={() => setMode("list")}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default App;
