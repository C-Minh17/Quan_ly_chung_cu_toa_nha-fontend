import { FilterOutlined } from '@ant-design/icons';
import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (values: { statusFilter: string; amenityFilter: string }) => void;
  statusFilter: string;
  amenityFilter: string;
  amenities: any[];
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  statusFilter,
  amenityFilter,
  amenities,
}: Props) => {
  const [draftStatusFilter, setDraftStatusFilter] = useState(statusFilter);
  const [draftAmenityFilter, setDraftAmenityFilter] = useState(amenityFilter);

  useEffect(() => {
    if (visible) {
      setDraftStatusFilter(statusFilter);
      setDraftAmenityFilter(amenityFilter);
    }
  }, [visible, statusFilter, amenityFilter]);

  const handleApply = () => {
    onApply({
      statusFilter: draftStatusFilter,
      amenityFilter: draftAmenityFilter,
    });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 16 }}>
          <FilterOutlined style={{ color: '#1677ff' }} />
          <span>Bộ lọc đặt chỗ</span>
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Tiện ích:</span>
          <Select
            style={{ width: '100%' }}
            value={draftAmenityFilter}
            onChange={setDraftAmenityFilter}
            placeholder="Chọn tiện ích"
          >
            <Option value="all">Tất cả</Option>
            {amenities?.map(a => (
              <Option key={a._id} value={a._id}>{a.name}</Option>
            ))}
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
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
            <Option value="cancelled">Đã hủy</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
