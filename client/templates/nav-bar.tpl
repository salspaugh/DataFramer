<button type="button" class="pull-right btn btn-danger df-nav-btn ng-hide nav-link" ui-sref="dataset.questionIndex({datasetId: dataset._id})" ng-hide={{startPage}}>
Questions
</button>
<button type="button" class="pull-right btn btn-danger df-nav-btn ng-hide nav-link" ng-show={{startPage}} disabled>
Questions
</button>

<button type="button" class="pull-right btn btn-link df-nav-btn ng-hide nav-link" ui-sref="dataset.charts({datasetId: dataset._id})" ng-hide={{startPage}}>
Charts
</button>
<button type="button" class="pull-right btn btn-link df-nav-btn ng-hide nav-link" ng-show={{startPage}} disabled>
Charts
</button>

<button type="button" class="pull-right btn btn-link df-nav-btn ng-hide nav-link" ui-sref="start" ng-hide={{startPage}}>
Datasets
</button>
<button type="button" class="pull-right btn btn-link df-nav-btn ng-hide nav-link" ng-show={{startPage}} disabled>
Datasets
</button>
