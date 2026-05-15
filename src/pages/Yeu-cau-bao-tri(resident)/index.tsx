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
    handleGetMyMaintenanceRequest,
    handleDeleteMaintenanceRequest,
    handleCloseMaintenanceRequest,
  } = useModel("maintenanceRequest.maintenanceRequest");

  const [showEditRequest, setShowEditRequest] = useState(false);
  const [recordRequest, setRecordRequest] = useState<MMaintenanceRequest.IRecord | {}>({});
  const [editRequest, setEditRequest] = useState(false);

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
                  handleGetMyMaintenanceRequest();
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
                  handleGetMyMaintenanceRequest();
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
    handleGetMyMaintenanceRequest();
  }, [refreshRequest]);

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 24 }}>Yêu cầu bảo trì của tôi</Title>
      <TableStaticData
        columns={requestColumns}
        data={infoAllMaintenanceRequest || []}
        loading={loadingInfoAllMaintenanceRequest}
        showEdit={showEditRequest}
        hasCreate={true}
        onReload={() => handleGetMyMaintenanceRequest()}
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
    </>
  );
};

export default ManagerMaintenance;
