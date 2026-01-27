import { api } from "./api";

interface UpdateProfileData {
  name: string;
  currency: string;
}

interface UserResponse {
  name: string;
  currency: string;
  avatarUrl: string | null;
}
export const userService = {
  updateProfile: async (values: UpdateProfileData): Promise<UserResponse> => {
    const { data } = await api.patch<UserResponse>("users/info", values);
    return data;
  },

  updateAvatar: async (formData: FormData): Promise<{ avatarUrl: string }> => {
    const { data } = await api.patch<{ avatarUrl: string }>(
      "users/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  deleteAvatar: async (): Promise<void> => {
    await api.delete("users/avatar");
  },
};
