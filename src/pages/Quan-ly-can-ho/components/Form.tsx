import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect } from 'react';

interface Props {
  initialValues?: MApartment.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormApartment = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateApartment, loadingInfoApartment, handleCreateApartment } = useModel('apartment.apartment');
  const { infoAllFloor, handleGetInfoAllFloor } = useModel('floor.floor');

  const [form] = Form.useForm();

  useEffect(() => {
    handleGetInfoAllFloor();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      if (edit) {
        const res = await handleUpdateApartment(initialValues?._id as string, values);
        if (res) {
          message.success('Cập nhật thông tin căn hộ thành công');
        }
      } else {
        const res = await handleCreateApartment(values);
        if (res) {
          message.success('Thêm mới căn hộ thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? "Cập nhật căn hộ" : "Thêm mới căn hộ"}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item
              name="apartment_code"
              label="Mã căn hộ"
              rules={[{ required: true, message: 'Vui lòng nhập mã căn hộ!' }]}
            >
              <Input placeholder="Ví dụ: A-0101" />
            </Form.Item>
          </Col> */}

          <Col span={12}>
            <Form.Item
              name="floor_id"
              label="Tầng"
              rules={[{ required: true, message: 'Vui lòng chọn tầng!' }]}
            >
              <Select
                showSearch
                placeholder="Chọn tầng"
                optionFilterProp="children"
                options={infoAllFloor?.map(floor => ({
                  value: floor._id,
                  label: `${floor.name}`
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="area"
              label="Diện tích (m2)"
              rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 75.5" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 15000000" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="num_bedrooms"
              label="Số phòng ngủ"
              rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 2" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="num_bathrooms"
              label="Số phòng tắm"
              rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 2" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="apartment_type"
              label="Loại căn hộ"
              rules={[{ required: true, message: 'Vui lòng nhập loại căn hộ!' }]}
            >
              <Input placeholder="Ví dụ: Tiêu chuẩn, Studio..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select
                placeholder="Chọn trạng thái"
                options={[
                  { value: 'Trống', label: 'Trống' },
                  { value: 'Đã thuê', label: 'Đã thuê' },
                  { value: 'Đã bán', label: 'Đã bán' },
                  { value: 'Đang bảo trì', label: 'Đang bảo trì' },
                ]}
              />
            </Form.Item>
          </Col>

        </Row>

        <div className='form-footer' style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoApartment}>
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>
            Hủy
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormApartment;
