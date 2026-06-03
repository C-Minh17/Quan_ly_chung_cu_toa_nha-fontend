import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  statusFilter: string;
  contractTypeFilter: string;
  onStatusFilterChange: (val: string) => void;
  onContractTypeFilterChange: (val: string) => void;
}

const FilterBar = ({
  statusFilter,
  contractTypeFilter,
  onStatusFilterChange,
  onContractTypeFilterChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Loại hợp đồng:</span>
        <Select
          style={{ width: 160 }}
          value={contractTypeFilter}
          onChange={onContractTypeFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="purchase">Mua bán</Option>
          <Option value="lease">Cho thuê</Option>
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Trạng thái:</span>
        <Select
          style={{ width: 180 }}
          value={statusFilter}
          onChange={onStatusFilterChange}
        >
          <Option value="all">Tất cả</Option>
          <Option value="active">Đang hiệu lực</Option>
          <Option value="expired">Đã hết hạn</Option>
          <Option value="terminated">Đã chấm dứt</Option>
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
