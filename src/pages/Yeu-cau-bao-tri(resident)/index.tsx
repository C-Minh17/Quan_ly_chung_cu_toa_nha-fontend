import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { useModel } from "@umijs/max";
import { DeleteOutlined, EditOutlined, CloseCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Rate, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import FormMaintenanceRequest from './components/FormRequest';

const { Title } = Typography;

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

const ResidentMaintenance = () => {
  const {
    refreshKey: refreshRequest,
    infoAllMaintenanceRequest,
    loadingInfoAllMaintenanceRequest,
    handleGetMyMaintenanceRequest,
    handleDeleteMaintenanceRequest,
    handleCloseMaintenanceRequest,
    handleRateMaintenanceRequest,
  } = useModel("maintenanceRequest.maintenanceRequest");

  const [showEditRequest, setShowEditRequest] = useState(false);
  const [recordRequest, setRecordRequest] = useState<MMaintenanceRequest.IRecord | {}>({});
  const [editRequest, setEditRequest] = useState(false);

  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingRecord, setRatingRecord] = useState<MMaintenanceRequest.IRecord | null>(null);
  const [rateForm] = Form.useForm();
  const [loadingRate, setLoadingRate] = useState(false);

  const handleOpenRate = (record: MMaintenanceRequest.IRecord) => {
    setRatingRecord(record);
    rateForm.setFieldsValue({
      rating: record.rating || 5,
      feedback: record.feedback || '',
    });
    setShowRateModal(true);
  };

  const handleSubmitRate = async (values: { rating: number; feedback?: string }) => {
    if (!ratingRecord?._id) return;
    setLoadingRate(true);
    try {
      await handleRateMaintenanceRequest(ratingRecord._id, {
        rating: values.rating,
        feedback: values.feedback,
      });
      message.success('Đánh giá thành công! Cảm ơn bạn đã phản hồi.');
      setShowRateModal(false);
      rateForm.resetFields();
      handleGetMyMaintenanceRequest();
    } catch {
      message.error('Đánh giá thất bại, vui lòng thử lại.');
    } finally {
      setLoadingRate(false);
    }
  };

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
      title: "Đánh giá",
      align: "center",
      dataIndex: "rating",
      width: 130,
      render: (v: number, r: MMaintenanceRequest.IRecord) =>
        (r.status === 'completed' || r.status === 'closed') && v
          ? <Rate disabled defaultValue={v} style={{ fontSize: 14 }} />
          : null,
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
      width: 160,
      fixed: 'right',
      render: (r: MMaintenanceRequest.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              disabled={r.status !== 'new'}
              onClick={() => {
                setRecordRequest(r);
                setShowEditRequest(true);
                setEditRequest(true);
              }}
            />
          </Tooltip>
          <Tooltip title={r.rating ? 'Xem / Sửa đánh giá' : 'Đánh giá dịch vụ'}>
            <Button
              type="link"
              icon={<StarOutlined />}
              style={{ color: r.rating ? '#faad14' : undefined }}
              disabled={r.status !== 'completed' && r.status !== 'closed'}
              onClick={() => handleOpenRate(r)}
            />
          </Tooltip>
          <Tooltip title={r.status === 'new' ? 'Đóng yêu cầu' : 'Không thể đóng khi đã được phân công'}>
            <Popconfirm
              title="Đóng yêu cầu này?"
              placement="topLeft"
              onConfirm={() => {
                handleCloseMaintenanceRequest(r._id as string).then(() => {
                  message.success('Đã đóng yêu cầu');
                  handleGetMyMaintenanceRequest();
                });
              }}
              disabled={r.status !== 'new'}
            >
              <Button type="link" icon={<CloseCircleOutlined />} disabled={r.status !== 'new'} />
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

      <Modal
        title={
          <span>
            <StarOutlined style={{ color: '#faad14', marginRight: 8 }} />
            Đánh giá dịch vụ bảo trì
          </span>
        }
        open={showRateModal}
        onCancel={() => { setShowRateModal(false); rateForm.resetFields(); }}
        footer={null}
        width={460}
      >
        {ratingRecord && (
          <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f5f5f5', borderRadius: 6 }}>
            <strong>{(ratingRecord as MMaintenanceRequest.IRecord).Maintenance_Requests_code}</strong>
            {' — '}
            {(ratingRecord as MMaintenanceRequest.IRecord).title}
          </div>
        )}
        <Form form={rateForm} layout="vertical" onFinish={handleSubmitRate}>
          <Form.Item
            name="rating"
            label="Điểm đánh giá (1–5 sao)"
            rules={[{ required: true, message: 'Vui lòng chọn điểm!' }]}
          >
            <Rate />
          </Form.Item>
          <Form.Item name="feedback" label="Phản hồi (tuỳ chọn)">
            <Input.TextArea
              rows={3}
              placeholder="Nhận xét về chất lượng dịch vụ, thái độ nhân viên..."
            />
          </Form.Item>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button onClick={() => { setShowRateModal(false); rateForm.resetFields(); }}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loadingRate} icon={<StarOutlined />}>
              Gửi đánh giá
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default ResidentMaintenance;
