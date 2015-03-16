<!-- the first-time start page, the list of datasets, and the upload form -->
<!-- see _OLD datasets-list.tpl, upload.tpl for usable pieces -->
<div class="col-md-8 col-md-offset-2">

    <div ng-if="subLoading">
        <h1 style="text-align: center;">Loading...</h1>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-info active" role="progressbar" style="width: 100%"></div>
        </div>
    </div>

    <div ng-if="$root.currentUser">
    <section class="page-header">
        <h1>Datasets</h1>
    </section>

    <section class="list-group" ng-if="!subLoading">
        <div class="list-group-item" ng-repeat="dataset in datasets">
            <button class="btn btn-danger pull-right btn-xs" ng-confirm-click="Are you sure you want to delete this dataset ({{dataset.name}})?" confirmed-click="deleteDataset(dataset._id)">Delete</button>
            <h4 class="list-group-item-heading"><a ui-sref="dataset.questionIndex({datasetId: dataset._id})">{{dataset.name}}</a></h4>
            <!--  -->
        </div>
        <section class="list-group-item disabled" ng-if="datasets.length == 0">
            <h4 class="list-group-item-heading">You haven't uploaded any datasets yet.</h4>
        </section>
        <section class="list-group-item list-group-item-info">
            <span class="btn btn-primary btn-block btn-file">
                <strong>Upload a new dataset (.csv files only)</strong>
                <input type="file" onchange="angular.element(this).scope().processCsv(event)"/>
            </span>
        </section>
    </section>
    </div>

    <div ng-if="!$root.currentUser">
        <h3 class="text-center">Please sign in or create an account to start using DataFramer.</h3>
    </div>

</div>
