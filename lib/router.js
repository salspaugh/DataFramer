// global layout template
Router.configure({
  layoutTemplate: 'twoColumns'
});

Router.route('/', function () {
  this.render('dataset');
});
  this.render('datasets', {to: 'main'});
});

// uploader control
Router.route('/upload', function(){
    this.render('upload', {to: 'sidebar-top'});
})