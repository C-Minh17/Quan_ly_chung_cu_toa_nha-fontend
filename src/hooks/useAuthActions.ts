import { currentRole, oneSignalRole } from '@/utils/ip';
import OneSignal from 'react-onesignal';
import { useModel, history } from 'umi';

export const useAuthActions = () => {
	const { setInitialState } = useModel('@@initialState');

	const handleLogout = () => {
		if (oneSignalRole.valueOf() === currentRole.valueOf()) {
			// FIXME: Update
			OneSignal.logout();
			// OneSignal.getUserId((playerId) => deleteOneSignal({ playerId }));
			// OneSignal.setSubscription(false);
		}

		sessionStorage.clear();
		localStorage.clear();
		setInitialState({});
		history.replace('/user/login');
	};

	const handleLogin = () => {
		history.push('/user/login');
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: false,
	};
};
