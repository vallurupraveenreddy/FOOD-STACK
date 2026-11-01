import React, { useContext, useEffect, useState } from 'react'
import './Profile.css'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'

const emptyForm = { name: "", phone: "", address: "", city: "", state: "", zipCode: "" };

const Profile = () => {
  const { token, getProfile, updateProfile, darkMode, toggleDarkMode } = useContext(StoreContext);

  const [form, setForm] = useState(emptyForm);
  const [email, setEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        zipCode: data.zipCode || "",
      });
      setEmail(data.email || "");
      if (data.createdAt) {
        setMemberSince(new Date(data.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }));
      }
    } catch (err) {
      setError(err.message || "Could not load your profile. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      setError(err.message || "Could not save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setEditing(false);
    setError("");
    setSuccess("");
    loadProfile();
  };

  if (!token) {
    return <div className="profile-page"><p>Please login to view your profile.</p></div>;
  }

  return (
    <div className="profile-page">
      <h2>My Profile</h2>

      {loading && <p>Loading your profile...</p>}
      {error && <p className="profile-error">{error}</p>}
      {success && <p className="profile-success">{success}</p>}

      {!loading && (
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={assets.profile_icon} alt="" />
            <div>
              <p className="profile-name">{form.name}</p>
              <p className="profile-email">{email}</p>
              {memberSince && <p className="profile-since">Member since {memberSince}</p>}
            </div>
          </div>

          <form className="profile-form" onSubmit={onSave}>
            <div className="profile-field">
              <label>Name</label>
              <input name="name" value={form.name} onChange={onChange} disabled={!editing} required />
            </div>
            <div className="profile-field">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={onChange} disabled={!editing} placeholder="Not set" />
            </div>
            <div className="profile-field">
              <label>Address</label>
              <input name="address" value={form.address} onChange={onChange} disabled={!editing} placeholder="Not set" />
            </div>
            <div className="profile-multi">
              <div className="profile-field">
                <label>City</label>
                <input name="city" value={form.city} onChange={onChange} disabled={!editing} placeholder="Not set" />
              </div>
              <div className="profile-field">
                <label>State</label>
                <input name="state" value={form.state} onChange={onChange} disabled={!editing} placeholder="Not set" />
              </div>
              <div className="profile-field">
                <label>Pincode</label>
                <input name="zipCode" value={form.zipCode} onChange={onChange} disabled={!editing} placeholder="Not set" />
              </div>
            </div>

            <div className="profile-actions">
              {!editing
                ? <button type="button" onClick={() => { setEditing(true); setSuccess(""); }}>Edit Profile</button>
                : <>
                    <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                    <button type="button" className="profile-cancel" onClick={onCancel} disabled={saving}>Cancel</button>
                  </>
              }
            </div>
          </form>
        </div>
      )}

      {/* new: Dark Mode preference — lives here only, not in the navbar */}
      {!loading && (
        <div className="profile-card profile-preferences">
          <h3>Preferences</h3>
          <div className="profile-pref-row">
            <div>
              <p className="profile-pref-title">Dark Mode</p>
              <p className="profile-pref-desc">Switch the whole app between light and dark themes.</p>
            </div>
            <button
              type="button"
              className={`profile-toggle ${darkMode ? "on" : ""}`}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              <span className="profile-toggle-knob" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
