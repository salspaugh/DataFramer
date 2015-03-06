// ***********************************
// NavBarController
// ***********************************
angular.module('dataFramer').controller('NavBarController', ['$scope',
'$state', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject) {

    $scope.startPage = false;
    if ($state.current.name == 'start' || $state.current.name == 'dataset') {
        $scope.startPage = true;
    }

    $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
        $scope.$emit('datasetReady');
        $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
    });

}]);



// ***********************************
// DatasetIndexController
// see _OLD DatasetsController, UploadController
// ***********************************
angular.module('dataFramer').controller('DatasetIndexController', ['$scope',
'$state', '$meteorCollection', '$meteorSubscribe',
function($scope, $state, $meteorCollection, $meteorSubscribe){

    $scope.subReady = false;

    $meteorSubscribe.subscribe('datasets').then(function(sub){
        $scope.datasets = $meteorCollection(function(){
            return Datasets.find({}, {fields: {name: 1}, sort: {name: 1}});
        });

        $scope.deleteDataset = function(){
            Meteor.call('removeDataset', this.dataset._id);
        }

        $scope.subReady = true;
    });

    $scope.processCsv = function(event) {
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
    
    $scope.checkState = function(name){
        return $state.current.name == name;
    }
    
}]);



// ***********************************
// QuestionIndexController
// see _OLD DatasetController
// ***********************************

angular.module('dataFramer').controller('QuestionIndexController', ['$scope','$meteorCollection', 
    '$stateParams', '$meteorSubscribe', '$state', '$meteorObject', '$rootScope', '$meteorUtils',
    function($scope, $meteorCollection, $stateParams, $meteorSubscribe, 
        $state, $meteorObject, $rootScope, $meteorUtils){

        $scope.checkState = function(name){
            return $state.current.name == name;
        }

        $scope.$emit('questionsReady');
        $scope.questions = $meteorCollection(Questions, {_id:$stateParams.questionId});
        $scope.question = $meteorObject(Questions, $stateParams.questionId);

        $scope.varNames = function(){
            $scope.vars = $meteorCollection(function(){
                return Columns.find({_id: $scope.question.col_refs});
            });
        }

        $scope.isSet = function(ans_value){
            // if answerable state isn't set, fade the button
            if ($scope.question.answerable != ans_value) {
                return "fade";
            }
        };

        $scope.setAns = function(ans_value){
            $scope.question.answerable = ans_value;
        };

        $scope.remove = function(col){
            $scope.question.col_refs = _.without($scope.question.col_refs, col._id);
            $scope.question.save();
            $scope.columns = $meteorCollection(function(){
                return Columns.find({_id: {$in: $scope.question.col_refs}});
            });
        }

        $scope.addQuestion = function(text){
                var new_question = {
                    "dataset_id": $stateParams.datasetId,
                    "text": text.$modelValue,
                    "notes": null,
                    "answerable": null,
                    "col_refs": [],
                    "user_id": Meteor.userId()
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

            $scope.deleteQuestion = function(){
                Questions.remove(this.question._id);
            }
        

        $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
            $scope.$emit('datasetReady');
            $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
        });

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
    }
]);


// ***********************************
// QuestionSingleController
// see _OLD VarsController (sidebar) and QuestController
// ***********************************
angular.module('dataFramer').controller('QuestionSingleController', ['$scope',
'$state',
function($scope, $state){

}]);



// ***********************************
// ChartsController
// see _OLD VarsController (sidebar) and DatasetController
// ***********************************
angular.module('dataFramer').controller('ChartsController', ['$scope',
'$state',
function($scope, $state){
    $scope.checkState = function(name){
        return $state.current.name == name;
    }
}]);
