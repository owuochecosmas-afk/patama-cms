import React, { useState, useEffect } from 'react';

function App() {
  const [page, setPage] = useState('visitors');
  const [visitors, setVisitors] = useState(() => JSON.parse(localStorage.getItem('patama_visitors_v3') || '[]'));
  const [members, setMembers] = useState(() => JSON.parse(localStorage.getItem('patama_members') || '[{"id":1,"name":"Emmanuel Oucho","phone":"0700000001","status":"Active"}]'));
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showHist, setShowHist] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', source: 'Walk-in' });
  const [visitForm, setVisitForm] = useState({ service: 'Sunday Service', notes: '' });
  const [followUp, setFollowUp] = useState('');
  const [logged, setLogged] = useState(localStorage.getItem('patama_login') === 'true');
  const [login, setLogin] = useState({ u: '', p: '' });

  useEffect(() => localStorage.setItem('patama_visitors_v3', JSON.stringify(visitors)), [visitors]);
  useEffect(() => localStorage.setItem('patama_members', JSON.stringify(members)), [members]);

  const addVisitor = () => {
    if (!form.name) return alert('Enter name');
    const v = {
      id: Date.now(),
      name: form.name, phone: form.phone, source: form.source,
      firstVisit: new Date().toISOString().slice(0, 10),
      lastVisit: new Date().toISOString().slice(0, 10),
      visitCount: 1, status: 'New',
      visits: [{ date: new Date().toISOString().slice(0, 10), service: 'Sunday Service', notes: 'First visit' }],
      followUpNotes: ''
    };
    setVisitors([v, ...visitors]); setShowAdd(false); setForm({ name: '', phone: '', source: 'Walk-in' });
  };

  const addVisit = () => {
    const updated = visitors.map(v => v.id === selected.id ? {
      ...v,
      visits: [...v.visits, { date: new Date().toISOString().slice(0, 10), service: visitForm.service, notes: visitForm.notes }],
      lastVisit: new Date().toISOString().slice(0, 10),
      visitCount: v.visits.length + 1
    } : v);
    setVisitors(updated);
    setSelected(updated.find(x => x.id === selected.id));
    setVisitForm({ service: 'Sunday Service', notes: '' });
  };

  const saveFollow = () => {
    setVisitors(visitors.map(v => v.id === selected.id ? { ...v, followUpNotes: followUp } : v));
    setSelected({ ...selected, followUpNotes: followUp });
    alert('Follow-up saved');
  };

  const toMember = (v) => {
    setMembers([{ id: Date.now(), name: v.name, phone: v.phone, status: 'New' }, ...members]);
    setVisitors(visitors.map(x => x.id === v.id ? { ...x, status: 'Joined' } : x));
    setShowHist(false);
  };

  if (!logged) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#fff', padding: 28, borderRadius: 16, width: 300 }}>
        <h2 style={{ fontWeight: 900 }}>PATAMA CMS</h2>
        <input placeholder='admin' style={s.input} value={login.u} onChange={e => setLogin({ ...login, u: e.target.value })} />
        <input type='password' placeholder='patama2026' style={s.input} value={login.p} onChange={e => setLogin({ ...login, p: e.target.value })} />
        <button onClick={() => { if (login.u === 'admin' && login.p === 'patama2026') { setLogged(true); localStorage.setItem('patama_login', 'true') } else alert('admin / patama2026') }} style={s.primary}>Login</button>
      </div>
    </div>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui' }}>
      <div style={{ width: 200, background: '#0f172a', color: '#fff', padding: 18 }}>
        <h3 style={{ fontWeight: 900 }}>PATAMA</h3>
        <button onClick={() => setPage('dashboard')} style={s.nav(page === 'dashboard')}>Dashboard</button>
        <button onClick={() => setPage('members')} style={s.nav(page === 'members')}>Members ({members.length})</button>
        <button onClick={() => setPage('visitors')} style={s.nav(page === 'visitors')}>Visitors ({visitors.length})</button>
      </div>

      <div style={{ flex: 1, padding: 20 }}>
        {page === 'visitors' && <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><h2 style={{ fontWeight: 800 }}>Visitors</h2><button onClick={() => setShowAdd(true)} style={s.primary}>+ Add Visitor</button></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 14, marginTop: 16 }}>
            {visitors.map(v => (
              <div key={v.id} onClick={() => { setSelected(v); setFollowUp(v.followUpNotes || ''); setShowHist(true) }} style={{ background: '#fff', padding: 14, borderRadius: 12, borderLeft: v.status === 'Joined' ? '4px solid #22c55e' : '4px solid #f59e0b', cursor: 'pointer' }}>
                <b>{v.name}</b><div style={{ fontSize: 12, color: '#64748b' }}>{v.phone} • {v.source}</div>
                <div style={{ fontSize: 11, marginTop: 6 }}>Visits: {v.visitCount} | Last: {v.lastVisit}</div>
                <span style={{ fontSize: 10, background: v.status === 'Joined' ? '#dcfce7' : '#fef3c7', padding: '2px 8px', borderRadius: 20 }}>{v.status}</span>
              </div>
            ))}
          </div>
        </>}

        {page === 'members' && <><h2>Members</h2><div style={{ background: '#fff', borderRadius: 12, marginTop: 12 }}>{members.map(m => <div key={m.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}><b>{m.name}</b> - {m.phone}</div>)}</div></>}

        {page === 'dashboard' && <><h2>Dashboard</h2><div style={{ display: 'flex', gap: 12, marginTop: 12 }}><div style={s.card}><h1>{members.length}</h1>Members</div><div style={s.card}><h1>{visitors.length}</h1>Visitors</div><div style={s.card}><h1>{visitors.filter(x => x.visitCount > 1).length}</h1>Returning</div></div></>}
      </div>

      {showAdd && <div style={s.over}><div style={s.modal}><h3>Add Visitor</h3><input placeholder='Full Name' style={s.input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /><input placeholder='Phone' style={s.input} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /><select style={s.input} value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}><option>Walk-in</option><option>Invite</option><option>Event</option><option>Online</option></select><div style={{ display: 'flex', gap: 8, marginTop: 12 }}><button onClick={() => setShowAdd(false)} style={s.ghost}>Cancel</button><button onClick={addVisitor} style={s.primary}>Save</button></div></div></div>}

      {showHist && selected && <div style={s.over}><div style={{ ...s.modal, width: 380, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0 }}>{selected.name}</h3><button onClick={() => setShowHist(false)} style={{ border: 'none', background: 'none', fontSize: 22 }}>×</button></div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{selected.phone} • First: {selected.firstVisit}</div>

        <h4 style={{ margin: '16px 0 6px' }}>Visit History ({selected.visits.length})</h4>
        <div style={{ borderLeft: '2px solid #e2e8f0', paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {selected.visits.slice().reverse().map((vi, i) => <div key={i} style={{ background: '#f8fafc', padding: 8, borderRadius: 8 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{vi.date} - {vi.service}</div>{vi.notes && <div style={{ fontSize: 12 }}>{vi.notes}</div>}</div>)}
        </div>

        <div style={{ background: '#fffbeb', padding: 10, borderRadius: 8, marginTop: 12 }}>
          <b style={{ fontSize: 13 }}>+ Add Visit</b>
          <select style={{ ...s.input, marginTop: 6 }} value={visitForm.service} onChange={e => setVisitForm({ ...visitForm, service: e.target.value })}><option>Sunday Service</option><option>Midweek</option><option>Friday Kesha</option><option>Youth Service</option><option>Special Event</option></select>
          <input placeholder='Notes' style={s.input} value={visitForm.notes} onChange={e => setVisitForm({ ...visitForm, notes: e.target.value })} />
          <button onClick={addVisit} style={{ ...s.primary, width: '100%', marginTop: 8 }}>Add This Visit</button>
        </div>

        <h4 style={{ margin: '16px 0 6px' }}>Follow-up Notes</h4>
        <textarea placeholder='Called Monday, will visit home Thursday...' style={{ ...s.input, minHeight: 70 }} value={followUp} onChange={e => setFollowUp(e.target.value)} />
        <button onClick={saveFollow} style={{ ...s.ghost, border: '1px solid #cbd5e1', width: '100%', marginTop: 6 }}>Save Follow-up</button>
        {selected.status !== 'Joined' && <button onClick={() => toMember(selected)} style={{ ...s.primary, background: '#16a34a', width: '100%', marginTop: 12 }}>Convert to Member</button>}
      </div></div>}
    </div>
  );
}
const s = {
  input: { width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', marginTop: 8, boxSizing: 'border-box' },
  primary: { background: '#0f172a', color: '#fff', padding: '10px 16px', borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' },
  ghost: { background: '#f1f5f9', color: '#0f172a', padding: '10px 16px', borderRadius: 8, border: 'none', fontWeight: 600, cursor: 'pointer' },
  nav: (a) => ({ display: 'block', width: '100%', textAlign: 'left', background: a ? '#fff' : 'transparent', color: a ? '#0f172a' : '#fff', border: 'none', padding: 10, borderRadius: 8, marginTop: 6, cursor: 'pointer' }),
  card: { background: '#fff', padding: 18, borderRadius: 12, flex: 1 },
  over: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: 16 },
  modal: { background: '#fff', padding: 18, borderRadius: 16, width: 320 }
};
export default App;