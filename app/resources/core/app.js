'use strict';

// Defining Angular app model with all other dependent modules
var App = angular.module('App', ['ngRoute', 'ng-token-auth']);

App.constant("Api", 'http://api.zueirafc.com/api/v1');

App.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'components/views/home.html',
        controller: 'HomeController'
    }).when('/login', {
        templateUrl: 'components/views/login.html',
        controller: 'LoginController'
    }).when('/registro', {
        templateUrl: 'components/views/register.html',
        controller: 'RegisterController'
    }).when('/perfil', {
        templateUrl: 'components/views/perfil.html',
        controller: 'PerfilController'
    }).when('/admin/approvals', {
        templateUrl: 'components/views/admin/approvals.html',
        controller: 'ApprovalController'
    }).otherwise({
        templateUrl: 'components/views/404.html'
    });
});

App.config(function($authProvider, Api) {
  $authProvider.configure({
      apiUrl: Api
  });
});

App.config(function($routeProvider, $locationProvider, $httpProvider) {
	// $routeProvider.otherwise({ redirectTo: '/'});

	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});
