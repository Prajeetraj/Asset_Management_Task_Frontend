import { useEffect, useState } from "react";

function Asset() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [mode, setMode] = useState("list");
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

  // Load Assets
  const loadAssets = () => {
    fetch("http://localhost:3001/asset")
      .then(res => res.json())
      .then(data => setAssets(data));
  };

  // Load Categories
  const loadCategories = () => {
    fetch("http://localhost:3001/category_master")
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  // Load Allocations
  const loadAllocations = () => {
    fetch("http://localhost:3001/asset-allocation")
      .then(res => res.json())
      .then(data => setAllocations(data));
  };

  useEffect(() => {
    loadAssets();
    loadCategories();
    loadAllocations();
  }, []);

  // Calculate available quantity for each asset
  const getAvailableQuantity = (asset) => {
    const allocated = allocations
      .filter(a => a.asset_id === asset.asset_id)
      .reduce((sum, a) => sum + Number(a.allocated_quantity), 0);
    return asset.total_quantity - allocated;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "track_type" && value === "Unique") {
      setForm({ ...form, track_type: value, total_quantity: 1 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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
    resetForm();
    loadAssets();
  };

  const editAsset = (asset) => {
    setForm(asset);
    setEditId(asset.asset_id);
    setMode("edit");
  };

  const updateAsset = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/asset/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: Number(form.category_id),
        total_quantity: Number(form.total_quantity)
      })
    });
    const data = await res.json();
    if (!res.ok) return alert(data);
    alert("Asset Updated");
    setMode("list");
    resetForm();
    loadAssets();
  };

  const resetForm = () => {
    setForm({
      category_id: "",
      asset_name: "",
      brand: "",
      model: "",
      track_type: "Bulk",
      connection_type: "",
      total_quantity: "",
      status: true
    });
    setEditId(null);
  };

  // LIST VIEW
  if (mode === "list") {
    return (
      <div>
        <h2>Asset List</h2>
        <button onClick={() => setMode("add")}>Add Asset</button>

        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Total Qty</th>
              <th>Allocated Qty</th>
              <th>Available Qty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => {
              const allocated = allocations
                .filter(al => al.asset_id === a.asset_id)
                .reduce((sum, al) => sum + Number(al.allocated_quantity), 0);
              const available = a.total_quantity - allocated;

              return (
                <tr key={a.asset_id}>
                  <td>{a.asset_name}</td>
                  <td>{a.track_type}</td>
                  <td>{a.total_quantity}</td>
                  <td>{allocated}</td>
                  <td>{available}</td>
                  <td>
                    <button onClick={() => editAsset(a)}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      <h2>{mode === "add" ? "Add Asset" : "Edit Asset"}</h2>

      <form onSubmit={mode === "add" ? addAsset : updateAsset}>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <input
          name="asset_name"
          placeholder="Asset Name"
          value={form.asset_name}
          onChange={handleChange}
          required
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
          value={form.track_type === "Unique" ? 1 : form.total_quantity}
          disabled={form.track_type === "Unique"}
          onChange={handleChange}
          required
        />

        <br /><br />

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

export default Asset;

