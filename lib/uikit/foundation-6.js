/**
 * Foundation 6 api for yamvish
 */

var Babelute = require('babelute');
require('../html');
Babelute.extendLexic('html', 'foundation');

module.exports = function(firstDegree) {
	var h = firstDegree ? Babelute.firstDegreeInitializer('foundation') : Babelute.initializer('foundation');
	Babelute.toLexic('foundation', {
		iconButton: function(icon, content) {
			return this.button(h.class('icon-button').faicon(icon), content);
		},
		// basical button
		simpleButton: function(content, type, templ) {
			return this.button(
				h.if(type, h.class(type))
				.class('button'),
				content, templ
			);
		},
		// hollow button
		hollowButton: function(content, type, templ) {
			return this.button(
				h.if(type, h.class(type))
				.class('button')
				.class('hollow'),
				content, templ
			);
		},
		// anchor button
		aButton: function(href, content, type, templ) {
			return this.a(href,
				h.if(type, h.class(type))
				.class('button'),
				content,
				templ
			);
		},
		aHollowButton: function(href, content, type, templ) {
			return this.a(href,
				h.if(type, h.class(type))
				.class('button')
				.class('hollow'),
				content,
				templ
			);
		},
		// close button : for closing action : templ = h.data('close') || h.click(...)
		closeButton: function(templ) {
			return this.button(
				h.class('close-button')
				.attr('aria-label', 'Close alert')
				.attr('type', 'button')
				.span(h.attr('aria-hidden', 'true'), '\u00D7'),
				templ
			);
		},
		// button group
		buttonGroup: function(buttons) {
			return this.div(h.class('button-group'), buttons);
		},
		smallButtonGroup: function(buttons) {
			return this.div(
				h.class('small')
				.class('button-group'),
				buttons
			);
		},
		/**
		 * MISC
		 */
		faicon: function(type, templ) {
			return this.tag('i', [h.class('fa')
				.class('fa-' + type), templ
			]);
		},
		icon: function(type) {
			return this.tag('i', [h.class('fi-' + type)]);
		},
		badge: function(text, type) {
			return this.span(h.class('badge').if(type, h.class(type)), text);
		},
		coloredLabel: function(text, type) {
			return this.span(h.class('label').if(type, h.class(type)), text);
		},

		/**
		 * HELPERS
		 */

		tooltip: function(title, text, opt) {
			opt = opt || {};
			return this.span(
				h.class('has-tip')
				.if(opt.top, h.class('top'))
				.data('tooltip')
				.if(opt.noClickOpen, h.data('clickOpen', false))
				.attr('aria-haspopup', true)
				.data('disableHover', false)
				.attr('tabindex', '1')
				.attr('title', title)
				.onDom(function(node) {
					new Foundation.Tooltip($(node), {});
				}),
				text
			);
		},
		// breadcrumb: function(label, elements) {
		// 	return this
		// 		.nav(h.attr('aria-label', label)
		// 			.attr('role', 'navigation')
		// 			.ul(
		// 				h.class('breadcrumbs')
		// 				.li(h.a('#', 'Home'))
		// 				.li(h.a('#', 'Features'))
		// 				.li(h.class('disabled'), 'Gene Splicing')
		// 				.li(
		// 					h.span(h.class('show-for-sr'), 'Current: '),
		// 					' Cloning'
		// 				)
		// 			)
		// 		);
		// },

		/********************************
		 ****************** FORM ********
		 ********************************/

		switchButton: function(name, text) {
			return this.div(
				h.class('switch')
				.input('checkbox', '',
					h.id(name)
					.class('show-for-sr')
					.attr('name', name)
				)
				.tag('label',
					h.class('switch-paddle')
					.attr('for', name)
					.span(
						h.class('show-for-sr')
						.text(text)
					)
				)
			);
		},
		radioSwitch: function(groupName, text) {
			return this.div(
				h.class('switch')
				.input('radio', '',
					h.id(name)
					.attr('name', groupName)
				)
				.tag('label',
					h.class('switch-paddle')
					.attr('for', name)
					.span(
						h.class('show-for-sr'),
						text
					)
				)
			);
		},
		fieldSet: function(legend, content) {
			return this.tag('fieldset',
				h.class('fieldset')
				.tag('legend', legend),
				content
			);
		},
		helpText: function(targetId, text) {
			return this.p(
				h.class('help-text')
				.attr('id', targetId),
				text
			);
		},
		radio: function(opt) {
			opt.id = opt.id || opt.name + opt.value;
			return this
				.input('radio', opt.value,
					h.attr('name', opt.name)
					.attr('id', opt.id)
					.if(opt.required, h.attr('required', ''))
				)
				.label(
					h.attr('for', opt.id),
					opt.text || opt.value
				);
		},
		checkbox: function(id, value, text) {
			return this.input('checkbox', value, h.attr('id', id))
				.label(h.attr('for', id), text);
		},
		inlineLabelInputRow: function(opt) {
			return this.div(
				h.class('row')
				.div(
					h.class('small-3')
					.class('columns')
					.label(
						h.class('text-right')
						.class('middle')
						.attr('for', opt.id),
						opt.label
					)
				)
				.div(
					h.class('small-9')
					.class('columns')
					.input('text', opt.value,
						h.attr('id', opt.id)
						.if(opt.placeholder, h.attr('placeholder', opt.placeholder))
					)
				)
			);
		},
		inputField: function(opts) {
			return this.div(
				h.class('input-field')
				.if(opts.icon,
					h.label(
						h.attr('for', opts.id)
						.icon(opts.icon)
					)
				)
				.input(opts.type || 'text', (typeof opts.val !== 'undefined') ? opts.val : '{{ ' + opts.path + ' }}',
					h.attr('id', opts.id)
					.attr('placeholder', opts.placeholder)
					.attr('required', opts.required)
					.if(opts.icon, h.class('labeled'))
				)
				.div(
					h.visible('{{ $error.' + opts.path + ' }}')
					.class('formfield-error')
					.text('{{ $error.' + opts.path + '.detail }}')
				)
			);
		},
		/**
		 * an input-group with coloredLabel-input-button
		 * @param  {Object} opt { label:String|Template, value:*, required:Bool(false by def), placeholder:String, buttonText:String|Template }
		 * @return {Template}     chainable
		 */
		inlineColoredLabelInputButton: function(opt) {
			return this
				.div(
					h.class('input-group')
					.span(h.class('input-group-label'), opt.label)
					.input(opt.type || 'text', opt.value || '',
						h.class('input-group-field')
						.id(opt.id)
						.if(opt.required, h.prop('required', true))
						.if(opt.placeholder, h.attr('placeholder', opt.placeholder))
					)
					.div(
						// warning : foundation 6.2.4 button height issue that has been corrected in develop branch for the moment
						// see : https://github.com/zurb/foundation-sites/pull/9308/files
						h.class('input-group-button')
						.primaryButton(opt.buttonText || 'Submit')
					)
				);
		},
		inlineColoredLabelInput: function(opt) {
			return this
				.div(
					h.class('input-group')
					.span(h.class('input-group-label'), opt.label)
					.input(opt.type || 'text', opt.value || '',
						h.class('input-group-field')
						.id(opt.id)
						.if(opt.required, h.prop('required', true))
						.if(opt.placeholder, h.attr('placeholder', opt.placeholder))
					)
				);
		},
		fileUploadButton: function(id, text, handler) {
			return this
				.label(
					h.class('button')
					.attr('for', id),
					text
				)
				.input('file', '',
					h.class('show-for-sr')
					.attr('name', 'photo')
					.id(id)
					.on('change', handler)
				);
		},

		/**
		 * THUMBNAILS
		 */
		background: function(url, backgroundSize) {
			backgroundSize = backgroundSize || 'cover';
			return this.style('background', 'url(' + url + ') no-repeat center center')
				.style('backgroundSize', backgroundSize);
		},
		thumbnail: function(src, alt, templ) {
			return this.img(src,
				h.class('thumbnail')
				.attr('alt', alt ||  'image with no alternate text'),
				templ
			);
		},
		roundedThumbnail: function(src, alt, templ) {
			return this.img(src,
				h.class('thumbnail')
				.class('rounded')
				.attr('alt', alt ||  'image with no alternate text'),
				templ
			);
		},
		/**
		 * NAV
		 */

		// subNav: function(title, label) {
		// 	return this.ul(
		// 		h.class("sub-nav")
		// 		.class("menu")
		// 		.attr("role", "navigation")
		// 		// label title
		// 		.attr("title", label)
		// 		// title
		// 		.li(h.class("sub-nav-title"), title)
		// 		// children
		// 		.li(
		// 			h.class("active")
		// 			.span(
		// 				h.class("show-for-sr"),
		// 				"You're viewing "
		// 			)
		// 			.a(h.prop("href"), "All")
		// 		)
		// 		.li(h.a(h.attr("href", "#"), "Active"))
		// 		.li(h.a(h.attr("href", "#"), "Pending"))
		// 		.li(h.a(h.attr("href", "#"), "Suspended"))
		// 	);
		// },

		multiLevelAccordionMenu: function(children) {
			return this.div(
				h.class('multi-level-accordion-menu')
				.ul(
					h.class('accordion-menu')
					.data('accordionMenu', true)
					.class('vertical'),
					children,
					h.onDom(function(node) {
						new Foundation.AccordionMenu($(node), {});
					})
				)
			);
		},

		multiLevelAccordionSubMenu: function(name, depth, children) {
			return this.li(
				h.a('#', name)
				.ul(
					h.class('menu')
					.class('vertical')
					.class('sublevel-' + depth),
					children
				)
			);
		},
		multiLevelAccordionMenuLeaf: function(href, content) {
			return this.li(
				h.a(href,
					h.class('subitem'),
					content
				)
			);
		},
		testAccordionMenu: function() {
			return this.multiLevelAccordionMenu(
				h.multiLevelAccordionMenuLeaf('#', 'hello root 1')
				.multiLevelAccordionSubMenu('Item 1', 1,
					h.multiLevelAccordionMenuLeaf('#', 'hello world')
					.multiLevelAccordionSubMenu('Item 1.2', 2,
						h.multiLevelAccordionMenuLeaf('#', 'hello world 1')
						.multiLevelAccordionMenuLeaf('#', 'hello world 2')
						.multiLevelAccordionMenuLeaf('#', 'hello world 3')
					)
				)
				.multiLevelAccordionSubMenu('Item 2', 1,
					h.multiLevelAccordionMenuLeaf('#', 'hello bloupi')
					.multiLevelAccordionMenuLeaf('#', 'hello bloupi 2')
					.multiLevelAccordionSubMenu('Item 2.2', 2,
						h.multiLevelAccordionMenuLeaf('#', 'hello foo 1')
						.multiLevelAccordionMenuLeaf('#', 'hello foo 2')
						.multiLevelAccordionMenuLeaf('#', 'hello foo 3')
					)
				)
			);
		},
		dropDownMenu: function(items) {
			return this.ul(
				h.class('dropdown')
				.class('menu')
				.data('dropdownMenu')
				._each(items, function(lexem) {
					if (lexem.name === 'tag')
						this.li(new Babelute(lexem));
					else
						this.use(lexem);
				})
			)
		},
		dropDownPane: function(content) {
			return this.div(
				h.class('dropdown-pane')
				.data('dropdown')
				.data('autoFocus', true)
				.onDom(function(node) {
					setTimeout(function() {
						new Foundation.Dropdown($(node), {});
					}, 0);
				}),
				content
			);
		},
		/***********************************
		 *************** CARDS *************
		 ***********************************/

		productCard: function(title, price, imgSrc, details) {
			return this.div(
				h.class('product-card')
				.class('item-wrapper')
				.div(
					h.class('img-wrapper')
					.a('#',
						h.class('button')
						.class('expand')
						.class('add-to-cart'),
						'Add to Cart'
					)
					.a('#', h.img(imgSrc))
				)
				.a('#', h.h(3, title))
				.h(5, price)
				.p(details)
			)
		},

		/***********************************
		 *************** CONTAINERS ********
		 ***********************************/
		topBar: function(contentLeft, contentRight) {
			return this.div(
				h.class('top-bar')
				.div(
					h.class('top-bar-left'),
					contentLeft
				)
				.div(
					h.class('top-bar-right'),
					contentRight
				)
			);
		},
		offCanvas: function(leftMenuContent, content, rightMenuContent) {
			return this.div(
				h.class('off-canvas-wrapper')
				.div(
					h.class('off-canvas-wrapper-inner')
					.data('offCanvasWrapper')
					.if(leftMenuContent,
						h.div(
							h.class('off-canvas')
							.class('position-left')
							.attr('id', 'offCanvas')
							.data('offCanvas', true)
							.closeButton(h.data('close')),
							leftMenuContent
						))
					.div(
						h.class('off-canvas')
						.class('position-right')
						.attr('id', 'offCanvasRight')
						.data('offCanvas', true)
						.data('position', 'right'),
						content
					)
					.if(rightMenuContent,
						h.div(
							h.class('off-canvas-content')
							.data('offCanvasContent', true)
							.closeButton(h.data('close')),
							rightMenuContent
						))
				)
			);
		},
		overlayPanel: function(opt) {
			return this.agoraView(opt.name, h.div(
				h.class('overlay-panel')
				.if(!opt.noBackground, h.overlayPanelBackground(opt.backgroundOpacity, opt.closeOnBackgroundClick)),
				opt.content
			));
		},
		overlayPanelBackground: function(opacity, closeOnBackgroundClick) {
			return this.div(
				h.class('overlay-panel-background')
				.use('transition:fade', {
					max: opacity || 0.5,
					ms: 200
				}).if(closeOnBackgroundClick, h.click(function(e) {
					e.targetContainer.unmount(true);
				}))
			);
		},
		sidePanel: function(opt) {
			return this.overlayPanel({
				name: opt.name,
				closeOnBackgroundClick: true,
				content: h.div(
					h.class('side-panel')
					.class('side-panel--' + opt.side)
					.if(opt.side === 'left' || opt.side === 'right',
						yamvish('transition').slideLeft({
							max: opt.width || '300px',
							delay: opt.delay || 0,
							ms: opt.ms || 350
						}),
						yamvish('transition').slideUp({
							max: opt.height || '300px',
							delay: opt.delay || 0,
							ms: opt.ms || 350
						})
					)
					.div(
						h.class('side-panel-content')
						.if(opt.side === 'left' || opt.side === 'right',
							h.css('width', opt.width),
							h.css('height', opt.height)
						),
						opt.content
					)
					.closeButton(h.click(function(e) {
						e.targetContainer.unmount(true);
					}))
				)
			});
		},

		/***********************************
		 ************** DIALOGS ************
		 ***********************************/

		callout: function(type, closable, content) {
			return this.container(
				h.div(
					h.class('callout')
					.class(type)
					.if(closable,
						h.closeButton(h.click(function(e) {
							e.targetContainer.unmount(true);
						}))
					),
					content
				)
			);
		},
		dialog: function(type, templ, close) {
			return this.div(
				h.class('dialog')
				.class(type) // if "type" is attrMap : catch inner prop
				.if(close, h.closeButton(close)),
				templ
			);
		},

		/***********************************
		 *********** DIALOGS PANEL *********
		 ***********************************/

		confirmPanel: function() {
			return this.overlayPanel({
				name: 'dialog:confirm',
				content: h.toMethods({
						validate: function(e) {
							e.preventDefault();
							e.targetContainer.unmount(true);
							this.data.callback(true);
						},
						cancel: function(e) {
							e.preventDefault();
							e.targetContainer.unmount(true);
							this.data.callback(false);
						}
					})
					.class('confirm-panel')
					.warningDialog(
						h.h(3, '{{ title }}')
						.p('{{ message }}')
						.use('transition:fade', {
							ms: 200
						})
						.div(
							h.class('dialog-buttons-container')
							.warningButton(h.click('validate'), '\u2713')
							.alertButton(h.click('cancel'), '\u00D7')
						)
					)
			});
		},
		alertPanel: function() {
			return this.overlayPanel({
				name: 'dialog:alert',
				closeOnBackgroundClick: true,
				content: h
					.toMethods('hide', function(e) {
						e.preventDefault();
						e.targetContainer.unmount(true);
					})
					.class('alert-panel')
					.alertDialog(
						h.h(3, '{{ title }}')
						.p('{{ message }}')
						.use('transition:fade', {
							ms: 200
						})
						.div(
							h.class('dialog-buttons-container')
							.alertButton(h.click('hide'), '\u2713')
						),
						h.click('hide')
					)
			});
		},
		// uikit modal :
		uikitModal: function(name, content) {
			return this.overlayPanel({
				name: name,
				closeOnBackgroundClick: true,
				content: h
					.toMethods('hide', function(e) {
						e.preventDefault();
						e.targetContainer.unmount(true);
					})
					.class('uik-modal')
					.dialog('uik-modal-dialog',
						h.use('transition:fade', {
							ms: 200
						})
						.use(content),
						h.click('hide')
					)
			});
		}
	});

	var coloredAPI = {};
	['primary', 'secondary', 'success', 'alert', 'warning']
	.forEach(function(color) {
		coloredAPI[color + 'Dialog'] = function(templ, close) {
			return this.dialog(color, templ, close);
		};
		coloredAPI[color + 'Callout'] = function(closable, content) {
			return this.callout(color, closable, content);
		};
		coloredAPI[color + 'Button'] = function(content, templ) {
			return this.simpleButton(content, color, templ);
		};
		coloredAPI[color + 'AButton'] = function(href, content, templ) {
			return this.aButton(href, content, color, templ);
		};
		coloredAPI[color + 'AHollowButton'] = function(href, content, templ) {
			return this.aHollowButton(href, content, color, templ);
		};
		coloredAPI[color + 'HollowButton'] = function(content, templ) {
			return this.hollowButton(content, color, templ)
		};
		coloredAPI[color + 'Badge'] = function(text) {
			return this.badge(text, color);
		};
		coloredAPI[color + 'Label'] = function(text) {
			return this.coloredLabel(text, color)
		};
	});

	Babelute.toLexic('foundation', coloredAPI);
};