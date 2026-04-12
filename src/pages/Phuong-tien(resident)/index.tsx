import { useModel } from '@umijs/max';
import {
  List,
  Card,
  Descriptions,
  Tag,
  Typography,
  Spin,
  Empty,
  Space,
  Grid
} from 'antd';
import type { DescriptionsProps } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import {
  CarOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ResidentVehicles = () => {
  const { infoMyVehicles, loadingInfoMyVehicles, handleGetMyVehicles } = useModel('vehicle.vehicle');
  const screens = useBreakpoint();

  useEffect(() => {
    handleGetMyVehicles();
  }, []);

  const isMobile = !screens.sm;

  if (loadingInfoMyVehicles) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải thông tin phương tiện..." />
      </div>
    );
  }

  if (!infoMyVehicles || infoMyVehicles.length === 0) {
    return (
      <div style={{ padding: '24px' }}>
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '40px 0' }}>
          <Empty description="Bạn chưa đăng ký phương tiện nào" />
        </Card>
      </div>
    );
  }

  const renderStatus = (isActive: boolean) => {
    return isActive
      ? <Tag color="success">Đang hoạt động</Tag>
      : <Tag color="error">Ngừng hoạt động</Tag>;
  };

  const renderType = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'car': return <Tag color="blue">Khách/Ô tô</Tag>;
      case 'motorbike': return <Tag color="gold">Xe máy</Tag>;
      case 'bicycle': return <Tag color="green">Xe đạp</Tag>;
      case 'e-bike': return <Tag color="cyan">Xe đạp điện</Tag>;
      default: return <Tag>{type || 'Không xác định'}</Tag>;
    }
  };

  return (
    <div style={{
      padding: isMobile ? '12px' : '24px',
      minHeight: '100vh',
    }}>
      <div style={{ marginBottom: 24, paddingLeft: 8 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          Quản Lý Phương Tiện
        </Title>
        <Text style={{ fontSize: 16 }}>
          Thông tin chi tiết các phương tiện bạn gửi tại tòa nhà
        </Text>
      </div>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={infoMyVehicles}
        renderItem={(vehicle) => {

          const vehicleItems: DescriptionsProps['items'] = [
            {
              key: '1',
              label: 'Biển số xe',
              children: <Text strong style={{ color: '#1890ff', fontSize: 16 }}>{vehicle?.license_plate}</Text>,
            },
            {
              key: '6',
              label: 'Số thẻ xe',
              children: vehicle?.card_number ? <Text code><IdcardOutlined /> {vehicle.card_number}</Text> : '-',
            },
            {
              key: '2',
              label: 'Loại phương tiện',
              children: renderType(vehicle?.vehicle_type),
            },
            {
              key: '3',
              label: 'Trạng thái',
              children: renderStatus(vehicle?.is_active),
            },
            {
              key: '4',
              label: 'Nhãn hiệu',
              children: vehicle?.brand || '-',
            },
            {
              key: '5',
              label: 'Màu sắc',
              children: vehicle?.color || '-',
            },
            {
              key: '7',
              label: 'Ngày đăng ký',
              children: vehicle?.created_at ? moment(vehicle.created_at).format('DD/MM/YYYY HH:mm') : '-',
            },
          ];

          return (
            <List.Item style={{ padding: 0, marginBottom: 24 }}>
              <Card
                title={
                  <Space>
                    <CarOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                    <span style={{ color: '#262626', fontSize: 18 }}>Phương tiện: {vehicle?.license_plate}</span>
                  </Space>
                }
                extra={<SafetyCertificateOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                style={{
                  borderRadius: '12px',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #f0f0f0'
                }}
                styles={{
                  header: {
                    backgroundColor: '#fafafa',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '16px 24px',
                  },
                  body: {
                    padding: '24px'
                  }
                }}
              >
                <Descriptions
                  items={vehicleItems}
                  column={{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
                  bordered
                  size="middle"
                  labelStyle={{ backgroundColor: '#fafafa', fontWeight: 500, width: '150px' }}
                />
              </Card>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ResidentVehicles;
