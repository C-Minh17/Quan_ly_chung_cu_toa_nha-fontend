import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: { buildingFilter: string }) => void;
  buildingFilter: string;
  buildings: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  buildingFilter,
  buildings,
}: Props) => {
  const [draftBuildingFilter, setDraftBuildingFilter] = useState(buildingFilter);

  useEffect(() => {
    if (visible) {
      setDraftBuildingFilter(buildingFilter);
    }
  }, [visible, buildingFilter]);

  const handleApply = () => {
    onApply({
      buildingFilter: draftBuildingFilter,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Tòa nhà:</span>
          <Select
            style={{ width: '100%' }}
            value={draftBuildingFilter}
            onChange={setDraftBuildingFilter}
            placeholder="Chọn tòa nhà"
          >
            <Option value="all">Tất cả</Option>
            {buildings?.map(b => (
              <Option key={b._id} value={b._id}>{b.name}</Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
