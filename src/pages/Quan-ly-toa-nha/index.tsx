import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FormBuilding from './components/Form';

const { Title } = Typography

const ManagerBuilding = () => {
  const { refreshKey, infoAllBuilding, loadingInfoAllBuilding, handleGetInfoAllBuilding, handleDeleteBuilding } = useModel("building.building");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MBuilding.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

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

  useEffect(() => {
    handleGetInfoAllBuilding()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý tòa nhà</Title>
      <TableStaticData
        columns={columns}
        data={infoAllBuilding || []}
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
