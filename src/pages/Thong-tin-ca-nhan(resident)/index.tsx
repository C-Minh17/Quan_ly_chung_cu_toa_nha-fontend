import { useModel } from '@umijs/max';
import {
  Card,
  Descriptions,
  Avatar,
  Tag,
  Typography,
  Row,
  Col,
  Image,
  Spin,
  Empty,
  Divider,
  Space,
  Grid,
} from 'antd';
import type { DescriptionsProps } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  HomeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CrownOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import residentBg from '@/assets/resident_profile_bg.png';
import avatarDF from '@/assets/default_avatar.png';


const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const ResidentProfile = () => {
  const { infoMeResident, loadingInfoMeResident, handleGetMeResident } = useModel('resident.resident');
  const screens = useBreakpoint();

  useEffect(() => {
    handleGetMeResident();
  }, []);

  if (loadingInfoMeResident) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  if (!infoMeResident) {
    return (
      <Card style={{ margin: 24 }}>
        <Empty description="Không tìm thấy thông tin cư dân" />
      </Card>
    );
  }

  const renderType = (type: string) => {
    const t = type?.toUpperCase();
    const types: any = {
      'OWNER': <Tag color="gold" icon={<CrownOutlined />}>Chủ hộ</Tag>,
      'TENANT': <Tag color="green">Khách thuê</Tag>,
      'FAMILY_MEMBER': <Tag color="blue">Thành viên</Tag>,
    };
    return types[t] || <Tag>{type}</Tag>;
  };

  const renderGender = (gender: string) => {
    const genders: any = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác',
    };
    return genders[gender] || gender;
  };

  const isMobile = !screens.sm;

  const personalItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Họ và tên đệm',
      children: infoMeResident?.user?.family_name || '-',
    },
    {
      key: '2',
      label: 'Tên',
      children: infoMeResident?.user?.given_name || '-',
    },
    {
      key: '3',
      label: 'Ngày sinh',
      children: infoMeResident?.date_of_birth ? moment(infoMeResident.date_of_birth).format('DD/MM/YYYY') : '-',
    },
    {
      key: '4',
      label: 'Giới tính',
      children: renderGender(infoMeResident?.gender),
    },
    {
      key: '5',
      label: 'Địa chỉ thường trú',
      span: 2,
      children: infoMeResident?.permanent_address,
    },
    {
      key: '6',
      label: 'Ngày chuyển đến',
      children: (
        <Space>
          <CalendarOutlined />
          {infoMeResident?.move_in_date ? moment(infoMeResident.move_in_date).format('DD/MM/YYYY') : '-'}
        </Space>
      ),
    },
    {
      key: '7',
      label: 'Ngày chuyển đi',
      children: (
        <Space>
          <CalendarOutlined />
          {infoMeResident?.move_out_date ? moment(infoMeResident.move_out_date).format('DD/MM/YYYY') : '-'}
        </Space>
      ),
    },
    {
      key: '8',
      label: 'Tình trạng cư trú',
      children: (
        <Tag color={infoMeResident?.move_out_date ? 'orange' : 'success'}>
          {infoMeResident?.move_out_date ? 'Đã chuyển đi' : 'Đang cư trú'}
        </Tag>
      ),
    },
  ];

  const accountItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Trạng thái tài khoản',
      children: infoMeResident?.user?.is_active ? <Tag color="success">Đang hoạt động</Tag> : <Tag color="error">Đã khóa</Tag>,
    },
    {
      key: '2',
      label: 'Xác minh email',
      children: infoMeResident?.user?.email_verified ? <Tag color="blue">Đã xác minh</Tag> : <Tag color="warning">Chưa xác minh</Tag>,
    },
    {
      key: '3',
      label: 'Ngày tham gia',
      children: moment(infoMeResident?.user?.created_at).format('DD/MM/YYYY HH:mm'),
    },
    {
      key: '4',
      label: 'Cập nhật lần cuối',
      children: moment(infoMeResident?.user?.updated_at).format('DD/MM/YYYY HH:mm'),
    },
  ];

  const idCardItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Số CCCD',
      span: 2,
      children: <Text strong>{infoMeResident?.id_card_number}</Text>,
    },
    {
      key: '2',
      label: 'Ngày cấp',
      children: infoMeResident?.id_card_date ? moment(infoMeResident.id_card_date).format('DD/MM/YYYY') : '-',
    },
    {
      key: '3',
      label: 'Nơi cấp',
      children: infoMeResident?.id_card_place,
    },
  ];

  const apartmentItems: DescriptionsProps['items'] = [
    {
      key: 'building_name',
      label: 'Tòa nhà',
      children: <Text strong>{infoMeResident?.apartment?.floor?.building?.name || '-'}</Text>,
    },
    {
      key: 'building_addr',
      label: 'Địa chỉ tòa nhà',
      children: infoMeResident?.apartment?.floor?.building?.address || '-',
    },
    {
      key: 'floor_name',
      label: 'Tầng',
      children: infoMeResident?.apartment?.floor?.id || '-',
    },
    {
      key: '1',
      label: 'Diện tích',
      children: `${infoMeResident?.apartment?.area} m²`,
    },
    {
      key: '2',
      label: 'Số phòng ngủ',
      children: infoMeResident?.apartment?.num_bedrooms,
    },
    {
      key: '3',
      label: 'Số phòng tắm',
      children: infoMeResident?.apartment?.num_bathrooms,
    },
    {
      key: '4',
      label: 'Trạng thái',
      children: <Tag color="cyan">{infoMeResident?.apartment?.status}</Tag>,
    },
  ];

  return (
    <div style={{
      padding: isMobile ? '12px' : '24px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
    }}>
      <div style={{
        position: 'relative',
        marginBottom: '24px',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '200px',
          backgroundImage: `url(${residentBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.8)',
        }}></div>
        <Card
          bordered={false}
          style={{
            marginTop: isMobile ? '-60px' : '-80px',
            marginLeft: isMobile ? '12px' : '24px',
            marginRight: isMobile ? '12px' : '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            padding: '12px',
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} sm={6} md={4} style={{ textAlign: 'center' }}>
              <Avatar
                size={{ xs: 100, sm: 120, md: 150, lg: 150, xl: 150, xxl: 150 }}
                src={infoMeResident?.user?.picture || avatarDF}
                icon={<UserOutlined />}
                style={{
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  backgroundColor: '#f0f2f5',
                }}
              />
            </Col>
            <Col xs={24} sm={18} md={20}>
              <div style={{ padding: '12px 0' }}>
                <Space direction="vertical" size={2}>
                  <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>
                    {infoMeResident?.user?.name}
                  </Title>
                  <Space split={<Divider type="vertical" />} wrap>
                    <Text type="secondary"><UserOutlined /> {infoMeResident?.user?.preferred_username}</Text>
                    {renderType(infoMeResident?.resident_type)}
                    {infoMeResident?.is_primary && (
                      <Tag color="cyan" icon={<SafetyCertificateOutlined />}>Cư dân chính</Tag>
                    )}
                  </Space>
                </Space>
                <div style={{ marginTop: 16 }}>
                  <Row gutter={[16, 8]}>
                    <Col>
                      <Text><PhoneOutlined /> {infoMeResident?.user?.phone || 'Chưa cập nhật'}</Text>
                    </Col>
                    <Col>
                      <Text><MailOutlined /> {infoMeResident?.user?.email}</Text>
                    </Col>
                    <Col>
                      <Text><EnvironmentOutlined /> {infoMeResident?.apartment?.apartment_code} - {infoMeResident?.apartment?.floor?.name || 'Tầng ...'}</Text>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={24} style={{ width: '100%' }}>
            <Card
              title={<Space><UserOutlined style={{ color: '#1890ff' }} /> <span style={{ color: '#1890ff', fontWeight: 600 }}>Thông tin cá nhân</span></Space>}
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
              styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
            >
              <Descriptions items={personalItems} column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered />
            </Card>

            <Card
              title={<Space><SafetyCertificateOutlined style={{ color: '#1890ff' }} /> <span style={{ color: '#1890ff', fontWeight: 600 }}>Tài khoản & Hệ thống</span></Space>}
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
              styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
            >
              <Descriptions items={accountItems} column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered />
            </Card>

            <Card
              title={<Space><IdcardOutlined style={{ color: '#1890ff' }} /> <span style={{ color: '#1890ff', fontWeight: 600 }}>Thông tin định danh</span></Space>}
              style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}
              styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
            >
              <Descriptions items={idCardItems} column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }} bordered />

              <Divider orientation="left">Ảnh CCCD</Divider>
              <Row gutter={16}>
                <Col span={12}>
                  <div style={{
                    padding: '12px',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    textAlign: 'center',
                  }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Mặt trước</Text>
                    {infoMeResident?.id_card_front_image ? (
                      <Image
                        src={infoMeResident.id_card_front_image}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
                        placeholder={<Spin />}
                      />
                    ) : (
                      <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', color: '#999', borderRadius: '4px' }}>Chưa cập nhật</div>
                    )}
                  </div>
                </Col>
                <Col span={12}>
                  <div style={{
                    padding: '12px',
                    border: '1px dashed #d9d9d9',
                    borderRadius: '8px',
                    backgroundColor: '#fafafa',
                    textAlign: 'center',
                  }}>
                    <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>Mặt sau</Text>
                    {infoMeResident?.id_card_back_image ? (
                      <Image
                        src={infoMeResident.id_card_back_image}
                        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
                        placeholder={<Spin />}
                      />
                    ) : (
                      <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', color: '#999', borderRadius: '4px' }}>Chưa cập nhật</div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={<Space><HomeOutlined style={{ color: '#1890ff' }} /> <span style={{ color: '#1890ff', fontWeight: 600 }}>Thông tin căn hộ</span></Space>}
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f5ff 100%)'
            }}
            actions={[
              <Text type="secondary" key="updated">Cập nhật: {moment(infoMeResident?.updated_at).format('DD/MM/YYYY')}</Text>
            ]}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#e6f7ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}>
                <HomeOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </div>
              <Title level={3} style={{ margin: '8px 0' }}>{infoMeResident?.apartment?.apartment_code}</Title>
              <Tag color="processing">{infoMeResident?.apartment?.apartment_type}</Tag>
            </div>

            <Divider />

            <Descriptions items={apartmentItems} column={1} labelStyle={{ fontWeight: 500 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ResidentProfile;
