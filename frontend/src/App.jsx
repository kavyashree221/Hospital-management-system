import { useState } from "react";
import "./App.css";

// =====================================================
// DEFAULT DATA
// =====================================================

const defaultDoctors = [
  {
    id: "D001",
    name: "Dr. Arun Kumar",
    department: "Cardiology",
    phone: "9876543210",
  },
  {
    id: "D002",
    name: "Dr. Priya Sharma",
    department: "General Medicine",
    phone: "9876543211",
  },
  {
    id: "D003",
    name: "Dr. Rahul Raj",
    department: "Orthopedics",
    phone: "9876543212",
  },
];

const defaultPatients = [
  {
    id: "P001",
    name: "Kavya Shree",
    age: "20",
    gender: "Female",
    doctor: "Dr. Arun Kumar",
    phone: "9876543213",
  },
  {
    id: "P002",
    name: "Anitha Kumar",
    age: "35",
    gender: "Female",
    doctor: "Dr. Priya Sharma",
    phone: "9876543214",
  },
  {
    id: "P003",
    name: "Ramesh Kumar",
    age: "45",
    gender: "Male",
    doctor: "Dr. Rahul Raj",
    phone: "9876543215",
  },
];

const defaultAppointments = [
  {
    id: "A001",
    patient: "Kavya Shree",
    doctor: "Dr. Arun Kumar",
    date: "18 Nov 2026",
    time: "10:00 AM",
    reason: "Regular Checkup",
    status: "Confirmed",
  },
  {
    id: "A002",
    patient: "Anitha Kumar",
    doctor: "Dr. Priya Sharma",
    date: "18 Nov 2026",
    time: "11:30 AM",
    reason: "General Consultation",
    status: "Pending",
  },
];

const defaultAdmissions = [
  {
    id: "AD001",
    patient: "Kavya Shree",
    ward: "General Ward",
    admissionDate: "18 Nov 2026",
    dischargeDate: "Not discharged",
    status: "Admitted",
  },
  {
    id: "AD002",
    patient: "Anitha Kumar",
    ward: "Cardiology Ward",
    admissionDate: "17 Nov 2026",
    dischargeDate: "20 Nov 2026",
    status: "Under Treatment",
  },
];

const createEmptyRegistration = () => ({
  name: "",
  email: "",
  age: "",
  gender: "Female",
  doctor: defaultDoctors[0]?.name || "",
  phone: "",
  password: "",
  confirmPassword: "",
});

const bytesToHex = (bytes) =>
  Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

const hexToBytes = (hex) =>
  new Uint8Array(
    hex.match(/.{2}/g).map((byte) => parseInt(byte, 16))
  );

const hashPassword = async (password, existingSalt) => {
  const salt = existingSalt
    ? hexToBytes(existingSalt)
    : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    256
  );

  return {
    salt: bytesToHex(salt),
    passwordHash: bytesToHex(new Uint8Array(hash)),
  };
};

// =====================================================
// BOOK APPOINTMENT MODAL
// IMPORTANT: THIS IS OUTSIDE APP()
// =====================================================

function BookAppointmentModal({
  showBookAppointment,
  role,
  newAppointment,
  setNewAppointment,
  doctors,
  closeBookAppointment,
  bookAppointment,
}) {
  if (!showBookAppointment || role !== "Patient") {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="edit-modal">

        <div className="modal-header">
          <div>
            <h2>Book Appointment</h2>
            <p>Schedule your hospital appointment.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={closeBookAppointment}
          >
            ×
          </button>
        </div>

        <div className="modal-form">

          {/* PATIENT NAME */}
          <label>Patient Name</label>

          <input
            type="text"
            placeholder="Enter patient name"
            value={newAppointment.patient}
            required
            onChange={(e) => {
              setNewAppointment((prev) => ({
                ...prev,
                patient: e.target.value,
              }));
            }}
          />

          {/* DOCTOR */}
          <label>Select Doctor</label>

          <select
            value={newAppointment.doctor}
            required
            onChange={(e) => {
              setNewAppointment((prev) => ({
                ...prev,
                doctor: e.target.value,
              }));
            }}
          >
            <option value="">Select Doctor</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>

          {/* DATE */}
          <label>Select Date</label>

          <input
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            required
            value={newAppointment.date}
            onChange={(e) => {
              setNewAppointment((prev) => ({
                ...prev,
                date: e.target.value,
              }));
            }}
          />

          {/* TIME */}
          <label>Select Time</label>

          <input
            type="time"
            required
            value={newAppointment.time}
            onChange={(e) => {
              setNewAppointment((prev) => ({
                ...prev,
                time: e.target.value,
              }));
            }}
          />

          {/* REASON */}
          <label>Reason for Visit</label>

          <textarea
            rows="4"
            placeholder="Enter reason for visit"
            required
            value={newAppointment.reason}
            onChange={(e) => {
              setNewAppointment((prev) => ({
                ...prev,
                reason: e.target.value,
              }));
            }}
          />

        </div>

        <div className="modal-buttons">

          <button
            type="button"
            className="cancel-button"
            onClick={closeBookAppointment}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={bookAppointment}
          >
            📅 Book Appointment
          </button>

        </div>

      </div>
    </div>
  );
}

// =====================================================
// ADD PATIENT MODAL
// OUTSIDE APP()
// =====================================================

