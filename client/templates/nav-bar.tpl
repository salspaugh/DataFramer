<ul class="nav navbar-nav navbar-right" ng-if="!startPage">
  <li class="navbar-text">Current dataset: <em>{{dataset.name}}</em></li>

  <li class="nav-link" ng-class="{active: checkState('dataset.charts')}">
    <a ui-sref="dataset.charts({datasetId: dataset._id})" class="lead">Charts</a>
  </li>

  <li class="nav-link" ng-class="{active: checkState('dataset.questionIndex')}">
    <a ui-sref="dataset.questionIndex({datasetId: dataset._id})" class="lead"><span class="text-primary">Questions</span></a>
  </li>

  <li class="nav-link active" ng-if="checkState('dataset.questionSingle')">
    <a class="lead">Current question</a>
  </li>
</ul>
