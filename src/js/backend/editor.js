/**
 * Elementor Editor Script
 */

/* global rtsbTemplateBuilderEditorScript, rtSelect2Obj */

'use strict';

(function ($, elementor) {
	$(document).ready(function () {
		if (rtsbTemplateBuilderEditorScript.isEditorForBuilder) {
			rtsbEditorHelpers.reloadPreview(elementor);
		}

		elementor.hooks.addAction('panel/open_editor/widget', () => {
			rtsbEditorHelpers.proClickActions(
				$,
				'.image-selector-inner.rtsb-pro, .rtsb-pro-field',
				'.image-selector-inner, .rtsb-pro-field',
				'is-pro'
			);
		});

		rtsbPromoContent($);
	});

	$(document).on('rt_select2_event', function (event, obj) {
		rtsbEditorHelpers.rtSelect2Init(event, obj, $);
	});
})(jQuery, window.elementor);

// TODO:: Need to search for the best workaround instead of reloading.
const rtsbEditorHelpers = {
	reloadPreview: (el) => {
		el.once('document:loaded', () => {
			setTimeout(function () {
				el.reloadPreview();
			}, 10);
		});
	},

	proClickActions: ($, target, search, classToAdd) => {
		$('body').on('click', target, (e) => {
			$(e.target).parents().find(search).removeClass(classToAdd);
			$(e.target).addClass(classToAdd);

			setTimeout(function () {
				$(e.target).removeClass(classToAdd);
			}, 1800);

			return false;
		});
	},

	rtSelect2Init: (event, obj, $) => {
		const rtSelect = '#elementor-control-default-' + obj.data._cid;

		setTimeout(function () {
			const IDSelect2 = $(rtSelect).select2({
				minimumInputLength: obj.data.minimum_input_length,
				maximumSelectionLength: obj.data.maximum_selection_length ?? -1,
				allowClear: true,
				ajax: {
					url: rtSelect2Obj.ajaxurl,
					dataType: 'json',
					delay: 250,
					method: 'POST',
					data(params) {
						return {
							action: 'rt_select2_object_search',
							post_type: obj.data.source_type,
							source_name: obj.data.source_name,
							search: params.term,
							page: params.page || 1,
						};
					},
				},
				initSelection(element, callback) {
					if (!obj.multiple) {
						callback({ id: '', text: rtSelect2Obj.search_text });
					} else {
						callback({ id: 9999, text: 'search' });
					}
					let ids = [];
					if (!Array.isArray(obj.currentID) && obj.currentID != '') {
						ids = [obj.currentID];
					} else if (Array.isArray(obj.currentID)) {
						ids = obj.currentID.filter(function (el) {
							return el != null;
						});
					}

					if (ids.length > 0) {
						const label = $(
							"label[for='elementor-control-default-" +
								obj.data._cid +
								"']"
						);
						label.after(
							'<span class="elementor-control-spinner">&nbsp;<i class="eicon-spinner eicon-animation-spin"></i>&nbsp;</span>'
						);
						$.ajax({
							method: 'POST',
							url:
								rtSelect2Obj.ajaxurl +
								'?action=rt_select2_get_title',
							data: {
								post_type: obj.data.source_type,
								source_name: obj.data.source_name,
								id: ids,
							},
						}).done(function (response) {
							if (
								response.success &&
								typeof response.data.results !== 'undefined'
							) {
								let rtSelect2Options = '';
								ids.forEach(function (item, index) {
									if (
										typeof response.data.results[item] !==
										'undefined'
									) {
										const key = item;
										const value =
											response.data.results[item];
										rtSelect2Options += `<option selected="selected" value="${key}">${value}</option>`;
									}
								});

								element.append(rtSelect2Options);
							}
							label
								.siblings('.elementor-control-spinner')
								.remove();
						});
					}
				},
			});

			//Select2 drag and drop : starts
			setTimeout(function () {
				IDSelect2.next()
					.children()
					.children()
					.children()
					.sortable({
						containment: 'parent',
						stop(event, ui) {
							ui.item
								.parent()
								.children('[title]')
								.each(function () {
									const title = $(this).attr('title');
									const original = $(
										'option:contains(' + title + ')',
										IDSelect2
									).first();
									original.detach();
									IDSelect2.append(original);
								});
							IDSelect2.change();
						},
					});
			}, 200);
		}, 100);
	},
};

const rtsbPromoContent = ($) => {
	$(parent.document).on('mousedown', function (e) {
		const widgets = $(parent.document).find(
			'.elementor-element--promotion'
		);

		if (widgets.length > 0) {
			widgets.each(function () {
				if ($.contains(this, e.target)) {
					const dialog = $(parent.document).find(
						'#elementor-element--promotion__dialog'
					);
					const icon = $(this).find('.icon > i');

					if (icon.hasClass('rtsb-promotional-element')) {
						const dialogButtonsAction = dialog.find(
							'.elementor-button.go-pro'
						);

						dialogButtonsAction.remove();

						if (
							!dialog.find('.rtsb-dialog-buttons-action').length
						) {
							const button = $('<a>', {
								href: 'https://shopbuilderwp.com/',
								target: '_blank',
								class: 'dialog-button dialog-action dialog-buttons-action elementor-button elementor-button-success rtsb-dialog-buttons-action',
							}).text('GET PRO');

							dialog
								.find('.dialog-buttons-wrapper')
								.append(button);
						} else {
							dialog
								.find('.rtsb-dialog-buttons-action')
								.css('display', '');
						}
					}

					return false;
				}
			});
		}
	});
};
