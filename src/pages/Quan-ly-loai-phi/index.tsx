import TableStaticData from "@/components/Table/TableStaticData"
import { IColumn } from "@/components/Table/typing"
import { useModel } from "@umijs/max"
import { DeleteOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, FilterOutlined } from '@ant-design/icons';
import { Button, Divider, Input, Popconfirm, Tooltip, Typography, Tag, message, Badge } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FormFeeType from './components/form';
import FilterBar from './components/FilterBar';

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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

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

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-quan-ly-loai-phi');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-quan-ly-loai-phi';
          placeholder.style.display = 'inline-flex';
          placeholder.style.marginRight = '8px';
          reloadBtn.parentNode?.insertBefore(placeholder, reloadBtn);
        }
        setPortalContainer(placeholder);
      }
    };

    findAndInsert();
    const timer = setTimeout(findAndInsert, 500);
    return () => clearTimeout(timer);
  }, [infoAllFeeType, loadingInfoAllFeeType]);

  const filteredData = useMemo(() => {
    let data = infoAllFeeType || [];

    // Filter by active status
    if (statusFilter !== "all") {
      const isActiveVal = statusFilter === "active";
      data = data.filter(item => item.is_active === isActiveVal);
    }

    // Search filter
    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(item =>
        [item.name, item.fee_category]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllFeeType, searchKeyword, statusFilter]);

  const isFilterActive = statusFilter !== "all";

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DollarOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý loại phí</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý danh mục loại phí và đơn giá dịch vụ của tòa nhà
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo tên loại phí, danh mục..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={setSearchKeyword}
          style={{ width: 400, maxWidth: '100%' }}
        />
      </div>

      {portalContainer && createPortal(
        <Tooltip title="Bộ lọc tùy chỉnh">
          <Badge dot={isFilterActive} offset={[-2, 2]}>
            <Button
              icon={<FilterOutlined />}
              onClick={() => setFilterModalVisible(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
            >
              Bộ lọc
            </Button>
          </Badge>
        </Tooltip>,
        portalContainer
      )}

      <FilterBar
        visible={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        onApply={(values) => {
          setStatusFilter(values.statusFilter);
          setFilterModalVisible(false);
        }}
        statusFilter={statusFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
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
