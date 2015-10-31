'use strict';
module.exports = angular.module('TestApp.main-view', [])
.config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    template: require('./templates/mainview.html'),
                    controller: 'MainViewController as vm'
                });
        })
.controller('MainViewController',require('./controllers/mainview.js'));