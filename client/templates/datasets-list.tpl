<ul class="nav nav-pills topnav">
    <li ng-class="{active: checkState('home')}">
        <a ui-sref="home" tooltip="Home" tooltip-placement="bottom" tooltip-append-to-body="true">
            <i class="fa fa-home"></i>
        </a>
    </li>
</ul>

<div ng-if="$root.currentUser">
<h4 class="name">my datasets</h4>

<div class="loadmask" ng-hide="subReady">
    <i class="fa fa-spinner fa-spin fa-3x"></i>
</div>
<div ng-show="subReady">
    <input type="text" placeholder="Search datasets" class="search-box"
        ng-model="searchBox"/>
    <ul class="nav nav-stacked">
        <li ng-repeat="dataset in datasets | filter:searchBox">
            <a ui-sref="dataset({datasetId: dataset._id})">{{ dataset.name }}</a>
            <button type="button" class="btn btn-default btn-xs delete" tooltip="Delete {{dataset.name}}" tooltip-placement="bottom" tooltip-append-to-body="true" ng-click="deleteDataset()">
                <i class="fa fa-minus-circle text-danger"></i>
            </button>
        </li>
    </ul>
</div>
</div>
