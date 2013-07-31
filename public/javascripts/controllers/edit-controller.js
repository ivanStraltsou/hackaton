(function(ng, window) {
	var EditCtrl = function($scope, $location, optionsService) {
		this.$scope = $scope;
		this.$location = $location;
		this.optionsService = optionsService;
		
		$scope.options = optionsService.getProperties();
		$scope.$watch('options.animationType', function(current, old) {
			$scope.options.isCssAnimation = current === optionsService.constants.animationTypes.CSS;
		});
		
		$scope.runDemo = ng.bind(this, this.runDemo);
	};
	
	ng.extend(EditCtrl.prototype, {
		runDemo: function() {
			this.optionsService.setProperties(this.$scope.options);
			this.$location.path('/preview')
		}
	});
	
	ng.module('hc').controller('EditCtrl', EditCtrl);
})(angular, this);
