<div class="row">
  <div class="col-md-12">
    <div ng-if="subLoading" ng-include="'client/templates/loading.tpl'"></div>

    <div ng-if="!subLoading">
      <div ng-if="$root.currentUser" class="col-md-8 col-md-offset-2">

        <p class="lead">Datasets</p>

        <section class="list-group">

          <div class="list-group-item" ng-repeat="dataset in datasets">
            <p>
              <a ui-sref="demo.dataset.questionIndex({datasetId: dataset._id})">{{dataset.name}}</a>
              <a class="pull-right icon-grey"
              ng-confirm-click="Are you sure you want to delete this dataset ({{dataset.name}})?" 
              confirmed-click="deleteDataset(dataset._id)" 
              tooltip="Delete this dataset" tooltip-placement="bottom" tooltip-append-to-body="true" href="#">
              <i class="fa fa-trash-o fa-lg"></i>
            </a>
          </p>
        </div>
      </section>

      <section ng-if="datasets.length == 0">
        <p>You haven't uploaded any datasets yet.</p>
      </section>

      <section>
        <p><span class="btn btn-primary btn-block btn-file" ng-class="{disabled: uploadInProgress}">
                  <span ng-if="!uploadInProgress">Upload a new dataset.</span>
                  <span ng-if="uploadInProgress"><i class="fa fa-spinner fa-spin"></i> Uploading file ...</span>
                  <input type="file" onchange="angular.element(this).scope().processCsv(event);"/>
                </span></p>

        <p class="alert alert-danger" ng-show="uploadError">
          Unable to upload {{uploadErrorFile}} ({{uploadError}})
        </p>
      </section>
    </div>

    <div ng-if="!$root.currentUser">
      <p class="lead text-center">Please sign in or create an account to start using DataFramer.</p>
    </div>
  </div>
</div>
</div>
