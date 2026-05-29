import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useAccess, useModel } from "@umijs/max"
import { Typography, Button, Tooltip, Popconfirm, Divider, Tag } from 'antd';
import { DeleteOutlined, FilePdfOutlined, FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import FilterBar from './components/FilterBar';
import DetailModal from '../Danh-sach-hoa-don/components/DetailModal';

const { Title } = Typography;

const statusConfig: Record<string, { color: string; text: string }> = {
  unpaid: { color: 'red', text: 'Chưa thanh toán' },
  partial: { color: 'orange', text: 'Thanh toán 1 phần' },
  paid: { color: 'green', text: 'Đã thanh toán' },
  overdue: { color: 'magenta', text: 'Quá hạn' },
};

const DanhSachHoaDonOverdue = () => {
  const {
    refreshKey,
    infoAllInvoice,
    loadingInfoAllInvoice,
    handleGetOverdueInvoices,
    handleGetInfoInvoice,
    handleDeleteInvoice,
    handleExportInvoicePdf,
  } = useModel("invoice.invoice");

  const { infoAllApartment, handleGetInfoAllApartment } = useModel("apartment.apartment");

  const [apartmentId, setApartmentId] = useState<string>("all");
  const [month, setMonth] = useState<number | string>("all");
  const [year, setYear] = useState<number | string>("all");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MInvoice.IRecord | null>(null);

  const access = useAccess();

  useEffect(() => {
    handleGetOverdueInvoices();
    if (handleGetInfoAllApartment) handleGetInfoAllApartment();
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
      width: 120,
      fixed: 'right',
      hidden: !access.canAccessManager,
      render: (record: MInvoice.IRecord) => (
        <>
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
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa hóa đơn này?"
              placement="topLeft"
              onConfirm={() => handleDeleteInvoice(record._id)}
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const filteredData = useMemo(() => {
    let data = infoAllInvoice || [];
    if (apartmentId !== 'all') {
      data = data.filter((item: any) =>
        item.apartment_id === apartmentId || item.apartment?._id === apartmentId
      );
    }
    if (month !== 'all') data = data.filter(item => item.billing_month === Number(month));
    if (year !== 'all') data = data.filter(item => item.billing_year === Number(year));
    return data;
  }, [infoAllInvoice, apartmentId, month, year]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#fff1f0',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextOutlined style={{ fontSize: 22, color: '#cf1322' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Danh sách hóa đơn quá hạn</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý các hóa đơn đã quá hạn thanh toán
          </div>
        </div>
      </div>

      <Divider style={{ margin: '10px 0 20px' }} />

      <FilterBar
        apartmentId={apartmentId}
        month={month}
        year={year}
        apartments={infoAllApartment || []}
        onApartmentChange={setApartmentId}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllInvoice}
        onReload={() => handleGetOverdueInvoices()}
        addStt
      />

      <DetailModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        record={selectedRecord}
      />
    </>
  );
};

export default DanhSachHoaDonOverdue;