function AddPatientModal({
  showAddPatient,
  role,
  newPatient,
  setNewPatient,
  doctors,
  closeAddPatient,
  addPatient,
}) {
  if (!showAddPatient || role !== "Admin") {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="edit-modal">

        <div className="modal-header">
          <div>
            <h2>Add New Patient</h2>
            <p>Enter the patient's information.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={closeAddPatient}
          >
            ×
          </button>
        </div>

        <div className="modal-form">

          <label>Patient ID</label>

          <input
            value={newPatient.id}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                id: e.target.value,
              }))
            }
          />

          <label>Patient Name</label>

          <input
            type="text"
            placeholder="Enter patient name"
            value={newPatient.name}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <label>Age</label>

          <input
            type="number"
            placeholder="Enter age"
            value={newPatient.age}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                age: e.target.value,
              }))
            }
          />

          <label>Gender</label>

          <select
            value={newPatient.gender}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                gender: e.target.value,
              }))
            }
          >
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>

          <label>Doctor</label>

          <select
            value={newPatient.doctor}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                doctor: e.target.value,
              }))
            }
          >
            <option value="">Select Doctor</option>

            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </select>

          <label>Phone Number</label>

          <input
            type="text"
            placeholder="Enter phone number"
            value={newPatient.phone}
            onChange={(e) =>
              setNewPatient((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />

        </div>

        <div className="modal-buttons">

          <button
            type="button"
            className="cancel-button"
            onClick={closeAddPatient}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={addPatient}
          >
            💾 Save Patient
          </button>

        </div>

      </div>
    </div>
  );
}

function AddDoctorModal({
  showAddDoctor,
  role,
  newDoctor,
  setNewDoctor,
  closeAddDoctor,
  addDoctor,
}) {
  if (!showAddDoctor || role !== "Admin") {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="edit-modal">
        <div className="modal-header">
          <div>
            <h2>Add New Doctor</h2>
            <p>Enter the doctor's information.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={closeAddDoctor}
          >
            ×
          </button>
        </div>

        <div className="modal-form">
          <label>Doctor ID</label>
          <input value={newDoctor.id} disabled />

          <label>Doctor Name</label>
          <input
            type="text"
            placeholder="Enter doctor name"
            value={newDoctor.name}
            onChange={(e) =>
              setNewDoctor((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <label>Department</label>
          <input
            type="text"
            placeholder="Enter department"
            value={newDoctor.department}
            onChange={(e) =>
              setNewDoctor((prev) => ({
                ...prev,
                department: e.target.value,
              }))
            }
          />

          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={newDoctor.phone}
            onChange={(e) =>
              setNewDoctor((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />
        </div>

        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={closeAddDoctor}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={addDoctor}
          >
            Save Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

function AddAdmissionModal({
  showAddAdmission,
  role,
  newAdmission,
  setNewAdmission,
  patients,
  closeAddAdmission,
  addAdmission,
}) {
  if (!showAddAdmission || role !== "Admin") {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="edit-modal">
        <div className="modal-header">
          <div>
            <h2>Add Admission</h2>
            <p>Enter the patient's admission details.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={closeAddAdmission}
          >
            ×
          </button>
        </div>

        <div className="modal-form">
          <label>Admission ID</label>
          <input value={newAdmission.id} disabled />

          <label>Patient</label>
          <select
            value={newAdmission.patient}
            onChange={(e) =>
              setNewAdmission((prev) => ({
                ...prev,
                patient: e.target.value,
              }))
            }
          >
            <option value="">Select Patient</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.name}>
                {patient.name} ({patient.id})
              </option>
            ))}
          </select>

          <label>Ward</label>
          <input
            type="text"
            placeholder="Enter ward"
            value={newAdmission.ward}
            onChange={(e) =>
              setNewAdmission((prev) => ({
                ...prev,
                ward: e.target.value,
              }))
            }
          />

          <label>Admission Date</label>
          <input
            type="date"
            value={newAdmission.admissionDate}
            onChange={(e) =>
              setNewAdmission((prev) => ({
                ...prev,
                admissionDate: e.target.value,
              }))
            }
          />

          <label>Discharge Date</label>
          <input
            type="date"
            value={newAdmission.dischargeDate}
            onChange={(e) =>
              setNewAdmission((prev) => ({
                ...prev,
                dischargeDate: e.target.value,
              }))
            }
          />

          <label>Status</label>
          <select
            value={newAdmission.status}
            onChange={(e) =>
              setNewAdmission((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option>Admitted</option>
            <option>Under Treatment</option>
            <option>Discharged</option>
          </select>
        </div>

        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-button"
            onClick={closeAddAdmission}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={addAdmission}
          >
            Save Admission
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// EDIT MODAL
// OUTSIDE APP()
// =====================================================

function EditModal({
  editType,
  editData,
  setEditData,
  doctors,
  closeEdit,
  saveEdit,
}) {
  if (!editData) {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="edit-modal">

        <div className="modal-header">
          <div>
            <h2>Edit {editType}</h2>
            <p>Only Admin can change this information.</p>
          </div>

          <button
            type="button"
            className="close-button"
            onClick={closeEdit}
          >
            ×
          </button>
        </div>

        {/* DOCTOR EDIT */}
        {editType === "doctor" && (
          <div className="modal-form">

            <label>Doctor ID</label>
            <input value={editData.id} disabled />

            <label>Doctor Name</label>
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <label>Department</label>
            <input
              value={editData.department}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  department: e.target.value,
                }))
              }
            />

            <label>Phone Number</label>
            <input
              value={editData.phone}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />

          </div>
        )}

        {/* PATIENT EDIT */}
        {editType === "patient" && (
          <div className="modal-form">

            <label>Patient ID</label>
            <input value={editData.id} disabled />

            <label>Patient Name</label>
            <input
              value={editData.name}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <label>Age</label>
            <input
              type="number"
              value={editData.age}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  age: e.target.value,
                }))
              }
            />

            <label>Gender</label>
            <select
              value={editData.gender}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  gender: e.target.value,
                }))
              }
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>

            <label>Doctor</label>
            <select
              value={editData.doctor}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  doctor: e.target.value,
                }))
              }
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.name}>
                  {doctor.name}
                </option>
              ))}
            </select>

            <label>Phone Number</label>
            <input
              value={editData.phone}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />

          </div>
        )}

        {/* APPOINTMENT EDIT */}
        {editType === "appointment" && (
          <div className="modal-form">

            <label>Appointment ID</label>
            <input value={editData.id} disabled />

            <label>Patient</label>
            <input
              value={editData.patient}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  patient: e.target.value,
                }))
              }
            />

            <label>Doctor</label>
            <input
              value={editData.doctor}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  doctor: e.target.value,
                }))
              }
            />

            <label>Date</label>
            <input
              value={editData.date}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  date: e.target.value,
                }))
              }
            />

            <label>Time</label>
            <input
              value={editData.time}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  time: e.target.value,
                }))
              }
            />

            <label>Reason</label>
            <input
              value={editData.reason}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  reason: e.target.value,
                }))
              }
            />

            <label>Status</label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
            </select>

          </div>
        )}

        {/* ADMISSION EDIT */}
        {editType === "admission" && (
          <div className="modal-form">

            <label>Admission ID</label>
            <input value={editData.id} disabled />

            <label>Patient</label>
            <input
              value={editData.patient}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  patient: e.target.value,
                }))
              }
            />

            <label>Ward</label>
            <input
              value={editData.ward || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  ward: e.target.value,
                }))
              }
            />

            <label>Admission Date</label>
            <input
              type="date"
              value={editData.admissionDate || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  admissionDate: e.target.value,
                }))
              }
            />

            <label>Discharge Date</label>
            <input
              type="date"
              value={editData.dischargeDate || ""}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  dischargeDate: e.target.value,
                }))
              }
            />

            <label>Status</label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option>Admitted</option>
              <option>Under Treatment</option>
              <option>Discharged</option>
            </select>

          </div>
        )}

        <div className="modal-buttons">

          <button
            type="button"
            className="cancel-button"
            onClick={closeEdit}
          >
            Cancel
          </button>

          <button
            type="button"
            className="save-button"
            onClick={saveEdit}
          >
            💾 Save Changes
          </button>

        </div>

      </div>
    </div>
  );
}

