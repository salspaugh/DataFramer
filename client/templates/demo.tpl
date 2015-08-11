<nav class="navbar navbar-default navbar-fixed-top">
	<div class="container">
		<div class="navbar-header navbar-left">
			<a class="navbar-brand" ui-sref="landing">DataFramer</a>
		</div>
		<ul class="nav navbar-nav df-login" meteor-include="login">
		</ul>
		<div ui-view="navBar"></div>
	</div>

</nav>

<div class="container">
	<div ui-view="main"></div>
</div>