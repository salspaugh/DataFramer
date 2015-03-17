<div class="datatype {{column.datatype}}"><p class="lead"><strong>{{column.name}}</strong></p></div>

<a class="pull-right" ng-show="checkState('dataset.charts')"
  data-toggle="modal" data-target="#addToQuestionModal"
  tooltip="Add to question" tooltip-placement="bottom" tooltip-append-to-body="true">
  <i class="fa fa-plus-square fa-lg text-primary" style="margin-left: 10px;"></i>
</a>

<a class="pull-right control" ng-click="remove(column)" ng-show="checkState('dataset.question')"
  tooltip="Remove from question" tooltip-placement="bottom" tooltip-append-to-body="true">
  <i class="fa fa-times-circle fa-lg icon-grey"></i>
</a>

<span class="dropdown pull-right control">

  <a data-toggle="dropdown" tooltip="Change datatype" tooltip-placement="bottom" tooltip-append-to-body="true">
    <i class="fa fa-pencil-square icon-grey fa-lg"></i><span class="caret icon-grey fa-lg"></span>
  </a>

  <ul class="dropdown-menu" role="menu">
    <li role="presentation" ng-repeat="t in ['string', 'integer', 'float', 'date', 'time']">
      <a role="menuitem" tabindex="-1" href="#" ng-click="changeType(column, t)">
        <p ng-class="{'text-muted': column.datatype==t}">Change datatype to {{t}}</p>
      </a>
    </li>
  </ul>

</span>

<a class="pull-right control" ng-click="resetBars()" ng-show="column.datatype == 'string'"
  tooltip="Reset chart view" tooltip-placement="bottom" tooltip-append-to-body="true">
  <i class="fa fa-refresh fa-lg icon-grey" style="margin-right: 10px;"></i>
</a>

<span ng-class="{'bg-warning text-warning': column.nulls}">Number of blank or null entries in column: {{column.nulls}}</span>
<div chart ></div>
