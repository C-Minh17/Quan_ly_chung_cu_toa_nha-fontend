import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row } from 'antd';

interface Props {
  initialValues?: MBuilding.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormBuilding = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateBuilding, loadingInfoBuilding, handleCreateBuilding } = useModel('building.building');
  const [form] = Form.useForm();

  const onSubmit = async (values: any) => {
    try {
      if (edit) {
        const res = await handleUpdateBuilding(initialValues?._id as string, values);
        if (res) {
          message.success('Cập nhật thông tin tòa nhà thành công');
        }
      } else {
        const res = await handleCreateBuilding(values);
        if (res) {
          message.success('Thêm mới tòa nhà thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? "Cập nhật tòa nhà" : "Thêm mới tòa nhà"}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>

          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên tòa nhà"
              rules={[{ required: true, message: 'Vui lòng nhập tên tòa nhà!' }]}
            >
              <Input placeholder="Tên tòa nhà" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
              <Input placeholder="Địa chỉ tòa nhà" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="total_floors" label="Số tầng" rules={[{ required: true, message: 'Vui lòng nhập số tầng!' }]}>
              <InputNumber style={{ width: '100%' }} min={1} placeholder="Ví dụ: 10" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả / Ghi chú">
              <Input.TextArea rows={3} placeholder="Mô tả về tòa nhà" />
            </Form.Item>
          </Col>
        </Row>

        <div className='form-footer' style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoBuilding}>
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

export default FormBuilding;
