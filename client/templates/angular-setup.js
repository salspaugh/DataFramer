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


            // template: UiRouter.template('datasets.html'),
            // controller: 'VarsController',
            // name: 'sidebar'
        })
        ;

}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection',
  function($scope, $collection){
    $collection(Datasets).bind($scope, 'datasets', true, true);
}]);

angular.module('data_qs').controller('DatasetsController', ['$scope', '$collection',
function($scope, $collection){
    $collection(Datasets).bind($scope, 'datasets', true, true);
}]);
