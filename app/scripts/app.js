
//require('./landing');
//require('./album');
//require('./collection');
//require('./profile');
console.log(angular);


angular.module('BlocJams', []).controller('Landing.controller', ['$scope', function($scope) {
 $scope.subText = "Turn the music up!";
}]);