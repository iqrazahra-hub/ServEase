// Small shared pieces

export const Stars = ({ value = 0, count }) => (
  <span className="stars" title={`${value} out of 5`}>
    {value ? `${Number(value).toFixed(1)} ★` : 'New'}
    {count ? <span className="muted"> ({count})</span> : null}
  </span>
);

const LABELS = {
  open: 'Open', booked: 'Booked', in_progress: 'In progress', completed: 'Completed', closed: 'Closed', cancelled: 'Cancelled',
  pending: 'Pending', accepted: 'Accepted', rejected: 'Rejected', verified: 'Verified',
  resolved: 'Resolved', dismissed: 'Dismissed', active: 'Active', blocked: 'Blocked',
};
export const Status = ({ value }) => <span className={`status s-${value}`}>{LABELS[value] || value}</span>;

// A short reference number taken from the record id, like a work-order number
export const ref = (id) => `#${String(id).slice(-5).toUpperCase()}`;

export const money = (n) => `Rs. ${Number(n || 0).toLocaleString()}`;
export const day = (d) => (d ? new Date(d).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible');

export const Empty = ({ title, children }) => (
  <div className="empty"><h3>{title}</h3><p className="muted">{children}</p></div>
);

export const ErrorNote = ({ text }) => (text ? <p className="note error">{text}</p> : null);
