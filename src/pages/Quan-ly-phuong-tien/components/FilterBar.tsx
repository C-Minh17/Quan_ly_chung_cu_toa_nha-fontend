import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  vehicleTypeFilter: string;
  onVehicleTypeFilterChange: (val: string) => void;
}

const FilterBar = ({
  vehicleTypeFilter,
  onVehicleTypeFilterChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Loại phương tiện:</span>
        <Select
          style={{ width: 160 }}
          value={vehicleTypeFilter}
          onChange={onVehicleTypeFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="motorbike">Xe máy</Option>
          <Option value="car">Ô tô</Option>
          <Option value="bicycle">Xe đạp</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
