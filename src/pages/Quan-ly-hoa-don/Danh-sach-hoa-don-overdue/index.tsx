import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { DeleteOutlined, EyeOutlined, FilePdfOutlined, FileTextOutlined, FilterOutlined } from '@ant-design/icons';
import { useAccess, useModel } from "@umijs/max";
import { Badge, Button, Divider, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import DetailModal from '../Danh-sach-hoa-don/components/DetailModal';
import FilterBar from './components/FilterBar';

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MInvoice.IRecord | null>(null);

  const access = useAccess();

  useEffect(() => {
    handleGetOverdueInvoices();
    if (handleGetInfoAllApartment) handleGetInfoAllApartment();
  }, [refreshKey]);

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-hoa-don-overdue');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-hoa-don-overdue';
          placeholder.style.display = 'inline-flex';
          placeholder.style.marginRight = '8px';
          reloadBtn.parentNode?.insertBefore(placeholder, reloadBtn);
        }
        setPortalContainer(placeholder);
      }
    };

    findAndInsert();
    const timer = setTimeout(findAndInsert, 500);
    return () => clearTimeout(timer);
  }, [infoAllInvoice, loadingInfoAllInvoice]);

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

  const isFilterActive = useMemo(() => {
    return apartmentId !== "all" || month !== "all" || year !== "all";
  }, [apartmentId, month, year]);

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

      {portalContainer && createPortal(
        <Tooltip title="Bộ lọc tùy chỉnh">
          <Badge dot={isFilterActive} offset={[-2, 2]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => {
                setFilterModalVisible(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
            >
              Bộ lọc
            </Button>
          </Badge>
        </Tooltip>,
        portalContainer
      )}

      <FilterBar
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        onApply={(vals) => {
          setApartmentId(vals.apartmentId);
          setMonth(vals.month);
          setYear(vals.year);
          setFilterModalVisible(false);
        }}
        currentApartmentId={apartmentId}
        currentMonth={month}
        currentYear={year}
        apartments={infoAllApartment || []}
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
