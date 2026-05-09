import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { useModel } from "@umijs/max";
import { DeleteOutlined, EditOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import FormMaintenanceRequest from './components/FormRequest';
import FormMaintenanceSchedule from './components/FormSchedule';

const { Title } = Typography

const CATEGORY_LABEL: Record<string, string> = {
  electrical: 'Điện', plumbing: 'Nước', structure: 'Kết cấu',
  appliance: 'Thiết bị', other: 'Khác',
};

const PRIORITY_COLOR: Record<string, string> = {
  low: 'default', medium: 'blue', high: 'orange', urgent: 'red',
};

const PRIORITY_LABEL: Record<string, string> = {
  low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp',
};

const REQUEST_STATUS_COLOR: Record<string, string> = {
  new: 'default', assigned: 'blue', in_progress: 'gold', completed: 'green', closed: 'volcano',
};

const REQUEST_STATUS_LABEL: Record<string, string> = {
  new: 'Mới', assigned: 'Đã phân công', in_progress: 'Đang xử lý',
  completed: 'Hoàn thành', closed: 'Đã đóng',
};

const SCHEDULE_STATUS_COLOR: Record<string, string> = {
  scheduled: 'blue', completed: 'green', cancelled: 'default',
};

const SCHEDULE_STATUS_LABEL: Record<string, string> = {
  scheduled: 'Đã lên lịch', completed: 'Hoàn thành', cancelled: 'Đã hủy',
};

const FREQ_LABEL: Record<string, string> = {
  once: 'Một lần', weekly: 'Hàng tuần', monthly: 'Hàng tháng',
  quarterly: 'Hàng quý', yearly: 'Hàng năm',
};

const ManagerMaintenance = () => {
  const {
    refreshKey: refreshRequest,
    infoAllMaintenanceRequest,
    loadingInfoAllMaintenanceRequest,
    handleGetAllMaintenanceRequest,
    handleDeleteMaintenanceRequest,
    handleCloseMaintenanceRequest,
  } = useModel("maintenanceRequest.maintenanceRequest");

  const {
    refreshKey: refreshSchedule,
    infoAllMaintenanceSchedule,
    loadingInfoAllMaintenanceSchedule,
    handleGetAllMaintenanceSchedule,
    handleDeleteMaintenanceSchedule,
    handleCompleteMaintenanceSchedule,
  } = useModel("maintenanceSchedule.maintenanceSchedule");

  const { infoAllApartment, handleGetInfoAllApartment } = useModel("apartment.apartment");

  const [showEditRequest, setShowEditRequest] = useState(false);
  const [recordRequest, setRecordRequest] = useState<MMaintenanceRequest.IRecord | {}>({});
  const [editRequest, setEditRequest] = useState(false);

  const [showEditSchedule, setShowEditSchedule] = useState(false);
  const [recordSchedule, setRecordSchedule] = useState<MMaintenanceSchedule.IRecord | {}>({});
  const [editSchedule, setEditSchedule] = useState(false);

  const requestColumns: IColumn<MMaintenanceRequest.IRecord>[] = [
    {
      title: "Mã YC",
      align: "center",
      dataIndex: "Maintenance_Requests_code",
      width: 110,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 200,
      filterType: "string",
    },
    {
      title: "Căn hộ",
      align: "center",
      width: 110,
      render: (_: any, r: MMaintenanceRequest.IRecord) => {
        const apt = infoAllApartment?.find(a => a._id === r.apartment_id);
        return apt?.apartment_code || r.apartment_id || 'N/A';
      },
    },
    {
      title: "Hạng mục",
      align: "center",
      dataIndex: "category",
      width: 110,
      render: (v: string) => CATEGORY_LABEL[v] || v,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 200,
      filterType: "string",
    },
    {
      title: "Ưu tiên",
      align: "center",
      dataIndex: "priority",
      width: 110,
      render: (v: string) => <Tag color={PRIORITY_COLOR[v]}>{PRIORITY_LABEL[v] || v}</Tag>,
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      width: 140,
      filterType: "string",
      render: (v: string) => <Tag color={REQUEST_STATUS_COLOR[v]}>{REQUEST_STATUS_LABEL[v] || v}</Tag>,
    },
    {
      title: "Ngày tạo",
      align: "center",
      dataIndex: "created_at",
      width: 130,
      render: (v: string) => v ? new Date(v).toLocaleDateString('vi-VN') : '',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (r: MMaintenanceRequest.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setRecordRequest(r);
                setShowEditRequest(true);
                setEditRequest(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Đóng yêu cầu">
            <Popconfirm
              title="Đóng yêu cầu này?"
              placement="topLeft"
              onConfirm={() => {
                handleCloseMaintenanceRequest(r._id as string).then(() => {
                  message.success('Đã đóng yêu cầu');
                  handleGetAllMaintenanceRequest();
                });
              }}
              disabled={r.status === 'closed'}
            >
              <Button type="link" icon={<CloseCircleOutlined />} disabled={r.status === 'closed'} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              placement="topLeft"
              onConfirm={() => {
                handleDeleteMaintenanceRequest(r._id as string).then(() => {
                  handleGetAllMaintenanceRequest();
                });
              }}
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const scheduleColumns: IColumn<MMaintenanceSchedule.IRecord>[] = [
    {
      title: "Mã lịch",
      align: "center",
      dataIndex: "Maintenance_Schedules_id",
      width: 110,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      width: 200,
      filterType: "string",
    },
    {
      title: "Tần suất",
      align: "center",
      dataIndex: "frequency",
      width: 120,
      render: (v: string) => FREQ_LABEL[v] || v,
    },
    {
      title: "Ngày thực hiện",
      align: "center",
      dataIndex: "scheduled_date",
      width: 140,
      render: (v: string) => v ? new Date(v).toLocaleDateString('vi-VN') : '',
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      width: 130,
      filterType: "string",
      render: (v: string) => <Tag color={SCHEDULE_STATUS_COLOR[v]}>{SCHEDULE_STATUS_LABEL[v] || v}</Tag>,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (r: MMaintenanceSchedule.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setRecordSchedule(r);
                setShowEditSchedule(true);
                setEditSchedule(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Đánh dấu hoàn thành">
            <Popconfirm
              title="Đánh dấu lịch này là hoàn thành?"
              placement="topLeft"
              onConfirm={() => {
                handleCompleteMaintenanceSchedule(r._id as string).then(() => {
                  message.success('Đã hoàn thành lịch bảo trì');
                  handleGetAllMaintenanceSchedule();
                });
              }}
              disabled={r.status === 'completed' || r.status === 'cancelled'}
            >
              <Button
                type="link"
                icon={<CloseCircleOutlined />}
                disabled={r.status === 'completed' || r.status === 'cancelled'}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              placement="topLeft"
              onConfirm={() => {
                handleDeleteMaintenanceSchedule(r._id as string).then(() => {
                  handleGetAllMaintenanceSchedule();
                });
              }}
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  useEffect(() => {
    handleGetAllMaintenanceRequest();
    handleGetInfoAllApartment();
  }, [refreshRequest]);

  useEffect(() => {
    handleGetAllMaintenanceSchedule();
  }, [refreshSchedule]);

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 24 }}>Quản lý bảo trì</Title>

      <Title level={4} style={{ marginBottom: 16 }}>Yêu cầu bảo trì</Title>
      <TableStaticData
        columns={requestColumns}
        data={infoAllMaintenanceRequest || []}
        loading={loadingInfoAllMaintenanceRequest}
        showEdit={showEditRequest}
        hasCreate={true}
        onReload={() => handleGetAllMaintenanceRequest()}
        Form={FormMaintenanceRequest}
        formProps={{
          initialValues: recordRequest,
          setShowEdit: setShowEditRequest,
          edit: editRequest,
        }}
        setShowEdit={(val) => {
          setShowEditRequest(val);
          if (!val) { setRecordRequest({}); setEditRequest(false); }
        }}
        widthDrawer={680}
        addStt
      />

      <Title level={4} style={{ marginTop: 40, marginBottom: 16 }}>Lịch bảo trì</Title>
      <TableStaticData
        columns={scheduleColumns}
        data={infoAllMaintenanceSchedule || []}
        loading={loadingInfoAllMaintenanceSchedule}
        showEdit={showEditSchedule}
        hasCreate={true}
        onReload={() => handleGetAllMaintenanceSchedule()}
        Form={FormMaintenanceSchedule}
        formProps={{
          initialValues: recordSchedule,
          setShowEdit: setShowEditSchedule,
          edit: editSchedule,
        }}
        setShowEdit={(val) => {
          setShowEditSchedule(val);
          if (!val) { setRecordSchedule({}); setEditSchedule(false); }
        }}
        widthDrawer={620}
        addStt
      />
    </>
  );
};

export default ManagerMaintenance;
