<!-- the first-time start page, the list of datasets, and the upload form -->
<!-- see _OLD datasets-list.tpl, upload.tpl for usable pieces -->
<div class="row">

<div class="col-md-12">

    <div ng-if="subLoading">
        <h1 style="text-align: center;">Loading...</h1>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-info active" role="progressbar" style="width: 100%"></div>
        </div>
    </div>

    <div ng-if="$root.currentUser">
    <h1>Datasets</h1>

    <section class="list-group" ng-if="!subLoading">
        <div class="list-group-item" ng-repeat="dataset in datasets">
            <h4 class="list-group-item-heading">
                <a ui-sref="dataset.questionIndex({datasetId: dataset._id})">{{dataset.name}}</a> <a class="pull-right text-danger" ng-confirm-click="Are you sure you want to delete this dataset ({{dataset.name}})?" confirmed-click="deleteDataset(dataset._id)" tooltip="Delete this dataset" tooltip-placement="bottom" tooltip-append-to-body="true" href="#">
                    <i class="fa fa-trash-o"></i>
                </a>
            </h4>
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
</div>
