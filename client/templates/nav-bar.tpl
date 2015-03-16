<div class="navbar-header navbar-left">
    <a class="navbar-brand" ui-sref="start">DataFramer</a>
    <h4 class="navbar-text" ng-if="!startPage">{{dataset.name}}</h4>
</div>

<ul class="nav navbar-nav navbar-right">
    <li class="ng-hide nav-link" ng-hide={{startPage}}>
        <a ui-sref="start">Datasets</a>
    </li>
    <li class="ng-hide nav-link active" ng-show={{startPage}}>
        <a>Datasets</a>
    </li>

    <li class="ng-hide nav-link" ng-hide={{startPage}} ng-class="{active: checkState('dataset.charts')}">
        <a ui-sref="dataset.charts({datasetId: dataset._id})">Charts</a>
    </li>
    <li class="ng-hide nav-link disabled" ng-show={{startPage}}>
        <a>Charts</a>
    </li>

    <li class="ng-hide nav-link" ng-hide={{startPage}} ng-class="{active: checkState('dataset.questionIndex')}">
        <a ui-sref="dataset.questionIndex({datasetId: dataset._id})">Questions</a>
    </li>
    <li class="ng-hide nav-link disabled" ng-show={{startPage}}>
        <a>Questions</a>
    </li>
</ul>
