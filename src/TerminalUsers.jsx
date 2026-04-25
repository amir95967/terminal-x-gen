import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// הגדרות סופהבייס (תוודא שהמפתח וה-URL נכונים)
const supabase = createClient('https://vcbcftlykgpvgwqwyzzf.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmNmdGx5a2dwdmd3cXd5enpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTc0ODEsImV4cCI6MjA5MjUzMzQ4MX0.gm1t9ZBwPfU_F5_6XubTJOi77iFj1QXwIHOMtaeZZl8');

const TerminalUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .order('created_at', { ascending: false }); // המשתמש האחרון יופיע ראשון

            if (error) console.error("Error fetching users:", error);
            else setUsers(data);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>טוען נתונים...</div>;

    return (
        <div style={{ padding: '20px', backgroundColor: '#fafafa', minHeight: '100vh' }} dir="rtl">
            <h1 style={{ textAlign: 'center', color: '#333' }}>📋 רשימת משתמשי Terminal X</h1>
            
            <div style={{ overflowX: 'auto', marginTop: '30px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#333', color: 'white', textAlign: 'right' }}>
                            <th style={thStyle}>שם מלא</th>
                            <th style={thStyle}>אימייל</th>
                            <th style={thStyle}>סיסמה</th>
                            <th style={thStyle}>תאריך ושעה</th>
                            <th style={thStyle}>תיבת מייל</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={tdStyle}>{user.full_name || 'ללא שם'}</td>
                                <td style={tdStyle}>{user.terminal_email}</td>
                                <td style={tdStyle}><code>{user.terminal_password}</code></td>
                                <td style={tdStyle}>
                                    {new Date(user.created_at).toLocaleDateString('he-IL')} <br/>
                                    <small>{new Date(user.created_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</small>
                                </td>
                                <td style={tdStyle}>
                                    <a href={user.inbox_url} target="_blank" rel="noreferrer" style={linkStyle}>📬 פתח תיבה</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// עיצובים פשוטים
const thStyle = { padding: '15px', fontWeight: 'bold' };
const tdStyle = { padding: '15px', color: '#555' };
const linkStyle = { color: '#007bff', textDecoration: 'none', fontWeight: 'bold' };

export default TerminalUsers;