import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "./api";


const PAGE_SIZE = 5;

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const emptyForm = {
  first_name: "",
  last_name: "",
  age: "",
  gender: "MALE",
  blood_group: "O+",
  mobile: "",
  address: "",
  password: "",
};


function errorText(err) {
  const data = err.response && err.response.data;
  if (!data) return "Could not reach the server. Is the Django server running?";
  if (typeof data === "string") return "Something went wrong.";
  return Object.entries(data)
    .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(" ") : msg}`)
    .join(" | ");
}

function App() {
  const [patients, setPatients] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  function refresh() {
    setReloadKey((k) => k + 1);
  }

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await getPatients(page);
        if (!ignore) {
          setPatients(res.data.results);
          setCount(res.data.count);
        }
      } catch (err) {
        if (!ignore) toast.error(errorText(err));
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [page, reloadKey]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = { ...form, age: Number(form.age) };

    // when updating, an empty password means "keep the old one"
    if (!data.password) delete data.password;

    try {
      if (editingId !== null) {
        await updatePatient(editingId, data);
        toast.success("Patient updated.");
      } else {
        await createPatient(data);
        toast.success("Patient added.");
      }
      resetForm();
      refresh();
    } catch (err) {
      toast.error(errorText(err));
    }
  }

  function handleEdit(patient) {
    setEditingId(patient.id);
    setForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      age: patient.age,
      gender: patient.gender,
      blood_group: patient.blood_group,
      mobile: patient.mobile,
      address: patient.address,
      password: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(patient) {
    const ok = window.confirm(
      `Delete ${patient.first_name} ${patient.last_name}?`
    );
    if (!ok) return;

    try {
      await deletePatient(patient.id);
      toast.success("Patient deleted.");
      if (editingId === patient.id) resetForm();

      
      if (patients.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refresh();
      }
    } catch (err) {
      toast.error(errorText(err));
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 text-[15px]">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-4">Patient Records</h1>

        <div className="bg-white border border-gray-300 p-4 mb-5">
          <h2 className="text-base font-semibold mb-3">
            {editingId !== null ? "Update Patient" : "Add Patient"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">First name</label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Last name</label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Age</label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  type="number"
                  min="0"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Mobile</label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Gender</label>
                <select
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Blood group</label>
                <select
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleChange}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">Address</label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-700 mb-1">
                  Password
                  {editingId !== null ? " (leave empty to keep old one)" : ""}
                </label>
                <input
                  className="w-full border border-gray-400 bg-white px-2 py-1.5 text-sm focus:outline-none focus:border-gray-700"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required={editingId === null}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button type="submit" className="border border-gray-800 bg-gray-800 px-3 py-1.5 text-sm text-white cursor-pointer hover:bg-black">
                {editingId !== null ? "Save changes" : "Add patient"}
              </button>
              {editingId !== null && (
                <button type="button" className="border border-gray-500 bg-gray-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-300 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>

        </div>

        {/* Patient table */}
        <div className="bg-white border border-gray-300 p-4 mb-5">
          <h2 className="text-base font-semibold mb-3">
            Patient List ({count})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">ID</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Name</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Age</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Gender</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Blood</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Mobile</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Address</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Visits</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Last visit</th>
                  <th className="border border-gray-300 bg-gray-100 px-2 py-1.5 text-left font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 && (
                  <tr>
                    <td className="border border-gray-300 px-2 py-1.5" colSpan="10">
                      No patients found.
                    </td>
                  </tr>
                )}

                {patients.map((p) => (
                  <tr key={p.id}>
                    <td className="border border-gray-300 px-2 py-1.5">{p.id}</td>
                    <td className="border border-gray-300 px-2 py-1.5">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.age}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.gender}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.blood_group}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.mobile}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.address}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.total_visits}</td>
                    <td className="border border-gray-300 px-2 py-1.5">{p.last_visit_date || "-"}</td>
                    <td className="border border-gray-300 px-2 py-1.5 whitespace-nowrap">
                      <button className="border border-gray-500 bg-gray-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-300 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400" onClick={() => handleEdit(p)}>
                        Update
                      </button>{" "}
                      <button
                        className="border border-red-700 bg-white px-3 py-1.5 text-sm text-red-700 cursor-pointer hover:bg-red-50"
                        onClick={() => handleDelete(p)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              className="border border-gray-500 bg-gray-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-300 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="border border-gray-500 bg-gray-200 px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-300 disabled:cursor-default disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;