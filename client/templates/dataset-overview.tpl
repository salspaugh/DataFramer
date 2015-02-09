    <div class="loadmask" ng-hide="chartsReady">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div ng-show="chartsReady">
        <h2>variables overview</h2>
        <h4>number of records: {{ dataset.rowCount }} | number of variables: {{ columns.length }}</h4>
    </div>
    <div class="row">
        <div class="col-md-6 chart-container" ng-repeat="col in columns" id="{{col._id}}">
            <ng-include src="'client/templates/df_chart.tpl'"></ng-include>
        </div>
    </div>
