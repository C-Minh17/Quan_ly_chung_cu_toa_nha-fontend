import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

interface Props {
  initialValues?: MApartment.IRecord;
  setShowEdit?: (value: boolean) => void;
  edit?: boolean;
}

const STATUS_OPTIONS = [
  { value: 'Trống', label: 'Trống' },
  { value: 'Đã thuê', label: 'Đã thuê' },
  { value: 'Đã đặt', label: 'Đã đặt' },
  { value: 'Đang bảo trì', label: 'Đang bảo trì' },
];

const FormApartment = (props: Props) => {
  const { initialValues, setShowEdit, edit } = props;
  const { handleUpdateApartment, loadingInfoApartment, handleCreateApartment } = useModel('apartment.apartment');
  const { infoAllBuilding, handleGetInfoAllBuilding } = useModel('building.building');
  const { infoAllFloor, handleGetInfoAllFloor } = useModel('floor.floor');

  const [form] = Form.useForm();
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | undefined>();

  useEffect(() => {
    handleGetInfoAllBuilding();
    handleGetInfoAllFloor();
  }, []);

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
      const buildingId = initialValues.building_id
        || (initialValues as any)?.floor?.building?._id
        || (initialValues as any)?.floor?.building_id;
      setSelectedBuildingId(buildingId);
    } else {
      form.resetFields();
      setSelectedBuildingId(undefined);
    }
  }, [initialValues]);

  const filteredFloors = selectedBuildingId
    ? infoAllFloor?.filter(f => {
      const bid = (f as any).building?._id || f.building_id;
      return bid === selectedBuildingId;
    })
    : infoAllFloor;

  const onSubmit = async (values: any) => {
    try {
      const payload = { ...values };
      if (edit) {
        const res = await handleUpdateApartment(initialValues?._id as string, payload);
        if (res) {
          message.success('Cập nhật thông tin căn hộ thành công');
        }
      } else {
        const res = await handleCreateApartment(payload);
        if (res) {
          message.success('Thêm mới căn hộ thành công');
        }
      }
      form.resetFields();
      setShowEdit?.(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card title={edit ? 'Cập nhật căn hộ' : 'Thêm mới căn hộ'}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onSubmit}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="building_id"
              label="Tòa nhà"
              rules={[{ required: true, message: 'Vui lòng chọn tòa nhà!' }]}
            >
              <Select
                showSearch
                placeholder="Chọn tòa nhà"
                optionFilterProp="label"
                options={infoAllBuilding?.map((b: MBuilding.IRecord) => ({
                  value: b._id,
                  label: b.name,
                }))}
                onChange={(val) => {
                  setSelectedBuildingId(val);
                  form.setFieldsValue({ floor_id: undefined });
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="floor_id"
              label="Tầng"
              rules={[{ required: true, message: 'Vui lòng chọn tầng!' }]}
            >
              <Select
                showSearch
                placeholder={selectedBuildingId ? 'Chọn tầng' : 'Chọn tòa nhà trước'}
                optionFilterProp="label"
                disabled={!selectedBuildingId}
                options={filteredFloors?.map(floor => ({
                  value: floor._id,
                  label: `Tầng ${floor.floor_number}`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="apartment_type"
              label="Loại căn hộ"
              rules={[{ required: true, message: 'Vui lòng nhập loại căn hộ!' }]}
            >
              <Input placeholder="Ví dụ: Tiêu chuẩn, Studio..." />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: 'Vui lòng nhập diện tích!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 75.5" min={1} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="price"
              label="Giá (VNĐ)"
              rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Ví dụ: 15000000"
                min={0}
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="num_bedrooms"
              label="Số phòng ngủ"
              rules={[{ required: true, message: 'Vui lòng nhập số phòng ngủ!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 2" min={0} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="num_bathrooms"
              label="Số phòng tắm"
              rules={[{ required: true, message: 'Vui lòng nhập số phòng tắm!' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Ví dụ: 2" min={0} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select placeholder="Chọn trạng thái" options={STATUS_OPTIONS} />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer" style={{ marginTop: 20 }}>
          <Button type="primary" htmlType="submit" loading={loadingInfoApartment}>
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>
            Hủy
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormApartment;
