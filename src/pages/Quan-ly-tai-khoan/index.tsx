import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useAccess, useModel } from "@umijs/max";
import { Button, Divider, Input, Popconfirm, Tooltip, Typography } from "antd";
import { useEffect, useMemo, useState } from "react";
import FormAccount from "./components/Form";

const { Title } = Typography;

const ManagerAccount = () => {
  const { refreshKey, infoAllUser, infoAllUserFilter, loadingInfoAllUser, handleGetInfoAllUser, handleDeleteUser } =
    useModel("user.user");
  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MUser.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const access = useAccess();

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
      title: "Thao tác",
      align: "center",
      width: 90,
      fixed: "right",
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
  ];

  useEffect(() => {
    handleGetInfoAllUser();
  }, [refreshKey]);

  const accountData = access.canAccessSuperAdmin ? infoAllUser || [] : infoAllUserFilter || [];

  const filteredData = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return accountData;

    return accountData.filter((item) =>
      [item.sub, item.preferred_username, item.name, item.email, item.phone, item.role]
        .filter(Boolean)
        .some((value) => value?.toString().toLowerCase().includes(keyword)),
    );
  }, [accountData, searchKeyword]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 16 }}>
        <div
          style={{
            width: 50,
            height: 50,
            backgroundColor: "#e6f4ff",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UserOutlined style={{ fontSize: 22, color: "#1677ff" }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Quản lý tài khoản
          </Title>
          <div style={{ color: "#8c8c8c", fontSize: 14, marginTop: 4 }}>
            Quản lý tài khoản người dùng trong hệ thống
          </div>
        </div>
      </div>

      <Divider style={{ margin: "5px 0 20px" }} />

      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 16 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo ID, tên đăng nhập, tên, email, SĐT, vai trò"
          value={searchKeyword}
          onChange={(event) => setSearchKeyword(event.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 420, maxWidth: "100%" }}
        />
      </div>

      <Divider style={{ margin: "0px 0 20px" }} />

      <TableStaticData
        columns={columns}
        data={filteredData}
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
  );
};

export default ManagerAccount;
