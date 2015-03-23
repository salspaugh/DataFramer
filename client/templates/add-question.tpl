<div>

<div class="modal-header">
  <button type="button" class="close pull-right fug-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
  <p class="lead">Add <span ng-class="currentColumn.datatype">{{ currentColumn.name }}</span> column to a question</p>
</div>

<div class="modal-body">
  <div style="margin: 50px;" ng-if="questions.length == 0">
    <p class="text-center">Looks like there are no questions here yet!<br /><br />Add questions on the questions page or using the text box below.</p>
  </div>
 
  <div ng-if="questions.length > 0">
  <ul class="question-modal-list" ng-repeat="section in sections">

    <div class="panel">
      <div class="panel-heading" role="tab">
        <p class="lead">
          <a data-toggle="collapse" data-parent="#accordion" 
            style="color:#000000;" href="#collapseOne" 
            aria-expanded="true" aria-controls="collapseOne">{{section.name}}</a>
        </p>
      </div>

      <li ng-repeat="question in questions">
        <div class="input-group question-modal-wrapper" ng-if="section.answerable == question.answerable">

          <div class="input-group-addon checkbox-wrapper">
            <input type="checkbox" ng-checked="colActive(question, currentColumn._id)" ng-click="addVarToQuestion(question, currentColumn._id)" aria-label="...">
          </div>
          <div class="q-modal-item-content">

            <span ng-class="answerable(question._id)">
              <i class="fa ng-class:answerableIcon(question._id);"></i>
            </span>
            <span class="question-card-text question-editable" contenteditable ng-keypress="editQuestion($event, question._id)">{{question.text}}</span>

            <div ng-if="question.col_refs.length > 0">
              <ul class="vars-on-q">
                <li class="var-pill label" ng-repeat ="var in question.col_refs" ng-class="getVarType(var)">{{getVarName(var)}}</li>
              </ul>
            </div>
          </div>
        </div><!-- /input-group -->
      </li>

    </div>
  </ul>
  </div>

  <form onsubmit="this.reset(); return false;" name="qAdd" role="form">
  <div class="form-group">
  <div class="input-group">
    <input type="text" placeholder="Add a new question" ng-model="newQuestion.text" name="text" class="form-control"/>
    <span class="input-group-btn">
    <button ng-click="addQuestion(qAdd.text)" class="btn btn-primary">
      Add
    </button>
    </span>
  </div>
  </div>
</form>

  <!-- <span class="input-group-addon">
  <input type="checkbox" aria-label="...">
</span>
<span class="question-card-text question-editable" contenteditable ng-keypress="editQuestion($event, question._id)">
  {{ question.text }}
</span> -->
</div>

<div class="modal-footer">
 <!-- <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> -->
 <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
</div>

</div>
