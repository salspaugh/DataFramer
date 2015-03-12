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
			                <a class="question-card-text" contenteditable>
			                    {{ question.text }}

			                </a>
			                <div ng-if="question.col_refs.length > 0">
				                <ul class="vars-on-q">
				                	<li class="var-pill label" ng-repeat ="var in question.col_refs" type="var.type">
				                		{{ getVarName(var) }}
				                	</li>
				                </ul>
				            </div>    
			                
			              
			                <div>
			                	<hr class="q-notes-divider">
			                	<span class="q-notes-label">Notes: </span>
			                	<small class="notes-section"><a class="question-card-text text-muted" contenteditable>{{ question.notes }}</a></small>
			                	
			            	</div>

			            	<div class="row q-icon-row">

		            			<span class="pull-right" tooltip="Delete this question" tooltip-placement="bottom" tooltip-append-to-body="true" ng-confirm-click="Are you sure you would like to delete this question?: \n\n{{question.text}}" confirmed-click="deleteQuestion()" >
				                    <i class="fa fa-trash-o"></i>
				                </span>
				            	
	               				<span class="dropdown pull-right control q-list-dropdown">
					            <a data-toggle="dropdown" tooltip="Move to different bin" tooltip-placement="bottom" tooltip-append-to-body="true">
					                <i class="fa fa-exchange"><span class="caret"></span></i>
					            </a>

					            <ul class="dropdown-menu" role="menu">

					            	<li role="presentation" ng-repeat="s in sections">
								      <a role="menuitem" tabindex="-1" href="#" ng-click="setAns(s.answerable)">
								        <p ng-class="{'text-muted': question.answerable == s.answerable}">Move to {{s.name}} bin</p
								      </a>
								    </li>
					            </ul>
					        	</span>
					        	<span class= "pull-right control chart-view-link">
				                	<a tooltip="Go to chart view" tooltip-placement="bottom" tooltip-append-to-body="true" ui-sref="dataset.questionSingle({question: question._id})">
				                		<i class="fa fa-bar-chart"></i>
				                	</a>
	               				</span>
			            		
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

