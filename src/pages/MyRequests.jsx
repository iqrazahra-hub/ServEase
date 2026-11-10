import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Status, ref, money, day, Empty } from '../components/Bits';

export default function MyRequests() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get('/requests/mine').then((r) => setItems(r.data)); }, []);

  return (
    <>
      <div className="between">
        <h1>My requests</h1>
        <Link className="btn" to="/requests/new">Post a job</Link>
      </div>
      {items === null ? <p className="muted">Loading...</p> : items.length === 0 ? (
        <Empty title="No jobs posted yet">Post your first job and verified workers will send you quotes.</Empty>
      ) : (
        <div className="stack">
          {items.map((r) => (
            <Link to={`/requests/${r._id}`} key={r._id} className={`slip-row st-${r.status}`}>
              <div>
                <span className="muted">{ref(r._id)} · {r.category}</span>
                <h3>{r.title}</h3>
                <p className="muted">{r.city} · Budget {money(r.budget)} · Needed {day(r.preferredDate)}</p>
              </div>
              <div className="right">
                <Status value={r.status} />
                <p>{r.status === 'open' ? `${r.quoteCount} quote${r.quoteCount === 1 ? '' : 's'}` : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
