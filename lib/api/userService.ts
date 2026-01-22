import { api } from "./api";

export const userService = {
  updateProfile: async (formData: FormData) => {
    const { data } = await api.patch("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get("/user/current");
    return data;
  },
};
