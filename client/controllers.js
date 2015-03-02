// ***********************************
// ControlBarController
// ***********************************
angular.module('dataFramer').controller('ControlBarController', ['$scope',
function($scope){

}]);



// ***********************************
// DatasetIndexController
// see _OLD DatasetsController, UploadController
// ***********************************
angular.module('dataFramer').controller('DatasetIndexController', ['$scope',
'$meteorCollection', '$meteorSubscribe',
function($scope, $meteorCollection, $meteorSubscribe){
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
    
}]);



// ***********************************
// QuestionIndexController
// see _OLD DatasetController
// ***********************************
angular.module('dataFramer').controller('QuestionIndexController', ['$scope',
function($scope){

}]);



// ***********************************
// QuestionSingleController
// see _OLD VarsController (sidebar) and QuestController
// ***********************************
angular.module('dataFramer').controller('QuestionSingleController', ['$scope',
function($scope){

}]);



// ***********************************
// DistributionsController
// see _OLD VarsController (sidebar) and DatasetController
// ***********************************
angular.module('dataFramer').controller('DistributionsController', ['$scope',
function($scope){

}]);
