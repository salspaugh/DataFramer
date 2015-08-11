<ul class="nav navbar-nav navbar-left" ng-if="!startPage">
  <li class="navbar-text">
    {{dataset.name}}
  </li>
</ul>

<ul class="nav navbar-nav navbar-right" ng-if="!startPage">

  <li class="nav-link" ng-class="{active: checkState('demo.datasets')}">
    <a ui-sref="demo.datasets">Datasets</a>
  </li>

  <li class="nav-link" ng-class="{active: checkState('demo.dataset.charts')}">
    <a ui-sref="demo.dataset.charts({datasetId: dataset._id})">Charts</a>
  </li>

  <li class="nav-link" ng-class="{active: checkState('demo.dataset.questionIndex')}">
    <a ui-sref="demo.dataset.questionIndex({datasetId: dataset._id})"><span class="text-primary">Questions</span></a>
  </li>

</ul>
