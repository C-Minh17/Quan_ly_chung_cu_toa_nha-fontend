import { useState } from 'react';
import { message } from 'antd';
import {
  getStaffMetrics,
  getStaffTasks,
  updateStaffTaskStatus,
  getStaffRecentLogs,
} from '@/services/Dashboard';

export interface TaskItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: string;
}

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  const handleGetStaffData = async () => {
    setLoading(true);
    try {
      const [resMetrics, resTasks, resLogs] = await Promise.allSettled([
        getStaffMetrics(),
        getStaffTasks(),
        getStaffRecentLogs(),
      ]);

      if (resMetrics.status === 'fulfilled' && resMetrics.value?.success) {
        setStaffInfo(resMetrics.value.data.staff_info);
        setMetrics(resMetrics.value.data.metrics);
      }
      if (resTasks.status === 'fulfilled' && resTasks.value?.success) {
        setTasks(resTasks.value.data);
      }
      if (resLogs.status === 'fulfilled' && resLogs.value?.success) {
        setRecentLogs(resLogs.value.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu Dashboard Nhân viên:', error);
      message.error('Không thể kết nối máy chủ để tải dữ liệu thống kê.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStaffTaskStatus = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    try {
      const res = await updateStaffTaskStatus(id, nextStatus);
      if (res?.success) {
        const updatedTasks = tasks.map((task) => {
          if (task.id === id) {
            return { ...task, completed: nextStatus };
          }
          return task;
        });
        setTasks(updatedTasks);

        const completedCount = updatedTasks.filter((t) => t.completed).length;
        setMetrics((prev: any) =>
          prev
            ? {
                ...prev,
                today_tasks_done: completedCount,
                today_tasks_total: updatedTasks.length,
              }
            : null,
        );
        message.success('Đã cập nhật trạng thái công việc!');
        return res;
      } else {
        message.error(res?.message || 'Không thể cập nhật trạng thái công việc.');
        return res;
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái công việc:', error);
      message.error('Đã xảy ra lỗi khi kết nối máy chủ.');
      throw error;
    }
  };

  return {
    loading,
    setLoading,
    staffInfo,
    metrics,
    setMetrics,
    tasks,
    setTasks,
    recentLogs,
    handleGetStaffData,
    handleUpdateStaffTaskStatus,
  };
};
