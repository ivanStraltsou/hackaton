function runAnimation(options) {
	var DELAY_MS = options.delay,
		PARTS_NUMBER = options.partsNumber,
		SPEED_PX_MS = options.speed;
	
	var container 	= document.getElementById('container'),
		obj 		= document.getElementById('obj'),
		cCursor 	= new CentricObject(document.getElementById('cursor')),
		cParts 		= [];

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
	
	function prepareCanvas() {
		var number = PARTS_NUMBER,
			fragment = document.createDocumentFragment();
		
		container.style.width = options.canvas.width + 'px';
		container.style.height = options.canvas.height + 'px';
		obj.innerHTML = '';
			
		while(number -= 1) {
			var part = document.createElement('div');
			part.className = 'part d-' + (number);
			fragment.appendChild(part);
			cParts.push(part);
		}
		
		obj.appendChild(fragment);
		cParts.reverse();
		cParts.forEach(function(p, i) {
			cParts[i] = (new CentricObject(p, container)).setPosition(options.canvas.width * 0.5, options.canvas.height * 0.5);
		});
	}
	
	function getOffset(elem) {
		var obj = elem.getBoundingClientRect();
		return {
			left : obj.left + document.body.scrollLeft,
			top : obj.top + document.body.scrollTop,
			width : obj.width,
			height : obj.height
		};
	}
	
	function addListeners() {
		var throttledAnimation = throttle(40, function(relativeMouseX, relativeMouseY) {
				cParts.forEach(function(cPart, i) {
					var delay = DELAY_MS * (i + 1);
					
					setTimeout(function() {
						cPart.setPosition(relativeMouseX, relativeMouseY, true);			
					}, delay);
				});
			}),
			moveHandler = function(e) {
				var offset = getOffset(container),
					relativeMouseX = e.pageX - offset.left,
					relativeMouseY = e.pageY - offset.top;
					
				cCursor.setPosition(relativeMouseX, relativeMouseY);
				throttledAnimation(relativeMouseX, relativeMouseY);
			};
		
		container.removeEventListener('mousemove', moveHandler);
		container.addEventListener('mousemove', moveHandler);
	}
	
	function getRotateCssString(coordinates) {
		var resultCss = '';
		for (var i in coordinates) {
			if (coordinates.hasOwnProperty(i)) {
				resultCss += [resultCss.length ? ' ' : '',
								'rotate', i.toUpperCase(),
								'(', coordinates[i], 'deg)'].join('');
			}
		} 
		return resultCss;
	}
	
	/**
	 * CentricObject class describes the part of the view-object and provides api to move it and place on canvas
	 * 
	 * @param {Object} elem - HTMLElement reference of model part to wire it with api
	 * @param {Object} container - HTMLElement which contains all the parts
	 */
	function CentricObject(elem, container) {
		this.elem = elem;
		container && (this.containerOffset = getOffset(container));
		this.width = elem.offsetWidth;
		this.height = elem.offsetHeight;
		this.hWidth = this.width * 0.5;
		this.hHeight = this.height * 0.5;
		this.animationProperties = {};
	};
	
	CentricObject.MAX_DEG = 50;
	
	CentricObject.prototype.setPosition = function(x, y, animate) {
		animate && this._calculateTransition(x, y);
		
		x -= this.hWidth;
		y -= this.hHeight;
		//this.elem.style.transform = 'translate('+ x + 'px, 0)';
		this.elem.style.left = x + 'px';
		this.elem.style.top = y + 'px';
		
		return this;
	};
	CentricObject.prototype.getPosition = function() {
		var offset = getOffset(this.elem);
		return {
			x: offset.left - this.containerOffset.left + this.hWidth,
			y: offset.top - this.containerOffset.top + this.hHeight			
		};
	};
	CentricObject.prototype._calculateTransition = function(x, y) {
		var pos = this.getPosition(),
			dx = x - pos.x,
			dy = y - pos.y,
			d = Math.pow(dx * dx + dy * dy, 0.5),
			dt = SPEED_PX_MS / d;//[1/ms]

		xSpeed = dt * dx;//[px/ms]
		ySpeed = dt * dy;
		/*
		this.elem.style.webkitTransform = 'translateZ(0) ' + getRotateCssString({
					x: 50 * (dy >= 0 ? 1 : -1), y: 50 * (dx >= 0 ? 1 : -1)
				});*/
		
		this.elem.style.transition = 'left ' + dx / xSpeed + 'ms linear, top ' + dy / ySpeed + 'ms linear';
	};
	
	//ACTION
	prepareCanvas();
	addListeners();
}
