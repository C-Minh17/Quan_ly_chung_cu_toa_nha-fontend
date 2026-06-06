import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: { vehicleTypeFilter: string }) => void;
  vehicleTypeFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  vehicleTypeFilter,
}: Props) => {
  const [draftVehicleTypeFilter, setDraftVehicleTypeFilter] = useState(vehicleTypeFilter);

  useEffect(() => {
    if (visible) {
      setDraftVehicleTypeFilter(vehicleTypeFilter);
    }
  }, [visible, vehicleTypeFilter]);

  const handleApply = () => {
    onApply({
      vehicleTypeFilter: draftVehicleTypeFilter,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Loại phương tiện:</span>
          <Select
            style={{ width: '100%' }}
            value={draftVehicleTypeFilter}
            onChange={setDraftVehicleTypeFilter}
            placeholder="Chọn loại phương tiện"
          >
            <Option value="all">Tất cả</Option>
            <Option value="motorbike">Xe máy</Option>
            <Option value="car">Ô tô</Option>
            <Option value="bicycle">Xe đạp</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
