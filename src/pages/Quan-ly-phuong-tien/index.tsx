import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import FormVehicle from "./components/form";

const { Title } = Typography

const ManagerVehicle = () => {
  const {
    refreshKey,
    infoAllVehicle,
    loadingInfoAllVehicle,
    handleGetInfoAllVehicle,
    handleDeleteVehicle
  } = useModel("vehicle.vehicle");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MVehicle.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const columns: IColumn<MVehicle.IRecord>[] = [
    {
      title: "Biển số xe",
      dataIndex: "license_plate",
      width: 150,
      filterType: "string",
      sortable: true,
      fixed: 'left',
    },
    {
      title: "Loại xe",
      dataIndex: "vehicle_type",
      width: 120,
      render: (val) => {
        const types: any = {
          'motorbike': <Tag color="orange">Xe máy</Tag>,
          'car': <Tag color="blue">Ô tô</Tag>,
          'bicycle': <Tag color="green">Xe đạp</Tag>,
        }
        return types[val] || val
      }
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      width: 150,
      filterType: "string",
    },
    {
      title: "Màu sắc",
      dataIndex: "color",
      width: 120,
      filterType: "string",
    },
    {
      title: "Mã thẻ",
      dataIndex: "card_number",
      width: 150,
      filterType: "string",
    },
    {
      title: "Chủ sở hữu",
      dataIndex: "resident",
      width: 180,
      filterType: "string",
      render: (_, record) => (
        <div>{record?.resident?.user?.name || '-'}</div>
      )
    },
    {
      title: "Căn hộ",
      dataIndex: "resident",
      width: 120,
      render: (_, record) => (
        <div>{record?.resident?.apartment?.apartment_code || '-'}</div>
      )
    },
    {
      title: "Thao tác",
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (record: MVehicle.IRecord) => (
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
              onConfirm={async () => {
                const res = await handleDeleteVehicle(record._id as string);
                if (res) {
                  message.success('Xóa phương tiện thành công');
                  handleGetInfoAllVehicle();
                }
              }}
              title="Bạn có chắc chắn muốn xóa phương tiện này?"
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
    handleGetInfoAllVehicle()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý phương tiện</Title>
      <TableStaticData
        columns={columns}
        data={infoAllVehicle || []}
        loading={loadingInfoAllVehicle}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllVehicle()}
        Form={FormVehicle}
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
    </>
  )
}

export default ManagerVehicle
