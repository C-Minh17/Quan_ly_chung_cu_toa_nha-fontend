import { useState } from 'react';
import { message } from 'antd';
import {
  getDashboardMetrics,
  getRevenueStats,
  getMaintenanceStatusStats,
  getUrgentMaintenanceRequests,
  getOverdueInvoices,
  getRecentActivities,
  sendResidentNotification,
} from '@/services/Dashboard';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [maintenanceStats, setMaintenanceStats] = useState<any>(null);
  const [urgentRequests, setUrgentRequests] = useState<any[]>([]);
  const [overdueInvoices, setOverdueInvoices] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [submittingNotif, setSubmittingNotif] = useState<boolean>(false);

  const handleGetAdminData = async () => {
    setLoading(true);
    try {
      const [
        resMetrics,
        resRevenue,
        resMaintStats,
        resUrgent,
        resOverdue,
        resActivities,
      ] = await Promise.allSettled([
        getDashboardMetrics(),
        getRevenueStats(),
        getMaintenanceStatusStats(),
        getUrgentMaintenanceRequests(),
        getOverdueInvoices(),
        getRecentActivities(),
      ]);

      if (resMetrics.status === 'fulfilled' && resMetrics.value?.success) {
        setMetrics(resMetrics.value.data);
      }
      if (resRevenue.status === 'fulfilled' && resRevenue.value?.success) {
        setRevenueData(resRevenue.value.data);
      }
      if (resMaintStats.status === 'fulfilled' && resMaintStats.value?.success) {
        setMaintenanceStats(resMaintStats.value.data);
      }
      if (resUrgent.status === 'fulfilled' && resUrgent.value?.success) {
        setUrgentRequests(resUrgent.value.data);
      }
      if (resOverdue.status === 'fulfilled' && resOverdue.value?.success) {
        setOverdueInvoices(resOverdue.value.data);
      }
      if (resActivities.status === 'fulfilled' && resActivities.value?.success) {
        setActivities(resActivities.value.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Dashboard Admin:', error);
      message.error('Không thể kết nối máy chủ để tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecentActivities = async () => {
    try {
      const res = await getRecentActivities();
      if (res?.success) {
        setActivities(res.data);
      }
    } catch (error) {
      console.error('Lỗi tải nhật ký vận hành:', error);
    }
  };

  const handleSendNotification = async (values: any) => {
    setSubmittingNotif(true);
    try {
      const res = await sendResidentNotification({
        title: values.title,
        senderName: 'Ban Quản trị',
        receiverType: 'All', // Match EReceiverType.All
        type: 'OneSignalService', // Match standard OneSignal notification service
        content: values.content,
        description: `Phân loại: ${
          values.type === 'maintenance'
            ? 'Bảo trì / Kỹ thuật'
            : values.type === 'finance'
            ? 'Tài chính / Phí dịch vụ'
            : values.type === 'alert'
            ? 'Cảnh báo khẩn cấp'
            : 'Thông báo chung'
        }. Đối tượng: ${
          values.recipient_type === 'building_a'
            ? 'Cư dân Tòa A'
            : values.recipient_type === 'building_b'
            ? 'Cư dân Tòa B'
            : 'Tất cả cư dân'
        }`,
        notificationInternal: false,
      });

      if (res?.success) {
        message.success('Gửi thông báo đến cư dân thành công!');
        // Refresh activities
        handleGetRecentActivities();
        return true;
      } else {
        message.error(res?.message || 'Có lỗi xảy ra khi gửi thông báo.');
        return false;
      }
    } catch (error) {
      console.error('Lỗi gửi thông báo:', error);
      message.error('Không thể kết nối máy chủ để gửi thông báo.');
      return false;
    } finally {
      setSubmittingNotif(false);
    }
  };

  return {
    loading,
    setLoading,
    metrics,
    revenueData,
    maintenanceStats,
    urgentRequests,
    overdueInvoices,
    activities,
    setActivities,
    submittingNotif,
    handleGetAdminData,
    handleGetRecentActivities,
    handleSendNotification,
  };
};
