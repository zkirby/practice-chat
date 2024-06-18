import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: string;
  userName: string;
}

interface UserStore {
  user: User | null;
  set: (user: User) => void;
}

export const useUser = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      set: (user: User) => set(() => ({ user })),
    }),
    {
      name: "user",
    }
  )
);
