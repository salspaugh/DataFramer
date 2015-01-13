angular.module('data_qs',['angular-meteor', 'ui.router']);

Meteor.startup(function () {
    angular.bootstrap(document, ['data_qs']);
});
