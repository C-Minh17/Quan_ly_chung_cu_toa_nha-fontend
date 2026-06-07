import { BankOutlined, CheckCircleFilled, ClockCircleOutlined, CloseCircleFilled, CreditCardOutlined, DollarOutlined, ExclamationCircleFilled, SearchOutlined, WalletOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Alert, Badge, Button, Card, Col, Descriptions, Divider, Form, Input, InputNumber, message, Modal, Row, Select, Space, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import { useState } from 'react';
import LookupForm from './components/LookupForm';

const { Title, Text } = Typography;
const { Option } = Select;

const formatVND = (val: number) =>
  `${(val || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

const statusConfig: Record<
  string,
  { color: string; icon: React.ReactNode; text: string }
> = {
  unpaid: { color: 'red', icon: <CloseCircleFilled />, text: 'Chưa thanh toán' },
  partial: { color: 'orange', icon: <ExclamationCircleFilled />, text: 'Thanh toán 1 phần' },
  paid: { color: 'green', icon: <CheckCircleFilled />, text: 'Đã thanh toán' },
  overdue: { color: 'magenta', icon: <ClockCircleOutlined />, text: 'Quá hạn' },
};

const methodLabel: Record<string, string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
  momo: 'Ví MoMo',
  vnpay: 'VNPay',
};

const methodIcon: Record<string, React.ReactNode> = {
  cash: <WalletOutlined />,
  bank_transfer: <BankOutlined />,
  momo: <CreditCardOutlined />,
  vnpay: <CreditCardOutlined />,
};

const ThanhToan = () => {
  const {
    invoiceLookup,
    loadingLookup,
    submittingPayment,
    setInvoiceLookup,
    handleLookupInvoice,
    handleCreatePayment,
  } = useModel('payment.payment');

  const [lookupForm] = Form.useForm();
  const [payForm] = Form.useForm();
  const [lookupModalOpen, setLookupModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<any>(null);

  const onLookup = async (payload: any) => {
    const result = await handleLookupInvoice(payload);
    if (!result) {
      message.error('Không tìm thấy hóa đơn. Vui lòng kiểm tra lại thông tin.');
    } else {
      setLookupModalOpen(false);
    }
  };

  const onPaySubmit = (values: any) => {
    if (!invoiceLookup) return;

    const amount = Number(values.amount);

    if (!amount || amount <= 0) {
      message.error('Số tiền phải lớn hơn 0');
      return;
    }
    if (amount > invoiceLookup.remaining) {
      message.error(`Số tiền không được vượt quá số tiền còn lại (${formatVND(invoiceLookup.remaining)})`);
      return;
    }
    if (values.payment_method !== 'cash' && !values.transaction_code) {
      message.error('Vui lòng nhập mã giao dịch');
      return;
    }

    setPendingValues(values);
    setConfirmOpen(true);
  };

  const onConfirmPayment = async () => {
    if (!invoiceLookup || !pendingValues) return;
    setConfirmOpen(false);

    const res = await handleCreatePayment({
      invoice_id: invoiceLookup._id,
      amount: Number(pendingValues.amount),
      payment_method: pendingValues.payment_method,
      transaction_code: pendingValues.transaction_code,
      note: pendingValues.note,
    });

    if (res) {
      message.success('Thanh toán thành công!');
      payForm.resetFields();
      setPendingValues(null);
    } else {
      message.error('Thanh toán thất bại. Vui lòng thử lại.');
    }
  };

  const onReset = () => {
    setInvoiceLookup(null);
    lookupForm.resetFields();
    payForm.resetFields();
    setPendingValues(null);
  };

  const isPaid = invoiceLookup?.status === 'paid';

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 16 }}>
        <div style={{
          width: 50, height: 50,
          backgroundColor: '#f0f5ff',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DollarOutlined style={{ fontSize: 22, color: '#2f54eb' }} />
        </div>
        <div>
          <Title level={3} style={{ margin: 0 }}>Thanh Toán Hóa Đơn</Title>
          <div style={{ color: '#8c8c8c', fontSize: 14, marginTop: 4 }}>
            Tra cứu và thực hiện thanh toán hóa đơn
          </div>
        </div>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          style={{ marginLeft: 'auto', borderRadius: 8 }}
          onClick={() => setLookupModalOpen(true)}
        >
          Tra cứu hóa đơn
        </Button>
      </div>

      <Divider style={{ margin: '0 0 24px' }} />

      {!invoiceLookup && (
        <Card
          style={{
            maxWidth: 600,
            margin: '40px auto',
            textAlign: 'center',
            borderRadius: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: 'none',
          }}
        >
          <div style={{ padding: '24px 0' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: '#f0f5ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <SearchOutlined style={{ fontSize: 36, color: '#2f54eb' }} />
            </div>
            <Title level={4}>Chưa Chọn Hóa Đơn</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              Vui lòng tra cứu hóa đơn theo mã hóa đơn hoặc căn hộ để xem chi tiết và thực hiện thanh toán.
            </Text>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={() => setLookupModalOpen(true)}
              style={{ borderRadius: 8 }}
            >
              Tra Cứu Hóa Đơn Ngay
            </Button>
          </div>
        </Card>
      )}

      {loadingLookup && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Spin size="large" />
        </div>
      )}

      {invoiceLookup && (
        <Row gutter={24}>
          <Col xs={24} lg={14}>
            {(() => {
              const cfg = statusConfig[invoiceLookup.status] ?? { color: 'blue', icon: null, text: invoiceLookup.status };
              return (
                <Alert
                  type={isPaid ? 'success' : invoiceLookup.status === 'overdue' ? 'error' : 'warning'}
                  showIcon
                  icon={cfg.icon}
                  message={
                    <span>
                      <strong>{invoiceLookup.invoice_code}</strong>
                      {' — '}
                      <Tag color={cfg.color}>{cfg.text}</Tag>
                    </span>
                  }
                  description={`Kỳ ${invoiceLookup.billing_month}/${invoiceLookup.billing_year} · Hạn thanh toán: ${formatDate(invoiceLookup.due_date)}`}
                  style={{ marginBottom: 16 }}
                />
              );
            })()}

            <Row gutter={12} style={{ marginBottom: 16 }}>
              {[
                { label: 'Tổng tiền', val: invoiceLookup.total_amount, color: '#1677ff' },
                { label: 'Đã thanh toán', val: invoiceLookup.paid_amount, color: '#52c41a' },
                { label: 'Còn lại', val: invoiceLookup.remaining, color: isPaid ? '#52c41a' : '#f5222d' },
              ].map(item => (
                <Col span={8} key={item.label}>
                  <Card size="small" style={{ textAlign: 'center', borderColor: item.color }}>
                    <div style={{ fontSize: 11, color: '#8c8c8c', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>
                      {formatVND(item.val)}
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card size="small" title="Chi Tiết Khoản Phí" style={{ marginBottom: 16 }}>
              <Table
                rowKey="_id"
                size="small"
                pagination={false}
                dataSource={invoiceLookup.details}
                columns={[
                  {
                    title: 'Loại phí',
                    render: (_, rec: MPayment.IInvoiceDetail) => {
                      const name = rec.fee_type?.name || (typeof rec.fee_type_id === 'object' && rec.fee_type_id?.name) || '—';
                      return name;
                    },
                  },
                  {
                    title: 'Chi tiết (SL × Đơn giá)',
                    render: (_, rec: MPayment.IInvoiceDetail) => {
                      if (rec.quantity && rec.unit_price) {
                        return <Text type="secondary">{`${rec.quantity} × ${formatVND(rec.unit_price)}`}</Text>;
                      }
                      return <Text type="secondary">{rec.fee_type?.description || (typeof rec.fee_type_id === 'object' && rec.fee_type_id?.description) || '—'}</Text>;
                    },
                  },
                  {
                    title: 'Số tiền',
                    align: 'right',
                    render: (_, rec: MPayment.IInvoiceDetail) => (
                      <Text strong>{formatVND(rec.amount)}</Text>
                    ),
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={2}>
                      <Text strong>Tổng cộng</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} align="right">
                      <Text strong style={{ color: '#1677ff' }}>
                        {formatVND(invoiceLookup.total_amount)}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </Card>

            {/* Payment history */}
            {invoiceLookup.payments.length > 0 && (
              <Card size="small" title="Lịch Sử Thanh Toán">
                <Table
                  rowKey="_id"
                  size="small"
                  pagination={false}
                  dataSource={invoiceLookup.payments}
                  columns={[
                    {
                      title: 'Ngày',
                      render: (_, rec: MPayment.IRecord) => formatDate(rec.paid_at),
                      width: 100,
                    },
                    {
                      title: 'Phương thức',
                      render: (_, rec: MPayment.IRecord) => (
                        <Space>
                          {methodIcon[rec.payment_method]}
                          {methodLabel[rec.payment_method] || rec.payment_method}
                        </Space>
                      ),
                    },
                    {
                      title: 'Số tiền',
                      align: 'right',
                      render: (_, rec: MPayment.IRecord) => (
                        <Text strong style={{ color: '#52c41a' }}>{formatVND(rec.amount)}</Text>
                      ),
                    },
                    {
                      title: 'Mã GD',
                      render: (_, rec: MPayment.IRecord) => (
                        <Tooltip title={rec.transaction_code}>
                          <Text code>{rec.transaction_code || '—'}</Text>
                        </Tooltip>
                      ),
                    },
                  ]}
                />
              </Card>
            )}
          </Col>

          {/* RIGHT: Payment form */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <Space>
                  <DollarOutlined />
                  <span>Thực Hiện Thanh Toán</span>
                </Space>
              }
              style={{
                position: 'sticky',
                top: 24,
                opacity: isPaid ? 0.6 : 1,
                pointerEvents: isPaid ? 'none' : 'auto',
              }}
            >
              {isPaid ? (
                <Alert
                  type="success"
                  showIcon
                  icon={<CheckCircleFilled />}
                  message="Hóa đơn đã được thanh toán đầy đủ"
                />
              ) : (
                <Form
                  form={payForm}
                  layout="vertical"
                  onFinish={onPaySubmit}
                  initialValues={{ payment_method: 'cash' }}
                >
                  <Form.Item
                    name="amount"
                    label={
                      <span>
                        Số tiền thanh toán
                        <Text type="secondary" style={{ marginLeft: 8, fontWeight: 400 }}>
                          (còn lại: <strong style={{ color: '#f5222d' }}>{formatVND(invoiceLookup.remaining)}</strong>)
                        </Text>
                      </span>
                    }
                    rules={[{ required: true, message: 'Nhập số tiền' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      max={invoiceLookup.remaining}
                      step={10000}
                      formatter={val => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(val: any) => val?.replace(/,/g, '') ?? ''}
                      addonAfter="đ"
                      placeholder="0"
                    />
                  </Form.Item>

                  {/* Quick fill buttons */}
                  <Form.Item style={{ marginTop: -8 }}>
                    <Space wrap size="small">
                      <Text type="secondary" style={{ fontSize: 12 }}>Nhanh:</Text>
                      {[25, 50, 75, 100].map(pct => (
                        <Button
                          key={pct}
                          size="small"
                          onClick={() =>
                            payForm.setFieldValue(
                              'amount',
                              Math.floor((invoiceLookup.remaining * pct) / 100)
                            )
                          }
                        >
                          {pct}%
                        </Button>
                      ))}
                    </Space>
                  </Form.Item>

                  <Form.Item
                    name="payment_method"
                    label="Phương thức thanh toán"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="cash"><WalletOutlined /> Tiền mặt</Option>
                      <Option value="bank_transfer"><BankOutlined /> Chuyển khoản ngân hàng</Option>
                      <Option value="momo"><CreditCardOutlined /> Ví MoMo</Option>
                      <Option value="vnpay"><CreditCardOutlined /> VNPay</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    noStyle
                    shouldUpdate={(prev, cur) => prev.payment_method !== cur.payment_method}
                  >
                    {({ getFieldValue }) =>
                      getFieldValue('payment_method') !== 'cash' && (
                        <Form.Item
                          name="transaction_code"
                          label="Mã giao dịch"
                          rules={[{ required: true, message: 'Nhập mã giao dịch' }]}
                        >
                          <Input placeholder="VD: VIB-2026-05-002" allowClear />
                        </Form.Item>
                      )
                    }
                  </Form.Item>

                  <Form.Item name="note" label="Ghi chú (tuỳ chọn)">
                    <Input.TextArea rows={2} placeholder="Nhập ghi chú..." />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 0 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<DollarOutlined />}
                      block
                      size="large"
                      loading={submittingPayment}
                    >
                      Xác Nhận Thanh Toán
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </Card>
          </Col>
        </Row>
      )}

      {/* ─── Confirm Modal ─── */}
      <Modal
        open={confirmOpen}
        title="Xác nhận thanh toán"
        okText="Xác nhận"
        cancelText="Huỷ"
        onOk={onConfirmPayment}
        onCancel={() => setConfirmOpen(false)}
        okButtonProps={{ loading: submittingPayment }}
      >
        {pendingValues && invoiceLookup && (
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Hóa đơn">{invoiceLookup.invoice_code}</Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <Text strong style={{ color: '#f5222d', fontSize: 16 }}>
                {formatVND(Number(pendingValues.amount))}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức">
              <Badge
                color="blue"
                text={methodLabel[pendingValues.payment_method] || pendingValues.payment_method}
              />
            </Descriptions.Item>
            {pendingValues.transaction_code && (
              <Descriptions.Item label="Mã giao dịch">
                <Text code>{pendingValues.transaction_code}</Text>
              </Descriptions.Item>
            )}
            {pendingValues.note && (
              <Descriptions.Item label="Ghi chú">{pendingValues.note}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      <Modal
        title={
          <Space>
            <SearchOutlined style={{ color: '#2f54eb' }} />
            <span>Tra Cứu Hóa Đơn</span>
          </Space>
        }
        open={lookupModalOpen}
        onCancel={() => setLookupModalOpen(false)}
        footer={null}
        destroyOnClose
        width={550}
      >
        <div style={{ paddingTop: 12 }}>
          <LookupForm
            form={lookupForm}
            loading={loadingLookup}
            onFinish={onLookup}
          />
        </div>
      </Modal>
    </>
  );
};

export default ThanhToan;
