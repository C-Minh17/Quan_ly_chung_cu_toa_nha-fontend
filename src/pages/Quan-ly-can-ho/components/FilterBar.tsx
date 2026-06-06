import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    buildingFilter: string;
    statusFilter: string;
  }) => void;
  currentBuildingFilter: string;
  currentStatusFilter: string;
  buildings: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentBuildingFilter,
  currentStatusFilter,
  buildings,
}: Props) => {
  const [draftBuilding, setDraftBuilding] = useState(currentBuildingFilter);
  const [draftStatus, setDraftStatus] = useState(currentStatusFilter);

  useEffect(() => {
    if (visible) {
      setDraftBuilding(currentBuildingFilter);
      setDraftStatus(currentStatusFilter);
    }
  }, [visible, currentBuildingFilter, currentStatusFilter]);

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
          buildingFilter: draftBuilding,
          statusFilter: draftStatus,
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
            value={draftBuilding}
            onChange={setDraftBuilding}
          >
            <Option value="all">Tất cả</Option>
            {buildings?.map(b => (
              <Option key={b._id} value={b._id}>{b.name}</Option>
            ))}
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Trạng thái:</span>
          <Select
            style={{ width: '100%' }}
            value={draftStatus}
            onChange={setDraftStatus}
          >
            <Option value="all">Tất cả</Option>
            <Option value="vacant">Trống</Option>
            <Option value="occupied">Đã thuê</Option>
            <Option value="reserved">Đã đặt</Option>
            <Option value="maintenance">Bảo trì</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
