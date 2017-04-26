(function () {
    'use strict';

    angular.module('myra').controller('SecureController', SecureController);

    SecureController.$inject = ['Authentication','$state'];
    
    function SecureController(Authentication,$state) {
        var vm = this;
        vm.user = Authentication.user;
        vm.logout = logout;

        function logout() {
            window.location.href = "/signout";
        }

    }

})();