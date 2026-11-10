import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api';
import { Status, ref, day, ErrorNote, Empty } from '../components/Bits';

const TABS = ['Overview', 'Workers', 'Users', 'Complaints'];

export default function Admin() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');

  const load = () => {
    api.get('/admin/stats').then((r) => setStats(r.data));
    api.get('/admin/workers').then((r) => setWorkers(r.data));
    api.get('/admin/users').then((r) => setUsers(r.data));
    api.get('/admin/complaints').then((r) => setComplaints(r.data));
  };
  useEffect(() => { load(); }, []);

  const act = async (fn) => { setError(''); try { await fn(); load(); } catch (e) { setError(errMsg(e)); } };
  const verify = (id, status) => act(() => api.patch(`/admin/workers/${id}/verify`, { status }));
  const setUserStatus = (id, status) => act(() => api.patch(`/admin/users/${id}/status`, { status }));
  const resolve = (id, status) => act(() => api.patch(`/admin/complaints/${id}`, { status, adminNote: notes[id] || '' }));

  const pending = workers.filter((w) => w.verificationStatus === 'pending');

  return (
    <>
      <h1>Admin dashboard</h1>
      <div className="tabs">{TABS.map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}{t === 'Workers' && pending.length ? ` (${pending.length})` : ''}</button>)}</div>
      <ErrorNote text={error} />

      {tab === 'Overview' && stats && (
        <div className="stats">
          {[['Customers', stats.customers], ['Workers', stats.workers], ['Awaiting verification', stats.pendingWorkers], ['Requests posted', stats.requests],
            ['Bookings', stats.bookings], ['Jobs completed', stats.completed], ['Open complaints', stats.openComplaints]].map(([label, n]) => (
            <div key={label} className="stat"><b>{n}</b><span>{label}</span></div>
          ))}
        </div>
      )}

      {tab === 'Workers' && (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Trade</th><th>City</th><th>CNIC</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {workers.map((w) => (
              <tr key={w._id}>
                <td>{w.user?.name}<br /><span className="muted">{w.user?.email}</span></td>
                <td>{w.category}</td><td>{w.user?.city}</td><td>{w.cnic || 'Not given'}</td>
                <td><Status value={w.verificationStatus} /></td>
                <td className="actions">
                  {w.verificationStatus !== 'verified' && <button className="btn sm" onClick={() => verify(w._id, 'verified')}>Approve</button>}
                  {w.verificationStatus !== 'rejected' && <button className="btn ghost sm" onClick={() => verify(w._id, 'rejected')}>Reject</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}

      {tab === 'Users' && (
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>City</th><th>Joined</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}<br /><span className="muted">{u.email}</span></td>
                <td>{u.role}</td><td>{u.city}</td><td>{day(u.createdAt)}</td><td><Status value={u.status} /></td>
                <td className="actions">
                  {u.role !== 'admin' && (u.status === 'active'
                    ? <button className="btn ghost sm" onClick={() => setUserStatus(u._id, 'blocked')}>Block</button>
                    : <button className="btn sm" onClick={() => setUserStatus(u._id, 'active')}>Unblock</button>)}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}

      {tab === 'Complaints' && (complaints.length === 0 ? <Empty title="No complaints">Nothing to review right now.</Empty> : (
        <div className="stack">
          {complaints.map((c) => (
            <div key={c._id} className="card stack">
              <div className="between"><b>{ref(c._id)} · {c.booking?.request?.title || 'Booking'}</b><Status value={c.status} /></div>
              <p className="muted">{c.filedBy?.name} ({c.filedBy?.role}) reported {c.against?.name} ({c.against?.role}) on {day(c.createdAt)}</p>
              <p>{c.reason}</p>
              {c.status === 'open' ? (
                <>
                  <input placeholder="Admin note (what you decided)" value={notes[c._id] || ''} onChange={(e) => setNotes({ ...notes, [c._id]: e.target.value })} />
                  <div className="row"><button className="btn sm" onClick={() => resolve(c._id, 'resolved')}>Mark resolved</button><button className="btn ghost sm" onClick={() => resolve(c._id, 'dismissed')}>Dismiss</button></div>
                </>
              ) : c.adminNote && <p className="muted">Admin note: {c.adminNote}</p>}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
