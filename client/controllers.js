var DATATYPE_LIST = ["string", "integer", "float", "date", "time"];
var DATATYPE_SORT_IDX = {
  "string": 0,
  "integer": 1,
  "float": 2,
  "date": 3,
  "time": 4
};



// ***********************************
// NavBarController
// ***********************************
angular.module("dataFramer").controller("NavBarController", 
["$scope", "$state", "$stateParams", "$meteorSubscribe", "$meteorCollection", "$meteorObject",
function($scope, $state, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject) {

  $scope.startPage = false;
  if ($state.current.name == "start" || $state.current.name == "dataset") {
    $scope.startPage = true;
  }

  $meteorSubscribe.subscribe("datasets", $stateParams.datasetId).then(function(sub) {
    $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
  });

  $scope.checkState = function(name) {
    return $state.current.name == name;
  }

}]);



// ***********************************
// DatasetIndexController
// ***********************************
angular.module("dataFramer").controller("DatasetIndexController", 
["$scope", "$state", "$meteorCollection", "$meteorSubscribe",
function($scope, $state, $meteorCollection, $meteorSubscribe) {

  $scope.subLoading = true;

  $meteorSubscribe.subscribe("datasets").then(function(sub) {
    $scope.datasets = $meteorCollection(function() {
      return Datasets.find({}, {fields: {name: 1}, sort: {name: 1}});
    });
    $scope.subLoading = false;
  });

  $scope.deleteDataset = function(dataset_id) {
    Meteor.call("removeDataset", dataset_id);
  };

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
      event.target.value = ""; // Reset the upload form
    }
  };

  $scope.checkState = function(name) {
    return $state.current.name == name;
  };

}]);



