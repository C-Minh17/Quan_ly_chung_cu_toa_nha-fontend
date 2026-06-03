import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { EditOutlined, EyeOutlined, StopOutlined, FileTextOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Tooltip, Typography, Tag, Modal, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import FormContract from './components/Form';
import FilterBar from './components/FilterBar';
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [contractTypeFilter, setContractTypeFilter] = useState("all");

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

  const filteredData = useMemo(() => {
    let data = infoAllContract || [];

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter(item => item.status === statusFilter);
    }

    // Filter by contract type
    if (contractTypeFilter !== "all") {
      data = data.filter(item => item.contract_type === contractTypeFilter);
    }

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(item =>
        [item.contract_code, item.apartment?.apartment_code, item.resident_user?.name]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllContract, searchKeyword, statusFilter, contractTypeFilter]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý hợp đồng</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý hợp đồng thuê/mua bán căn hộ và trạng thái hiệu lực
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />
      
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo mã hợp đồng, căn hộ, cư dân..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      <FilterBar
        statusFilter={statusFilter}
        contractTypeFilter={contractTypeFilter}
        onStatusFilterChange={setStatusFilter}
        onContractTypeFilterChange={setContractTypeFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
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
