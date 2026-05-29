import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, InputNumber, Row, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const FormAmenity = (props: any) => {
	const { initialValues, edit, setShowEdit } = props;
	const { handleCreateAmenity, handleUpdateAmenity, loadingInfoAllAmenity } = useModel('tienich.amenity');
	const [form] = Form.useForm();

	useEffect(() => {
		if (edit && initialValues) {
			const values = { ...initialValues };
			if (values.open_time) {
				values.open = dayjs(values.open_time);
			}
			if (values.close_time) {
				values.close = dayjs(values.close_time);
			}
			form.setFieldsValue(values);
		} else {
			form.resetFields();
			form.setFieldsValue({
				is_active: true,
			});
		}
	}, [edit, initialValues, form]);

	const onFinish = async (values: any) => {
		const payload: MAmenity.IRecord = {
			name: values.name,
			description: values.description,
			capacity: values.capacity,
			open_time: values.open ? dayjs().hour(values.open.hour()).minute(values.open.minute()).second(0).toISOString() : undefined,
			close_time: values.close ? dayjs().hour(values.close.hour()).minute(values.close.minute()).second(0).toISOString() : undefined,
			is_active: values.is_active,
		};

		try {
			if (edit) {
				await handleUpdateAmenity((initialValues._id || initialValues.id) as string, payload);
			} else {
				await handleCreateAmenity(payload);
			}
			setShowEdit?.(false);
			props.onReload?.();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<Card title={edit ? 'Cập nhật tiện ích' : 'Thêm tiện ích mới'}>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				id="form-amenity"
			>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="name"
							label="Tên tiện ích"
							rules={[{ required: true, message: 'Vui lòng nhập tên tiện ích!' }]}
						>
							<Input placeholder="Nhập tên tiện ích" />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="capacity"
							label="Sức chứa tối đa (người)"
						>
							<InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số lượng" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name="open"
							label="Giờ mở cửa"
						>
							<TimePicker format="HH:mm" style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					
					<Col span={12}>
						<Form.Item
							name="close"
							label="Giờ đóng cửa"
						>
							<TimePicker format="HH:mm" style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="is_active"
							label="Trạng thái hoạt động"
							valuePropName="checked"
						>
							<Switch checkedChildren="Hoạt động" unCheckedChildren="Bảo trì" />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item
							name="description"
							label="Mô tả"
						>
							<Input.TextArea rows={3} placeholder="Mô tả chi tiết về tiện ích..." />
						</Form.Item>
					</Col>
				</Row>

				<div className="form-footer" style={{ marginTop: 20 }}>
					<Button type="primary" htmlType="submit" loading={loadingInfoAllAmenity}>
						{edit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormAmenity;
