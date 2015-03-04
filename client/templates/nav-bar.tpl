<div class="nav navbar-nav navbar-right">

  <button type="button" class="btn btn-link df-nav-btn ng-hide" ui-sref="start" ng-hide={{startPage}}>
    <p>Datasets</p>
  </button>
  <button type="button" class="btn btn-link df-nav-btn ng-hide" ng-show={{startPage}} disabled>
    <p>Datasets</p>
  </button>
 
  <button type="button" class="btn btn-link df-nav-btn ng-hide" ui-sref="dataset.charts({datasetId: dataset._id})" ng-hide={{startPage}}>
    <p>Charts</p>
  </button>
  <button type="button" class="btn btn-link df-nav-btn ng-hide" ng-show={{startPage}} disabled>
    <p>Charts</p>
  </button>
 
  <button type="button" class="btn btn-link df-nav-btn ng-hide" ui-sref="dataset.questionIndex({datasetId: dataset._id})" ng-hide={{startPage}}>
    <p class="text-danger">Questions</p>
  </button>
  <button type="button" class="btn btn-link df-nav-btn ng-hide" ng-show={{startPage}} disabled>
    <p class="text-danger">Questions</p>
  </button>

</div>
