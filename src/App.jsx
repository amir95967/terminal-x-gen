import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

// הגדרת סופהבייס
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vcbcftlykgpvgwqwyzzf.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmNmdGx5a2dwdmd3cXd5enpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTc0ODEsImV4cCI6MjA5MjUzMzQ4MX0.gm1t9ZBwPfU_F5_6XubTJOi77iFj1QXwIHOMtaeZZl8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BOT_URL = 'https://humped-defection-smugness.ngrok-free.dev/run-bot';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <Router>
      <div style={globalWrapper}>
        <style>{mobileTableStyles}</style>
        <nav style={navStyle} dir="rtl">
          <Link to="/" style={logoStyle}>TERMINAL<span style={{color: '#6366f1'}}>X</span> GEN</Link>
          <div style={navLinks}>
            {session ? (
              <>
                <Link to="/generator" style={linkStyle}>⚡ מחולל</Link>
                <Link to="/my-users" style={linkStyle}>👥 המשתמשים שלי</Link>
                <button onClick={() => supabase.auth.signOut()} style={logoutBtn}>התנתק</button>
              </>
            ) : (
              <>
                <Link to="/login" style={linkStyle}>כניסה</Link>
                <Link to="/register" style={registerNavBtn}>להרשמה חינם</Link>
              </>
            )}
          </div>
        </nav>

        <main dir="rtl" style={mainContainer}>
          <Routes>
            <Route path="/" element={<Home session={session} />} />
            <Route path="/login" element={!session ? <Login /> : <Navigate to="/generator" />} />
            <Route path="/register" element={!session ? <Register /> : <Navigate to="/generator" />} />
            <Route path="/generator" element={session ? <Generator user={session.user} /> : <Navigate to="/login" />} />
            <Route path="/my-users" element={session ? <MyUsers user={session.user} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// --- 🏠 1. דף בית ---
function Home({ session }) {
  return (
    <div style={{ width: '100%' }}>
      <section style={heroFullSection}>
        <div style={badge}>הגרסה החדשה 2.0 כבר כאן 🚀</div>
        <h1 style={heroTitle}>ייצור משתמשים <br /><span style={gradientText}>במהירות האור.</span></h1>
        <p style={heroSub}>המערכת המתקדמת ביותר לניהול ואוטומציית חשבונות טרמינל X.</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {session ? (
            <Link to="/generator"><button style={primaryBtn}>אל המחולל שלי</button></Link>
          ) : (
            <>
              <Link to="/register"><button style={primaryBtn}>התחל עכשיו - זה חינם</button></Link>
              <Link to="/login"><button style={secondaryBtn}>כניסה למערכת</button></Link>
            </>
          )}
        </div>
      </section>

      <section style={featuresSection}>
        <h2 style={sectionTitle}>למה לבחור ב-TerminalX Gen?</h2>
        <div style={featuresGrid}>
          <div style={featureCard}>
            <div style={featureIcon}>⚡</div>
            <h3>מהירות שיא</h3>
            <p>ייצור משתמש מלא תוך פחות מ-30 שניות כולל פתרון אוטומטי.</p>
          </div>
          <div style={featureCard}>
            <div style={featureIcon}>🛡️</div>
            <h3>אבטחה מקסימלית</h3>
            <p>הנתונים שלך שמורים ומוגנים תחת הצפנה מתקדמת של Supabase.</p>
          </div>
          <div style={featureCard}>
            <div style={featureIcon}>📱</div>
            <h3>ניהול חכם</h3>
            <p>גישה לכל המשתמשים שיצרת מכל מכשיר ובכל זמן בדשבורד האישי.</p>
          </div>
        </div>
      </section>

      <footer style={footerStyle}>
        <p>© 2026 TerminalX Gen PRO. כל הזכויות שמורות לאמיר שאול.</p>
      </footer>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };
  return (
    <div style={glassCard}>
      <h2 style={cardTitle}>כניסה למערכת</h2>
      <form onSubmit={handleLogin} style={formStyle}>
        <input type="email" placeholder="אימייל" onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="סיסמה" onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={primaryBtn}>התחבר</button>
      </form>
    </div>
  );
}

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("נרשמת בהצלחה!");
  };
  return (
    <div style={glassCard}>
      <h2 style={cardTitle}>הרשמה חינם</h2>
      <form onSubmit={handleRegister} style={formStyle}>
        <input type="email" placeholder="אימייל" onChange={e => setEmail(e.target.value)} required style={inputStyle} />
        <input type="password" placeholder="סיסמה" onChange={e => setPassword(e.target.value)} required style={inputStyle} />
        <button type="submit" style={superBtnStyle}>צור חשבון</button>
      </form>
    </div>
  );
}

