angular.module('data_qs',['angular-meteor', 'ui.router', 'd3']);

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
                    // template: UiRouter.template('charts'),
                    // controller: 'ChartsController',
                    template: UiRouter.template('questions-list'),
                    controller: 'QsController',
                }
            }
        })
        .state('dataset.question', {
            url: '/question/:questionId',
            views: {
                "main@": {
                    controller: 'QuestController',
                    template: UiRouter.template('question-single'),
                }
            }
        })
        .state('home.upload', {
            url: 'upload',
            views: {
                "main@": {
                    template: UiRouter.template('upload'),
                    controller: 'UploadController'
                }
            }
        })
        ;

}]);

angular.module('data_qs').controller('DatasetsController', ['$scope', '$collection',
  function($scope, $collection){
    $collection(Datasets, {}, {fields: {name: 1}}).bind($scope, 'datasets', true);
}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection', '$stateParams',
    '$state',
    function($scope, $collection, $stateParams, $state){
        $collection(Datasets).bindOne($scope, 'dataset',
            {_id: $stateParams.datasetId}, true);

        $scope.$watch('dataset', function(val){
            if (val) {
                if (val.columns) {

                    $scope.datatypes = _.uniq(_.pluck(val.columns,
                        'datatype'), false);
                }
                if (val.questions && val.columns) {
                    $scope.question = _.findWhere(val.questions,
                        {'id': $state.params.questionId});

                    $scope.varClick = function(col){
                        if ($state.current.name == "dataset.question") {
                            // add to question's colrefs

                            if ($scope.question){
                                var i = _.indexOf(val.columns, col),
                                col_refs = $scope.question.col_refs
                                ;

                                if (_.contains(col_refs, i)) {
                                    // toggle off
                                    $scope.question.col_refs = _.without(col_refs, i);
                                } else {
                                    // toggle on
                                    col_refs.push(i);
                                }
                            }

                        } else if ($state.current.name == "dataset") {
                            // don't really do anything at the moment
                        }
                    };

                    $scope.colActive = function(col){
                        var i = _.indexOf(val.columns, col);
                        // debugger;
                        if ($scope.question){
                            if (_.contains($scope.question.col_refs, i)){
                                return "active";
                            } else {
                                return "";
                            }
                        }
                    }
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
                "id": new Mongo.ObjectID().valueOf(),
                "text": text.$modelValue,
                "notes": null,
                "answerable": null,
                "col_refs": [],
            }
            $scope.dataset.questions.push(new_question);
        }
        $scope.answerable = function(q_id){
            switch (_.findWhere($scope.dataset.questions, {id: q_id}).answerable) {
                case true:
                    return "ans true";
                case false:
                    return "ans false";
                default:
                    return "ans unknown";
            }
        }
        $scope.answerableIcon = function(q_id){
            switch (_.findWhere($scope.dataset.questions, {id: q_id}).answerable) {
                case true:
                    return "fa-check";
                case false:
                    return "fa-close";
                default:
                    return "fa-question";
            }
        }
    }]);

angular.module('data_qs').controller('QuestController', ['$scope', '$collection', '$stateParams',
    function($scope, $collection, $stateParams){
        $collection(Datasets).bindOne($scope, 'dataset',
            {_id: $stateParams.datasetId}, true);

        // sometimes the binding executes before meteor is fully initialized;
        // the bindOne parameters are not all reactive. this should fix that
        // https://github.com/Urigo/angular-meteor/issues/60
        $scope.$watch('dataset', function(val){
            if (val) {
                if (val.questions && val.columns) {
                    $scope.question = _.findWhere(val.questions,
                        {'id': $stateParams.questionId});

                    $scope.isSet = function(ans_value){
                        // if answerable state isn't set, fade the button
                        if ($scope.question.answerable != ans_value) {
                            return "fade";
                        }
                    };

                    $scope.setAns = function(ans_value){
                        $scope.question.answerable = ans_value;
                    };

                    $scope.datatypes = _.uniq(_.pluck(val.columns,
                        'datatype'), false);

                    $scope.columns = _.compact(_.map(val.columns, function(v,i){
                        if (_.contains($scope.question.col_refs, i)){
                            return v;
                        }
                    }));
                }
            }
        });




    }
]);

angular.module('data_qs').controller('ChartsController', ['$scope', '$collection', '$stateParams',
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
