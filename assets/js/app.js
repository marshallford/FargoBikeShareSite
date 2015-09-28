angular = require('angular');
var app = angular.module('App', []);
app.controller('bikeShare', function($scope,$http,$timeout) {
  $scope.updating = false;
  $scope.getData = function(){
      $scope.updating = true;
      $http.get('http://localhost:9292/api/v1/all').
        success(function(data, status, headers, config) {
          $scope.data = data;
        }).
        error(function(data, status, headers, config) {
          // log error
        });
        $timeout(function(){
          $scope.updating = false;
        }, 300);
  };
  
  $scope.getData();
});
