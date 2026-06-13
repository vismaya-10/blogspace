import { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeContext } from '../App';

const categories = ['Technology', 'Travel', 'Food', 'Lifestyle', 'Education'];

export default function CreateBlog() {
  const [form, setForm] = useState({ title: '', content: '', category: 'Technology' });
  const { token } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dark = darkMode;

  const handleSubmit = async () => {
    if (!form.title || !form.content) return alert('Please fill all fields!');
    try {
      await axios.post('https://blogspace-backend-nnz8.onrender.com', form, {
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
        <div style={s.iconBox}>🖊️</div>
        <h2 style={{ ...s.title, color: dark ? '#f1f5f9' : '#1e293b' }}>Write New Blog</h2>
        <p style={s.subtitle}>Share your story with the world</p>

        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Blog Title</label>
        <input
          placeholder="Enter an engaging title..."
          onChange={e => setForm({...form, title: e.target.value})}
          style={{ ...s.input, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />

        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Category</label>
        <select
          value={form.category}
          onChange={e => setForm({...form, category: e.target.value})}
          style={{ ...s.input, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label style={{ ...s.label, color: dark ? '#94a3b8' : '#64748b' }}>Content</label>
        <textarea
          placeholder="Write your blog content here..."
          rows={10}
          onChange={e => setForm({...form, content: e.target.value})}
          style={{ ...s.textarea, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}` }}
        />
        <div style={s.wordCount}>{form.content.length} characters</div>
        <button onClick={handleSubmit} style={s.btn}>🚀 Publish Blog</button>
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