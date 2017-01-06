/* 
 * GridManager with Babelute-html rendering
 * 
 * @usage
 * var gridManager = new CollectionManager({
 * 	limit:20,
 * 	uri:'document::...',
 * 	itemsContainer:$elem,
 * 	scrollerContainer:$elem2,
 * 	loadPage: function(uri, limit, skip) {
 * 		return ctx.waiting(yam.c3po.get(uri + '&filter[limit]=' + limit + '&filter[skip]=' + skip));
 * 	},
 * 	renderItem:function(item){
 * 		return h.myComponenent(item);
 * 	}
 * });
 * gridManager.on('updated', ...)
 * gridManager.on('destroyed', ...)
 * gridManager.updateItem(object);
 * gridManager.deleteItem(id);
 * gridManager.reset(gridManager.uri);
 */

var ReachEndListener = require('nomocas-webutils/lib/reach-end-listener'),
	Emitter = require('nomocas-utils/lib/emitter'),
	objectUtils = require('nomocas-utils/lib/object-utils'),
	babeluteDifEngine = require('babelute-html/lib/pragmatics/html-to-dom-diffing'); // dom diffing

function CollectionManager(opt) {
	this.pager = {
		limit: opt.limit || 20,
		skip: 0
	};
	this.pages = [];
	this.itemsContainer = opt.itemsContainer;
	this.scrollerContainer = opt.scrollerContainer ||  opt.itemsContainer;
	this.renderItem = opt.renderItem;
	this.loadPage = opt.loadPage;

	var gridManager = this;
	this.reachEndListener = new ReachEndListener({
		scrollerElement: this.scrollerContainer,
		delayBeforeReact: 300
	});
	this.reachEndListener.on('reachEnd', function() {
		gridManager.loadNextPage();
	});

	if (opt.domInit)
		opt.domInit(this);

	this.reset(opt.uri);
}

CollectionManager.prototype = new Emitter();

var proto = {
	renderItem: function(item) {
		// will be overrided
	},
	loadPage: function(uri, limit, skip) {
		// will be overriden
	},
	loadNextPage: function() {
		var self = this;
		this.pager.skip += this.pager.limit;
		this.loadPage(this.uri, this.pager.limit, this.pager.skip)
			.then(function(results) {
				if (!results.length) {
					console.log('GridManager : next page is empty', results)
					self.pager.skip -= self.pager.limit;
				} else
					self.appendPage(results);
			});
	},
	reset: function(newURI) {
		var self = this;
		this.pager.skip = 0;
		this.uri = newURI;
		this.loadPage(this.uri, this.pager.limit, this.pager.skip)
			.then(function(results) {
				if (!results.length) {
					self.pager.skip -= self.pager.limit;
					self.removePages();
					self.emit('updated');
				} else {
					if (self.pages.length) {
						self.removePages(true);
						self.updatePage(0, results);
					} else
						self.appendPage(results);
				}
			});
	},
	updateItem: function(item) {
		var updated = this.pages.some(function(page) {
			if (page.hasItem(item.id)) {
				page.updateItem(item);
				return true;
			}
		});
		if (updated)
			this.emit('updated');
	},
	deleteItem: function(itemId) {
		var updated = this.pages.some(function(page) {
			if (page.hasItem(itemId)) {
				page.deleteItem(itemId);
				return true;
			}
		});
		if (updated)
			this.emit('updated');
	},
	removePages: function(keepFirst) {
		var self = this,
			first;
		if (keepFirst)
			first = this.pages.shift();
		this.pages.forEach(function(page) {
			page.children.forEach(function(rendered) {
				babeluteDifEngine.remove(self.itemsContainer, rendered);
			});
		});
		this.pages = first ? [first] : [];
	},
	updatePage: function(index, results) {
		var page = this.pages[index],
			childIndex = 0,
			oldChildren = page.children,
			olen = oldChildren.length,
			self = this;
		page.keyMap = {};
		page.children = [];
		results.forEach(function(item) {
			var rendered = self.renderItem(item);
			page.children.push(rendered);
			babeluteDifEngine.$output(self.itemsContainer, rendered, oldChildren[childIndex++]);
			page.keyMap[item.id] = rendered;
		});
		if (childIndex < olen)
			for (; childIndex < olen; childIndex++)
				babeluteDifEngine.remove(self.itemsContainer, oldChildren[childIndex++]);
		this.emit('updated');
	},
	appendPage: function(results) {
		var self = this,
			page = {
				keyMap: {},
				children: [],
				hasItem: function(itemId) {
					return !!this.keyMap[itemId];
				},
				updateItem: function(item) {
					item = objectUtils.copy(item);
					babeluteDifEngine.$output(self.itemsContainer, self.renderItem(item), this.keyMap[item.id]);
				},
				deleteItem: function(itemId) {
					var rendered = this.keyMap[itemId];
					this.children = this.children.filter(function(child) {
						return child === rendered;
					});
					babeluteDifEngine.remove(self.itemsContainer, rendered);
					delete this.keyMap[itemId];
				}
			};
		this.pages.push(page);
		results.forEach(function(item, index) {
			var rendered = self.renderItem(item, index);
			page.keyMap[item.id] = rendered;
			babeluteDifEngine.render(self.itemsContainer, rendered);
			page.children.push(rendered);
		});
		this.emit('updated');
	},
	destroy: function() {
		this.reachEndListener.destroy();
		this.emit('destroyed');
	}
};

CollectionManager.constructor = CollectionManager;

for (var i in proto)
	CollectionManager.prototype[i] = proto[i];

module.exports = CollectionManager;