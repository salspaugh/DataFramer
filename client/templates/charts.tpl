<div ng-if="chartsLoading">
    <h1 style="text-align: center;">Loading...</h1>
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-info active" role="progressbar" style="width: 100%"></div>
    </div>
</div>

<div class="row" ng-if="!chartsLoading">

  <div class="col-md-9 chart-area">
    <div class="row">
        <div class="col-md-12">
            <h1>Charts</h1>
        </div>
      <div class="col-md-6"><h4 class="text-muted">Total rows: {{dataset.rowCount}}</h4></div>
      <div class="col-md-6"><h4 class="text-muted">Total columns: {{columns.length}}</h4></div>
  </div>
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
          <p class="text-muted">Columns in dataset <br />{{dataset.name}}:</p>

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
