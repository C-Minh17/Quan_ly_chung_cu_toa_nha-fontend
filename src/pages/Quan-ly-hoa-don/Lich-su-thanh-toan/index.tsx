import { useModel } from '@umijs/max';
import {
  Typography, Divider, Table, Tag, Space,
} from 'antd';
import {
  HistoryOutlined, BankOutlined, WalletOutlined, CreditCardOutlined,
} from '@ant-design/icons';
import { useEffect } from 'react';
import { IColumn } from '@/components/Table/typing';
import TableStaticData from '@/components/Table/TableStaticData';

const { Title, Text } = Typography;

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

const LichSuThanhToan = () => {
  const { myPayments, loadingPayments, handleGetMyPayments } = useModel('payment.payment');

  useEffect(() => {
    handleGetMyPayments();
  }, []);

  const columns: IColumn<MPayment.IRecord>[] = [
    {
      title: 'Mã hóa đơn',
      align: 'center',
      width: 180,
      render: (_, rec: any) => (
        <Text strong>{rec.invoice_id?.invoice_code || rec.invoice_id || '—'}</Text>
      ),
    },
    {
      title: 'Căn hộ',
      align: 'center',
      width: 100,
      render: (_, rec: any) =>
        rec.invoice?.apartment?.apartment_code || '—',
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paid_at',
      align: 'center',
      width: 160,
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Phương thức',
      dataIndex: 'payment_method',
      align: 'center',
      width: 160,
      render: (val: string) => (
        <Tag color={methodColor[val] || 'default'} icon={methodIcon[val]}>
          {methodLabel[val] || val}
        </Tag>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      align: 'right',
      width: 140,
      render: (val: number) => (
        <Text strong style={{ color: '#52c41a' }}>{formatVND(val)}</Text>
      ),
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transaction_code',
      align: 'center',
      width: 180,
      render: (val: string) => val ? <Text code>{val}</Text> : <Text type="secondary">—</Text>,
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#f6ffed',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HistoryOutlined style={{ fontSize: 22, color: '#52c41a' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Lịch Sử Thanh Toán</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Xem lịch sử các giao dịch thanh toán của bạn
          </div>
        </div>
      </div>

      <Divider style={{ margin: '0 0 20px' }} />

      <TableStaticData
        columns={columns}
        data={myPayments || []}
        loading={loadingPayments}
        onReload={handleGetMyPayments}
        addStt
      />
    </>
  );
};

export default LichSuThanhToan;
