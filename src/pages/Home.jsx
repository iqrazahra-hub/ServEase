import { Link } from 'react-router-dom';
import { useAuth, homeFor } from '../context/AuthContext';

const TRADES = [
  ['Electrician', 'Wiring, fans, breakers'],
  ['Plumber', 'Leaks, geysers, fittings'],
  ['AC Technician', 'Gas, servicing, installs'],
  ['Carpenter', 'Doors, wardrobes, repairs'],
  ['Painter', 'Rooms, exteriors, polish'],
  ['Tutor', 'School and O/A-Level'],
];

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      <section className="hero">
        <div>
          <h1>Describe the job.<br />Compare the quotes.<br />Book the right person.</h1>
          <p className="lead">ServEase connects you with verified electricians, plumbers, AC technicians, carpenters and tutors. Workers send you their price, you choose, and you chat before anyone shows up.</p>
          <div className="row">
            {user ? <Link className="btn" to={homeFor(user.role)}>Go to my dashboard</Link> : <Link className="btn" to="/register">Post a job for free</Link>}
            <Link className="btn ghost" to="/workers">Browse workers</Link>
          </div>
        </div>

        {/* The work order slip: the one memorable element */}
        <aside className="slip" aria-label="Example job request">
          <div className="slip-head"><b>Job request</b><span>#A4F21</span></div>
          <h3>Ceiling fan hums but will not spin</h3>
          <dl>
            <dt>Where</dt><dd>Satellite Town, Rawalpindi</dd>
            <dt>Budget</dt><dd>Rs. 2,500</dd>
            <dt>Needed</dt><dd>Within 2 days</dd>
          </dl>
          <div className="slip-tear" />
          <div className="quote"><span>Usman T. <em>4.6 ★</em></span><b>Rs. 1,800</b></div>
          <div className="quote"><span>Bilal A. <em>4.2 ★</em></span><b>Rs. 2,200</b></div>
        </aside>
      </section>

      <section>
        <h2>What do you need done?</h2>
        <div className="trade-grid">
          {TRADES.map(([name, hint]) => (
            <Link key={name} to={`/workers?category=${encodeURIComponent(name)}`} className="trade">
              <b>{name}</b><span>{hint}</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>How it works</h2>
        <ol className="steps">
          <li><b>Post your job.</b> Say what is wrong, where you are, and your budget.</li>
          <li><b>Receive quotes.</b> Verified workers in that trade send a price and time.</li>
          <li><b>Pick and book.</b> Compare, accept one, then chat to confirm the details.</li>
          <li><b>Rate the work.</b> Your review helps the next customer choose well.</li>
        </ol>
      </section>
    </>
  );
}
