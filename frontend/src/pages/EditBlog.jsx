import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeContext } from '../App';

export default function EditBlog() {
  const [form, setForm] = useState({ title: '', content: '' });
  const { token } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const dark = darkMode;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blogs/${id}`).then(res => {
      setForm({ title: res.data.title, content: res.data.content });
    });
  }, [id]);

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div style={s.wrapper}>  {/* ← background removed */}
      <div style={{ ...s.card, background: dark ? '#1e293b' : '#fff' }}>
        <button onClick={() => navigate('/')} style={s.backBtn}>← Back</button>
        <div style={s.iconBox}>✏️</div>
        <h2 style={{ ...s.title, color: dark ? '#f1f5f9' : '#1e293b' }}>Edit Blog</h2>
        <p style={s.subtitle}>Update your story</p>
        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Blog Title</label>
        <input
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
          style={{ ...s.input, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />
        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Content</label>
        <textarea
          value={form.content}
          rows={10}
          onChange={e => setForm({...form, content: e.target.value})}
          style={{ ...s.textarea, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />
        <div style={s.wordCount}>{form.content.length} characters</div>
        <button onClick={handleSubmit} style={s.btn}>✅ Update Blog</button>
      </div>
    </div>
  );
}

const s = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" },
  card: { padding: '48px 40px', borderRadius: '20px', width: '100%', maxWidth: '640px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' },
  backBtn: { position: 'absolute', top: '20px', left: '20px', background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
  iconBox: { fontSize: '40px', textAlign: 'center', marginTop: '16px' },
  title: { textAlign: 'center', margin: 0, fontSize: '26px', fontWeight: '800' },
  subtitle: { textAlign: 'center', color: '#94a3b8', margin: 0 },
  label: { fontSize: '13px', fontWeight: '600', marginBottom: '-4px' },
  input: { padding: '12px 16px', fontSize: '15px', borderRadius: '10px', outline: 'none' },
  textarea: { padding: '12px 16px', fontSize: '15px', borderRadius: '10px', outline: 'none', resize: 'vertical', lineHeight: '1.6' },
  wordCount: { textAlign: 'right', fontSize: '12px', color: '#94a3b8' },
  btn: { padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', fontWeight: '700' }
};