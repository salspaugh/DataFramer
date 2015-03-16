<!-- <div ng-if="chartsLoading">
    <h1 style="text-align: center;">Loading...</h1>
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-info active" role="progressbar" style="width: 100%"></div>
    </div>
</div> -->

<div class="row" ng-if="!chartsLoading">
  <div class="col-md-9 chart-area">
    <div class="row question-header">
        <div class="col-md-12">
            <h1>{{question.text}}</h1>
            <a class="label label-success" ng-class="{active: question.answerable == true}" ng-click="setAns(true)">Keep</a>
            <a class="label label-default" ng-class="{active: question.answerable == null}" ng-click="setAns(null)">Undecided</a>
            <a class="label label-danger" ng-class="{active: question.answerable == false}" ng-click="setAns(false)">Reject</a>
        </div>
    </div>
    <div class="row">
      <div class="col-md-6 chart-container" ng-repeat="column in activeColumns" id="{{column._id}}">
        <ng-include src="'client/templates/df-chart.tpl'"></ng-include>
      </div>
    </div>
  </div>

  <div class="col-md-3">
      <div class="sidebar">
          <input type="text" placeholder="Search full text of dataset" class="search-box"
          ng-model="columns.search" ng-model-options="{debounce: 750}"/>

          <div ng-repeat="type in datatypes" class="datatype" ng-class="type">
            <div ng-show="(columns | filter:{datatype: type}).length" class="ng-show">
              <p><strong>[<span class="text-lowercase">{{type}}</span> columns]</strong></p>
            </div>
            <ul class="nav nav-stacked">
              <li ng-repeat="col in columns | filter:{datatype: type} | filter:columns.search">
                <a href="#" ng-click="varClick(col._id)" ng-class="{active: colActive(col._id)}">{{col.name}}</a>
              </li>
            </ul>
          </div>  
      </div>

  </div>

</div>
