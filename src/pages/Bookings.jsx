import { useEffect, useState } from 'react';
import api, { errMsg } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Chat from '../components/Chat';
import { Status, ref, money, day, ErrorNote, Empty } from '../components/Bits';

// Shared by customers and workers. The buttons shown depend on your role.
export default function Bookings() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [openChat, setOpenChat] = useState(null);
  const [panel, setPanel] = useState(null); // { id, type: 'review' | 'complaint' }
  const [form, setForm] = useState({ rating: 5, comment: '', reason: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const load = () => api.get('/bookings/mine').then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    setError('');
    try { await api.patch(`/bookings/${id}/status`, { status }); load(); } catch (e) { setError(errMsg(e)); }
  };

  const submitPanel = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (panel.type === 'review') await api.post(`/bookings/${panel.id}/review`, { rating: Number(form.rating), comment: form.comment });
      else await api.post(`/bookings/${panel.id}/complaint`, { reason: form.reason });
      setMsg(panel.type === 'review' ? 'Review saved. Thank you!' : 'Complaint sent. An admin will look into it.');
      setPanel(null); setForm({ rating: 5, comment: '', reason: '' }); load();
    } catch (e2) { setError(errMsg(e2)); }
  };

  const isCustomer = user.role === 'customer';

  return (
    <>
      <h1>{isCustomer ? 'My bookings' : 'Jobs I have booked'}</h1>
      {msg && <p className="note ok">{msg}</p>}
      <ErrorNote text={error} />
      {items === null ? <p className="muted">Loading...</p> : items.length === 0 ? (
        <Empty title="No bookings yet">{isCustomer ? 'Accept a quotation on one of your requests to create a booking.' : 'When a customer accepts your quotation, the booking appears here.'}</Empty>
      ) : (
        <div className="stack">
          {items.map((b) => {
            const other = isCustomer ? b.worker : b.customer;
            return (
              <div key={b._id} className={`slip-row block st-${b.status}`}>
                <div className="between">
                  <div>
                    <span className="muted">{ref(b._id)} · {b.request?.category}</span>
                    <h3>{b.request?.title}</h3>
                    <p className="muted">{isCustomer ? 'Worker' : 'Customer'}: {other?.name} · {other?.phone} · {b.request?.address || other?.city}</p>
                    <p className="muted">{money(b.price)} · Scheduled {day(b.scheduledFor)}</p>
                  </div>
                  <Status value={b.status} />
                </div>

                <div className="row">
                  {!isCustomer && b.status === 'booked' && <button className="btn sm" onClick={() => changeStatus(b._id, 'in_progress')}>Start job</button>}
                  {!isCustomer && b.status === 'in_progress' && <button className="btn sm" onClick={() => changeStatus(b._id, 'completed')}>Mark completed</button>}
                  {b.status === 'booked' && <button className="btn ghost sm" onClick={() => window.confirm('Cancel this booking?') && changeStatus(b._id, 'cancelled')}>Cancel</button>}
                  {isCustomer && b.status === 'completed' && !b.reviewed && <button className="btn sm" onClick={() => setPanel({ id: b._id, type: 'review' })}>Leave a review</button>}
                  {b.status !== 'cancelled' && <button className="btn ghost sm" onClick={() => setOpenChat(openChat === b._id ? null : b._id)}>{openChat === b._id ? 'Hide chat' : 'Chat'}</button>}
                  <button className="btn ghost sm" onClick={() => setPanel({ id: b._id, type: 'complaint' })}>Report a problem</button>
                </div>

                {panel?.id === b._id && (
                  <form className="stack inline-form" onSubmit={submitPanel}>
                    {panel.type === 'review' ? (
                      <>
                        <label>Rating
                          <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })}>
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 && 's'}</option>)}
                          </select>
                        </label>
                        <label>Comment<textarea rows={2} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} /></label>
                      </>
                    ) : (
                      <label>What went wrong?<textarea rows={3} required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></label>
                    )}
                    <div className="row"><button className="btn sm">{panel.type === 'review' ? 'Save review' : 'Send complaint'}</button><button type="button" className="btn ghost sm" onClick={() => setPanel(null)}>Close</button></div>
                  </form>
                )}
                {openChat === b._id && <Chat bookingId={b._id} />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
