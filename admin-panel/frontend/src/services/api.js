const API_URL = 'http://localhost:4000/api/agents';

// ✅ ดึง agents ทั้งหมด
export async function getAgents() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error(`Failed to fetch agents: ${res.statusText}`);
    }
    const data = await res.json();

    // ✅ รองรับทั้ง array ตรง ๆ และ object ที่ห่อข้อมูล
    return Array.isArray(data) ? data : data.agents || [];
  } catch (err) {
    console.error('Error fetching agents:', err);
    return []; // ป้องกัน React พัง
  }
}

// ✅ เพิ่ม agent ใหม่
export async function addAgent(agent) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agent),
    });

    if (!res.ok) {
      throw new Error(`Failed to add agent: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.error('Error adding agent:', err);
    throw err;
  }
}

// ✅ ลบ agent ตาม code
export async function deleteAgent(code) {
  try {
    const res = await fetch(`${API_URL}/${code}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Failed to delete agent: ${res.statusText}`);
    }
  } catch (err) {
    console.error('Error deleting agent:', err);
    throw err;
  }
}
