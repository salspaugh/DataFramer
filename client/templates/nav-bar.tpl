<div class="navbar-header navbar-left">
    <a class="navbar-brand" ui-sref="start">DataFramer</a>
</div>

<ul class="nav navbar-nav" ng-if="!startPage">
    <li class="navbar-text">Current Dataset: <em>{{dataset.name}}</em></li>

    <li class="nav-link" ng-class="{active: checkState('dataset.charts')}">
        <a ui-sref="dataset.charts({datasetId: dataset._id})" class="lead">Charts</a>
    </li>

    <li class="nav-link" ng-class="{active: checkState('dataset.questionIndex')}">
        <a ui-sref="dataset.questionIndex({datasetId: dataset._id})" class="lead"><span class="text-primary">Questions</span></a>
    </li>

    <li class="nav-link active" ng-if="checkState('dataset.questionSingle')">
        <a class="lead">Current Question</a>
    </li>
</ul>
