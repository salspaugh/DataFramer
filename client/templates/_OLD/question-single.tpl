<div class="question-single">
        <h1>{{ question.text }}</h1>

        <h2 ng-show="!columns.length">select variables to add them to your question</h2>

        <div class="row charts-container">
            <div class="col-md-6 chart-container" ng-repeat="col in columns"
            id="{{ col._id }}">
            <ng-include src="'client/templates/df_chart.tpl'"></ng-include>
        </div>
    </div>
</div>

<div class="floating-column">
    <div class="container">
        <div class="row">
            <div class="col-md-10 col-md-offset-2 answerable-form">
                <form role="form">
                    <div class="form-group">
                        Can you answer your question with this dataset?
                        <span class="ans false pull-right" ng-class="isSet(false)"
                        ng-click="setAns(false)">
                        <i class="fa fa-close"></i>
                    </span>
                    <span class="ans true pull-right" ng-class="isSet(true)"
                    ng-click="setAns(true)">
                    <i class="fa fa-check"></i>
                </span>
            </div>
            <div class="form-group">
                <textarea class="form-control" rows="2"
                    ng-model="question.notes"
                    ng-model-options="{debounce: 750}"
                    placeholder="Notes"></textarea>
            </div>

        </form>
    </div>
</div>
</div>
</div>
