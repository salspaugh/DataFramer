<div>
	<div class="modal-header">
	  <button type="button" class="close pull-right" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	  <h4 class="modal-title">Add <span ng-class="currentColumn.datatype">{{ currentColumn.name }}</span> column to a question</h4>
	</div>

	<div class="modal-body">
		<ul ng-repeat= "section in sections">

			<div class="panel">
			    <div class="panel-heading" role="tab">
			        <h4 class="panel-title">
				        <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
				          {{ section.name }}
				        </a>
			        </h4>
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
				            <span class="question-card-text question-editable" contenteditable ng-keypress="editQuestion($event, question._id)">
				                {{ question.text }}
				            </span>
				            <div ng-if="question.col_refs.length > 0">
				                <ul class="vars-on-q">
				                	<li class="var-pill label" ng-repeat ="var in question.col_refs" ng-class="getVarType(var)">
				                		{{ getVarName(var) }}
				                	</li>
				                </ul>
				            </div>
				        </div>
				    </div><!-- /input-group -->
				</li>
			</div>
		</ul>

		<form onsubmit="this.reset(); return false;" name="qAdd" role="form">
            <div class="form-group">
                <label>Add a new question: </label>
                <div class="input-group">
                	<!-- <span class="input-group-addon"></span> -->
                    <input type="text" ng-model="newQuestion.text" name="text" class="form-control"/>
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
