import SectionItem from './SectionItem';

const SectionItems = (props) => {
	const { blocks, category } = props;
	return (
		<div className="rtsb-ss-item-list">
			{blocks &&
				Object.keys(blocks).map((block_key) => {
					const block = blocks[block_key];
					if (category && block.category !== category) {
						return;
					}
					return (
						<SectionItem
							block={blocks[block_key]}
							id={block_key}
							key={block_key}
							saveData={props.saveData}
						/>
					);
				})}
		</div>
	);
};

export default SectionItems;
