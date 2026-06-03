import { Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Props {
  buildingId: string;
  feeTypeId: string;
  month: number | string;
  year: number | string;
  buildings: any[];
  feeTypes: any[];
  onBuildingChange: (val: string) => void;
  onFeeTypeChange: (val: string) => void;
  onMonthChange: (val: any) => void;
  onYearChange: (val: any) => void;
}

const FilterBar = ({
  buildingId,
  feeTypeId,
  month,
  year,
  buildings,
  feeTypes,
  onBuildingChange,
  onFeeTypeChange,
  onMonthChange,
  onYearChange,
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
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tòa nhà:</span>
        <Select
          style={{ width: 160 }}
          value={buildingId}
          onChange={onBuildingChange}
        >
          <Option value="all">Tất cả</Option>
          {buildings?.map(b => (
            <Option key={b._id} value={b._id}>{b.name}</Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Loại chỉ số:</span>
        <Select
          style={{ width: 160 }}
          value={feeTypeId}
          onChange={onFeeTypeChange}
        >
          <Option value="all">Tất cả</Option>
          {feeTypes?.map(f => (
            <Option key={f._id} value={f._id}>{f.name}</Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Tháng:</span>
        <Select
          style={{ width: 110 }}
          value={month}
          onChange={onMonthChange}
        >
          <Option value="all">Tất cả</Option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <Option key={m} value={m}>Tháng {m}</Option>
          ))}
        </Select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 13, color: '#8c8c8c' }}>Năm:</span>
        <Select
          style={{ width: 110 }}
          value={year}
          onChange={onYearChange}
        >
          <Option value="all">Tất cả</Option>
          {[2024, 2025, 2026, 2027, 2028].map(y => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default FilterBar;
