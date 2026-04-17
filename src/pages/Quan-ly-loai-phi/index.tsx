import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import FormFeeType from './components/form';

const { Title } = Typography

const ManagerFeeType = () => {
  const {
    refreshKey,
    infoAllFeeType,
    loadingInfoAllFeeType,
    handleGetInfoAllFeeType,
    handleDeleteFeeType,
    handleActiveFeeType
  } = useModel("feeType.feeType");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MFeeType.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const columns: IColumn<MFeeType.IRecord>[] = [
    {
      title: "Tên loại phí",
      align: "left",
      dataIndex: "name",
      width: 200,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Danh mục",
      align: "center",
      dataIndex: "fee_category",
      width: 150,
      filterType: "string",
      sortable: true,
    },
    {
      title: "Đơn giá",
      align: "right",
      dataIndex: "unit_price",
      width: 150,
      filterType: "number",
      sortable: true,
      render: (val) => val?.toLocaleString('vi-VN') + ' VNĐ'
    },
    {
      title: "Đơn vị",
      align: "center",
      dataIndex: "unit",
      width: 100,
    },
    {
      title: "Mô tả",
      align: "left",
      dataIndex: "description",
      width: 250,
      filterType: "string",
    },
    {
      title: "Trạng thái",
      align: "center",
      dataIndex: "is_active",
      width: 150,
      render: (is_active) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 130,
      fixed: 'right',
      render: (record: MFeeType.IRecord) => (
        <>
          <Tooltip title={record.is_active ? "Ngừng hoạt động" : "Kích hoạt"}>
            <Button
              onClick={() => {
                handleActiveFeeType(record._id as string).then(() => {
                  message.success(`${record.is_active ? 'Ngừng hoạt động' : 'Kích hoạt'} loại phí thành công`);
                  handleGetInfoAllFeeType();
                });
              }}
              type="link"
              icon={record.is_active ? <CloseCircleOutlined style={{ color: '#faad14' }} /> : <CheckCircleOutlined style={{ color: '#52c41a' }} />}
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
              icon={<EditOutlined rotate={0} />}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => {
                handleDeleteFeeType(record._id as string).then(() => {
                  message.success('Xóa loại phí thành công');
                  handleGetInfoAllFeeType();
                });
              }}
              title="Bạn có chắc chắn muốn xóa loại phí này?"
              okText="Xác nhận"
              cancelText="Hủy"
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
    handleGetInfoAllFeeType()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý loại phí</Title>
      <TableStaticData
        columns={columns}
        data={infoAllFeeType || []}
        loading={loadingInfoAllFeeType}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllFeeType()}
        Form={FormFeeType}
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

export default ManagerFeeType
