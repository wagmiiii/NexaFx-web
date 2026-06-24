import { create } from 'zustand';

export interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null) => void;
}

// Temporary mock auth state for v2 scaffold.
// Replace with real authentication integration in future auth tasks.
export const useAuthStore = create<AuthState>((set) => ({
  user: {
    name: 'Admin User',
    email: 'admin@nexafx.com',
    role: 'ADMIN',
  },
  isAuthenticated: true,
  setAuth: (user) => set({ user, isAuthenticated: !!user }),
}));
