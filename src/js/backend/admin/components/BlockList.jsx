import _ from 'lodash';
import Blocks from './Blocks';

const BlockList = (props) => {
	const { list, categories } = props.section;
	const rawList = (list && JSON.parse(JSON.stringify(list))) || {};
	const removeBlock = (block_key) => {
		delete rawList[block_key];
	};
	return (
		<div className="rtsb-settings-content">
			{categories ? (
				<>
					{Object.keys(categories).map((cat_key) => {
						const { title, description } = categories[cat_key];
						return (
							<div
								className="rtsb-settings-cat-wrap"
								key={cat_key}
							>
								<div className="rtsb-settings-cat-header">
									<h3 className="rtsb-settings-cat-header-title">
										{title}
									</h3>
									<p className="rtsb-settings-cat-header-title">
										{description}
									</p>
								</div>
								<div className="rtsb-settings-block-container">
									<Blocks
										blocks={list}
										removeBlock={removeBlock}
										category={cat_key}
									/>
								</div>
							</div>
						);
					})}
					{!_.isEmpty(rawList) && (
						<div className="rtsb-settings-cat-wrap empty-cat-list">
							<div className="rtsb-settings-cat-header">
								<h3 className="rtsb-settings-cat-header-title">
									Empty Cat
								</h3>
							</div>
							<Blocks blocks={rawList} />
						</div>
					)}
				</>
			) : (
				<Blocks blocks={list} />
			)}
		</div>
	);
};

export default BlockList;
