angular.module('dataFramer').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: '/',
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
        .state('dataset', {
            url: '/dataset/:datasetId',
            views: {
                // This will be inherited by all the other dataset.x states
                navBar: {
                    templateUrl: 'client/templates/nav-bar.tpl',
                    controller: 'NavBarController'
                }
            }
        })
        .state('dataset.questionIndex', {
            url: '/questions',
            views: {
                // The list of questions - separate from charts
                'main@': {
                    templateUrl: 'client/templates/question-index.tpl',
                    controller: 'QuestionIndexController'
                }
            }
        })
        .state('dataset.questionSingle', {
            url: '/questions/:questionId',
            views: {
                // A single question view
                'main@': {
                    templateUrl: 'client/templates/question-single.tpl',
                    controller: 'QuestionSingleController'
                }
            }
        })
        .state('dataset.charts', {
            url: '/charts',
            views: {
                // All the charts
                "main@": {
                    templateUrl: 'client/templates/charts.tpl',
                    controller: 'ChartsController'
                }
            }
        })

}]);
