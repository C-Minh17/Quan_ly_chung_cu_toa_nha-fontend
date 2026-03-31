import { useAccess, useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select, Switch } from 'antd';

interface Props {
  initialValues?: MUser.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}
const FormAccount = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateUser, loadingInfoUser, handleCreateAccount } = useModel('user.user')
  const [form] = Form.useForm();

  const access = useAccess();

  const onSubmit = async (values: MUser.IRecord) => {
    try {
      if (edit) {
        const res = await handleUpdateUser(initialValues?._id as string, values)
        if (res) {
          message.success('Cập nhật tài khoản thành công')
        }
        form.resetFields()
        setShowEdit?.(false)
      } else {
        const res = await handleCreateAccount(values)
        if (res) {
          message.success('Tạo tài khoản thành công')
        }
        form.resetFields()
        setShowEdit?.(false)
      }
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
          {!edit ?
            <Col span={24}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
            </Col> : null}
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
              {edit ? <Input disabled={true} /> :
                access.canAccessSuperAdmin ? <Select
                  options={[
                    { value: 'RESIDENT', label: 'Cư dân' },
                    { value: 'MANAGER', label: 'Quản lý' },
                    { value: 'SUPER_ADMIN', label: 'Quản trị viên' },
                  ]}
                /> : <Select
                  options={[
                    { value: 'RESIDENT', label: 'Cư dân' },
                    { value: 'MANAGER', label: 'Quản lý' },
                  ]}
                />}
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
              {edit ? 'Cập nhật' : 'Tạo'}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormAccount;
