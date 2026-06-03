import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  statusFilter: string;
  frequencyFilter: string;
  onStatusFilterChange: (val: string) => void;
  onFrequencyFilterChange: (val: string) => void;
}

const FilterBar = ({
  statusFilter,
  frequencyFilter,
  onStatusFilterChange,
  onFrequencyFilterChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Trạng thái:</span>
        <Select
          style={{ width: 150 }}
          value={statusFilter}
          onChange={onStatusFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="scheduled">Đã lên lịch</Option>
          <Option value="completed">Hoàn thành</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tần suất:</span>
        <Select
          style={{ width: 150 }}
          value={frequencyFilter}
          onChange={onFrequencyFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="once">Một lần</Option>
          <Option value="weekly">Hàng tuần</Option>
          <Option value="monthly">Hàng tháng</Option>
          <Option value="quarterly">Hàng quý</Option>
          <Option value="yearly">Hàng năm</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
