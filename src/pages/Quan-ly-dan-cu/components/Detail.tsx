import { Descriptions, Image, Tag, Typography } from 'antd';
import moment from 'moment';

const { Title } = Typography;

interface IDetailProps {
  record: MResident.IRecord | null;
}

const DetailResident = ({ record }: IDetailProps) => {
  if (!record) return null;

  const renderType = (type: string) => {
    const types: any = {
      'owner': <Tag color="gold">Chủ hộ</Tag>,
      'tenant': <Tag color="green">Khách thuê</Tag>,
    };
    return types[type] || type;
  };

  const renderGender = (gender: string) => {
    const genders: any = {
      'male': 'Nam',
      'female': 'Nữ',
      'other': 'Khác',
    };
    return genders[gender] || gender;
  };

  return (
    <>
      <Descriptions title="Thông tin cơ bản" bordered column={2}>
        <Descriptions.Item label="Họ và tên">{record?.user?.name}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{record?.user?.phone}</Descriptions.Item>
        <Descriptions.Item label="Email">{record?.user?.email}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{renderGender(record?.gender)}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">
          {record?.date_of_birth ? moment(record.date_of_birth).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Loại cư dân">{renderType(record?.resident_type)}</Descriptions.Item>
        <Descriptions.Item label="Là cư dân chính" span={2}>
          {record?.is_primary ? <Tag color="cyan">Chính</Tag> : <Tag>Phụ</Tag>}
        </Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>Thông tin CCCD</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Số CCCD" span={2}>{record?.id_card_number}</Descriptions.Item>
        <Descriptions.Item label="Ngày cấp">
          {record?.id_card_date ? moment(record.id_card_date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Nơi cấp">{record?.id_card_place}</Descriptions.Item>
        
        <Descriptions.Item label="Ảnh mặt trước" span={1}>
          {record?.id_card_front_image ? (
            <Image src={record.id_card_front_image} width={150} height={100} style={{ objectFit: 'cover' }} />
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ảnh mặt sau" span={1}>
          {record?.id_card_back_image ? (
            <Image src={record.id_card_back_image} width={150} height={100} style={{ objectFit: 'cover' }} />
          ) : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Title level={5} style={{ marginTop: 24, marginBottom: 16 }}>Thông tin cư trú</Title>
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Căn hộ">{record?.apartment?.apartment_code}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ thường trú">{record?.permanent_address}</Descriptions.Item>
        <Descriptions.Item label="Ngày chuyển đến">
          {record?.move_in_date ? moment(record.move_in_date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày chuyển đi">
          {record?.move_out_date ? moment(record.move_out_date).format('DD/MM/YYYY') : '-'}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default DetailResident;
