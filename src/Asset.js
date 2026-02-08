import { useEffect, useState } from "react";

function Asset() {
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

  // LOAD ASSETS
  const loadAssets = () => {
    fetch("http://localhost:3001/asset")
      .then(res => res.json())
      .then(data => setAssets(data));
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // auto-set qty for Unique
    if (name === "track_type" && value === "Unique") {
      setForm({ ...form, track_type: value, total_quantity: 1 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ADD ASSET
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

  // EDIT CLICK
  const editAsset = (asset) => {
    setForm(asset);
    setEditId(asset.asset_id);
    setMode("edit");
  };

  // UPDATE ASSET
  const updateAsset = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:3001/asset/${editId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          category_id: Number(form.category_id),
          total_quantity: Number(form.total_quantity)
        })
      }
    );

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.asset_id}>
                <td>{a.asset_name}</td>
                <td>{a.track_type}</td>
                <td>{a.total_quantity}</td>
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
          required
        />

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
