

(function () {
    'use strict';

    angular.module('myra').controller('HomeController', HomeController);

    HomeController.$inject = ['Authentication', 'Restangular', '$http', '$state', '$stateParams'];

    function HomeController(Authentication, Restangular, $http, $state, $stateParams) {
        var vm = this;
        vm.editCustomer = editCustomer;
        vm.getCustomerList = getCustomerList;
        vm.getTodaysInstallment = getTodaysInstallment;

        function editCustomer(obj) {
            $state.go('secure.edit-customer', { id: obj.id });
        }

        function getCustomerList() {
            vm.getTodaysInstallment();
            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                var tmp = Restangular.stripRestangular(res.data);
                vm.customers = tmp.filter(function (data) {
                    return data.docStatus != 3;
                });
                console.log(vm.customers);
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