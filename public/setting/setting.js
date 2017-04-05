

(function () {
    'use strict';

    angular.module('myra').controller('SettingController', SettingController);

    SettingController.$inject = ['Authentication','$state'];

    function SettingController(Authentication,$state) {
        var vm = this;
        vm.resetUser = resetUser;
        
        function resetUser() {

            $state.go('secure.setting.reset-user', { id:  Authentication.user.id});
        }
    }

})();