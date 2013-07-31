(function(ng, window) {
	'use strict';
	
	var module = ng.module('hc', []).config(function($routeProvider, $locationProvider) {
		$locationProvider
			.html5Mode(true)
			.hashPrefix('!');
		
		$routeProvider
			.when('/', {
				templateUrl: 'views/home',
				controller: 'EditCtrl'
			})
			.when('/preview', {
				templateUrl: 'views/preview',
				controller: 'PreviewCtrl'
			})
			.otherwise({
				redirectTo : '/'
			});
	});
	
	module.controller('MainCtrl', function($scope, $location) {
		$scope.globalModel = {};
		
		$scope.$on('$viewContentLoaded', function() {
			var path = $location.path().substr(1) || 'Edit';
			$scope.globalModel.path = path;
			$scope.isPreview = path === 'preview';
		});
	});
	
	module.factory('optionsService', function() {
		var animationTypes = {
				CSS: 'css',
				SVG: 'svg'
			},
			styleTypes = {
				BASIC: 'basic',
				SHARK: 'shark'
			};
		
		var options = {
			partsNumber: 15,
			canvas: {
				width: 900,
				height: 600
			},
			speed: 0.5,
			delay: 40,
			styleType: styleTypes.SHARK,
			animationType: animationTypes.CSS
		};
		
		options.isCssAnimation = options.animationType === animationTypes.CSS;
		
		return {
			constants: {
				animationTypes: animationTypes,
				styleTypes: styleTypes
			},
			getProperties: function() {
				return options;
			},
			setProperties: function(newOptions) {
				ng.extend(options, newOptions);
				
				return this;
			}
		};
	});
	
})(angular, this);
