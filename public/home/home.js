

(function () {
    'use strict';

    angular.module('myra').controller('HomeController', HomeController);

    HomeController.$inject = ['Authentication', 'Restangular'];

    function HomeController(Authentication, Restangular) {
        var vm = this;
        vm.getCustomerList = getCustomerList;
        vm.getTodaysInstallment = getTodaysInstallment;

        function getCustomerList() {
            vm.getTodaysInstallment();
            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                vm.customers = res.data;
                // vm.options.totalItems = res.data.length;
                // vm.options.totalItems = parseInt(res.headers('total'));
            });
        }

        function getTodaysInstallment() {
            Restangular.all('api/todaysInstallment').getList().then(function (res) {
                vm.todaysInstallment = res.data;
                // vm.options.totalItems = res.data.length;
                // vm.options.totalItems = parseInt(res.headers('total'));
            });
        }
    }

})();