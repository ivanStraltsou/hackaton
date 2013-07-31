(function(ng, window) {
	var PreviewCtrl = function($scope, $location, optionsService, animationProvider) {
		this.$scope = $scope;

		$scope.options = optionsService.getProperties();
		
		setTimeout(function() {
			animationProvider(document.getElementById('container'), optionsService.getProperties($scope.options));
		}, 0);
	};
	
	ng.extend(PreviewCtrl.prototype, {
		
	});
	
	ng.module('hc').controller('PreviewCtrl', PreviewCtrl);
})(angular, this);
