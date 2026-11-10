import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api';
import { ref, money, day, ErrorNote, Empty } from '../components/Bits';

export default function WorkerJobs() {
  const [jobs, setJobs] = useState(null);
  const [error, setError] = useState('');
  const [quoting, setQuoting] = useState(null);
  const [form, setForm] = useState({ price: '', estimatedTime: '', availableDate: '', message: '' });

  const load = () => api.get('/requests/available').then((r) => setJobs(r.data)).catch((e) => { setError(errMsg(e)); setJobs([]); });
  useEffect(() => { load(); }, []);

  const send = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/requests/${quoting}/quotations`, { ...form, price: Number(form.price), availableDate: form.availableDate || undefined });
      setQuoting(null); setForm({ price: '', estimatedTime: '', availableDate: '', message: '' }); load();
    } catch (err) { setError(errMsg(err)); }
  };

  return (
    <>
      <h1>Open jobs in your trade</h1>
      <ErrorNote text={error} />
      {jobs === null ? <p className="muted">Loading...</p> : jobs.length === 0 ? (
        <Empty title="No open jobs right now">New requests in your trade will appear here. Keep your profile complete so customers trust your quotes.</Empty>
      ) : (
        <div className="stack">
          {jobs.map((j) => (
            <div key={j._id} className="slip-row block st-open">
              <span className="muted">{ref(j._id)} · {j.customer?.name} · {j.city}</span>
              <h3>{j.title}</h3>
              <p>{j.description}</p>
              <p className="muted">Budget {money(j.budget)} · Needed {day(j.preferredDate)}</p>
              {j.alreadyQuoted ? <span className="tick">Quote sent</span> : quoting === j._id ? (
                <form className="stack inline-form" onSubmit={send}>
                  <div className="two">
                    <label>Your price (Rs.)<input type="number" min="0" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
                    <label>Time needed<input placeholder="e.g. 2 hours" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} /></label>
                  </div>
                  <label>Earliest date you can come<input type="date" value={form.availableDate} onChange={(e) => setForm({ ...form, availableDate: e.target.value })} /></label>
                  <label>Message to the customer<textarea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
                  <div className="row"><button className="btn sm">Send quote</button><button type="button" className="btn ghost sm" onClick={() => setQuoting(null)}>Cancel</button></div>
                </form>
              ) : <button className="btn sm" onClick={() => setQuoting(j._id)}>Send a quote</button>}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
