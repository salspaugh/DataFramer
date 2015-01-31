    <div class="loadmask" ng-hide="chartsReady">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div ng-show="chartsReady">
        <h2>my questions</h2>

        <form onsubmit="this.reset(); return false;" name="qAdd" role="form">
            <div class="form-group">
                <label>Add a new question: </label>
                <div class="input-group">
                    <input type="text" ng-model="newQuestion.text" name="text" class="form-control"/>
                    <span class="input-group-btn">
                        <button ng-click="addQuestion(qAdd.text)" class="btn btn-primary">
                            Add
                        </button>
                    </span>

                </div>

            </div>

        </form>

        <ul class="questions-list">
            <li ng-repeat="question in questions">
                <span ng-class="answerable(question._id)">
                    <i class="fa ng-class:answerableIcon(question._id);"></i>
                </span>
                <a ui-sref="dataset.question({questionId: question._id})">
                    {{ question.text }}
                </a>
                <button type="button" class="btn btn-default pull-right" data-toggle="tooltip" data-placement="bottom" title="Delete" ng-click="deleteQuestion()">
                    <i class="fa fa-minus-circle text-danger"></i>
                </button>
                <br/>
                <small class="text-muted">{{ question.notes }}</small>
            </li>
        </ul>

        <h2>variables overview</h2>
        <h4>number of records: {{ dataset.rowCount }} | number of variables: {{ columns.length }}</h4>
    </div>
    <div class="row">
        <div class="col-md-6 chart-container" ng-repeat="col in columns" id="{{col._id}}">
            <ng-include src="'client/templates/df_chart.tpl'"></ng-include>
        </div>
    </div>
