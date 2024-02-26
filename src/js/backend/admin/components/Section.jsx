/* global rtsbParams */
import { useStateValue } from '../utils/StateProvider';
import SectionItemList from './SectionItemList';
import { notification, Button } from 'antd';
import { UPDATE_SECTIONS } from '../utils/actionType';
import { useState } from 'react';

const Section = (props) => {
	const { id } = props;
	const [data, dispatch] = useStateValue();
	const section = data.sections[id] || {};
	const [activeLoading, setActiveLoading] = useState(false);
	const [disableLoading, setDisableLoading] = useState(false);

	const { title, short_title, description } = section;

	const updateOptions = (type) => {
		const modules = section.list;
		const field_keys = Object.keys(modules);
		jQuery.ajax({
			url: rtsbParams.ajaxurl,
			data: {
				module_ids: field_keys,
				section_id: section.id,
				action: 'rtsb_toggle_modules_activation',
				__rtsb_wpnonce: rtsbParams.nonce,
				type,
			},
			method: 'POST',
			beforeSend() {
				if (type) {
					setActiveLoading(true);
				} else {
					setDisableLoading(true);
				}
			},
			success(res) {
				setActiveLoading(false);
				setDisableLoading(false);
				if (res.success) {
					notification.success({
						message: res.data.message,
						placement: 'bottomRight',
					});
					dispatch({
						type: UPDATE_SECTIONS,
						sections: res.data.sections,
					});
				} else {
					notification.error({
						message: res.data.message,
						placement: 'bottomRight',
					});
				}
			},
			error(error) {
				setActiveLoading(false);
				setDisableLoading(false);
				notification.error({
					message: error.message,
					placement: 'bottomRight',
				});
			},
		});
	};

	return (
		<div className="rtsb-ss-wrap">
			<div className="rtsb-ss-header-area">
				<div className="rtsb-ss-header">
					<h2 className="rtsb-title">{title}</h2>
					<p className="rtsb-description">{description}</p>
				</div>
				<div className="rtsb-button-wrapper">
					<Button
						key="enable"
						type="primary"
						loading={activeLoading}
						onClick={() => updateOptions('active')}
						className="rtsb-button rtsb-enable-button"
					>
						Enable All {short_title}
					</Button>
					<Button
						key="disable"
						type="secondary"
						loading={disableLoading}
						onClick={() => updateOptions()}
						className="rtsb-button rtsb-disable-button"
					>
						Disable All {short_title}
					</Button>
				</div>
			</div>
			<SectionItemList section={section} saveData={props.saveData} />
		</div>
	);
};

export default Section;
