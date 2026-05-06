import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

const { Title } = Typography;

interface Props {
  initialValues?: MUtilityReading.IRecord | any;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormUtilityReading = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateUtilityReading, loadingInfoUtilityReading, handleCreateUtilityReading } = useModel('utilityReading.utilityReading');
  const { infoAllApartment, handleGetInfoAllApartment } = useModel('apartment.apartment');
  const { infoAllFeeType, handleGetInfoAllFeeType } = useModel('feeType.feeType');
  const { initialState } = useModel('@@initialState');

  const [form] = Form.useForm();

  useEffect(() => {
    if (!infoAllApartment || infoAllApartment.length === 0) {
      handleGetInfoAllApartment();
    }
    if (!infoAllFeeType || infoAllFeeType.length === 0) {
      handleGetInfoAllFeeType();
    }
  }, []);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      // Map back populated fields to IDs for Select components
      const formVals = {
        ...initialValues,
        apartment_id: initialValues.apartment?._id || initialValues.apartment_id,
        fee_type_id: initialValues.fee_type?._id || initialValues.fee_type_id,
      };
      form.setFieldsValue(formVals);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const onSubmit = async (values: any) => {
    try {
      if (edit && initialValues?._id) {
        const payload = {
          ...values,
          current_reading: values.current_reading,
          recorded_by: initialState?.currentUser?.ssoId,
        };
        const res = await handleUpdateUtilityReading(initialValues._id as string, payload);
        if (res) {
          message.success('Cập nhật chỉ số thành công');
        }
      } else {
        const payload = {
          ...values,
          recorded_by: initialState?.currentUser?.ssoId,
          previous_reading: null
        };
        const res = await handleCreateUtilityReading(payload);
        if (res) {
          message.success('Thêm mới chỉ số thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EditOutlined style={{ color: '#52c41a' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>
            {edit ? 'Cập nhật chỉ số' : 'Nhập chỉ số mới'}
          </span>
        </div>
      }
      styles={{ header: { borderBottom: 'none', paddingBottom: 0 } }}
    >
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Form.Item
          name="apartment_id"
          label="Căn hộ"
          rules={[{ required: true, message: 'Vui lòng chọn căn hộ!' }]}
        >
          <Select
            disabled={edit}
            showSearch
            placeholder="Chọn căn hộ..."
            optionFilterProp="children"
            options={infoAllApartment?.map(apt => ({
              value: apt._id,
              label: apt.apartment_code
            }))}
          />
        </Form.Item>

        <Form.Item
          name="fee_type_id"
          label="Loại chỉ số"
          rules={[{ required: true, message: 'Vui lòng chọn loại chỉ số!' }]}
        >
          <Select
            disabled={edit}
            showSearch
            placeholder="Chọn loại..."
            optionFilterProp="children"
            options={infoAllFeeType?.filter(fee => fee.fee_category === 'metered').map(fee => ({
              value: fee._id,
              label: fee.name
            }))}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="reading_month"
              label="Tháng"
              rules={[{ required: true, message: 'Vui lòng chọn tháng!' }]}
            >
              <Select disabled={edit} placeholder="Tháng">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                  <Select.Option key={m} value={m}>Tháng {m}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="reading_year"
              label="Năm"
              rules={[{ required: true, message: 'Vui lòng chọn năm!' }]}
            >
              <Select disabled={edit} placeholder="Năm">
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <Select.Option key={y} value={y}>{y}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="previous_reading"
              label="Chỉ số tháng trước"
            >
              <Input disabled placeholder="Tự động điền" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="current_reading"
              label="Chỉ số hiện tại"
            >
              <InputNumber style={{ width: '100%' }} placeholder="Nhập chỉ số" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20, gap: '8px' }}>
          <Button
            onClick={() => {
              form.resetFields();
              setShowEdit?.(false);
            }}
            style={{ minWidth: '80px' }}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loadingInfoUtilityReading}
            icon={<SaveOutlined />}
            style={{ backgroundColor: '#2f3032', borderColor: '#434343' }} // Tweak to match dark theme icon styles if needed
          >
            Lưu chỉ số
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormUtilityReading;
