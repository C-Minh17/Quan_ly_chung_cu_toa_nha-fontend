import axios from "@/utils/axios";
import { ipRoot, ipNotif } from "@/utils/ip";

// 1. API Lấy số liệu các thẻ chỉ số (Dashboard Metrics)
export const getDashboardMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/dashboard/metrics`).then(res => res.data);
};

// 2. API Thống kê doanh thu 6 tháng gần nhất (Revenue Charts)
export const getRevenueStats = async (monthsLimit: number = 6) => {
  return axios.get(`${ipRoot}/api/v1/invoices/stats/revenue`, {
    params: { months_limit: monthsLimit }
  }).then(res => res.data);
};

// 3. API Thống kê trạng thái bảo trì (Maintenance Status Stats)
export const getMaintenanceStatusStats = async () => {
  return axios.get(`${ipRoot}/api/v1/maintenance-requests/stats`).then(res => res.data);
};

// 4. API Lấy danh sách yêu cầu bảo trì khẩn cấp (Urgent Maintenance)
export const getUrgentMaintenanceRequests = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/maintenance-requests/urgent`, {
    params: { limit }
  }).then(res => res.data);
};

// 5. API Lấy danh sách hóa đơn quá hạn chưa thanh toán (Overdue Invoices)
export const getOverdueInvoices = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/invoices/overdue`, {
    params: { limit }
  }).then(res => res.data);
};

// 6. API Nhật ký hoạt động gần đây (Recent Activities)
export const getRecentActivities = async (limit: number = 10) => {
  return axios.get(`${ipRoot}/api/v1/dashboard/activities`, {
    params: { limit }
  }).then(res => res.data);
};

// 7. API Gửi thông báo đến cư dân (Send notification to residents)
export const sendResidentNotification = async (payload: any) => {
  return axios.post(`${ipNotif}/notification`, payload).then(res => res.data);
};

// Resident Dashboard APIs (Cư dân)
// 8. API Lấy thông tin cá nhân & Số liệu thẻ nhanh (Resident Metrics)
export const getResidentMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/metrics`).then(res => res.data);
};

// 9. API Danh sách chi tiết phí dịch vụ tháng hiện tại (Current Bills)
export const getResidentBills = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/bills`).then(res => res.data);
};

// 10. API Danh sách đặt tiện ích sắp tới (Upcoming Bookings)
export const getResidentBookings = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/bookings`).then(res => res.data);
};

// 11. API Tiến trình xử lý báo hỏng kỹ thuật (Maintenance Requests)
export const getResidentMaintenance = async () => {
  return axios.get(`${ipRoot}/api/v1/resident/dashboard/maintenance`).then(res => res.data);
};

// Staff Dashboard APIs (Nhân viên)
// 12. API Lấy thông tin nhân viên & Số liệu thống kê nhanh (Metrics & Info)
export const getStaffMetrics = async () => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/metrics`).then(res => res.data);
};

// 13. API Lấy danh sách nhiệm vụ ca trực (Daily Checklist)
export const getStaffTasks = async () => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/tasks`).then(res => res.data);
};

// 14. API Cập nhật trạng thái công việc checklist (Toggle Task Status)
export const updateStaffTaskStatus = async (id: string, completed: boolean) => {
  return axios.patch(`${ipRoot}/api/v1/staff/dashboard/tasks/${id}`, { completed }).then(res => res.data);
};

// 15. API Lấy nhật ký ghi chỉ số điện nước gần đây (Recent Recording Logs)
export const getStaffRecentLogs = async (limit: number = 5) => {
  return axios.get(`${ipRoot}/api/v1/staff/dashboard/recent-logs`, {
    params: { limit }
  }).then(res => res.data);
};
