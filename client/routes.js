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
                    templateUrl: 'client/templates/dataset-overview.tpl',
                    controller: 'DatasetController',
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
    '$stateParams', '$state', '$window', '$meteorSubscribe', '$meteorObject', '$rootScope',
    function($scope, $meteorCollection, $stateParams, $state, $window, $meteorSubscribe, $meteorObject, $rootScope){
        // TODO: use events from work area to signal loading
        $scope.subReady = false;

        $rootScope.$on('colsReady', function(){
            $scope.columns = $meteorCollection(function(){
                return Columns.find({dataset_id: $stateParams.datasetId},
                {fields: {name: 1, set: 1, datatype: 1}})
            })

            $scope.datatypes = _.uniq(_.pluck($scope.columns,
                'datatype'), false);
            $scope.subReady = true;
        });

        $scope.colActive = function(col){
            if ($state.current.name != "dataset.question"){
                return false;
            }

            if ($scope.question){
                if (_.contains($scope.question.col_refs, col._id)){
                    return true;
                } else {
                    return false;
                }
            }
        }

        $rootScope.$on('datasetReady', function(){
            $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
            $scope.question = _.findWhere($scope.dataset.questions,
            {'_id': $state.params.questionId});
        })

        $rootScope.$on('questionsReady', function(){
            if ($stateParams.questionId) {
                $scope.questions = $meteorCollection(Questions, {_id:$stateParams.questionId});
                $scope.question = $meteorObject(Questions, $stateParams.questionId);
            } else {
                $scope.questions = $meteorCollection(Questions, {dataset_id:$stateParams.datasetId});
            }
        })

        $scope.varClick = function(col){
            if ($state.current.name == "dataset.question") {
                // add to question's colrefs
                var _id = col._id;
                if (_.contains($scope.question.col_refs, _id)) {
                    // toggle off
                    $scope.question.col_refs = _.without($scope.question.col_refs, _id);
                } else {
                    // toggle on
                    $scope.question.col_refs.push(_id);
                }
                // update the collection
                $scope.question.save();
                $scope.$emit('columnToggle');

            } else if ($state.current.name == "dataset") {
                // scroll to that variable in the overview
                $window.scroll(0,$('#'+col._id).offset().top);
            }
        };

        $scope.checkState = function(name){
            return $state.current.name == name;
        };


        $('[data-toggle="tooltip"]').tooltip();


    }
]);

angular.module('data_qs').controller('DatasetController', ['$scope', '$stateParams',
    '$state', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
    function($scope, $stateParams, $state, $meteorSubscribe, $meteorCollection, $meteorObject){
        $scope.chartsReady = false;

        $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
            $scope.$emit('datasetReady');
            $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);

        });

        $meteorSubscribe.subscribe('questions', $stateParams.datasetId)
        .then(function(sub){
            $scope.$emit('questionsReady');
            $scope.questions = $meteorCollection(function(){
                return Questions.find({dataset_id: $stateParams.datasetId});
            })
            $scope.addQuestion = function(text){
                var new_question = {
                    "dataset_id": $stateParams.datasetId,
                    "text": text.$modelValue,
                    "notes": null,
                    "answerable": null,
                    "col_refs": [],
                };

                $scope.questions.push(new_question);
            };

            $scope.answerable = function(q_id){
                switch (_.findWhere($scope.questions, {_id: q_id}).answerable) {
                    case true:
                        return "ans true";
                    case false:
                        return "ans false";
                    default:
                        return "ans unknown";
                }
            };

            $scope.answerableIcon = function(q_id){
                switch (_.findWhere($scope.questions, {_id: q_id}).answerable) {
                    case true:
                        return "fa-check";
                        break;
                    case false:
                        return "fa-close";
                        break;
                    default:
                        return "fa-question";
                        break;
                }
            };
        });

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $scope.columns = $meteorCollection(function(){
                return Columns.find({dataset_id: $stateParams.datasetId})
            });
            // TODO: event after they're all rendered?
            $scope.$emit('colsReady');
            $scope.chartsReady = true;
        });

        $scope.checkState = function(name){
            return $state.current.name == name;
        };

        $scope.changeType = changeType;

    }]);

angular.module('data_qs').controller('QuestController', ['$scope',
    '$meteorCollection', '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe, $state, $meteorObject, $rootScope, $meteorUtils){

        $meteorSubscribe.subscribe('questions', $stateParams.datasetId, $stateParams.questionId)
        .then(function(sub){
            $scope.$emit('questionsReady');
            $scope.questions = $meteorCollection(Questions, {_id:$stateParams.questionId});
            $scope.question = $meteorObject(Questions, $stateParams.questionId);

            $scope.isSet = function(ans_value){
                // if answerable state isn't set, fade the button
                if ($scope.question.answerable != ans_value) {
                    return "fade";
                }
            };

            $scope.setAns = function(ans_value){
                $scope.question.answerable = ans_value;
                // TODO: this probably doesn't work
            };

            $scope.remove = function(col){
                $scope.question.col_refs = _.without($scope.question.col_refs, col._id);
                $scope.question.save();
                $scope.columns = $meteorCollection(function(){
                    return Columns.find({_id: {$in: $scope.question.col_refs}});
                });
            }

        });


        $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
        .then(function(sub){
            $scope.$emit('colsReady');
            $scope.columns = $meteorCollection(function(){
                return Columns.find({_id: {$in: $scope.question.col_refs}});
            });
            $scope.datatypes = _.uniq(_.pluck($scope.columns,
                'datatype'), false);
        });

        $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
            $scope.$emit('datasetReady');            
        });

        $rootScope.$on('columnToggle', function(){
            $scope.question.reset();
            $scope.columns = $meteorCollection(function(){
                return Columns.find({_id: {$in: $scope.question.col_refs}});
            });

        })

        $scope.checkState = function(name){
            return $state.current.name == name;
        };

        $scope.changeType = changeType;
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

// helper function: DRY datatype change
function changeType(col, type){
    col.datatype = type;
    switch (type) {
        case "string":
            col = processString(col);
            this.$parent.renderChart(col);
            break;
        case "date":
            col = processDate(col);
            this.$parent.renderChart(col);
            break;
        case "float":
            col = processFloat(col);
            this.$parent.renderChart(col);
            break;
        case "integer":
            col = processInt(col);
            this.$parent.renderChart(col);
            break;
        default:
            break;
        }
}
