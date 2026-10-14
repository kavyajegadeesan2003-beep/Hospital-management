import api from "./api";
import { initialData } from "../data/initialData";

const hasApi = true;
const storageKey = "carepoint-hospital-data";

function readStore() {
  const saved = localStorage.getItem(storageKey);
  if (saved) return JSON.parse(saved);
  localStorage.setItem(storageKey, JSON.stringify(initialData));
  return initialData;
}

function writeStore(data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

function wait() {
  return new Promise((resolve) => window.setTimeout(resolve, 180));
}

export async function getRecords(resource) {
  if (hasApi) return (await api.get(`/${resource}`)).data;
  await wait();
  return readStore()[resource] || [];
}

export async function saveRecord(resource, record) {
  if (hasApi) {
    if (record.id && !(record.id.startsWith("NEW-"))) {
      try {
        return (await api.put(`/${resource}/${record.id}`, record)).data;
      } catch (error) {
        if (error.response?.status !== 404) throw error;
      }
    }
    const payload = { ...record };
    if (payload.id?.startsWith("NEW-")) delete payload.id;
    return (await api.post(`/${resource}`, payload)).data;
  }
  await wait();
  const data = readStore();
  const list = data[resource] || [];
  const exists = list.some((item) => String(item.id) === String(record.id));
  const next = exists
    ? list.map((item) => String(item.id) === String(record.id) ? record : item)
    : [{ ...record, id: record.id || `${resource.slice(0, 1).toUpperCase()}-${Date.now()}` }, ...list];
  data[resource] = next;
  writeStore(data);
  return next[0];
}

export async function deleteRecord(resource, id) {
  if (hasApi) {
    await api.delete(`/${resource}/${id}`);
    return;
  }
  await wait();
  const data = readStore();
  data[resource] = (data[resource] || []).filter((item) => String(item.id) !== String(id));
  writeStore(data);
}
