import { useStateValue } from '../../utils/StateProvider';
import SettingsItem from '../Block';
import { useEffect, useState } from 'react';

const Modules = (props) => {
	const [data, dispatch] = useStateValue();

	useEffect(() => {}, []);
	const currentSection = data.settings.modules;
	const { title, id, items, description } = currentSection;
	return (
		<div className="rtsb-settings-wrap">
			<div className="rtsb-settings-header">
				<h2 className="rtsb-settings-header-title">{title}</h2>
				<p className="rtsb-settings-header-description">
					{description}
				</p>
			</div>
			<div className="rtsb-settings-content">
				{Object.values(items).map((item) => {
					return <SettingsItem options={item} />;
				})}
			</div>
		</div>
	);
};

export default Modules;
