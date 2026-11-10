import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { ErrorNote } from '../components/Bits';

export default function NewRequest() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [cats, setCats] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    category: params.get('category') || '', title: '', description: '', city: '', address: '', budget: '', preferredDate: '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => { api.get('/workers/categories').then((r) => setCats(r.data)); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/requests', { ...form, budget: Number(form.budget) || 0, preferredDate: form.preferredDate || undefined });
      nav('/requests');
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <form className="card narrow stack" onSubmit={submit}>
      <h1>Post a job</h1>
      <p className="muted">Workers in this trade will see it and send you quotes.</p>
      <ErrorNote text={error} />
      <label>Type of work
        <select value={form.category} onChange={set('category')} required>
          <option value="">Choose a trade</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>
      <label>Short title<input value={form.title} onChange={set('title')} placeholder="e.g. Kitchen tap is leaking" required /></label>
      <label>What needs doing?<textarea rows={4} value={form.description} onChange={set('description')} placeholder="Describe the problem, what you have already tried, and anything the worker should bring." required /></label>
      <div className="two">
        <label>City<input value={form.city} onChange={set('city')} required /></label>
        <label>Area or address<input value={form.address} onChange={set('address')} /></label>
      </div>
      <div className="two">
        <label>Your budget (Rs.)<input type="number" min="0" value={form.budget} onChange={set('budget')} /></label>
        <label>Preferred date<input type="date" value={form.preferredDate} onChange={set('preferredDate')} /></label>
      </div>
      <button className="btn">Post job</button>
    </form>
  );
}
