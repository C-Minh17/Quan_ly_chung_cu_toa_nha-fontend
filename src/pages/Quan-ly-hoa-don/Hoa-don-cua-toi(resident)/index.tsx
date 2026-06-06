import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { Typography, Button, Tooltip, Divider, Tag, Select, Row, Col } from 'antd';
import { FilePdfOutlined, FileTextOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import DetailModal from '../Danh-sach-hoa-don/components/DetailModal';
import PaymentModal from './components/PaymentModal';

const { Title } = Typography;
const { Option } = Select;

const statusConfig: Record<string, { color: string; text: string }> = {
  unpaid: { color: 'red', text: 'Chưa thanh toán' },
  partial: { color: 'orange', text: 'Thanh toán 1 phần' },
  paid: { color: 'green', text: 'Đã thanh toán' },
  overdue: { color: 'magenta', text: 'Quá hạn' },
};

const HoaDonCuaToi = () => {
  const {
    refreshKey,
    infoAllInvoice,
    loadingInfoAllInvoice,
    handleGetMyInvoices,
    handleGetInfoInvoice,
    handleExportInvoicePdf,
  } = useModel("invoice.invoice");

  const [status, setStatus] = useState<string>("all");
  const [month, setMonth] = useState<number | string>("all");
  const [year, setYear] = useState<number | string>("all");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MInvoice.IRecord | null>(null);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState<MInvoice.IRecord | null>(null);

  useEffect(() => {
    handleGetMyInvoices();
  }, [refreshKey]);

  const columns: IColumn<MInvoice.IRecord>[] = [
    {
      title: "Mã hóa đơn",
      dataIndex: "invoice_code",
      align: "center",
      width: 160,
    },
    {
      title: "Căn hộ",
      align: "center",
      width: 120,
      render: (_, rec: any) => rec?.apartment?.apartment_code || 'N/A',
    },
    {
      title: "Kỳ thanh toán",
      align: "center",
      width: 130,
      render: (_, rec) => `${rec.billing_month}/${rec.billing_year}`,
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      align: "right",
      width: 150,
      render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: "Đã thanh toán",
      dataIndex: "paid_amount",
      align: "right",
      width: 150,
      render: (val) => `${(val || 0).toLocaleString('vi-VN')} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      align: "center",
      width: 160,
      render: (val: string) => {
        const cfg = statusConfig[val] ?? { color: 'blue', text: val };
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (record: MInvoice.IRecord) => (
        <>
          {record.status !== 'paid' && (
            <Tooltip title="Thanh toán">
              <Button
                type="link"
                icon={<DollarOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => {
                  setPaymentRecord(record);
                  setIsPaymentModalVisible(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Xuất PDF">
            <Button
              type="link"
              icon={<FilePdfOutlined />}
              onClick={async () => {
                const blob = await handleExportInvoicePdf(record._id);
                if (blob) {
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `Hoa_don_${record.invoice_code}.pdf`;
                  a.click();
                  window.URL.revokeObjectURL(url);
                }
              }}
            />
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={async () => {
                const fullRecord = await handleGetInfoInvoice(record._id);
                if (fullRecord) {
                  setSelectedRecord(fullRecord);
                } else {
                  setSelectedRecord(record);
                }
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    let data = infoAllInvoice || [];
    if (status !== 'all') data = data.filter(item => item.status === status);
    if (month !== 'all') data = data.filter(item => item.billing_month === Number(month));
    if (year !== 'all') data = data.filter(item => item.billing_year === Number(year));
    return data;
  }, [infoAllInvoice, status, month, year]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Hóa đơn của tôi</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý các hóa đơn thanh toán căn hộ của bạn
          </div>
        </div>
      </div>

      <Divider style={{ margin: '10px 0 20px' }} />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <div style={{ marginBottom: 5 }}>Trạng thái</div>
          <Select style={{ width: '100%' }} value={status} onChange={setStatus}>
            <Option value="all">Tất cả</Option>
            <Option value="unpaid">Chưa thanh toán</Option>
            <Option value="partial">Thanh toán 1 phần</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="overdue">Quá hạn</Option>
          </Select>
        </Col>

        <Col span={8}>
          <div style={{ marginBottom: 5 }}>Tháng</div>
          <Select style={{ width: '100%' }} value={month} onChange={setMonth}>
            <Option value="all">Tất cả</Option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Option key={m} value={m}>Tháng {m}</Option>
            ))}
          </Select>
        </Col>

        <Col span={8}>
          <div style={{ marginBottom: 5 }}>Năm</div>
          <Select style={{ width: '100%' }} value={year} onChange={setYear}>
            <Option value="all">Tất cả</Option>
            {[2024, 2025, 2026, 2027, 2028].map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllInvoice}
        onReload={() => handleGetMyInvoices()}
        addStt
      />

      <DetailModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        record={selectedRecord}
      />

      <PaymentModal
        visible={isPaymentModalVisible}
        onClose={() => setIsPaymentModalVisible(false)}
        record={paymentRecord}
      />
    </>
  );
};

export default HoaDonCuaToi;
