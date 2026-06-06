import { Modal, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: { statusFilter: string }) => void;
  statusFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  statusFilter,
}: Props) => {
  const [draftStatusFilter, setDraftStatusFilter] = useState(statusFilter);

  useEffect(() => {
    if (visible) {
      setDraftStatusFilter(statusFilter);
    }
  }, [visible, statusFilter]);

  const handleApply = () => {
    onApply({
      statusFilter: draftStatusFilter,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Trạng thái:</span>
          <Select
            style={{ width: '100%' }}
            value={draftStatusFilter}
            onChange={setDraftStatusFilter}
            placeholder="Chọn trạng thái"
          >
            <Option value="all">Tất cả</Option>
            <Option value="active">Đang hoạt động</Option>
            <Option value="inactive">Ngừng hoạt động</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
