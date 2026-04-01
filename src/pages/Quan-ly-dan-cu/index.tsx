import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography, Tag } from 'antd';
import { useEffect, useState } from 'react';
import FormResident from './components/Form';

const { Title } = Typography

const ManagerResident = () => {
  const { refreshKey, infoAllResident, loadingInfoAllResident, handleGetInfoAllResident, handleDeleteResident } = useModel("resident.resident");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MResident.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

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
      dataIndex: "apartment_id",
      width: 120,
      filterType: "string",
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
      width: 100,
      fixed: 'right',
      render: (record: MResident.IRecord) => (
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

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý dân cư</Title>
      <TableStaticData
        columns={columns}
        data={infoAllResident || []}
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
    </>
  )
}

export default ManagerResident
