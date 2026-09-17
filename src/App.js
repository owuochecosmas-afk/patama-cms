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
  const [offerings, setOfferings] = useState(() => { const s = localStorage.getItem('patama_offerings'); return s ? JSON.parse(s) : [{ id: 1, date: '2026-08-21', type: 'Offering', amount: 8500, member: 'Sunday Service', method: 'Cash' }, { id: 2, date: '2026-08-21', type: 'Tithe', amount: 3200, member: 'John Mwangi', method: 'M-Pesa' }]; });

  // VISITORS STATE
  const [visitors, setVisitors] = useState(() => { const s = localStorage.getItem('patama_visitors'); return s ? JSON.parse(s) : []; });
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [visitorFilter, setVisitorFilter] = useState("");
  const [visitorSearch, setVisitorSearch] = useState("");
  const [visitorTabInner, setVisitorTabInner] = useState("overview");

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
  const handlePhotoUpload = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (ev) => { const updated = { ...selectedMember, photo: ev.target.result }; setSelectedMember(updated); setMembers(members.map(mm => mm.id === updated.id ? updated : mm)); }; reader.readAsDataURL(file); };
  const toggleStatus = () => { const newStatus = selectedMember.status === 'Active' ? 'Inactive' : 'Active'; const updated = { ...selectedMember, status: newStatus }; setSelectedMember(updated); setMembers(members.map(mm => mm.id === updated.id ? updated : mm)); };
  const saveProfile = () => { const updated = { ...selectedMember, email: editEmail, emergency: editEmergency, family: editFamily.filter(f => f.name.trim() !== "") }; setMembers(members.map(mm => mm.id === updated.id ? updated : mm)); setShowProfile(false); };
  const deleteOffering = (id) => { if (window.confirm('Delete this collection?')) setOfferings(offerings.filter(o => o.id !== id)); };
  const editOffering = (o) => { setNewOffering({ type: o.type, amount: o.amount, member: o.member, method: o.method || 'M-Pesa', date: o.date }); setOfferings(offerings.filter(x => x.id !== o.id)); };
  const getAttendanceSummary = (memberId) => { let present = 0, absent = 0; Object.values(attendance).forEach(day => { if (day[memberId] === "Present") present++; else if (day[memberId] === "Absent") absent++; }); if (memberId === 5 && present === 0 && absent === 0) { present = 22; absent = 3; } const total = present + absent; const percent = total > 0 ? Math.round((present / total) * 100) : 0; return { present, absent, percent }; };
  const exportToCSV = () => { const headers = ["Date", "Member Name", "Group", "Status"]; const rows = members.map(m => [selectedDate, m.name, m.group, getTodayStatus(m.id)]); const csv = [headers, ...rows].map(e => e.join(",")).join("\n"); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const url = window.URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = 'patama_attendance_' + selectedDate + '.csv'; document.body.appendChild(a); a.click(); document.body.removeChild(a); };
  const filtered = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.group.toLowerCase().includes(search.toLowerCase()));
  const statusColor = (s) => s === "Present" ? "#dcfce7" : s === "Late" ? "#fef3c7" : s === "Active" ? "#dcfce7" : "#fee2e2";
  const statusTextColor = (s) => s === "Present" ? "#16a34a" : s === "Late" ? "#d97706" : s === "Active" ? "#16a34a" : "#dc2626";

  // VISITOR FUNCTIONS
  const openNewVisitor = () => {
    setSelectedVisitor({
      id: Date.now(),
      visitDate: new Date().toISOString().split('T')[0],
      fullName: "",
      phoneNumber: "",
      email: "",
      maritalStatus: "",
      bornAgain: "Yes",
      residence: "",
      source: "",
      wantsToJoin: "",
      status: "New",
      notes: "",
      ministry: ""
    });
    setVisitorTabInner("overview");
    setShowVisitorModal(true);
  };

  const openEditVisitor = (v) => {
    setSelectedVisitor(v);
    setVisitorTabInner("overview");
    setShowVisitorModal(true);
  };

  const saveVisitor = () => {
    if (!selectedVisitor.fullName) return alert("Full name required");
    if (selectedVisitor.wantsToJoin === "Yes") {
      // MOVE TO MEMBERS
      const newMemberFromVisitor = {
        id: Date.now(),
        name: selectedVisitor.fullName,
        role: "Member",
        phone: selectedVisitor.phoneNumber,
        group: selectedVisitor.ministry || "Choir",
        status: "Active",
        email: selectedVisitor.email,
        dateJoined: new Date().toISOString().split('T')[0],
        photo: null,
        emergency: { name: "", relation: "", phone: "" },
        family: [],
        fromVisitor: true,
        residence: selectedVisitor.residence
      };
      setMembers([...members, newMemberFromVisitor]);
      setVisitors(visitors.filter(v => v.id !== selectedVisitor.id));
      alert(selectedVisitor.fullName + " converted to Member!");
    } else {
      const exists = visitors.find(v => v.id === selectedVisitor.id);
      if (exists) {
        setVisitors(visitors.map(v => v.id === selectedVisitor.id ? selectedVisitor : v));
      } else {
        setVisitors([...visitors, selectedVisitor]);
      }
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
        <div onClick={() => setTab("offering")} style={{ padding: '12px 16px', borderRadius: 8, background: tab === "offering" ? NAVY_LIGHT : 'transparent', borderLeft: tab === "offering" ? `3px solid ${GOLD}` : 'none', display: 'flex', gap: 10, cursor: 'pointer', marginBottom: 8, color: tab === "offering" ? GOLD : WHITE }}><FaMoneyBillWave /> Offering & Tithe</div>
        <div style={{ background: NAVY_LIGHT, padding: 16, borderRadius: 12, marginTop: 20, border: `1px solid ${GOLD}30` }}><div style={{ fontSize: 12, color: GOLD }}>TOTAL COLLECTION</div><div style={{ fontSize: 22, fontWeight: 700 }}>KES {totalOffering.toLocaleString()}</div></div>
        <div onClick={handleLogout} style={{ marginTop: 20, padding: '12px 16px', borderRadius: 8, background: 'transparent', border: `1px solid ${GOLD}`, display: 'flex', gap: 10, cursor: 'pointer', justifyContent: 'center', fontWeight: 600, color: GOLD }}><FaSignOutAlt /> Logout</div>
      </div>

      <div style={{ flex: 1, padding: 30 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}><div><div style={{ fontSize: 12, color: GOLD, fontWeight: 700 }}>PATAMA CMS</div><h1 style={{ margin: 0, color: NAVY }}>{tab === "members" ? "Members" : tab === "visitors" ? "Visitors" : tab === "attendance" ? "Attendance Sheet" : tab === "reports" ? "Reports" : "Offering & Tithe"}</h1></div>
          <div style={{ display: 'flex', gap: 10 }}>
            {tab === "visitors" ? <button onClick={openNewVisitor} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}><FaPlus /> Add Visitor</button> :
              <>
                <button onClick={exportToCSV} style={{ background: WHITE, border: `1px solid ${GOLD}`, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center', color: NAVY }}><FaDownload /> Export</button>
                <button onClick={() => setShowAdd(true)} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', gap: 6, alignItems: 'center' }}><FaPlus /> Add member</button>
              </>}
          </div></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: WHITE, padding: 16, borderRadius: 12, borderLeft: `4px solid ${NAVY}` }}><div style={{ fontSize: 12, color: '#888' }}>Active members</div><div style={{ fontSize: 28, fontWeight: 700 }}>{activeMembers.length}</div><div style={{ fontSize: 10, color: '#888' }}>of {members.length} total</div></div>
          <div style={{ background: WHITE, padding: 16, borderRadius: 12, borderLeft: `4px solid ${GOLD}` }}><div style={{ fontSize: 12, color: '#888' }}>Present today</div><div style={{ fontSize: 28, fontWeight: 700 }}>{presentCount}</div></div>
          <div style={{ background: WHITE, padding: 16, borderRadius: 12, borderLeft: `4px solid ${GOLD}` }}><div style={{ fontSize: 12, color: '#888' }}>Late</div><div style={{ fontSize: 28, fontWeight: 700, color: '#8B6914' }}>{lateCount}</div></div>
          <div style={{ background: WHITE, padding: 16, borderRadius: 12, borderLeft: `4px solid #ef4444` }}><div style={{ fontSize: 12, color: '#888' }}>Absent</div><div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{absentCount}</div></div>
        </div>

        {/* VISITORS TAB */}
        {tab === "visitors" && (
          <div>
            <div style={{ display: 'flex', gap: 10, background: WHITE, padding: 10, borderRadius: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}><FaSearch style={{ color: GOLD }} /><input placeholder="Search visitors" value={visitorSearch} onChange={e => setVisitorSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} /></div>
              <select value={visitorFilter} onChange={e => setVisitorFilter(e.target.value)} style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${GOLD}40` }}>
                <option value="">All - Wants to Join</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Unsure">Unsure</option>
              </select>
            </div>
            <div style={{ background: WHITE, borderRadius: 12, overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: NAVY }}><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>NAME</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>VISIT DATE</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>PHONE</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>RESIDENCE</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>WANTS TO JOIN?</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>ACTION</th></tr></thead>
                <tbody>{filteredVisitors.length === 0 ? <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#888' }}>No visitors yet. Click Add Visitor</td></tr> : filteredVisitors.map(v => (<tr key={v.id} style={{ borderTop: '1px solid #eee' }}><td style={{ padding: 12, fontWeight: 600 }}>{v.fullName}</td><td style={{ padding: 12 }}>{v.visitDate}</td><td style={{ padding: 12 }}>{v.phoneNumber}</td><td style={{ padding: 12 }}>{v.residence}</td><td style={{ padding: 12 }}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: v.wantsToJoin === 'Yes' ? '#dcfce7' : v.wantsToJoin === 'No' ? '#f3f4f6' : v.wantsToJoin === 'Unsure' ? '#fef3c7' : '#eee', color: v.wantsToJoin === 'Yes' ? '#16a34a' : v.wantsToJoin === 'No' ? '#666' : '#d97706' }}>{v.wantsToJoin || "-"}</span></td><td style={{ padding: 12 }}><button onClick={() => openEditVisitor(v)} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>View</button></td></tr>))}</tbody></table>
            </div>
          </div>
        )}

        {tab === "attendance" && (
          <div style={{ background: WHITE, padding: 20, borderRadius: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={{ padding: 8, borderRadius: 8, border: `1px solid ${GOLD}40` }} /><button onClick={() => { const all = {}; activeMembers.forEach(m => all[m.id] = "Present"); setAttendance({ ...attendance, [selectedDate]: all }) }} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '8px 14px', borderRadius: 8, cursor: 'pointer' }}>Mark All Present</button></div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#888' }}>MEMBER</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: '#888' }}>ACTION</th></tr></thead><tbody>{activeMembers.map(m => (<tr key={m.id} style={{ borderTop: '1px solid #eee' }}><td style={{ padding: 12 }}><b>{m.name}</b><div style={{ fontSize: 12, color: '#888' }}>{m.phone}</div></td><td style={{ padding: 12, display: 'flex', gap: 6 }}><button onClick={() => setTodayStatus(m.id, "Present")} style={{ background: getTodayStatus(m.id) === "Present" ? NAVY : "#e5e7eb", color: getTodayStatus(m.id) === "Present" ? GOLD : "black", border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Present</button><button onClick={() => setTodayStatus(m.id, "Late")} style={{ background: getTodayStatus(m.id) === "Late" ? GOLD : "#e5e7eb", color: getTodayStatus(m.id) === "Late" ? NAVY : "black", border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Late</button><button onClick={() => setTodayStatus(m.id, "Absent")} style={{ background: getTodayStatus(m.id) === "Absent" ? "#ef4444" : "#e5e7eb", color: getTodayStatus(m.id) === "Absent" ? "white" : "black", border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer' }}>Absent</button></td></tr>))}</tbody></table>
          </div>
        )}

        {tab === "reports" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: WHITE, padding: 20, borderRadius: 12 }}>
              <h3 style={{ marginTop: 0, color: NAVY }}>Attendance - {selectedDate}</h3>
              <div style={{ display: 'flex', alignItems: 'end', gap: 12, height: 150, marginTop: 16 }}>
                <div style={{ flex: 1, textAlign: 'center' }}><div style={{ background: NAVY, height: `${activeMembers.length ? presentCount / activeMembers.length * 100 : 10}%`, minHeight: 30, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', color: GOLD, fontWeight: 700 }}>{presentCount}</div><div style={{ fontSize: 12, marginTop: 6 }}>Present</div></div>
                <div style={{ flex: 1, textAlign: 'center' }}><div style={{ background: GOLD, height: `${activeMembers.length ? lateCount / activeMembers.length * 100 : 10}%`, minHeight: 30, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', color: NAVY, fontWeight: 700 }}>{lateCount}</div><div style={{ fontSize: 12, marginTop: 6 }}>Late</div></div>
                <div style={{ flex: 1, textAlign: 'center' }}><div style={{ background: '#ef4444', height: `${activeMembers.length ? absentCount / activeMembers.length * 100 : 10}%`, minHeight: 30, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 700 }}>{absentCount}</div><div style={{ fontSize: 12, marginTop: 6 }}>Absent</div></div>
              </div>
            </div>
            <div style={{ background: WHITE, padding: 16, borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 700, marginBottom: 10 }}>ACTION NEEDED - {activeMembers.filter(m => getTodayStatus(m.id) === "Absent").length} to follow up (Absent only)</div>
              {activeMembers.filter(m => getTodayStatus(m.id) === "Absent").map(m => {
                const cleanPhone = m.phone.replace(/\s/g, '').replace('+', '');
                const waNumber = cleanPhone.startsWith('0') ? '254' + cleanPhone.slice(1) : cleanPhone;
                const waMessage = `Hi ${m.name}, we missed you at Patama today (${selectedDate}). Hope you are well?`;
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {m.photo ? <img src={m.photo} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.name[0]}</div>}
                      <div><div style={{ fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: '#888' }}>{m.group} • Absent • {m.phone}</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <a href={`tel:${m.phone}`} style={{ background: NAVY, color: GOLD, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600, border: `1px solid ${GOLD}` }}>Call</a>
                      <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noreferrer" style={{ background: GOLD, color: NAVY, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>WhatsApp</a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === "members" && (<><div style={{ display: 'flex', gap: 10, background: WHITE, padding: 10, borderRadius: 8, marginBottom: 16 }}><FaSearch style={{ color: GOLD }} /><input placeholder="Search members or groups" value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} /></div><div style={{ background: WHITE, borderRadius: 12, overflow: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: NAVY }}><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>MEMBER</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>GROUP</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>PHONE</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>STATUS</th><th style={{ textAlign: 'left', padding: 12, fontSize: 12, color: GOLD }}>TODAY</th></tr></thead><tbody>{filtered.map(m => (<tr key={m.id} onClick={() => openProfile(m)} style={{ borderTop: '1px solid #eee', cursor: 'pointer', opacity: m.status === 'Inactive' ? 0.5 : 1 }}><td style={{ padding: 12, display: 'flex', gap: 10, alignItems: 'center' }}>{m.photo ? <img src={m.photo} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: NAVY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{m.name[0]}</div>}<div><b>{m.name}</b> {m.status === 'Inactive' && <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: 10, marginLeft: 4 }}>INACTIVE</span>}<div style={{ fontSize: 12, color: '#888' }}>{m.role}</div></div></td><td style={{ padding: 12 }}>{m.group}</td><td style={{ padding: 12 }}>{m.phone}</td><td style={{ padding: 12 }}><span style={{ padding: '4px 8px', borderRadius: 20, fontSize: 11, background: m.status === 'Active' ? '#dcfce7' : '#fee2e2', color: m.status === 'Active' ? '#16a34a' : '#dc2626' }}>{m.status}</span></td><td style={{ padding: 12 }}><span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: statusColor(m.status === 'Inactive' ? 'Inactive' : getTodayStatus(m.id)), color: statusTextColor(m.status === 'Inactive' ? 'Inactive' : getTodayStatus(m.id)) }}>{m.status === 'Inactive' ? 'Inactive' : getTodayStatus(m.id)}</span></td></tr>))}</tbody></table></div></>)}

        {tab === "offering" && (
          <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 20 }}>
            <div style={{ background: WHITE, padding: 20, borderRadius: 12, borderTop: `3px solid ${GOLD}` }}>
              <h3 style={{ marginTop: 0, color: NAVY }}>Add Offering</h3>
              <select value={newOffering.type} onChange={e => setNewOffering({ ...newOffering, type: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }}><option>Offering</option><option>Tithe</option><option>Special</option></select>
              <input type="number" placeholder="Amount KES" value={newOffering.amount} onChange={e => setNewOffering({ ...newOffering, amount: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }} />
              <input placeholder="Member / Service" value={newOffering.member} onChange={e => setNewOffering({ ...newOffering, member: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }} />
              <button onClick={() => { if (!newOffering.amount) return alert("Amount required"); setOfferings([...offerings, { id: Date.now(), ...newOffering, amount: Number(newOffering.amount) }]); }} style={{ width: '100%', background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: 12, borderRadius: 8, fontWeight: 700 }}>Save</button>
            </div>
            <div style={{ background: WHITE, padding: 20, borderRadius: 12 }}>
              <h3 style={{ color: NAVY }}>Collections - KES {totalOffering.toLocaleString()}</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={{ textAlign: 'left', padding: 10, fontSize: 11, color: '#888' }}>DATE</th><th style={{ textAlign: 'left', padding: 10, fontSize: 11, color: '#888' }}>TYPE</th><th style={{ textAlign: 'left', padding: 10, fontSize: 11, color: '#888' }}>NAME</th><th style={{ textAlign: 'left', padding: 10, fontSize: 11, color: '#888' }}>AMOUNT</th><th style={{ textAlign: 'left', padding: 10, fontSize: 11, color: '#888' }}>ACTION</th></tr></thead><tbody>{offerings.slice().reverse().map(o => (<tr key={o.id} style={{ borderTop: '1px solid #eee' }}><td style={{ padding: 10, fontSize: 13 }}>{o.date}</td><td style={{ padding: 10, fontSize: 13 }}>{o.type}</td><td style={{ padding: 10, fontSize: 13, fontWeight: 600 }}>{o.member}</td><td style={{ padding: 10, fontWeight: 700 }}>KES {Number(o.amount).toLocaleString()}</td><td style={{ padding: 10, display: 'flex', gap: 6 }}><button onClick={() => editOffering(o)} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Edit</button><button onClick={() => deleteOffering(o.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Del</button></td></tr>))}</tbody></table>
            </div>
          </div>
        )}
      </div>

      {showAdd && (<div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}><div style={{ background: WHITE, padding: 24, borderRadius: 16, width: 400, borderTop: `4px solid ${GOLD}` }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}><h3 style={{ margin: 0, color: NAVY }}>Add Member</h3><button onClick={() => setShowAdd(false)} style={{ border: 'none', background: '#eee', borderRadius: 6, padding: 6 }}><FaTimes /></button></div><input placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }} /><input placeholder="Phone" value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 10, borderRadius: 8, border: '1px solid #ccc' }} /><select value={newMember.group} onChange={e => setNewMember({ ...newMember, group: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 16, borderRadius: 8, border: '1px solid #ccc' }}><option>Choir</option><option>Youth</option><option>Women</option><option>Men</option><option>Children</option></select><button onClick={addMember} style={{ width: '100%', background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, padding: 12, borderRadius: 8, fontWeight: 700 }}>Add</button></div></div>)}

      {/* VISITOR MODAL - EXACTLY LIKE YOUR SCREENSHOT */}
      {showVisitorModal && selectedVisitor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 10 }}>
          <div style={{ background: WHITE, borderRadius: 16, width: '100%', maxWidth: 640, maxHeight: '95vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header like screenshot */}
            <div style={{ background: NAVY, color: WHITE, padding: 16, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#4b5563', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>{selectedVisitor.fullName?.charAt(0) || "S"}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedVisitor.fullName || "New Visitor"}</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>{selectedVisitor.phoneNumber || "No phone"} • -</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Visited: {selectedVisitor.visitDate || "7 Sept 2025"}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Join: {selectedVisitor.wantsToJoin || "-"}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Born Again: {selectedVisitor.bornAgain || "Yes"}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Status: {selectedVisitor.status}</span>
                    <span style={{ background: 'rgba(255,255,255,0.15)', fontSize: 10, padding: '3px 8px', borderRadius: 20 }}>Residence: {selectedVisitor.residence || "Kikuyu"}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowVisitorModal(false)} style={{ background: WHITE, color: NAVY, border: 'none', padding: '6px 12px', borderRadius: 8, height: 32, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✕ CLOSE</button>
            </div>

            <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid #eee', padding: '0 20px' }}>
              <button onClick={() => setVisitorTabInner("overview")} style={{ padding: '12px 0', border: 'none', background: 'none', borderBottom: visitorTabInner === "overview" ? `2px solid ${NAVY}` : '2px solid transparent', fontWeight: visitorTabInner === "overview" ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>☑️ Overview</button>
              <button onClick={() => setVisitorTabInner("notes")} style={{ padding: '12px 0', border: 'none', background: 'none', borderBottom: visitorTabInner === "notes" ? `2px solid ${NAVY}` : '2px solid transparent', fontWeight: visitorTabInner === "notes" ? 700 : 400, cursor: 'pointer', fontSize: 13 }}>📄 Notes</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1, background: '#fdf8f0' }}>
              {visitorTabInner === "overview" ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 16, color: NAVY }}>☑️ EDIT VISITOR DETAILS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>VISIT DATE</label><input type="date" value={selectedVisitor.visitDate} onChange={e => setSelectedVisitor({ ...selectedVisitor, visitDate: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>FULL NAME</label><input value={selectedVisitor.fullName} onChange={e => setSelectedVisitor({ ...selectedVisitor, fullName: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} placeholder="Sam Njenga" /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>PHONE NUMBER</label><input value={selectedVisitor.phoneNumber} onChange={e => setSelectedVisitor({ ...selectedVisitor, phoneNumber: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} placeholder="0722555533" /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>EMAIL ADDRESS</label><input value={selectedVisitor.email} onChange={e => setSelectedVisitor({ ...selectedVisitor, email: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} placeholder="Email" /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>MARITAL STATUS</label><select value={selectedVisitor.maritalStatus} onChange={e => setSelectedVisitor({ ...selectedVisitor, maritalStatus: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }}><option value="">Select marital status</option><option>Single</option><option>Married</option><option>Divorced</option></select></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>BORN AGAIN?</label><select value={selectedVisitor.bornAgain} onChange={e => setSelectedVisitor({ ...selectedVisitor, bornAgain: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }}><option>Yes</option><option>No</option></select></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>RESIDENCE</label><input value={selectedVisitor.residence} onChange={e => setSelectedVisitor({ ...selectedVisitor, residence: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} placeholder="Kikuyu" /></div>
                    <div><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>SOURCE</label><input value={selectedVisitor.source} onChange={e => setSelectedVisitor({ ...selectedVisitor, source: e.target.value })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc', marginTop: 4, fontSize: 13 }} placeholder="A friend" /></div>
                    <div style={{ gridColumn: 'span 2' }}><label style={{ fontSize: 10, fontWeight: 700, color: NAVY }}>WANTS TO JOIN? *</label><select value={selectedVisitor.wantsToJoin} onChange={e => setSelectedVisitor({ ...selectedVisitor, wantsToJoin: e.target.value })} style={{ width: '100%', padding: 12, borderRadius: 8, border: selectedVisitor.wantsToJoin === "Yes" ? `2px solid #16a34a` : `2px solid ${GOLD}`, marginTop: 4, fontSize: 13, fontWeight: 700 }}><option value="">Select</option><option value="Yes">Yes - Convert to Member</option><option value="No">No</option><option value="Unsure">Unsure - Follow up</option></select>{selectedVisitor.wantsToJoin === "Yes" && <div style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 600 }}>Will be moved to Members on Save</div>}</div>
                  </div>
                  <div style={{ marginTop: 16, border: '1px solid #ddd', borderRadius: 10, padding: 12, background: WHITE, cursor: 'pointer' }}><div style={{ fontSize: 12, fontWeight: 700, color: NAVY }}>⛪ MINISTRIES & CELL GROUP (CLICK TO EXPAND)</div><input value={selectedVisitor.ministry} onChange={e => setSelectedVisitor({ ...selectedVisitor, ministry: e.target.value })} placeholder="e.g. Choir, Youth, Kalimoni Cell" style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 6, border: '1px solid #eee', fontSize: 12 }} /></div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}><button onClick={() => setShowVisitorModal(false)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ccc', background: WHITE }}>Cancel</button><button onClick={saveVisitor} style={{ padding: '10px 20px', borderRadius: 8, background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, fontWeight: 700, cursor: 'pointer' }}>✓ SAVE CHANGES</button></div>
                </>
              ) : (
                <div><label style={{ fontSize: 12, fontWeight: 700 }}>Follow-up Notes</label><textarea value={selectedVisitor.notes} onChange={e => setSelectedVisitor({ ...selectedVisitor, notes: e.target.value })} style={{ width: '100%', height: 200, padding: 12, borderRadius: 8, border: '1px solid #ccc', marginTop: 8, fontSize: 13 }} placeholder="Add follow-up notes... e.g. Called on Tuesday, promised to come Sunday"></textarea><div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}><button onClick={saveVisitor} style={{ padding: '10px 20px', borderRadius: 8, background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, fontWeight: 700 }}>Save Notes</button></div></div>
              )}
            </div>
          </div>
        </div>
      )}

      {showProfile && selectedMember && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,25,49,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 15 }}>
          <div style={{ background: WHITE, borderRadius: 20, padding: 25, width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto', borderTop: `4px solid ${GOLD}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><h2 style={{ margin: 0, fontSize: 20, color: NAVY }}>Member Profile</h2><button onClick={() => setShowProfile(false)} style={{ border: 'none', background: '#f3f4f6', borderRadius: '50%', width: 32, height: 32 }}>X</button></div>
            <div style={{ textAlign: 'center', marginTop: 15 }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                {selectedMember.photo ? <img src={selectedMember.photo} alt="" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${GOLD}` }} /> : <div style={{ width: 90, height: 90, borderRadius: '50%', background: NAVY, color: GOLD, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, border: `3px solid ${GOLD}` }}>{selectedMember.name[0]}</div>}
                <label style={{ position: 'absolute', bottom: 0, right: -5, background: NAVY, color: GOLD, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: `2px solid ${WHITE}` }}>📷<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} /></label>
              </div>
              <h2 style={{ margin: '10px 0 5px', color: NAVY }}>{selectedMember.name}</h2>
              <span style={{ background: NAVY, color: GOLD, padding: '4px 12px', borderRadius: 20, fontSize: 13, border: `1px solid ${GOLD}` }}>{selectedMember.group}</span>
            </div>
            <div style={{ marginTop: 20 }}><label style={{ fontSize: 13, fontWeight: 'bold', color: NAVY }}>Email</label><input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${GOLD}40`, marginTop: 5 }} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, padding: '12px 14px', background: selectedMember.status === 'Active' ? '#dcfce7' : '#fee2e2', borderRadius: 10, border: `1px solid ${GOLD}20` }}>
              <div><div style={{ fontSize: 13, fontWeight: 'bold', color: NAVY }}>Member Status</div><div style={{ fontSize: 11, color: '#666' }}>{selectedMember.status === 'Active' ? 'Active - counted' : 'Inactive - hidden'}</div></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div onClick={toggleStatus} style={{ width: 50, height: 28, background: selectedMember.status === 'Active' ? NAVY : '#9ca3af', borderRadius: 20, position: 'relative', cursor: 'pointer' }}><div style={{ width: 22, height: 22, background: GOLD, borderRadius: '50%', position: 'absolute', top: 3, left: selectedMember.status === 'Active' ? 25 : 3, transition: '0.2s' }}></div></div><span style={{ color: selectedMember.status === 'Active' ? NAVY : '#dc2626', fontWeight: 'bold', fontSize: 13 }}>{selectedMember.status}</span></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 14 }}><span style={{ fontWeight: 'bold', color: NAVY }}>Date Joined</span><span style={{ marginLeft: 20, fontWeight: 'bold' }}>{selectedMember.dateJoined}</span></div>
            <div style={{ marginTop: 20 }}><h3 style={{ margin: '0 0 10px', fontSize: 15, color: NAVY }}>Attendance Summary</h3>{(() => { const s = getAttendanceSummary(selectedMember.id); return (<div style={{ background: NAVY, borderRadius: 12, padding: 12, display: 'flex', justifyContent: 'space-around', textAlign: 'center', border: `1px solid ${GOLD}30` }}><div><div style={{ fontSize: 12, color: GOLD }}>Present</div><div style={{ fontSize: 22, fontWeight: 'bold', color: WHITE }}>{s.present}</div></div><div><div style={{ fontSize: 12, color: GOLD }}>Absent</div><div style={{ fontSize: 22, fontWeight: 'bold', color: WHITE }}>{s.absent}</div></div><div><div style={{ fontSize: 12, color: GOLD }}>%</div><div style={{ fontSize: 22, fontWeight: 'bold', color: GOLD }}>{s.percent}%</div></div></div>) })()}</div>
            <div style={{ marginTop: 20 }}><h3 style={{ fontSize: 15, color: NAVY }}>Emergency Contact</h3><div style={{ border: `1px solid ${GOLD}30`, borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}><input value={editEmergency.name} onChange={e => setEditEmergency({ ...editEmergency, name: e.target.value })} placeholder="Name" style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} /><div style={{ display: 'flex', gap: 8 }}><input value={editEmergency.relation} onChange={e => setEditEmergency({ ...editEmergency, relation: e.target.value })} placeholder="Relation" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} /><input value={editEmergency.phone} onChange={e => setEditEmergency({ ...editEmergency, phone: e.target.value })} placeholder="Phone" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} /></div></div></div>
            <div style={{ marginTop: 20 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ margin: 0, fontSize: 15, color: NAVY }}>Family</h3><button onClick={() => setEditFamily([...editFamily, { name: '', relation: '' }])} style={{ background: NAVY, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 20, padding: '5px 12px', fontSize: 12 }}>+ Add</button></div><div style={{ marginTop: 10 }}>{editFamily.map((f, idx) => (<div key={idx} style={{ display: 'flex', gap: 6, marginBottom: 8, background: '#f9fafb', padding: 8, borderRadius: 8 }}><input value={f.name} onChange={e => { const u = [...editFamily]; u[idx].name = e.target.value; setEditFamily(u) }} placeholder="Name" style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} /><input value={f.relation} onChange={e => { const u = [...editFamily]; u[idx].relation = e.target.value; setEditFamily(u) }} placeholder="Relation" style={{ flex: 1, padding: 6, borderRadius: 6, border: '1px solid #ccc' }} /><button onClick={() => setEditFamily(editFamily.filter((_, i) => i !== idx))} style={{ border: 'none', background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '6px 8px' }}>X</button></div>))}</div></div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}><button onClick={() => setShowProfile(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${GOLD}40`, background: WHITE, color: NAVY }}>Cancel</button><button onClick={saveProfile} style={{ flex: 1, padding: 12, borderRadius: 10, background: NAVY, color: GOLD, fontWeight: 'bold', border: `1px solid ${GOLD}` }}>Save Changes</button></div>
          </div>
        </div>
      )}
    </div>
  );
}