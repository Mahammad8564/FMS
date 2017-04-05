

(function () {
    'use strict';

    angular.module('myra').controller('CustomerController', CustomerController);

    CustomerController.$inject = ['Authentication', 'Restangular', '$state', 'SweetAlert', '$stateParams', 'Upload'];

    function CustomerController(Authentication, Restangular, $state, SweetAlert, $stateParams, Upload) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.search = search;
        vm.order = order;
        vm.activate = activate;
        vm.pageChange = pageChange;
        vm.orderDetail = orderDetail;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.today = new Date();
        vm.displayPhoto1 = displayPhoto1;
        vm.displayPhoto2 = displayPhoto2;
        vm.displayPhoto3 = displayPhoto3;
        vm.displayPhoto4 = displayPhoto4;
        vm.displayPhoto5 = displayPhoto5;
        vm.displayPhoto6 = displayPhoto6;

        function displayPhoto1(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture1 = url;
            });
        }
        function displayPhoto2(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture2 = url;
            });
        }
        function displayPhoto3(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture3 = url;
            });
        }
        function displayPhoto4(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture4 = url;
            });
        }
        function displayPhoto5(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture5 = url;
            });
        }
        function displayPhoto6(file) {
            Upload.base64DataUrl(file).then(function (url) {
                vm.localPicture6 = url;
            });
        }

        function edit(obj) {
            $state.go('secure.edit-customer', { id: obj.id });
        }
        function orderDetail(obj) {
            $state.go('secure.customer-order-detail', { customerId: obj.id });
        }

        // function save(form) {
        //     if (form.$invalid) {
        //         _.forEach(form.$error.required, function (frm) {
        //             frm.$setDirty();
        //         });
        //         vm.isSubmitted = true;
        //         return;
        //     }
        //     vm.startProcessing = true;
        //     vm.customer.UserId = Authentication.user.id;
        //     if (!vm.customer.id) {
        //         Restangular.all('api/customer').post(vm.customer).then(function (res) {
        //             SweetAlert.swal("Customer saved successfully!");
        //             $state.go('secure.customer');
        //         }, function (err) {
        //             console.log(err);
        //             vm.error = err.data.message;
        //             vm.startProcessing = false;
        //         });
        //     }
        //     else {
        //         Restangular.one('api/customer/' + vm.customer.id).patch(vm.customer).then(function (res) {
        //             SweetAlert.swal("Customer updated successfully!");
        //             $state.go('secure.customer');
        //         }, function (err) {
        //             console.log(err);
        //             vm.error = err.data.message;
        //             vm.startProcessing = false;
        //         });
        //     }
        // }

        function save(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            vm.customer.UserId = Authentication.user.id;
            if (!vm.customer.id) {
                upload('/api/customer');
            }
            else {

                if (vm.file) {
                    upload('api/customer');
                }
                else {
                    Restangular.one('api/customer/' + vm.customer.id).patch(vm.customer).then(function (res) {
                        SweetAlert.swal("customer updated successfully!");
                        // $state.go('secure.setting.style');
                    });
                }
            }
        }

        function getList() {
            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
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
        //file2: vm.file2,file3: vm.file3,file4: vm.file4,file5: vm.file5,file6: vm.file6,
        function upload(url) {
            Upload.upload({
                url: url,
                data: { file: vm.file1, customer: vm.customer }
            }).then(function (resp) {
                console.log(resp);
                SweetAlert.swal("customer saved successfully!");
                $state.go('secure.customer');
            }, function (resp) {
                console.log(resp.data);
                vm.error = resp.data.message;
                vm.startProcessing = false;
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        function activate() {
            if ($stateParams.id != 'new') {
                Restangular.one('api/customer/' + $stateParams.id).get().then(function (res) {
                    vm.customer = res.data;
                });
            }
        }

    }

})();