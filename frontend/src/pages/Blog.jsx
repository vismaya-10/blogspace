import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ThemeContext } from '../App';

export default function Blog() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dark = darkMode;

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  axios.get(`https://blogspace-backend-nnz8.onrender.com/api/blogs/${id}`).then(r => setBlog(r.data));
  axios.get(`https://blogspace-backend-nnz8.onrender.com/api/comments/${id}`).then(r => setComments(r.data));
}, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return alert('Please write something!');
    setLoading(true);
    try {
      const res = await axios.post(
        `https://blogspace-backend-nnz8.onrender.com/api/comments/${id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment');
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`https://blogspace-backend-nnz8.onrender.com/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(comments.filter(c => c._id !== commentId));
    } catch {
      alert('Failed to delete comment');
    }
  };

  if (!blog) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '18px' }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', sans-serif", padding: '40px 20px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>

        {/* Back Button */}
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#6366f1', fontWeight: '700', fontSize: '15px', cursor: 'pointer', marginBottom: '24px' }}>
          ← Back to Blogs
        </button>

        {/* Blog Card */}
        <div style={{ background: dark ? '#1e293b' : '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '32px' }}>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: '#6366f120', color: '#6366f1', fontSize: '12px', fontWeight: '700', marginBottom: '16px' }}>
            {blog.category || 'General'}
          </div>
          <h1 style={{ color: dark ? '#f1f5f9' : '#1e293b', fontSize: '28px', fontWeight: '800', margin: '0 0 12px', lineHeight: '1.4' }}>
            {blog.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700' }}>
              {blog.author?.username?.[0]?.toUpperCase()}
            </div>
            <span style={{ color: dark ? '#94a3b8' : '#64748b', fontSize: '14px' }}>
              {blog.author?.username} · {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <p style={{ color: dark ? '#cbd5e1' : '#334155', fontSize: '16px', lineHeight: '1.9', margin: 0, whiteSpace: 'pre-wrap' }}>
            {blog.content}
          </p>
        </div>

        {/* Comments Section */}
        <div style={{ background: dark ? '#1e293b' : '#fff', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ color: dark ? '#f1f5f9' : '#1e293b', fontSize: '20px', fontWeight: '800', margin: '0 0 24px' }}>
            💬 Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {user ? (
            <div style={{ marginBottom: '28px' }}>
              <textarea
                rows={3}
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `2px solid ${dark ? '#334155' : '#e2e8f0'}`, background: dark ? '#0f172a' : '#f8fafc', color: dark ? '#f1f5f9' : '#1e293b', fontSize: '15px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: "'Segoe UI', sans-serif" }}
              />
              <button
                onClick={handleAddComment}
                disabled={loading}
                style={{ marginTop: '10px', padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                {loading ? 'Posting...' : '🚀 Post Comment'}
              </button>
            </div>
          ) : (
            <div style={{ padding: '16px', background: dark ? '#0f172a' : '#f8fafc', borderRadius: '12px', marginBottom: '24px', textAlign: 'center' }}>
              <span style={{ color: dark ? '#94a3b8' : '#64748b' }}>
                <span onClick={() => navigate('/login')} style={{ color: '#6366f1', cursor: 'pointer', fontWeight: '700' }}>Login</span> to leave a comment
              </span>
            </div>
          )}

          {/* Comments List */}
          {comments.length === 0 ? (
            <p style={{ color: dark ? '#94a3b8' : '#94a3b8', textAlign: 'center', padding: '20px 0' }}>No comments yet. Be the first!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} style={{ padding: '18px', background: dark ? '#0f172a' : '#f8fafc', borderRadius: '12px', marginBottom: '12px', border: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px' }}>
                      {comment.author?.username?.[0]?.toUpperCase()}
                    </div>
                    <strong style={{ color: dark ? '#f1f5f9' : '#1e293b', fontSize: '14px' }}>{comment.author?.username}</strong>
                  </div>
                  <span style={{ color: dark ? '#475569' : '#94a3b8', fontSize: '12px' }}>
                    {new Date(comment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p style={{ color: dark ? '#cbd5e1' : '#334155', margin: '0 0 8px', fontSize: '14px', lineHeight: '1.6' }}>{comment.content}</p>
                {user && user.id === comment.author?._id && (
                  <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '600', padding: 0 }}>
                    🗑️ Delete
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}