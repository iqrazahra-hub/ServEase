import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { Status, Stars, ref, money, day, ErrorNote, Empty } from '../components/Bits';

export default function RequestQuotes() {
  const { id } = useParams();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.get(`/requests/${id}/quotations`).then((r) => setData(r.data)).catch((e) => setError(errMsg(e))); }, [id]);

  const accept = async (q) => {
    if (!window.confirm(`Book ${q.worker.name} for ${money(q.price)}?`)) return;
    try {
      await api.patch(`/requests/quotations/${q._id}/accept`, {});
      nav('/bookings');
    } catch (e) { setError(errMsg(e)); }
  };

  if (!data) return error ? <ErrorNote text={error} /> : <p className="muted">Loading...</p>;
  const { request: r, quotations } = data;
  const cheapest = quotations.length ? Math.min(...quotations.map((q) => q.price)) : null;

  return (
    <>
      <Link to="/requests" className="muted">Back to my requests</Link>
      <div className="card stack">
        <span className="muted">{ref(r._id)} · {r.category}</span>
        <div className="between"><h1>{r.title}</h1><Status value={r.status} /></div>
        <p>{r.description}</p>
        <p className="muted">{r.city} {r.address && `· ${r.address}`} · Budget {money(r.budget)} · Needed {day(r.preferredDate)}</p>
      </div>

      <h2>Quotations ({quotations.length})</h2>
      <ErrorNote text={error} />
      {quotations.length === 0 ? <Empty title="No quotes yet">Workers in your trade will see your job. Check back soon.</Empty> : (
        <div className="grid">
          {quotations.map((q) => (
            <div key={q._id} className={`card quote-card ${q.status}`}>
              <div className="between">
                <Link to={`/workers/${q.worker._id}`}><h3>{q.worker.name}</h3></Link>
                <b className="price">{money(q.price)}</b>
              </div>
              <p>{q.workerProfile && <Stars value={q.workerProfile.ratingAverage} count={q.workerProfile.ratingCount} />} {q.workerProfile && `· ${q.workerProfile.experienceYears} yrs`}</p>
              <p className="muted">Time needed: {q.estimatedTime || 'Not stated'} · Available {day(q.availableDate)}</p>
              {q.message && <p>"{q.message}"</p>}
              {q.price === cheapest && quotations.length > 1 && <span className="tick">Lowest price</span>}
              {r.status === 'open' ? <button className="btn" onClick={() => accept(q)}>Accept and book</button> : <Status value={q.status} />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
