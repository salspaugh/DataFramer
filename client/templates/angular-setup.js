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
            views: {
                "sidebar": {
                    template: UiRouter.template('vars-list'),
                    controller: 'VarsController',
                },
                "main": {
                    template: UiRouter.template('questions-list'),
                    controller: 'QsController',
                }
            }
        })
        // .state('dataset.question', {
        //     url: '/question/:questionId',
        //     views: {
        //         "main": {
        //             controller: 'QuestController',
        //             template: UiRouter.template('question-single'),
        //         }
        //     }
        // })
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
    $collection(Datasets).bind($scope, 'datasets', true);
    $scope.datasetId = $stateParams.datasetId;
}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection', '$stateParams',
    function($scope, $collection, $stateParams){
        $collection(Datasets).bindOne($scope, 'dataset', $stateParams.datasetId, true, false);
        $scope.datasetId = $stateParams.datasetId;

        // sometimes the binding executes before meteor is fully initialized;
        // the bindOne parameters are not all reactive. this should fix that
        // https://github.com/Urigo/angular-meteor/issues/60
        $scope.$watch('dataset', function(val){
            if (val) {
                if (val.columns) {
                    $scope.datatypes = _.uniq(_.pluck(val.columns, 'datatype'),
                    false);
                }
            }
        });
    }
]);

angular.module('data_qs').controller('QsController', ['$scope', '$collection', '$stateParams',
    function($scope, $collection, $stateParams){
        $collection(Datasets).bindOne($scope, 'dataset', $stateParams.datasetId, true);
        $scope.addQuestion = function(text){
            var new_question = {
                "id": new Mongo.ObjectID(),
                "text": text.$modelValue,
                "notes": null,
                "answerable": null,
                "col_refs": [],
            }
            $scope.dataset.questions.push(new_question);
        }
    }]);

// angular.module('data_qs').controller('QuestController', ['$scope', '$collection', '$stateParams',
//     function($scope, $collection, $stateParams){
//         $collection(Datasets).bindOne($scope, 'dataset',
//             {_id: $stateParams.datasetId}, true);
//         // console.log($scope);
//         $scope.question = _.findWhere($scope.dataset.questions,
//             {'$$hashKey': $stateParams.questionId});
//
//     }
// ]);

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
