'use strict';
module.exports = angular.module('TestApp.main',[
		require('./main-view').name
	])
	.config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function(
            $stateProvider,
            $urlRouterProvider,
            $locationProvider
        ) {
            $urlRouterProvider.when('', '/home');
            // $urlRouterProvider.otherwise('/404');
        }
    ]);