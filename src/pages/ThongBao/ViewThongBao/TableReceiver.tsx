import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { thongKeNotificationNguoiNhan } from '@/services/ThongBao';
import type { ThongBao } from '@/services/ThongBao/typing';
import dayjs from '@/utils/dayjs';
import { Select, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const TableReceiverThongBao = (props: { record?: ThongBao.IRecord }) => {
	const { page, limit, getModel } = useModel('thongbao.receiver');
	const { record } = props;
	const [dataThongKeNguoiNhan, setDataThongKeNguoiNhan] = useState<ThongBao.IThongKeNguoiNhan>();
	const [trangThaiSelect, setTrangThaiSelect] = useState<number>();
	const getData = () =>
		record?._id &&
		getModel(undefined, undefined, undefined, undefined, undefined, `${record._id}/receiver/page`, {
			read: trangThaiSelect,
		});
	const thongKeNguoiNhan = async (id: string) => {
		try {
			const res = await thongKeNotificationNguoiNhan(id);
			if (res) {
				setDataThongKeNguoiNhan(res?.data?.data);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const columns: IColumn<ThongBao.TReceiver>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'fullname',
			width: 180,
			filterType: 'string',
			render: (val, rec) => rec?.userId?.name || rec?.userId?.fullname || rec?.fullname || '-',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 180,
			filterType: 'string',
			render: (val, rec) => rec?.userId?.email || rec?.email || '-',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			width: 120,
			filterType: 'string',
			render: (val, rec) => rec?.userId?.phone || rec?.phone || '-',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'read',
			width: 100,
			align: 'center',
			render: (val) => {
				return <>{val ? <Tag color={'green'}>Đã đọc</Tag> : <Tag color={'red'}>Chưa đọc</Tag>}</>;
			},
		},
		{
			title: 'Thời gian đọc',
			dataIndex: 'readAt',
			width: 150,
			align: 'center',
			render: (val, rec) => (rec?.read && rec?.readAt ? dayjs(rec.readAt).format('HH:mm DD/MM/YYYY') : '-'),
		},
	];

	useEffect(() => {
		if (record?._id) thongKeNguoiNhan(record?._id ?? '');
	}, [record]);
	return (
		<>
			<TableBase
				columns={columns}
				modelName='thongbao.receiver'
				getData={getData}
				dependencies={[page, limit, record?._id, trangThaiSelect]}
				hideCard
				buttons={{ create: false }}
				otherButtons={[
					<Select
						key={'1'}
						placeholder={'Chọn trạng thái'}
						onChange={(val) => {
							setTrangThaiSelect(val);
						}}
						allowClear
						style={{ width: 160 }}
						options={[
							{ value: 1, label: 'Đã đọc' },
							{ value: 0, label: 'Chưa đọc' },
						]}
					/>,
				]}
			>
				{dataThongKeNguoiNhan && (
					<div style={{ marginBottom: 16 }}>
						Tỉ lệ :{' '}
						<b>
							{dataThongKeNguoiNhan?.daDoc}/{+dataThongKeNguoiNhan?.daDoc + +dataThongKeNguoiNhan?.chuaDoc}
						</b>{' '}
						{dataThongKeNguoiNhan?.daDoc > 0 && dataThongKeNguoiNhan?.chuaDoc > 0 ? (
							<>
								(
								{(
									(dataThongKeNguoiNhan?.daDoc / (+dataThongKeNguoiNhan?.daDoc + +dataThongKeNguoiNhan?.chuaDoc)) *
									100
								).toFixed(2)}
								% đã đọc thông báo)
							</>
						) : (
							'(0% đã đọc thông báo)'
						)}
					</div>
				)}
			</TableBase>
		</>
	);
};

export default TableReceiverThongBao;
