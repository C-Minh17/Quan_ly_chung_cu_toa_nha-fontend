import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select, Switch } from 'antd';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { useEffect } from 'react';
import MyDatePicker from '@/components/MyDatePicker';
import SelectAccount from '@/pages/Quan-ly-tai-khoan/components/Select';
import SelectApartment from '@/pages/Quan-ly-can-ho/components/Select';

interface Props {
  initialValues?: MResident.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormResident = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateResident, loadingInfoResident, handleCreateResident } = useModel('resident.resident');
  const { infoAllUser, handleGetInfoAllUser } = useModel('user.user');
  const [form] = Form.useForm();

  useEffect(() => {
    handleGetInfoAllUser();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const id_card_front_image = await buildUpLoadFile(values, 'id_card_front_image');
      const id_card_back_image = await buildUpLoadFile(values, 'id_card_back_image');

      const payload = {
        ...values,
        id_card_front_image,
        id_card_back_image,
      };

      if (edit) {
        const res = await handleUpdateResident(initialValues?._id as string, payload);
        if (res) {
          message.success('Cập nhật thông tin dân cư thành công');
        }
      } else {
        const res = await handleCreateResident(payload);
        if (res) {
          message.success('Thêm dân cư thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? "Cập nhật dân cư" : "Thêm mới dân cư"}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="user_id"
              label="Tài khoản người dùng"
              rules={[{ required: true, message: 'Vui lòng chọn tài khoản!' }]}
            >
              <SelectAccount
                value={form.getFieldValue('user_id')}
                onChange={(val) => form.setFieldsValue({ user_id: val })}
                multiple={false}
                hasCreate={true}
                filter="RESIDENT"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="apartment_id"
              label="ID Căn hộ"
              rules={[{ required: true, message: 'Vui lòng nhập ID căn hộ!' }]}
            >
              <SelectApartment
                value={form.getFieldValue('apartment_id')}
                onChange={(val) => form.setFieldsValue({ apartment_id: val })}
                multiple={false}
                hasCreate={true}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="id_card_number" label="Số CCCD" rules={[{ required: true, message: 'Vui lòng nhập số CCCD!' }]}>
              <Input placeholder="Số CCCD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="id_card_date" label="Ngày cấp" rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}>
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="id_card_place" label="Nơi cấp" rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}>
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="id_card_front_image" label="Ảnh CCCD mặt trước" rules={[{ required: true, message: 'Vui lòng upload ảnh mặt trước!' }]}>
              <UploadFile isAvatar />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="id_card_back_image" label="Ảnh CCCD mặt sau" rules={[{ required: true, message: 'Vui lòng upload ảnh mặt sau!' }]}>
              <UploadFile isAvatar />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="date_of_birth" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
              <Select options={[
                { value: 'male', label: 'Nam' },
                { value: 'female', label: 'Nữ' },
                { value: 'other', label: 'Khác' },
              ]} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="resident_type" label="Loại cư dân" rules={[{ required: true, message: 'Vui lòng chọn loại cư dân!' }]}>
              <Select options={[
                { value: 'owner', label: 'Chủ hộ' },
                { value: 'tenant', label: 'Người thuê' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="permanent_address" label="Địa chỉ thường trú" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ thường trú!' }]}>
              <Input.TextArea rows={2} placeholder="Địa chỉ thường trú" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="move_in_date" label="Ngày chuyển đến" rules={[{ required: true, message: 'Vui lòng chọn ngày chuyển đến!' }]}>
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="move_out_date" label="Ngày chuyển đi" rules={[{ required: true, message: 'Vui lòng chọn ngày chuyển đi!' }]}>
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="is_primary" label="Là cư dân chính" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className='form-footer'>
          <Button type="primary" htmlType="submit" loading={loadingInfoResident}>
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

export default FormResident;
