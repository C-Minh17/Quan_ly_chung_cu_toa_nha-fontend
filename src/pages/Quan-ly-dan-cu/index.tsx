import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, EyeOutlined, TeamOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Tooltip, Typography, Tag, Modal } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import FormResident from './components/Form';
import FilterBar from './components/FilterBar';
import DetailResident from './components/Detail';

const { Title } = Typography

const ManagerResident = () => {
  const { refreshKey, infoAllResident, loadingInfoAllResident, handleGetInfoAllResident, handleDeleteResident } = useModel("resident.resident");
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [record, setRecord] = useState<MResident.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [residentTypeFilter, setResidentTypeFilter] = useState("all");
  const [primaryFilter, setPrimaryFilter] = useState("all");

  const columns: IColumn<MResident.IRecord>[] = [
    {
      title: "Họ tên",
      dataIndex: ["user", "name"],
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Số CCCD",
      dataIndex: "id_card_number",
      width: 150,
      filterType: "string",
    },
    {
      title: "Căn hộ",
      dataIndex: "apartment",
      width: 120,
      filterType: "string",
      render: (_, record) => (
        <div>{record?.apartment?.apartment_code}</div>
      )
    },
    {
      title: "Loại cư dân",
      dataIndex: "resident_type",
      width: 150,
      render: (val) => {
        const types: any = {
          'OWNER': <Tag color="gold">Chủ hộ</Tag>,
          'FAMILY_MEMBER': <Tag color="blue">Thành viên</Tag>,
          'TENANT': <Tag color="green">Khách thuê</Tag>,
        }
        return types[val] || val
      }
    },
    {
      title: "Ngày chuyển đến",
      dataIndex: "move_in_date",
      width: 150,
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '-'
    },
    {
      title: "Cư dân chính",
      dataIndex: "is_primary",
      width: 120,
      render: (val) => val ? <Tag color="cyan">Chính</Tag> : <Tag>Phụ</Tag>
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 140,
      fixed: 'right',
      render: (record: MResident.IRecord) => (
        <>
          <Tooltip title="Chi tiết">
            <Button
              onClick={() => {
                setRecord(record);
                setShowDetail(true);
              }}
              type="link"
              icon={<EyeOutlined />}
            />
          </Tooltip>
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
                handleDeleteResident(record._id as string).then(() => {
                  handleGetInfoAllResident();
                });
              }}
              title="Bạn có chắc chắn muốn xóa cư dân này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ]

  useEffect(() => {
    handleGetInfoAllResident()
  }, [refreshKey])

  const filteredData = useMemo(() => {
    let data = infoAllResident || [];

    // Filter by resident type
    if (residentTypeFilter !== "all") {
      data = data.filter(item => item.resident_type === residentTypeFilter);
    }

    // Filter by primary status
    if (primaryFilter !== "all") {
      const isPrimaryVal = primaryFilter === "primary";
      data = data.filter(item => !!item.is_primary === isPrimaryVal);
    }

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(item =>
        [item.user?.name, item.id_card_number, item.apartment?.apartment_code]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllResident, searchKeyword, residentTypeFilter, primaryFilter]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TeamOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý dân cư</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý thông tin cư trú và cư dân trong tòa nhà
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo họ tên, số CCCD, căn hộ..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      <FilterBar
        residentTypeFilter={residentTypeFilter}
        primaryFilter={primaryFilter}
        onResidentTypeFilterChange={setResidentTypeFilter}
        onPrimaryFilterChange={setPrimaryFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllResident}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllResident()}
        Form={FormResident}
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
        widthDrawer={800}
        addStt
      />

      <Modal
        title="Chi tiết cư dân"
        open={showDetail}
        onCancel={() => {
          setShowDetail(false);
          setRecord({});
        }}
        footer={null}
        width={800}
      >
        <DetailResident record={record as MResident.IRecord} />
      </Modal>
    </>
  )
}

export default ManagerResident
