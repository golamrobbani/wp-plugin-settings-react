import FieldLabel from './FieldLabel';

const Raw = (props) => {
	const { html } = props.field;
	return (
		<div className="rtsb-field raw">
			<FieldLabel field={props.field} />
			<div className="rtsb-field__content">
				{html && (
					<div
						className="rtsb-field__html"
						dangerouslySetInnerHTML={{ __html: html }}
					/>
				)}
			</div>
		</div>
	);
};

export default Raw;
