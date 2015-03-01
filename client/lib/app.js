angular.module('dataFramer',['angular-meteor', 'ui.router', 'ui.bootstrap']);

Meteor.startup(function () {
    angular.bootstrap(document, ['dataFramer']);
});
