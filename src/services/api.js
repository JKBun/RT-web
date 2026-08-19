/**
 * API Service Layer — Connects View Layer to MVC Backend & Database
 */

const API_BASE_URL = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:5000/api';

export const api = {
  // Authentication & Users
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Events & Avenues
  async getEvents() {
    const res = await fetch(`${API_BASE_URL}/events`);
    return res.json();
  },

  async getAvenues() {
    const res = await fetch(`${API_BASE_URL}/events/avenues`);
    return res.json();
  },

  async createEvent(eventData) {
    const res = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    });
    return res.json();
  },

  // Event Registrations & Pass Verification
  async registerForEvent(payload) {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getUserRegistrations(userId) {
    const res = await fetch(`${API_BASE_URL}/registrations/user/${userId}`);
    return res.json();
  },

  async verifyPass(passCode) {
    const res = await fetch(`${API_BASE_URL}/registrations/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passCode })
    });
    return res.json();
  },

  // Volunteer Service Hours
  async submitVolunteerHours(payload) {
    const res = await fetch(`${API_BASE_URL}/volunteer/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async getUserVolunteerLogs(userId) {
    const res = await fetch(`${API_BASE_URL}/volunteer/user/${userId}`);
    return res.json();
  },

  async getAllVolunteerLogs() {
    const res = await fetch(`${API_BASE_URL}/volunteer/all`);
    return res.json();
  },

  async updateVolunteerLogStatus(logId, status, verifiedBy) {
    const res = await fetch(`${API_BASE_URL}/volunteer/status/${logId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, verifiedBy })
    });
    return res.json();
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`);
    return res.json();
  },

  // Analytical Reports
  async getEventAttendanceAudit(eventId) {
    const res = await fetch(`${API_BASE_URL}/reports/attendance/${eventId}`);
    return res.json();
  },

  async getAnnualVolunteerSummary() {
    const res = await fetch(`${API_BASE_URL}/reports/volunteer-summary`);
    return res.json();
  }
};

export default api;
