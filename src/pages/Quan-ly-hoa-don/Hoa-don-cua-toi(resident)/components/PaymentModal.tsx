import React from 'react';
import { Modal, Typography, Row, Col, Alert, Space, Divider, message } from 'antd';
import { QrcodeOutlined, CopyOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  record: MInvoice.IRecord | null;
}

const formatVND = (val: number) => `${(val || 0).toLocaleString('vi-VN')} đ`;

const PaymentModal: React.FC<PaymentModalProps> = ({ visible, onClose, record }) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Đã sao chép: ' + text);
  };

  const remainingAmount = record ? (record.total_amount - record.paid_amount) : 0;
  const transferContent = record
    ? `Thanh toan HD ${record.invoice_code} can ho ${record.apartment?.apartment_code || ''} thang ${record.billing_month}-${record.billing_year}`
    : '';

  return (
    <Modal
      title={
        <Space>
          <QrcodeOutlined style={{ color: '#1677ff', fontSize: 20 }} />
          <span>Thanh toán chuyển khoản</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      {record && (
        <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
          {/* Cột mã QR */}
          <Col xs={24} md={10} style={{ textAlign: 'center' }}>
            <div style={{
              width: '100%',
              padding: 16,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              backgroundColor: '#fafafa',
              marginBottom: 16
            }}>
              <div style={{
                width: 200,
                height: 200,
                margin: '0 auto',
                backgroundColor: '#e6f4ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                border: '2px dashed #1677ff'
              }}>
                <Text type="secondary">QR Code<br />(Tạm để trống)</Text>
              </div>
              <Title level={5} style={{ marginTop: 16 }}>Quét mã để thanh toán</Title>
              <Text type="secondary">Sử dụng App ngân hàng để quét mã</Text>
            </div>
          </Col>

          <Col xs={24} md={14}>
            <Title level={5} style={{ marginTop: 0 }}>Thông tin người thụ hưởng</Title>
            <Divider style={{ margin: '8px 0 16px 0' }} />

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text type="secondary">Ngân hàng:</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Chủ tài khoản:</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>BAN QUAN LY TOA NHA</Text>
                </div>
              </div>

              <div>
                <Text type="secondary">Số tài khoản:</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f5f5f5', padding: '8px 12px', borderRadius: 4 }}>
                  <Text strong style={{ fontSize: 18, color: '#1677ff' }}>0123456789</Text>
                  <CopyOutlined style={{ cursor: 'pointer', color: '#1677ff', fontSize: 16 }} onClick={() => handleCopy('0123456789')} />
                </div>
              </div>

              <div>
                <Text type="secondary">Số tiền cần thanh toán:</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff1f0', padding: '8px 12px', borderRadius: 4 }}>
                  <Text strong style={{ fontSize: 18, color: '#cf1322' }}>{formatVND(remainingAmount)}</Text>
                  <CopyOutlined style={{ cursor: 'pointer', color: '#cf1322', fontSize: 16 }} onClick={() => handleCopy(remainingAmount.toString())} />
                </div>
              </div>

              <div>
                <Text type="secondary">Nội dung chuyển khoản:</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6ffed', padding: '8px 12px', borderRadius: 4 }}>
                  <Text strong style={{ fontSize: 16 }}>{transferContent}</Text>
                  <CopyOutlined style={{ cursor: 'pointer', color: '#52c41a', fontSize: 16 }} onClick={() => handleCopy(transferContent)} />
                </div>
              </div>
            </Space>

            <Alert
              message="Lưu ý quan trọng"
              description="Vui lòng chuyển chính xác số tiền và nội dung chuyển khoản để hệ thống ghi nhận tự động. Giao dịch sẽ được cập nhật trong vòng 5-10 phút."
              type="warning"
              showIcon
              style={{ marginTop: 24 }}
            />
          </Col>
        </Row>
      )}
    </Modal>
  );
};

export default PaymentModal;
