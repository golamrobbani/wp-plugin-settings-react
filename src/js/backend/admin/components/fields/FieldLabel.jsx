const FieldLabel = (props) => {
	const { label } = props.field;
	return (
		label && (
			<div className="rtsb-field__label_wrap">
				<h6 className="rtsb-field__label">{label}</h6>
			</div>
		)
	);
};

export default FieldLabel;
