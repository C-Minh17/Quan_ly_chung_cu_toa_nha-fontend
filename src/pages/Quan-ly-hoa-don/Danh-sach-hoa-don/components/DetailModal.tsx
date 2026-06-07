import { FileTextOutlined } from '@ant-design/icons';
import { Button, Descriptions, Divider, Modal, Table, Tag, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

const formatVND = (val: number) => `${(val || 0).toLocaleString('vi-VN')} đ`;
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};
const formatDateTime = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('vi-VN');
};

const statusConfig: Record<string, { color: string; text: string }> = {
  unpaid: { color: 'red', text: 'Chưa thanh toán' },
  partial: { color: 'orange', text: 'Thanh toán 1 phần' },
  paid: { color: 'green', text: 'Đã thanh toán' },
  overdue: { color: 'magenta', text: 'Quá hạn' },
};

interface DetailModalProps {
  visible: boolean;
  onClose: () => void;
  record: MInvoice.IRecord | null;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, onClose, record }) => {
  const columns = [
    {
      title: 'Loại phí',
      dataIndex: ['fee_type', 'name'],
      key: 'fee_type',
      render: (text: string, rec: any) => text || (typeof rec.fee_type_id === 'object' && rec.fee_type_id?.name) || '—',
    },
    {
      title: 'Danh mục',
      dataIndex: ['fee_type', 'fee_category'],
      key: 'category',
      render: (text: string, rec: any) => {
        const cat = text || (typeof rec.fee_type_id === 'object' && rec.fee_type_id?.fee_category);
        if (cat === 'metered') return <Tag color="blue">Theo định mức</Tag>;
        if (cat === 'fixed') return <Tag color="green">Cố định</Tag>;
        if (cat === 'parking') return <Tag color="orange">Gửi xe</Tag>;
        return <Tag>{cat || 'Khác'}</Tag>;
      },
    },
    {
      title: 'Chỉ số/SL',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
      render: (val: number) => val ? val.toLocaleString() : '—',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'unit_price',
      key: 'unit_price',
      align: 'right' as const,
      render: (val: number) => val ? formatVND(val) : '—',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (val: number) => <Text strong style={{ color: '#1677ff' }}>{formatVND(val)}</Text>,
    },
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#1890ff', fontSize: 20 }} />
          <span>Chi tiết hóa đơn {record?.invoice_code && `- ${record.invoice_code}`}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>
      ]}
      width={900}
      destroyOnClose
    >
      {record && (
        <div style={{ marginTop: 24 }}>
          <Descriptions title="Thông tin chung" bordered column={2} size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Mã hóa đơn">{record.invoice_code}</Descriptions.Item>
            <Descriptions.Item label="Kỳ thanh toán">Tháng {record.billing_month}/{record.billing_year}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {(() => {
                const cfg = statusConfig[record.status] ?? { color: 'default', text: record.status };
                return <Tag color={cfg.color}>{cfg.text}</Tag>;
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Hạn thanh toán">
              <Text strong style={{ color: record.status === 'overdue' ? 'red' : 'inherit' }}>
                {formatDate(record.due_date)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền"><Text strong style={{ color: '#1677ff' }}>{formatVND(record.total_amount)}</Text></Descriptions.Item>
            <Descriptions.Item label="Đã thanh toán"><Text strong style={{ color: '#52c41a' }}>{formatVND(record.paid_amount)}</Text></Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{formatDateTime(record.created_at || record.createdAt)}</Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">{formatDateTime(record.updated_at || record.updatedAt)}</Descriptions.Item>
          </Descriptions>

          {record.apartment && (
            <Descriptions title="Thông tin căn hộ" bordered column={2} size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Tòa nhà">{record.apartment.floor?.building?.name || '—'}</Descriptions.Item>
              <Descriptions.Item label="Tầng">{record.apartment.floor?.floor_number || '—'}</Descriptions.Item>
              <Descriptions.Item label="Mã căn hộ">{record.apartment.apartment_code || '—'}</Descriptions.Item>
              <Descriptions.Item label="Diện tích">{record.apartment.area ? `${record.apartment.area} m²` : '—'}</Descriptions.Item>
              <Descriptions.Item label="Số hợp đồng">{record.apartment.contract_number || '—'}</Descriptions.Item>
              <Descriptions.Item label="Giá bán"><Text strong>{formatVND(record.apartment.price || 0)}</Text></Descriptions.Item>
              <Descriptions.Item label="Giá thuê"><Text strong>{formatVND(record?.rental_amount || 0)}</Text></Descriptions.Item>
            </Descriptions>
          )}

          <Divider orientation="left" style={{ margin: '16px 0' }}>Chi tiết các khoản phí</Divider>

          {record.details && record.details.length > 0 && (
            <Table
              dataSource={record.details}
              columns={columns}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
            />
          )}

          <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
            <Descriptions.Item label="Phí cố định">{formatVND(record.fixed_amount || 0)}</Descriptions.Item>
            <Descriptions.Item label="Phí theo định mức">{formatVND(record.metered_amount || 0)}</Descriptions.Item>
            <Descriptions.Item label="Phí gửi xe">{formatVND(record.parking_amount || 0)}</Descriptions.Item>
            <Descriptions.Item label="Tổng cộng"><Text strong style={{ color: '#1677ff', fontSize: '1.1em' }}>{formatVND(record.total_amount || 0)}</Text></Descriptions.Item>
          </Descriptions>

        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
