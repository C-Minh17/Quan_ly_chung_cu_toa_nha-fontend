import { FilterOutlined } from '@ant-design/icons';
import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    residentTypeFilter: string;
    primaryFilter: string;
  }) => void;
  currentResidentTypeFilter: string;
  currentPrimaryFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentResidentTypeFilter,
  currentPrimaryFilter,
}: Props) => {
  const [draftResidentType, setDraftResidentType] = useState(currentResidentTypeFilter);
  const [draftPrimary, setDraftPrimary] = useState(currentPrimaryFilter);

  useEffect(() => {
    if (visible) {
      setDraftResidentType(currentResidentTypeFilter);
      setDraftPrimary(currentPrimaryFilter);
    }
  }, [visible, currentResidentTypeFilter, currentPrimaryFilter]);

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
          residentTypeFilter: draftResidentType,
          primaryFilter: draftPrimary,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Loại cư dân:</span>
          <Select
            style={{ width: '100%' }}
            value={draftResidentType}
            onChange={setDraftResidentType}
          >
            <Option value="all">Tất cả</Option>
            <Option value="OWNER">Chủ hộ</Option>
            <Option value="FAMILY_MEMBER">Thành viên</Option>
            <Option value="TENANT">Khách thuê</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Vai trò:</span>
          <Select
            style={{ width: '100%' }}
            value={draftPrimary}
            onChange={setDraftPrimary}
          >
            <Option value="all">Tất cả</Option>
            <Option value="primary">Cư dân chính</Option>
            <Option value="secondary">Cư dân phụ</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
