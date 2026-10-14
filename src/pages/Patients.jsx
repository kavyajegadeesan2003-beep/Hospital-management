import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Users
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

const emptyForm = {
  name: "",
  age: "",
  gender: "Female",
  phone: "",
  department: "Cardiology",
  status: "Outpatient",
  date: "2026-10-14"
};

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "General Medicine"
];

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const { startLoading, stopLoading, notify } = useApp();

  const load = useCallback(async () => {
    startLoading();

    try {
      const data = await getRecords("patients");
      setPatients(data);
    } catch {
      notify("Could not load patient records.");
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, notify]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch = [
        patient.name,
        patient.id,
        patient.phone,
        patient.department
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(debouncedSearch)
      );

      const matchesFilter =
        filter === "All" || patient.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [patients, debouncedSearch, filter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditing(null);
    setForm({ ...emptyForm });
  };

  const openEdit = (patient) => {
    setEditing(patient);
    setForm({
      name: patient.name ?? "",
      age: String(patient.age ?? ""),
      gender: patient.gender ?? "Female",
      phone: patient.phone ?? "",
      department: patient.department ?? "Cardiology",
      status: patient.status ?? "Outpatient",
      date: patient.date ?? ""
    });
    setShowForm(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  async function submit(event) {
    event.preventDefault();

    const record = {
      ...form,
      id: editing?.id ?? `NEW-${Date.now()}`,
      age: Number(form.age)
    };

    setSaving(true);
    startLoading();

    try {
      await saveRecord("patients", record);
      await load();

      setShowForm(false);
      setEditing(null);
      setForm({ ...emptyForm });

      notify(
        editing
          ? "Patient details updated."
          : "Patient added successfully."
      );
    } catch {
      notify("Unable to save patient. Please try again.");
    } finally {
      setSaving(false);
      stopLoading();
    }
  }

  async function remove(patient) {
    if (!window.confirm(`Delete ${patient.name}'s record?`)) {
      return;
    }

    startLoading();

    try {
      await deleteRecord("patients", patient.id);
      await load();
      notify("Patient record deleted.");
    } catch {
      notify("Unable to delete patient.");
    } finally {
      stopLoading();
    }
  }

  const initials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="page-stack">
      <PageTitle
        eyebrow="CARE MANAGEMENT"
        title="Patient directory"
        description="Manage patient records and keep care details up to date."
        action={
          <button
            type="button"
            className="primary-button"
            onClick={openCreate}
          >
            <Plus size={17} />
            Add patient
          </button>
        }
      />

      <section className="stats-strip">
        <div>
          <span className="strip-icon blue">
            <Users size={19} />
          </span>
          <div>
            <strong>{patients.length}</strong>
            <span>Total patients</span>
          </div>
        </div>

        <div>
          <span className="strip-icon green">
            <span className="status-dot" />
          </span>
          <div>
            <strong>
              {
                patients.filter(
                  (patient) => patient.status === "Admitted"
                ).length
              }
            </strong>
            <span>Currently admitted</span>
          </div>
        </div>

        <div>
          <span className="strip-icon orange">
            <Search size={19} />
          </span>
          <div>
            <strong>{filtered.length}</strong>
            <span>Matching records</span>
          </div>
        </div>
      </section>

      <section className="panel directory-panel">
        <div className="panel-heading directory-heading">
          <div>
            <h3>
              All patients{" "}
              <span className="count-pill">{filtered.length}</span>
            </h3>
            <p>Search, filter and manage patient information</p>
          </div>

          <SearchFilter
            value={search}
            onSearch={setSearch}
            filter={filter}
            onFilter={setFilter}
            options={["Admitted", "Outpatient", "Discharged"]}
            placeholder="Search patients..."
          />
        </div>

        <div className="table-wrap">
          <table className="wide-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Patient ID</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <div className="person-cell">
                      <span className="person-avatar">
                        {initials(patient.name)}
                      </span>
                      <div>
                        <strong>{patient.name}</strong>
                        <small>
                          {patient.gender}, {patient.age} years
                        </small>
                      </div>
                    </div>
                  </td>

                  <td className="muted-cell">{patient.id}</td>
                  <td>{patient.department}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.date}</td>

                  <td>
                    <StatusBadge status={patient.status} />
                  </td>

                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="icon-button small"
                        title="View details"
                        aria-label={`View ${patient.name}`}
                        onClick={() => setViewing(patient)}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button small"
                        title="Edit patient"
                        aria-label={`Edit ${patient.name}`}
                        onClick={() => openEdit(patient)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="icon-button small danger-action"
                        title="Delete patient"
                        aria-label={`Delete ${patient.name}`}
                        onClick={() => remove(patient)}
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
              <Users size={28} />
              <strong>No matching patients</strong>
              <span>
                Try a different search or add a new patient.
              </span>
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <Modal
          title={editing ? "Edit patient" : "Add a patient"}
          onClose={closeForm}
        >
          <form className="record-form" onSubmit={submit}>
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="Enter patient's name"
              />
            </label>

            <div className="form-row">
              <label>
                Age
                <input
                  required
                  min="0"
                  max="120"
                  type="number"
                  value={form.age}
                  onChange={(event) =>
                    updateField("age", event.target.value)
                  }
                />
              </label>

              <label>
                Gender
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
                >
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <label>
              Phone number
              <input
                required
                value={form.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="+91 ..."
              />
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
                  <option>Outpatient</option>
                  <option>Admitted</option>
                  <option>Discharged</option>
                </select>
              </label>
            </div>

            <label>
              Registration date
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) =>
                  updateField("date", event.target.value)
                }
              />
            </label>

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
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save changes"
                    : "Add patient"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {viewing && (
        <Modal
          title="Patient details"
          onClose={() => setViewing(null)}
        >
          <div className="detail-profile">
            <span className="profile-avatar">
              {initials(viewing.name)}
            </span>
            <h3>{viewing.name}</h3>
            <span>{viewing.id}</span>
            <StatusBadge status={viewing.status} />
          </div>

          <div className="detail-grid">
            {[
              ["Age", `${viewing.age} years`],
              ["Gender", viewing.gender],
              ["Phone", viewing.phone],
              ["Department", viewing.department],
              ["Registration date", viewing.date]
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setViewing(null)}
            >
              Close
            </button>

            <button
              type="button"
              className="primary-button"
              onClick={() => {
                const patient = viewing;
                setViewing(null);
                openEdit(patient);
              }}
            >
              Edit patient
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}