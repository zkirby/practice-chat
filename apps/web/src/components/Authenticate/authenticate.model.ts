import { create } from "zustand";
// import { persist } from "zustand/middleware";

interface User {
  userId: string;
  name: string;
}

interface UserStore {
  user: User | null;
  set: (user: User) => void;
}

// export const useUser = create(
//   persist<UserStore>(
//     (set) => ({
//       user: null,
//       set: (user: User) => set(() => ({ user })),
//     }),
//     {
//       name: "user",
//     }
//   )
// );

export const useUser = create<UserStore>((set) => ({
  user: null,
  set: (user: User) => set(() => ({ user })),
}));