// ***********************************
// QuestionIndexController
// ***********************************
angular.module("dataFramer").controller("QuestionIndexController", 
["$scope","$meteorCollection", "$stateParams", "$meteorSubscribe", "$state", "$meteorObject",
function($scope, $meteorCollection, $stateParams, $meteorSubscribe, $state, $meteorObject) {

  $scope.questionsLoading = true;

  $meteorSubscribe.subscribe("columns", $stateParams.datasetId);

  $meteorSubscribe.subscribe("questions", $stateParams.datasetId).then(function(sub) {
    $scope.questions = $meteorCollection(function() {
      return Questions.find({dataset_id:$stateParams.datasetId});
    });
    $scope.questionsLoading = false;
  });

  $meteorSubscribe.subscribe("datasets", $stateParams.datasetId).then(function(sub) {
    $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
  });

  $scope.sections = [
    {"name": "Keep", "answerable": true },
    {"name": "Undecided" , "answerable": null },
    {"name": "Reject", "answerable": false }
  ];

  $scope.getVarName = function(var_id) {
    return Columns.findOne(var_id).name;
  };

  $scope.getVarType = function(var_id) {
    return Columns.findOne(var_id).datatype;
  };

  $scope.checkState = function(name) {
    return $state.current.name == name;
  };

  $scope.addQuestion = function(text) {
    var new_question = {
      "dataset_id": $stateParams.datasetId,
      "text": text.$modelValue,
      "notes": null,
      "answerable": null,
      "col_refs": [],
      "user_id": Meteor.userId()
    };

    // Inserting this way lets us add a new question without triggering the 
    // $meteorCollection call above to re-run, which temporarily empties the 
    // questions array and causes all the ng-repeat loops to redraw, which is very stupid
    Meteor.call('addQuestion', new_question);
  };

  $scope.answerable = function(q_id) {
    switch (_.findWhere($scope.questions, {_id: q_id}).answerable) {
      case true:
        return "ans true";
      case false:
        return "ans false";
      default:
        return "ans unknown";
    }
  };

  $scope.answerableIcon = function(q_id) {
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

  $scope.deleteQuestion = function() {
    Questions.remove(this.question._id);
  };

  $scope.setAns = function(ans_value) {
    Questions.update({ _id: this.question._id }, { $set: { answerable: ans_value } });
  };

  $scope.clearField = function() {
    return "";
  };

  $scope.editQuestion = function(event, q_id) {
    var esc = event.which == 27
      , nl = event.which == 13
      , el = event.target
      , input = el.nodeName != "INPUT" && el.nodeName != "TEXTAREA";

    if (input) {
      if (esc) { // Restore state
        document.execCommand("undo");
        el.blur();
      } else if (nl) { // Are we editing the question or the notes?
        if (el.classList.contains("question-card-text")) {
          Questions.update({ _id: q_id }, { $set: { text: el.innerHTML} });
        } else if (el.classList.contains("question-card-notes")) {
          Questions.update({ _id: q_id }, { $set: { notes: el.innerHTML} });
        }
        el.blur();
        event.preventDefault();
      }
    }
  };

}]);



// ***********************************
// QuestionSingleController
// ***********************************
angular.module("dataFramer").controller("QuestionSingleController", ["$scope",
"$meteorSubscribe", "$stateParams", "$meteorObject", "$meteorCollection", "$meteorUtils",
function($scope, $meteorSubscribe, $stateParams, $meteorObject, $meteorCollection, $meteorUtils) {

  $scope.col_refs = [];

  $scope.chartsLoading = true;

  $meteorSubscribe.subscribe("questions", $stateParams.datasetId, $stateParams.questionId).then(function(sub) {
    $scope.question = $meteorObject(Questions, $stateParams.questionId);

    $scope.varClick = function(col_id) {
      // toggle in question's col_refs
      if (_.contains($scope.question.col_refs, col_id)) { // Remove
        $scope.question.col_refs = _.without($scope.question.col_refs, col_id);
      } else { // Add
        // NOTE: This is a dumb hack to make activeColumns (below) recognize 
        // the change to col_refs, which it doesn't do for some reason if we
        // just push to the array
        var newrefs = _.union($scope.question.col_refs, [col_id]);
        $scope.question.col_refs = newrefs;
      }

      // Query the DB again
      $scope.activeColumns = $meteorCollection(function() {
        return Columns.find({_id: {$in: $scope.question.col_refs}}, {sort: {datatypeIdx: 1, name: 1}});
      });
    }

    $scope.colActive = function(col_id) {
      return _.contains($scope.question.col_refs, col_id);
    }

    $scope.setAns = function(ans_value) {
      $scope.question.answerable = ans_value;
    };

    $scope.activeColumns = $meteorCollection(function() {
      // React to add/remove actions in the sidebar
      return Columns.find({_id: {$in: $scope.question.col_refs}}, {sort: {datatypeIdx: 1, name: 1}});
    });
  });

  $meteorSubscribe.subscribe("columns", $stateParams.datasetId).then(function(sub) {
    $scope.columns = $meteorCollection(function() {
      return Columns.find({dataset_id: $stateParams.datasetId}, {sort: {datatypeIdx: 1, name: 1}});
    });
    $scope.chartsLoading = false;
  });

  $meteorSubscribe.subscribe("datasets", $stateParams.datasetId).then(function(sub) {
    $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
  });

  $scope.datatypes = DATATYPE_LIST;
}]);



// ***********************************
// ChartsController
// ***********************************
angular.module('dataFramer').controller('ChartsController', 
["$scope", "$state", "$window", "$stateParams", "$meteorSubscribe", "$meteorCollection", "$meteorObject",
function($scope, $state, $window, $stateParams, $meteorSubscribe, $meteorCollection, $meteorObject) {

  $scope.chartsLoading = true;
  $meteorSubscribe.subscribe("datasets", $stateParams.datasetId).then(function(sub) {
    $scope.$emit("datasetReady");
    $scope.dataset = $meteorObject(Datasets, $stateParams.datasetId);
  });

  $meteorSubscribe.subscribe("columns", $stateParams.datasetId).then(function(sub) {
    $scope.columns = $meteorCollection(function() {
      return Columns.find({dataset_id: $stateParams.datasetId}, {sort: {datatypeIdx: 1, name: 1}});
    });
    $scope.chartsLoading = false;
  });

  $scope.setCurrentColumn = function(col_id) {
    $scope.currentColumn = $meteorObject(Columns, col_id, false);
  };

  $scope.addVarToQuestion = function(question, col_id) {
    // Toggle in scope"s col_refs
    if (_.contains(question.col_refs, col_id)) { // Remove
      $scope.col_refs = _.without(question.col_refs, col_id);
    } else { // Add
      // NOTE: this is a dumb hack to make getReactively (below)
      // recognize the change to col_refs, which it doesn"t do for
      // some reason if we just push to the array
      var newrefs = _.union(question.col_refs, [col_id]);
      $scope.col_refs = newrefs;
    }
    // Save to the questions collection
    Questions.update({ _id: question._id }, { $set: { col_refs: $scope.col_refs} });
  };

  $scope.colActive = function(question, col_id) {
    return _.contains(question.col_refs, col_id);
  };

  $meteorSubscribe.subscribe("questions", $stateParams.datasetId).then(function(sub) {
    $scope.questions = $meteorCollection(function() {
      return Questions.find({dataset_id:$stateParams.datasetId});
    });
    $scope.questionsLoading = false;
  });

  $scope.getVarName = function(var_id) {
    return Columns.findOne(var_id).name;
  };

  $scope.getVarType = function(var_id) {
    return Columns.findOne(var_id).datatype;
  };

  $scope.percentNull = function(column) {
    return parseInt(column.nulls / $scope.dataset.rowCount * 100)
  };

  $scope.datatypes = DATATYPE_LIST;

  $scope.checkState = function(name) {
    return $state.current.name == name;
  };

  $scope.varClick = function(col) {
     $window.scroll(0,$("#"+col._id).offset().top);
  };

  $scope.checkState = function(name) {
    return $state.current.name == name;
  };

  $scope.addQuestion = function(text) {
    var new_question = {
      "dataset_id": $stateParams.datasetId,
      "text": text.$modelValue,
      "notes": null,
      "answerable": null,
      "col_refs": [],
      "user_id": Meteor.userId()
    };

    // Inserting this way lets us add a new question without triggering
    // the $meteorCollection call above to re-run, which temporarily
    // empties the questions array and causes all the ng-repeat loops
    // to redraw, which is very stupid
    Meteor.call('addQuestion', new_question);
  };

  $scope.answerable = function(q_id) {
    switch (_.findWhere($scope.questions, {_id: q_id}).answerable) {
      case true:
        return "ans true";
      case false:
        return "ans false";
      default:
        return "ans unknown";
    }
  };

  $scope.answerableIcon = function(q_id) {
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

  $scope.sections = [
    {'name': 'Keep', 'answerable': true },
    {'name': 'Undecided' , 'answerable': null },
    {'name': 'Reject', 'answerable': false }
  ];

  $scope.changeType = function changeType(col, type) {
    col.datatype = type;
    col.datatypeIdx = DATATYPE_SORT_IDX[type];
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
    // Reload the page
    $state.go($state.current, {}, {reload: true});
  }

}]);
