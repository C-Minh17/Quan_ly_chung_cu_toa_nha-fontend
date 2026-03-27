import { landingUrl, unitName } from '@/services/base/constant';
import { DefaultFooter } from '@ant-design/pro-layout';
import { useIntl } from 'umi';

export default () => {
	const intl = useIntl();

	return (
		<DefaultFooter
			copyright={`SmartBuilding`}
			// links={[
			// 	{
			// 		key: 'link',
			// 		title: intl.formatMessage({ id: unitName }).toUpperCase(),
			// 		href: landingUrl,
			// 		blankTarget: true,
			// 	},
			// ]}
			style={{ width: '100%' }}
		/>
	);
};
