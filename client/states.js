angular.module('dataFramer')
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
        function($urlRouterProvider, $stateProvider, $locationProvider){
            $locationProvider.html5Mode(true);

            $stateProvider
                .state('landing', {
                    url: '/',
                    templateUrl: 'client/templates/landing.tpl',
                    controller: 'LandingPageController'
                })
                .state('demo', {
                    url: '/demo',
                    templateUrl: 'client/templates/demo.tpl',
                    controller: 'DemoPlaceholderController'
                })
                .state('demo.datasets', {
                    url: '/datasets',
                    views: {
                        navBar: {
                            templateUrl: 'client/templates/nav-bar.tpl',
                            controller: 'NavBarController'
                        },
                        // In this state, all the navigation elements should be disabled
                        main: {
                            templateUrl: 'client/templates/dataset-index.tpl',
                            controller: 'DatasetIndexController'
                        }
                    },
                })
                .state('demo.dataset', {
                    url: '/dataset/:datasetId',
                    views: {
                        // This will be inherited by all the other dataset.x states
                        navBar: {
                            templateUrl: 'client/templates/nav-bar.tpl',
                            controller: 'NavBarController'
                        }
                    }
                })
                .state('demo.dataset.questionIndex', {
                    url: '/questions',
                    views: {
                        // The list of questions - separate from charts
                        'main@demo': {
                            templateUrl: 'client/templates/question-index.tpl',
                            controller: 'QuestionIndexController'
                        }
                    }
                })
                .state('demo.dataset.questionSingle', {
                    url: '/questions/:questionId',
                    views: {
                        // A single question view
                        'main@demo': {
                            templateUrl: 'client/templates/question-single.tpl',
                            controller: 'QuestionSingleController'
                        }
                    }
                })
                .state('demo.dataset.charts', {
                    url: '/charts',
                    views: {
                        // All the charts
                        "main@demo": {
                            templateUrl: 'client/templates/charts.tpl',
                            controller: 'ChartsController'
                        }
                    }
                })

    }])
;
