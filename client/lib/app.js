angular.module('data_qs',['angular-meteor', 'ui.router', 'ui.bootstrap']);

Meteor.startup(function () {
    angular.bootstrap(document, ['data_qs']);
});
