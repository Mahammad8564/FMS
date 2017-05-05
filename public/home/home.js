

(function () {
    'use strict';

    angular.module('myra').controller('HomeController', HomeController);

    HomeController.$inject = ['Authentication', 'Restangular', '$http', '$state', '$stateParams'];

    function HomeController(Authentication, Restangular, $http, $state, $stateParams) {
        var vm = this;
        vm.today = new Date();
        vm.print = print;
        vm.activate = activate;
        vm.getTodaysInstallment = getTodaysInstallment;

        function print(divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="/lib/style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
            popupWin.document.close();
        }

        $stateParams.id = 1;

        function activate() {

            Restangular.one('api/customer/' + $stateParams.id).get().then(function (res) {
                vm.customer = res.data;
                console.log(vm.customer);
            });

            Restangular.one('api/loan/' + $stateParams.id).get().then(function (res) {
                vm.loan = res.data;
                // vm.loan.date = new Date(vm.loan.date);
                console.log(vm.loan);
            });

        }







        // vm.editCustomer = editCustomer;
        // vm.getCustomerList = getCustomerList;
        

        // function editCustomer(obj) {
        //     $state.go('secure.edit-customer', { id: obj.id });
        // }

        // function getCustomerList() {
        //     vm.getTodaysInstallment();
        //     Restangular.all('api/customer').getList(vm.options).then(function (res) {
        //         var tmp = Restangular.stripRestangular(res.data);
        //         vm.customers = tmp.filter(function (data) {
        //             return data.docStatus != 3;
        //         });
        //     });
        // }

        function getTodaysInstallment() {
            Restangular.all('api/todaysInstallment').getList().then(function (res) {
                vm.todaysInstallment = res.data;
                console.log(vm.todaysInstallment);

                // vm.options.totalItems = res.data.length;
                // vm.options.totalItems = parseInt(res.headers('total'));
            });
        }


    }

})();