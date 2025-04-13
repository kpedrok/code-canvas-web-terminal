
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      register: async (email: string, password: string, name: string) => {
        // In a real app, this would call an API
        // For now, we'll simulate by storing in localStorage
        
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const exists = existingUsers.find((u: any) => u.email === email);
        
        if (exists) {
          throw new Error('User already exists');
        }
        
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          password, // Note: In a real app, NEVER store plain text passwords
          name,
        };
        
        // Store user in "database"
        localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
        
        // Set authenticated state (exclude password)
        const { password: _, ...userWithoutPassword } = newUser;
        set({ 
          user: userWithoutPassword,
          isAuthenticated: true 
        });
      },
      
      login: async (email: string, password: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = existingUsers.find((u: any) => u.email === email && u.password === password);
        
        if (!user) {
          throw new Error('Invalid email or password');
        }
        
        // Set authenticated state (exclude password)
        const { password: _, ...userWithoutPassword } = user;
        set({ 
          user: userWithoutPassword,
          isAuthenticated: true 
        });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-store',
    }
  )
);
