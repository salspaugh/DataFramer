angular.module('data_qs',['angular-meteor']);

    Meteor.startup(function () {
      angular.bootstrap(document, ['data_qs']);
    });

    angular.module('data_qs').controller('VarsController', ['$scope', '$collection',
      function($scope, $collection){

        $collection(Datasets).bind($scope, 'datasets', true, true);

    }]);