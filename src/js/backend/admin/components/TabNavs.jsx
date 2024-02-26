import { useStateValue } from '../utils/StateProvider';

const TabNavs = () => {
	const [data, dispatch] = useStateValue();
	return (
		<div className="rtsb_tabs_navs">
			<ul className="rtsb_navs">
				{Object.values(data.settings).map((setting) => {
					if (!setting.id || !setting.title) {
						return;
					}
					return (
						<li key={setting.id} className="rtsb_tabs_nav_item">
							{setting.title}
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default TabNavs;
