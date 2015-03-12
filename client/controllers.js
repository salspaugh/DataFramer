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

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId);

        $meteorSubscribe.subscribe('questions', $stateParams.datasetId)
        .then(function(sub){
            $scope.$emit('questionsReady');
            $scope.questions = $meteorCollection(function(){
                return Questions.find({dataset_id:$stateParams.datasetId});
            });
            $scope.question = $meteorObject(Questions, $stateParams.questionId);

            $scope.isSet = function(ans_value){
                // if answerable state isn't set, fade the button
                if ($scope.question.answerable != ans_value) {
                    return "fade";
                }
            };

            // $scope.setAns = function(ans_value){
            //     $scope.question.answerable = ans_value;
            //     // TODO: this probably doesn't work
            // };

            $scope.remove = function(col){
                alert("Are you sure you want to remove this question?");
                $scope.question.col_refs = _.without($scope.question.col_refs, col._id);
                $scope.question.save();
                $scope.columns = $meteorCollection(function(){
                    return Columns.find({_id: {$in: $scope.question.col_refs}});
                });
            }

        });

        $scope.sections = 
           [{'name': 'Keep', 'answerable': true },
            {'name': 'Undecided' , 'answerable': null },
            {'name': 'Reject', 'answerable': false }];

        $scope.getVarName = function(var_id) {
            return Columns.findOne(var_id).name;
        };

        // TODO: use this to set var labels to right datatype color
        $scope.getVarTypeColor = function(var_id) {
            return Columns.findOne(var_id).datatype;
        };

        $scope.checkState = function(name){
            return $state.current.name == name;
        };

        $scope.varNames = function(){
            $scope.vars = $meteorCollection(function(){
                return Columns.find({_id: {$in: $scope.question.col_refs}});
            });
        };

        $scope.isSet = function(ans_value){
            // if answerable state isn't set, fade the button
            if ($scope.question.answerable != ans_value) {
                return "fade";
            }
        };

        $scope.remove = function(col){
            $scope.question.col_refs = _.without($scope.question.col_refs, col._id);
            $scope.question.save();
            $scope.columns = $meteorCollection(function(){
                return Columns.find({_id: {$in: $scope.question.col_refs}});
            });
        };

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
        };

        $scope.setAns = function(ans_value){
            Questions.update({ _id: this.question._id }, { $set: { answerable: ans_value } });
        };

        $scope.clearField = function() {
            return ''
        }

        document.addEventListener('keydown', function (event) {
          var esc = event.which == 27,
              nl = event.which == 13,
              el = event.target,
              input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA'
              // data = {};

          if (input) {
            if (esc) {
              // restore state
              document.execCommand('undo');
              el.blur();
            } else if (nl) {

                //TODO: $scope seems to only save it in current veiw.. probably need to save text and notes separately
                Questions.update({ _id: $scope.question._id }, { $set: { text: el.innerHTML, notes: el.innerHTML } });

                el.blur();
                event.preventDefault();
            }
          }
        }, true);

}]);


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
