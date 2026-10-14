export const initialData = {
  patients: [
    { id: "P-501", name: "Anu", age: 34, gender: "Male", phone: "+91 98765 43210", department: "Cardiology", status: "Admitted", date: "2026-10-12" },
    { id: "P-502", name: "Diya", age: 27, gender: "Female", phone: "+91 98765 43211", department: "Neurology", status: "Outpatient", date: "2026-10-13" },
    { id: "P-503", name: "Priya", age: 52, gender: "Male", phone: "+91 98765 43212", department: "Orthopedics", status: "Discharged", date: "2026-10-11" },
    { id: "P-504", name: "Meera", age: 41, gender: "Female", phone: "+91 98765 43213", department: "Pediatrics", status: "Admitted", date: "2026-10-14" },
    { id: "P-505", name: "Kabir", age: 19, gender: "Male", phone: "+91 98765 43214", department: "Dermatology", status: "Outpatient", date: "2026-10-14" }
  ],
  doctors: [
    { id: "D-101", name: "Dr. Ananya", specialty: "Cardiology", availability: "Available", experience: 12, patients: 24 },
    { id: "D-102", name: "Dr. Rohan", specialty: "Neurology", availability: "In consultation", experience: 9, patients: 18 },
    { id: "D-103", name: "Dr. Madhu", specialty: "Pediatrics", availability: "Available", experience: 7, patients: 31 },
    { id: "D-104", name: "Dr. Manisha", specialty: "Orthopedics", availability: "On leave", experience: 15, patients: 16 }
  ],
  appointments: [
    { id: "A-201", patient: "Diya", doctor: "Dr. Rohan ", department: "Neurology", date: "2026-10-15", time: "09:30", status: "Confirmed" },
    { id: "A-202", patient: "Anu", doctor: "Dr. Ananya", department: "Cardiology", date: "2026-10-15", time: "10:15", status: "Confirmed" },
    { id: "A-203", patient: "Meera", doctor: "Dr. Madhu", department: "Pediatrics", date: "2026-10-16", time: "11:00", status: "Pending" }
  ]
};
