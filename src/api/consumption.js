import api from "./axios";

// Add a new consumption record
export async function addConsumptionLog({ userId, itemName, category }) {
  try {
    const res = await api.post("/consumption", {
      userId,
      itemName,
      category,
    });

    return res.data;
  } catch (error) {
    console.error("Error adding consumption log:", error);
    throw error;
  }
}
