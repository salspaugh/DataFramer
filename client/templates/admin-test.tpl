<div ng-if="$root.currentUser.profile.is_admin">
    <p>
      <button type="button" class="btn btn-primary btn-lg" ng-click="adminLoad()">Load Test Data for Admin Account</button> <br/>
      <em>useful to make sure the data is processing correctly</em>
    </p>
    <p>
      <button type="button" class="btn btn-info btn-lg" ng-click="titanicLoad()">Load Titanic Data for Admin Account and Student 1</button> <br/>
      <em>for demo</em>
    </p>
    <hr/>
    <p>
        &nbsp;
    </p>
    <p>
      <button type="button" class="btn btn-danger btn-lg" ng-click="usersLoad()">Create Test Users with Test Data</button>
    </p>
    <div class="alert alert-danger" role="alert"><strong>Warning!</strong> This takes about 25 minutes to run and cannot be interrupted without stopping the server. <br/>&nbsp;<br/>Inspect the server console (or logs) to monitor progress.</div>
</div>
