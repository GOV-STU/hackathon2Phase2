interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface BackendAuthResponse {
  success: boolean;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class AuthClient {
  private readonly STORAGE_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: BackendAuthResponse = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(
          data.error?.message || "Login failed. Please check your credentials."
        );
      }

      const { user, token } = data.data;

      // Store token and user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please try again.");
    }
  }

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: BackendAuthResponse = await response.json();

      if (!response.ok || !data.success || !data.data) {
        throw new Error(
          data.error?.message || "Signup failed. Please try again."
        );
      }

      const { user, token } = data.data;

      // Store token and user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(this.STORAGE_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }

      return { user, token };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error. Please try again.");
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();

      if (token) {
        // Call backend logout endpoint if it exists
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Continue with local logout even if backend call fails
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Store token manually (useful for Better Auth integration)
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.STORAGE_KEY, token);
    }
  }

  // Store user manually (useful for Better Auth integration)
  setUser(user: User): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }
}

export const auth = new AuthClient();
export type { User, AuthResponse };
