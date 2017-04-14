

(function () {
    'use strict';

    angular.module('myra').controller('LoanController', LoanController);

    LoanController.$inject = ['Authentication', 'Restangular', '$state', 'SweetAlert', '$stateParams'];

    function LoanController(Authentication, Restangular, $state, SweetAlert, $stateParams) {
        var vm = this;
        vm.list = [];
        vm.paid = paid;
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.activate = activate;
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.loanDetail = loanDetail;
        vm.calculate = calculate;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.today = new Date();
        vm.getCustomerList = getCustomerList;
        vm.getLoanTypeList = getLoanTypeList;
        vm.getAgentList = getAgentList;
        vm.getCustomerByLoan = getCustomerByLoan;
        vm.changeLoanType = changeLoanType;;
        vm.selectAgent = selectAgent
        vm.hideBasicDetails = true;
        vm.includeCharges = false;
        vm.loanTenureOption = 1;

        if ($stateParams.customerId != null) {
            vm.hideBasicDetails = false;
            vm.CustomerId = $stateParams.customerId;
        }

        function changeLoanType() {
            Restangular.one('api/orderStatus/' + vm.loanTypeId).get().then(function (res) {
                vm.interestRate = res.data.interestRate;
                if (res.data.includeCharges == 1) {
                    vm.includeCharges = true;
                    vm.insOther = res.data.insOther;
                    vm.processingCharge = res.data.processingCharge;
                }
            });
        }

        function calculate(disbursementAmount, loanTenure) {
            if (vm.includeCharges) {
                vm.loan.insOther = Math.round((disbursementAmount * vm.insOther) / 10000);
                vm.loan.processingCharge = Math.round((disbursementAmount * vm.processingCharge) / 10000);
                vm.loan.loanAmount = disbursementAmount - vm.loan.insOther - vm.loan.processingCharge;
            }
        }

        function edit(obj) {
            $state.go('secure.edit-loan', { id: obj.id });
        }
        function loanDetail(obj) {
            $state.go('secure.loan-detail', { id: obj.id });
        }

        function save(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            switch (vm.loanTenureOption) {
                case 1:
                    vm.loan.installmentAmount = Math.round((((vm.loan.disbursementAmount * vm.interestRate * vm.loan.loanTenure) / (100 * 365)) + vm.loan.disbursementAmount) / vm.loan.loanTenure);
                    break;
                case 2:
                    vm.loan.installmentAmount = Math.round((((vm.loan.disbursementAmount * vm.interestRate * vm.loan.loanTenure) / (100 * 52)) + vm.loan.disbursementAmount) / vm.loan.loanTenure);
                    break;
                case 3:
                    vm.loan.installmentAmount = Math.round((((vm.loan.disbursementAmount * vm.interestRate * vm.loan.loanTenure) / (100 * 12)) + vm.loan.disbursementAmount) / vm.loan.loanTenure);
                    break;
                case 4:
                    vm.loan.installmentAmount = Math.round((((vm.loan.disbursementAmount * vm.interestRate * vm.loan.loanTenure) / 100) + vm.loan.disbursementAmount) / vm.loan.loanTenure);
                    break;

                default:
                    break;
            }
            vm.startProcessing = true;
            vm.loan.interestRate = vm.interestRate;
            vm.loan.status = 'unpaid';
            vm.loan.OrderStatusId = vm.loanTypeId;
            vm.loan.loanTenureOption = vm.loanTenureOption;
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
                    console.log(res);
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

        function getAgentList() {
            Restangular.all('api/agent').getList().then(function (res) {
                vm.agents = res.data;
            });
        }

        function selectAgent(id) {
            Restangular.one('api/customer/' + vm.customerDetail.id).patch({AgentId:id}).then(function (res) {
                console.log(res);
            }, function (err) {
                console.log(err);
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
            if ($stateParams.id != 'new') {
                Restangular.one('api/loan/' + $stateParams.id).get().then(function (res) {
                    if (res.data) { vm.hideBasicDetails = false; }

                    vm.loan = res.data;
                    vm.loan.date = new Date(vm.loan.date);
                });
            }
        }

        function getCustomerByLoan() {
            vm.headerId = $stateParams.id;
            Restangular.one('api/installment/' + $stateParams.id).get().then(function (res) {
                vm.loanDetail = res.data;
                vm.customerDetail = res.data[0].Loan.Customer;
            });
        }

        function paid(index,id) {
            
            Restangular.one('api/installment/' + id).patch({status:true,paymentDate:new Date()}).then(function (res) {
                vm.getCustomerByLoan();
            }, function (err) {
                console.log(err);
            });
            
        }

    }

})();