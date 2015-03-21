<div class="datatype {{column.datatype}}"><p class="col-chart-title">{{column.name}}</p></div>


<a class="pull-right control" ng-click="remove(column)" ng-show="checkState('dataset.question')" 
  tooltip="Remove from question" tooltip-placement="bottom" tooltip-append-to-body="true">
  <i class="fa fa-times-circle fa-lg icon-grey"></i>
</a>

<span class="null-disclaimer" ng-class="{'bg-warning text-warning': column.nulls}" ng-show="column.nulls > 0">Number of nulls: <strong>{{column.nulls}}</strong> ({{percentNull(column)}}% of rows)</span>


<span class="dropdown pull-right control">
  <a class="pull-right control" ng-click="remove(column)" ng-show="checkState('dataset.question')"
    tooltip="Remove from question" tooltip-placement="bottom" tooltip-append-to-body="true">
    <i class="fa fa-times-circle fa-lg icon-grey"></i>
  </a>
  <a data-toggle="dropdown" tooltip="Change datatype" tooltip-placement="bottom" tooltip-append-to-body="true">
    <i class="fa fa-cog icon-grey fa-lg"><span class="caret icon-grey fa-lg"></span></i>
  </a>

  <ul class="dropdown-menu" role="menu">
    <li role="presentation" ng-repeat="t in ['string', 'integer', 'float', 'date', 'time']">
      <a role="menuitem" tabindex="-1" href="#" ng-click="changeType(column, t)">
        <p ng-class="{'text-muted': column.datatype==t}">Change datatype to {{t}}</p>
      </a>
    </li>
  </ul>

  <a class="pull-right control" ng-click="resetBars()" ng-show="column.datatype == 'string'" 
    tooltip="Reset chart view" tooltip-placement="bottom" tooltip-append-to-body="true">
    <i class="fa fa-refresh fa-lg icon-grey" style="margin-right: 10px;"></i>
  </a>
</span>

<div class="chart-wrapper">
  <div chart ></div>
</div>

<button ng-show="checkState('dataset.charts')"
  data-toggle="modal" data-target="#addToQuestionModal"
  class="btn btn-sm btn-primary pull-right" ng-click="setCurrentColumn(column._id)">Add to question
</button>

<!-- <form role="form">
  <div class="form-group">
    <textarea class="form-control" rows="2" ng-model="column.notes"
      ng-model-options="{debounce: 750}" placeholder="Notes"></textarea>
  </div>
</form>
 -->
