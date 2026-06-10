import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { CarOutlined, DeleteOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons';
import { useModel } from "@umijs/max";
import { Badge, Button, Divider, Input, Popconfirm, Tag, Tooltip, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FilterBar from "./components/FilterBar";
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("all");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

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

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-quan-ly-phuong-tien');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-quan-ly-phuong-tien';
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
  }, [infoAllVehicle, loadingInfoAllVehicle]);

  const filteredData = useMemo(() => {
    let data = infoAllVehicle || [];

    if (vehicleTypeFilter !== "all") {
      data = data.filter(item => item.vehicle_type === vehicleTypeFilter);
    }

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter(item =>
        [item.license_plate, item.brand, item.card_number, item.resident?.user?.name, item.resident?.apartment?.apartment_code]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword))
      );
    }

    return data;
  }, [infoAllVehicle, searchKeyword, vehicleTypeFilter]);

  const isFilterActive = vehicleTypeFilter !== "all";

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CarOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Quản lý phương tiện</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Quản lý thông tin và thẻ xe của các phương tiện trong tòa nhà
          </div>
        </div>
      </div>

      <Divider style={{ margin: '5px 0 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo biển số xe, chủ sở hữu, căn hộ, số thẻ..."
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
          setVehicleTypeFilter(values.vehicleTypeFilter);
          setFilterModalVisible(false);
        }}
        vehicleTypeFilter={vehicleTypeFilter}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
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
        onClickAdd={() => {
          setRecord({});
          setEdit(false);
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
