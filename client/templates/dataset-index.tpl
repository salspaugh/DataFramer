<!-- the first-time start page, the list of datasets, and the upload form -->
<!-- see _OLD datasets-list.tpl, upload.tpl for usable pieces -->
<div class="col-md-8 col-md-offset-2">
    <div ng-if="$root.currentUser">
    <section class="page-header">
        <h1>Your Datasets</h1>
    </section>

    <section class="list-group">
        <a class="list-group-item" ng-repeat="dataset in datasets" ui-sref="dataset.questionIndex({datasetId: dataset._id})">
            <h4 class="list-group-item-heading">{{dataset.name}}</h4>
        </a>
        <section ng-hide="subReady" class="list-group-item">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
        </section>
        <section class="list-group-item disabled" ng-if="subReady && datasets.length == 0">
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
        <h2>Please sign in or create an account to start using DataFramer.</h2>
    </div>
</div>
