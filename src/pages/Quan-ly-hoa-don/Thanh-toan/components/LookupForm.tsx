import React, { useState } from 'react';
import { Form, Button, Row, Col, Select, InputNumber, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import SelectApartment from '@/pages/Quan-ly-can-ho/components/Select';
import SelectInvoice from '@/pages/Quan-ly-hoa-don/Danh-sach-hoa-don/components/Select';

const { Option } = Select;

interface LookupFormProps {
  form: any;
  loading?: boolean;
  onFinish: (payload: any) => void;
}

const LookupForm: React.FC<LookupFormProps> = ({ form, loading, onFinish }) => {
  const [lookupMode, setLookupMode] = useState<'code' | 'apartment'>('code');

  const handleSubmit = (values: any) => {
    const payload =
      lookupMode === 'code'
        ? { invoice_code: values.invoice_code }
        : {
          apartment_id: values.apartment_id,
          billing_month: values.billing_month,
          billing_year: values.billing_year,
        };
    onFinish(payload);
  };

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return (
    <div>
      <Space style={{ marginBottom: 20 }} size="small">
        <Button
          type={lookupMode === 'code' ? 'primary' : 'default'}
          onClick={() => setLookupMode('code')}
          shape="round"
        >
          Tra theo mã hóa đơn
        </Button>
        <Button
          type={lookupMode === 'apartment' ? 'primary' : 'default'}
          onClick={() => setLookupMode('apartment')}
          shape="round"
        >
          Tra theo căn hộ
        </Button>
      </Space>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          billing_month: currentMonth,
          billing_year: currentYear,
        }}
      >
        {lookupMode === 'code' ? (
          <Form.Item
            name="invoice_code"
            label="Mã hóa đơn"
            rules={[{ required: true, message: 'Vui lòng chọn mã hóa đơn' }]}
          >
            <SelectInvoice hasCreate={false} placeholder="Chọn mã hóa đơn" />
          </Form.Item>
        ) : (
          <>
            <Form.Item
              name="apartment_id"
              label="Căn hộ"
              rules={[{ required: true, message: 'Vui lòng chọn căn hộ' }]}
            >
              <SelectApartment hasCreate={false} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="billing_month"
                  label="Tháng"
                  rules={[{ required: true, message: 'Chọn tháng' }]}
                >
                  <Select placeholder="Chọn tháng">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <Option key={m} value={m}>Tháng {m}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="billing_year"
                  label="Năm"
                  rules={[{ required: true, message: 'Nhập năm' }]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="2026"
                    min={2020}
                    max={2100}
                  />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <Form.Item style={{ marginBottom: 0, marginTop: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
            block
            size="large"
            style={{ borderRadius: 8 }}
          >
            Tra Cứu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LookupForm;
