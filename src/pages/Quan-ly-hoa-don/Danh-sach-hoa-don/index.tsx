import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useAccess, useModel } from "@umijs/max"
import { Typography, Button, Tooltip, Popconfirm, Divider, Tag, Input, Badge } from 'antd';
import { DeleteOutlined, FilePdfOutlined, FileTextOutlined, DollarOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { history } from '@umijs/max';
import FilterBar from './components/FilterBar';
import DetailModal from './components/DetailModal';

const { Title } = Typography;

const statusConfig: Record<string, { color: string; text: string }> = {
  unpaid:  { color: 'red',     text: 'Chưa thanh toán' },
  partial: { color: 'orange',  text: 'Thanh toán 1 phần' },
  paid:    { color: 'green',   text: 'Đã thanh toán' },
  overdue: { color: 'magenta', text: 'Quá hạn' },
};

const DanhSachHoaDon = () => {
  const {
    refreshKey,
    infoAllInvoice,
    loadingInfoAllInvoice,
    handleGetInfoAllInvoice,
    handleGetInfoInvoice,
    handleDeleteInvoice,
    handleExportInvoicePdf,
  } = useModel("invoice.invoice");

  const { infoAllApartment, handleGetInfoAllApartment } = useModel("apartment.apartment");

  const [apartmentId, setApartmentId] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [month, setMonth] = useState<number | string>("all");
  const [year, setYear] = useState<number | string>("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MInvoice.IRecord | null>(null);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  const access = useAccess();

  useEffect(() => {
    handleGetInfoAllInvoice();
    if (handleGetInfoAllApartment) handleGetInfoAllApartment();
  }, [refreshKey]);

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-danh-sach-hoa-don');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-danh-sach-hoa-don';
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
      width: 160,
      fixed: 'right',
      hidden: !access.canAccessManager,
      render: (record: MInvoice.IRecord) => (
        <>
          {record.status !== 'paid' && (
            <Tooltip title="Thanh toán">
              <Button
                type="link"
                icon={<DollarOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => history.push('/quan-ly-hoa-don/thanh-toan')}
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
    if (status !== 'all') data = data.filter(item => item.status === status);
    if (month !== 'all') data = data.filter(item => item.billing_month === Number(month));
    if (year !== 'all') data = data.filter(item => item.billing_year === Number(year));

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter((item: any) =>
        [item.invoice_code, item.apartment?.apartment_code]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }
    return data;
  }, [infoAllInvoice, apartmentId, status, month, year, searchKeyword]);

  const isFilterActive = apartmentId !== 'all' || status !== 'all' || month !== 'all' || year !== 'all';

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#fff7e6',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextOutlined style={{ fontSize: 22, color: '#d46b08' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Danh sách hóa đơn</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý toàn bộ hóa đơn của tòa nhà
          </div>
        </div>
      </div>

      <Divider style={{ margin: '10px 0 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo mã hóa đơn, căn hộ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      {portalContainer && createPortal(
        <Tooltip title="Bộ lọc tùy chỉnh">
          <Badge dot={isFilterActive} offset={[-2, 2]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterModalVisible(true)}
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
        onApply={(values) => {
          setApartmentId(values.apartmentId);
          setStatus(values.status);
          setMonth(values.month);
          setYear(values.year);
          setFilterModalVisible(false);
        }}
        apartmentId={apartmentId}
        status={status}
        month={month}
        year={year}
        apartments={infoAllApartment || []}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllInvoice}
        onReload={() => handleGetInfoAllInvoice()}
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

export default DanhSachHoaDon;
