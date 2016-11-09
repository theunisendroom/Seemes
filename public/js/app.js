'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.tinymce',
  'ngCookies',
  'message.flash'
])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
   $routeProvider.when('/admin/login', {
            templateUrl: 'partials/admin/login.html',
            controller: 'AdminLoginCtrl'
    });
    $routeProvider.when('/admin/pages', {
        templateUrl: 'partials/admin/pages.html',
        controller: 'AdminPagesCtrl'
    });
    $routeProvider.when('/admin/add-edit-page/:id', {
        templateUrl: 'partials/admin/add-edit-page.html',
        controller: 'AddEditPageCtrl'
    });
    $routeProvider.when('/:url', {
        templateUrl: 'partials/page.html',
        controller: 'PageCtrl'
    });
    $routeProvider.when('/admin/add-edit-user', {
        templateUrl: 'partials/admin/add-edit-user.html',
        controller: 'AddEditUserCtrl'
    });
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
  $locationProvider.html5Mode(true);
}])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('myHttpInterceptor');
});
