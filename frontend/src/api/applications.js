import { api } from "./client";

export const applicationsApi = {
  getAll: () => api.get("/applications").then((res) => res.data),
  create: (data) => api.post("/applications", data).then((res) => res.data),
  changeStatus: (id, status, notes) =>
    api.patch(`/applications/${id}/status`, { status, notes }),
  getHistory: (id) =>
    api.get(`/applications/${id}/history`).then((res) => res.data),
};
