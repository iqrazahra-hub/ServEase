import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { connectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

// Real-time chat for ONE booking
export default function Chat({ bookingId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    api.get(`/chat/${bookingId}`).then((r) => setMessages(r.data));

    const socket = connectSocket();
    socketRef.current = socket;
    socket.emit('join', bookingId);
    socket.on('connect', () => socket.emit('join', bookingId)); // re-join after a reconnect
    socket.on('message', (m) => setMessages((prev) => (prev.some((x) => x._id === m._id) ? prev : [...prev, m])));
    return () => socket.disconnect();
  }, [bookingId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    socketRef.current.emit('message', { bookingId, text });
    setText('');
  };

  return (
    <div className="chat">
      <div className="chat-log">
        {messages.length === 0 && <p className="muted">No messages yet. Say hello and agree on the details.</p>}
        {messages.map((m) => (
          <div key={m._id} className={`bubble ${m.sender === user.id ? 'mine' : 'theirs'}`}>
            {m.text}
            <time>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <form className="chat-form" onSubmit={send}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" maxLength={1000} />
        <button className="btn sm">Send</button>
      </form>
    </div>
  );
}
