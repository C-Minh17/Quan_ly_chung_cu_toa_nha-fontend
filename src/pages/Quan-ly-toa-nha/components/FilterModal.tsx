import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (floorFilter: string) => void;
  currentFloorFilter: string;
}

const FilterModal = ({ visible, onCancel, onApply, currentFloorFilter }: Props) => {
  const [draftFloorFilter, setDraftFloorFilter] = useState(currentFloorFilter);

  // Sync draft state with actual filter state when modal opens
  useEffect(() => {
    if (visible) {
      setDraftFloorFilter(currentFloorFilter);
    }
  }, [visible, currentFloorFilter]);

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
      onOk={() => onApply(draftFloorFilter)}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '16px 0 8px 0' }}>
        <span style={{ fontWeight: 500, color: '#262626' }}>Số tầng:</span>
        <Select
          style={{ width: '100%' }}
          value={draftFloorFilter}
          onChange={(val) => setDraftFloorFilter(val)}
          placeholder="Chọn khoảng số tầng"
        >
          <Select.Option value="all">Tất cả</Select.Option>
          <Select.Option value="under_5">Dưới 5 tầng</Select.Option>
          <Select.Option value="5_to_10">Từ 5 đến 10 tầng</Select.Option>
          <Select.Option value="over_10">Trên 10 tầng</Select.Option>
        </Select>
      </div>
    </Modal>
  );
};

export default FilterModal;
