<div ng-if="questionsLoading" ng-include="'client/templates/loading.tpl'"></div>

<!-- Interface for browsing and creating questions - separated and expanded from previous version, in a single column -->

<div id="question-wrapper" ng-if="!questionsLoading">

<div class="row">

  <div ng-repeat="section in sections" class="col-md-4 question-bin">

    <p class="q-section-name lead">{{ section.name }}</p>

    <ul class="questions-list">
      <li class="question-text" ng-repeat="question in questions track by question._id" ng-if="section.answerable == question.answerable">
        <div class="question-card" >

          <span ng-class="answerable(question._id)">
            <i class="fa ng-class:answerableIcon(question._id);"></i>
          </span>

          <span class="question-card-text question-editable" contenteditable ng-keypress="editQuestion($event, question._id)">
            {{ question.text }}
          </span>

          <div ng-if="question.col_refs.length > 0">
            <ul class="vars-on-q">
              <li class="var-pill label" ng-repeat="var in question.col_refs" ng-class="getVarType(var)">
                {{getVarName(var)}}
              </li>
            </ul>
          </div>

          <div class="row q-icon-row">

            <span class="pull-right" 
              tooltip="Delete this question" tooltip-placement="bottom" tooltip-append-to-body="true" 
              ng-confirm-click="Are you sure you would like to delete this question?: \n\n{{question.text}}" 
              confirmed-click="deleteQuestion()">
              <i class="fa fa-trash-o icon-grey fa-lg"></i>
            </span>

            <span class="dropdown pull-right control q-list-dropdown">

              <a data-toggle="dropdown" tooltip="Move to different pile" tooltip-placement="bottom" tooltip-append-to-body="true">
                <i class="fa fa-arrow-left icon-grey fa-lg" style="margin-right: -3px;"></i>
                <i class="fa fa-arrow-right icon-grey fa-lg" style="margin-left: -3px;"><span class="caret"></span></i>
              </a>

              <ul class="dropdown-menu" role="menu">
                <li role="presentation" ng-repeat="s in sections">
                  <a role="menuitem" tabindex="-1" href="#" ng-click="setAns(s.answerable)">
                    <p ng-class="{'text-muted': question.answerable == s.answerable}">M<span class="text-lowercase">ove to {{s.name}} pile</span></p>
                  </a>
                </li>
              </ul>

            </span>

            <span class= "pull-right control chart-view-link">
              <a tooltip="Go to question details" tooltip-placement="bottom" tooltip-append-to-body="true" 
                ui-sref="dataset.questionSingle({questionId: question._id})">
                <i class="fa fa-bar-chart icon-grey fa-lg"></i>
              </a>
            </span>

          </div>

        </div>
      </li>
    </ul>
  </div>
</div>

<div style="margin: 50px;" ng-if="questions.length == 0">
  <p class="text-center">Looks like there are no questions here yet! Check out the charts to get started.</p>
</div>

<form onsubmit="this.reset(); return false;" name="qAdd" role="form">
  <div class="form-group question-index-input">

    <!--<label>Add a new question: </label>-->

    <div class="input-group">
      <input type="text"  placeholder="Add a new question"
        ng-model="newQuestion.text" name="text" class="form-control"/>
      <span class="input-group-btn">
        <button ng-click="addQuestion(qAdd.text)" class="btn btn-primary">Add</button>
      </span>
    </div>

  </div>
</form>

</div>
