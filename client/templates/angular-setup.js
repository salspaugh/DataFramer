angular.module('data_qs',['angular-meteor', 'ui.router']);

Meteor.startup(function () {
  angular.bootstrap(document, ['data_qs']);
});

angular.module('data_qs').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                "sidebar": {
                    template: UiRouter.template('datasets-list'),
                    controller: 'DatasetsController',
                }
            },
        })
        .state('dataset', {
            url: '/dataset/:datasetId',
            // really just a placeholder; needs views
            views: {
                "sidebar": {
                    template: UiRouter.template('vars-list'),
                    controller: 'VarsController',
                },
                "main": {
                    template: UiRouter.template('questions-list'),
                    
                }
            }
        })
        ;

}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection', '$stateParams',
  function($scope, $collection, $stateParams){
    $collection(Datasets).bind($scope, 'datasets', true, true);
    $scope.datasetId = $stateParams.datasetId;

}]);

angular.module('data_qs').controller('DatasetsController', ['$scope', '$collection',
function($scope, $collection){
    $collection(Datasets).bind($scope, 'datasets', true, true);
}]);
