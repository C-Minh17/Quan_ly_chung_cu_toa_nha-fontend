import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import { useEffect } from 'react';
import MyDatePicker from '@/components/MyDatePicker';
import SelectResident from '@/pages/Quan-ly-dan-cu/components/Select';
import SelectApartment from '@/pages/Quan-ly-can-ho/components/Select';

interface Props {
  initialValues?: MContract.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const FormContract = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateContract, loadingInfoContract, handleCreateContract } = useModel('contract.contract');
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const onSubmit = async (values: any) => {
    try {
      const file_url = await buildUpLoadFile(values, 'file_url');

      const payload = {
        ...values,
        file_url,
      };

      if (edit) {
        const res = await handleUpdateContract(initialValues?._id as string, payload);
        if (res) {
          message.success('Cập nhật hợp đồng thành công');
        }
      } else {
        const res = await handleCreateContract(payload);
        if (res) {
          message.success('Thêm mới hợp đồng thành công');
        }  
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
      message.error('Đã có lỗi xảy ra');
    }
  };

  return (
    <Card title={edit ? "Cập nhật hợp đồng" : "Thêm mới hợp đồng"}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contract_code"
              label="Mã hợp đồng"
              rules={[{ required: true, message: 'Vui lòng nhập mã hợp đồng!' }]}
            >
              <Input placeholder="Mã hợp đồng (ví dụ: HD001)" disabled={edit} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="contract_type"
              label="Loại hợp đồng"
              rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng!' }]}
            >
              <Select options={[
                { value: 'purchase', label: 'Mua bán' },
                { value: 'rent', label: 'Cho thuê' },
              ]} placeholder="Chọn loại hợp đồng" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="apartment_id"
              label="Căn hộ"
              rules={[{ required: true, message: 'Vui lòng chọn căn hộ!' }]}
            >
              <SelectApartment
                value={form.getFieldValue('apartment_id')}
                onChange={(val) => form.setFieldsValue({ apartment_id: val })}
                multiple={false}
                hasCreate={false}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="resident_id"
              label="Cư dân"
              rules={[{ required: true, message: 'Vui lòng chọn cư dân!' }]}
            >
              <SelectResident
                value={form.getFieldValue('resident_id')}
                onChange={(val) => form.setFieldsValue({ resident_id: val })}
                multiple={false}
                hasCreate={false}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="start_date" label="Ngày bắt đầu">
              <MyDatePicker placeholder="Chọn ngày bắt đầu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="end_date" label="Ngày kết thúc">
              <MyDatePicker placeholder="Chọn ngày kết thúc" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="monthly_price" label="Giá thuê (VND/tháng)">
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="Ví dụ: 5,000,000"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deposit" label="Tiền cọc (VND)">
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="Ví dụ: 10,000,000"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="file_url" label="File hợp đồng">
              <UploadFile />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="notes" label="Ghi chú">
              <Input.TextArea rows={3} placeholder="Ghi chú thêm..." />
            </Form.Item>
          </Col>
        </Row>

        <div className='form-footer' style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => setShowEdit?.(false)}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit" loading={loadingInfoContract}>
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormContract;
