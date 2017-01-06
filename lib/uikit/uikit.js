var Babelute = require('babelute');
require('../html');
Babelute.extendLexic('html', 'uikit');

module.exports = function(firstDegree) {

	var h = firstDegree ? Babelute.firstDegreeInitializer('uikit') : Babelute.initializer('uikit');

	Babelute.toLexic('html', 'uikit', {

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
		}

	});
};