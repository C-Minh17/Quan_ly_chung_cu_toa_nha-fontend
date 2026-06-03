import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import FormBuilding from './components/Form';
import FilterBar from './components/FilterBar';

const { Title } = Typography

const ManagerBuilding = () => {
  const { refreshKey, infoAllBuilding, loadingInfoAllBuilding, handleGetInfoAllBuilding, handleDeleteBuilding } = useModel("building.building");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MBuilding.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");

  const columns: IColumn<MBuilding.IRecord>[] = [
    {
      title: "Mã tòa nhà",
      align: "center",
      dataIndex: "_id",
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tên tòa nhà",
      align: "center",
      dataIndex: "name",
      width: 250,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Số tầng",
      align: "center",
      dataIndex: "total_floors",
      width: 120,
      filterType: "number",
    },
    {
      title: "Địa chỉ",
      align: "center",
      dataIndex: "address",
      width: 300,
      filterType: "string",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      width: 200,
      filterType: "string",
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (record: MBuilding.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord(record);
                setShowEdit(true);
                setEdit(true);
              }}
              type="link"
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                handleDeleteBuilding(record._id as string).then(() => {
                  handleGetInfoAllBuilding();
                });
              }}
              title="Bạn có chắc chắn muốn xóa tòa nhà này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ]

  const filteredData = useMemo(() => {
    let data = infoAllBuilding || [];

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter((item) =>
        [item._id, item.name, item.address, item.description]
          .filter(Boolean)
          .some((value) => value?.toString().toLowerCase().includes(keyword))
      );
    }

    // Floor filter
    if (floorFilter !== "all") {
      data = data.filter((item) => {
        const floors = item.total_floors || 0;
        if (floorFilter === "under_5") return floors < 5;
        if (floorFilter === "5_to_10") return floors >= 5 && floors <= 10;
        if (floorFilter === "over_10") return floors > 10;
        return true;
      });
    }

    return data;
  }, [infoAllBuilding, searchKeyword, floorFilter]);

  useEffect(() => {
    handleGetInfoAllBuilding()
  }, [refreshKey])

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
          <Title level={3} style={{ margin: 0 }}>Quản lý tòa nhà</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý danh sách các tòa nhà trong hệ thống
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo mã, tên, địa chỉ, mô tả..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      <FilterBar
        floorFilter={floorFilter}
        onFloorFilterChange={setFloorFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllBuilding}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllBuilding()}
        Form={FormBuilding}
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
    </>
  )
}

export default ManagerBuilding
