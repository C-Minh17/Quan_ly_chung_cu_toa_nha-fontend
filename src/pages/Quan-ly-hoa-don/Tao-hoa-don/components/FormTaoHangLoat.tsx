import { ThunderboltOutlined } from '@ant-design/icons';
import { useModel } from "@umijs/max";
import { Button, Card, Form, message, Select } from 'antd';
import { useEffect } from 'react';

const { Option } = Select;

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const yearOptions = [2024, 2025, 2026, 2027, 2028];

const FormTaoHangLoat = () => {
  const { loadingInfoInvoice, handleGenerateInvoices } = useModel("invoice.invoice");

  const [form] = Form.useForm();

  useEffect(() => {
    const now = new Date();
    form.setFieldsValue({
      billing_month: now.getMonth() + 1,
      billing_year: now.getFullYear(),
    });
  }, []);

  const onFinish = async (values: any) => {
    const res = await handleGenerateInvoices(values);
    if (res !== undefined) {
      message.success('Tạo hóa đơn hàng loạt thành công!');
      form.resetFields();
    } else {
      message.error('Tạo hóa đơn thất bại, vui lòng thử lại!');
    }
  };

  return (
    <Card style={{ maxWidth: 480, margin: '0 auto' }}>
      <p style={{ color: '#8c8c8c', marginBottom: 24 }}>
        Hệ thống sẽ tự động tạo hóa đơn cho <b>tất cả căn hộ</b> dựa trên kỳ thanh toán được chọn.
      </p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Tháng thanh toán"
          name="billing_month"
          rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
        >
          <Select style={{ width: '100%' }} placeholder="Tháng">
            {monthOptions.map(m => <Option key={m} value={m}>Tháng {m}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="Năm thanh toán"
          name="billing_year"
          rules={[{ required: true, message: 'Vui lòng chọn năm' }]}
        >
          <Select style={{ width: '100%' }} placeholder="Năm">
            {yearOptions.map(y => <Option key={y} value={y}>{y}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary" htmlType="submit"
            loading={loadingInfoInvoice}
            icon={<ThunderboltOutlined />}
            style={{ width: '100%' }}
          >
            Tạo hóa đơn hàng loạt
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTaoHangLoat;
