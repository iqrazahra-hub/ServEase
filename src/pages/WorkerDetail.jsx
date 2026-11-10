import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../services/api';
import { Stars, money, day } from '../components/Bits';
import { useAuth } from '../context/AuthContext';

export default function WorkerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => { api.get(`/workers/${id}`).then((r) => setData(r.data)).catch((e) => setError(errMsg(e))); }, [id]);

  if (error) return <p className="note error">{error}</p>;
  if (!data) return <p className="muted">Loading...</p>;
  const { profile: p, reviews } = data;

  return (
    <div className="detail">
      <section className="card stack">
        <div className="row">
          <div className="avatar lg">{p.user.name[0]}</div>
          <div>
            <h1>{p.user.name}</h1>
            <p className="muted">{p.category} · {p.user.city}</p>
            <p><Stars value={p.ratingAverage} count={p.ratingCount} /> <span className="tick">Verified</span></p>
          </div>
        </div>
        <p>{p.bio}</p>
        <dl className="facts">
          <dt>Experience</dt><dd>{p.experienceYears} years</dd>
          <dt>Rate</dt><dd>{money(p.hourlyRate)} per hour</dd>
          <dt>Availability</dt><dd>{p.availability}</dd>
        </dl>
        <p className="chips">{p.skills.map((s) => <span key={s}>{s}</span>)}</p>
        {user?.role === 'customer'
          ? <Link className="btn" to={`/requests/new?category=${encodeURIComponent(p.category)}`}>Post a {p.category.toLowerCase()} job</Link>
          : !user && <Link className="btn" to="/register">Sign up to request quotes</Link>}
      </section>

      <section>
        <h2>Reviews</h2>
        {reviews.length === 0 ? <p className="muted">No reviews yet.</p> : reviews.map((r) => (
          <div key={r._id} className="card review">
            <b>{r.rating} ★</b> <span className="muted">{r.customer?.name} · {day(r.createdAt)}</span>
            <p>{r.comment || 'No comment left.'}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
