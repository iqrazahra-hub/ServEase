import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';
import api, { errMsg } from '../services/api';
import { ErrorNote } from '../components/Bits';

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState({ role: 'customer', name: '', email: '', password: '', phone: '', city: '', category: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { api.get('/workers/categories').then((r) => setCats(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(form);
      nav(homeFor(user.role));
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card narrow stack" onSubmit={submit}>
      <h1>Create your account</h1>
      <div className="seg">
        {['customer', 'worker'].map((r) => (
          <button type="button" key={r} className={form.role === r ? 'on' : ''} onClick={() => setForm({ ...form, role: r })}>
            {r === 'customer' ? 'I need a service' : 'I offer a service'}
          </button>
        ))}
      </div>
      <ErrorNote text={error} />
      <label>Full name<input value={form.name} onChange={set('name')} required /></label>
      <label>Email<input type="email" value={form.email} onChange={set('email')} required /></label>
      <label>Password (6+ characters)<input type="password" minLength={6} value={form.password} onChange={set('password')} required /></label>
      <div className="two">
        <label>Phone<input value={form.phone} onChange={set('phone')} /></label>
        <label>City<input value={form.city} onChange={set('city')} required /></label>
      </div>
      {form.role === 'worker' && (
        <label>Your trade
          <select value={form.category} onChange={set('category')} required>
            <option value="">Choose one</option>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
      )}
      {form.role === 'worker' && <p className="hint">After you sign up, an admin checks your profile. You can receive jobs once you are verified.</p>}
      <button className="btn">Create account</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
