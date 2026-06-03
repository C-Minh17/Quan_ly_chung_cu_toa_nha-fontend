import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  buildingFilter: string;
  buildings: any[];
  onBuildingFilterChange: (val: string) => void;
}

const FilterBar = ({
  buildingFilter,
  buildings,
  onBuildingFilterChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tòa nhà:</span>
        <Select
          style={{ width: 220 }}
          value={buildingFilter}
          onChange={onBuildingFilterChange}
        >
          <Option value="all">Tất cả</Option>
          {buildings?.map(b => (
            <Option key={b._id} value={b._id}>{b.name}</Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
