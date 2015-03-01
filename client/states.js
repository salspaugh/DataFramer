angular.module('dataFramer').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){
    // debugger;
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('start', {
            url: '/',
            views: {
                controlBar: {
                    templateUrl: 'client/templates/control-bar.tpl',
                    controller: 'ControlBarController'
                },
                // in this state, all the navigation elements should be disabled
                main: {
                    templateUrl: 'client/templates/dataset-index.tpl',
                    controller: 'DatasetIndexController'
                }
            },
        })
        .state('dataset', {
            url: '/dataset/:datasetId',
            views: {
                // this will be inherited by all the other dataset.x states
                controlBar: {
                    templateUrl: 'client/templates/control-bar.tpl',
                    controller: 'ControlBarController'
                }
            }
        })
        .state('dataset.questionIndex', {
            url: '/questions',
            views: {
                // the list of questions - separate from charts
                main: {
                    templateUrl: 'client/templates/question-index.tpl',
                    controller: 'QuestionIndexController'
                }
            }
        })
        .state('dataset.questionSingle', {
            url: '/questions/:questionId',
            views: {
                // a single question view - not that different than before
                main: {
                    templateUrl: 'client/templates/question-single.tpl',
                    controller: 'QuestionSingleController'
                }
            }
        })
        .state('dataset.distributions', {
            url: '/distributions',
            views: {
                // all the charts, like before
                main: {
                    templateUrl: 'client/templates/distributions.tpl',
                    controller: 'DistributionsController'
                }
            }
        })
        ;

}]);
