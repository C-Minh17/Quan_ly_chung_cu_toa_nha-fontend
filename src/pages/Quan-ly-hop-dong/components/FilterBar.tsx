import { FilterOutlined } from '@ant-design/icons';
import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: { statusFilter: string; contractTypeFilter: string }) => void;
  statusFilter: string;
  contractTypeFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  statusFilter,
  contractTypeFilter,
}: Props) => {
  const [draftStatusFilter, setDraftStatusFilter] = useState(statusFilter);
  const [draftContractTypeFilter, setDraftContractTypeFilter] = useState(contractTypeFilter);

  useEffect(() => {
    if (visible) {
      setDraftStatusFilter(statusFilter);
      setDraftContractTypeFilter(contractTypeFilter);
    }
  }, [visible, statusFilter, contractTypeFilter]);

  const handleApply = () => {
    onApply({
      statusFilter: draftStatusFilter,
      contractTypeFilter: draftContractTypeFilter,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Loại hợp đồng:</span>
          <Select
            style={{ width: '100%' }}
            value={draftContractTypeFilter}
            onChange={setDraftContractTypeFilter}
            placeholder="Chọn loại hợp đồng"
          >
            <Option value="all">Tất cả</Option>
            <Option value="purchase">Mua bán</Option>
            <Option value="lease">Cho thuê</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Trạng thái:</span>
          <Select
            style={{ width: '100%' }}
            value={draftStatusFilter}
            onChange={setDraftStatusFilter}
            placeholder="Chọn trạng thái"
          >
            <Option value="all">Tất cả</Option>
            <Option value="active">Đang hiệu lực</Option>
            <Option value="expired">Đã hết hạn</Option>
            <Option value="terminated">Đã chấm dứt</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
