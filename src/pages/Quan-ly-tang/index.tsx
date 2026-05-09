import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { AppstoreOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, Button, Modal, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FormFloor from './components/Form';

const { Title } = Typography

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  vacant: { label: 'Trống', color: '#52c41a' },
  occupied: { label: 'Đã thuê', color: '#1677ff' },
  reserved: { label: 'Đã đặt', color: '#faad14' },
  maintenance: { label: 'Bảo trì', color: '#ff4d4f' },
};

const ManagerFloor = () => {
  const {
    refreshKey,
    infoAllFloor,
    loadingInfoAllFloor,
    handleGetInfoAllFloor,
    handleDeleteFloor,
    handleGetFloorLayout,
    layoutInfo,
    loadingLayout,
  } = useModel("floor.floor");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MFloor.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const [layoutFloorName, setLayoutFloorName] = useState('');

  const columns: IColumn<MFloor.IRecord>[] = [
    {
      title: "Mã tầng",
      align: "center",
      dataIndex: "id",
      width: 120,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Số thứ tự tầng",
      align: "center",
      dataIndex: "floor_number",
      width: 150,
      filterType: "number",
      sortable: true,
    },
    {
      title: "Tòa nhà",
      align: "center",
      dataIndex: ["building", "name"],
      width: 250,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Mô tả",
      align: "center",
      dataIndex: "description",
      width: 250,
      filterType: "string",
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (record: MFloor.IRecord) => (
        <>
          <Tooltip title="Sơ đồ tầng">
            <Button
              type="link"
              icon={<AppstoreOutlined />}
              onClick={() => {
                handleGetFloorLayout(record._id as string).then(() => setShowLayout(true));
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setRecord({
                  ...record,
                  building_id: (record as MFloor.IRecord)?.building?._id || (record as MFloor.IRecord).building_id,
                });
                setShowEdit(true);
                setEdit(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tầng này?"
              placement="topLeft"
              onConfirm={() => {
                handleDeleteFloor(record._id as string).then(() => {
                  handleGetInfoAllFloor();
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
    handleGetInfoAllFloor()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý tầng</Title>
      <TableStaticData
        columns={columns}
        data={infoAllFloor || []}
        loading={loadingInfoAllFloor}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllFloor()}
        Form={FormFloor}
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
        widthDrawer={600}
        addStt
      />

      <Modal
        title={`Sơ đồ tầng: ${layoutFloorName}`}
        open={showLayout}
        onCancel={() => setShowLayout(false)}
        footer={null}
        width={820}
        destroyOnClose
      >
        {loadingLayout ? (
          <div style={{ textAlign: 'center', padding: 40 }}>Đang tải sơ đồ...</div>
        ) : (
          <>
            <Space wrap style={{ marginBottom: 16 }}>
              {Object.entries(STATUS_MAP).map(([key, { label, color }]) => (
                <Tag key={key} color={color}>{label}</Tag>
              ))}
            </Space>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 12,
              }}
            >
              {(layoutInfo?.apartments || []).map((apt: any) => {
                const statusInfo = STATUS_MAP[apt.status] || { label: apt.status, color: '#d9d9d9' };
                return (
                  <Tooltip
                    key={apt._id}
                    title={
                      <div>
                        <div><b>{apt.apartment_code}</b></div>
                        <div>Diện tích: {apt.area} m²</div>
                        <div>Phòng ngủ: {apt.num_bedrooms}</div>
                        <div>Phòng tắm: {apt.num_bathrooms}</div>
                        <div>Trạng thái: {statusInfo.label}</div>
                      </div>
                    }
                  >
                    <div
                      style={{
                        border: `2px solid ${statusInfo.color}`,
                        borderRadius: 8,
                        padding: '10px 8px',
                        textAlign: 'center',
                        backgroundColor: `${statusInfo.color}18`,
                        cursor: 'default',
                        transition: 'transform 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{apt.apartment_code}</div>
                      <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{apt.area} m²</div>
                      <Badge
                        color={statusInfo.color}
                        text={<span style={{ fontSize: 11 }}>{statusInfo.label}</span>}
                        style={{ marginTop: 4 }}
                      />
                    </div>
                  </Tooltip>
                );
              })}
              {(layoutInfo?.apartments || []).length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#999', padding: 24 }}>
                  Tầng này chưa có căn hộ nào.
                </div>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  )
}

export default ManagerFloor
