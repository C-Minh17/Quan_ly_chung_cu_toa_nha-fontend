import axios from "@/utils/axios";
import { ipRoot, ipNotif } from "@/utils/ip";

export const getDashboardMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/dashboard/metrics`).then(res => res.data);
};

export const getRevenueStats = async (monthsLimit: number = 6) => {
  return axios.get(`${ipRoot}/api/v1/invoices/stats/revenue`, {
    params: { months_limit: monthsLimit }
  }).then(res => res.data);
};

export const getMaintenanceStatusStats = async () => {
  return axios.get(`${ipRoot}/api/v1/maintenance-requests/stats`).then(res => res.data);
};

export const getUrgentMaintenanceRequests = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/maintenance-requests/urgent`, {
    params: { limit }
  }).then(res => res.data);
};

export const getOverdueInvoices = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/invoices/overdue`, {
    params: { limit }
  }).then(res => res.data);
};

export const getRecentActivities = async (limit: number = 10) => {
  return axios.get(`${ipRoot}/api/v1/dashboard/activities`, {
    params: { limit }
  }).then(res => res.data);
};

export const sendResidentNotification = async (payload: any) => {
  return axios.post(`${ipNotif}/notification`, payload).then(res => res.data);
};

export const getResidentMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/metrics`).then(res => res.data);
};

export const getResidentBills = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/bills`).then(res => res.data);
};

export const getResidentBookings = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/bookings`).then(res => res.data);
};

export const getResidentMaintenance = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/maintenance`).then(res => res.data);
};

export const getStaffMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/metrics`).then(res => res.data);
};

export const getStaffTasks = async () => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/tasks`).then(res => res.data);
};

export const updateStaffTaskStatus = async (id: string, completed: boolean) => {
  return axios.patch(`${ipRoot}/api/v1/staff/dashboard/tasks/${id}`, { completed }).then(res => res.data);
};

export const getStaffRecentLogs = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/recent-logs`, {
    params: { limit }
  }).then(res => res.data);
};
