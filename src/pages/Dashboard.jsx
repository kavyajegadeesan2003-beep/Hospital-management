import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, CalendarCheck, ClipboardList, Clock3, Plus, Stethoscope, Users, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { getRecords } from "../services/hospitalService";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const { startLoading, stopLoading } = useApp();

  useEffect(() => {
    let active = true;
    startLoading();
    Promise.all([getRecords("patients"), getRecords("doctors"), getRecords("appointments")])
      .then(([p, d, a]) => {
        if (active) { setPatients(p); setDoctors(d); setAppointments(a); }
      })
      .catch(() => {})
      .finally(stopLoading);
    return () => { active = false; };
  }, [startLoading, stopLoading]);

  const admitted = patients.filter((patient) => patient.status === "Admitted").length;
  const confirmed = appointments.filter((appointment) => appointment.status === "Confirmed").length;

  return (
    <div className="page-stack">
      <PageTitle eyebrow="WEDNESDAY, OCTOBER 14, 2026" title="Good morning, Admin 👋" description="Here’s what’s happening across your hospital today." action={<Link className="primary-button" to="/appointments"><Plus size={17} /> New appointment</Link>} />
      <section className="welcome-banner"><div className="welcome-copy"><span className="banner-tag"><Activity size={14} /> CAREPOINT DAILY BRIEFING</span><h2>Every detail matters.<br /><em>Every patient matters.</em></h2><p>Your care teams are ready. Here’s your hospital at a glance.</p><Link to="/patients" className="banner-link">View patient directory <ArrowRight size={16} /></Link></div><div className="banner-art"><div className="art-circle circle-one" /><div className="art-circle circle-two" /><div className="art-cross">+</div><div className="art-card"><HeartIcon /><span>Patient care</span><strong>Always in focus</strong></div></div></section>
      <div className="section-heading"><div><h2>Hospital overview</h2><p>Live snapshot of your operations</p></div><span className="updated-label"><i /> Updated just now</span></div>
      <section className="stats-grid">
        <StatCard title="Total patients" value={patients.length} note="Registered in system" icon={Users} tone="blue" />
        <StatCard title="Currently admitted" value={admitted} note="Receiving inpatient care" icon={Activity} tone="purple" />
        <StatCard title="Medical team" value={doctors.length} note="Doctors on directory" icon={Stethoscope} tone="green" />
        <StatCard title="Appointments" value={appointments.length} note={`${confirmed} confirmed`} icon={CalendarCheck} tone="orange" />
      </section>
      <section className="dashboard-grid">
        <div className="panel recent-panel"><div className="panel-heading"><div><h3>Recent patients</h3><p>Latest updates from patient records</p></div><Link to="/patients" className="text-link">View all <ArrowRight size={15} /></Link></div>
          <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Patient ID</th><th>Department</th><th>Status</th></tr></thead><tbody>{patients.slice(0, 4).map((patient) => <tr key={patient.id}><td><div className="person-cell"><span className="person-avatar">{patient.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span><div><strong>{patient.name}</strong><small>{patient.gender}, {patient.age}</small></div></div></td><td className="muted-cell">{patient.id}</td><td>{patient.department}</td><td><StatusBadge status={patient.status} /></td></tr>)}</tbody></table>{patients.length === 0 && <div className="empty-state">No patients yet. Add your first patient.</div>}</div>
        </div>
        <div className="panel schedule-panel"><div className="panel-heading"><div><h3>Upcoming appointments</h3><p>Your next scheduled visits</p></div><Link to="/appointments" className="text-link">View all <ArrowRight size={15} /></Link></div>
          <div className="appointment-list">{appointments.slice(0, 4).map((appointment) => <div className="appointment-item" key={appointment.id}><div className="appointment-date"><strong>{new Date(`${appointment.date}T00:00:00`).toLocaleDateString("en", { day: "2-digit" })}</strong><span>{new Date(`${appointment.date}T00:00:00`).toLocaleDateString("en", { month: "short" })}</span></div><div className="appointment-info"><strong>{appointment.patient}</strong><span>{appointment.doctor}</span><small><Clock3 size={13} /> {appointment.time} · {appointment.department}</small></div><StatusBadge status={appointment.status} /></div>)}</div>
          <Link to="/appointments" className="schedule-link">Manage schedule <ArrowRight size={15} /></Link>
        </div>
      </section>
      <section className="bottom-note"><div className="note-icon"><ClipboardList size={19} /></div><div><strong>Small steps make a healthier tomorrow.</strong><p>Keep patient information current and appointments up to date for smoother care.</p></div><Link to="/patients">Manage records <ArrowRight size={15} /></Link></section>
    </div>
  );
}

function HeartIcon() {
  return <div className="mini-heart"><Activity size={22} /></div>;
}
