import { useModel } from '@umijs/max';
import {
  Card,
  Descriptions,
  Tag,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Space,
  Grid,
  Button
} from 'antd';
import type { DescriptionsProps } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import {
  FileTextOutlined,
  HomeOutlined,
  FilePdfOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return '-';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const ResidentContracts = () => {
  const { infoMyContracts, loadingInfoMyContracts, handleGetMyContracts } = useModel('contract.contract');
  const screens = useBreakpoint();

  useEffect(() => {
    handleGetMyContracts();
  }, []);

  const isMobile = !screens.sm;

  if (loadingInfoMyContracts) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải thông tin hợp đồng..." />
      </div>
    );
  }

  // Handle case where infoMyContracts is null or an empty array
  if (!infoMyContracts || infoMyContracts.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0' }}>
          <Empty description="Bạn chưa có hợp đồng nào liên kết với tài khoản này" />
        </Card>
      </div>
    );
  }

  const renderStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Tag color="success">Đang hiệu lực</Tag>;
      case 'expired':
        return <Tag color="warning">Đã hết hạn</Tag>;
      case 'terminated':
        return <Tag color="error">Đã chấm dứt</Tag>;
      default:
        return <Tag>{status || 'Không xác định'}</Tag>;
    }
  };

  const renderType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'rent': return <Tag color="blue">Thuê căn hộ</Tag>;
      case 'purchase': return <Tag color="gold">Mua căn hộ</Tag>;
      default: return <Tag>{type || 'Không xác định'}</Tag>;
    }
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '24px',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Quản Lý Hợp Đồng
        </Title>
        <Text style={{ fontSize: 16 }}>
          Thông tin chi tiết các hợp đồng hiện tại của bạn
        </Text>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {infoMyContracts.map((contract, index) => {

          const contractItems: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'Mã hợp đồng',
              children: <Text strong style={{ color: '#1890ff' }}>{contract?.contract_code}</Text>,
            },
            {
              key: '2',
              label: 'Loại hợp đồng',
              children: renderType(contract?.contract_type),
            },
            {
              key: '3',
              label: 'Tình trạng',
              children: renderStatus(contract?.status),
            },
            {
              key: '4',
              label: 'Ngày bắt đầu',
              children: contract?.start_date ? moment(contract.start_date).format('DD/MM/YYYY') : '-',
            },
            {
              key: '5',
              label: 'Ngày kết thúc',
              children: contract?.end_date ? moment(contract.end_date).format('DD/MM/YYYY') : '-',
            },
            {
              key: '6',
              label: 'Trị giá hợp đồng / tháng',
              children: <Text strong>{formatCurrency(contract?.monthly_price)}</Text>,
            },
            {
              key: '7',
              label: 'Tiền cọc',
              children: <Text strong>{formatCurrency(contract?.deposit)}</Text>,
            },
            {
              key: '8',
              label: 'Ngày lập',
              children: contract?.created_at ? moment(contract.created_at).format('DD/MM/YYYY') : '-',
            },
          ];

          const apartmentItems: DescriptionsProps['items'] = [
            {
              key: 'apt_code',
              label: 'Mã căn hộ',
              children: <Text strong>{contract?.apartment?.apartment_code || '-'}</Text>,
            },
            {
              key: 'apt_type',
              label: 'Loại căn hộ',
              children: contract?.apartment?.apartment_type || '-',
            },
            {
              key: 'apt_area',
              label: 'Diện tích',
              children: contract?.apartment?.area ? `${contract.apartment.area} m²` : '-',
            },
            {
              key: 'apt_bed',
              label: 'Số phòng ngủ',
              children: contract?.apartment?.num_bedrooms || '-',
            },
            {
              key: 'apt_bath',
              label: 'Số phòng tắm',
              children: contract?.apartment?.num_bathrooms || '-',
            },
            {
              key: 'apt_price',
              label: 'Giá tham khảo',
              children: formatCurrency(contract?.apartment?.price),
              span: 3
            },
          ];

          return (
            <Card
              key={contract._id || index}
              style={{
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                border: '1px solid #f0f0f0'
              }}
              styles={{
                body: { padding: 0 }
              }}
            >
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderTop: '4px solid #1890ff' // Top indicator
              }}>
                <Space>
                  <SafetyCertificateOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                  <Title level={4} style={{ margin: 0 }}>
                    Hợp đồng số: {contract?.contract_code}
                  </Title>
                </Space>
                {contract?.file_url && (
                  <Button
                    type="primary"
                    icon={<FilePdfOutlined />}
                    href={contract.file_url}
                    target="_blank"
                    shape="round"
                  >
                    Xem bản cứng
                  </Button>
                )}
              </div>

              <Row>
                <Col xs={24} lg={15} style={{ padding: '24px', borderRight: isMobile ? 'none' : '1px solid #f0f0f0' }}>
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#e6f7ff', padding: '8px', borderRadius: '8px', marginRight: '12px' }}>
                      <FileTextOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                    </div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>Chi tiết giao dịch</Title>
                  </div>
                  <Descriptions
                    items={contractItems}
                    column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                    bordered
                    size="middle"
                    labelStyle={{ backgroundColor: '#fafafa', fontWeight: 500 }}
                  />

                  {contract?.notes && (
                    <div style={{ marginTop: 24 }}>
                      <Text type="secondary" strong>Ghi chú:</Text>
                      <div style={{
                        marginTop: 8,
                        padding: '12px 16px',
                        backgroundColor: '#fffbe6',
                        borderRadius: 8,
                        borderLeft: '4px solid #faad14'
                      }}>
                        {contract.notes}
                      </div>
                    </div>
                  )}
                </Col>

                <Col xs={24} lg={9} style={{ padding: '24px', backgroundColor: '#fafbfc' }}>
                  <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ backgroundColor: '#fff7e6', padding: '8px', borderRadius: '8px', marginRight: '12px' }}>
                      <HomeOutlined style={{ fontSize: 20, color: '#fa8c16' }} />
                    </div>
                    <Title level={5} style={{ margin: 0, color: '#262626' }}>Thông tin bất động sản</Title>
                  </div>

                  {contract?.apartment ? (
                    <Card
                      size="small"
                      bordered={false}
                      style={{
                        backgroundColor: '#ffffff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                        borderRadius: '12px'
                      }}
                    >
                      <Descriptions
                        items={apartmentItems}
                        column={1}
                        size="small"
                        labelStyle={{ color: '#595959', width: '120px' }}
                      />
                    </Card>
                  ) : (
                    <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px' }}>
                      <Empty description="Không có thông tin bất động sản" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          );
        })}
      </Space>
    </div>
  );
};

export default ResidentContracts;
