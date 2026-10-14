
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Stethoscope,
  Clock3,
  Users,
  BriefcaseMedical,
  Pencil,
  X,
  Plus
} from "lucide-react";

import PageTitle from "../components/PageTitle";
import SearchFilter from "../components/SearchFilter";
import StatusBadge from "../components/StatusBadge";
import { getRecords } from "../services/hospitalService";
import { useApp } from "../context/AppContext";
import api from "../services/api";

const colors = [
  "doctor-blue",
  "doctor-purple",
  "doctor-green",
  "doctor-orange"
];

const emptyDoctor = {
  name: "",
  specialty: "",
  experience: "",
  patients: "0",
  availability: "Available"
};

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ ...emptyDoctor });
  const [saving, setSaving] = useState(false);

  const { startLoading, stopLoading, notify } = useApp();

  useEffect(() => {
    startLoading();

    getRecords("doctors")
      .then(setDoctors)
      .catch(() => notify("Could not load doctor directory."))
      .finally(stopLoading);
  }, [startLoading, stopLoading, notify]);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSearch = [
        doctor.name,
        doctor.specialty,
        doctor.availability,
        doctor.id
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(searchText)
      );

      const matchesFilter =
        filter === "All" || doctor.availability === filter;

      return matchesSearch && matchesFilter;
    });
  }, [doctors, search, filter]);

  const handleAddDoctor = async (event) => {
    event.preventDefault();

    if (!newDoctor.name.trim() || !newDoctor.specialty.trim()) {
      notify("Doctor name and specialty are required.");
      return;
    }

    setSaving(true);

    try {
      const doctorData = {
        ...newDoctor,
        name: newDoctor.name.trim(),
        specialty: newDoctor.specialty.trim(),
        experience: Number(newDoctor.experience),
        patients: Number(newDoctor.patients)
      };

      const response = await api.post("/doctors", doctorData);

      setDoctors((currentDoctors) => [
        ...currentDoctors,
        response.data
      ]);

      setNewDoctor({ ...emptyDoctor });
      setShowAddForm(false);

      notify("Doctor added successfully.");
    } catch (error) {
      console.error("Add doctor error:", error);
      notify("Could not add doctor. Check whether JSON Server is running.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor({ ...doctor });
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!editingDoctor.name.trim()) {
      notify("Doctor name is required.");
      return;
    }

    setSaving(true);

    try {
      const updatedDoctor = {
        ...editingDoctor,
        name: editingDoctor.name.trim()
      };

      await api.patch(`/doctors/${editingDoctor.id}`, {
        name: updatedDoctor.name
      });

      setDoctors((currentDoctors) =>
        currentDoctors.map((doctor) =>
          String(doctor.id) === String(updatedDoctor.id)
            ? updatedDoctor
            : doctor
        )
      );

      setEditingDoctor(null);
      notify("Doctor name updated successfully.");
    } catch (error) {
      console.error("Update doctor error:", error);
      notify("Could not update doctor. Check JSON Server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-stack">
      <PageTitle
        eyebrow="OUR MEDICAL TEAM"
        title="Doctors & specialists"
        description="Meet your care team and check their current availability."
      />

      {/* Statistics */}
      <section className="stats-strip">
        <div>
          <span className="strip-icon blue">
            <Stethoscope size={19} />
          </span>
          <div>
            <strong>{doctors.length}</strong>
            <span>Total doctors</span>
          </div>
        </div>

        <div>
          <span className="strip-icon green">
            <Clock3 size={19} />
          </span>
          <div>
            <strong>
              {doctors.filter(
                (doctor) => doctor.availability === "Available"
              ).length}
            </strong>
            <span>Available now</span>
          </div>
        </div>

        <div>
          <span className="strip-icon purple">
            <Users size={19} />
          </span>
          <div>
            <strong>
              {doctors.reduce(
                (total, doctor) =>
                  total + Number(doctor.patients || 0),
                0
              )}
            </strong>
            <span>Patients supported</span>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="panel doctors-toolbar">
        <div>
          <h3>Medical directory</h3>
          <p>Browse the specialists in your hospital</p>
        </div>

        <div className="doctors-toolbar-actions">
          <SearchFilter
            value={search}
            onSearch={setSearch}
            filter={filter}
            onFilter={setFilter}
            options={["Available", "In consultation", "On leave"]}
            placeholder="Search doctors..."
          />

          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setEditingDoctor(null);
              setShowAddForm(true);
            }}
          >
            <Plus size={17} />
            Add Doctor
          </button>
        </div>
      </div>

      {/* Add Doctor Form */}
      {showAddForm && (
        <div className="modal-overlay">
          <section
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-doctor-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">MEDICAL DIRECTORY</span>
                <h2 id="add-doctor-title">Add New Doctor</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                aria-label="Close form"
                onClick={() => setShowAddForm(false)}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoctor}>
              <div className="form-group">
                <label htmlFor="new-doctor-name">Doctor name</label>
                <input
                  id="new-doctor-name"
                  className="form-control"
                  value={newDoctor.name}
                  onChange={(event) =>
                    setNewDoctor({
                      ...newDoctor,
                      name: event.target.value
                    })
                  }
                  placeholder="Dr. John Smith"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-doctor-specialty">Specialty</label>
                <input
                  id="new-doctor-specialty"
                  className="form-control"
                  value={newDoctor.specialty}
                  onChange={(event) =>
                    setNewDoctor({
                      ...newDoctor,
                      specialty: event.target.value
                    })
                  }
                  placeholder="Cardiologist"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-doctor-experience">
                  Experience (years)
                </label>
                <input
                  id="new-doctor-experience"
                  className="form-control"
                  type="number"
                  min="0"
                  value={newDoctor.experience}
                  onChange={(event) =>
                    setNewDoctor({
                      ...newDoctor,
                      experience: event.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-doctor-patients">
                  Patients supported
                </label>
                <input
                  id="new-doctor-patients"
                  className="form-control"
                  type="number"
                  min="0"
                  value={newDoctor.patients}
                  onChange={(event) =>
                    setNewDoctor({
                      ...newDoctor,
                      patients: event.target.value
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="new-doctor-availability">
                  Availability
                </label>
                <select
                  id="new-doctor-availability"
                  className="form-control"
                  value={newDoctor.availability}
                  onChange={(event) =>
                    setNewDoctor({
                      ...newDoctor,
                      availability: event.target.value
                    })
                  }
                >
                  <option>Available</option>
                  <option>In consultation</option>
                  <option>On leave</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowAddForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Doctor"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Doctors Grid */}
      <section className="doctors-grid">
        {filtered.map((doctor, index) => (
          <article className="doctor-card" key={doctor.id}>
            <div className="doctor-card-top">
              <div className={`doctor-avatar ${colors[index % colors.length]}`}>
                {String(doctor.name || "")
                  .replace(/^Dr\.?\s*/i, "")
                  .split(" ")
                  .filter(Boolean)
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <button
                type="button"
                className="icon-button small"
                aria-label={`Edit ${doctor.name}`}
                title="Edit doctor"
                onClick={() => handleEdit(doctor)}
              >
                <Pencil size={15} />
              </button>
            </div>

            <span className="doctor-specialty">{doctor.specialty}</span>
            <h3>{doctor.name}</h3>
            <span className="doctor-id">{doctor.id}</span>

            <div className="doctor-divider" />

            <div className="doctor-meta">
              <span>
                <BriefcaseMedical size={15} />
                {doctor.experience ?? 0} years experience
              </span>
              <span>
                <Users size={15} />
                {doctor.patients ?? 0} patients
              </span>
            </div>

            <div className="doctor-card-bottom">
              <StatusBadge status={doctor.availability} />
              <span className="verified-mark">✓ Verified</span>
            </div>
          </article>
        ))}
      </section>

      {filtered.length === 0 && (
        <div className="panel empty-state">
          <Search size={26} />
          <strong>No doctors found</strong>
          <span>Try changing your search or filter.</span>
        </div>
      )}

      {/* Edit Doctor Form */}
      {editingDoctor && (
        <div className="modal-overlay">
          <section
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-doctor-title"
          >
            <div className="modal-heading">
              <div>
                <span className="eyebrow">MEDICAL DIRECTORY</span>
                <h2 id="edit-doctor-title">Edit doctor details</h2>
              </div>

              <button
                type="button"
                className="icon-button"
                aria-label="Close form"
                onClick={() => setEditingDoctor(null)}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="doctor-name">Doctor name</label>
                <input
                  id="doctor-name"
                  className="form-control"
                  type="text"
                  value={editingDoctor.name || ""}
                  onChange={(event) =>
                    setEditingDoctor({
                      ...editingDoctor,
                      name: event.target.value
                    })
                  }
                  placeholder="Enter doctor name"
                  required
                  autoFocus
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setEditingDoctor(null)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
