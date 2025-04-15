import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_URL = `${API_BASE_URL}/api`;

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAuthHeaders: () => Record<string, string>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      register: async (email: string, password: string, name: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              name,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
          }

          const userData = await response.json();
          
          // After registration, log in to get the token
          await get().login(email, password);
          
        } catch (error: any) {
          throw new Error(error.message || 'Failed to register');
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Authentication failed');
          }

          const data = await response.json();
          
          // Get user data with the token
          const userResponse = await fetch(`${API_URL}/auth/users/me`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });
          
          if (!userResponse.ok) {
            throw new Error('Failed to get user data');
          }
          
          const userData = await userResponse.json();
          
          set({ 
            user: userData,
            token: data.access_token,
            isAuthenticated: true 
          });
        } catch (error: any) {
          throw new Error(error.message || 'Failed to login');
        }
      },
      
      logout: () => {
        // Simply clear the auth state
        set({ 
          user: null,
          token: null,
          isAuthenticated: false 
        });
      },
      
      getAuthHeaders: () => {
        const token = get().token;
        if (!token) return {};
        return {
          'Authorization': `Bearer ${token}`
        };
      }
    }),
    {
      name: 'auth-store',
    }
  )
);
