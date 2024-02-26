const Title = (props) => {
	const { label, subtitle } = props.field;
	return (
		<div className="rtsb-field-title">
			<h3 className="title-label">{label}</h3>
			{subtitle && (
				<div
					className="rtsb-field__subtitle"
					dangerouslySetInnerHTML={{ __html: subtitle }}
				/>
			)}
		</div>
	);
};

export default Title;
