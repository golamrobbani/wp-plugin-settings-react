const Description = (props) => {
	const { text } = props.field;
	return (
		<div className="rtsb-field-description">
			<div
				className="rtsb-field__description-label"
				dangerouslySetInnerHTML={{ __html: text }}
			/>
		</div>
	);
};

export default Description;
