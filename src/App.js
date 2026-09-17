/* eslint-disable no-dupe-keys */
import React, { useState, useEffect } from 'react';
import { FaUsers, FaCalendarCheck, FaChartBar, FaDownload, FaPlus, FaSearch, FaTimes, FaMoneyBillWave, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';

const NAVY = "#0A1931";
const NAVY_LIGHT = "#12264A";
const GOLD = "#C5A880";
const WHITE = "#FFFFFF";

const defaultMembers = [
  { id: 1, name: "Alice Wanjiku", role: "Choir lead", phone: "+254 712 345 678", group: "Choir", status: "Active", email: "alice@email.com", dateJoined: "2023-01-15", photo: null, emergency: { name: "Jane Wanjiku", relation: "Mother", phone: "+254 712 345 678" }, family: [{ name: "John Wanjiku", relation: "Husband" }] },
  { id: 2, name: "Bob Otieno", role: "Youth mentor", phone: "+254 722 111 222", group: "Youth", status: "Active", email: "", dateJoined: "2023-02-10", photo: null, emergency: { name: "", relation: "", phone: "" }, family: [] },
  { id: 3, name: "Grace Kamau", role: "Cell leader", phone: "+254 733 444 555", group: "Women", status: "Active", email: "", dateJoined: "2023-03-05", photo: null, emergency: { name: "", relation: "", phone: "" }, family: [] },
  { id: 4, name: "John Mwangi", role: "Member", phone: "+254 744 666 777", group: "Men", status: "Active", email: "", dateJoined: "2023-04-12", photo: null, emergency: { name: "", relation: "", phone: "" }, family: [] },
  { id: 5, name: "Faith Nyambura", role: "Member", phone: "+254 755 888 999", group: "Choir", status: "Active", email: "faith.nyambura@email.com", dateJoined: "2023-01-15", photo: null, emergency: { name: "Jane Nyambura", relation: "Mother", phone: "+254 712 345 678" }, family: [{ name: "John Nyambura", relation: "Husband" }, { name: "Grace Nyambura", relation: "Daughter • 8y" }] },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('patama_logged') === 'true');
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [tab, setTab] = useState("reports");
  const [members, setMembers] = useState(() => { const s = localStorage.getItem('patama_members'); return s ? JSON.parse(s) : defaultMembers; });
  const [attendance, setAttendance] = useState(() => { const s = localStorage.getItem('patama_attendance'); return s ? JSON.parse(s) : {}; });
  const [offerings, setOfferings] = useState(() => { const s = localStorage.getItem('patama_offerings'); return s ? JSON.parse(s) : [{ id: 1, date: '2026-08-21', type: 'Offering', amount: 8500, member: 'Sunday Service', method: 'Cash' }]; });

  const [visitors, setVisitors] = useState(() => { const s = localStorage.getItem('patama_visitors'); return s ? JSON.parse(s) : []; });
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [visitorFilter, setVisitorFilter] = useState("");
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorTabInner, setVisitorTabInner] = useState("overview");
  const [newVisitForm, setNewVisitForm] = useState({ service: "Sunday Service", notes: "" });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", role: "Member", phone: "", group: "Choir" });
  const [newOffering, setNewOffering] = useState({ type: 'Offering', amount: '', member: '', method: 'M-Pesa', date: new Date().toISOString().split('T')[0] });
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editEmergency, setEditEmergency] = useState({ name: "", relation: "", phone: "" });
  const [editFamily, setEditFamily] = useState([]);

  useEffect(() => { localStorage.setItem('patama_members', JSON.stringify(members)); }, [members]);
  useEffect(() => { localStorage.setItem('patama_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('patama_offerings', JSON.stringify(offerings)); }, [offerings]);
  useEffect(() => { localStorage.setItem('patama_visitors', JSON.stringify(visitors)); }, [visitors]);

  const dayRecord = attendance[selectedDate] || {};
  const getTodayStatus = (id) => dayRecord[id] || "Absent";
  const setTodayStatus = (id, status) => { setAttendance({ ...attendance, [selectedDate]: { ...dayRecord, [id]: status } }); };
  const activeMembers = members.filter(m => m.status === 'Active');
  const presentCount = activeMembers.filter(m => getTodayStatus(m.id) === "Present").length;
  const absentCount = activeMembers.filter(m => getTodayStatus(m.id) === "Absent").length;
  const lateCount = activeMembers.filter(m => getTodayStatus(m.id) === "Late").length;
  const totalOffering = offerings.reduce((a, b) => a + Number(b.amount), 0);

  const handleLogin = () => { if (loginForm.user === 'admin' && loginForm.pass === 'patama2026') { localStorage.setItem('patama_logged', 'true'); setIsLoggedIn(true); } else { alert("Use admin / patama2026"); } };
  const handleLogout = () => { localStorage.removeItem('patama_logged'); setIsLoggedIn(false); }
  const addMember = () => { if (!newMember.name || !newMember.phone) return alert("Name and phone required"); setMembers([...members, { id: Date.now(), status: "Active", email: "", dateJoined: new Date().toISOString().split('T')[0], photo: null, emergency: { name: "", relation: "", phone: "" }, family: [], ...newMember }]); setNewMember({ name: "", role: "Member", phone: "", group: "Choir" }); setShowAdd(false); };
  const openProfile = (m) => { setSelectedMember(m); setEditEmail(m.email || ""); setEditEmergency(m.emergency || { name: "", relation: "", phone: "" }); setEditFamily(m.family || []); setShowProfile(true); };
  const toggleStatus = () => { const newStatus = selectedMember.status === 'Active' ? 'Inactive' : 'Active'; const updated = { ...selectedMember, status: newStatus }; setSelectedMember(updated); setMembers(members.map(mm => mm.id === updated.id ? updated : mm)); };
  const saveProfile = () => { const updated = { ...selectedMember, email: editEmail, emergency: editEmergency, family: editFamily.filter(f => f.name.trim() !== "") }; setMembers(members.map(mm => mm.id === updated.id ? updated : mm)); setShowProfile(false); };

  // VISITOR FUNCTIONS WITH VISIT HISTORY
  const openNewVisitor = () => {
    setSelectedVisitor({
      id: Date.now(),
      visitDate: new Date().toISOString().split('T')[0],
      fullName: "", phoneNumber: "", email: "", maritalStatus: "", bornAgain: "Yes",
      residence: "", source: "", wantsToJoin: "", status: "New", notes: "", ministry: "",
      visits: [{ date: new Date().toISOString().split('T')[0], service: "Sunday Service", notes: "First visit" }],
      visitCount: 1
    });
    setVisitorTabInner("overview"); setShowVisitorModal(true);
  };

  const openEditVisitor = (v) => {
    // migrate old visitors to new structure
    if (!v.visits) { v.visits = [{ date: v.visitDate || new Date().toISOString().split('T')[0], service: "Sunday Service", notes: "First visit" }]; v.visitCount = 1; }
    setSelectedVisitor(v); setVisitorTabInner("overview"); setShowVisitorModal(true);
  };

  const addNewVisit = () => {
    const newVisit = { date: new Date().toISOString().split('T')[0], service: newVisitForm.service, notes: newVisitForm.notes };
    const updatedVisitor = { ...selectedVisitor, visits: [...(selectedVisitor.visits || []), newVisit], visitDate: new Date().toISOString().split('T')[0], visitCount: (selectedVisitor.visits?.length || 0) + 1 };
    setSelectedVisitor(updatedVisitor);
    setVisitors(visitors.map(v => v.id === selectedVisitor.id ? updatedVisitor : v));
    setNewVisitForm({ service: "Sunday Service", notes: "" });
  };

  const saveVisitor = () => {
    if (!selectedVisitor.fullName) return alert("Full name required");
    if (selectedVisitor.wantsToJoin === "Yes") {
      const newMemberFromVisitor = {
        id: Date.now(), name: selectedVisitor.fullName, role: "Member", phone: selectedVisitor.phoneNumber,
        group: selectedVisitor.ministry || "Choir", status: "Active", email: selectedVisitor.email,
        dateJoined: new Date().toISOString().split('T')[0], photo: null, emergency: { name: "", relation: "", phone: "" }, family: [], fromVisitor: true
      };
      setMembers([...members, newMemberFromVisitor]);
      setVisitors(visitors.filter(v => v.id !== selectedVisitor.id));
      alert(selectedVisitor.fullName + " converted to Member!");
    } else {
      const exists = visitors.find(v => v.id === selectedVisitor.id);
      if (exists) { setVisitors(visitors.map(v => v.id === selectedVisitor.id ? selectedVisitor : v)); }
      else { setVisitors([...visitors, selectedVisitor]); }
    }
    setShowVisitorModal(false);
  };

  const filteredVisitors = visitors.filter(v => {
    const matchSearch = v.fullName.toLowerCase().includes(visitorSearch.toLowerCase()) || v.phoneNumber.includes(visitorSearch) || v.residence.toLowerCase().includes(visitorSearch.toLowerCase());
    const matchFilter = visitorFilter === "" || v.wantsToJoin === visitorFilter;
    return matchSearch && matchFilter;
  });

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY }}>
        <div style={{ background: WHITE, padding: 32, borderRadius: 16, width: 360, borderTop: `4px solid ${GOLD}` }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}><div style={{ width: 40, height: 40, background: NAVY, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: GOLD, border: `1px solid ${GOLD}` }}>P</div><div><div style={{ fontWeight: 700, color: NAVY }}>Patama CMS</div><div style={{ fontSize: 12, color: '#888' }}>Admin Login</div></div></div>
          <input placeholder="Username" value={loginForm.user} onChange={e => setLoginForm({ ...loginForm, user: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ddd' }} />
          <input type="password" placeholder="Password" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid #ddd' }} />
          <button onClick={handleLogin} style={{ width: '100%', background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: 12, borderRadius: 8, fontWeight: 700 }}>Login</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Inter, sans-serif', background: '#F8F6F1', minHeight: '100vh' }}>
      <div style={{ width: 260, background: NAVY, color: WHITE, padding: 20, borderRadius: 16, margin: 10, height: 'fit-content', position: 'sticky', top: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 30 }}><div style={{ width: 40, height: 40, background: GOLD, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: NAVY }}>P</div><div><div style={{ fontWeight: 700, fontSize: 18 }}>Patama</div><div style={{ fontSize: 12, color: GOLD }}>CMS</div></div></div>
        <div onClick={() => setTab("members")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "members" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "members" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "members" ? GOLD : WHITE }}><FaUsers /> Members</div>
        <div onClick={() => setTab("visitors")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "visitors" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "visitors" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "visitors" ? GOLD : WHITE }}><FaUserPlus /> Visitors {visitors.length > 0 && <span style={{ background: GOLD, color: NAVY, fontSize: 10, padding: '2px 6px', borderRadius: 10, marginLeft: 'auto' }}>{visitors.length}</span>}</div>
        <div onClick={() => setTab("attendance")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "attendance" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "attendance" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "attendance" ? GOLD : WHITE }}><FaCalendarCheck /> Attendance</div>
        <div onClick={() => setTab("reports")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "reports" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "reports" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "reports" ? GOLD : WHITE }}><FaChartBar /> Reports</div>
        <div onClick={() => setTab("offering")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "offering" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "offering" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "offering" ? GOLD : WHITE }}><FaMoneyBillWave /> Offering</div>
        <div onClick={handleLogout} style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'transparent', border: `1px solid ${GOLD}`, display: 'flex', gap: 10, cursor: 'pointer', justifyContent: 'center', fontWeight: 600, color: GOLD }}><FaSignOutAlt /> Logout</div>
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h1 style={{ margin: 0, color: NAVY }}>{tab === "members" ? "Members" : tab === "visitors" ? "Visitors" : tab}</h1>
          {tab === "visitors" ? <button onClick={openNewVisitor} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}><FaPlus /> Add Visitor</button> : null}
        </div>

        {tab === "visitors" && (
          <div>
            <div style={{ display: 'flex', gap: 10, background: WHITE, padding: 10, borderRadius: 8, marginBottom: 16 }}>
              <FaSearch style={{ color: GOLD }} /><input placeholder="Search visitors" value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} />
              <select value={visitorFilter} onChange={e => setVisitorFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${GOLD}40` }}><option value="">All</option><option value="Yes">Yes</option><option value="No">No</option><option value="Unsure">Unsure</option></select>
            </div>
            <div style={{ background: WHITE, borderRadius: 12, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: NAVY }}><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>NAME</th><th style={{ padding: 12, fontSize: 12, color: GOLD }}>DATE</th><th style={{ padding: 12, fontSize: 12, color: GOLD }}>PHONE</th><th style={{ padding: 12, fontSize: 12, color: GOLD }}>VISITS</th><th style={{ padding: 12, fontSize: 12, color: GOLD }}>WANTS TO JOIN?</th><th style={{ padding: 12, fontSize: 12, color: GOLD }}>ACTION</th></tr></thead>
                <tbody>{filteredVisitors.length === 0 ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center' }}>No visitors yet</td></tr> : filteredVisitors.map(v => (<tr key={v.id} style={{ borderTop: '1px solid #eee' }}><td style={{ padding: 12, fontWeight: 600 }}>{v.fullName} {v.notes && <span style={{ fontSize: 9, color: '#16a34a' }}>• note</span>}</td><td style={{ padding: 12 }}>{v.visitDate}</td><td style={{ padding: 12 }}>{v.phoneNumber}</td><td style={{ padding: 12 }}><b>{v.visits?.length || 1}</b></td><td style={{ padding: 12 }}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: v.wantsToJoin === 'Yes' ? '#dcfce7' : '#fef3c7' }}>{v.wantsToJoin || "-"}</span></td><td style={{ padding: 12 }}><button onClick={() => openEditVisitor(v)} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>View</button></td></tr>))}</tbody></table>
            </div>
          </div>
        )}
        {tab === "members" && <div style={{ background: WHITE, borderRadius: 12, padding: 12 }}>{members.map(m => <div key={m.id} style={{ padding: 8, borderBottom: '1px solid #eee' }}>{m.name} - {m.phone}</div>)}</div>}
        {tab === "reports" && <div>Dashboard - Members: {members.length} Visitors: {visitors.length} Returning: {visitors.filter(v => (v.visits?.length || 0) > 1).length}</div>}
      </div>

      {showVisitorModal && selectedVisitor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 10 }}>
          <div style={{ background: WHITE, borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '95vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: NAVY, color: WHITE, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{selectedVisitor.fullName?.charAt(0) || "S"}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{selectedVisitor.fullName || "New Visitor"}</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>{selectedVisitor.phoneNumber} • Visits: {selectedVisitor.visits?.length || 1}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Last: {selectedVisitor.visitDate}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Join: {selectedVisitor.wantsToJoin || "-"}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Born Again: {selectedVisitor.bornAgain}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowVisitorModal(false)} style={{ background: WHITE, color: NAVY, border: 'none', padding: '6px 12px', borderRadius: 8, height: 32, fontSize: 12, fontWeight: 700 }}>✕ CLOSE</button>
            </div>

            <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #eee', padding: '0 20px' }}>
              <button onClick={() => setVisitorTabInner("overview")} style={{ padding: '12px 0', border: 'none', background: 'none', borderBottom: visitorTabInner === "overview" ? `2px solid ${NAVY}` : '2px solid transparent', fontWeight: 700, cursor: 'pointer' }}>☑️ Overview</button>
              <button onClick={() => setVisitorTabInner("history")} style={{ padding: '12px 0', border: 'none', background: 'none', borderBottom: visitorTabInner === "history" ? `2px solid ${NAVY}` : '2px solid transparent', fontWeight: 700, cursor: 'pointer' }}>🕒 Visit History ({selectedVisitor.visits?.length || 1})</button>
              <button onClick={() => setVisitorTabInner("notes")} style={{ padding: '12px 0', border: 'none', background: 'none', borderBottom: visitorTabInner === "notes" ? `2px solid ${NAVY}` : '2px solid transparent', fontWeight: 700, cursor: 'pointer' }}>📄 Notes</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1, background: '#fdf8f0' }}>
              {visitorTabInner === "overview" && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={{ fontSize: 10, fontWeight: 700 }}>VISIT DATE</label><input type="date" value={selectedVisitor.visitDate} onChange={e => setSelectedVisitor({ ...selectedVisitor, visitDate: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }} /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700 }}>FULL NAME</label><input value={selectedVisitor.fullName} onChange={e => setSelectedVisitor({ ...selectedVisitor, fullName: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }} /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700 }}>PHONE</label><input value={selectedVisitor.phoneNumber} onChange={e => setSelectedVisitor({ ...selectedVisitor, phoneNumber: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }} /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700 }}>RESIDENCE</label><input value={selectedVisitor.residence} onChange={e => setSelectedVisitor({ ...selectedVisitor, residence: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4 }} /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 10, fontWeight: 700 }}>WANTS TO JOIN? *</label><select value={selectedVisitor.wantsToJoin} onChange={e => setSelectedVisitor({ ...selectedVisitor, wantsToJoin: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 8, border: `2px solid ${GOLD}`, marginTop: 4, fontWeight: 700 }}><option value="">Select</option><option value="Yes">Yes - Convert to Member</option><option value="No">No</option><option value="Unsure">Unsure</option></select></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}><button onClick={() => setShowVisitorModal(false)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ccc', background: WHITE }}>Cancel</button><button onClick={saveVisitor} style={{ padding: '10px 20px', borderRadius: 8, background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, fontWeight: 700 }}>SAVE</button></div>
                </>
              )}

              {visitorTabInner === "history" && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Visit Timeline</div>
                  <div style={{ borderLeft: `2px solid ${GOLD}`, paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedVisitor.visits?.slice().reverse().map((vi, i) => (
                      <div key={i} style={{ background: WHITE, padding: 10, borderRadius: 8, border: '1px solid #eee' }}>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{vi.date} - {vi.service}</div>
                        {vi.notes && <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{vi.notes}</div>}
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#fffbeb', padding: 12, borderRadius: 8, marginTop: 16, border: `1px solid ${GOLD}40` }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>+ Add Visit</div>
                    <select value={newVisitForm.service} onChange={e => setNewVisitForm({ ...newVisitForm, service: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }}><option>Sunday Service</option><option>Midweek</option><option>Friday Kesha</option><option>Youth Service</option><option>Special Event</option></select>
                    <input placeholder="Notes for this visit" value={newVisitForm.notes} onChange={e => setNewVisitForm({ ...newVisitForm, notes: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', marginTop: 6 }} />
                    <button onClick={addNewVisit} style={{ width: '100%', marginTop: 8, background: NAVY, color: GOLD, padding: 10, borderRadius: 8, border: `1px solid ${GOLD}`, fontWeight: 700 }}>Add This Visit</button>
                  </div>
                </div>
              )}

              {visitorTabInner === "notes" && (
                <div><label style={{ fontWeight: 700 }}>Follow-up Notes</label><textarea value={selectedVisitor.notes} onChange={e => setSelectedVisitor({ ...selectedVisitor, notes: e.target.value })} style={{ width: '100%', height: 200, padding: 12, borderRadius: 8, border: '1px solid #ccc', marginTop: 8 }} placeholder="e.g. Called Tuesday, promised Sunday"></textarea><button onClick={saveVisitor} style={{ marginTop: 10, padding: '10px 20px', borderRadius: 8, background: NAVY, color: GOLD, border: `1px solid ${GOLD}` }}>Save Notes</button></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}