// =====================================================
// MAIN APP
// =====================================================

function App() {

  const [role, setRole] = useState("Patient");
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem("cityCareAccounts");
    return saved ? JSON.parse(saved) : [];
  });
  const [activePatientId, setActivePatientId] = useState(null);
  const [registration, setRegistration] = useState(
    createEmptyRegistration
  );

  // ===================================================
  // DATA
  // ===================================================

  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("cityCareDoctors");
    return saved ? JSON.parse(saved) : defaultDoctors;
  });

  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("cityCarePatients");
    return saved ? JSON.parse(saved) : defaultPatients;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("cityCareAppointments");
    return saved ? JSON.parse(saved) : defaultAppointments;
  });

  const [admissions, setAdmissions] = useState(() => {
    const saved = localStorage.getItem("cityCareAdmissions");
    return saved ? JSON.parse(saved) : defaultAdmissions;
  });

  // ===================================================
  // MODAL STATES
  // ===================================================

  const [editType, setEditType] = useState("");
  const [editData, setEditData] = useState(null);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const [showBookAppointment, setShowBookAppointment] =
    useState(false);

  const [newDoctor, setNewDoctor] = useState({
    id: "",
    name: "",
    department: "",
    phone: "",
  });

  const [newAdmission, setNewAdmission] = useState({
    id: "",
    patient: "",
    ward: "",
    admissionDate: "",
    dischargeDate: "",
    status: "Admitted",
  });

  const [newPatient, setNewPatient] = useState({
    id: "",
    name: "",
    age: "",
    gender: "Female",
    doctor: "",
    phone: "",
  });

  // IMPORTANT: patient is included here
  const [newAppointment, setNewAppointment] = useState({
    patient: "Kavya Shree",
    doctor: "",
    date: "",
    time: "",
    reason: "",
  });

  // ===================================================
  // SAVE FUNCTIONS
  // ===================================================

  const saveDoctors = (data) => {
    setDoctors(data);
    localStorage.setItem(
      "cityCareDoctors",
      JSON.stringify(data)
    );
  };

  const savePatients = (data) => {
    setPatients(data);
    localStorage.setItem(
      "cityCarePatients",
      JSON.stringify(data)
    );
  };

  const saveAppointments = (data) => {
    setAppointments(data);
    localStorage.setItem(
      "cityCareAppointments",
      JSON.stringify(data)
    );
  };

  const saveAdmissions = (data) => {
    setAdmissions(data);
    localStorage.setItem(
      "cityCareAdmissions",
      JSON.stringify(data)
    );
  };

  // ===================================================
  // LOGIN
  // ===================================================

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const demoAccounts = {
      Admin: ["admin@citycare.com", "admin123"],
      Doctor: ["doctor@citycare.com", "doctor123"],
      Patient: ["patient@citycare.com", "patient123"],
    };
    const [demoEmail, demoPassword] = demoAccounts[role];

    if (
      normalizedEmail === demoEmail &&
      password === demoPassword
    ) {
      setActivePatientId(role === "Patient" ? "P001" : null);
      setLoggedIn(true);
      setActivePage("Dashboard");
      return;
    }

    if (role === "Patient") {
      const account = registeredAccounts.find(
        (item) => item.email === normalizedEmail
      );

      if (account) {
        const { passwordHash } = await hashPassword(
          password,
          account.salt
        );

        if (passwordHash === account.passwordHash) {
          setActivePatientId(account.patientId);
          setLoggedIn(true);
          setActivePage("Dashboard");
          return;
        }
      }
    }

    alert("Invalid email or password.");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const name = registration.name.trim();
    const normalizedEmail = registration.email.trim().toLowerCase();
    const age = Number(registration.age);
    const phone = registration.phone.trim();
    const demoEmails = [
      "admin@citycare.com",
      "doctor@citycare.com",
      "patient@citycare.com",
    ];

    if (
      !name ||
      !/^\S+@\S+\.\S+$/.test(normalizedEmail) ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120 ||
      !registration.doctor ||
      !/^\d{10}$/.test(phone) ||
      registration.password.length < 8
    ) {
      alert(
        "Enter valid details, a 10-digit phone number, and a password with at least 8 characters."
      );
      return;
    }

    if (
      registration.password !== registration.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    if (
      demoEmails.includes(normalizedEmail) ||
      registeredAccounts.some(
        (account) => account.email === normalizedEmail
      )
    ) {
      alert("An account with this email already exists.");
      return;
    }

    if (!window.crypto?.subtle) {
      alert("Secure registration requires opening the app on localhost or HTTPS.");
      return;
    }

    const patientNumber =
      patients.reduce((highest, patient) => {
        const number = Number(patient.id.replace(/\D/g, ""));
        return Number.isFinite(number)
          ? Math.max(highest, number)
          : highest;
      }, 0) + 1;
    const patientId = `P${String(patientNumber).padStart(3, "0")}`;
    const { salt, passwordHash } = await hashPassword(
      registration.password
    );
    const newAccount = {
      email: normalizedEmail,
      patientId,
      salt,
      passwordHash,
    };
    const newPatientRecord = {
      id: patientId,
      name,
      age: String(age),
      gender: registration.gender,
      doctor: registration.doctor,
      phone,
      email: normalizedEmail,
    };
    const updatedAccounts = [
      ...registeredAccounts,
      newAccount,
    ];

    setRegisteredAccounts(updatedAccounts);
    localStorage.setItem(
      "cityCareAccounts",
      JSON.stringify(updatedAccounts)
    );
    savePatients([...patients, newPatientRecord]);
    setRole("Patient");
    setActivePatientId(patientId);
    setEmail(normalizedEmail);
    setPassword("");
    setRegistration(createEmptyRegistration());
    setIsRegistering(false);
    setLoggedIn(true);
    setActivePage("Dashboard");
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setActivePatientId(null);
    setIsRegistering(false);
    setActivePage("Dashboard");
  };

  // ===================================================
  // MENU
  // ===================================================

  const getMenu = () => {

    if (role === "Admin") {
      return [
        "Dashboard",
        "Doctors",
        "Patients",
        "Appointments",
        "Patient Information",
        "Admissions",
      ];
    }

    if (role === "Doctor") {
      return [
        "Dashboard",
        "My Appointments",
        "Patients",
        "Patient Information",
      ];
    }

    return [
      "Dashboard",
      "My Appointments",
      "Book Appointment",
      "My Information",
      "My Admission",
    ];
  };

  // ===================================================
  // EDIT
  // ===================================================

  const openEdit = (type, data) => {

    if (role !== "Admin") {
      alert("Only Admin can edit information.");
      return;
    }

    setEditType(type);
    setEditData({ ...data });
  };

  const closeEdit = () => {
    setEditType("");
    setEditData(null);
  };

  const saveEdit = () => {

    if (role !== "Admin" || !editData) {
      return;
    }

    if (editType === "doctor") {
      saveDoctors(
        doctors.map((doctor) =>
          doctor.id === editData.id
            ? editData
            : doctor
        )
      );
    }

    if (editType === "patient") {
      savePatients(
        patients.map((patient) =>
          patient.id === editData.id
            ? editData
            : patient
        )
      );
    }

    if (editType === "appointment") {
      saveAppointments(
        appointments.map((appointment) =>
          appointment.id === editData.id
            ? editData
            : appointment
        )
      );
    }

    if (editType === "admission") {
      saveAdmissions(
        admissions.map((admission) =>
          admission.id === editData.id
            ? editData
            : admission
        )
      );
    }

    closeEdit();

    alert("Information updated successfully!");
  };

  // ===================================================
  // DELETE
  // ===================================================

  const deletePatient = (id) => {

    if (role !== "Admin") {
      return;
    }

    if (!window.confirm("Delete this patient?")) {
      return;
    }

    savePatients(
      patients.filter(
        (patient) => patient.id !== id
      )
    );
  };

  const deleteDoctor = (id) => {

    if (role !== "Admin") {
      return;
    }

    if (!window.confirm("Delete this doctor?")) {
      return;
    }

    saveDoctors(
      doctors.filter(
        (doctor) => doctor.id !== id
      )
    );
  };

  const openAddDoctor = () => {
    if (role !== "Admin") {
      return;
    }

    const highestDoctorNumber = doctors.reduce((highest, doctor) => {
      const match = /^D(\d+)$/i.exec(doctor.id);
      return match
        ? Math.max(highest, Number(match[1]))
        : highest;
    }, 0);

    setNewDoctor({
      id: `D${String(highestDoctorNumber + 1).padStart(3, "0")}`,
      name: "",
      department: "",
      phone: "",
    });
    setShowAddDoctor(true);
  };

  const closeAddDoctor = () => {
    setShowAddDoctor(false);
  };

  const addDoctor = () => {
    if (role !== "Admin") {
      return;
    }

    const name = newDoctor.name.trim();
    const department = newDoctor.department.trim();
    const phone = newDoctor.phone.trim();

    if (!name || !department || !phone) {
      alert("Please fill all doctor details.");
      return;
    }

    if (doctors.some((doctor) => doctor.id === newDoctor.id)) {
      alert("Doctor ID already exists. Please close and reopen the form.");
      return;
    }

    saveDoctors([
      ...doctors,
      { ...newDoctor, name, department, phone },
    ]);
    setShowAddDoctor(false);
    setNewDoctor({
      id: "",
      name: "",
      department: "",
      phone: "",
    });
    alert("Doctor added successfully!");
  };

  const deleteAppointment = (id) => {

    if (role !== "Admin") {
      return;
    }

    if (!window.confirm("Delete this appointment?")) {
      return;
    }

    saveAppointments(
      appointments.filter(
        (appointment) => appointment.id !== id
      )
    );
  };

  const deleteAdmission = (id) => {
    if (role !== "Admin") {
      return;
    }

    if (!window.confirm("Delete this admission record?")) {
      return;
    }

    saveAdmissions(
      admissions.filter((admission) => admission.id !== id)
    );
  };

  const openAddAdmission = () => {
    if (role !== "Admin") {
      return;
    }

    const highestAdmissionNumber = admissions.reduce((highest, admission) => {
      const match = /^AD(\d+)$/i.exec(admission.id);
      return match
        ? Math.max(highest, Number(match[1]))
        : highest;
    }, 0);

    setNewAdmission({
      id: `AD${String(highestAdmissionNumber + 1).padStart(3, "0")}`,
      patient: "",
      ward: "",
      admissionDate: "",
      dischargeDate: "",
      status: "Admitted",
    });
    setShowAddAdmission(true);
  };

  const closeAddAdmission = () => {
    setShowAddAdmission(false);
  };

  const addAdmission = () => {
    if (role !== "Admin") {
      return;
    }

    const patient = newAdmission.patient.trim();
    const ward = newAdmission.ward.trim();

    if (!patient || !ward || !newAdmission.admissionDate) {
      alert("Please enter the patient, ward, and admission date.");
      return;
    }

    if (
      newAdmission.dischargeDate &&
      newAdmission.dischargeDate < newAdmission.admissionDate
    ) {
      alert("Discharge date cannot be before the admission date.");
      return;
    }

    if (
      newAdmission.status === "Discharged" &&
      !newAdmission.dischargeDate
    ) {
      alert("Please enter a discharge date for a discharged patient.");
      return;
    }

    if (admissions.some((admission) => admission.id === newAdmission.id)) {
      alert("Admission ID already exists. Please close and reopen the form.");
      return;
    }

    saveAdmissions([
      ...admissions,
      {
        ...newAdmission,
        patient,
        ward,
        dischargeDate: newAdmission.dischargeDate || "Not discharged",
      },
    ]);
    setShowAddAdmission(false);
    setNewAdmission({
      id: "",
      patient: "",
      ward: "",
      admissionDate: "",
      dischargeDate: "",
      status: "Admitted",
    });
    alert("Admission added successfully!");
  };

  // ===================================================
  // ADD PATIENT
  // ===================================================

  const openAddPatient = () => {

    if (role !== "Admin") {
      return;
    }

    setNewPatient({
      id: `P${String(
        patients.length + 1
      ).padStart(3, "0")}`,
      name: "",
      age: "",
      gender: "Female",
      doctor: doctors[0]?.name || "",
      phone: "",
    });

    setShowAddPatient(true);
  };

  const closeAddPatient = () => {
    setShowAddPatient(false);
  };

  const addPatient = () => {

    if (role !== "Admin") {
      return;
    }

    if (
      !newPatient.name ||
      !newPatient.age ||
      !newPatient.doctor ||
      !newPatient.phone
    ) {
      alert("Please fill all patient details.");
      return;
    }

    if (
      patients.some(
        (patient) =>
          patient.id === newPatient.id
      )
    ) {
      alert("Patient ID already exists.");
      return;
    }

    savePatients([
      ...patients,
      newPatient,
    ]);

    setShowAddPatient(false);

    setNewPatient({
      id: "",
      name: "",
      age: "",
      gender: "Female",
      doctor: "",
      phone: "",
    });

    alert("Patient added successfully!");
  };

  // ===================================================
  // BOOK APPOINTMENT
  // ===================================================

  const currentPatient =
    patients.find(
      (patient) =>
        patient.id === (activePatientId || "P001")
    ) || null;

  const openBookAppointment = () => {

    if (role !== "Patient") {
      alert("Only Patients can book appointments.");
      return;
    }

    setNewAppointment({
      patient:
        currentPatient?.name ||
        "Kavya Shree",
      doctor:
        currentPatient?.doctor ||
        doctors[0]?.name ||
        "",
      date: "",
      time: "",
      reason: "",
    });

    setShowBookAppointment(true);
  };

  const closeBookAppointment = () => {
    setShowBookAppointment(false);
  };

  const bookAppointment = () => {

    if (role !== "Patient") {
      return;
    }

    if (!newAppointment.patient.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!newAppointment.doctor) {
      alert("Please select a doctor.");
      return;
    }

    if (!newAppointment.date) {
      alert("Please select appointment date.");
      return;
    }

    if (!newAppointment.time) {
      alert("Please select appointment time.");
      return;
    }

    if (!newAppointment.reason.trim()) {
      alert("Please enter reason for visit.");
      return;
    }

    const newId = `A${String(
      appointments.length + 1
    ).padStart(3, "0")}`;

    const appointment = {
      id: newId,
      patientId: activePatientId || "P001",
      patient: newAppointment.patient.trim(),
      doctor: newAppointment.doctor,
      date: newAppointment.date,
      time: newAppointment.time,
      reason: newAppointment.reason.trim(),
      status: "Pending",
    };

    saveAppointments([
      ...appointments,
      appointment,
    ]);

    setShowBookAppointment(false);

    setNewAppointment({
      patient:
        currentPatient?.name ||
        "Kavya Shree",
      doctor: "",
      date: "",
      time: "",
      reason: "",
    });

    alert("Appointment booked successfully!");

    setActivePage("My Appointments");
  };

  // ===================================================
  // DASHBOARD
  // ===================================================

  const Dashboard = () => (
    <>
      <div className="page-heading">
        <h1>Welcome back, {role}</h1>
        <p>
          Here is what's happening at City Care Hospital today.
        </p>
      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <div className="card-icon">👨‍⚕️</div>
          <p>Doctors</p>
          <h2>{doctors.length}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">👥</div>
          <p>Patients</p>
          <h2>{patients.length}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">📅</div>
          <p>Appointments</p>
          <h2>{appointments.length}</h2>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">🛏️</div>
          <p>Admissions</p>
          <h2>{admissions.length}</h2>
        </div>

      </div>

      <div className="content-box">

        <div className="box-header">
          <h2>Appointments</h2>

          {role === "Patient" && (
            <button
              className="primary-button"
              onClick={openBookAppointment}
            >
              + Book Appointment
            </button>
          )}
        </div>

        <AppointmentTable />

      </div>
    </>
  );

  // ===================================================
  // DOCTORS
  // ===================================================

  const Doctors = () => (
    <>
      <div className="page-heading">
        <h1>Doctors</h1>
        <p>View hospital doctors.</p>
      </div>

      <div className="content-box">

        <div className="box-header">
          <h2>Doctor List</h2>
          {role === "Admin" && (
            <button
              className="primary-button"
              onClick={openAddDoctor}
            >
              + Add Doctor
            </button>
          )}
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Doctor ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Phone</th>

                {role === "Admin" && (
                  <th>Action</th>
                )}
              </tr>
            </thead>

            <tbody>

              {doctors.map((doctor) => (
                <tr key={doctor.id}>

                  <td>{doctor.id}</td>
                  <td>{doctor.name}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.phone}</td>

                  {role === "Admin" && (
                    <td className="action-buttons">

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEdit(
                            "doctor",
                            doctor
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteDoctor(
                            doctor.id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </td>
                  )}

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );

  // ===================================================
  // PATIENTS
  // ===================================================

  const Patients = () => (
    <>
      <div className="page-heading">
        <h1>Patients</h1>

        <p>
          {role === "Admin"
            ? "Manage all patient records."
            : "View patient records."}
        </p>
      </div>

      <div className="content-box">

        <div className="box-header">

          <h2>Patient List</h2>

          {role === "Admin" && (
            <button
              className="primary-button"
              onClick={openAddPatient}
            >
              + Add Patient
            </button>
          )}

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Doctor</th>
                <th>Phone</th>

                {role === "Admin" && (
                  <th>Action</th>
                )}
              </tr>
            </thead>

            <tbody>

              {patients.map((patient) => (
                <tr key={patient.id}>

                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.phone}</td>

                  {role === "Admin" && (
                    <td className="action-buttons">

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEdit(
                            "patient",
                            patient
                          )
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deletePatient(
                            patient.id
                          )
                        }
                      >
                        🗑️
                      </button>

                    </td>
                  )}

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );

  // ===================================================
  // APPOINTMENT TABLE
  // ===================================================

  const AppointmentTable = ({ showAll = false }) => {

    const visibleAppointments =
      role === "Patient" && !showAll
        ? appointments.filter(
            (appointment) =>
              appointment.patientId
                ? appointment.patientId ===
                  (activePatientId || "P001")
                : appointment.patient ===
                  (currentPatient?.name || "Kavya Shree")
          )
        : appointments;

    return (
      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>

              {role === "Admin" && (
                <th>Action</th>
              )}
            </tr>
          </thead>

          <tbody>

            {visibleAppointments.length === 0 ? (

              <tr>

                <td
                  colSpan={
                    role === "Admin"
                      ? 8
                      : 7
                  }
                  style={{
                    textAlign: "center",
                  }}
                >
                  No appointments found.
                </td>

              </tr>

            ) : (

              visibleAppointments.map(
                (appointment) => (

                  <tr key={appointment.id}>

                    <td>{appointment.id}</td>
                    <td>{appointment.patient}</td>
                    <td>{appointment.doctor}</td>
                    <td>{appointment.date}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.reason}</td>

                    <td>
                      <span
                        className={
                          appointment.status ===
                          "Confirmed"
                            ? "status confirmed"
                            : "status pending"
                        }
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {role === "Admin" && (
                      <td className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEdit(
                              "appointment",
                              appointment
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteAppointment(
                              appointment.id
                            )
                          }
                        >
                          🗑️
                        </button>

                      </td>
                    )}

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>
    );
  };

  // ===================================================
  // APPOINTMENTS PAGE
  // ===================================================

  const Appointments = () => (
    <>
      <div className="page-heading">

        <h1>
          {role === "Patient"
            ? "My Appointments"
            : "Appointments"}
        </h1>

        <p>
          Manage hospital appointments.
        </p>

      </div>

      <div className="content-box">

        <div className="box-header">

          <h2>Appointment List</h2>

          {role === "Patient" && (
            <button
              className="primary-button"
              onClick={openBookAppointment}
            >
              + Book Appointment
            </button>
          )}

        </div>

        <AppointmentTable />

      </div>
    </>
  );

  // ===================================================
  // BOOK APPOINTMENT PAGE
  // ===================================================

  const BookAppointment = () => (
    <>
      <div className="page-heading">
        <h1>Book Appointment</h1>
        <p>
          Schedule an appointment with a doctor.
        </p>
      </div>

      <div className="content-box">

        <div className="box-header">
          <h2>Appointment Booking</h2>
        </div>

        <div className="booking-area">

          <div className="booking-icon">
            📅
          </div>

          <h2>Book Your Appointment</h2>

          <p>
            Choose your doctor, date and preferred time.
          </p>

          <button
            className="primary-button booking-button"
            onClick={openBookAppointment}
          >
            Book Appointment
          </button>

        </div>

      </div>

      <div className="content-box">

        <div className="box-header">
          <h2>
            Total Booked Appointments ({appointments.length})
          </h2>
        </div>

        <AppointmentTable showAll />

      </div>
    </>
  );

  // ===================================================
  // PATIENT INFORMATION
  // ===================================================

  const PatientInformation = () => {
    const visiblePatients =
      role === "Patient"
        ? patients.filter(
            (patient) =>
              patient.id === (activePatientId || "P001")
          )
        : patients;

    if (visiblePatients.length === 0) {
      return (
        <h2>
          No patient information available.
        </h2>
      );
    }

    return (
      <>
        <div className="page-heading">

          <h1>
            {role === "Patient"
              ? "My Information"
              : "Patient Information"}
          </h1>

          <p>
            {role === "Patient"
              ? "View your personal information."
              : "View personal information for all patients."}
          </p>

        </div>

        <div className="patient-information-list">
          {visiblePatients.map((patient) => (
            <div className="content-box patient-information-card" key={patient.id}>
              <div className="box-header">
                <h2>Patient Details</h2>

                {role === "Admin" && (
                  <button
                    className="edit-button"
                    onClick={() =>
                      openEdit(
                        "patient",
                        patient
                      )
                    }
                  >
                    ✏️ Edit Information
                  </button>
                )}
              </div>

              <div className="patient-profile">
                <div className="profile-avatar">
                  {patient.name.charAt(0)}
                </div>

                <div>
                  <h2>{patient.name}</h2>
                  <p>Patient ID: {patient.id}</p>
                </div>
              </div>

              <div className="information-grid">
                <div>
                  <span>Age</span>
                  <strong>{patient.age}</strong>
                </div>

                <div>
                  <span>Gender</span>
                  <strong>{patient.gender}</strong>
                </div>

                <div>
                  <span>Doctor</span>
                  <strong>{patient.doctor}</strong>
                </div>

                <div>
                  <span>Phone</span>
                  <strong>{patient.phone}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // ===================================================
  // ADMISSIONS
  // ===================================================

  const Admissions = () => {
    const visibleAdmissions = admissions;

    return (
      <>
      <div className="page-heading">

        <h1>Admissions</h1>

        <p>
          Hospital admission, ward, discharge, and patient status information.
        </p>

      </div>

      <div className="content-box">

        <div className="box-header">
          <h2>Admission Records</h2>
          {role === "Admin" && (
            <button
              className="primary-button"
              onClick={openAddAdmission}
            >
              + Add Admission
            </button>
          )}
        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Admission ID</th>
                <th>Patient</th>
                <th>Ward</th>
                <th>Admission Date</th>
                <th>Discharge Date</th>
                <th>Status</th>

                {role === "Admin" && (
                  <th>Action</th>
                )}
              </tr>

            </thead>

            <tbody>

              {visibleAdmissions.map(
                (admission) => (

                  <tr key={admission.id}>

                    <td>{admission.id}</td>
                    <td>{admission.patient}</td>
                    <td>{admission.ward || admission.room || "-"}</td>
                    <td>{admission.admissionDate || admission.date || "-"}</td>
                    <td>{admission.dischargeDate || "Not discharged"}</td>

                    <td>
                      <span className="status confirmed">
                        {admission.status}
                      </span>
                    </td>

                    {role === "Admin" && (
                      <td className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEdit(
                              "admission",
                              admission
                            )
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteAdmission(admission.id)}
                        >
                          🗑️
                        </button>

                      </td>
                    )}

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>
      </>
    );
  };

  // ===================================================
  // SHOW PAGE
  // ===================================================

  const showPage = () => {

    switch (activePage) {

      case "Doctors":
        return <Doctors />;

      case "Patients":
        return <Patients />;

      case "Appointments":
      case "My Appointments":
        return <Appointments />;

      case "Book Appointment":
        return <BookAppointment />;

      case "Patient Information":
      case "My Information":
        return <PatientInformation />;

      case "Admissions":
      case "My Admission":
        return <Admissions />;

      default:
        return <Dashboard />;
    }
  };

  // ===================================================
  // LOGIN PAGE
  // ===================================================

  if (!loggedIn) {

    return (
      <div className="login-page">

        <div className={isRegistering ? "login-card login-card-register" : "login-card"}>

          <div className="login-brand">
            <div className="hospital-symbol" aria-hidden="true">
              <svg viewBox="0 0 100 90" role="presentation">
                <path d="M50 82C38 70 9 50 9 29 9 14 20 5 34 5c8 0 13 4 17 11C55 9 60 5 68 5c14 0 23 10 23 24 0 21-27 42-41 53Z" />
                <path className="hospital-symbol-cross" d="M44 22h13v15h15v13H57v15H44V50H29V37h15z" />
              </svg>
            </div>

            <h1>City Care Hospital</h1>

            <p className="login-subtitle">
              Your Health, Our Priority
            </p>
          </div>

          <div className="login-divider" aria-hidden="true">
            <svg viewBox="0 0 220 30">
              <path d="M0 15h83l8-1 6-7 7 17 8-25 8 20 6-9 5 5h89" />
            </svg>
          </div>

          <h2 className="login-heading">
            {isRegistering ? "Create Patient Account" : "Login"}
          </h2>

          {isRegistering ? (
            <form className="register-form" onSubmit={handleRegister}>
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                required
                value={registration.name}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />

              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={registration.email}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
              />

              <div className="register-grid">
                <div>
                  <label htmlFor="register-age">Age</label>
                  <input
                    id="register-age"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    required
                    value={registration.age}
                    onChange={(event) =>
                      setRegistration((previous) => ({
                        ...previous,
                        age: event.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label htmlFor="register-gender">Gender</label>
                  <select
                    id="register-gender"
                    required
                    value={registration.gender}
                    onChange={(event) =>
                      setRegistration((previous) => ({
                        ...previous,
                        gender: event.target.value,
                      }))
                    }
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <label htmlFor="register-phone">Phone number</label>
              <input
                id="register-phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit phone number"
                required
                value={registration.phone}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    phone: event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 10),
                  }))
                }
              />

              <label htmlFor="register-doctor">Preferred doctor</label>
              <select
                id="register-doctor"
                required
                value={registration.doctor}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    doctor: event.target.value,
                  }))
                }
              >
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>

              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="At least 8 characters"
                required
                value={registration.password}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    password: event.target.value,
                  }))
                }
              />

              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                placeholder="Re-enter your password"
                required
                value={registration.confirmPassword}
                onChange={(event) =>
                  setRegistration((previous) => ({
                    ...previous,
                    confirmPassword: event.target.value,
                  }))
                }
              />

              <p className="register-note">
                Your account is saved in this browser on this device.
              </p>

              <button type="submit" className="login-button">
                Register
              </button>
            </form>
          ) : (
            <>
              <div className="login-role-buttons" aria-label="Choose account type">
                <button
                  type="button"
                  aria-pressed={role === "Patient"}
                  className={role === "Patient" ? "role-active" : ""}
                  onClick={() => setRole("Patient")}
                >
                  Patient
                </button>

                <button
                  type="button"
                  aria-pressed={role === "Doctor"}
                  className={role === "Doctor" ? "role-active" : ""}
                  onClick={() => setRole("Doctor")}
                >
                  Doctor
                </button>

                <button
                  type="button"
                  aria-pressed={role === "Admin"}
                  className={role === "Admin" ? "role-active" : ""}
                  onClick={() => setRole("Admin")}
                >
                  Admin
                </button>
              </div>

              <form
                className="login-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleLogin();
                }}
              >
                <label className="sr-only" htmlFor="login-email">
                  Email address
                </label>

                <div className="login-field">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 5h18v14H3z" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="Email Address"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>

                <label className="sr-only" htmlFor="login-password">
                  Password
                </label>

                <div className="login-field">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="5" y="10" width="14" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
                  </svg>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                  />
                </div>

                <button type="submit" className="login-button">
                  Login
                </button>
              </form>

              <details className="demo-box">
                <summary>Show demo login accounts</summary>
                <p>Admin: admin@citycare.com / admin123</p>
                <p>Doctor: doctor@citycare.com / doctor123</p>
                <p>Patient: patient@citycare.com / patient123</p>
              </details>
            </>
          )}

          <p className="login-footer">
            {isRegistering ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-button"
                  onClick={() => setIsRegistering(false)}
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="auth-switch-button"
                  onClick={() => {
                    setRole("Patient");
                    setIsRegistering(true);
                  }}
                >
                  Register here
                </button>
              </>
            )}
          </p>

        </div>

      </div>
    );
  }

  // ===================================================
  // MAIN APP
  // ===================================================

  return (
    <div className="app">

      <header className="topbar">

        <div className="hospital-name">

          <div className="small-symbol">
            +
          </div>

          <span>
            City Care Hospital
          </span>

        </div>

        <div className="top-right">

          <span className="logged-user">
            Logged in as: <b>{role}</b>
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      <div className="main-layout">

        <aside className="sidebar">

          <div className="menu-title">
            MAIN MENU
          </div>

          {getMenu().map((item) => (

            <button
              key={item}
              className={
                activePage === item
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setActivePage(item)
              }
            >
              {item}
            </button>

          ))}

        </aside>

        <main className="main-content">

          {showPage()}

        </main>

      </div>

      {/* MODALS */}

      <EditModal
        editType={editType}
        editData={editData}
        setEditData={setEditData}
        doctors={doctors}
        closeEdit={closeEdit}
        saveEdit={saveEdit}
      />

      <AddPatientModal
        showAddPatient={showAddPatient}
        role={role}
        newPatient={newPatient}
        setNewPatient={setNewPatient}
        doctors={doctors}
        closeAddPatient={closeAddPatient}
        addPatient={addPatient}
      />

      <AddDoctorModal
        showAddDoctor={showAddDoctor}
        role={role}
        newDoctor={newDoctor}
        setNewDoctor={setNewDoctor}
        closeAddDoctor={closeAddDoctor}
        addDoctor={addDoctor}
      />

      <AddAdmissionModal
        showAddAdmission={showAddAdmission}
        role={role}
        newAdmission={newAdmission}
        setNewAdmission={setNewAdmission}
        patients={patients}
        closeAddAdmission={closeAddAdmission}
        addAdmission={addAdmission}
      />

      <BookAppointmentModal
        showBookAppointment={showBookAppointment}
        role={role}
        newAppointment={newAppointment}
        setNewAppointment={setNewAppointment}
        doctors={doctors}
        closeBookAppointment={closeBookAppointment}
        bookAppointment={bookAppointment}
      />

    </div>
  );
}

export default App;