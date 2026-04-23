import { useEffect, useMemo, useState } from "react";
import { attendanceClient, trainingClient, userClient } from "../api/client";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import TopBar from "../components/TopBar";
import { useAuth } from "../context/AuthContext";

const emptyUserForm = {
  authUserId: "",
  name: "",
  email: "",
  department: "",
  designation: "",
  phone: "",
  role: "Employee"
};

const emptyTrainingForm = {
  title: "",
  description: "",
  category: "Technical",
  trainerName: "",
  scheduleDate: "",
  durationHours: 1,
  location: "Online",
  status: "planned"
};

const emptyAttendanceForm = {
  trainingId: "",
  userId: "",
  sessionDate: "",
  status: "present"
};

const DashboardPage = () => {
  const { user, profile, logout, refreshProfile } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [users, setUsers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState([]);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [trainingForm, setTrainingForm] = useState(emptyTrainingForm);
  const [assignForm, setAssignForm] = useState({ trainingId: "", userId: "" });
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendanceForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sections = useMemo(() => {
    const base = [{ key: "overview", label: "Overview" }];
    if (["Admin", "Trainer"].includes(user?.role)) {
      base.push({ key: "users", label: "Users" });
      base.push({ key: "trainings", label: "Trainings" });
      base.push({ key: "attendance", label: "Attendance" });
    } else {
      base.push({ key: "trainings", label: "My Trainings" });
      base.push({ key: "attendance", label: "My Attendance" });
    }
    return base;
  }, [user?.role]);

  const employeeOptions = users.filter((item) => item.role === "Employee");

  const loadDashboardData = async () => {
    setLoading(true);
    setMessage("");
    try {
      const profileSnapshot = await refreshProfile();
      const profileId = profileSnapshot?._id || profile?._id;

      const userPromise =
        user?.role === "Employee" ? Promise.resolve({ data: { data: profileId ? [profileSnapshot || profile] : [] } }) : userClient.get("/users");

      const trainingUrl =
        user?.role === "Employee" && profileId
          ? `/training?userId=${encodeURIComponent(profileId)}`
          : "/training";

      const [usersResponse, trainingsResponse] = await Promise.all([userPromise, trainingClient.get(trainingUrl)]);
      const nextTrainings = trainingsResponse.data.data || [];

      const attendanceUrl =
        profileId && user?.role === "Employee"
          ? `/attendance/user/${profileId}?authUserId=${encodeURIComponent(user.id)}`
          : nextTrainings[0]?._id
            ? `/attendance/training/${nextTrainings[0]._id}`
            : null;

      const attendanceResponse = attendanceUrl
        ? await attendanceClient.get(attendanceUrl)
        : { data: { data: [], summary: [] } };

      setUsers(usersResponse.data.data || []);
      setTrainings(nextTrainings);
      setAttendance(attendanceResponse.data.data || []);
      setAttendanceSummary(attendanceResponse.data.summary || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleChange = (setter) => (event) => {
    setter((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submitUserProfile = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await userClient.post("/users", userForm);
      setUserForm(emptyUserForm);
      setMessage("User profile created successfully.");
      await loadDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create user profile.");
    }
  };

  const submitTraining = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await trainingClient.post("/training", {
        ...trainingForm,
        durationHours: Number(trainingForm.durationHours),
        trainerName: trainingForm.trainerName || user?.name,
        trainerId: profile?._id || ""
      });
      setTrainingForm(emptyTrainingForm);
      setMessage("Training created successfully.");
      await loadDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create training.");
    }
  };

  const assignEmployee = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await trainingClient.post("/training/assign", assignForm);
      setAssignForm({ trainingId: "", userId: "" });
      setMessage("Employee assigned successfully.");
      await loadDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to assign employee.");
    }
  };

  const submitAttendance = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await attendanceClient.post("/attendance/mark", attendanceForm);
      setAttendanceForm(emptyAttendanceForm);
      setMessage("Attendance marked successfully.");
      await loadDashboardData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to mark attendance.");
    }
  };

  const summaryCards = [
    { label: "Employees", value: employeeOptions.length, tone: "brand" },
    { label: "Programs", value: trainings.length, tone: "emerald" },
    {
      label: user?.role === "Employee" ? "My Attendance Records" : "Attendance Entries",
      value: attendance.length,
      tone: "amber"
    },
    {
      label: "Role",
      value: user?.role || "N/A",
      tone: "sky"
    }
  ];

  return (
    <div className="min-h-screen bg-hero-pattern px-4 py-4 lg:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <Sidebar
          sections={sections}
          activeSection={activeSection}
          onSelect={setActiveSection}
          user={user}
          onLogout={logout}
        />

        <main className="glass-panel min-h-[calc(100vh-2rem)] flex-1 rounded-[2rem] border border-white/10 p-6 shadow-card lg:p-8">
          <TopBar
            title="Operations Dashboard"
            subtitle="Track employee learning programs, trainer schedules, and attendance outcomes in real time."
          />

          {message ? (
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} tone={item.tone} />
            ))}
          </div>

          {activeSection === "overview" ? (
            <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6">
                <h3 className="text-xl font-bold text-white">Program Pipeline</h3>
                <div className="mt-5 space-y-4">
                  {trainings.slice(0, 5).map((training) => (
                    <div key={training._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{training.title}</p>
                          <p className="text-sm text-slate-300">{training.description}</p>
                        </div>
                        <span className="rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
                          {training.status}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                        <span>{new Date(training.scheduleDate).toLocaleDateString()}</span>
                        <span>{training.durationHours} hrs</span>
                        <span>{training.location}</span>
                        <span>{training.assignedEmployees.length} assigned</span>
                      </div>
                    </div>
                  ))}
                  {!trainings.length && <p className="text-sm text-slate-400">No training programs available yet.</p>}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6">
                <h3 className="text-xl font-bold text-white">Attendance Snapshot</h3>
                <div className="mt-5 space-y-4">
                  {(attendanceSummary.length ? attendanceSummary : attendance.slice(0, 5)).map((item, index) => (
                    <div key={item.userId || item._id || index} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="font-semibold text-white">{item.userName || item.trainingTitle}</p>
                      <p className="mt-1 text-sm text-slate-300">
                        {"attendancePercentage" in item
                          ? `${item.attendancePercentage}% attendance`
                          : `${item.status} on ${new Date(item.sessionDate).toLocaleDateString()}`}
                      </p>
                    </div>
                  ))}
                  {!attendance.length && !attendanceSummary.length && (
                    <p className="text-sm text-slate-400">Attendance data will appear here once sessions are marked.</p>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "users" ? (
            <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              {user?.role === "Admin" ? (
                <form className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6" onSubmit={submitUserProfile}>
                  <h3 className="text-xl font-bold text-white">Create Employee Profile</h3>
                  <div className="mt-5 space-y-4">
                    {["authUserId", "name", "email", "department", "designation", "phone"].map((field) => (
                      <input
                        key={field}
                        name={field}
                        value={userForm[field]}
                        onChange={handleChange(setUserForm)}
                        placeholder={field}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:capitalize placeholder:text-slate-500 focus:border-brand-400"
                        required={["authUserId", "name", "email"].includes(field)}
                      />
                    ))}
                    <select
                      name="role"
                      value={userForm.role}
                      onChange={handleChange(setUserForm)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-400"
                    >
                      <option value="Employee">Employee</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400">
                      Save User Profile
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6">
                <h3 className="text-xl font-bold text-white">User Directory</h3>
                <div className="mt-5 space-y-4">
                  {users.map((item) => (
                    <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-sm text-slate-300">{item.email}</p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                          {item.role}
                        </span>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                        <span>{item.department || "No department"}</span>
                        <span>{item.designation || "No designation"}</span>
                        <span>{item.phone || "No phone"}</span>
                      </div>
                    </div>
                  ))}
                  {!users.length && <p className="text-sm text-slate-400">No user profiles available.</p>}
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "trainings" ? (
            <section className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              {["Admin", "Trainer"].includes(user?.role) ? (
                <div className="space-y-6">
                  <form className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6" onSubmit={submitTraining}>
                    <h3 className="text-xl font-bold text-white">Create Training Program</h3>
                    <div className="mt-5 space-y-4">
                      <input
                        name="title"
                        value={trainingForm.title}
                        onChange={handleChange(setTrainingForm)}
                        placeholder="Training title"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        required
                      />
                      <textarea
                        name="description"
                        value={trainingForm.description}
                        onChange={handleChange(setTrainingForm)}
                        placeholder="Training description"
                        className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        required
                      />
                      <input
                        name="category"
                        value={trainingForm.category}
                        onChange={handleChange(setTrainingForm)}
                        placeholder="Category"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      />
                      <input
                        name="trainerName"
                        value={trainingForm.trainerName}
                        onChange={handleChange(setTrainingForm)}
                        placeholder="Trainer name"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          name="scheduleDate"
                          type="datetime-local"
                          value={trainingForm.scheduleDate}
                          onChange={handleChange(setTrainingForm)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                          required
                        />
                        <input
                          name="durationHours"
                          type="number"
                          min="1"
                          value={trainingForm.durationHours}
                          onChange={handleChange(setTrainingForm)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                          required
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input
                          name="location"
                          value={trainingForm.location}
                          onChange={handleChange(setTrainingForm)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        />
                        <select
                          name="status"
                          value={trainingForm.status}
                          onChange={handleChange(setTrainingForm)}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        >
                          <option value="planned">Planned</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400">
                        Create Training
                      </button>
                    </div>
                  </form>

                  <form className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6" onSubmit={assignEmployee}>
                    <h3 className="text-xl font-bold text-white">Assign Employee</h3>
                    <div className="mt-5 space-y-4">
                      <select
                        name="trainingId"
                        value={assignForm.trainingId}
                        onChange={handleChange(setAssignForm)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        required
                      >
                        <option value="">Select training</option>
                        {trainings.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.title}
                          </option>
                        ))}
                      </select>
                      <select
                        name="userId"
                        value={assignForm.userId}
                        onChange={handleChange(setAssignForm)}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                        required
                      >
                        <option value="">Select employee</option>
                        {employeeOptions.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <button className="w-full rounded-2xl border border-brand-300/30 bg-brand-500/10 px-4 py-3 font-semibold text-brand-100 hover:bg-brand-500/20">
                        Assign To Training
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6">
                <h3 className="text-xl font-bold text-white">
                  {user?.role === "Employee" ? "My Assigned Trainings" : "Training Catalog"}
                </h3>
                <div className="mt-5 space-y-4">
                  {trainings.map((item) => (
                    <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-lg font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-sm text-slate-300">{item.description}</p>
                        </div>
                        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
                        <span>Trainer: {item.trainerName}</span>
                        <span>Category: {item.category}</span>
                        <span>Date: {new Date(item.scheduleDate).toLocaleString()}</span>
                        <span>Assigned: {item.assignedEmployees.length}</span>
                      </div>
                    </div>
                  ))}
                  {!trainings.length && <p className="text-sm text-slate-400">No training programs found.</p>}
                </div>
              </div>
            </section>
          ) : null}

          {activeSection === "attendance" ? (
            <section className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
              {["Admin", "Trainer"].includes(user?.role) ? (
                <form className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6" onSubmit={submitAttendance}>
                  <h3 className="text-xl font-bold text-white">Mark Attendance</h3>
                  <div className="mt-5 space-y-4">
                    <select
                      name="trainingId"
                      value={attendanceForm.trainingId}
                      onChange={handleChange(setAttendanceForm)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      required
                    >
                      <option value="">Select training</option>
                      {trainings.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                    <select
                      name="userId"
                      value={attendanceForm.userId}
                      onChange={handleChange(setAttendanceForm)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      required
                    >
                      <option value="">Select employee</option>
                      {employeeOptions.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <input
                      name="sessionDate"
                      type="date"
                      value={attendanceForm.sessionDate}
                      onChange={handleChange(setAttendanceForm)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                      required
                    />
                    <select
                      name="status"
                      value={attendanceForm.status}
                      onChange={handleChange(setAttendanceForm)}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                    <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-white hover:bg-brand-400">
                      Mark Attendance
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/30 p-6">
                <h3 className="text-xl font-bold text-white">
                  {user?.role === "Employee" ? "My Attendance Report" : "Attendance Reports"}
                </h3>
                <div className="mt-5 space-y-4">
                  {attendance.map((item) => (
                    <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{item.trainingTitle}</p>
                          <p className="text-sm text-slate-300">
                            {item.userName} • {new Date(item.sessionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                            item.status === "present"
                              ? "bg-emerald-500/15 text-emerald-100"
                              : "bg-rose-500/15 text-rose-100"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {!attendance.length && <p className="text-sm text-slate-400">No attendance records available yet.</p>}
                </div>
              </div>
            </section>
          ) : null}

          {loading ? <p className="mt-6 text-sm text-slate-400">Refreshing service data...</p> : null}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
