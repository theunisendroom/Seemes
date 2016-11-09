'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

.controller('AdminLoginCtrl', ['$rootScope', '$scope', '$location', '$cookies', 'AuthService','$log','flashMessageService',
      function($rootScope, $scope, $location, $cookies, AuthService, $log, flashMessageService) {
        $scope.credentials = {
          username: '',
          password: ''
        };
        $scope.login = function(credentials) {
          AuthService.login(credentials).then(
            function(res, err) {
              $cookies.put("loggedInUser", res.data);
              $rootScope.$broadcast('USER_STATE_CHANGE');
              $location.path('/admin/pages');
            },
            function(err) {
              flashMessageService.setMessage(err.data);
              $log.log(err);              
            });
          };
      }
  ])

.controller('AdminPagesCtrl', ['$scope', '$log', 'pagesFactory', '$cookies',
   function($scope, $log, pagesFactory, $cookies) {
      pagesFactory.getPages().then(
	      function(response) {
	    	$scope.loggedInUser = $cookies.get("loggedInUser");
	        $scope.allPages = response.data;
	      },
	      function(err) {
	        $log.error(err);
	      }
	  );
      
      $scope.deletePage = function(id) {
        pagesFactory.deletePage(id);
      };
   }
])

.controller('AddEditPageCtrl', ['$scope', '$log', 'pagesFactory', '$routeParams', '$location', 'flashMessageService','$filter', function($scope, $log, pagesFactory, $routeParams, $location, flashMessageService, $filter) {
        $scope.pageContent = {};
        $scope.pageContent._id = $routeParams.id;
        $scope.heading = "Add a New Page";

        if ($scope.pageContent._id !== 0) {
          $scope.heading = "Update Page";
          pagesFactory.getAdminPageContent($scope.pageContent._id).then(
              function(response) {
                $scope.pageContent = response.data;
                $log.info($scope.pageContent);
              },
              function(err) {
                $log.error(err);
              });
        }

        $scope.savePage = function() {
          pagesFactory.savePage($scope.pageContent).then(
            function() {
              flashMessageService.setMessage("Page Saved Successfully");
              $location.path('/admin/pages');
            },
            function() {
              $log.error('error saving data');
            }
          );
        };

        $scope.updateURL=function(){
        	$scope.pageContent.url=$filter('formatURL')($scope.pageContent.title);
        }
        
        $scope.tinymceOptions = {
		    plugins: 'fullscreen link image imagetools code hr textcolor colorpicker table',
		    toolbar: 'fullscreen forecolor backcolor | undo redo | bold italic | alignleft aligncenter alignright | code table',
		    imagetools_cors_hosts: ['localhost'],
        };
    }
])

.controller('AppCtrl', ['$rootScope', '$scope','AuthService','flashMessageService','$location', '$cookies',function($rootScope, $scope,AuthService,flashMessageService,$location, $cookies) {
        
		$scope.site = {
            logo: "img/angcms-logo.png",
            footer: "Copyright 2016 See-M-es"
        };
		
		$scope.loggedInUser = $cookies.get("loggedInUser");
        
        $scope.logout = function() {
		  AuthService.logout().then(
		    function() {
		      $cookies.remove('loggedInUser');
		      $rootScope.$broadcast('USER_STATE_CHANGE');
		      $location.path('/admin/login');
		      $scope.onLoginScreen = true;
		      flashMessageService.setMessage("Successfully logged out");
	
		    }, function(err) {
		        console.log('there was an error trying to logout');
		    });
		};
		
		$scope.login = function() {
			$scope.onLoginScreen = true;
			 $location.path('/admin/login');
		};
		
		$scope.$on('$routeChangeStart', function(next, current) { 
			$rootScope.$broadcast('REFRESH_NAV_LINKS');
		 });
}])

.controller('PageCtrl',  [ '$scope','pagesFactory', '$routeParams', '$sce', function($scope, pagesFactory, $routeParams, $sce) {
    var url = $routeParams.url;
    pagesFactory.getPageContent(url).then(
      function(response) {
    	  $scope.pageContent = {};
          $scope.pageContent.title = response.data.title;
          $scope.pageContent.content = $sce.trustAsHtml(response.data.content);
      }, function() {
        console.log('error fetching data');
      });
}])

.controller('AddEditUserCtrl', ['$scope', '$log', 'usersFactory', '$routeParams', '$location', 'flashMessageService','$filter', function($scope, $log, usersFactory, $routeParams, $location, flashMessageService, $filter) {
	
	$scope.addingUser = false;
	$scope.newUser;
	
	$scope.deleteUser = function(user){
		//delete user
		usersFactory.deleteUser(user._id).then(
			function(response){
				flashMessageService.setMessage("User " + user.username + " delete user.");
			},
			function(err){
				flashMessageService.setMessage("Unable to delete user.");
				$log.error(err);
			}
		);
		
		$scope.refreshUser();
	};
	
	$scope.refreshUser = function(){
		//reload users
		usersFactory.getUsers().then(
			function(response){
				$scope.allUsers = response.data;
	    },
	    	function(err){
	    		$log.error(err);
	    });
	};
	
	$scope.saveUser = function(){
		usersFactory.addUser($scope.newUser).then(
			function(response){
				$scope.newUser = [];
				$scope.addingUser = false;
				flashMessageService.setMessage("User " + response.data.username + " created.");
			},
			function(err){
				flashMessageService.setMessage("Unable to create user.");
				$log.error(err);
			}
		);
		
		$scope.refreshUser();
	};
	
	$scope.refreshUser();
}]);
