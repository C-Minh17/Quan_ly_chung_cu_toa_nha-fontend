import { useModel } from '@umijs/max';
import { Button, Card, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface Props {
  initialValues?: MMaintenanceSchedule.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Một lần' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' },
];

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const FormMaintenanceSchedule = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const {
    handleCreateMaintenanceSchedule,
    handleUpdateMaintenanceSchedule,
    loadingInfoMaintenanceSchedule,
  } = useModel('maintenanceSchedule.maintenanceSchedule');
  const { infoAllUser, handleGetInfoAllUser } = useModel('user.user');

  const [form] = Form.useForm();

  useEffect(() => {
    handleGetInfoAllUser();
  }, []);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue({
        ...initialValues,
        scheduled_date: initialValues.scheduled_date ? dayjs(initialValues.scheduled_date) : undefined,
        assigned_to: (initialValues as any)?.assigned_to?._id || initialValues.assigned_to,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        scheduled_date: values.scheduled_date ? values.scheduled_date.toISOString() : undefined,
      };
      if (edit) {
        const res = await handleUpdateMaintenanceSchedule(initialValues?._id as string, payload);
        if (res) message.success('Cập nhật lịch bảo trì thành công');
      } else {
        const res = await handleCreateMaintenanceSchedule(payload);
        if (res) message.success('Tạo lịch bảo trì thành công');
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? 'Cập nhật lịch bảo trì' : 'Thêm lịch bảo trì'}>
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
              <Input placeholder="Ví dụ: Kiểm tra hệ thống điện" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="frequency" label="Tần suất" rules={[{ required: true, message: 'Vui lòng chọn tần suất!' }]}>
              <Select placeholder="Chọn tần suất" options={FREQUENCY_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="scheduled_date" label="Ngày thực hiện">
              <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="assigned_to" label="Nhân viên kỹ thuật (STAFF)" rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}>
              <Select
                showSearch
                placeholder="Chọn nhân viên kỹ thuật"
                optionFilterProp="label"
                options={infoAllUser
                  ?.filter((u: any) => u.role === 'STAFF')
                  .map((u: any) => ({
                    value: u._id,
                    label: u.name,
                  }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" initialValue="scheduled">
              <Select placeholder="Chọn trạng thái" options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
              <Input.TextArea rows={3} placeholder="Mô tả chi tiết công việc cần thực hiện..." />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer" style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoMaintenanceSchedule}>
            {edit ? 'Lưu lại' : 'Thêm mới'}
          </Button>
          <Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>Hủy</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormMaintenanceSchedule;
