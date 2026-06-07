import { useModel } from '@umijs/max';
import { Alert, Button, Card, Col, DatePicker, Form, InputNumber, Row, Select, TimePicker } from 'antd';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { useEffect, useState } from 'react';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;

const FormBooking = (props: any) => {
	const { setShowEdit } = props;
	const { handleCreateAmenityBooking, loadingInfoAllAmenityBooking } = useModel('amenityBooking.amenityBooking');
	const { infoAllAmenity, handleGetAmenitySchedule } = useModel('tienich.amenity');
	const { infoMeResident, handleGetMeResident } = useModel('resident.resident');
	
	const [form] = Form.useForm();
	const [selectedAmenity, setSelectedAmenity] = useState<MAmenity.IRecord | null>(null);
	const [selectedDate, setSelectedDate] = useState<any>(null);
	const [bookedSlots, setBookedSlots] = useState<{ start: dayjs.Dayjs, end: dayjs.Dayjs }[]>([]);
	const [loadingSchedule, setLoadingSchedule] = useState(false);

	useEffect(() => {
		handleGetMeResident();
		form.resetFields();
	}, [form]);

	const handleAmenityChange = (val: string) => {
		const amenity = infoAllAmenity?.find((a: any) => a._id === val);
		setSelectedAmenity(amenity || null);
		form.setFieldsValue({ booking_date: undefined, time_range: undefined });
		setBookedSlots([]);
	};

	const handleDateChange = async (date: any) => {
		setSelectedDate(date);
		form.setFieldsValue({ time_range: undefined });
		
		if (date && selectedAmenity?._id) {
			setLoadingSchedule(true);
			try {
				const schedule = await handleGetAmenitySchedule(selectedAmenity._id, date.format('YYYY-MM-DD'));
				if (schedule && Array.isArray(schedule)) {
					const slots = schedule.map((booking: any) => ({
						start: dayjs(`${date.format('YYYY-MM-DD')} ${booking.start_time}`),
						end: dayjs(`${date.format('YYYY-MM-DD')} ${booking.end_time}`),
					}));
					setBookedSlots(slots);
				} else {
					setBookedSlots([]);
				}
			} catch (error) {
				console.error(error);
			}
			setLoadingSchedule(false);
		}
	};

	const onFinish = async (values: any) => {
		if (!values.time_range || values.time_range.length !== 2) return;
		if (!infoMeResident) {
			console.error("Không tìm thấy thông tin cư dân!");
			return;
		}

		const payload: MAmenityBooking.IRecord = {
			resident_id: infoMeResident._id,
			amenity_id: values.amenity_id,
			booking_date: values.booking_date.format('YYYY-MM-DD'),
			start_time: dayjs(`${values.booking_date.format('YYYY-MM-DD')} ${values.time_range[0].format('HH:mm')}`).toISOString(),
			end_time: dayjs(`${values.booking_date.format('YYYY-MM-DD')} ${values.time_range[1].format('HH:mm')}`).toISOString(),
			num_people: values.num_people,
		};

		try {
			await handleCreateAmenityBooking(payload);
			setShowEdit?.(false);
			props.onReload?.();
		} catch (error) {
			console.error(error);
		}
	};

	const disabledDate = (current: any) => {
		return current && current < dayjs().startOf('day');
	};

	const disabledTime = (current: dayjs.Dayjs | null, type: 'start' | 'end') => {
		if (!selectedAmenity) return {};

		const disabledHours = () => {
			const hours: number[] = [];
			const openHour = selectedAmenity.open_time ? dayjs(selectedAmenity.open_time).hour() : 0;
			const closeHour = selectedAmenity.close_time ? dayjs(selectedAmenity.close_time).hour() : 23;

			for (let i = 0; i < 24; i++) {
				if (i < openHour || i > closeHour) {
					hours.push(i);
				}
			}
			
			bookedSlots.forEach(slot => {
				const startHour = slot.start.hour();
				const endHour = slot.end.hour();
				for (let i = startHour; i <= endHour; i++) {
					if (!hours.includes(i)) {
						hours.push(i);
					}
				}
			});

			return hours;
		};

		return {
			disabledHours,
		};
	};

	return (
		<Card title="Đặt chỗ tiện ích">
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				id="form-booking"
			>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item
							name="amenity_id"
							label="Chọn tiện ích"
							rules={[{ required: true, message: 'Vui lòng chọn tiện ích!' }]}
						>
							<Select
								placeholder="Chọn tiện ích bạn muốn đặt"
								onChange={handleAmenityChange}
								showSearch
								optionFilterProp="children"
							>
								{infoAllAmenity?.map((amenity: any) => (
									<Option 
										key={amenity._id} 
										value={amenity._id} 
										disabled={!amenity.is_active}
									>
										{amenity.name} {amenity.is_active ? '' : '(Đang bảo trì)'}
									</Option>
								))}
							</Select>
						</Form.Item>

						{selectedAmenity && !selectedAmenity.is_active && (
							<Alert
								message="Tiện ích này đang bảo trì, không thể đặt chỗ lúc này."
								type="error"
								showIcon
								style={{ marginBottom: 16 }}
							/>
						)}
					</Col>

					<Col span={12}>
						<Form.Item
							name="booking_date"
							label="Ngày đặt"
							rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
						>
							<DatePicker 
								style={{ width: '100%' }} 
								disabledDate={disabledDate}
								onChange={handleDateChange}
								disabled={!selectedAmenity || !selectedAmenity.is_active}
								format="DD/MM/YYYY"
							/>
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							name="num_people"
							label="Số người tham gia"
							rules={[{ required: true, message: 'Vui lòng nhập số người!' }]}
						>
							<InputNumber min={1} style={{ width: '100%' }} placeholder="Nhập số người tham gia" />
						</Form.Item>
					</Col>

					<Col span={24}>
						{selectedDate && (
							<Alert
								message="Lưu ý: Các khung giờ mờ là khung giờ đã có người đặt hoặc ngoài giờ hoạt động."
								type="info"
								showIcon
								style={{ marginBottom: 16 }}
							/>
						)}
						<Form.Item
							name="time_range"
							label="Khung giờ"
							rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
						>
							<TimePicker.RangePicker 
								format="HH:mm"
								style={{ width: '100%' }}
								disabled={!selectedDate || loadingSchedule}
								disabledTime={(current, type) => disabledTime(current, type)}
								minuteStep={30}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className="form-footer" style={{ marginTop: 20 }}>
					<Button type="primary" htmlType="submit" loading={loadingInfoAllAmenityBooking}>
						Tạo đặt chỗ
					</Button>
					<Button onClick={() => setShowEdit?.(false)} style={{ marginLeft: 8 }}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormBooking;
