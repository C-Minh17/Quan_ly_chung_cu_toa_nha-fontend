import { useModel } from '@umijs/max';
import { Button, Col, Divider, Form, InputNumber, message, Row, Select, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ReloadOutlined,
  SaveOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface RowEntry {
  apartment_id: string;
  apartment_code: string;
  floor_name?: string;
  current_reading: number | null;
  previous_reading: number | null;
  saved: boolean;
  loading: boolean;
}

const GhiChiSo = () => {
  const { infoAllApartment, handleGetInfoAllApartment } = useModel('apartment.apartment');
  const { infoAllFeeType, handleGetInfoAllFeeType } = useModel('feeType.feeType');
  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel('building.building');
  const { handleCreateUtilityReading, handleGetInfoAllUtilityReading, infoAllUtilityReading } =
    useModel('utilityReading.utilityReading');
  const { initialState } = useModel('@@initialState');

  const [form] = Form.useForm();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [buildingId, setBuildingId] = useState<string>('all');
  const [feeTypeId, setFeeTypeId] = useState<string>('');
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);
  const [rows, setRows] = useState<RowEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    handleGetInfoAllApartment?.();
    handleGetInfoAllFeeType?.();
    handleGetInfoAllBuilding?.();
  }, []);

  useEffect(() => {
    handleGetInfoAllUtilityReading?.();
  }, [month, year, feeTypeId]);

  const filteredApartments = useMemo(() => {
    if (!infoAllApartment) return [];
    if (buildingId === 'all') return infoAllApartment;
    return infoAllApartment.filter((apt: any) => {
      const bId =
        apt?.floor_id?.building_id?._id ||
        apt?.floor_id?.building_id ||
        apt?.floor?.building?._id ||
        apt?.building_id;
      return bId === buildingId;
    });
  }, [infoAllApartment, buildingId]);

  const meteredFeeTypes = useMemo<any[]>(() => {
    return infoAllFeeType?.filter((f: any) => f.fee_category === 'metered') || [];
  }, [infoAllFeeType]);
  useEffect(() => {
    if (meteredFeeTypes.length > 0 && !feeTypeId) {
      setFeeTypeId(meteredFeeTypes[0]._id);
    }
  }, [meteredFeeTypes]);

  useEffect(() => {
    if (!filteredApartments.length || !feeTypeId) {
      setRows([]);
      return;
    }

    const newRows: RowEntry[] = filteredApartments.map((apt: any) => {
      const existing = infoAllUtilityReading?.find((r: any) => {
        const aptId = r?.apartment?._id || r?.apartment_id;
        const ftId = r?.fee_type?._id || r?.fee_type_id;
        return (
          aptId === apt._id &&
          ftId === feeTypeId &&
          r.reading_month === month &&
          r.reading_year === year
        );
      });

      return {
        apartment_id: apt._id,
        apartment_code: apt.apartment_code,
        floor_name: apt?.floor_id?.name || apt?.floor?.name || '',
        current_reading: existing?.current_reading ?? null,
        previous_reading: existing?.previous_reading ?? null,
        saved: !!existing,
        loading: false,
      };
    });

    setRows(newRows);

    const formValues: Record<string, any> = {};
    newRows.forEach((row) => {
      formValues[`current_${row.apartment_id}`] = row.current_reading;
    });
    form.setFieldsValue(formValues);
  }, [filteredApartments, feeTypeId, month, year, infoAllUtilityReading]);

  const updateRow = (apartment_id: string, patch: Partial<RowEntry>) => {
    setRows((prev) =>
      prev.map((r) => (r.apartment_id === apartment_id ? { ...r, ...patch } : r))
    );
  };

  const handleSaveRow = async (apartment_id: string) => {
    try {
      await form.validateFields([`current_${apartment_id}`]);
    } catch {
      return;
    }

    const currentVal = form.getFieldValue(`current_${apartment_id}`);
    if (currentVal === null || currentVal === undefined) {
      message.warning('Vui lòng nhập chỉ số hiện tại');
      return;
    }

    updateRow(apartment_id, { loading: true });

    try {
      const payload = {
        apartment_id,
        fee_type_id: feeTypeId,
        reading_month: month,
        reading_year: year,
        current_reading: currentVal,
        recorded_by: initialState?.currentUser?.ssoId,
        previous_reading: null,
      };

      const res = await handleCreateUtilityReading(payload);
      if (res) {
        message.success('Lưu chỉ số thành công!');
        updateRow(apartment_id, { current_reading: currentVal, saved: true, loading: false });
      } else {
        updateRow(apartment_id, { loading: false });
      }
    } catch {
      updateRow(apartment_id, { loading: false });
      message.error('Lưu chỉ số thất bại!');
    }
  };

  const handleSaveAll = async () => {
    const unSaved = rows.filter((r) => !r.saved);
    if (unSaved.length === 0) {
      message.info('Tất cả chỉ số đã được lưu');
      return;
    }

    setSubmitting(true);
    let successCount = 0;

    for (const row of unSaved) {
      const currentVal = form.getFieldValue(`current_${row.apartment_id}`);
      if (currentVal === null || currentVal === undefined) continue;

      updateRow(row.apartment_id, { loading: true });
      try {
        const payload = {
          apartment_id: row.apartment_id,
          fee_type_id: feeTypeId,
          reading_month: month,
          reading_year: year,
          current_reading: currentVal,
          recorded_by: initialState?.currentUser?.ssoId,
          previous_reading: null,
        };
        const res = await handleCreateUtilityReading(payload);
        if (res) {
          successCount++;
          updateRow(row.apartment_id, { current_reading: currentVal, saved: true, loading: false });
        } else {
          updateRow(row.apartment_id, { loading: false });
        }
      } catch {
        updateRow(row.apartment_id, { loading: false });
      }
    }

    setSubmitting(false);
    if (successCount > 0) {
      message.success(`Đã lưu ${successCount} chỉ số thành công!`);
    }
  };

  const savedCount = rows.filter((r) => r.saved).length;
  const totalCount = rows.length;

  const columns = [
    {
      title: 'STT',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Căn hộ',
      dataIndex: 'apartment_code',
      width: 130,
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: 'Tầng',
      dataIndex: 'floor_name',
      width: 100,
      align: 'center' as const,
      render: (val: string) => val || <Text type="secondary">-</Text>,
    },
    {
      title: 'Chỉ số tháng trước',
      dataIndex: 'previous_reading',
      width: 160,
      align: 'right' as const,
      render: (val: number | null) =>
        val !== null && val !== undefined ? (
          <Text style={{ color: '#595959' }}>{val.toLocaleString()}</Text>
        ) : (
          <Text type="secondary">Chưa có</Text>
        ),
    },
    {
      title: (
        <span>
          Chỉ số hiện tại <span style={{ color: '#ff4d4f' }}>*</span>
        </span>
      ),
      width: 180,
      render: (_: any, row: RowEntry) => (
        <Form.Item
          name={`current_${row.apartment_id}`}
          style={{ margin: 0 }}
          rules={[
            {
              validator: (_, value) => {
                if (value !== null && value !== undefined) {
                  if (
                    row.previous_reading !== null &&
                    row.previous_reading !== undefined &&
                    value < row.previous_reading
                  ) {
                    return Promise.reject('Chỉ số mới phải ≥ chỉ số cũ');
                  }
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            disabled={row.saved}
            style={{ width: '100%' }}
            placeholder="Nhập chỉ số..."
            min={0}
            precision={0}
          />
        </Form.Item>
      ),
    },
    {
      title: 'Tiêu thụ',
      width: 100,
      align: 'right' as const,
      render: (_: any, row: RowEntry) => {
        if (
          row.saved &&
          row.current_reading !== null &&
          row.previous_reading !== null &&
          row.previous_reading !== undefined
        ) {
          const diff = (row.current_reading ?? 0) - (row.previous_reading ?? 0);
          return <Text style={{ color: '#389e0d', fontWeight: 600 }}>{diff.toLocaleString()}</Text>;
        }
        return <Text type="secondary">-</Text>;
      },
    },
    {
      title: 'Trạng thái',
      width: 120,
      align: 'center' as const,
      render: (_: any, row: RowEntry) =>
        row.saved ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Đã lưu
          </Tag>
        ) : (
          <Tag color="default">Chưa ghi</Tag>
        ),
    },
    {
      title: 'Thao tác',
      width: 100,
      align: 'center' as const,
      fixed: 'right' as const,
      render: (_: any, row: RowEntry) => (
        <Tooltip title={row.saved ? 'Đã lưu' : 'Lưu chỉ số'}>
          <Button
            type="primary"
            size="small"
            icon={row.loading ? <Spin size="small" /> : <SaveOutlined />}
            disabled={row.saved || row.loading}
            onClick={() => handleSaveRow(row.apartment_id)}
            style={{
              backgroundColor: row.saved ? '#b7eb8f' : undefined,
              borderColor: row.saved ? '#52c41a' : undefined,
            }}
          >
            {row.saved ? 'Đã lưu' : 'Lưu'}
          </Button>
        </Tooltip>
      ),
    },
  ];

  const selectedFeeType = meteredFeeTypes.find((f: any) => f._id === feeTypeId);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#e6f7eb',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ThunderboltOutlined style={{ fontSize: 20, color: '#237804' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Ghi chỉ số điện / nước
          </Title>
          <Text type="secondary" style={{ fontSize: 14 }}>
            Nhập chỉ số cho từng căn hộ theo kỳ ghi
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '0 0 20px' }} />

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>Tòa nhà</div>
          <Select
            style={{ width: '100%' }}
            value={buildingId}
            onChange={(val) => setBuildingId(val)}
          >
            <Option value="all">Tất cả tòa nhà</Option>
            {infoAllBuilding?.map((b: any) => (
              <Option key={b._id} value={b._id}>
                {b.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>
            Loại chỉ số <span style={{ color: '#ff4d4f' }}>*</span>
          </div>
          <Select
            style={{ width: '100%' }}
            value={feeTypeId}
            onChange={(val) => setFeeTypeId(val)}
            placeholder="Chọn loại chỉ số..."
          >
            {meteredFeeTypes.map((f: any) => (
              <Option key={f._id} value={f._id}>
                {f.name}
              </Option>
            ))}
          </Select>
        </Col>

        {/* <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>Tháng ghi</div>
          <Select style={{ width: '100%' }} value={month} onChange={(val) => setMonth(val)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <Option key={m} value={m}>
                Tháng {m}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div style={{ marginBottom: 6, fontWeight: 500 }}>Năm</div>
          <Select style={{ width: '100%' }} value={year} onChange={(val) => setYear(val)}>
            {[2024, 2025, 2026, 2027, 2028].map((y) => (
              <Option key={y} value={y}>
                {y}
              </Option>
            ))}
          </Select>
        </Col> */}
      </Row>

      {feeTypeId && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: 8,
            padding: '10px 16px',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Text>
              <strong>Loại:</strong>{' '}
              <Tag color="green">{selectedFeeType?.name || '--'}</Tag>
            </Text>
            <Text>
              <strong>Kỳ ghi:</strong> Tháng {month}/{year}
            </Text>
            <Text>
              <strong>Tiến độ:</strong>{' '}
              <Tag color={savedCount === totalCount && totalCount > 0 ? 'success' : 'processing'}>
                {savedCount}/{totalCount} căn hộ
              </Tag>
            </Text>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Tải lại dữ liệu">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => handleGetInfoAllUtilityReading?.()}
              >
                Tải lại
              </Button>
            </Tooltip>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={submitting}
              onClick={handleSaveAll}
              disabled={rows.every((r) => r.saved)}
              style={{ backgroundColor: '#237804', borderColor: '#237804' }}
            >
              Lưu tất cả
            </Button>
          </div>
        </div>
      )}

      <Form form={form}>
        <Table
          rowKey="apartment_id"
          dataSource={rows}
          columns={columns}
          scroll={{ x: 900 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} căn hộ`,
          }}
          locale={{
            emptyText: !feeTypeId
              ? 'Vui lòng chọn loại chỉ số để tiến hành ghi'
              : 'Không có căn hộ nào',
          }}
          rowClassName={(row: RowEntry) => (row.saved ? 'row-saved' : '')}
          style={{ borderRadius: 8, overflow: 'hidden' }}
        />
      </Form>

      <style>{`
        .row-saved td {
          background-color: #f6ffed !important;
        }
        .ant-table-wrapper .ant-table {
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default GhiChiSo;
