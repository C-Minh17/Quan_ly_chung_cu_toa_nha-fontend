import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Switch } from 'antd';
import { useEffect } from 'react';
import { Select, SelectProps } from 'antd';


interface Props {
  initialValues?: MFeeType.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormFeeType = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateFeeType, loadingInfoFeeType, handleCreateFeeType } = useModel('feeType.feeType');

  const [form] = Form.useForm();

  useEffect(() => {
    if (edit && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [edit, initialValues]);

  const onSubmit = async (values: any) => {
    try {
      if (edit) {
        const res = await handleUpdateFeeType(initialValues?._id as string, values);
        if (res) {
          message.success('Cập nhật loại phí thành công');
        }
      } else {
        const res = await handleCreateFeeType(values);
        if (res) {
          message.success('Thêm mới loại phí thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
      message.error('Có lỗi xảy ra, vui lòng thử lại');
    }
  };

  return (
    <Card title={edit ? "Cập nhật loại phí" : "Thêm mới loại phí"}>
      <Form
        form={form}
        initialValues={initialValues || { is_active: true }}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên loại phí"
              rules={[{ required: true, message: 'Vui lòng nhập tên loại phí!' }]}
            >
              <Input placeholder="Ví dụ: Phí quản lý hàng tháng" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="fee_category"
              label="Danh mục phí"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục phí!' }]}
            >
              <SelectFeeCategory />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="unit"
              label="Đơn vị tính"
              rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
            >
              <SelectUnit />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="unit_price"
              label="Đơn giá (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập đơn giá!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Ví dụ: 10000"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="is_active"
              label="Trạng thái hoạt động"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về loại phí này..." />
            </Form.Item>
          </Col>
        </Row>

        <div className='form-footer' style={{ marginTop: 20, textAlign: 'right' }}>
          <Button onClick={() => setShowEdit?.(false)} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loadingInfoFeeType}>
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};


export const SelectFeeCategory = (props: SelectProps) => {
  const options = [
    { value: 'Phí dịch vụ', label: 'Phí dịch vụ' },
    { value: 'Phí điện', label: 'Phí điện' },
    { value: 'Phí nước', label: 'Phí nước' },
    { value: 'Phí gửi xe', label: 'Phí gửi xe' },
    { value: 'Phí khác', label: 'Phí khác' },
  ];

  return (
    <Select
      placeholder="Chọn danh mục phí"
      options={options}
      {...props}
    />
  );
};

export const SelectUnit = (props: SelectProps) => {
  const options = [
    { value: 'tháng', label: 'Tháng' },
    { value: 'm2', label: 'm2' },
    { value: 'kWh', label: 'kWh' },
    { value: 'm3', label: 'm3' },
    { value: 'lượt', label: 'Lượt' },
    { value: 'chiếc', label: 'Chiếc' },
  ];

  return (
    <Select
      placeholder="Chọn đơn vị"
      options={options}
      {...props}
    />
  );
};

export default FormFeeType;

