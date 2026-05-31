import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import { useEffect } from 'react';

interface Props {
  initialValues?: MMaintenanceRequest.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'electrical', label: 'Điện' },
  { value: 'plumbing', label: 'Nước' },
  { value: 'structure', label: 'Kết cấu' },
  { value: 'appliance', label: 'Thiết bị' },
  { value: 'other', label: 'Khác' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Thấp' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'high', label: 'Cao' },
  { value: 'urgent', label: 'Khẩn cấp' },
];

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'assigned', label: 'Đã phân công' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'closed', label: 'Đã đóng' },
];

const FormMaintenanceRequest = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const {
    handleCreateMaintenanceRequest,
    handleUpdateMaintenanceRequest,
    loadingInfoMaintenanceRequest,
  } = useModel('maintenanceRequest.maintenanceRequest');

  const { infoMeResident, handleGetMeResident } = useModel('resident.resident');

  const [form] = Form.useForm();

  useEffect(() => {
    handleGetMeResident();
  }, []);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue({
        title: initialValues.title,
        category: initialValues.category,
        priority: initialValues.priority,
        status: initialValues.status || 'new',
        description: initialValues.description,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const onSubmit = async (values: any) => {
    try {
      if (!edit) {
        if (!infoMeResident) {
          message.error('Không tìm thấy thông tin cư dân, vui lòng tải lại trang!');
          return;
        }
        values.resident_id = infoMeResident._id;
        values.status = 'new';
      }

      if (edit) {
        const res = await handleUpdateMaintenanceRequest(initialValues?._id as string, values);
        if (res) message.success('Cập nhật yêu cầu bảo trì thành công');
      } else {
        const res = await handleCreateMaintenanceRequest(values);
        if (res) message.success('Tạo yêu cầu bảo trì thành công');
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? 'Cập nhật yêu cầu bảo trì' : 'Thêm yêu cầu bảo trì'}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
              <Input placeholder="Ví dụ: Sửa điện phòng ngủ" />
            </Form.Item>
          </Col>



          <Col span={12}>
            <Form.Item name="category" label="Hạng mục">
              <Select placeholder="Chọn hạng mục" options={CATEGORY_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="priority" label="Mức độ ưu tiên">
              <Select placeholder="Chọn mức độ" options={PRIORITY_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" initialValue="new">
              <Select placeholder="Trạng thái" options={STATUS_OPTIONS} disabled />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết vấn đề..." />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer" style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoMaintenanceRequest}>
            {edit ? 'Lưu lại' : 'Thêm mới'}
          </Button>
          <Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormMaintenanceRequest;
