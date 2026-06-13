import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeContext } from '../App';

export default function Home() {
  const [userCount, setUserCount] = useState(0);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { user, token, logout } = useAuth();
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/blogs').then(res => setBlogs(res.data));
    axios.get('http://localhost:5000/api/auth/count').then(res => setUserCount(res.data.count));
  }, []);

  const categories = ['All', 'Technology', 'Travel', 'Food', 'Lifestyle', 'Education'];

  const filtered = blogs.filter((b) => {
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                        b.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || b.category === category;
    return matchSearch && matchCategory;
  });

  const dark = darkMode;

  return (
    <div style={{ ...s.wrapper, color: dark ? '#f1f5f9' : '#1e293b' }}>  {/* ← background removed */}

      {/* Navbar */}
      <nav style={{ ...s.navbar, background: dark ? '#1e293b' : '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <h1 style={{ ...s.logo, color: dark ? '#fff' : '#1e293b' }}>✍️ BlogSpace</h1>
        <div style={s.navRight}>
          <button onClick={() => setDarkMode(!dark)} style={{ ...s.iconBtn, background: dark ? '#334155' : '#f1f5f9', color: dark ? '#fbbf24' : '#64748b' }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          {user ? (
            <>
              <span style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>👤 {user.username}</span>
              <button onClick={() => navigate('/create')} style={s.primaryBtn}>+ New Blog</button>
              <button onClick={logout} style={s.outlineBtn}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={s.outlineBtn}>Login</button>
              <button onClick={() => navigate('/register')} style={s.primaryBtn}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ ...s.hero, background: dark ? '#1e293b' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
        <h2 style={s.heroTitle}>Discover & Share Amazing Stories</h2>
        <p style={s.heroSub}>A space for writers, thinkers and creators</p>
        <div style={s.searchBox}>
          <span style={s.searchIcon}>🔍</span>
          <input
            placeholder="Search blogs by title or content..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...s.searchInput, background: dark ? '#334155' : '#fff', color: dark ? '#f1f5f9' : '#1e293b' }}
          />
          {search && <span onClick={() => setSearch('')} style={s.clearBtn}>✕</span>}
        </div>
      </div>

      {/* Category Filter */}
      <div style={s.categoryRow}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              ...s.catBtn,
              background: category === cat ? '#6366f1' : dark ? '#1e293b' : '#fff',
              color: category === cat ? '#fff' : dark ? '#94a3b8' : '#64748b',
              border: category === cat ? '2px solid #6366f1' : `2px solid ${dark ? '#334155' : '#e2e8f0'}`
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Stats Bar */}
      <div style={{ ...s.statsBar, background: dark ? '#1e293b' : '#fff' }}>
        <span>📚 {blogs.length} Total Blogs</span>
        <span>🔍 {filtered.length} Results</span>
        <span>👥 {userCount} Registered Users</span>
        <span>📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Blog Grid */}
      <div style={s.grid}>
        {filtered.length === 0 && (
          <div style={{ ...s.emptyState, color: dark ? '#94a3b8' : '#94a3b8' }}>
            <p style={{ fontSize: '48px' }}>📭</p>
            <p>No blogs found. Try a different search!</p>
          </div>
        )}
        {filtered.map((blog, i) => (
          <div key={blog._id} onClick={() => navigate(`/blog/${blog._id}`)} style={{ ...s.card, background: dark ? '#1e293b' : '#fff', borderTop: `4px solid ${cardColors[i % cardColors.length]}`, cursor: 'pointer' }}>
            <div style={{ ...s.cardTag, background: cardColors[i % cardColors.length] + '20', color: cardColors[i % cardColors.length] }}>
              {blog.category || 'General'}
            </div>
            <h3 style={{ ...s.cardTitle, color: dark ? '#f1f5f9' : '#1e293b' }}>{blog.title}</h3>
            <p style={{ ...s.cardContent, color: dark ? '#94a3b8' : '#64748b' }}>{blog.content.substring(0, 130)}...</p>
            <div style={s.cardFooter}>
              <div style={s.authorBox}>
                <div style={{ ...s.avatar, background: cardColors[i % cardColors.length] }}>
                  {blog.author?.username?.[0]?.toUpperCase()}
                </div>
                <span style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '13px' }}>{blog.author?.username}</span>
              </div>
              {user && blog.author?._id === user.id && (
                <div style={s.actionBtns}>
                  <button onClick={() => navigate(`/edit/${blog._id}`)} style={s.editBtn}>✏️ Edit</button>
                  <button onClick={() => {
                    if (window.confirm('Delete this blog?'))
                      axios.delete(`http://localhost:5000/api/blogs/${blog._id}`, { headers: { Authorization: `Bearer ${token}` } })
                        .then(() => setBlogs(blogs.filter(b => b._id !== blog._id)));
                  }} style={s.deleteBtn}>🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ ...s.footer, background: dark ? '#1e293b' : '#1e293b' }}>
        <p>✍️ BlogSpace — Built with MERN Stack 💙</p>
      </footer>
    </div>
  );
}

const cardColors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4'];

const s = {
  wrapper: { minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", transition: 'all 0.3s' },
  navbar: { padding: '0 32px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 },
  logo: { margin: 0, fontSize: '22px', fontWeight: '800' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  iconBtn: { padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  primaryBtn: { padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  outlineBtn: { padding: '8px 18px', background: 'transparent', color: '#6366f1', border: '2px solid #6366f1', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' },
  hero: { padding: '60px 32px 80px', textAlign: 'center' },
  heroTitle: { color: '#fff', fontSize: '38px', fontWeight: '800', margin: '0 0 10px' },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: '18px', margin: '0 0 32px' },
  searchBox: { maxWidth: '560px', margin: '0 auto', background: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '4px 16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' },
  searchIcon: { fontSize: '18px', marginRight: '10px' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: '16px', padding: '12px 0', borderRadius: '12px' },
  clearBtn: { cursor: 'pointer', color: '#94a3b8', fontSize: '16px', padding: '4px 8px' },
  categoryRow: { display: 'flex', gap: '10px', padding: '24px 32px 0', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' },
  catBtn: { padding: '8px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s' },
  statsBar: { display: 'flex', gap: '32px', padding: '16px 32px', margin: '20px auto', maxWidth: '1200px', borderRadius: '12px', fontSize: '14px', color: '#64748b', fontWeight: '600' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', padding: '24px 32px 40px', maxWidth: '1200px', margin: '0 auto' },
  emptyState: { textAlign: 'center', gridColumn: '1/-1', padding: '60px' },
  card: { borderRadius: '16px', padding: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.07)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardTag: { display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', marginBottom: '12px' },
  cardTitle: { fontSize: '18px', fontWeight: '700', margin: '0 0 10px', lineHeight: '1.4' },
  cardContent: { fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  authorBox: { display: 'flex', alignItems: 'center', gap: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '14px' },
  actionBtns: { display: 'flex', gap: '8px' },
  editBtn: { padding: '6px 14px', background: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
  deleteBtn: { padding: '6px 10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  footer: { padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }
};