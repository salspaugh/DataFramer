<!-- interface for browsing and creating questions - separated and expanded from previous version, in a single column -->

     <div id="question-wrapper">
     	<h2 id="q-list-title">My Questions</h2>
      
      	<div class="row">
		    <div ng-repeat= "section in sections" class="col-md-4 question-bin">
		    	<span class="q-section-name">{{ section.name }}</span>
		        <ul class="questions-list">
		            <li class="question-text" ng-repeat="question in questions">
		            	<div class="question-card" ng-if="section.answerable == question.answerable">
			                <span ng-class="answerable(question._id)">
			                    <i class="fa ng-class:answerableIcon(question._id);"></i>
			                </span>
			                <a ui-sref="dataset.question({questionId: question._id})" contenteditable="true">
			                    {{ question.text }}
			                </a>
			                <div ng-if="question.col_refs.length > 0">
				                <!-- <hr> -->
				                <!-- <span class="column-section">Columns: </span> -->
				                <ul class="vars-on-q">
				                	<li class="var-pill label" ng-repeat ="var in question.col_refs">
				                	{{ getVars(var) }}
				                	</li>
				                </ul>
				            </div>    
			                
			               <!--  <button type="button" class="btn btn-default pull-right" tooltip="Delete this question" tooltip-placement="bottom" tooltip-append-to-body="true" ng-click="deleteQuestion()">
			                    <i class="fa fa-minus-circle text-danger"></i>
			                </button> -->
			                <div ng-if="question.notes">
			                	<span>Notes: </span>
			                	<small class="text-muted">{{ question.notes }}</small>
			            	</div>
		                </div>
		            </li>
		        </ul>
		    </div>
		</div>

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

    </div>

