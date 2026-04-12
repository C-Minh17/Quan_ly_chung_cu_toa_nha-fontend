import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select } from 'antd';
import { useEffect } from 'react';
import SelectResident from '@/pages/Quan-ly-dan-cu/components/Select';

interface Props {
  initialValues?: MVehicle.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormVehicle = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateVehicle, loadingInfoVehicle, handleCreateVehicle } = useModel('vehicle.vehicle');
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const onSubmit = async (values: any) => {
    try {
      if (edit && initialValues?._id) {
        const res = await handleUpdateVehicle(initialValues._id, values);
        if (res) {
          message.success('Cập nhật phương tiện thành công');
        }
      } else {
        const res = await handleCreateVehicle(values);
        if (res) {
          message.success('Thêm mới phương tiện thành công');
        }  
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
      message.error('Đã có lỗi xảy ra');
    }
  };

  return (
    <Card title={edit ? "Cập nhật phương tiện" : "Thêm mới phương tiện"}>
      <Form
        form={form}
        initialValues={{
          vehicle_type: 'motorbike',
          ...initialValues
        }}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="license_plate"
              label="Biển số xe"
              rules={[
                { required: true, message: 'Vui lòng nhập biển số xe!' }
              ]}
            >
              <Input placeholder="Ví dụ: 29A-12345" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="vehicle_type"
              label="Loại xe"
              rules={[{ required: true, message: 'Vui lòng chọn loại xe!' }]}
            >
              <Select options={[
                { value: 'motorbike', label: 'Xe máy' },
                { value: 'car', label: 'Ô tô' },
                { value: 'bicycle', label: 'Xe đạp' },
              ]} placeholder="Chọn loại phương tiện" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="brand"
              label="Thương hiệu"
            >
              <Input placeholder="Ví dụ: Honda, Yamaha, Toyota..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="color"
              label="Màu sắc"
            >
              <Input placeholder="Ví dụ: Đen, Trắng..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="card_number"
              label="Mã thẻ xe"
            >
              <Input placeholder="Nhập mã thẻ quét xe" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="resident_id"
              label="Cư dân (Chủ sở hữu)"
              rules={[{ required: true, message: 'Vui lòng chọn cư dân!' }]}
            >
              <SelectResident
                value={form.getFieldValue('resident_id')}
                onChange={(val) => form.setFieldsValue({ resident_id: val })}
                multiple={false}
                hasCreate={false}
              />
            </Form.Item>
          </Col>

        </Row>

        <div className='form-footer' style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button onClick={() => setShowEdit?.(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loadingInfoVehicle}>
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormVehicle;
