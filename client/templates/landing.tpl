<div class="landingPage">
  <nav class="navbar navbar-inverse navbar-fixed-top" id="topnav">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">DataFramer</a>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul class="nav navbar-nav">
          <li><a class="" href="#why" role="button">Why DataFramer?</a></li>
          <li><a class="" href="#how" role="button">How it works</a></li>
        </ul>

        <ul class="nav navbar-nav navbar-right">  
          <li><button class="btn btn-danger navbar-btn" ui-sref="demo" role="button">Launch the demo &raquo;</button></li>

        </ul>
      </div><!--/.navbar-collapse -->
    </div>
  </nav>

  <!-- Main jumbotron for a primary marketing message or call to action -->
  <div class="jumbotron">
    <div class="container">
      <h1>DataFramer</h1>
      <p>A visual data exploration tool with a focus on asking the right questions</p>
    </div>
  </div>

  <div class="container">
    <div class="row" id="why">
      <div class="col-md-11 col-md-offset-1">
        <h1>Why DataFramer?</h1>
      </div>
      <div class="col-md-7 col-md-offset-1">
        <p>DataFramer is an interactive tool for exploring and annotating overviews of high-dimensional datasets, inspired by the seminal principles of exploratory data analysis (EDA) and implemented with flexible web technologies. </p>
        <p>Identifying good research questions is one of the most critical and difficult steps in data science. As John Tukey, the influential statistician who popularized exploratory data analysis, put it: “Far better an approximate answer to the right question, which is often vague, than an exact answer to the wrong question, which can always be made precise.”</p>
        <p>Though exploration is thought to be an open-ended process, determining the right questions is actually a primary, concrete, and actionable end goal. It is, however, not without its challenges, and DataFramer helps users overcome them by automatically generating appropriate summary charts for various datatypes, allowing users to test their assumptions about the dataset as they generate and refine their hypotheses. </p>
        <p>The focused, minimalistic design of DataFramer strives to minimize data-driven distractions, enable rapid comprehension of the landscape of a dataset, and produce an actionable research plan to guide and support deeper analysis.</p>
      </div>
      <div class="col-md-2 col-md-offset-1">
        <h4>Developers</h4>
        <ul class="list-unstyled">
          <li>Sara Alspaugh <br>
            <span class="contact-block">
              <a href="mailto:alspaugh@eecs.berkeley.edu"><i class="fa fa-envelope"></i></a>
              <a href="https://twitter.com/salspaugh"><i class="fa fa-twitter"></i></a>
              <a href="http://www.eecs.berkeley.edu/~alspaugh/"><i class="fa fa-globe"></i></a>
            </span>
          </li>
          <li>Anna Swigart <br>
            <span class="contact-block">
              <a href="mailto:annagswigart@gmail.com"><i class="fa fa-envelope"></i></a>
            </span>
          </li>
          <li>Ian MacFarland <br>
            <span class="contact-block">
              <a href="mailto:ian.macfarland@gmail.com"><i class="fa fa-envelope"></i></a>
              <a href="https://twitter.com/macfarlandian"><i class="fa fa-twitter"></i></a>
              <a href="https://macfarlandian.withknown.com/"><i class="fa fa-globe"></i></a>
            </span>
          </li>
        </ul>
        <h4>Advisers</h4>
        <ul>
          <li><a href="http://people.ischool.berkeley.edu/~hearst/">Marti Hearst</a></li>
          <li><a href="http://bnrg.cs.berkeley.edu/~randy/">Randy Katz</a></li>
        </ul>
        <h4>More</h4>
        <ul>
          <li><a href="http://www.eecs.berkeley.edu/Pubs/TechRpts/2015/EECS-2015-208.html">Tech report</a></li>
          <li><a href="https://github.com/salspaugh/DataFramer">Code on GitHub</a></li>
        </ul>
      </div>

      <div class="spacer clearfix"></div>

      <div class="col-md-4">
        <h3 class="text-center">Question-driven workflow</h3>
        <!-- <img src="http://placehold.it/500x250" class="img-responsive"> -->
        <div class="text-center text-warning icons">
          <i class="fa fa-question-circle fa-4x"></i>
        </div>
        <p>Generate, reflect upon, and organize your potential lines of inquiry. Make deeper exploration easier by creating a persistent reference document to support your subsequent work.</p>
      </div>
      <div class="col-md-4">
        <h3 class="text-center">Automatic chart generation</h3>
        <div class="text-center text-warning icons">
          <i class="fa fa-database fa-4x"></i>
          <i class="fa fa-long-arrow-right fa-4x"></i>
          <i class="fa fa-bar-chart fa-4x"></i>
        </div>
        <p>Quickly survey your dataset while avoiding the tedium of creating the visualizations yourself. Free yourself to focus on asking questions and identifying potential invalid assumptions.</p>
      </div>
      <div class="col-md-4">
        <h3 class="text-center">Data-question linkage</h3>
        <div class="text-center text-warning icons">
          <i class="fa fa-question-circle fa-4x"></i>
          <i class="fa fa-arrows-h fa-4x"></i>
          <i class="fa fa-bar-chart fa-4x"></i>
        </div>
        <p>Tag your questions with relevant variables to easily identify the subsets you need. Easily spot potential problems, such as missing, incomplete, or erroneous entries.</p>
      </div>
      <div class="col-md-4 col-md-offset-2">
        <h3 class="text-center">Analysis without distractions</h3>
        <div class="text-center text-warning icons">
          <i class="fa fa-lightbulb-o fa-4x"></i>
        </div>
        <p>Avoid the temptation of diving into rabbit-holes before developing a broad familiarity with your data. Make solid plans instead of fancy charts.</p>
      </div>
      <div class="col-md-4">
        <h3 class="text-center">Data as a document</h3>
        <div class="text-center text-warning icons">
          <i class="fa fa-bookmark-o fa-4x"></i>
        </div>
        <p>Each dataset and question has a persistent URL that you can share, bookmark, and revisit. Runs on your local machine as well — no web server required.</p>
      </div>
    </div>

    <div class="spacer clearfix"></div>

    <div class="row" id="how">
      <div class="col-md-12">
        <h2>DataFramer in Action<br>
          <small>Watch how to get an overview of your data and organize your questions</small> 
        </h2>
      </div>
      <div class="col-md-9">
        <div class="embed-responsive embed-responsive-16by9">
          <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/szJZpGSRcXs" allowfullscreen>
          </iframe>
        </div>
        <p>
          After creating an account, users can upload CSV files to explore. Users are then directed to the Questions page, where they can create, reflect upon, and organize questions about the dataset. Before asking questions, it's useful to get an overview of the available columns in the dataset by navigating to the Charts page. In the Charts page, users can browse graphs of each of the columns, which are organized and color-coded by datatype. As the user browses, many questions will likely arise about the individual columns and how they relate. Users can create these questions and associate the relevant columns with them, to keep track of which data is needed. When users navigate back to the Questions page, their questions appear there. They can organize these questions to prioritize them for later analysis, and sort out the questions that are dead-ends, for example, because the data needed to answer them is not available. Users can also view a Details page for each question, where they can add additional columns. In the future, users will be able to combine columns in this view into compound graphs to explore the relationships between them.
        </p>
        <div class="text-center">
          <a ui-sref="demo" class="btn btn-primary btn-lg">Launch the demo &raquo;</a>
        </div>
      </div>
      <div class="col-md-3">
        <h4>Sample datasets</h4>
        <p>
          Try out DataFramer with these:  
        </p>
        <ul>
          <li><a href="movies.csv">Movies</a></li>
          <li><a href="faa-on-time-performance-sample.csv">Airline Delays</a></li>
          <li><a href="faa-wildlife-strike-clean.csv">Wildlife Strikes</a></li>
        </ul>

        <h4>Contributing to DataFramer</h4>
        <p>DataFramer is an <a href="https://github.com/salspaugh/DataFramer">open-source</a> web application coded entirely in JavaScript; it is powered by Meteor, a Node/Mongo framework that facilitates fast and easy passing of data between client and server. Page templates use <a href="https://angularjs.org/">AngularJS</a> and <a href="http://getbootstrap.com">Bootstrap</a>.</p>
        <p>Because of the ease of data transfer, this platform has the potential to enable concurrent, collaborative use of DataFramer as well. That&#39;s one of many avenues for contributing if you&#39;re interested in working on DataFramer: both techies and non-techies (designers, researchers, etc) welcome! Feel free to <a href="mailto:alspaugh@eecs.berkeley.edu">contact us</a> or check us out on <a href="https://github.com/salspaugh/DataFramer">GitHub</a>.</p>

      </div>
    </div>

  </div>
  <hr>


  <footer class="container">
    <p>
      <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
        <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" />
      </a>
      <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">DataFramer</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://dataframer.berkeley.edu" property="cc:attributionName" rel="cc:attributionURL">Sara Alspaugh, Anna Swigart, and Ian MacFarland</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
    </p>
  </footer>

</div>
