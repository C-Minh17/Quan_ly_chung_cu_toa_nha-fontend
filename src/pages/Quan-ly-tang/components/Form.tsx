import SelectBuilding from '@/pages/Quan-ly-toa-nha/components/Select';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect } from 'react';

interface Props {
  initialValues?: MFloor.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormFloor = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateFloor, loadingInfoFloor, handleCreateFloor } = useModel('floor.floor');
  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel('building.building');

  const [form] = Form.useForm();

  useEffect(() => {
    handleGetInfoAllBuilding();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      if (edit) {
        const res = await handleUpdateFloor(initialValues?._id as string, values);
        if (res) {
          message.success('Cập nhật thông tin tầng thành công');
        }
      } else {
        const res = await handleCreateFloor(values);
        if (res) {
          message.success('Thêm mới tầng thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? "Cập nhật tầng" : "Thêm mới tầng"}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên tầng"
              rules={[{ required: true, message: 'Vui lòng nhập tên tầng!' }]}
            >
              <Input placeholder="Ví dụ: Tầng 1" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="floor_number"
              label="Số thứ tự tầng"
              rules={[{ required: true, message: 'Vui lòng nhập số tầng!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 1" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="building_id"
              label="Tòa nhà"
              rules={[{ required: true, message: 'Vui lòng chọn tòa nhà!' }]}
            >
              <SelectBuilding
                value={form.getFieldValue('building_id')}
                onChange={(val) => form.setFieldsValue({ building_id: val })}
                multiple={false}
                hasCreate={true}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả / Ghi chú">
              <Input.TextArea rows={3} placeholder="Mô tả về tầng" />
            </Form.Item>
          </Col>
        </Row>

        <div className='form-footer' style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoFloor}>
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

export default FormFloor;
