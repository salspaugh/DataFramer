var DATATYPE_LIST = ["string", "integer", "float", "date", "time"];
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

    $scope.subLoading = true;

    $meteorSubscribe.subscribe('datasets').then(function(sub){
        $scope.datasets = $meteorCollection(function(){
            return Datasets.find({}, {fields: {name: 1}, sort: {name: 1}});
        });

        $scope.deleteDataset = function(){
            Meteor.call('removeDataset', this.dataset._id);
        }

        $scope.subLoading = false;
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

        $scope.questionsLoading = true;

        $meteorSubscribe.subscribe('columns', $stateParams.datasetId);

        $meteorSubscribe.subscribe('questions', $stateParams.datasetId)
        .then(function(sub){
            $scope.questions = $meteorCollection(function(){
                return Questions.find({dataset_id:$stateParams.datasetId});
            });
            $scope.questionsLoading = false;
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

        $scope.editQuestion = function(event, q_id){
            var esc = event.which == 27,
                nl = event.which == 13,
                el = event.target,
                input = el.nodeName != 'INPUT' && el.nodeName != 'TEXTAREA'
                ;

            if (input) {
                if (esc) {
                  // restore state
                  document.execCommand('undo');
                  el.blur();
                } else if (nl) {
                    // are we editing the question or the notes?
                    if (el.classList.contains('question-card-text')) {
                        Questions.update({ _id: q_id }, { $set: { text: el.innerHTML} });
                    } else if (el.classList.contains('question-card-notes')) {
                        Questions.update({ _id: q_id }, { $set: { notes: el.innerHTML} });
                    }
                    el.blur();
                    event.preventDefault();
                }
            }
        }


}]);


// ***********************************
// QuestionSingleController
// see _OLD VarsController (sidebar) and QuestController
// ***********************************
angular.module('dataFramer').controller('QuestionSingleController', ['$scope',
'$meteorSubscribe', '$stateParams', '$meteorObject', '$meteorCollection', '$meteorUtils',
function($scope, $meteorSubscribe, $stateParams, $meteorObject, $meteorCollection, $meteorUtils){

    $scope.col_refs = [];

    $meteorSubscribe.subscribe('questions', $stateParams.datasetId, $stateParams.questionId)
    .then(function(sub){
        $scope.question = $meteorObject(Questions, $stateParams.questionId);

        // store this in the scope so we can get and save it reactively
        $scope.col_refs = $scope.question.col_refs;

        $scope.varClick = function(col_id){
            // toggle in scope's col_refs
            if (_.contains($scope.col_refs, col_id)) {
                // remove
                $scope.col_refs = _.without($scope.col_refs, col_id);
            } else {
                // add
                // NOTE: this is a dumb hack to make getReactively (below)
                // recognize the change to col_refs, which it doesn't do for
                // some reason if we just push to the array
                var newrefs = _.union($scope.col_refs, [col_id]);
                $scope.col_refs = newrefs;
            }
            // save to the question object
            $scope.question.col_refs = $scope.col_refs;
        }

        $scope.colActive = function(col_id){
            return _.contains($scope.col_refs, col_id);
        }

        $scope.setAns = function(ans_value){
            $scope.question.answerable = ans_value;
        };
    });

    $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
    .then(function(sub){
        $scope.columns = $meteorCollection(function(){
            return Columns.find({dataset_id: $stateParams.datasetId}, {sort: {datatypeIdx: 1, name: 1}});
        });
    });

    $scope.datatypes = DATATYPE_LIST;

    $scope.activeColumns = $meteorCollection(function(){
        // react to add/remove actions in the sidebar
        return Columns.find({_id: {$in: $scope.getReactively('col_refs')}}, {sort: {datatypeIdx: 1, name: 1}});
    });

}]);



// ***********************************
// ChartsController
// see _OLD VarsController (sidebar) and DatasetController
// ***********************************
angular.module('dataFramer').controller('ChartsController', ['$scope',
'$state', '$window', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $window, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject){

    $scope.chartsLoading = true;
    $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
        $scope.$emit('datasetReady');
        $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
    });

    $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
    .then(function(sub){
        $scope.columns = $meteorCollection(function(){
            return Columns.find({dataset_id: $stateParams.datasetId}, {sort: {datatypeIdx: 1, name: 1}});
        });
        $scope.chartsLoading = false;
    });

    $scope.datatypes = DATATYPE_LIST;

    $scope.checkState = function(name){
        return $state.current.name == name;
    }

    $scope.varClick = function(col){
       $window.scroll(0,$('#'+col._id).offset().top);
    };

    $scope.changeType = changeType;

}]);

function changeType(col, type){
    col.datatype = type;
    col.values = [];
    scope = this.$parent
    switch (type) {
        case "string":
            col = processString(col);
            scope.renderChart(scope);
            break;
        case "date":
            col = processDate(col);
            scope.renderChart(scope);
            break;
        case "float":
            col = processFloat(col);
            scope.renderChart(scope);
            break;
        case "integer":
            col = processInt(col);
            scope.renderChart(scope);
            break;
        case "time":
            col = processTime(col);
            scope.renderChart(scope);
            break;
        default:
            break;
        }
}
