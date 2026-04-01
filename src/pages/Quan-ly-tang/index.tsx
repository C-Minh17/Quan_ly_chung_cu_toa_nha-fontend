import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FormFloor from './components/Form';

const { Title } = Typography

const ManagerFloor = () => {
  const { refreshKey, infoAllFloor, loadingInfoAllFloor, handleGetInfoAllFloor, handleDeleteFloor, handleGetFloorLayout } = useModel("floor.floor");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MFloor.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const columns: IColumn<MFloor.IRecord>[] = [
    {
      title: "Tên tầng",
      align: "center",
      dataIndex: "name",
      width: 200,
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
      dataIndex: ["building_id", "name"],
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
      width: 140,
      fixed: 'right',
      render: (record: MFloor.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord({
                  ...record,
                  building_id: record?.building?._id || record.building_id
                });
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
                handleDeleteFloor(record._id as string).then(() => {
                  handleGetInfoAllFloor();
                });
              }}
              title="Bạn có chắc chắn muốn xóa tầng này?"
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
    </>
  )
}

export default ManagerFloor
