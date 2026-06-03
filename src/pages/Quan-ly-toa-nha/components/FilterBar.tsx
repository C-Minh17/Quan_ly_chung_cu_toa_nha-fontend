import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  floorFilter: string;
  onFloorFilterChange: (val: string) => void;
}

const FilterBar = ({
  floorFilter,
  onFloorFilterChange,
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
      gap: 12,
      flexWrap: 'wrap'
    }}>
      <Space style={{ fontWeight: 500, color: '#595959' }}>
        <FilterOutlined style={{ color: '#1677ff' }} />
        <span>Bộ lọc:</span>
      </Space>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Số tầng:</span>
        <Select
          style={{ width: 180 }}
          value={floorFilter}
          onChange={onFloorFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="under_5">Dưới 5 tầng</Option>
          <Option value="5_to_10">Từ 5 đến 10 tầng</Option>
          <Option value="over_10">Trên 10 tầng</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;

