<div class="col-md-9 jumbotron" ng-if="$root.currentUser">
    <h1>Upload a new dataset</h1>
    <h3>note: only CSV files are supported at this time</h3>

    <input type="file" name="csv" value="" class="csv-upload" onchange="angular.element(this).scope().preprocess(event)"/>
</div>
