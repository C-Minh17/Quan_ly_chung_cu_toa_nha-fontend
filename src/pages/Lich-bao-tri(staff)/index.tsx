import React, { useEffect, useMemo, useState } from 'react';
import { getAllMaintenanceRequest, updateMaintenanceRequestStatus } from '@/services/MaintenanceRequest';
import { completeMaintenanceSchedule, getMaintenanceScheduleByEmployee } from '@/services/MaintenanceSchedule';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, ReloadOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Badge, Button, Input, Popconfirm, Select, Table, Tag, Tooltip, Typography, message } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const SCHEDULE_STATUS_TAG: Record<string, string> = { scheduled: 'processing', completed: 'success', cancelled: 'default' };
const SCHEDULE_STATUS_LABEL: Record<string, string> = { scheduled: 'Đã lên lịch', completed: 'Hoàn thành', cancelled: 'Đã hủy' };
const FREQ_LABEL: Record<string, string> = { once: 'Một lần', weekly: 'Hàng tuần', monthly: 'Hàng tháng', quarterly: 'Hàng quý', yearly: 'Hàng năm' };
const FREQ_COLOR: Record<string, string> = { once: 'default', weekly: 'blue', monthly: 'purple', quarterly: 'orange', yearly: 'red' };
const REQUEST_STATUS_TAG: Record<string, string> = { new: 'warning', assigned: 'processing', in_progress: 'purple', completed: 'success', closed: 'default' };
const REQUEST_STATUS_LABEL: Record<string, string> = { new: 'Mới', assigned: 'Đã phân công', in_progress: 'Đang xử lý', completed: 'Hoàn thành', closed: 'Đã đóng' };
const PRIORITY_COLOR: Record<string, string> = { low: 'default', medium: 'blue', high: 'orange', urgent: 'red' };
const PRIORITY_LABEL: Record<string, string> = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' };

interface IRow {
  key: string;
  _id: string;
  code: string;
  title: string;
  description: string;
  date: string;
  status: string;
  type: 'schedule' | 'request';
  frequency?: string;
  priority?: string;
  category?: string;
}

