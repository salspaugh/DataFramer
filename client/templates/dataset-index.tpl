<div class="row">
<div class="col-md-12">
    <div ng-if="subLoading" ng-include="'client/templates/loading.tpl'"></div>

    <div ng-if="!subLoading">
        <div ng-if="$root.currentUser" class="col-md-8 col-md-offset-2">
            <h3>Datasets</h3>
            <section class="list-group" >
                <a class="list-group-item" ng-repeat="dataset in datasets" ui-sref="dataset.questionIndex({datasetId: dataset._id})">
                    <h4 class="list-group-item-heading">{{dataset.name}}</h4>
                </a>
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
</div>
