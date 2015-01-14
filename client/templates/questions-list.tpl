    <div class="loadmask" ng-hide="qsReady">
        <i class="fa fa-spinner fa-spin fa-5x"></i>
    </div>
    <div ng-show="qsReady">
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
            <li ng-repeat="question in dataset.questions track by question.id">
                <span ng-class="answerable(question.id)">
                    <i class="fa ng-class:answerableIcon(question.id);"></i>
                </span>
                <a ui-sref="dataset.question({questionId: question.id})">
                    {{ question.text }}<br/>
                    <small class="text-muted">{{ question.notes }}</small>
                </a>
            </li>
        </ul>

        <h2>variables overview</h2>
        <h4>number of records: {{ dataset.rowCount }} | number of variables: {{ columns.length }}</h4>
    </div>
    <div class="row">
        <div class="col-md-6 chart-container" ng-repeat="col in columns" ng-attr-id="col-{{$index}}">
            <ng-include src="'client/templates/df_chart.tpl'"></ng-include>
        </div>
    </div>
