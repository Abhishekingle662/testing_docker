import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5001/users'; // use the Docker service name

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: '', email: '' });
    loadUsers();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    loadUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user._id);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          placeholder="Name" required
        />
        <input
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email" required
        />
        <button type="submit">{editId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u._id}>
            {u.name} ({u.email})
            <button onClick={() => handleEdit(u)}>Edit</button>
            <button onClick={() => handleDelete(u._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
