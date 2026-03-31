import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';

interface Props {
  initialValues?: MUser.IRecord;
  setShowEdit?: (value: boolean) => void;
}
const FormAccount = (props: Props) => {
  const { initialValues, setShowEdit } = props;
  const { handleUpdateUser, loadingInfoUser } = useModel('user.user')
  const [form] = Form.useForm();

  const onSubmit = async (values: MUser.IRecord) => {
    try {
      await handleUpdateUser(initialValues?._id as string, values)
      form.resetFields()
      setShowEdit?.(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Card title={"Cập nhật tài khoản"}>
      <Form form={form} initialValues={initialValues} onFinish={onSubmit}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="preferred_username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input placeholder="Tên đăng nhập" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="family_name"
              label="Họ"
            >
              <Input placeholder="Họ" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="given_name"
              label="Tên"
            >
              <Input placeholder="Tên" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
            >
              <Input placeholder="Số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="role"
              label="Vai trò (Role)"
              rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            >
              <Input disabled={true} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="is_active"
              label="Hoạt động"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button type="primary" htmlType="submit" loading={loadingInfoUser}>
              Cập nhật
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormAccount;
