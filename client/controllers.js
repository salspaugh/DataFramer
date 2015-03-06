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
angular.module('dataFramer').controller('QuestionIndexController', ['$scope',
'$state',
function($scope, $state){
    $scope.checkState = function(name){
        return $state.current.name == name;
    }
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
'$state', '$window', '$stateParams', '$meteorSubscribe', '$meteorCollection', '$meteorObject',
function($scope, $state, $window, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject){

    $meteorSubscribe.subscribe('datasets', $stateParams.datasetId).then(function(sub){
        $scope.$emit('datasetReady');
        $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
    });
        
    $meteorSubscribe.subscribe('columns', $stateParams.datasetId)
    .then(function(sub){
        $scope.columns = $meteorCollection(function(){
            return Columns.find({dataset_id: $stateParams.datasetId}, {sort: {datatypeIdx: 1, name: 1}});
        });
        $scope.$emit('colsReady');
        $scope.chartsReady = true;
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
