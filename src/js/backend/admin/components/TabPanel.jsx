import { useStateValue } from '../utils/StateProvider';
import { useState } from 'react';
import SettingsItem from './Block';

const TabPanel = (props) => {
	const [data, dispatch] = useStateValue();
	const currentSection = data.settings[props.activeIndex];
	return (
		<div className="rtsb_tab_panel">
			<div className="rtsb_tab_panel_content">
				<div className="rtsb_tab_panel_header">
					<h6 className="rtsb_tab_panel_header_title">
						{currentSection.title}
					</h6>
					<p className="rtsb_tab_panel_header_description">
						{currentSection.description}
					</p>
				</div>
				<div className="rtsb_tab_panel_options">
					<div className="rtsb-item-list-container">
						{Object.values(currentSection.items).map((item) => {
							return <SettingsItem options={item} />;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TabPanel;
