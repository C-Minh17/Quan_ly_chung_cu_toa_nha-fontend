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
