import { useState } from 'react';
import { message } from 'antd';
import {
  getResidentMetrics,
  getResidentBills,
  getResidentBookings,
  getResidentMaintenance,
} from '@/services/Dashboard';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [residentInfo, setResidentInfo] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);

  const handleGetResidentData = async () => {
    setLoading(true);
    try {
      const [resMetrics, resBills, resBookings, resMaint] = await Promise.allSettled([
        getResidentMetrics(),
        getResidentBills(),
        getResidentBookings(),
        getResidentMaintenance(),
      ]);

      if (resMetrics.status === 'fulfilled' && resMetrics.value?.success) {
        setResidentInfo(resMetrics.value.data.resident_info);
        setMetrics(resMetrics.value.data.metrics);
      }
      if (resBills.status === 'fulfilled' && resBills.value?.success) {
        setBills(resBills.value.data);
      }
      if (resBookings.status === 'fulfilled' && resBookings.value?.success) {
        setBookings(resBookings.value.data);
      }
      if (resMaint.status === 'fulfilled' && resMaint.value?.success) {
        setMaintenance(resMaint.value.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Dashboard Cư dân:', error);
      message.error('Không thể kết nối máy chủ để tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    residentInfo,
    metrics,
    bills,
    bookings,
    maintenance,
    handleGetResidentData,
  };
};
