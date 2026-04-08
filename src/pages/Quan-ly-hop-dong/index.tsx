import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { EditOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, Typography, Tag, Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import FormContract from './components/Form';
import DetailContract from './components/Detail';
import moment from "moment";

const { Title } = Typography

const ManagerContract = () => {
  const {
    refreshKey,
    infoAllContract,
    loadingInfoAllContract,
    handleGetInfoAllContract,
    handleTerminateContract
  } = useModel("contract.contract");

  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [record, setRecord] = useState<MContract.IRecord | {}>({});
  const [edit, setEdit] = useState(false);

  const columns: IColumn<MContract.IRecord>[] = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contract_code",
      width: 150,
      filterType: "string",
      sortable: true,
      fixed: 'left',
    },
    {
      title: "Căn hộ",
      dataIndex: ["apartment", "apartment_code"],
      width: 120,
      filterType: "string",
    },
    {
      title: "Cư dân",
      dataIndex: "resident",
      width: 180,
      filterType: "string",
      render: (_, record) => (
        <div>{record?.resident_user?.name}</div>
      )
    },
    {
      title: "Loại",
      dataIndex: "contract_type",
      width: 100,
      render: (val) => val === 'purchase' ? <Tag color="blue">Mua bán</Tag> : <Tag color="cyan">Cho thuê</Tag>
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      width: 120,
      render: (val) => val ? moment(val).format('DD/MM/YYYY') : '-'
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      width: 120,
      render: (val) => val ? moment(val).format('DD/MM/YYYY') : '-'
    },
    {
      title: "Giá (VND)",
      dataIndex: "monthly_price",
      width: 130,
      render: (val) => val ? new Intl.NumberFormat('vi-VN').format(val) : '-'
    },
    {
      title: "Tiền cọc (VND)",
      dataIndex: "deposit",
      width: 130,
      render: (val) => val ? new Intl.NumberFormat('vi-VN').format(val) : '-'
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      render: (status) => {
        const statuses: any = {
          'active': <Tag color="green">Đang hiệu lực</Tag>,
          'expired': <Tag color="orange">Đã hết hạn</Tag>,
          'terminated': <Tag color="red">Đã chấm dứt</Tag>,
        };
        return statuses[status] || status;
      }
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 160,
      fixed: 'right',
      render: (record: MContract.IRecord) => (
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
              disabled={record.status === 'terminated'}
            />
          </Tooltip>
          {record.status === 'active' && (
            <Tooltip title="Chấm dứt">
              <Popconfirm
                onConfirm={async () => {
                  const res = await handleTerminateContract(record._id as string);
                  if (res) {
                    message.success('Đã chấm dứt hợp đồng và cập nhật trạng thái cư trú');
                    handleGetInfoAllContract();
                  }
                }}
                title="Xác nhận chấm dứt hợp đồng này? Hành động này sẽ thay đổi trạng thái căn hộ và cư dân."
                placement="topLeft"
              >
                <Button danger type="link" icon={<StopOutlined />} />
              </Popconfirm>
            </Tooltip>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    handleGetInfoAllContract()
  }, [refreshKey])

  return (
    <>
      <Title level={2} style={{ marginTop: 10, marginBottom: 40 }}>Quản lý hợp đồng</Title>
      <TableStaticData
        columns={columns}
        data={infoAllContract || []}
        loading={loadingInfoAllContract}
        showEdit={showEdit}
        hasCreate={true}
        onReload={() => handleGetInfoAllContract()}
        Form={FormContract}
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
        title="Chi tiết hợp đồng"
        open={showDetail}
        onCancel={() => {
          setShowDetail(false);
          setRecord({});
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <DetailContract record={record as MContract.IRecord} />
      </Modal>
    </>
  )
}

export default ManagerContract