function Generator({ user }) {
  const [status, setStatus] = useState('');
  const runBot = async () => {
    setStatus('🤖 הבוט התחיל לעבוד... המתן לפתיחת הדפדפן במחשב של אמיר');
    try {
      const res = await fetch(BOT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const result = await res.json();
      setStatus(result.success ? '✅ המשתמש נוצר בהצלחה!' : '❌ תקלה');
    } catch (e) { 
      setStatus('❌ שגיאה: וודא ש-ngrok ושרת הבוט רצים במחשב של אמיר'); 
    }
  };
  return (
    <div style={glassCard}>
      <h1>⚡ מחולל</h1>
      <p>שלום, {user.email}</p>
      <button onClick={runBot} style={genActionBtn}>🚀 צור משתמש חדש</button>
      <p style={{marginTop: '20px', fontWeight: '500', color: '#818cf8'}}>{status}</p>
    </div>
  );
}

function MyUsers({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) console.error("Error fetching:", error);
    else setUsers(data || []);
    setLoading(false);
  };

  const deleteUser = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המשתמש הזה?")) {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) {
        alert("שגיאה במחיקה: " + error.message);
      } else {
        setUsers(users.filter(u => u.id !== id));
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('הועתק ללוח!');
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  return (
    <div className="myusers-page" style={{ width: '100%', maxWidth: '1200px', margin: 'auto', padding: '20px' }}>
      <div className="myusers-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px' }}>
        <button onClick={fetchUsers} style={refreshBtn}>🔄 רענן רשימה</button>
        <h1 className="myusers-title" style={cardTitle}>📋 המשתמשים שלי ({users.length})</h1>
      </div>
      
      <div className="myusers-table-wrapper" style={tableWrapper}>
        {loading ? <p style={{padding: '20px', textAlign: 'center'}}>טוען נתונים...</p> : (
          <table className="myusers-table" style={modernTable}>
            <thead>
              <tr>
                <th style={thStyle}>תאריך</th>
                <th style={thStyle}>שם מלא</th>
                <th style={thStyle}>אימייל</th>
                <th style={thStyle}>סיסמה</th>
                <th style={thStyle}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle} data-label="תאריך">{new Date(u.created_at).toLocaleDateString('he-IL')}</td>
                  <td style={tdStyle} data-label="שם מלא">{u.full_name || 'אמיר שאול'}</td>
                  <td style={tdStyle} data-label="אימייל">
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap'}}>
                      <span>{u.terminal_email}</span>
                      <button onClick={() => copyToClipboard(u.terminal_email)} style={miniCopyBtn}>📋</button>
                    </div>
                  </td>
                  <td style={tdStyle} data-label="סיסמה">
                     <div style={{display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap'}}>
                      <span>{u.terminal_password || '********'}</span>
                      <button onClick={() => copyToClipboard(u.terminal_password)} style={miniCopyBtn}>📋</button>
                    </div>
                  </td>
                  <td style={tdStyle} data-label="פעולות">
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <a href={u.inbox_url} target="_blank" rel="noreferrer" style={actionBtn}>📂 מייל</a>
                      <button onClick={() => deleteUser(u.id)} style={deleteBtn}>🗑️</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>לא נמצאו משתמשים.</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- 🎨 Styles ---
const globalWrapper = { minHeight: '100vh', background: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' };
const navStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', position: 'fixed', width: '100%', top: 0, zIndex: 1000, boxSizing: 'border-box', flexWrap: 'wrap', gap: '12px' };
const logoStyle = { fontSize: '24px', fontWeight: '900', color: '#fff', textDecoration: 'none' };
const navLinks = { display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' };
const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontWeight: '500' };
const registerNavBtn = { background: '#fff', color: '#000', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' };
const logoutBtn = { background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer' };
const mainContainer = { paddingTop: '100px', width: '100%', boxSizing: 'border-box' };
const heroFullSection = { minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: 'radial-gradient(circle at center, #1e1b4b 0%, #0f172a 100%)', padding: '0 20px' };
const heroTitle = { fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '20px' };
const gradientText = { background: 'linear-gradient(90deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' };
const heroSub = { fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', color: '#94a3b8', marginBottom: '40px', maxWidth: '700px' };
const badge = { background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '6px 15px', borderRadius: '20px', marginBottom: '20px', fontWeight: 'bold' };
const featuresSection = { padding: '80px 20px', background: '#0f172a', textAlign: 'center' };
const sectionTitle = { fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: '800', marginBottom: '60px' };
const featuresGrid = { display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' };
const featureCard = { background: 'rgba(30, 41, 59, 0.5)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.1)', width: '100%', maxWidth: '320px', boxSizing: 'border-box' };
const featureIcon = { fontSize: '40px', marginBottom: '20px' };
const footerStyle = { padding: '40px 20px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', color: '#475569' };
const glassCard = { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '24px', padding: '30px 20px', width: '100%', maxWidth: '450px', margin: '100px auto', textAlign: 'center', boxSizing: 'border-box' };
const cardTitle = { fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: '800', marginBottom: '20px' };
const primaryBtn = { background: '#6366f1', color: '#fff', padding: '14px 28px', borderRadius: '12px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', minWidth: '160px' };
const secondaryBtn = { background: 'transparent', color: '#fff', padding: '14px 28px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', minWidth: '160px' };
const genActionBtn = { padding: '18px', background: '#ffeb3b', color: '#000', fontSize: '1rem', fontWeight: '900', border: 'none', borderRadius: '15px', cursor: 'pointer', width: '100%' };
const tableWrapper = { background: 'rgba(30, 41, 59, 0.4)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden', margin: '40px auto', padding: '16px', maxWidth: '100%', boxSizing: 'border-box', boxShadow: '0 10px 40px rgba(15,23,42,0.2)' };
const modernTable = { width: '100%', borderCollapse: 'collapse', minWidth: '0', margin: '0 auto', maxWidth: '100%' };
const thStyle = { padding: '16px', background: 'rgba(255,255,255,0.03)', textAlign: 'right', color: '#94a3b8' };
const tdStyle = { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' };
const actionBtn = { color: '#6366f1', textDecoration: 'none', fontWeight: 'bold', background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '10px' };
const deleteBtn = { background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const refreshBtn = { background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', border: '1px solid #6366f1', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const mobileTableStyles = `
  @media (max-width: 760px) {
    .myusers-header { flex-direction: column; align-items: stretch; }
    .myusers-header button { width: 100%; max-width: none; }
    .myusers-title { margin: 0; }
    .myusers-table-wrapper { padding: 12px; }
    .myusers-table { min-width: 0 !important; width: 100% !important; border: none; }
    .myusers-table thead { display: none; }
    .myusers-table tbody tr { display: block; margin-bottom: 18px; border: 1px solid rgba(148, 163, 184, 0.15); border-radius: 18px; background: rgba(15, 23, 42, 0.9); padding: 14px; }
    .myusers-table tbody tr td { display: block; width: 100%; padding: 10px 0; text-align: right; border-bottom: none; }
    .myusers-table tbody tr td:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.08); }
    .myusers-table tbody tr td::before { content: attr(data-label); display: block; margin-bottom: 8px; color: #94a3b8; font-size: 0.95rem; font-weight: 600; }
    .myusers-table tbody tr td > div { justify-content: flex-start; gap: 10px; }
    .myusers-table tbody tr td > div span { overflow-wrap: anywhere; }
    .myusers-table tbody tr td:last-child { padding-bottom: 0; }
  }
`;
const inputStyle = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15, 23, 42, 0.6)', color: '#fff', fontSize: '16px', marginBottom: '15px', boxSizing: 'border-box' };
const formStyle = { display: 'flex', flexDirection: 'column' };
const superBtnStyle = { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };
const miniCopyBtn = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', padding: '0', marginLeft: '5px' };

export default App;