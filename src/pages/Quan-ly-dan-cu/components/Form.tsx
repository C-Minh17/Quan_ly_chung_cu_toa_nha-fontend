import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, message, Row, Select, Switch } from 'antd';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { useEffect } from 'react';
import MyDatePicker from '@/components/MyDatePicker';

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
              <Select
                showSearch
                placeholder="Chọn tài khoản"
                optionFilterProp="children"
                options={infoAllUser?.map(user => ({
                  value: user._id,
                  label: `${user.name} (${user.preferred_username})`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="apartment_id"
              label="ID Căn hộ"
              rules={[{ required: true, message: 'Vui lòng nhập ID căn hộ!' }]}
            >
              <Input placeholder="ID Căn hộ" />
            </Form.Item>
          </Col>
          
          <Col span={8}>
            <Form.Item name="id_card_number" label="Số CCCD" rules={[{ required: true }]}>
              <Input placeholder="Số CCCD" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="id_card_date" label="Ngày cấp">
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="id_card_place" label="Nơi cấp">
              <Input placeholder="Nơi cấp" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="id_card_front_image" label="Ảnh CCCD mặt trước">
              <UploadFile isAvatar />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="id_card_back_image" label="Ảnh CCCD mặt sau">
              <UploadFile isAvatar />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="date_of_birth" label="Ngày sinh">
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="gender" label="Giới tính">
              <Select options={[
                { value: 'MALE', label: 'Nam' },
                { value: 'FEMALE', label: 'Nữ' },
                { value: 'OTHER', label: 'Khác' },
              ]} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="resident_type" label="Loại cư dân">
              <Select options={[
                { value: 'OWNER', label: 'Chủ hộ' },
                { value: 'FAMILY_MEMBER', label: 'Thành viên gia đình' },
                { value: 'TENANT', label: 'Khách thuê' },
              ]} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="permanent_address" label="Địa chỉ thường trú">
              <Input.TextArea rows={2} placeholder="Địa chỉ thường trú" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="move_in_date" label="Ngày chuyển đến">
              <MyDatePicker />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="move_out_date" label="Ngày chuyển đi">
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
