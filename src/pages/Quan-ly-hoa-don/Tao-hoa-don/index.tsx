import { useModel } from "@umijs/max"
import {
  Typography, Button, Divider, Table, Tag, Modal, Form,
  DatePicker, Popconfirm, message, Tooltip, Space, Badge, Alert,
} from 'antd';
import {
  ThunderboltOutlined, PlusCircleOutlined, CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const TaoHoaDon = () => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const {
    loadingInfoInvoice,
    loadingInfoAllInvoice,
    infoAllInvoice,
    handleGetInfoAllInvoice,
    handleCreateInvoice,
    handleGenerateInvoices,
  } = useModel("invoice.invoice");

  const {
    infoAllUtilityReading,
    loadingInfoAllUtilityReading,
    handleGetInfoAllUtilityReading,
  } = useModel("utilityReading.utilityReading");

  const { infoAllApartment, handleGetInfoAllApartment } = useModel("apartment.apartment");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = () => {
    handleGetInfoAllUtilityReading({ reading_month: currentMonth, reading_year: currentYear });
    handleGetInfoAllInvoice({ billing_month: currentMonth, billing_year: currentYear });
    if (handleGetInfoAllApartment) handleGetInfoAllApartment();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const readingMap = useMemo(() => {
    const map: Record<string, { apartment_id: string; apartment_code: string; readings: any[] }> = {};
    (infoAllUtilityReading || []).forEach((r: any) => {
      const aptId = r.apartment?._id || r.apartment_id;
      const aptCode = r.apartment?.apartment_code || 'N/A';
      if (!map[aptId]) map[aptId] = { apartment_id: aptId, apartment_code: aptCode, readings: [] };
      map[aptId].readings.push(r);
    });
    return map;
  }, [infoAllUtilityReading]);

  const createdApartmentIds = useMemo(() => {
    return new Set(
      (infoAllInvoice || []).map((inv: any) => inv.apartment_id || inv.apartment?._id)
    );
  }, [infoAllInvoice]);

  const tableData = useMemo(() => {
    return (infoAllApartment || [])
      .filter((apt: any) => apt.status === 'occupied')
      .map((apt: any) => {
        const hasReading = !!readingMap[apt._id];
        const readings = readingMap[apt._id]?.readings || [];
        const hasInvoice = createdApartmentIds.has(apt._id);
        return {
          apartment_id: apt._id,
          apartment_code: apt.apartment_code,
          hasReading,
          readings,
          hasInvoice,
        };
      });
  }, [infoAllApartment, readingMap, createdApartmentIds]);

  const doneCount = tableData.filter(r => r.hasInvoice).length;
  const totalCount = tableData.length;
  const noReadingCount = tableData.filter(r => !r.hasReading).length;

  const openCreateModal = (record: any) => {
    setSelectedRecord(record);
    form.setFieldsValue({ due_date: dayjs().add(15, 'day') });
    setModalOpen(true);
  };

  const onSubmitCreate = async () => {
    if (!selectedRecord) return;

    const details = selectedRecord.readings.map((r: any) => ({
      fee_type_id: r.fee_type?._id || r.fee_type_id,
      quantity: r.consumption ?? 1,
    }));

    const payload = {
      apartment_id: selectedRecord.apartment_id,
      billing_month: currentMonth,
      billing_year: currentYear,
      details,
    };

    const res = await handleCreateInvoice(payload);
    if (res) {
      message.success(`Tạo hóa đơn cho căn hộ ${selectedRecord.apartment_code} thành công!`);
      setModalOpen(false);
      handleGetInfoAllInvoice({ billing_month: currentMonth, billing_year: currentYear });
    } else {
      message.error('Tạo hóa đơn thất bại, vui lòng thử lại!');
    }
  };

  const onGenerateBulk = async () => {
    const res = await handleGenerateInvoices({ billing_month: currentMonth, billing_year: currentYear });
    if (res !== undefined) {
      message.success(`Đã tạo hóa đơn hàng loạt cho tháng ${currentMonth}/${currentYear}!`);
      handleGetInfoAllInvoice({ billing_month: currentMonth, billing_year: currentYear });
    } else {
      message.error('Tạo hóa đơn hàng loạt thất bại!');
    }
  };

  const columns = [
    {
      title: 'STT',
      width: 60,
      align: 'center' as const,
      render: (_: any, __: any, idx: number) => idx + 1,
    },
    {
      title: 'Căn hộ',
      dataIndex: 'apartment_code',
      width: 120,
      align: 'center' as const,
      render: (val: string) => <Text strong>{val}</Text>,
    },
    {
      title: `Chỉ số đã ghi (T${currentMonth}/${currentYear})`,
      render: (_: any, rec: any) => {
        if (!rec.hasReading) {
          return (
            <Text type="secondary">
              <WarningOutlined style={{ color: '#faad14', marginRight: 6 }} />
              Chưa ghi chỉ số tháng này
            </Text>
          );
        }
        return (
          <Space wrap>
            {rec.readings.map((r: any) => (
              <Tag key={r._id} color="blue">
                {r.fee_type?.name || 'N/A'}: {r.consumption ?? '--'}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Hóa đơn',
      align: 'center' as const,
      width: 160,
      render: (_: any, rec: any) =>
        rec.hasInvoice
          ? <Badge status="success" text={<Text type="success">Đã có hóa đơn</Text>} />
          : <Badge status="warning" text={<Text type="warning">Chưa có hóa đơn</Text>} />,
    },
    {
      title: 'Thao tác',
      align: 'center' as const,
      width: 130,
      render: (_: any, rec: any) => {
        if (rec.hasInvoice) {
          return (
            <Button size="small" icon={<CheckCircleOutlined />} disabled>
              Đã tạo
            </Button>
          );
        }
        if (!rec.hasReading) {
          return (
            <Tooltip title="Chưa có chỉ số, không thể tạo hóa đơn tự động">
              <Button size="small" disabled>
                Chưa ghi chỉ số
              </Button>
            </Tooltip>
          );
        }
        return (
          <Button
            type="primary"
            size="small"
            icon={<PlusCircleOutlined />}
            onClick={() => openCreateModal(rec)}
          >
            Tạo
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#e6f4ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PlusCircleOutlined style={{ fontSize: 22, color: '#1677ff' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Tạo hóa đơn</Title>
          <Text type="secondary">
            Tháng {currentMonth}/{currentYear} — {doneCount}/{totalCount} căn hộ đã có hóa đơn
            {noReadingCount > 0 && (
              <Text type="warning"> · {noReadingCount} phòng chưa ghi chỉ số</Text>
            )}
          </Text>
        </div>
      </div>

      <Divider style={{ margin: '0 0 16px' }} />

      <div style={{ marginBottom: 16 }}>
        <Popconfirm
          title={`Tạo hóa đơn hàng loạt cho tháng ${currentMonth}/${currentYear}?`}
          description="Hệ thống sẽ tự động tạo hóa đơn cho tất cả căn hộ chưa có hóa đơn tháng này."
          okText="Xác nhận"
          cancelText="Huỷ"
          onConfirm={onGenerateBulk}
        >
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            loading={loadingInfoInvoice}
            size="large"
          >
            Tạo hàng loạt tháng {currentMonth}/{currentYear}
          </Button>
        </Popconfirm>
      </div>

      {noReadingCount > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`Có ${noReadingCount} căn hộ chưa ghi chỉ số tháng ${currentMonth}/${currentYear}. Các căn hộ này sẽ không có thông tin chỉ số trong hóa đơn.`}
          style={{ marginBottom: 16 }}
        />
      )}

      <Table
        rowKey="apartment_id"
        columns={columns}
        dataSource={tableData}
        loading={loadingInfoAllUtilityReading || loadingInfoAllInvoice}
        pagination={{ pageSize: 15, showSizeChanger: false }}
        bordered
        rowClassName={(rec) => {
          if (rec.hasInvoice) return 'row-done';
          if (!rec.hasReading) return 'row-no-reading';
          return '';
        }}
      />

      <Modal
        title={`Tạo hóa đơn — Căn hộ ${selectedRecord?.apartment_code}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        {selectedRecord && (
          <>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Kỳ thanh toán: </Text>
              <Text strong>Tháng {currentMonth}/{currentYear}</Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">Chỉ số sẽ được gán:</Text>
                <div style={{ marginTop: 6 }}>
                  {selectedRecord.readings.map((r: any) => (
                    <Tag key={r._id} color="blue" style={{ marginBottom: 4 }}>
                      {r.fee_type?.name || 'N/A'} — Tiêu thụ: {r.consumption ?? '--'}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <Divider />

            <Form form={form} layout="vertical" onFinish={onSubmitCreate}>
              <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                <Space>
                  <Button onClick={() => setModalOpen(false)}>Huỷ</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loadingInfoInvoice}
                    icon={<PlusCircleOutlined />}
                  >
                    Xác nhận tạo hóa đơn
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>

      <style>{`
        .row-done td { background-color: #f6ffed !important; }
        .row-no-reading td { background-color: #fffbe6 !important; }
      `}</style>
    </>
  );
};

export default TaoHoaDon;