const StaffMaintenancePage = () => {
  const { initialState } = useModel('@@initialState');
  const userId = initialState?.currentUser?.ssoId;

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRow[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  const fetchAll = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [resSchedule, resRequest] = await Promise.allSettled([
        getMaintenanceScheduleByEmployee(userId),
        getAllMaintenanceRequest(),
      ]);

      const scheduleRows: IRow[] = [];
      if (resSchedule.status === 'fulfilled' && resSchedule.value?.success) {
        for (const s of resSchedule.value.data || []) {
          scheduleRows.push({
            key: s._id,
            _id: s._id,
            code: s.Maintenance_Schedules_id,
            title: s.title,
            description: s.description,
            date: s.scheduled_date,
            status: s.status,
            type: 'schedule',
            frequency: s.frequency,
          });
        }
      }

      const requestRows: IRow[] = [];
      if (resRequest.status === 'fulfilled' && resRequest.value?.success) {
        for (const r of resRequest.value.data || []) {
          const at = r.assigned_to;
          const atId = typeof at === 'string' ? at : (at as any)?._id?.toString();
          if (atId !== userId) continue;
          requestRows.push({
            key: r._id,
            _id: r._id,
            code: r.Maintenance_Requests_code,
            title: r.title,
            description: r.description,
            date: r.created_at,
            status: r.status,
            type: 'request',
            priority: r.priority,
            category: r.category,
          });
        }
      }

      setRows([...scheduleRows, ...requestRows]);
    } catch {
      message.error('Lỗi kết nối.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSchedule = async (id: string) => {
    try {
      const res = await completeMaintenanceSchedule(id);
      if (res?.success !== false) {
        const next = res?.data?.nextSchedule;
        message.success(next
          ? `Hoàn thành! Lịch kỳ tiếp theo: ${new Date(next.scheduled_date).toLocaleDateString('vi-VN')}`
          : 'Đã xác nhận hoàn thành lịch bảo trì!');
        fetchAll();
      } else message.error(res?.message || 'Không thể xác nhận.');
    } catch { message.error('Lỗi kết nối.'); }
  };

  const handleCompleteRequest = async (id: string) => {
    try {
      const res = await updateMaintenanceRequestStatus(id, 'completed');
      if (res?.success !== false) { message.success('Đã xác nhận hoàn thành!'); fetchAll(); }
      else message.error(res?.message || 'Không thể xác nhận.');
    } catch { message.error('Lỗi kết nối.'); }
  };

  useEffect(() => { if (userId) fetchAll(); }, [userId]);

  const filtered = useMemo(() => {
    let data = rows;
    if (typeFilter !== 'all') data = data.filter((r) => r.type === typeFilter);
    if (statusFilter === 'active') data = data.filter((r) => !['completed', 'closed', 'cancelled'].includes(r.status));
    else if (statusFilter === 'done') data = data.filter((r) => ['completed', 'closed', 'cancelled'].includes(r.status));
    const kw = search.trim().toLowerCase();
    if (kw) data = data.filter((r) => r.title?.toLowerCase().includes(kw) || r.code?.toLowerCase().includes(kw));
    return data;
  }, [rows, typeFilter, statusFilter, search]);

  const stats = useMemo(() => {
    const active = rows.filter((r) => !['completed', 'closed', 'cancelled'].includes(r.status)).length;
    const done = rows.filter((r) => ['completed', 'closed', 'cancelled'].includes(r.status)).length;
    const schedules = rows.filter((r) => r.type === 'schedule').length;
    const requests = rows.filter((r) => r.type === 'request').length;
    return { active, done, schedules, requests };
  }, [rows]);

  const columns = [
    {
      title: 'Loại',
      dataIndex: 'type',
      width: 130,
      render: (type: string) =>
        type === 'schedule'
          ? <Tag icon={<CalendarOutlined />} color="blue">Lịch định kỳ</Tag>
          : <Tag icon={<ToolOutlined />} color="orange">Yêu cầu cư dân</Tag>,
    },
    {
      title: 'Mã',
      dataIndex: 'code',
      width: 100,
      render: (code: string) => <Text type="secondary" style={{ fontSize: 12 }}>{code}</Text>,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      render: (title: string, row: IRow) => (
        <div>
          <div style={{ fontWeight: 600 }}>{title}</div>
          {row.description && <Text type="secondary" style={{ fontSize: 12 }}>{row.description.slice(0, 60)}{row.description.length > 60 ? '...' : ''}</Text>}
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      width: 110,
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '—',
      sorter: (a: IRow, b: IRow) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime(),
    },
    {
      title: 'Chi tiết',
      width: 130,
      render: (_: any, row: IRow) => row.type === 'schedule'
        ? <Tag color={FREQ_COLOR[row.frequency || ''] || 'default'}>{FREQ_LABEL[row.frequency || ''] || row.frequency}</Tag>
        : <Tag color={PRIORITY_COLOR[row.priority || ''] || 'default'}>{PRIORITY_LABEL[row.priority || ''] || row.priority}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (status: string, row: IRow) =>
        row.type === 'schedule'
          ? <Tag color={SCHEDULE_STATUS_TAG[status] || 'default'}>{SCHEDULE_STATUS_LABEL[status] || status}</Tag>
          : <Tag color={REQUEST_STATUS_TAG[status] || 'default'}>{REQUEST_STATUS_LABEL[status] || status}</Tag>,
    },
    {
      title: '',
      width: 130,
      render: (_: any, row: IRow) => {
        const isDone = ['completed', 'closed', 'cancelled'].includes(row.status);
        if (isDone) return <Text type="secondary" style={{ fontSize: 12 }}>—</Text>;
        return (
          <Popconfirm
            title="Xác nhận hoàn thành?"
            onConfirm={() => row.type === 'schedule' ? handleCompleteSchedule(row._id) : handleCompleteRequest(row._id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button type="primary" size="small" icon={<CheckCircleOutlined />} style={{ borderRadius: 6 }}>
              Hoàn thành
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, gap: 16 }}>
        <div style={{ width: 44, height: 44, backgroundColor: '#1677ff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ToolOutlined style={{ fontSize: 20, color: 'white' }} />
        </div>
        <div>
          <Title level={4} style={{ margin: 0 }}>Công việc bảo trì của tôi</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Lịch định kỳ & yêu cầu từ cư dân được phân công</Text>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1677ff' }}>{stats.active}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Cần xử lý</Text>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'green' }}>{stats.done}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Đã xong</Text>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{stats.schedules}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Lịch định kỳ</Text>
          </div>
          <div style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'orange' }}>{stats.requests}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>Yêu cầu</Text>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' as const }}>
        <Input
          prefix={<SearchOutlined />}
          allowClear
          placeholder="Tìm theo tiêu đề, mã..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 280 }}
        />
        <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 160 }}>
          <Option value="active">
            <Badge status="processing" text="Chưa hoàn thành" />
          </Option>
          <Option value="done">
            <Badge status="success" text="Đã xong" />
          </Option>
          <Option value="all">Tất cả</Option>
        </Select>
        <Select value={typeFilter} onChange={setTypeFilter} style={{ width: 160 }}>
          <Option value="all">Tất cả loại</Option>
          <Option value="schedule">Lịch định kỳ</Option>
          <Option value="request">Yêu cầu cư dân</Option>
        </Select>
        <Tooltip title="Tải lại">
          <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading} />
        </Tooltip>
        <Text type="secondary" style={{ marginLeft: 'auto', alignSelf: 'center', fontSize: 12 }}>
          {filtered.length} / {rows.length} mục
        </Text>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        loading={loading}
        rowKey="key"
        size="middle"
        pagination={{ pageSize: 15, showSizeChanger: false, showTotal: (total) => `${total} mục` }}
        rowClassName={(row) => ['completed', 'closed', 'cancelled'].includes(row.status) ? 'ant-table-row-disabled' : ''}
      />
    </div>
  );
};

export default StaffMaintenancePage;
