import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  residentTypeFilter: string;
  primaryFilter: string;
  onResidentTypeFilterChange: (val: string) => void;
  onPrimaryFilterChange: (val: string) => void;
}

const FilterBar = ({
  residentTypeFilter,
  primaryFilter,
  onResidentTypeFilterChange,
  onPrimaryFilterChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Loại cư dân:</span>
        <Select
          style={{ width: 160 }}
          value={residentTypeFilter}
          onChange={onResidentTypeFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="OWNER">Chủ hộ</Option>
          <Option value="FAMILY_MEMBER">Thành viên</Option>
          <Option value="TENANT">Khách thuê</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Vai trò:</span>
        <Select
          style={{ width: 160 }}
          value={primaryFilter}
          onChange={onPrimaryFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="primary">Cư dân chính</Option>
          <Option value="secondary">Cư dân phụ</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
