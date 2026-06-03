import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, EyeOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Input, Modal, Popconfirm, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import FormApartment from './components/Form';
import FilterBar from './components/FilterBar';

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredData = useMemo(() => {
    let data = infoAllApartment || [];

    // Filter by building
    if (buildingFilter !== "all") {
      data = data.filter(item => item.building_id === buildingFilter);
    }

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter(item => item.status === statusFilter);
    }

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(item =>
        [item.apartment_code, item.apartment_type]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllApartment, searchKeyword, buildingFilter, statusFilter]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HomeOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý căn hộ</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý danh sách và trạng thái các căn hộ
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo mã căn hộ, loại căn hộ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      <FilterBar
        buildingFilter={buildingFilter}
        statusFilter={statusFilter}
        buildings={infoAllBuilding || []}
        onBuildingFilterChange={setBuildingFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
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
