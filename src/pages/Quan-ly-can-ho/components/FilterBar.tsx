import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  buildingFilter: string;
  statusFilter: string;
  buildings: any[];
  onBuildingFilterChange: (val: string) => void;
  onStatusFilterChange: (val: string) => void;
}

const FilterBar = ({
  buildingFilter,
  statusFilter,
  buildings,
  onBuildingFilterChange,
  onStatusFilterChange,
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
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tòa nhà:</span>
        <Select
          style={{ width: 200 }}
          value={buildingFilter}
          onChange={onBuildingFilterChange}
        >
          <Option value="all">Tất cả</Option>
          {buildings?.map(b => (
            <Option key={b._id} value={b._id}>{b.name}</Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Trạng thái:</span>
        <Select
          style={{ width: 160 }}
          value={statusFilter}
          onChange={onStatusFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="vacant">Trống</Option>
          <Option value="occupied">Đã thuê</Option>
          <Option value="reserved">Đã đặt</Option>
          <Option value="maintenance">Bảo trì</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
