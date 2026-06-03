import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    apartmentId: string;
    month: number | string;
    year: number | string;
  }) => void;
  currentApartmentId: string;
  currentMonth: number | string;
  currentYear: number | string;
  apartments: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentApartmentId,
  currentMonth,
  currentYear,
  apartments,
}: Props) => {
  const [draftApartment, setDraftApartment] = useState(currentApartmentId);
  const [draftMonth, setDraftMonth] = useState(currentMonth);
  const [draftYear, setDraftYear] = useState(currentYear);

  useEffect(() => {
    if (visible) {
      setDraftApartment(currentApartmentId);
      setDraftMonth(currentMonth);
      setDraftYear(currentYear);
    }
  }, [visible, currentApartmentId, currentMonth, currentYear]);

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
      onOk={() => {
        onApply({
          apartmentId: draftApartment,
          month: draftMonth,
          year: draftYear,
        });
      }}
      okText="Áp dụng tùy chỉnh"
      cancelText="Hủy"
      destroyOnClose
      okButtonProps={{
        style: { borderRadius: 6 }
      }}
      cancelButtonProps={{
        style: { borderRadius: 6 }
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 0 8px 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Căn hộ:</span>
          <Select
            style={{ width: '100%' }}
            value={draftApartment}
            onChange={setDraftApartment}
            showSearch
            optionFilterProp="children"
          >
            <Option value="all">Tất cả</Option>
            {apartments?.map((a: any) => (
              <Option key={a._id} value={a._id}>{a.apartment_code}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Tháng:</span>
          <Select style={{ width: '100%' }} value={draftMonth} onChange={setDraftMonth}>
            <Option value="all">Tất cả</Option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <Option key={m} value={m}>Tháng {m}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Năm:</span>
          <Select style={{ width: '100%' }} value={draftYear} onChange={setDraftYear}>
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
