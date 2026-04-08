import { Descriptions, Tag, Typography, Button, Divider, Row, Col } from 'antd';
import moment from 'moment';
import { FileTextOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface IDetailProps {
  record: MContract.IRecord | null;
}

const DetailContract = ({ record }: IDetailProps) => {
  if (!record) return null;

  const renderStatus = (status: string) => {
    const statuses: any = {
      'active': <Tag color="green">Đang hiệu lực</Tag>,
      'expired': <Tag color="orange">Đã hết hạn</Tag>,
      'terminated': <Tag color="red">Đã chấm dứt</Tag>,
    };
    return statuses[status] || status;
  };

  const renderType = (type: string) => {
    const types: any = {
      'purchase': <Tag color="blue">Mua bán</Tag>,
      'rent': <Tag color="cyan">Cho thuê</Tag>,
    };
    return types[type] || type;
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const renderGender = (gender?: string) => {
    const genders: any = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác',
    };
    return gender ? genders[gender] || gender : '-';
  };

  return (
    <div style={{ padding: '0 10px' }}>
      <Descriptions title="Thông tin hợp đồng" bordered column={2}>
        <Descriptions.Item label="Mã hợp đồng" span={2}>
          <Typography.Text strong style={{ fontSize: '16px', color: '#1890ff' }}>{record.contract_code}</Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Loại hợp đồng">{renderType(record.contract_type)}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">{renderStatus(record.status)}</Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          {record.start_date ? moment(record.start_date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          {record.end_date ? moment(record.end_date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Giá thuê/bán">{formatCurrency(record.monthly_price)}</Descriptions.Item>
        <Descriptions.Item label="Tiền đặt cọc">{formatCurrency(record.deposit)}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {record.created_at ? moment(record.created_at).format('DD/MM/YYYY HH:mm') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật gần nhất">
          {record.updated_at ? moment(record.updated_at).format('DD/MM/YYYY HH:mm') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="File đính kèm" span={2}>
          {record.file_url ? (
            <Button
              type="link"
              icon={<FileTextOutlined />}
              href={record.file_url}
              target="_blank"
              style={{ padding: 0 }}
            >
              Xem tài liệu đính kèm
            </Button>
          ) : 'Không có file'}
        </Descriptions.Item>
        <Descriptions.Item label="Ghi chú" span={2}>{record.notes || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 24 }}>Thông tin đối tượng liên quan</Divider>

      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Descriptions title={<Title level={5}>Thông tin Cư dân</Title>} bordered column={2} size="small">
            <Descriptions.Item label="Họ và tên" span={2}>
              <Typography.Text strong>{record.resident_user?.name}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{record.resident_user?.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{record.resident_user?.email}</Descriptions.Item>
            <Descriptions.Item label="Số CCCD">{record.resident?.id_card_number}</Descriptions.Item>
            <Descriptions.Item label="Giới tính">{renderGender(record.resident?.gender)}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ thương trú" span={2}>{record.resident?.permanent_address}</Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24}>
          <Descriptions title={<Title level={5}>Thông tin Căn hộ</Title>} bordered column={2} size="small">
            <Descriptions.Item label="Mã căn hộ" span={2}>
              <Typography.Text strong>{record.apartment?.apartment_code}</Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Loại căn hộ">{record.apartment?.apartment_type}</Descriptions.Item>
            <Descriptions.Item label="Diện tích">{record.apartment?.area} m²</Descriptions.Item>
            <Descriptions.Item label="Số phòng ngủ">{record.apartment?.num_bedrooms}</Descriptions.Item>
            <Descriptions.Item label="Số phòng tắm">{record.apartment?.num_bathrooms}</Descriptions.Item>
            <Descriptions.Item label="Giá niêm yết" span={2}>{formatCurrency(record.apartment?.price)}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
};

export default DetailContract;
