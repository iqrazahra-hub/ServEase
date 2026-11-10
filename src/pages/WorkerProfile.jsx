import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api';
import { Status, ErrorNote } from '../components/Bits';

export default function WorkerProfile() {
  const [cats, setCats] = useState([]);
  const [p, setP] = useState(null);
  const [skills, setSkills] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/workers/categories').then((r) => setCats(r.data));
    api.get('/workers/me/profile').then((r) => { setP(r.data); setSkills(r.data.skills.join(', ')); });
  }, []);

  const set = (k) => (e) => setP({ ...p, [k]: e.target.value });
  const save = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      const body = { ...p, skills: skills.split(',').map((s) => s.trim()).filter(Boolean), experienceYears: Number(p.experienceYears), hourlyRate: Number(p.hourlyRate) };
      await api.put('/workers/me/profile', body);
      setMsg('Profile saved.');
    } catch (err) { setError(errMsg(err)); }
  };

  if (!p) return <p className="muted">Loading...</p>;
  return (
    <form className="card narrow stack" onSubmit={save}>
      <div className="between"><h1>My profile</h1><Status value={p.verificationStatus} /></div>
      {p.verificationStatus !== 'verified' && <p className="note">Customers can only find you, and you can only quote on jobs, after an admin verifies your profile. Add your CNIC number and a clear bio to speed this up.</p>}
      {msg && <p className="note ok">{msg}</p>}
      <ErrorNote text={error} />
      <label>Trade<select value={p.category} onChange={set('category')}>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
      <label>Skills (separate with commas)<input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Wiring, fan repair, breaker panels" /></label>
      <label>About you<textarea rows={4} value={p.bio} onChange={set('bio')} /></label>
      <div className="two">
        <label>Years of experience<input type="number" min="0" value={p.experienceYears} onChange={set('experienceYears')} /></label>
        <label>Hourly rate (Rs.)<input type="number" min="0" value={p.hourlyRate} onChange={set('hourlyRate')} /></label>
      </div>
      <label>Availability<input value={p.availability} onChange={set('availability')} /></label>
      <label>CNIC number (only admins see this)<input value={p.cnic} onChange={set('cnic')} /></label>
      <button className="btn">Save profile</button>
    </form>
  );
}
