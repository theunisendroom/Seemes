'use strict';

/* Directives */


angular.module('myApp.directives', [])

.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

.directive('navBar', [
  function() {
	    return {
	      controller: function($scope, pagesFactory, $location) {
					    	
	    	  				$scope.setNavLinks = function(){
					        	var path = $location.path().substr(0, 6);
					        	if (path == "/admin") {
					        		if($location.path() == "/admin/login"){
					        			$scope.navLinks = [];
					        		}else{
					        			$scope.navLinks = [{
					        				title: 'Pages Management',
					        				url: 'admin/pages'
					        			}, {
					        				title: 'Users Management',
					        				url: 'admin/add-edit-user'
					        			}, ];
					        		}
					        	} else {
					        		pagesFactory.getPages().then(
				        				function(response) {
				        					$scope.navLinks = response.data;
				        				}, function() {
				        					
				        				});
					        	}
					        }
	    	  				
	    	  				$scope.$on('REFRESH_NAV_LINKS', function(){
	    	  					$scope.setNavLinks();
	    	  		    	})
					    	
					    	$scope.setNavLinks();
	        			},
	        templateUrl: 'partials/directives/nav.html'

	      };
	  }
	])

.directive('adminLogin', [
  function() {
    return {
      controller: function($scope, $cookies, $location) {
    	  
    	  if($location.path() == "/admin/login"){
    		  $scope.onLoginScreen = true;
    	  }
    	  
    	  var path = $location.path().substr(0, 6);
    	  if (path == "/admin") {
    		  $scope.currentRoleView = {id: "USER", switchUrl: "admin/pages", displayText: "Pages"};
    	  }else{
    		  $scope.currentRoleView = {id: "ADMIN", switchUrl: "pages", displayText: "Administration"};
    	  }
    	  
		  $scope.switchView = function(){
    		if($scope.currentRoleView.id == 'ADMIN'){
    			$scope.currentRoleView = {id: "USER", switchUrl: "admin/pages", displayText: "Pages"};
    		}else{
    			$scope.currentRoleView = {id: "ADMIN", switchUrl: "pages", displayText: "Administration"};
    		}
    		$location.path($scope.currentRoleView.switchUrl);
    	}
		  
    	$scope.$on('USER_STATE_CHANGE', function(){
    		$scope.loggedInUser = $cookies.get("loggedInUser");
    	})
      },
      templateUrl: 'partials/directives/admin-login.html'
    };
  }
]);
