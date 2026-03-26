import { initOneSignal } from '@/services/base/api';
import { unitName } from '@/services/base/constant';
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';
import { useIntl } from 'umi';

const SubscribeOneSignal = () => {
	const intl = useIntl();
	useEffect(() => {
		document.title = `Đăng ký nhận thông báo | ${intl.formatMessage({ id: unitName }).toUpperCase()}`;
	}, []);

	/**
	 * Init OneSignal playerId with auth User
	 */
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token)
			OneSignal.getUserId().then((playerId) => {
				// Init playerId to Back-end and Close popup window
				if (playerId)
					initOneSignal({ playerId }).then(() => {
						window.opener = null;
						window.open('', '_self');
						window.close();
					});
			});
	}, []);

	// TODO: Update UI
	return <div>SubscribeOneSignal</div>;
};

export default SubscribeOneSignal;
