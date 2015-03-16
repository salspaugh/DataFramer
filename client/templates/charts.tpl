<div ng-if="chartsLoading" ng-include="'client/templates/loading.tpl'"></div>

<div class="row" ng-if="!chartsLoading">

    <div class="col-md-9 chart-area">
        <div class="row">
            <div class="col-md-6 chart-container" ng-repeat="column in columns" id="{{column._id}}">
                <ng-include src="'client/templates/df-chart.tpl'"></ng-include>
            </div>
        </div>
    </div>

  <div class="col-md-3">
      <div class="sidebar">
          <input type="text" placeholder="Search full text of dataset" class="search-box"
          ng-model="columns.search" ng-model-options="{debounce: 750}"/>

          <div class="title-block">
              <h5><span class="text-muted">Total rows:</span> {{dataset.rowCount}}</h5>
              <h5><span class="text-muted">Total columns:</span> {{columns.length}}</h5>
          </div>

          <div ng-repeat="type in datatypes" class="datatype" ng-class="type">
            <div ng-show="(columns | filter:{datatype: type}).length" class="ng-show">
              <p><strong>[<span class="text-lowercase">{{type}}</span> columns]</strong></p>
            </div>
            <ul class="nav nav-stacked">
              <li ng-repeat="col in columns | filter:{datatype: type} | filter:columns.search">
                <a href="#" ng-click="varClick(col)" ng-class="{active: colActive(col)}">{{col.name}}</a>
              </li>
            </ul>
          </div>
      </div>
  </div>

</div>
