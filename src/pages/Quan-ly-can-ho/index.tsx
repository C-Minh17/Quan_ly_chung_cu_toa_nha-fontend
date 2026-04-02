import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography, Tag } from 'antd';
import { useEffect, useState } from 'react';
import FormApartment from './components/Form';

const { Title } = Typography

const ManagerApartment = () => {
  const { refreshKey, infoAllApartment, loadingInfoAllApartment, handleGetInfoAllApartment, handleDeleteApartment } = useModel("apartment.apartment");
  const { infoAllFloor, handleGetInfoAllFloor } = useModel("floor.floor");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MApartment.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const columns: IColumn<MApartment.IRecord>[] = [
    {
      title: "Mã căn hộ",
      align: "center",
      dataIndex: "apartment_code",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Loại căn hộ",
      align: "center",
      dataIndex: "apartment_type",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tòa nhà",
      align: "center",
      width: 150,
      render: (val: any, record: any) => {
        const floor_id = record?.floor_id?._id || record?.floor_id;
        const floor = infoAllFloor?.find((f) => f._id === floor_id) as any;
        const buildingName = floor?.building_id?.name || floor?.building?.name;
        return buildingName || 'N/A';
      }
    },
    {
      title: "Tầng",
      align: "center",
      dataIndex: "floor_id",
      width: 150,
      filterType: "string",
      sortable: true,
      render: (val, record: any) => {
        const floorVal = record?.floor_id?.floor_number ?? record?.floor_id?.name;
        return floorVal ? `Tầng ${floorVal}` : '';
      }
    },
    {
      title: "Diện tích",
      align: "center",
      dataIndex: "area",
      width: 100,
      filterType: "number",
      sortable: true,
      render: (val) => `${val} m2`
    },
    {
      title: "Giá",
      align: "center",
      dataIndex: "price",
      width: 150,
      filterType: "number",
      sortable: true,
      render: (val) => val?.toLocaleString('vi-VN') + ' VNĐ'
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "status",
      width: 150,
      filterType: "string",
      render: (text) => {
        let color = 'green';
        if (text === 'Đã thuê' || text === 'Đã bán') color = 'volcano';
        else if (text === 'Đang bảo trì') color = 'gold';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 140,
      fixed: 'right',
      render: (record: MApartment.IRecord) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button
              onClick={() => {
                setRecord({
                  ...record,
                  floor_id: record?.floor?._id || record.floor_id
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
                handleDeleteApartment(record._id as string).then(() => {
                  handleGetInfoAllApartment();
                });
              }}
              title="Bạn có chắc chắn muốn xóa căn hộ này?"
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
    handleGetInfoAllApartment()
    handleGetInfoAllFloor()
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
    </>
  )
}

export default ManagerApartment
