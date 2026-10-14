import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
  CalendarCheck
} from "lucide-react";
import PageTitle from "../components/PageTitle";
import SearchFilter from "../components/SearchFilter";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import {
  deleteRecord,
  getRecords,
  saveRecord
} from "../services/hospitalService";
import { useApp } from "../context/AppContext";

const blank = {
  patient: "",
  doctor: "",
  department: "Cardiology",
  date: "2026-10-15",
  time: "09:00",
  status: "Pending"
};

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine"
];

const statuses = [
  "Confirmed",
  "Pending",
  "Completed",
  "Cancelled"
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ ...blank });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { startLoading, stopLoading, notify } = useApp();

  const load = useCallback(async () => {
    startLoading();

    try {
      const [appointmentData, patientData, doctorData] =
        await Promise.all([
          getRecords("appointments"),
          getRecords("patients"),
          getRecords("doctors")
        ]);

      setAppointments(appointmentData);
      setPatients(patientData);
      setDoctors(doctorData);
    } catch {
      notify("Could not load appointments.");
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesSearch = [
        item.id,
        item.patient,
        item.doctor,
        item.department,
        item.status,
        item.date,
        item.time
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchText)
      );

      const matchesFilter =
        filter === "All" || item.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, filter]);

  const openNewForm = () => {
    setEditing(null);
    setForm({ ...blank });
    setShowModal(true);
  };

  const closeForm = () => {
    setEditing(null);
    setForm({ ...blank });
    setShowModal(false);
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const edit = (item) => {
    setEditing(item);
    setForm({
      patient: item.patient ?? "",
      doctor: item.doctor ?? "",
      department: item.department ?? "Cardiology",
      date: item.date ?? "",
      time: item.time ?? "",
      status: item.status ?? "Pending"
    });
    setShowModal(true);
  };

  async function submit(event) {
    event.preventDefault();

    if (!form.patient || !form.doctor) {
      notify("Please select a patient and doctor.");
      return;
    }

    setSaving(true);

    try {
      const record = {
        ...form,
        ...(editing
          ? { id: editing.id }
          : { id: `NEW-${Date.now()}` })
      };

      await saveRecord("appointments", record);
      await load();

      closeForm();

      notify(
        editing
          ? "Appointment updated successfully."
          : "Appointment scheduled successfully."
      );
    } catch {
      notify("Unable to save appointment.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item) {
    if (!window.confirm(`Delete appointment ${item.id}?`)) {
      return;
    }

    startLoading();

    try {
      await deleteRecord("appointments", item.id);
      await load();
      notify("Appointment deleted successfully.");
    } catch {
      notify("Unable to delete appointment.");
    } finally {
      stopLoading();
    }
  }

  return (
    <div className="page-stack">
      <PageTitle
        eyebrow="SCHEDULING & CARE"
        title="Appointments"
        description="Coordinate visits and keep every care team in sync."
        action={
          <button
            type="button"
            className="primary-button"
            onClick={openNewForm}
          >
            <Plus size={17} />
            Schedule visit
          </button>
        }
      />

      <section className="stats-strip">
        <div>
          <span className="strip-icon blue">
            <CalendarDays size={19} />
          </span>
          <div>
            <strong>{appointments.length}</strong>
            <span>Total appointments</span>
          </div>
        </div>

        <div>
          <span className="strip-icon green">
            <CalendarCheck size={19} />
          </span>
          <div>
            <strong>
              {
                appointments.filter(
                  (item) => item.status === "Confirmed"
                ).length
              }
            </strong>
            <span>Confirmed visits</span>
          </div>
        </div>

        <div>
          <span className="strip-icon orange">
            <Clock3 size={19} />
          </span>
          <div>
            <strong>
              {
                appointments.filter(
                  (item) => item.status === "Pending"
                ).length
              }
            </strong>
            <span>Awaiting confirmation</span>
          </div>
        </div>
      </section>

      <section className="panel directory-panel">
        <div className="panel-heading directory-heading">
          <div>
            <h3>
              Appointment schedule{" "}
              <span className="count-pill">{filtered.length}</span>
            </h3>
            <p>Review and manage scheduled visits</p>
          </div>

          <SearchFilter
            value={search}
            onSearch={setSearch}
            filter={filter}
            onFilter={setFilter}
            options={statuses}
            placeholder="Search appointments..."
          />
        </div>

        <div className="table-wrap">
          <table className="wide-table">
            <thead>
              <tr>
                <th>Appointment</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Date &amp; time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="muted-cell">{item.id}</td>
                  <td>
                    <strong>{item.patient}</strong>
                  </td>
                  <td>{item.doctor}</td>
                  <td>{item.department}</td>

                  <td>
                    <div className="date-cell">
                      <strong>{item.date}</strong>
                      <span>{item.time}</span>
                    </div>
                  </td>

                  <td>
                    <StatusBadge status={item.status} />
                  </td>

                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="icon-button small"
                        title="Edit appointment"
                        aria-label={`Edit appointment ${item.id}`}
                        onClick={() => edit(item)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button small danger-action"
                        title="Delete appointment"
                        aria-label={`Delete appointment ${item.id}`}
                        onClick={() => remove(item)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="empty-state">
              No appointments match your search.
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <Modal
          title={
            editing
              ? "Edit appointment"
              : "Schedule an appointment"
          }
          onClose={closeForm}
        >
          <form className="record-form" onSubmit={submit}>
            <label>
              Patient
              <select
                required
                value={form.patient}
                onChange={(event) =>
                  updateField("patient", event.target.value)
                }
              >
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.name}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Doctor
              <select
                required
                value={form.doctor}
                onChange={(event) =>
                  updateField("doctor", event.target.value)
                }
              >
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="form-row">
              <label>
                Department
                <select
                  value={form.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                >
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-row">
              <label>
                Date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    updateField("date", event.target.value)
                  }
                />
              </label>

              <label>
                Time
                <input
                  required
                  type="time"
                  value={form.time}
                  onChange={(event) =>
                    updateField("time", event.target.value)
                  }
                />
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Schedule visit"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}