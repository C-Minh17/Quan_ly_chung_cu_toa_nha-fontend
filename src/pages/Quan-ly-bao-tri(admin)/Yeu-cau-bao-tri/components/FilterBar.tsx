import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  statusFilter: string;
  priorityFilter: string;
  categoryFilter: string;
  onStatusFilterChange: (val: string) => void;
  onPriorityFilterChange: (val: string) => void;
  onCategoryFilterChange: (val: string) => void;
}

const FilterBar = ({
  statusFilter,
  priorityFilter,
  categoryFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  onCategoryFilterChange,
}: Props) => {
  return (
    <div style={{
      background: '#f9f9f9',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #f0f0f0',
      marginBottom: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      flexWrap: 'wrap'
    }}>
      <Space style={{ fontWeight: 500, color: '#595959' }}>
        <FilterOutlined style={{ color: '#1677ff' }} />
        <span>Bộ lọc:</span>
      </Space>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Hạng mục:</span>
        <Select
          style={{ width: 140 }}
          value={categoryFilter}
          onChange={onCategoryFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="electrical">Điện</Option>
          <Option value="plumbing">Nước</Option>
          <Option value="structure">Kết cấu</Option>
          <Option value="appliance">Thiết bị</Option>
          <Option value="other">Khác</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Trạng thái:</span>
        <Select
          style={{ width: 150 }}
          value={statusFilter}
          onChange={onStatusFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="new">Mới</Option>
          <Option value="assigned">Đã phân công</Option>
          <Option value="in_progress">Đang xử lý</Option>
          <Option value="completed">Hoàn thành</Option>
          <Option value="closed">Đã đóng</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Ưu tiên:</span>
        <Select
          style={{ width: 140 }}
          value={priorityFilter}
          onChange={onPriorityFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="low">Thấp</Option>
          <Option value="medium">Trung bình</Option>
          <Option value="high">Cao</Option>
          <Option value="urgent">Khẩn cấp</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
