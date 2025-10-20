import { useEffect, useState } from "react";
import { getAgents, addAgent, deleteAgent } from "../services/api";

export default function AgentTable() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    code: "",
    name: "",
    status: "",
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await getAgents();

      // ✅ ตรวจว่าข้อมูลเป็น array จริงไหม ถ้าไม่ก็จัดการให้เป็น array
      if (Array.isArray(data)) {
        setAgents(data);
      } else if (data && Array.isArray(data.agents)) {
        setAgents(data.agents);
      } else {
        console.error("Invalid data format from API:", data);
        setAgents([]);
      }
    } catch (error) {
      console.error("Error loading agents:", error);
      setAgents([]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.code || !form.name) {
      alert("Please fill in both Code and Name.");
      return;
    }

    try {
      await addAgent(form);
      setForm({ code: "", name: "", status: "" });
      loadAgents();
    } catch (error) {
      console.error("Error adding agent:", error);
      alert("Failed to add agent.");
    }
  };

  const handleDelete = async (code) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        await deleteAgent(code);
        loadAgents();
      } catch (error) {
        console.error("Error deleting agent:", error);
        alert("Failed to delete agent.");
      }
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">👩‍💼 Agent Management</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border rounded px-2 py-1"
          placeholder="Agent Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <input
          className="border rounded px-2 py-1"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className="border rounded px-2 py-1"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Break">Break</option>
          <option value="Offline">Offline</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          ➕ Add
        </button>
      </form>

      <table className="border-collapse border w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-3 py-2">Code</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a, idx) => (
            <tr key={a.agent_code || idx}>
              <td className="border px-3 py-2">{a.agent_code}</td>
              <td className="border px-3 py-2">{a.agent_name}</td>
              <td className="border px-3 py-2">{a.status || "-"}</td>
              <td className="border px-3 py-2 text-center">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(a.agent_code)}
                >
                  ❌ Delete
                </button>
              </td>
            </tr>
          ))}
          {agents.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-3 text-gray-500">
                No agents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
