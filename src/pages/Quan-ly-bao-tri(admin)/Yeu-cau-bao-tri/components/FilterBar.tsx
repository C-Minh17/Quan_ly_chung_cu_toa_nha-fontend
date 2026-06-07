import { FilterOutlined } from '@ant-design/icons';
import { Modal, Select } from 'antd';
import { useEffect, useState } from 'react';

const { Option } = Select;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onApply: (filters: {
    statusFilter: string;
    priorityFilter: string;
    categoryFilter: string;
  }) => void;
  currentStatusFilter: string;
  currentPriorityFilter: string;
  currentCategoryFilter: string;
}

const FilterBar = ({
  visible,
  onCancel,
  onApply,
  currentStatusFilter,
  currentPriorityFilter,
  currentCategoryFilter,
}: Props) => {
  const [draftStatus, setDraftStatus] = useState(currentStatusFilter);
  const [draftPriority, setDraftPriority] = useState(currentPriorityFilter);
  const [draftCategory, setDraftCategory] = useState(currentCategoryFilter);

  useEffect(() => {
    if (visible) {
      setDraftStatus(currentStatusFilter);
      setDraftPriority(currentPriorityFilter);
      setDraftCategory(currentCategoryFilter);
    }
  }, [visible, currentStatusFilter, currentPriorityFilter, currentCategoryFilter]);

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
          statusFilter: draftStatus,
          priorityFilter: draftPriority,
          categoryFilter: draftCategory,
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
          <span style={{ fontWeight: 500, color: '#262626' }}>Hạng mục:</span>
          <Select
            style={{ width: '100%' }}
            value={draftCategory}
            onChange={setDraftCategory}
          >
            <Option value="all">Tất cả</Option>
            <Option value="electrical">Điện</Option>
            <Option value="plumbing">Nước</Option>
            <Option value="structure">Kết cấu</Option>
            <Option value="appliance">Thiết bị</Option>
            <Option value="other">Khác</Option>
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
            <Option value="new">Mới</Option>
            <Option value="assigned">Đã phân công</Option>
            <Option value="in_progress">Đang xử lý</Option>
            <Option value="completed">Hoàn thành</Option>
            <Option value="closed">Đã đóng</Option>
          </Select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontWeight: 500, color: '#262626' }}>Ưu tiên:</span>
          <Select
            style={{ width: '100%' }}
            value={draftPriority}
            onChange={setDraftPriority}
          >
            <Option value="all">Tất cả</Option>
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
            <Option value="urgent">Khẩn cấp</Option>
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default FilterBar;
