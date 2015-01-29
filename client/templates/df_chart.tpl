<h3 class="var-name">
        {{col.name }}

        <a class="pull-right control" ng-click="remove(col)" ng-show="checkState('dataset.question')">
            <i class="fa fa-times-circle"></i>
        </a>

        <span class="dropdown pull-right control">
            <a data-toggle="dropdown">
                <i class="fa fa-pencil-square"></i><span class="caret"></span>
            </a>

            <ul class="dropdown-menu" role="menu">
                <li role="presentation" ng-repeat="type in ['string', 'integer', 'float', 'date']">
                    <a role="menuitem" tabindex="-1" href="#" ng-click="changeType(col, type)">
                        change datatype to {{ type }}
                        <span ng-show="type == 'string'"> (categorical)</span>
                    </a>
                </li>
            </ul>
        </span>

        <a class="pull-right control" ng-click="resetBars()" ng-show="col.datatype == 'string'">
            <i class="fa fa-refresh"></i>
        </a>

    </h3>
    <h5>nulls: {{ col.nulls }}</h5>
    <div hist></div>
    <form role="form">

        <div class="form-group">
            <textarea class="form-control" rows="2" ng-model="col.notes"
                ng-model-options="{debounce: 750}" placeholder="Notes">
            </textarea>
        </div>

</form>
