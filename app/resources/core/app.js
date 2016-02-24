'use strict';

// Defining Angular app model with all other dependent modules
var App = angular.module('App', ['ngRoute', 'ngResource', 'ng-token-auth']);

App.constant("Api", 'http://localhost:3000/api/v1');
// App.constant("Api", 'http://api.zueirafc.com/api/v1');

App.config(function ($routeProvider) {

    // normal paths
    $routeProvider.when('/', {
        templateUrl: 'components/views/home.html',
        controller: 'HomeController'
    }).when('/perfil', {
        templateUrl: 'components/views/perfil.html',
        controller: 'PerfilController'
    });

    // auth paths
    $routeProvider.when('/login', {
        templateUrl: 'components/views/login.html',
        controller: 'LoginController'
    }).when('/registro', {
        templateUrl: 'components/views/register.html',
        controller: 'RegisterController'
    }).when('/last-step', {
        templateUrl: 'components/views/complete-profile.html',
        controller: 'CompleteProfileController'
    });

    $routeProvider.when('/approvals', {
        templateUrl: 'components/views/admin/approvals.html',
        controller: 'ApprovalsController'
    });

    $routeProvider.otherwise({
        templateUrl: 'components/views/404.html'
    });
});

App.run(function($http) {
  // process.env.API_AUTH_TOKEN
  $http.defaults.headers.common.Authorization = 'Token token=5da9ba35945eaa739ff25784a556b48b126108e208a34c5bc2662506fd90fab6';
});

App.config(function($authProvider, Api) {
  $authProvider.configure({
      apiUrl: Api
  });
});

App.config(function($routeProvider, $locationProvider, $httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

App.directive('previewUpload', function (){
  return {
    restrict: 'A',
    link: function ($scope, elem, attrs) {
      var reader = new FileReader();
      reader.onload = function (e) {
          $scope.image = e.target.result;
          $scope.$apply();
      }

      elem.on('change', function() {
          reader.readAsDataURL(elem[0].files[0]);
      });
    }
  }
});
