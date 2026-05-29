import React from 'react';
import { Modal, Descriptions, Button, Tag, Typography } from 'antd';
import { EyeOutlined, BankOutlined, WalletOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useAccess } from '@umijs/max';

const { Text } = Typography;

const formatVND = (val: number) => `${(val || 0).toLocaleString('vi-VN')} đ`;
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('vi-VN');
};

const methodLabel: Record<string, string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

const methodColor: Record<string, string> = {
  cash: 'default',
  bank_transfer: 'blue',
  momo: 'magenta',
  vnpay: 'cyan',
};

const methodIcon: Record<string, React.ReactNode> = {
  cash: <WalletOutlined />,
  bank_transfer: <BankOutlined />,
  momo: <CreditCardOutlined />,
  vnpay: <CreditCardOutlined />,
};

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  record: any;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, onClose, record }) => {
  const access = useAccess()

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EyeOutlined style={{ color: '#1890ff' }} />
          <span>Chi tiết giao dịch thanh toán</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={800}
      destroyOnClose
    >
      {record && (
        <div style={{ marginTop: 24 }}>
          <Descriptions title="Thông tin giao dịch" bordered column={2} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Mã giao dịch">
              {record.transaction_code ? <Text code>{record.transaction_code}</Text> : '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức">
              <Tag color={methodColor[record.payment_method] || 'default'} icon={methodIcon[record.payment_method]}>
                {methodLabel[record.payment_method] || record.payment_method}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <Text strong style={{ color: '#52c41a' }}>{formatVND(record.amount)}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày thanh toán">{formatDate(record.paid_at)}</Descriptions.Item>
            {access.canAccessManager && (
              <>
                <Descriptions.Item label="Người thu tiền">{record.received_by?.name || '—'}</Descriptions.Item>
                <Descriptions.Item label="SĐT người thu">{record.received_by?.phone || '—'}</Descriptions.Item>
              </>
            )}
            <Descriptions.Item label="Ghi chú" span={2}>{record.note || '—'}</Descriptions.Item>
          </Descriptions>

          <Descriptions title="Thông tin hóa đơn" bordered column={2} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Mã hóa đơn">{record.invoice?.invoice_code || '—'}</Descriptions.Item>
            <Descriptions.Item label="Kỳ thanh toán">{record.invoice?.billing_month ? `Tháng ${record.invoice?.billing_month}/${record.invoice?.billing_year}` : '—'}</Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">{record.invoice?.total_amount ? formatVND(record.invoice?.total_amount) : '—'}</Descriptions.Item>
            <Descriptions.Item label="Đã thanh toán">{record.invoice?.paid_amount ? formatVND(record.invoice?.paid_amount) : '—'}</Descriptions.Item>
            <Descriptions.Item label="Hạn thanh toán">{formatDate(record.invoice?.due_date)}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {record.invoice?.status === 'paid' ? <Tag color="success">Đã thanh toán</Tag> : (record.invoice?.status === 'partial' ? <Tag color="warning">Thanh toán 1 phần</Tag> : <Tag color="default">{record.invoice?.status || '—'}</Tag>)}
            </Descriptions.Item>
          </Descriptions>

          <Descriptions title="Thông tin căn hộ" bordered column={2} size="small">
            <Descriptions.Item label="Tòa nhà">{record.invoice?.apartment?.floor?.building?.name || '—'}</Descriptions.Item>
            <Descriptions.Item label="Tầng">{record.invoice?.apartment?.floor?.floor_number || '—'}</Descriptions.Item>
            <Descriptions.Item label="Mã căn hộ">{record.invoice?.apartment?.apartment_code || '—'}</Descriptions.Item>
            <Descriptions.Item label="Số hợp đồng">{record.invoice?.apartment?.contract_number || '—'}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{record.invoice?.apartment?.area ? `${record.invoice.apartment.area} m²` : '—'}</Descriptions.Item>
            <Descriptions.Item label="Giá thuê">{record.invoice?.apartment?.price ? formatVND(record.invoice?.apartment?.price) : '—'}</Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
