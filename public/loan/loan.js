

(function () {
    'use strict';

    angular.module('myra').controller('LoanController', LoanController);

    LoanController.$inject = ['Authentication', 'Restangular', '$state', 'SweetAlert', '$stateParams'];

    function LoanController(Authentication, Restangular, $state, SweetAlert, $stateParams) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.activate = activate;
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.loanDetail = loanDetail;
        // vm.options = {
        //     pagesize: 10,
        //     totalItems: 0,
        //     page: 1,
        //     search: ''
        // }
        vm.today = new Date();
        vm.getCustomerList = getCustomerList;
        vm.getLoanTypeList = getLoanTypeList;
        vm.getCustomerByLoan = getCustomerByLoan;
        vm.changeLoanType = changeLoanType;
        vm.hideBasicDetails = true;

        if ($stateParams.customerId != null) {
            vm.hideBasicDetails = false;
            vm.CustomerId = $stateParams.customerId;
        }

        function edit(obj) {
            $state.go('secure.edit-loan', { id: obj.id });
        }
        function loanDetail(obj) {
            $state.go('secure.loan-detail', { customerId: obj.id });
        }

        function save(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            vm.loan.installmentAmount = 76787;
            vm.loan.interestRate = vm.interestRate;
            vm.loan.otherCharges = vm.otherCharges;
            vm.loan.status = 'unpaid';
            vm.loan.OrderStatusId = vm.loanTypeId;
            if (vm.customer) {
                Restangular.all('api/customer').post({ customer: vm.customer }).then(function (res) {
                    // SweetAlert.swal("customer saved successfully!");
                    // $state.go('secure.loan');
                    vm.loan.CustomerId = res.data.id;
                    Restangular.all('api/loan').post(vm.loan).then(function (res) {
                        SweetAlert.swal("loan saved successfully!");
                        $state.go('secure.loan');
                    }, function (err) {
                        console.log(err);
                        vm.error = err.data.message;
                        vm.startProcessing = false;
                    });

                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });

            }
            else if (!vm.loan.id) {
                vm.loan.CustomerId = vm.CustomerId;
                Restangular.all('api/loan').post(vm.loan).then(function (res) {
                    SweetAlert.swal("loan saved successfully!");
                    $state.go('secure.loan');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/loan/' + vm.loan.id).patch(vm.loan).then(function (res) {
                    SweetAlert.swal("loan updated successfully!");
                    $state.go('secure.loan');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/loan').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            });
        }

        function getCustomerList() {
            Restangular.all('api/customer').getList().then(function (res) {
                vm.customers = res.data;
            });
        }

        function getLoanTypeList() {
            Restangular.all('api/orderStatus').getList().then(function (res) {
                vm.loanTypes = res.data;
            });
        }

        function pageChange() {
            getList();
        }
        function search() {
            vm.options.page = 1;
            vm.options.where = 'name;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {

            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }

        function activate() {
            Restangular.one('api/loan/' + $stateParams.id).get().then(function (res) {
                if (res.data) { vm.hideBasicDetails = false; }

                vm.loan = res.data;
                vm.loan.date = new Date(vm.loan.date);
            });
        }

        function getCustomerByLoan() {
            Restangular.one('api/loan/' + $stateParams.customerId).get().then(function (res) {
                vm.customerDetails = res.data;
            });
        }

        function changeLoanType() {
            Restangular.one('api/orderStatus/' + vm.loanTypeId).get().then(function (res) {
                vm.interestRate = parseInt(res.data.interestRate);
                vm.otherCharges = parseInt(res.data.otherCharges);
            });
        }

    }

})();