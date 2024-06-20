import { create } from "zustand";

interface User {
  id: string;
  name: string;
}

interface UserStore {
  user: User | null;
  set: (user: User) => void;
}

export const useUser = create<UserStore>((set) => ({
  user: null,
  set: (user: User) => set(() => ({ user })),
}));
