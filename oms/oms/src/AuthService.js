// src/AuthService.js
import api from './api/axiosConfig';

const TOKEN_KEY = 'oms_token';
const USERNAME_KEY = 'oms_username';
const EMAIL_KEY = 'oms_email';
const ROLE_KEY = 'oms_role';

const AuthService = {
  // login expects { email, password } and backend returns { jwtToken, userName, role? }
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });

    const token = res.data?.jwtToken;
    const userName =
      res.data?.userName ||
      res.data?.user?.userName ||
      res.data?.username ||
      null;

    // try to read role & email if backend sends them
    const role =
      res.data?.role ||
      res.data?.user?.role ||
      res.data?.userRole ||
      'admin'; // default so RoleRoute works for now

    const emailFromApi =
      res.data?.email ||
      res.data?.user?.email ||
      email || null;

    if (!token) throw new Error('No token returned from server');

    localStorage.setItem(TOKEN_KEY, token);
    if (userName) localStorage.setItem(USERNAME_KEY, userName);
    if (emailFromApi) localStorage.setItem(EMAIL_KEY, emailFromApi);
    if (role) localStorage.setItem(ROLE_KEY, role);

    return token;
  },

  async register(email, password) {
    return api.post('/auth/register', { email, password });
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  authHeader() {
    const t = localStorage.getItem(TOKEN_KEY);
    return t ? { Authorization: `Bearer ${t}` } : {};
  },

  // ---------- user helpers ----------

  getUsername() {
    // existing helper (keep for backward compatibility)
    return localStorage.getItem(USERNAME_KEY);
  },

  // alias used in Settings.js etc.
  getUserName() {
    return this.getUsername();
  },

  getUserEmail() {
    return localStorage.getItem(EMAIL_KEY) || '';
  },

  getUserRole() {
    return localStorage.getItem(ROLE_KEY) || '';
  },

  getUserRoles() {
    const role = this.getUserRole();
    return role ? [role] : [];
  },

  // ✅ used in OrderEnquiry, Products, RoleRoute, etc.
  hasRole(allowedRoles = []) {
    if (!allowedRoles || allowedRoles.length === 0) return true; // if none specified, allow
    const role = this.getUserRole();
    if (!role) return false;
    return allowedRoles.includes(role);
  }
};

export default AuthService;
