import { FileAddOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from "@umijs/max";
import { Button, Card, Col, Divider, Form, InputNumber, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const yearOptions = [2024, 2025, 2026, 2027, 2028];

const FormTaoThuCong = () => {
  const { loadingInfoInvoice, handleCreateInvoice } = useModel("invoice.invoice");
  const { infoAllApartment, handleGetInfoAllApartment } = useModel("apartment.apartment");
  const { infoAllFeeType, handleGetInfoAllFeeType } = useModel("feeType.feeType");

  const [form] = Form.useForm();
  const [details, setDetails] = useState<{ fee_type_id: string; quantity: number }[]>([
    { fee_type_id: '', quantity: 1 },
  ]);

  useEffect(() => {
    if (handleGetInfoAllApartment) handleGetInfoAllApartment();
    if (handleGetInfoAllFeeType) handleGetInfoAllFeeType();

    const now = new Date();
    form.setFieldsValue({
      billing_month: now.getMonth() + 1,
      billing_year: now.getFullYear(),
    });
  }, []);

  const addDetailRow = () => setDetails(prev => [...prev, { fee_type_id: '', quantity: 1 }]);

  const removeDetailRow = (idx: number) => setDetails(prev => prev.filter((_, i) => i !== idx));

  const updateDetail = (idx: number, field: 'fee_type_id' | 'quantity', value: any) => {
    setDetails(prev => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const onFinish = async (values: any) => {
    const validDetails = details.filter(d => d.fee_type_id);
    if (validDetails.length === 0) {
      message.warning('Vui lòng thêm ít nhất 1 loại phí!');
      return;
    }
    const res = await handleCreateInvoice({ ...values, details: validDetails });
    if (res) {
      message.success('Tạo hóa đơn thành công!');
      form.resetFields();
      setDetails([{ fee_type_id: '', quantity: 1 }]);
    } else {
      message.error('Tạo hóa đơn thất bại, vui lòng thử lại!');
    }
  };

  return (
    <Card style={{ maxWidth: 720, margin: '0 auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Căn hộ"
              name="apartment_id"
              rules={[{ required: true, message: 'Vui lòng chọn căn hộ' }]}
            >
              <Select showSearch optionFilterProp="children" placeholder="Chọn căn hộ" style={{ width: '100%' }}>
                {infoAllApartment?.map(a => (
                  <Option key={a._id} value={a._id}>{a.apartment_code}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tháng thanh toán"
              name="billing_month"
              rules={[{ required: true, message: 'Vui lòng chọn tháng' }]}
            >
              <Select style={{ width: '100%' }} placeholder="Tháng">
                {monthOptions.map(m => <Option key={m} value={m}>Tháng {m}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Năm thanh toán"
              name="billing_year"
              rules={[{ required: true, message: 'Vui lòng chọn năm' }]}
            >
              <Select style={{ width: '100%' }} placeholder="Năm">
                {yearOptions.map(y => <Option key={y} value={y}>{y}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" style={{ marginBottom: 16 }}>Chi tiết loại phí</Divider>

        {details.map((detail, idx) => (
          <Row gutter={12} key={idx} align="middle" style={{ marginBottom: 12 }}>
            <Col span={14}>
              <Select
                style={{ width: '100%' }}
                placeholder="Chọn loại phí"
                value={detail.fee_type_id || undefined}
                onChange={(val) => updateDetail(idx, 'fee_type_id', val)}
              >
                {infoAllFeeType?.map((f: any) => (
                  <Option key={f._id} value={f._id}>{f.name}</Option>
                ))}
              </Select>
            </Col>
            <Col span={7}>
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Số lượng"
                value={detail.quantity}
                onChange={(val) => updateDetail(idx, 'quantity', val ?? 1)}
              />
            </Col>
            <Col span={3}>
              <Button
                danger type="link"
                disabled={details.length <= 1}
                onClick={() => removeDetailRow(idx)}
              >
                Xóa
              </Button>
            </Col>
          </Row>
        ))}

        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addDetailRow}
          style={{ width: '100%', marginBottom: 24 }}
        >
          Thêm loại phí
        </Button>

        <Form.Item>
          <Button
            type="primary" htmlType="submit"
            loading={loadingInfoInvoice}
            icon={<FileAddOutlined />}
            style={{ width: '100%' }}
          >
            Tạo hóa đơn
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormTaoThuCong;
