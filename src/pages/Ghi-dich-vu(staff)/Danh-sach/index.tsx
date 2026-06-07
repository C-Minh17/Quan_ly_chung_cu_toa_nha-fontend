import TableStaticData from "@/components/Table/TableStaticData";
import { IColumn } from "@/components/Table/typing";
import { DeleteOutlined, EditOutlined, FilterOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAccess, useModel } from "@umijs/max";
import { Badge, Button, Divider, Input, Popconfirm, Tooltip, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FilterBar from './components/FilterBar';
import FormUtilityReading from './components/Form';

const { Title } = Typography

const DanhSach = () => {
  const {
    refreshKey,
    infoAllUtilityReading,
    loadingInfoAllUtilityReading,
    handleGetInfoAllUtilityReading,
    handleDeleteUtilityReading
  } = useModel("utilityReading.utilityReading");

  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel("building.building");
  const { infoAllFeeType, handleGetInfoAllFeeType } = useModel("feeType.feeType");

  const [buildingId, setBuildingId] = useState<string>("all");
  const [feeTypeId, setFeeTypeId] = useState<string>("all");
  const [month, setMonth] = useState<number | string>("all");
  const [year, setYear] = useState<number | string>("all");

  const [showEdit, setShowEdit] = useState(false);
  const [record, setRecord] = useState<MUtilityReading.IRecord | {}>({});
  const [edit, setEdit] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [portalContainer, setPortalContainer] = useState<Element | null>(null);

  const access = useAccess()

  useEffect(() => {
    handleGetInfoAllUtilityReading();
    if (handleGetInfoAllBuilding) handleGetInfoAllBuilding();
    if (handleGetInfoAllFeeType) handleGetInfoAllFeeType();
  }, [refreshKey]);

  useEffect(() => {
    const findAndInsert = () => {
      const reloadIcon = document.querySelector('.table-base .header .extra .anticon-reload');
      const reloadBtn = reloadIcon?.closest('button') || reloadIcon?.closest('.ant-btn');

      if (reloadBtn) {
        let placeholder = document.getElementById('filter-btn-placeholder-ghi-dich-vu');
        if (!placeholder) {
          placeholder = document.createElement('span');
          placeholder.id = 'filter-btn-placeholder-ghi-dich-vu';
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
  }, [infoAllUtilityReading, loadingInfoAllUtilityReading]);

  const columns: IColumn<MUtilityReading.IRecord>[] = [
    {
      title: "Căn hộ",
      align: "center",
      dataIndex: ["apartment", "apartment_code"],
      width: 150,
      render: (val, rec: any) => rec?.apartment?.apartment_code || 'N/A'
    },
    {
      title: "Kỳ ghi",
      align: "center",
      width: 100,
      render: (val, rec) => `${rec.reading_month || '--'}/${rec.reading_year || '--'}`
    },
    {
      title: "Loại chỉ số",
      align: "center",
      width: 150,
      render: (val, rec: any) => rec?.fee_type?.name || 'N/A'
    },
    {
      title: "Chỉ số đầu",
      align: "right",
      dataIndex: "previous_reading",
      width: 120,
    },
    {
      title: "Chỉ số cuối",
      align: "right",
      dataIndex: "current_reading",
      width: 120,
    },
    {
      title: "Tiêu thụ",
      align: "right",
      dataIndex: "consumption",
      width: 120,
    },
    {
      title: "Người ghi",
      align: "center",
      dataIndex: "recorder",
      width: 150,
      render: (val, rec: any) => rec?.recorder?.family_name + ' ' + rec?.recorder?.given_name || rec?.recorder_by || '--'
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 140,
      fixed: 'right',
      hidden: !access.canAccessManager,
      render: (record: MUtilityReading.IRecord) => (
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
                handleDeleteUtilityReading(record._id as string).then(() => {
                  handleGetInfoAllUtilityReading();
                });
              }}
              title="Bạn có chắc chắn muốn xóa bản ghi này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  const isFilterActive = useMemo(() => {
    return buildingId !== 'all' || feeTypeId !== 'all' || month !== 'all' || year !== 'all';
  }, [buildingId, feeTypeId, month, year]);

  const filteredData = useMemo(() => {
    let data = infoAllUtilityReading || [];

    if (buildingId !== 'all') {
      data = data.filter((item: any) => {
        const bId = item?.apartment?.floor_id?.building_id?._id || item?.apartment?.floor?.building?._id;
        return bId === buildingId;
      });
    }

    if (feeTypeId !== 'all') {
      data = data.filter((item: any) => {
        const typeId = item?.fee_type?._id || item?.fee_type_id;
        return typeId === feeTypeId;
      })
    }

    if (month !== 'all') {
      data = data.filter((item: any) => item.reading_month === Number(month));
    }

    if (year !== 'all') {
      data = data.filter((item: any) => item.reading_year === Number(year));
    }

    const keyword = searchKeyword.trim().toLowerCase();
    if (keyword) {
      data = data.filter((item: any) => {
        const recorderName = (item?.recorder?.family_name + ' ' + item?.recorder?.given_name) || item?.recorder_by || '';
        return [item?.apartment?.apartment_code, item?.fee_type?.name, recorderName]
          .filter(Boolean)
          .some((val: any) => val.toString().toLowerCase().includes(keyword));
      });
    }

    return data;
  }, [infoAllUtilityReading, buildingId, feeTypeId, month, year, searchKeyword]);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50,
          height: 50,
          backgroundColor: '#e6f7eb',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ThunderboltOutlined style={{ fontSize: 20, color: '#237804' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Danh sách chỉ số dịch vụ</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4, fontWeight: 500 }}>
            {buildingId !== 'all' ? infoAllBuilding?.find(b => b._id === buildingId)?.name || 'Tòa nhà' : 'Tất cả tòa nhà'}
          </div>
        </div>
      </div>

      <Divider style={{ margin: '10px 0px 20px' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 20 }}>
        <Input.Search
          allowClear
          placeholder="Tìm kiếm theo căn hộ, loại chỉ số, người ghi..."
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
              onClick={() => {
                setFilterModalVisible(true);
              }}
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
        onApply={(vals) => {
          setBuildingId(vals.buildingId);
          setFeeTypeId(vals.feeTypeId);
          setMonth(vals.month);
          setYear(vals.year);
          setFilterModalVisible(false);
        }}
        currentBuildingId={buildingId}
        currentFeeTypeId={feeTypeId}
        currentMonth={month}
        currentYear={year}
        buildings={infoAllBuilding || []}
        feeTypes={infoAllFeeType || []}
      />

      <TableStaticData
        columns={columns}
        data={filteredData}
        loading={loadingInfoAllUtilityReading}
        showEdit={showEdit}
        onReload={() => handleGetInfoAllUtilityReading()}
        Form={FormUtilityReading}
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

export default DanhSach
