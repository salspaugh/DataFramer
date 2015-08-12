<div class="row">
	<div class="col-md-8 col-md-offset-2">
		<h1 class="">Welcome!</h1>
		
		<p class="lead">This is a demo version of DataFramer that you're welcome to try out.</p>

		<p class="lead"><strong>If you have an account,</strong> please sign in using the menu above.</p>

		<p class="lead"><strong>If you don't have an account,</strong> you can use the button below to create a temporary demo account you can use to test out DataFramer's features. Demo accounts come pre-loaded with some sample datasets to get you started.</p>

		<div class="alert alert-warning">
			<p class="lead ">When we say demo accounts are temporary, we mean they will <strong>self-destruct after one hour.</strong> The account and all its data will be deleted in an hour, so don't create anything you need to keep!</p>

			<p class="lead ">If you'd like to request more permanent access to DataFramer, <a href="mailto:alspaugh@eecs.berkeley.edu">send us an email</a>.</p>
		</div>

		<p class="lead"><button class="btn btn-success btn-lg" ng-click="tempAccount()" ng-disabled="acctLoading">
			<span ng-hide="acctLoading">Create a temporary account</span>
			<span ng-show="acctLoading"><i class="fa fa-spinner fa-spin"></i> Preparing your account, please wait...</span>
		</button></p>

		<div class="alert alert-danger" ng-if="createError">
			<p>Sorry! There was an error creating an account for you. Please try again.</p>
			<p>Error information: {{errorInfo}}</p>
		</div>
		<div class="alert alert-danger"ng-if="loginError">
			<p>Sorry! There was an error logging into the temporary account. Please try again.</p>
			<p>Error information: {{errorInfo}}</p>
		</div>
	</div>
</div>