import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: {
    apartmentId: string;
    status: string;
    month: number | string;
    year: number | string;
  }) => void;
  apartmentId: string;
  status: string;
  month: number | string;
  year: number | string;
  apartments: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  apartmentId,
  status,
  month,
  year,
  apartments,
}: Props) => {
  const [draftApartmentId, setDraftApartmentId] = useState(apartmentId);
  const [draftStatus, setDraftStatus] = useState(status);
  const [draftMonth, setDraftMonth] = useState(month);
  const [draftYear, setDraftYear] = useState(year);

  useEffect(() => {
    if (visible) {
      setDraftApartmentId(apartmentId);
      setDraftStatus(status);
      setDraftMonth(month);
      setDraftYear(year);
    }
  }, [visible, apartmentId, status, month, year]);

  const handleApply = () => {
    onApply({
      apartmentId: draftApartmentId,
      status: draftStatus,
      month: draftMonth,
      year: draftYear,
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
          <FilterOutlined style={{ color: '#1677ff' }} />
          <span>Bộ lọc tùy chỉnh</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleApply}
      okText="Áp dụng tùy chỉnh"
      cancelText="Hủy"
      destroyOnClose
      okButtonProps={{ style: { borderRadius: 6 } }}
      cancelButtonProps={{ style: { borderRadius: 6 } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0 8px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Căn hộ:</span>
          <Select
            style={{ width: '100%' }}
            value={draftApartmentId}
            onChange={setDraftApartmentId}
            showSearch
            optionFilterProp="children"
            placeholder="Chọn căn hộ"
          >
            <Option value="all">Tất cả</Option>
            {apartments?.map((a: any) => (
              <Option key={a._id} value={a._id}>{a.apartment_code}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Trạng thái:</span>
          <Select
            style={{ width: '100%' }}
            value={draftStatus}
            onChange={setDraftStatus}
            placeholder="Chọn trạng thái"
          >
            <Option value="all">Tất cả</Option>
            <Option value="unpaid">Chưa thanh toán</Option>
            <Option value="partial">Thanh toán 1 phần</Option>
            <Option value="paid">Đã thanh toán</Option>
            <Option value="overdue">Quá hạn</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Tháng:</span>
          <Select
            style={{ width: '100%' }}
            value={draftMonth}
            onChange={setDraftMonth}
            placeholder="Chọn tháng"
          >
            <Option value="all">Tất cả</Option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Option key={m} value={m}>Tháng {m}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Năm:</span>
          <Select
            style={{ width: '100%' }}
            value={draftYear}
            onChange={setDraftYear}
            placeholder="Chọn năm"
          >
            <Option value="all">Tất cả</Option>
            {[2024, 2025, 2026, 2027, 2028].map(y => (
              <Option key={y} value={y}>{y}</Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
