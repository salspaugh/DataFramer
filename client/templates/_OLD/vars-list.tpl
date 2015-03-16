    <ul class="nav nav-pills topnav">
        <li ng-class="{active: checkState('home')}">
            <a ui-sref="home" tooltip="Home" tooltip-placement="bottom" tooltip-append-to-body="true">
                <i class="fa fa-home"></i>
            </a>
        </li>
        <li ng-class="{active: checkState('home.upload')}">
            <a ui-sref="home.upload" tooltip="Upload new" tooltip-placement="bottom" tooltip-append-to-body="true">
                <i class="fa fa-upload"></i>
            </a>
        </li>
        <li ng-class="{active: checkState('dataset')}">
            <a ui-sref="dataset({datasetId: dataset._id})" tooltip="Dataset overview" tooltip-placement="bottom" tooltip-append-to-body="true">
            <i class="fa fa-question"></i>
            <i class="fa fa-th-large"></i>
        </a>
    </li>
</ul>

<div class="loadmask" ng-hide="subReady">
    <i class="fa fa-spinner fa-spin fa-3x"></i>
</div>
<div ng-show="subReady">
    <h4 class="name"><span id="datasetname">{{dataset.name}}</span>
        <!-- <button type="button" class="btn btn-default btn-xs" tooltip="Rename {{dataset.name}}" tooltip-placement="bottom" tooltip-append-to-body="true">
            <i class="fa fa-pencil"></i>
        </button> -->
    </h4>
    <input type="text" placeholder="Search variables" class="search-box"
    ng-model="columns.search"
    ng-model-options="{debounce: 750}"/>
    <div>
        <div ng-repeat="type in datatypes" class="datatype" ng-class="type">
            <h5>{{ type }} <span ng-show="type == 'string'">(categorical)</span></h5>
            <ul class="nav nav-stacked">
                <li ng-repeat="col in columns | filter:{datatype: type} | filter:columns.search">
                    <a href="#" ng-click="varClick(col)" ng-class="{active: colActive(col)}">{{ col.name }}</a>
                </li>
            </ul>
        </div>
    </div>
</div>
