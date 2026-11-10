import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Stars, money, Empty } from '../components/Bits';

export default function Workers() {
  const [params, setParams] = useSearchParams();
  const [cats, setCats] = useState([]);
  const [workers, setWorkers] = useState(null);
  const category = params.get('category') || '';
  const [city, setCity] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => { api.get('/workers/categories').then((r) => setCats(r.data)); }, []);
  useEffect(() => {
    setWorkers(null);
    api.get('/workers', { params: { category, city, q } }).then((r) => setWorkers(r.data));
  }, [category, city, q]);

  return (
    <>
      <h1>Verified workers</h1>
      <div className="filters">
        <select value={category} onChange={(e) => setParams(e.target.value ? { category: e.target.value } : {})}>
          <option value="">All trades</option>
          {cats.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="Search name or skill" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {workers === null ? <p className="muted">Loading workers...</p> : workers.length === 0 ? (
        <Empty title="No workers match yet">Try a different city or trade, or post a job and let workers come to you.</Empty>
      ) : (
        <div className="grid">
          {workers.map((w) => (
            <Link to={`/workers/${w.user._id}`} key={w._id} className="card worker">
              <div className="avatar">{w.user.name[0]}</div>
              <div>
                <h3>{w.user.name} <span className="tick" title="Verified by ServEase">Verified</span></h3>
                <p className="muted">{w.category} · {w.user.city}</p>
                <p><Stars value={w.ratingAverage} count={w.ratingCount} /> · {w.experienceYears} yrs · {money(w.hourlyRate)}/hr</p>
                <p className="chips">{w.skills.slice(0, 3).map((s) => <span key={s}>{s}</span>)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
