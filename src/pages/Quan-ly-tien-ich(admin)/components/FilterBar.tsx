import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  statusFilter: string;
  amenityFilter: string;
  amenities: any[];
  onStatusFilterChange: (val: string) => void;
  onAmenityFilterChange: (val: string) => void;
}

const FilterBar = ({
  statusFilter,
  amenityFilter,
  amenities,
  onStatusFilterChange,
  onAmenityFilterChange,
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
        <span>Bộ lọc đặt chỗ:</span>
      </Space>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tiện ích:</span>
        <Select
          style={{ width: 180 }}
          value={amenityFilter}
          onChange={onAmenityFilterChange}
        >
          <Option value="all">Tất cả</Option>
          {amenities?.map(a => (
            <Option key={a._id} value={a._id}>{a.name}</Option>
          ))}
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
          <Option value="pending">Chờ duyệt</Option>
          <Option value="approved">Đã duyệt</Option>
          <Option value="rejected">Từ chối</Option>
          <Option value="cancelled">Đã hủy</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
