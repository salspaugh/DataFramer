<ul class="nav navbar-nav navbar-left" ng-if="!startPage">
  <li class="navbar-text">
    <!--<a ui-sref="dataset.questionIndex({datasetId: dataset._id})">{{dataset.name}}</a>-->
    {{dataset.name}}
  </li>
</ul>

<ul class="nav navbar-nav navbar-right" ng-if="!startPage">

  <li class="nav-link" ng-class="{active: checkState('dataset.charts')}">
    <a ui-sref="dataset.charts({datasetId: dataset._id})">Charts</a>
  </li>

  <li class="nav-link" ng-class="{active: checkState('dataset.questionIndex')}">
    <a ui-sref="dataset.questionIndex({datasetId: dataset._id})"><span class="text-primary">Questions</span></a>
  </li>

</ul>
