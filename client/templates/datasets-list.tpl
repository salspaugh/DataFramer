<ul class="nav nav-pills topnav">
    <li ng-class="{active: checkState('home')}">
        <a ui-sref="home" data-toggle="tooltip" data-placement="bottom" title="Home">
            <i class="fa fa-home"></i>
        </a>
    </li>
    <li ng-class="{active: checkState('home.upload')}" ng-if="$root.currentUser">
        <a ui-sref="home.upload" data-toggle="tooltip" data-placement="bottom" title="Upload new">
            <i class="fa fa-upload"></i>
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
        </li>
    </ul>
</div>
</div>
