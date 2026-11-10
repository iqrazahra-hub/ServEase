import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';
import { errMsg } from '../services/api';
import { ErrorNote } from '../components/Bits';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      nav(homeFor(user.role));
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card narrow stack" onSubmit={submit}>
      <h1>Log in</h1>
      <ErrorNote text={error} />
      <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
      <label>Password<input type="password" value={form.password} onChange={set('password')} required /></label>
      <button className="btn">Log in</button>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
      <p className="hint">Demo logins (password 123456): customer@servease.pk, usman@servease.pk, admin@servease.pk</p>
    </form>
  );
}
