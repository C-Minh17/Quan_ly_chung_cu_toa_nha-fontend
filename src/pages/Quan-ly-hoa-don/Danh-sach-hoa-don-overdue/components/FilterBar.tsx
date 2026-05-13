import { Select, Row, Col } from 'antd';

const { Option } = Select;

interface Props {
  apartmentId: string;
  month: number | string;
  year: number | string;
  apartments: any[];
  onApartmentChange: (val: string) => void;
  onMonthChange: (val: any) => void;
  onYearChange: (val: any) => void;
}

const FilterBar = ({
  apartmentId, month, year,
  apartments,
  onApartmentChange, onMonthChange, onYearChange,
}: Props) => {
  return (
    <Row gutter={16} style={{ marginBottom: 20 }}>
      <Col span={8}>
        <div style={{ marginBottom: 5 }}>Căn hộ</div>
        <Select
          style={{ width: '100%' }}
          value={apartmentId}
          onChange={onApartmentChange}
          showSearch
          optionFilterProp="children"
        >
          <Option value="all">Tất cả</Option>
          {apartments?.map((a: any) => (
            <Option key={a._id} value={a._id}>{a.apartment_code}</Option>
          ))}
        </Select>
      </Col>

      <Col span={8}>
        <div style={{ marginBottom: 5 }}>Tháng</div>
        <Select style={{ width: '100%' }} value={month} onChange={onMonthChange}>
          <Option value="all">Tất cả</Option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <Option key={m} value={m}>Tháng {m}</Option>
          ))}
        </Select>
      </Col>

      <Col span={8}>
        <div style={{ marginBottom: 5 }}>Năm</div>
        <Select style={{ width: '100%' }} value={year} onChange={onYearChange}>
          <Option value="all">Tất cả</Option>
          {[2024, 2025, 2026, 2027, 2028].map(y => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
};

export default FilterBar;
