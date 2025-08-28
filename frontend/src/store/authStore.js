// import { create } from "zustand";

// export const useAuthStore = create((set) => ({
//   isAuthenticated: false,
//   user: null,
//   loading: false,
//   error: null,

//   register: async (name, email, password) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("http://localhost:5001/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       localStorage.setItem("token", data.token);
//       set({ isAuthenticated: true, user: data.user });
//     } catch (err) {
//       set({ error: err.message });
//       throw err; // Re-throw for UI handling
//     } finally {
//       set({ loading: false });
//     }
//   },

//   login: async (email, password) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("http://localhost:5001/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Login failed");
//       }

//       localStorage.setItem("token", data.token);
//       set({ isAuthenticated: true, user: data.user });
//     } catch (err) {
//       set({ error: err.message });
//       throw err;
//     } finally {
//       set({ loading: false });
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     set({ isAuthenticated: false, user: null });
//   },

//   checkAuth: async () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       set({ loading: true });
//       try {
//         const res = await fetch("http://localhost:5001/api/auth/me", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const data = await res.json();

//         if (res.ok) {
//           set({ isAuthenticated: true, user: data });
//         } else {
//           localStorage.removeItem("token");
//         }
//       } catch (err) {
//         console.error("Auth check failed:", err);
//         localStorage.removeItem("token");
//       } finally {
//         set({ loading: false });
//       }
//     }
//   },

//   clearError: () => set({ error: null }),
// }));

import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  isAuthenticated: !!localStorage.getItem("token"),
  user: null,
  token: localStorage.getItem("token"), // ✅ Initialize from localStorage
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      localStorage.setItem("token", data.token);
      set({ isAuthenticated: true, user: data.user, token: data.token }); // ✅ set token
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      set({ isAuthenticated: true, user: data.user, token: data.token }); // ✅ set token
    } catch (err) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false, user: null, token: null }); // ✅ clear token
  },

  checkAuth: async () => {
    const token = get().token;
    if (token) {
      set({ loading: true });
      try {
        const res = await fetch("http://localhost:5001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          set({ isAuthenticated: true, user: data });
        } else {
          localStorage.removeItem("token");
          set({ token: null });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token");
        set({ token: null });
      } finally {
        set({ loading: false });
      }
    }
  },

  clearError: () => set({ error: null }),
}));
