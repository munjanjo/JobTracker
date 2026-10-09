import { api } from "./client";

export const authApi = {
  register: (email, password) =>
    api.post("/auth/register", { email, password }),
  login: (email, password) =>
    api.post("/auth/login?useCookies=true", { email, password }),
  logout: () => api.post("/auth/logout", {}),

  me: () => api.get("/auth/manage/info"),
};
