

(function () {
    'use strict';

    angular.module('myra').controller('LoanController', LoanController);

    LoanController.$inject = ['Authentication', 'Restangular', '$state', '$stateParams'];

    function LoanController(Authentication, Restangular, $state, $stateParams) {
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

        if ($stateParams.id != 'new') {
            vm.hideBasicDetails = false;
            vm.CustomerId = $stateParams.id;
        }

        function changeLoanType() {
            Restangular.one('api/orderStatus/' + vm.loanTypeId).get().then(function (res) {
                vm.interestRate = res.data.interestRate/1200;
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
            else {
                // vm.loan.insOther = Math.round((disbursementAmount * vm.insOther) / 10000);
                // vm.loan.processingCharge = Math.round((disbursementAmount * vm.processingCharge) / 10000);
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
                    vm.loan.installmentAmount = Math.round((vm.loan.disbursementAmount * vm.interestRate * Math.pow((1 + vm.interestRate), (vm.loan.loanTenure / 30))) / (Math.pow((1 + vm.interestRate), (vm.loan.loanTenure / 30)) - 1));
                    break;
                case 2:
                    vm.loan.installmentAmount = Math.round((vm.loan.disbursementAmount * vm.interestRate * Math.pow((1 + vm.interestRate), (vm.loan.loanTenure / 4))) / (Math.pow((1 + vm.interestRate), (vm.loan.loanTenure / 4)) - 1));
                    break;
                case 3:
                    vm.loan.installmentAmount = Math.round((vm.loan.disbursementAmount * vm.interestRate * Math.pow((1 + vm.interestRate), vm.loan.loanTenure)) / (Math.pow((1 + vm.interestRate), vm.loan.loanTenure) - 1));
                    break;
                case 4:
                    vm.loan.installmentAmount = Math.round((vm.loan.disbursementAmount * vm.interestRate * Math.pow((1 + vm.interestRate), (vm.loan.loanTenure * 12))) / (Math.pow((1 + vm.interestRate), (vm.loan.loanTenure * 12)) - 1));
                    break;

                default:
                    break;
            }
            vm.startProcessing = true;
            vm.loan.interestRate = vm.interestRate;
            vm.loan.status = 'Unpaid';
            vm.loan.OrderStatusId = vm.loanTypeId;
            vm.loan.loanTenureOption = vm.loanTenureOption;
            if (vm.customer) {
                Restangular.all('api/customer').post({ customer: vm.customer }).then(function (res) {
                    vm.loan.CustomerId = res.data.id;
                    Restangular.all('api/loan').post(vm.loan).then(function (res) {
                        SweetAlert.swal("loan saved successfully!");
                        // $state.go('secure.loan');
                        $state.go('secure.loan-detail', { id: res.data.id });
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
                    // $state.go('secure.loan');
                    $state.go('secure.loan-detail', { id: res.data.id });
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/loan/' + vm.loan.id).patch(vm.loan).then(function (res) {
                    SweetAlert.swal("loan updated successfully!");
                    // $state.go('secure.loan');
                    $state.go('secure.loan-detail', { id: res.data.id });
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
            Restangular.one('api/loan/' + $stateParams.id).patch({ AgentId: id }).then(function (res) {
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
                    vm.loan = res.data;
                    vm.loan.date = new Date(vm.loan.date);
                });
            }
        }

        function getCustomerByLoan() {
            vm.headerId = $stateParams.id;
            Restangular.one('api/installment/' + $stateParams.id).get().then(function (res) {
                
                var groupedByMonth = _.groupBy(res.data, function (item) {
                    return item.dueDate.substring(0, 7);
                });
                vm.loanDetail = res.data;
                vm.customerDetail = res.data[0].Loan.Customer;
                vm.AgentId = res.data[0].Loan.AgentId;
                vm.allPaid = true;
                res.data.forEach(function (element) {
                    if (element.status == 0) {
                        vm.allPaid = false;
                    }
                }, this);
                if (vm.allPaid) {
                    Restangular.one('api/loan/' + $stateParams.id).patch({ status: 'Paid' }).then(function (res) {
                    }, function (err) {
                        console.log(err);
                    });
                }
            });
        }

        function paid(index, id) {

            Restangular.one('api/installment/' + id).patch({ status: true, paymentDate: new Date() }).then(function (res) {
                vm.getCustomerByLoan();
            }, function (err) {
                console.log(err);
            });

        }

    }

})();