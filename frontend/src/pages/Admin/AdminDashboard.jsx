import React, { useContext, useEffect, useState } from 'react'
import './AdminDashboard.css'
import { StoreContext } from '../../context/StoreContext'
import { adminApi, foodApi } from '../../services/api'

const emptyFood = { name: "", description: "", price: "", category: "", image: "" };
const ORDER_STATUSES = ["PLACED", "CONFIRMED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

// ---------------- Overview ----------------
const Overview = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.dashboard(token).then(setStats).catch((e) => setError(e.message));
  }, [token]);

  if (error) return <p className="admin-error">{error}</p>;
  if (!stats) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-stats-grid">
      <div className="admin-card"><p>Total Users</p><h3>{stats.totalUsers}</h3></div>
      <div className="admin-card"><p>Total Orders</p><h3>{stats.totalOrders}</h3></div>
      <div className="admin-card"><p>Total Revenue</p><h3>${stats.totalRevenue.toFixed(2)}</h3></div>
      <div className="admin-card"><p>Pending Orders</p><h3>{stats.pendingOrders}</h3></div>
    </div>
  );
};

// ---------------- Food Management ----------------
const FoodManagement = ({ token }) => {
  const [foods, setFoods] = useState([]);
  const [form, setForm] = useState(emptyFood);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    foodApi.list().then((data) => { setFoods(data); setLoading(false); }).catch((e) => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, price: parseFloat(form.price) };
      if (editingId) {
        await adminApi.updateFood(token, editingId, payload);
      } else {
        await adminApi.addFood(token, payload);
      }
      setForm(emptyFood);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.message || "Could not save food item");
    }
  };

  const startEdit = (food) => {
    setEditingId(food.id);
    setForm({ name: food.name, description: food.description || "", price: food.price, category: food.category, image: food.image || "" });
  };

  const remove = async (id) => {
    try {
      await adminApi.deleteFood(token, id);
      load();
    } catch (err) {
      setError(err.message || "Could not delete food item");
    }
  };

  return (
    <div>
      <p className="admin-note">Note: items added/edited here are stored in MySQL and manageable right here. The public menu keeps rendering the original 32 dishes with their bundled images.</p>
      {error && <p className="admin-error">{error}</p>}
      <form className="admin-food-form" onSubmit={submit}>
        <input name="name" value={form.name} onChange={onChange} placeholder="Name" required />
        <input name="category" value={form.category} onChange={onChange} placeholder="Category" required />
        <input name="price" value={form.price} onChange={onChange} placeholder="Price" type="number" step="0.01" required />
        <input name="image" value={form.image} onChange={onChange} placeholder="Image filename (e.g. food_1.png)" />
        <input name="description" value={form.description} onChange={onChange} placeholder="Description" className="admin-food-desc" />
        <button type="submit">{editingId ? "Update" : "Add"} Food</button>
        {editingId && <button type="button" className="admin-cancel" onClick={() => { setEditingId(null); setForm(emptyFood); }}>Cancel</button>}
      </form>

      {loading ? <p>Loading menu...</p> : (
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Category</th><th>Price</th><th></th></tr></thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.category}</td>
                <td>${f.price}</td>
                <td>
                  <button className="admin-link-btn" onClick={() => startEdit(f)}>Edit</button>
                  <button className="admin-link-btn admin-danger" onClick={() => remove(f.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// ---------------- Order Management ----------------
const OrderManagement = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.allOrders(token).then((data) => { setOrders(data); setLoading(false); }).catch((e) => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { load(); }, [token]);

  const updateStatus = async (orderId, status) => {
    try {
      await adminApi.updateOrderStatus(token, orderId, status);
      load();
    } catch (err) {
      setError(err.message || "Could not update order status");
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>#</th><th>User</th><th>Amount</th><th>Status</th></tr></thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{o.firstName} {o.lastName}</td>
            <td>${o.amount.toFixed(2)}</td>
            <td>
              <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ---------------- User Management ----------------
const UserManagement = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi.users(token).then((data) => { setUsers(data); setLoading(false); }).catch((e) => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { load(); }, [token]);

  const toggle = async (id) => {
    try { await adminApi.toggleUser(token, id); load(); }
    catch (err) { setError(err.message || "Could not update user"); }
  };

  const changeRole = async (id, role) => {
    try { await adminApi.updateUserRole(token, id, role); load(); }
    catch (err) { setError(err.message || "Could not update role"); }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <table className="admin-table">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>
              <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </td>
            <td>{u.enabled ? "Active" : "Disabled"}</td>
            <td><button className="admin-link-btn" onClick={() => toggle(u.id)}>{u.enabled ? "Disable" : "Enable"}</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ---------------- Shell ----------------
const AdminDashboard = () => {
  const { token, isAdmin } = useContext(StoreContext);
  const [tab, setTab] = useState("overview");

  if (!token || !isAdmin) {
    return <div className="admin-dashboard"><p>You need an admin account to view this page.</p></div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-tabs">
        {["overview", "food", "orders", "users"].map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t === "overview" ? "Overview" : t === "food" ? "Food Management" : t === "orders" ? "Order Management" : "User Management"}
          </button>
        ))}
      </div>
      <div className="admin-tab-content">
        {tab === "overview" && <Overview token={token} />}
        {tab === "food" && <FoodManagement token={token} />}
        {tab === "orders" && <OrderManagement token={token} />}
        {tab === "users" && <UserManagement token={token} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
