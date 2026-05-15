import { useModel } from '@umijs/max';
import {
  Typography, Tag, Row, Col, Card, Modal, Descriptions, Button
} from 'antd';
import {
  HistoryOutlined, BankOutlined, WalletOutlined, CreditCardOutlined, EyeOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { IColumn } from '@/components/Table/typing';
import TableStaticData from '@/components/Table/TableStaticData';
import SelectInvoice from '@/pages/Quan-ly-hoa-don/Danh-sach-hoa-don/components/Select';
import DetailModal from './components/DetailModal';

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

const LichSuThanhToanAdmin = () => {
  const { allPayments, loadingPayments, handleGetAllPayments } = useModel('payment.payment');
  const [selectedInvoiceCode, setSelectedInvoiceCode] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    handleGetAllPayments();
  }, []);

  const columns: IColumn<MPayment.IRecord>[] = [
    {
      title: 'Mã hóa đơn',
      align: 'center',
      width: 180,
      render: (_, rec: any) => (
        <Text strong>{rec.invoice?.invoice_code || rec.invoice_id || '—'}</Text>
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
      title: 'Người kiểm thu',
      align: 'center',
      width: 180,
      render: (_, rec: any) =>
        rec.received_by?.name || '—',
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
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paid_at',
      align: 'center',
      width: 160,
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, rec: any) => (
        <Button
          type="primary"
          ghost
          size="small"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(rec);
            setIsModalVisible(true);
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Filter payments based on selected invoice code
  const filteredPayments = selectedInvoiceCode
    ? allPayments?.filter((payment: any) => {
      const code = payment.invoice?.invoice_code || payment.invoice_id;
      return code === selectedInvoiceCode;
    })
    : allPayments;

  return (
    <Card style={{ minHeight: '100%', borderRadius: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f7ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HistoryOutlined style={{ fontSize: 22, color: '#1890ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản Lý Lịch Sử Thanh Toán</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Xem và tìm kiếm tất cả các giao dịch thanh toán trong hệ thống
          </div>
        </div>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 12, backgroundColor: '#fafafa' }} bordered={false}>
        <Row align="middle" gutter={16}>
          <Col>
            <Text strong>Tìm kiếm theo hóa đơn:</Text>
          </Col>
          <Col span={8}>
            <SelectInvoice
              hasCreate={false}
              value={selectedInvoiceCode}
              onChange={(val) => setSelectedInvoiceCode(val)}
              valueType="code"
            />
          </Col>
        </Row>
      </Card>

      <TableStaticData
        columns={columns}
        data={filteredPayments || []}
        loading={loadingPayments}
        onReload={handleGetAllPayments}
        addStt
      />
      <DetailModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        record={selectedRecord}
      />
    </Card>
  );
};

export default LichSuThanhToanAdmin;
