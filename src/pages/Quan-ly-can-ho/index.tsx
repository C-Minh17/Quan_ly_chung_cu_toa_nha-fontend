import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FormApartment from './components/Form';

const { Title } = Typography

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  'Trống':        { label: 'Trống',        color: 'green' },
  'vacant':       { label: 'Trống',        color: 'green' },
  'Đã thuê':      { label: 'Đã thuê',      color: 'blue' },
  'occupied':     { label: 'Đã thuê',      color: 'blue' },
  'Đã đặt':       { label: 'Đã đặt',       color: 'gold' },
  'reserved':     { label: 'Đã đặt',       color: 'gold' },
  'Đang bảo trì': { label: 'Đang bảo trì', color: 'volcano' },
  'maintenance':  { label: 'Đang bảo trì', color: 'volcano' },
};

const ManagerApartment = () => {
  const {
    refreshKey,
    infoAllApartment,
    loadingInfoAllApartment,
    handleGetInfoAllApartment,
    handleDeleteApartment,
  } = useModel("apartment.apartment");

  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel("building.building");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MApartment.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [detailRecord, setDetailRecord] = useState<MApartment.IRecord | null>(null);

  const columns: IColumn<MApartment.IRecord>[] = [
    {
      title: "Mã căn hộ",
      align: "center",
      dataIndex: "apartment_code",
      width: 120,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tòa nhà",
      align: "center",
      width: 180,
      render: (_: any, record: MApartment.IRecord) => {
        const building = infoAllBuilding?.find(b => b._id === record.building_id);
        return building?.name || 'N/A';
      },
    },
    {
      title: "Tầng",
      align: "center",
      width: 90,
      render: (_: any, record: MApartment.IRecord) => {
        const num = (record as any)?.floor?.floor_number;
        return num != null ? `Tầng ${num}` : 'N/A';
      },
    },
    {
      title: "Loại căn hộ",
      align: "center",
      dataIndex: "apartment_type",
      width: 140,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Diện tích",
      align: "center",
      dataIndex: "area",
      width: 100,
      filterType: "number",
      sortable: true,
      render: (val: any) => val != null ? `${val} m²` : '',
    },
    {
      title: "Giá",
      align: "center",
      dataIndex: "price",
      width: 160,
      filterType: "number",
      sortable: true,
      render: (val: any) => val != null ? val.toLocaleString('vi-VN') + ' VNĐ' : '',
    },
    {
      title: "P.Ngủ",
      align: "center",
      dataIndex: "num_bedrooms",
      width: 80,
    },
    {
      title: "P.Tắm",
      align: "center",
      dataIndex: "num_bathrooms",
      width: 80,
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      width: 140,
      filterType: "string",
      render: (text: string) => {
        const info = STATUS_MAP[text] || { label: text, color: 'default' };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: MApartment.IRecord) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => setDetailRecord(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord({
                  ...record,
                  floor_id: (record as any)?.floor?._id || record.floor_id,
                  building_id: record.building_id
                    || (record as any)?.floor?.building?._id
                    || (record as any)?.floor?.building_id,
                });
                setShowEdit(true);
                setEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa căn hộ này?"
              placement="topLeft"
              onConfirm={() => {
                handleDeleteApartment(record._id as string).then(() => {
                  handleGetInfoAllApartment();
                });
              }}
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ]

  useEffect(() => {
    handleGetInfoAllApartment();
    handleGetInfoAllBuilding();
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý căn hộ</Title>
      <TableStaticData
        columns={columns}
        data={infoAllApartment || []}
        loading={loadingInfoAllApartment}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllApartment()}
        Form={FormApartment}
        formProps={{
          initialValues: record,
          setShowEdit: setShowEdit,
          edit: edit,
        }}
        setShowEdit={(val) => {
          setShowEdit(val);
          if (!val) {
            setRecord({});
            setEdit(false);
          }
        }}
        widthDrawer={700}
        addStt
      />

      <Modal
        title={`Chi tiết căn hộ: ${detailRecord?.apartment_code || ''}`}
        open={!!detailRecord}
        onCancel={() => setDetailRecord(null)}
        footer={null}
        width={640}
        destroyOnClose
      >
        {detailRecord && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã căn hộ">{detailRecord.apartment_code}</Descriptions.Item>
            <Descriptions.Item label="Loại căn hộ">{detailRecord.apartment_type}</Descriptions.Item>
            <Descriptions.Item label="Tòa nhà">
              {infoAllBuilding?.find(b => b._id === detailRecord.building_id)?.name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Tầng">
              {(detailRecord as any)?.floor?.floor_number != null
                ? `Tầng ${(detailRecord as any).floor.floor_number}`
                : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Diện tích">{detailRecord.area} m²</Descriptions.Item>
            <Descriptions.Item label="Giá">
              {detailRecord.price?.toLocaleString('vi-VN')} VNĐ
            </Descriptions.Item>
            <Descriptions.Item label="Phòng ngủ">{detailRecord.num_bedrooms}</Descriptions.Item>
            <Descriptions.Item label="Phòng tắm">{detailRecord.num_bathrooms}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              {(() => {
                const info = STATUS_MAP[detailRecord.status || ''] || { label: detailRecord.status, color: 'default' };
                return <Tag color={info.color}>{info.label}</Tag>;
              })()}
            </Descriptions.Item>
            {detailRecord.contract_number && (
              <Descriptions.Item label="Hợp đồng" span={2}>{detailRecord.contract_number}</Descriptions.Item>
            )}
            {detailRecord.contract_start_date && (
              <Descriptions.Item label="Ngày bắt đầu HĐ">
                {new Date(detailRecord.contract_start_date).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            )}
            {detailRecord.contract_end_date && (
              <Descriptions.Item label="Ngày kết thúc HĐ">
                {new Date(detailRecord.contract_end_date).toLocaleDateString('vi-VN')}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </>
  )
}

export default ManagerApartment
