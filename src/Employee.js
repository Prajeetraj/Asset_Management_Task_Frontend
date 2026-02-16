import { useEffect, useState } from "react";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [mode, setMode] = useState("list"); // list | add | edit
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    employee_name: "",
    mobile: "",
    email: "",
    department_id: "",
    location_id: "",
    sort_order: 0
  });

  //  REGEX VALIDATION
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9}$/;

  // LOAD EMPLOYEES
  const loadEmployees = () => {
    fetch("http://localhost:3001/employee")
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ADD EMPLOYEE
  const addEmployee = async (e) => {
    e.preventDefault();

    //  Email Validation
    if (!emailRegex.test(form.email)) {
      alert("Please enter valid email address");
      return;
    }

    // Mobile Validation
    if (!phoneRegex.test(form.mobile)) {
      alert("Please enter valid 10-digit mobile number");
      return;
    }

    const res = await fetch("http://localhost:3001/employee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        department_id: Number(form.department_id),
        location_id: Number(form.location_id),
        sort_order: Number(form.sort_order)
      })
    });

    if (!res.ok) {
      alert("Error adding employee");
      return;
    }

    alert("Employee Added");
    setMode("list");
    setForm({
      employee_name: "",
      mobile: "",
      email: "",
      department_id: "",
      location_id: "",
      sort_order: 0
    });
    loadEmployees();
  };

  // EDIT CLICK
  const editEmployee = (emp) => {
    setForm(emp);
    setEditId(emp.employee_id);
    setMode("edit");
  };

  // UPDATE EMPLOYEE
  const updateEmployee = async (e) => {
    e.preventDefault();

    //  Email Validation
    if (!emailRegex.test(form.email)) {
      alert("Please enter valid email address");
      return;
    }

    //  Mobile Validation
    if (!phoneRegex.test(form.mobile)) {
      alert("Please enter valid 10-digit mobile number");
      return;
    }

    const res = await fetch(
      `http://localhost:3001/employee/${editId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          department_id: Number(form.department_id),
          location_id: Number(form.location_id)
        })
      }
    );

    if (!res.ok) {
      alert("Error updating employee");
      return;
    }

    alert("Employee Updated");
    setMode("list");
    loadEmployees();
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    if (!window.confirm("Delete this employee?")) return;

    await fetch(`http://localhost:3001/employee/${id}`, {
      method: "DELETE"
    });

    alert("Employee Deleted");
    loadEmployees();
  };

  // LIST VIEW
  if (mode === "list") {
    return (
      <div>
        <h2>Employee List</h2>
        <button onClick={() => setMode("add")}>Add Employee</button>

        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.employee_id}>
                <td>{e.employee_name}</td>
                <td>{e.mobile}</td>
                <td>{e.email}</td>
                <td>
                  <button onClick={() => editEmployee(e)}>Edit</button>
                  <button onClick={() => deleteEmployee(e.employee_id)}>
                    Delete
                  </button>
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
      <h2>{mode === "add" ? "Add Employee" : "Edit Employee"}</h2>

      <form onSubmit={mode === "add" ? addEmployee : updateEmployee}>
        <input
          name="employee_name"
          placeholder="Employee Name"
          value={form.employee_name}
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department_id"
          placeholder="Department ID"
          value={form.department_id}
          onChange={handleChange}
          required
        />

        <input
          name="location_id"
          placeholder="Location ID"
          value={form.location_id}
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

export default Employee;


