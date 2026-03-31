import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useAccess, useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import FormAccount from './components/Form';

const { Title } = Typography

const ManagerAccount = () => {
  const { refreshKey, infoAllUser, infoAllUserFilter, loadingInfoAllUser, handleGetInfoAllUser, handleDeleteUser } = useModel("user.user");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MUser.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const aceess = useAccess();

  const columns: IColumn<MUser.IRecord>[] = [
    {
      title: "ID",
      dataIndex: "sub",
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "preferred_username",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Tên",
      dataIndex: "name",
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: MUser.IRecord) => (
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
                handleDeleteUser(record._id as string).then(() => {
                  handleGetInfoAllUser();
                });
              }}
              title="Bạn có chắc chắn muốn xóa tài khoản này?"
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
    handleGetInfoAllUser()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý tài khoản</Title>
      <TableStaticData
        columns={columns}
        data={aceess.canAccessSuperAdmin ? infoAllUser || [] : infoAllUserFilter || []}
        loading={loadingInfoAllUser}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllUser()}
        Form={FormAccount}
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

export default ManagerAccount
