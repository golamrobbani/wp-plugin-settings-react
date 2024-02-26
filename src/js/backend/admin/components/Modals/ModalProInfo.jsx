import { Modal } from 'antd';

const ModalProInfo = (props) => {
	const { block, visible, setVisible } = props;

	return (
		<Modal
			centered
			open={visible}
			className="rtsb-pro-modal"
			onOk={() => setVisible(false)}
			onCancel={() => setVisible(false)}
			footer={false}
		>
			<div className="rtsb-box-icon">
				<i className="dashicons dashicons-lock"></i>
			</div>
			<div className="rtsb-box-content">
				<h3 className="rtsb-box-title">Pro Feature Alert!</h3>
				<p>
					Sorry! This is a Pro feature. To activate this feature, you
					need to upgrade to the Pro version.
				</p>
				<a
					href="https://shopbuilderwp.com"
					target="_blank"
					className="rtsb-pro-btn rtsb-button"
					rel="noreferrer"
				>
					Get Pro Version
				</a>
			</div>
		</Modal>
	);
};

export default ModalProInfo;
