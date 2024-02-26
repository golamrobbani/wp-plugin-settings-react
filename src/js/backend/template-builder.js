/**
 * Template Builder Admin JS
 */

/* global rtsbParams, RtsbModal */

'use strict';

// Modal
require('../common/modal');

(function ($) {
	// DOM Ready Event
	$(document).ready(() => {
		rtsbBuilderBackend.linkAction();
		rtsbBuilderBackend.modalAction();
		rtsbBuilderBackend.buttonsAction();
	});

	// Builder Frontend Obj
	const rtsbBuilderBackend = {
		linkAction: () => {
			$('body.post-type-rtsb_builder')
				.find('.page-title-action')
				.attr('href', '#');
		},

		// TODO: workin here for Open Modal
		modal: () => {
			$('body.post-type-rtsb_builder #wpcontent').on('click', '.page-title-action, .row-title, .row-actions [class="edit"] a', function (e) {
				e.preventDefault();
				const _self = $(e.target);
				const href = _self.attr('href');
				let post_id = 0;
				let saved_template = '';
				if (href) {
					const url = href
						.slice(href.indexOf('?') + 1)
						.split('&');
					if (url && url[0].split('=')[1]) {
						post_id = parseInt(url[0].split('=')[1]);
					}
				}
				if (post_id) {
					saved_template = 'saved-template rtsb-edit-template';
				}
				const modal = new RtsbModal({
					footer: true, wrapClass: 'heading template-builder-popups ' + saved_template,
				});

				const data = {
					action: 'rtsb_builder_modal_template',
					post_id: post_id ? post_id : null, __rtsb_wpnonce: rtsbParams.__rtsb_wpnonce,
				};

				$.ajax({
					url: rtsbParams.ajaxurl, data, type: 'POST', beforeSend() {
						modal.addModal().addLoading();
					}, success(response) {
						modal.removeLoading();
						modal.addTitle(response.title);
						if (response.success) {
							modal.content(response.content);
							modal.addFooterContent(response.footer);
							$(document).trigger('rtsb.Builder.Modal.Change');
						}
					}, error(e) {
					},
				});
			});
		},

		closeModal: () => {
			$(document).on('rtsb.rtsbModal.close', function (event, wrapper) {
				const close_button = $(wrapper).find('.template-builder-popups .rtsb-modal-close');
				const page_data = close_button.attr('data-save');
				if ('saved' == page_data) {
					location.reload();
				}
			});
		},

		productSearch: () => {
			$('#rtsb_product_page_preview, #rtsb_page_for_the_products ').select2({
				placeholder: 'Select product', minimumInputLength: 4, allowClear: true, ajax: {
					url: rtsbParams.ajaxurl, data(params) {
						return {
							action: 'rtsb_modal_product_search', search: params.term ? params.term : null, __rtsb_wpnonce: rtsbParams.__rtsb_wpnonce,
						};
					}, processResults(res, params) {
						return {
							results: res.data.items,
						};
					}, cache: true,
				},
			});

		},

		categorySearch: () => {
			$('#rtsb_page_for_the_categories').select2({
				placeholder: 'Select Category', minimumInputLength: 3, allowClear: true, ajax: {
					url: rtsbParams.ajaxurl, data(params) {
						return {
							action: 'rtsb_modal_category_search', search: params.term ? params.term : null, __rtsb_wpnonce: rtsbParams.__rtsb_wpnonce,
						};
					}, processResults(res, params) {
						return {
							results: res.data.items,
						};
					}, cache: true,
				},
			});

		},

		onModalChange: () => {
			$(document).on('rtsb.Builder.Modal.Change', function () {
				const template_type = $('body.post-type-rtsb_builder').find('#rtsb_tb_template_type');
				const product_page = $('body.post-type-rtsb_builder').find('.rtsb-product-page-field');
				const categories_page = $('body.post-type-rtsb_builder').find('.rtsb-categories-page-field');
				const modallabelPrefix = $('#modallabelPrefix');

				product_page.slideUp();
				categories_page.slideUp();

				if (template_type) {
					$('body').find('.rtsb-import-layout').removeAttr('disabled');
					const layout = template_type.val();
					// const editor_type = $('body.post-type-rtsb_builder').find('#rtsb_tb_template_edit_with').val();
					const selector = $('body').find('.set-default-layout');
					let foundLayout = selector.find('.layout-container[data-layout-type=' + layout + ']').length

					selector.find('.layout-container').not('.type-default').hide();
					selector.find('.layout-container[data-layout-type=' + layout + ']').show();

					if ('product' === layout) {
						product_page.slideDown();
						rtsbBuilderBackend.productSearch();
					} else if ('archive' === layout) {
						categories_page.slideDown();
						rtsbBuilderBackend.categorySearch();
						selector.find('.layout-container[data-layout-type=shop]').show();
						foundLayout += selector.find('.layout-container[data-layout-type=shop]').length;
					}

					let labelPrefix = template_type.find("option[value='" + layout + "']").text();
					modallabelPrefix.html(" - " + " " + labelPrefix + ' <span class="template-count">(' + foundLayout + ')</span>');
				}
			});
		},

		button: () => {
			$('body.post-type-rtsb_builder').on('click', '.rtsb-import-layout', function (e) {
				e.preventDefault();
				const buttonEl = $(this);
				// const _self = $(e.target);
				const parentEl = buttonEl.parents('.template-builder-popups');
				const import_layout = buttonEl.parents('.layout-container').find('input[name="import_default_layout"]').val();
				const page_name_field = parentEl.find('#rtsb_tb_template_name');
				const page_name = page_name_field.val();
				const page_type = parentEl.find('#rtsb_tb_template_type').val();
				const default_template = parentEl.find('#default_template:checked').val();
				const page_id = parentEl.find('#page_id').val();
				const edit_with = parentEl.find('#rtsb_tb_template_edit_with').val();
				const preview_product_id = parentEl.find('#rtsb_product_page_preview').val();
				const the_products = parentEl.find('#rtsb_page_for_the_products').val();
				const category_archive = parentEl.find('#rtsb_page_for_the_categories').val();
				const modalBody = parentEl.find('.rtsb-modal-body');
				const btnLabel = buttonEl.parents('.layout-container').find('.import-label');
				const btnLabelData = btnLabel.data('label');

				const data = {
					action: 'rtsb_builder_create_template',
					page_id: page_id ? page_id : null,
					page_name: page_name ? page_name : null,
					page_type: page_type ? page_type : null,
					preview_product_id: preview_product_id ? preview_product_id : null,
					the_products: the_products ? the_products : [],
					category_archive: category_archive ? category_archive : [],
					default_template: default_template ? default_template : null,
					template_edit_with: edit_with ? edit_with : null,
					import_default_layout: import_layout ? import_layout : null,
					__rtsb_wpnonce: rtsbParams.__rtsb_wpnonce,
					hasPro: rtsbParams.hasPro,
				};

				if (!page_name) {
					modalBody.stop().animate({scrollTop: 0}, 500, 'swing', function () {
						page_name_field.focus().next('.message').show();
					});

					// page_name_field.next('.message').show();
				} else {
					page_name_field.next('.message').hide();
					$.ajax({
						url: rtsbParams.ajaxurl,
						data,
						type: 'POST',
						beforeSend() {
							parentEl.addClass('let-me-import');
							const loader_html = '<div class="rtsb-tb-loader rtsb-ball-clip-rotate"><div></div></div>';
							buttonEl.parents('.rtsb-tb-button-wrapper').addClass('active').append(loader_html);
							$('.layout-container').removeClass('import-done');
							buttonEl.parents('.layout-container').addClass('importing').removeClass('import-done');
							if (buttonEl.parent('.rtsb-tb-button-wrapper').hasClass('save-button')) {
								buttonEl.text('Saving...');
							}
							btnLabel.text(btnLabelData)
						}, success(response) {
							parentEl.removeClass('let-me-import');
							buttonEl.parents('.rtsb-tb-button-wrapper').find('.rtsb-tb-loader').remove();
							buttonEl.parents('.template-builder-popups').find('#page_id').attr('value', response.post_id);
							buttonEl.parents('.template-builder-popups').addClass('saved-template');
							buttonEl.parents('.template-builder-popups').find('.rtsb-tb-edit-button-wrapper a').attr('href', response.post_edit_url);
							buttonEl.parents('.template-builder-popups').find('.rtsb-tb-edit-button-wrapper a').html(response.edit_btn_text);
							buttonEl.parents('.template-builder-popups').find('#rtsb_tb_button').attr('disabled', 'disabled');
							buttonEl.parents('.template-builder-popups').find('.rtsb-modal-close').attr('data-save', 'saved');
							buttonEl.parents('.layout-container').removeClass('importing').addClass('import-done');
							buttonEl.parents('.layout-container').find('.rtsb-import-layout').attr('disabled', 'disabled');
							buttonEl.parents('.rtsb-tb-button-wrapper').removeClass('active');
							if (buttonEl.parent('.rtsb-tb-button-wrapper').hasClass('save-button')) {
								buttonEl.text('Save');
							}
							btnLabel.text("Done!");
							buttonEl.addClass('success');
						}, error(err) {
							console.log(err);
							parentEl.removeClass('let-me-import');
							buttonEl.parents('.layout-container').removeClass('importing');
						},
					});
				}
			});
		},

		switch: () => {
			$('body.post-type-rtsb_builder').on('click', 'td.column-set_default .rtsb-switch-wrapper', function (e) {
				e.preventDefault();
				const _self = $(this);
				const is_checked = _self
					.find('.rtsb_set_default:checked')
					.val();
				const page_id = _self.find('.rtsb_set_default').val();
				let type = _self.find('.rtsb_template_type').data('template_type');

				const specific_product = _self.find('.specific-product').data('specific_product');

				const specific_category = _self.find('.specific-category').data('specific_category');

				let type_selector = type;

				if (specific_product && specific_product.length) {
					type_selector = 'template-' + page_id + '-specific-products'
				}

				if (specific_category && specific_category.length) {
					type_selector = 'template-' + page_id + '-specific-category'
				}

				const selector_name = '.page-type-' + type_selector;

				$('body')
					.find(selector_name)
					.each(function () {
						$(this).find('.rtsb_set_default').prop('checked', false);
					});
				_self.find('.rtsb-loader').addClass('rtsb-slider-loading');
				const data = {
					action: 'rtsb_default_template', page_id: page_id, set_default_page_id: !is_checked ? page_id : 0, specific_product: specific_product, template_type: type ? type : null, __rtsb_wpnonce: rtsbParams.__rtsb_wpnonce,
				};

				$.ajax({
					url: rtsbParams.ajaxurl, data, type: 'POST', success(response) {
						if (response.success && parseInt(response.data.post_id)) {
							_self
								.find('.rtsb_set_default')
								.prop('checked', true);
						}
						_self
							.find('.rtsb-loader')
							.removeClass('rtsb-slider-loading');
					}, error(e) {
						console.log(e);
					},
				});
			});
		},

		disableButton: () => {
			$('body').on('change input', '.template-builder-popups .rtsb-field', function () {
				$('body').find('.rtsb-import-layout').removeAttr('disabled');
				$('body')
					.find('.template-builder-popups')
					.removeClass('saved-template');
			});
		},

		detectTemplateChange: () => {
			$('body.post-type-rtsb_builder').on('change', '#rtsb_tb_template_type, #rtsb_tb_template_edit_with', function (e) {
				e.preventDefault();
				$(document).trigger('rtsb.Builder.Modal.Change');
			});
		},

		modalAction: () => {
			rtsbBuilderBackend.modal();
			rtsbBuilderBackend.closeModal();
			rtsbBuilderBackend.detectTemplateChange();
			rtsbBuilderBackend.onModalChange();
		},

		buttonsAction: () => {
			rtsbBuilderBackend.button();
			rtsbBuilderBackend.switch();
			rtsbBuilderBackend.disableButton();
		},
	};
}(jQuery));
