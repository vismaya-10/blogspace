import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeContext } from '../App';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dark = darkMode;

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={s.wrapper}>  {/* ← background removed */}
      <div style={{ ...s.card, background: dark ? '#1e293b' : '#fff' }}>
        <div style={s.iconBox}>👋</div>
        <h2 style={{ ...s.title, color: dark ? '#f1f5f9' : '#1e293b' }}>Welcome Back</h2>
        <p style={s.subtitle}>Sign in to your account</p>
        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Email</label>
        <input
          placeholder="you@example.com"
          onChange={e => setForm({...form, email: e.target.value})}
          style={{ ...s.input, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />
        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          onChange={e => setForm({...form, password: e.target.value})}
          style={{ ...s.input, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />
        <button onClick={handleSubmit} style={s.btn}>Sign In →</button>
        <p style={s.link}>Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={s.linkText}>Create one</span>
        </p>
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif" },
  card: { padding: '48px 40px', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' },
  iconBox: { fontSize: '40px', textAlign: 'center' },
  title: { textAlign: 'center', margin: 0, fontSize: '26px', fontWeight: '800' },
  subtitle: { textAlign: 'center', color: '#94a3b8', margin: 0, fontSize: '15px' },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '-4px' },
  input: { padding: '12px 16px', fontSize: '15px', borderRadius: '10px', outline: 'none' },
  btn: { padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '700', marginTop: '8px' },
  link: { textAlign: 'center', color: '#94a3b8', fontSize: '14px', margin: 0 },
  linkText: { color: '#6366f1', cursor: 'pointer', fontWeight: '700' }
};