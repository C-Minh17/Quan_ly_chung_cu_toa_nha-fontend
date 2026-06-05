import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { AppstoreOutlined, DeleteOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { Badge, Button, Divider, Input, Modal, Popconfirm, Space, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FormFloor from './components/Form';
import FilterBar from './components/FilterBar';

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

  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel("building.building");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MFloor.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [showLayout, setShowLayout] = useState(false);
  const [layoutFloorName, setLayoutFloorName] = useState('');
  const [searchKeyword, setSearchKeyword] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("all");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

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
                setLayoutFloorName(record.id || '');
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
    handleGetInfoAllBuilding()
  }, [refreshKey])

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-quan-ly-tang');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-quan-ly-tang';
          placeholder.style.display = 'inline-flex';
          placeholder.style.marginRight = '8px';
          reloadBtn.parentNode?.insertBefore(placeholder, reloadBtn);
        }
        setPortalContainer(placeholder);
      }
    };

    findAndInsert();
    const timer = setTimeout(findAndInsert, 500);
    return () => clearTimeout(timer);
  }, [infoAllFloor, loadingInfoAllFloor]);

  const filteredData = useMemo(() => {
    let data = infoAllFloor || [];

    if (buildingFilter !== "all") {
      data = data.filter((item: any) => {
        const bid = item.building?._id || item.building_id;
        return bid === buildingFilter;
      });
    }

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter((item: any) =>
        [item.id, item.description, item.building?.name]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllFloor, searchKeyword, buildingFilter]);

  const isFilterActive = buildingFilter !== "all";

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AppstoreOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý tầng</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý danh sách các tầng trong các tòa nhà
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo mã tầng, mô tả..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      {portalContainer && createPortal(
        <Tooltip title="Bộ lọc tùy chỉnh">
          <Badge dot={isFilterActive} offset={[-2, 2]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterModalVisible(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
            >
              Bộ lọc
            </Button>
          </Badge>
        </Tooltip>,
        portalContainer
      )}

      <FilterBar
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        onApply={(values) => {
          setBuildingFilter(values.buildingFilter);
          setFilterModalVisible(false);
        }}
        buildingFilter={buildingFilter}
        buildings={infoAllBuilding || []}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllFloor}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllFloor()}
        Form={FormFloor}
        formProps={{
          initialValues: Object.keys(record).length > 0 ? record : { building_id: buildingFilter !== 'all' ? buildingFilter : undefined },
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
