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
                    controller: 'DatasetsController',
                },
                "main": {
                    template: UiRouter.template('questions-list'),
                    controller: 'VarsController',
                }
            }
        })
        .state('upload', {
            url: '/upload',
            views: {
                "main": {
                    template: UiRouter.template('upload'),
                    controller: 'UploadController'
                }
            }
        })
        ;

}]);

angular.module('data_qs').controller('DatasetsController', ['$scope', '$collection', '$stateParams',
  function($scope, $collection, $stateParams){
    $collection(Datasets).bind($scope, 'datasets', true, true);
    $scope.datasetId = $stateParams.datasetId;
    // $scope.new_qID = function() {
    //     $scope.qID = new Mongo.ObjectID();
    // }
}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection', '$stateParams',
    function($scope, $collection, $stateParams){
        $collection(Datasets).bindOne($scope, 'dataset', {_id: $stateParams.datasetId});
        $scope.datatypes = _.uniq(_.pluck($scope.dataset.columns, 'datatype'),
            false)
    }]);

angular.module('data_qs').controller('UploadController', ['$scope',
    function($scope){
        $scope.preprocess = function(event) {
            var files = event.target.files;
            for (var i = 0, ln = files.length; i < ln; i++) {
                var file = files[i];
                var reader = new FileReader();
                reader.onload = function(event) {
                    var contents = event.target.result;
                    Meteor.call('processCsv', contents, file.name);
                };

                reader.onerror = function(event) {
                    console.error("File could not be read! Code " + event.target.error.code);
                };

                reader.readAsText(file);

                // reset the upload form
                event.target.value = '';
            }
        }
    }
]);
