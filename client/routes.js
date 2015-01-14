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
                "sidebar@": {
                    template: UiRouter.template('vars-list'),
                    controller: 'VarsController',
                },
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

angular.module('data_qs').controller('DatasetsController', ['$scope',
  '$state', '$collection', '$subscribe',
  function($scope, $state, $collection, $subscribe){
    $scope.subReady = false;

    $subscribe.subscribe('datasets').then(function(sub){
        $collection(Datasets, {}, {fields: {name: 1}})
            .bind($scope, 'datasets', false, 'datasets');
        $scope.subReady = true;
    });

    $scope.checkState = function(name){
        return $state.current.name == name;
    }

    $('[data-toggle="tooltip"]').tooltip();

}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$collection',
    '$stateParams', '$state', '$window', '$subscribe',
    function($scope, $collection, $stateParams, $state, $window, $subscribe){
        $scope.subReady = false;

        $subscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $collection(Columns, {dataset_id: $stateParams.datasetId},
                {fields: {name: 1, set: 1, datatype: 1}}
            )
            .bind($scope, 'columns');
            $scope.subReady = true;

            $scope.datatypes = _.uniq(_.pluck($scope.columns,
                'datatype'), false);

            $scope.colActive = function(col){
                if ($state.current.name != "dataset.question"){
                    return false;
                }

                var i = _.indexOf($scope.columns, col);

                if ($scope.question){
                    if (_.contains($scope.question.col_refs, i)){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });

        $subscribe.subscribe('datasets', $stateParams.datasetId)
        .then(function(sub){
            $collection(Datasets).bindOne($scope, 'dataset',
                {_id: $stateParams.datasetId}, true);

            $scope.question = _.findWhere($scope.dataset.questions,
                {'id': $state.params.questionId});

            $scope.varClick = function(col){
                if ($state.current.name == "dataset.question") {
                    // add to question's colrefs

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

                } else if ($state.current.name == "dataset") {
                    // scroll to that variable in the overview
                    var i = _.indexOf($scope.columns, col);
                    $window.scroll(0,$('#col-'+i).offset().top);


                }
            };
        });


        $scope.checkState = function(name){
            return $state.current.name == name;
        };


        $('[data-toggle="tooltip"]').tooltip();


    }
]);

angular.module('data_qs').controller('QsController', ['$scope', '$collection', '$stateParams',
    '$state', '$subscribe',
    function($scope, $collection, $stateParams, $state, $subscribe){
        $scope.qsReady = false;

        $subscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
            $collection(Datasets)
                .bindOne($scope, 'dataset', $stateParams.datasetId, true);

            $scope.qsReady = true;

            $scope.addQuestion = function(text){
                var new_question = {
                    "id": new Mongo.ObjectID().valueOf(),
                    "text": text.$modelValue,
                    "notes": null,
                    "answerable": null,
                    "col_refs": [],
                };

                $scope.dataset.questions.push(new_question);
            };

            $scope.answerable = function(q_id){
                switch (_.findWhere($scope.dataset.questions, {id: q_id}).answerable) {
                    case true:
                        return "ans true";
                    case false:
                        return "ans false";
                    default:
                        return "ans unknown";
                }
            };

            $scope.answerableIcon = function(q_id){
                switch (_.findWhere($scope.dataset.questions, {id: q_id}).answerable) {
                    case true:
                        return "fa-check";
                    case false:
                        return "fa-close";
                    default:
                        return "fa-question";
                }
            };

            $scope.changeType = function(col, type){
                col.datatype = type;
                // will trigger a re-render
            };

            $scope.checkState = function(name){
                return $state.current.name == name;
            };
        });

        $subscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $collection(Columns).bind($scope, 'columns');
        });

    }]);





angular.module('data_qs').controller('QuestController', ['$scope', '$collection', '$stateParams',
    '$state',
    function($scope, $collection, $stateParams, $state){
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

                    $scope.changeType = function(col, type){
                        col.datatype = type;
                        // will trigger a re-render
                    }

                    $scope.remove = function(col){
                        var i = _.indexOf(val.columns, col);
                        $scope.question.col_refs = _.without($scope.question.col_refs, i);
                    }
                }
            }
        });

        $scope.checkState = function(name){
            return $state.current.name == name;
        };
    }
]);




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
