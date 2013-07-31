(function(ng, window, document) {
	'use strict';
	ng.module('hc').factory('animationProvider', function() {
		/*var testData = {
			basic: [
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 50,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 80,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 90,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 100,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 110,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 120,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 110,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 100,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 90,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 80,
        fill: 'r(0.5, 1)#fff-#000'
      },
      {
        type: 'circle',
        cx: center.x,
        cy: center.y,
        r: 70,
        fill: 'r(0.5, 1)#fff-#000'
      }
    ]
		}
		*/
		
		/**
		 * Simple function throttle implementations to improve animation on mousemove
		 * @param {Number} delay - number of miliseconds to throttle on
		 * @param {Function} callback - throttled function
		 */
		function throttle(delay, callback) {
			var lastInvocation = 0,
				_id;
	
			return function() {
				var that = this,
					dt 	 = Date.now() - lastInvocation,
					args = arguments;
	
				function call() {
					lastInvocation = Date.now();
					callback.apply(that, args);
				}
	
				_id && clearTimeout(_id);
	
				if (dt > delay) {
					call();
				}
				else {
					_id = setTimeout(call, delay - dt);
				}
			}
		}
		
		/**
		 * Returns offset object for provided HTMLElement
		 * @param {HTMLElement} elem 
		 */
		function getOffset(elem) {
			var obj = elem.getBoundingClientRect();
			return {
				left : obj.left + document.body.scrollLeft,
				top : obj.top + document.body.scrollTop,
				width : obj.width,
				height : obj.height
			};
		}
		
		function getMarginTop(elem) {
			return parseInt(window.getComputedStyle(elem).getPropertyValue('margin-top'), 10);
		}
		
		var AnimationFactory = function(options) {
			//configure factory
			this._uid = 0;
		};
		
		ng.extend(AnimationFactory.prototype, {
			newInstance: function(container, options) {
				var instance;
				
				this._uid++;
				switch(options.animationType) {
					case 'svg':
						instance = new SvgAnimation(this._uid, options, container);
						break;
					default: 
						instance = new CssAnimation(this._uid, options, container);
				}
				
				return instance.init();
			}
		});
		
		/**
		 * CSS 
		 */
		function CssAnimation(uid, options, container)	 {
			this._uid = uid;
			this.options = options;
			this.container = container;
			this.objectParts = [];
		}
		
		ng.extend(CssAnimation.prototype, {
			_prepareCanvas: function() {
				var number = this.options.partsNumber,
					that = this,
					cursor;
				
				this.container.innerHTML = '';
				this.container.style.width = this.options.canvas.width + 'px';
				this.container.style.height = this.options.canvas.height + 'px';
				this.containerOffset = getOffset(this.container);

				cursor = document.createElement('div');
				cursor.className = 'cursor';
				cursor.id = 'cursor' + this._uid;
				this.cursor = new CentricObject(cursor);

				this.obj = document.createElement('div');
				this.obj.id = 'obj' + this._uid;
					
				while(number -= 1) {
					var part = document.createElement('div');
					part.className = 'part d-' + (number);
					this.obj.appendChild(part);
					this.objectParts.push(part);
				}
				
				this.container.appendChild(cursor);
				this.container.appendChild(this.obj);
				
				this.objectParts.reverse();
				this.objectParts.forEach(function(p, i) {
					that.objectParts[i] = (new CentricObject(p, {
						container: that.container,
						speed: that.options.speed
					})).setPosition(that.options.canvas.width * 0.5, that.options.canvas.height * 0.5);
				});
				
				return this;
			},
			_addListeners: function() {
				var that = this,
					throttledAnimation = throttle(40, function(relativeMouseX, relativeMouseY) {
						var that = this;
						this.objectParts.forEach(function(part, i) {
							setTimeout(function() {
								part.setPosition(relativeMouseX, relativeMouseY, true);			
							}, that.options.delay * (i + 1));
						});
					}),
					mousemoveHandler = function(e) {
						var relativeMouseX = e.pageX - that.containerOffset.left,
							relativeMouseY = e.pageY - that.containerOffset.top;
							
						that.cursor.setPosition(relativeMouseX, relativeMouseY);
						throttledAnimation.call(that, relativeMouseX, relativeMouseY);
					};
				
				container.removeEventListener('mousemove', mousemoveHandler);
				container.addEventListener('mousemove', mousemoveHandler);
				
				return this;
			},
			/*getRotateCssString: function(coordinates) {
				var resultCss = '';
				for (var i in coordinates) {
					if (coordinates.hasOwnProperty(i)) {
						resultCss += [resultCss.length ? ' ' : '',
										'rotate', i.toUpperCase(),
										'(', coordinates[i], 'deg)'].join('');
					}
				} 
				return resultCss;
			},*/
			init: function() {
				return this._prepareCanvas()._addListeners();
			}
		});
		
		/**
		 * CentricObject class describes the part of the view-object and provides api to move it and place on canvas
		 * 
		 * @param {Object} elem - HTMLElement reference of model part to wire it with api
		 * @param {Object} container - HTMLElement which contains all the parts
		 */
		function CentricObject(elem, options) {
			this.elem = elem;
			this.width = elem.offsetWidth;
			this.height = elem.offsetHeight;
			this.hWidth = this.width * 0.5;
			this.hHeight = this.height * 0.5;
			this.animationProperties = {};
			
			options && options.container && (this.containerOffset = getOffset(options.container));
			options && (this.speed = options.speed);
		};
		
		ng.extend(CentricObject.prototype, {
			setPosition: function(x, y, animate) {
				animate && this._calculateTransition(x, y);
				
				x -= this.hWidth;
				y -= this.hHeight;
				//this.elem.style.transform = 'translate('+ x + 'px, 0)';
				this.elem.style.left = x + 'px';
				this.elem.style.top = y + 'px';
				
				return this;
			},
			getPosition: function() {
				var offset = getOffset(this.elem);
				window.getComputedStyle(this.elem)
				return {
					x: offset.left - this.containerOffset.left + this.hWidth,
					y: offset.top - this.containerOffset.top + this.hHeight	- getMarginTop(this.elem)	
				};
			},
			_calculateTransition: function(x, y) {
				var pos = this.getPosition(),
					dx = x - pos.x,
					dy = y - pos.y,
					d = Math.pow(dx * dx + dy * dy, 0.5),
					dt = this.speed / d,	//[1/ms]
					xSpeed = dt * dx,		//[px/ms]
					ySpeed = dt * dy;
				
				this.elem.style.transition = 'left ' + dx / xSpeed + 'ms linear, top ' + dy / ySpeed + 'ms linear';
			}
		});
		
		/**
		 * @execuse-me {small code duplication}
		 */
		
		/**
		 * SVG 
		 */
		function SvgAnimation(uid, options, container) {
			console.log(uid)
			this.uid = uid;
			this.options = options;
			this.container = container;
			this.containerOffset = getOffset(container);
			this.paper = new Raphael(container, container.offsetWidth, container.offsetHeight);
			this.center = {
				x: this.options.canvas.width * 0.5,
				y: this.options.canvas.height * 0.5
			};
			this.objectParts = [];
		}
		ng.extend(SvgAnimation.prototype, {
			_prepareCanvas: function() {
				var that = this,
					len = this.options.partsNumber,
					i;
					
				for (i = 0; i < len; i++) {
					this.objectParts.push(new Part({
						index : i,
						paper : this.paper,
						speed: this.options.speed,
						config : {
					        type: 'circle',
					        cx: this.center.x,
					        cy: this.center.y,
					        r: 50 + (i % 10) * 20,
					        fill: 'r(0.5, 1)#fff-#000'
					      }
					}));
				}
				
				this.cursor = this.paper.add([{
					type: 'circle',
					cx: this.center.x,
					cy: this.center.y,
					r: 3,
					stroke: 'none',
					fill: '#369'
				}]).toBack(); 
				
				return this;
			},
			_addListeners: function() {
				var that = this,
					throttledSlide = throttle(40, function(relativeMouseX, relativeMouseY) {
						var that = this;
						this.objectParts.forEach(function(part, i) {
							setTimeout(function() {
								part.slideTo(relativeMouseX, relativeMouseY);
							}, (i + 1) * that.options.delay);
						});
					});
			  
				this.container.addEventListener('mousemove', function(e) {
					var relativeMouseX = e.pageX - that.containerOffset.left,
						relativeMouseY = e.pageY - that.containerOffset.top;
						
					that.cursor.attr({
						cx: relativeMouseX,
						cy: relativeMouseY
					});

					throttledSlide.call(that, relativeMouseX, relativeMouseY);
				});

				return this;
			},
			init: function() {
				return this._prepareCanvas()._addListeners();
			}
		});
		
		function Part(options) {
			this.paper = options.paper;
			this.speed = options.speed;
			this.el = this.paper.add([options.config])[0].toBack();
		};

		ng.extend(Part.prototype, {
			_calculateTransition : function(x, y) {
				var dx = x - this.el.attr('cx'),
					dy = y - this.el.attr('cy'),
					d = Math.pow(dx * dx + dy * dy, 0.5),
					xSpeed = this.speed * dx / d,
					ySpeed = this.speed * dy / d;

				return {
					x: dx / xSpeed,
					y: dy / ySpeed
				};
			},
			slideTo : function(x, y) {
				var that = this,
					transitionTime = this._calculateTransition(x, y);

				this.el.stop();
				this.xAnimation = this.el.animate({cx: x}, transitionTime.x, 'linear');
				this.yAnimation = this.el.animate({cy: y}, transitionTime.y, 'linear');
			}
		});
		
		
		//public endpoint
		return function(container, options) {
			(new AnimationFactory()).newInstance(container, options);	
		};
	});
})(angular, this, document);
