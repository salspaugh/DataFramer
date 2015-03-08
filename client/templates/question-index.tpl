<!-- interface for browsing and creating questions - separated and expanded from previous version, in a single column -->

     <div id="question-wrapper">
     	<h2 id="q-list-title">My Questions</h2>
      
      	<div class="row">
		    <div ng-repeat= "section in sections" class="col-md-4 question-bin">
		    	<span class="q-section-name">{{ section.name }}</span>
		        <ul class="questions-list">
		            <li class="question-text" ng-repeat="question in questions">
		            	<div class="question-card" ng-if="section.answerable == question.answerable">

			                <span class="dropdown pull-right control q-list-dropdown">
					            <a data-toggle="dropdown" tooltip="Edit question or bin" tooltip-placement="bottom" tooltip-append-to-body="true">
					                <i class="fa fa-pencil-square"></i><span class="caret"></span>
					            </a>

					            <ul class="dropdown-menu" role="menu">
					                
					                <li role="presentation">
					                    <a role="menuitem" ng-click="setAns(true)">
					                    	Move to Keep bin
					                    </a>
					                </li>
					                <li role="presentation">
					                    <a role="menuitem" ng-click="setAns(false)">
					                    	Move to Discard bin
					                    </a>
					                </li>
					                <li role="presentation">
					                    <a role="menuitem" ng-click="setAns(null)">
					                    	Move to Undecided bin
					                    </a>
					                </li>
					               <!--  <li role="presentation">
					                    <a role="menuitem dropdown dropdown-submenu">Change bin</a>
		                              	<ul class="dropdown-menu">
		                                	<li role="menuitem "><a href="#">Page with comments</a></li>
		                                	<li role="menuitem "><a href="#">Page with comments disabled</a></li>	
		                              	</ul>
					                </li> -->
					                <li role="presentation">
					                    <a role="menuitem" ng-click="deleteQuestion()">
					                    	Go to chart view
					                    </a>
					                </li>
					                <li role="presentation">
					                    <a role="menuitem" ng-click="deleteQuestion()">
					                    	Delete this question
					                    </a>
					                </li>
					            </ul>
					        </span>

			                <span ng-class="answerable(question._id)">
			                    <i class="fa ng-class:answerableIcon(question._id);"></i>
			                </span>
			                <a contenteditable>
			                    {{ question.text }}

			                </a>
			                <div ng-if="question.col_refs.length > 0">
				                <ul class="vars-on-q">
				                	<li class="var-pill label" ng-repeat ="var in question.col_refs" type="var.type">
				                		{{ getVarName(var) }}
				                	</li>
				                </ul>
				            </div>    
			                
			              <!--   <button type="button" class="btn btn-default pull-right" tooltip="Delete this question" tooltip-placement="bottom" tooltip-append-to-body="true" ng-click="deleteQuestion()">
			                    <i class="fa fa-minus-circle text-danger"></i>
			                </button> -->

			                <div ng-if="question.notes">
			                	<hr>
			                	<span>Notes: </span>
			                	<small class="text-muted" contenteditable>{{ question.notes }}</small>
			            	</div>
			            	<div class="row chart-view-row">
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

