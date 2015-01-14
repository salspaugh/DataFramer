angular.module('data_qs').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
function($urlRouterProvider, $stateProvider, $locationProvider){
    // debugger;
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                "sidebar": {
                    templateUrl: 'client/templates/datasets-list.tpl',
                    controller: 'DatasetsController',
                }
            },
        })
        .state('dataset', {
            url: '/dataset/:datasetId',
            views: {
                "sidebar": {
                    templateUrl: 'client/templates/vars-list.tpl',
                    controller: 'VarsController',
                },
                "main": {
                    templateUrl: 'client/templates/questions-list.tpl',
                    controller: 'QsController',
                }
            }
        })
        .state('dataset.question', {
            url: '/question/:questionId',
            views: {
                "sidebar@": {
                    templateUrl: 'client/templates/vars-list.tpl',
                    controller: 'VarsController',
                },
                "main@": {
                    controller: 'QuestController',
                    templateUrl: 'client/templates/question-single.tpl'
                }
            }
        })
        .state('home.upload', {
            url: 'upload',
            views: {
                "main@": {
                    templateUrl: 'client/templates/upload.tpl',
                    controller: 'UploadController'
                }
            }
        })
        ;

}]);

angular.module('data_qs').controller('DatasetsController', ['$scope',
  '$state', '$meteorCollection', '$meteorSubscribe',
  function($scope, $state, $meteorCollection, $meteorSubscribe){
    $scope.subReady = false;

    $meteorSubscribe.subscribe('datasets').then(function(sub){
        $scope.datasets = $meteorCollection(function(){
            return Datasets.find({}, {fields: {name: 1}});
        })
        $scope.subReady = true;
    });

    $scope.checkState = function(name){
        return $state.current.name == name;
    }

    $('[data-toggle="tooltip"]').tooltip();

}]);

angular.module('data_qs').controller('VarsController', ['$scope', '$meteorCollection',
    '$stateParams', '$state', '$window', '$meteorSubscribe', '$meteorObject',
    function($scope, $meteorCollection, $stateParams, $state, $window, $meteorSubscribe, $meteorObject){
        $scope.subReady = false;

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $scope.columns = $meteorCollection(function(){
                return Columns.find({dataset_id: $stateParams.datasetId},
                    {fields: {name: 1, set: 1, datatype: 1}})
            })
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

        $meteorSubscribe.subscribe('datasets', $stateParams.datasetId)
        .then(function(sub){
            $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);

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

angular.module('data_qs').controller('QsController', ['$scope', '$stateParams',
    '$state', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
    function($scope, $stateParams, $state, $meteorSubscribe, $meteorCollection, $meteorObject){
        $scope.qsReady = false;

        $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
            $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
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

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $scope.columns = $meteorCollection(function(){
                return Columns.find({dataset_id: $stateParams.datasetId})
            });
        });

    }]);





angular.module('data_qs').controller('QuestController', ['$scope',
    '$meteorCollection', '$stateParams', '$meteorSubscribe', '$state', '$meteorObject',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe, $state, $meteorObject){
        $meteorSubscribe.subscribe('dataset', $stateParams.datasetId)
            .then(function(sub){
                $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);

                $scope.question = _.findWhere($scope.dataset.questions,
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

            });

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
            .then(function(sub){

                // TODO: this
                // var q = $scope.getReactively('question');
                // if (q.col_refs != undefined) {
                //     $collection(Columns, {_id: {$in: q.col_refs}})
                //     .bind($scope, 'columns');
                //
                //     $scope.datatypes = _.uniq(_.pluck($scope.columns,
                //         'datatype'), false);
                // }

            });

        // sometimes the binding executes before meteor is fully initialized;
        // the bindOne parameters are not all reactive. this should fix that
        // https://github.com/Urigo/angular-meteor/issues/60
        $scope.$watch('dataset', function(val){
            if (val) {
                if (val.questions && val.columns) {







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
