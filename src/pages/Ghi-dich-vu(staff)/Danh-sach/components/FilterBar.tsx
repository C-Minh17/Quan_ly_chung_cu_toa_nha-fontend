import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    buildingId: string;
    feeTypeId: string;
    month: number | string;
    year: number | string;
  }) => void;
  currentBuildingId: string;
  currentFeeTypeId: string;
  currentMonth: number | string;
  currentYear: number | string;
  buildings: any[];
  feeTypes: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentBuildingId,
  currentFeeTypeId,
  currentMonth,
  currentYear,
  buildings,
  feeTypes,
}: Props) => {
  const [draftBuildingId, setDraftBuildingId] = useState(currentBuildingId);
  const [draftFeeTypeId, setDraftFeeTypeId] = useState(currentFeeTypeId);
  const [draftMonth, setDraftMonth] = useState(currentMonth);
  const [draftYear, setDraftYear] = useState(currentYear);

  useEffect(() => {
    if (visible) {
      setDraftBuildingId(currentBuildingId);
      setDraftFeeTypeId(currentFeeTypeId);
      setDraftMonth(currentMonth);
      setDraftYear(currentYear);
    }
  }, [visible, currentBuildingId, currentFeeTypeId, currentMonth, currentYear]);

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
          buildingId: draftBuildingId,
          feeTypeId: draftFeeTypeId,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Tòa nhà:</span>
          <Select
            style={{ width: '100%' }}
            value={draftBuildingId}
            onChange={setDraftBuildingId}
          >
            <Option value="all">Tất cả</Option>
            {buildings?.map(b => (
              <Option key={b._id} value={b._id}>{b.name}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Loại chỉ số:</span>
          <Select
            style={{ width: '100%' }}
            value={draftFeeTypeId}
            onChange={setDraftFeeTypeId}
          >
            <Option value="all">Tất cả</Option>
            {feeTypes?.map(f => (
              <Option key={f._id} value={f._id}>{f.name}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Tháng:</span>
          <Select
            style={{ width: '100%' }}
            value={draftMonth}
            onChange={setDraftMonth}
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
