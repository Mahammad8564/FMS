

(function () {
    'use strict';

    angular.module('myra').controller('CustomerController', CustomerController);

    CustomerController.$inject = ['Authentication', 'Restangular', '$http', '$state', 'SweetAlert', '$stateParams', 'Upload'];

    function CustomerController(Authentication, Restangular, $http, $state, SweetAlert, $stateParams, Upload) {
        var vm = this;
        vm.list = [];
        vm.file = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.search = search;
        vm.order = order;
        vm.activate = activate;
        vm.download = download;
        vm.pageChange = pageChange;
        vm.editLeave = editLeave;
        vm.loanDetail = loanDetail;
        vm.addLoan = addLoan;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.customer = {};
        vm.today = new Date();
        vm.flag = false;
        vm.displayPhoto1 = displayPhoto1;
        vm.displayPhoto2 = displayPhoto2;
        vm.displayPhoto3 = displayPhoto3;
        vm.displayPhoto4 = displayPhoto4;
        vm.displayPhoto5 = displayPhoto5;
        vm.displayPhoto6 = displayPhoto6;


        function download(filename) {
            $http.get('http://localhost:3004/' + filename, { responseType: 'blob' })
                .then(function (results) {
                    var data = results.data;
                    var blob = new Blob(
                        [data],
                        { type: "image/*" }
                    );
                    saveAs(blob, filename);
                }, function (err) {

                });
        }

        function displayPhoto1(file) {
            vm.customer.image1 = file.name;
            vm.flag1 = false;
        }

        function displayPhoto2(file) {
            vm.customer.image2 = file.name;
            vm.flag1 = false;
        }

        function displayPhoto3(file) {
            vm.customer.image3 = file.name;
            vm.flag1 = false;
        }

        function displayPhoto4(file) {
            vm.customer.image4 = file.name;
            vm.flag1 = false;
        }

        function displayPhoto5(file) {
            vm.customer.image5 = file.name;
            vm.flag2 = false;
        }

        function displayPhoto6(file) {
            vm.customer.image6 = file.name;
            vm.flag2 = false;
        }

        function edit(obj) {
            $state.go('secure.edit-customer', { id: obj.id });
        }

        function editLeave(obj) {
            $state.go('secure.edit-loan', { id: obj.id });
        }

        function addLoan(obj) {
            $state.go('secure.edit-loan', { id: obj.id });
        }

        function loanDetail(obj) {
            $state.go('secure.loan-detail', { id: obj.id });
        }

        function save(form) {

            if (!vm.customer.image1 && !vm.customer.image2 && !vm.customer.image3 && !vm.customer.image4) vm.flag1 = true;
            if (!vm.customer.image5 && !vm.customer.image6) vm.flag2 = true;

            if (form.$invalid || vm.flag1 || vm.flag2) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }

            vm.startProcessing = true;
            vm.customer.UserId = Authentication.user.id;

            if ((vm.customer.image1 || vm.customer.image2 || vm.customer.image3 || vm.customer.image4) || (vm.customer.image5 || vm.customer.image6)) vm.customer.docStatus = 2;
            if ((vm.customer.image1 || vm.customer.image2 || vm.customer.image3 || vm.customer.image4) && (vm.customer.image5 || vm.customer.image6)) vm.customer.docStatus = 3;
            if (!vm.customer.image1 && !vm.customer.image2 && !vm.customer.image3 && !vm.customer.image4 && !vm.customer.image5 && !vm.customer.image6) vm.customer.docStatus = 1;

            if (!vm.customer.id) {
                upload('/api/customer');
            }

            else {

                // if (!vm.customer.image1) delete vm.customer.image1;
                // if (!vm.customer.image2) delete vm.customer.image2;
                // if (!vm.customer.image3) delete vm.customer.image3;
                // if (!vm.customer.image4) delete vm.customer.image4;
                // if (!vm.customer.image5) delete vm.customer.image5;
                // if (!vm.customer.image6) delete vm.customer.image6;

                if (vm.file.length > 0) {
                    upload('api/customer');
                }
                else {
                    Restangular.one('api/customer/' + vm.customer.id).patch(vm.customer).then(function (res) {
                        SweetAlert.swal("customer updated successfully!");
                        $state.go('secure.customer');
                    });
                }
            }
        }

        function getList() {
            Restangular.all('api/customer').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = res.data.length;
                // vm.options.totalItems = parseInt(res.headers('total'));
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

        function upload(url) {
            vm.customer = Restangular.stripRestangular(vm.customer);
            console.log(vm.customer);
            Upload.upload({
                url: url,
                data: { file: vm.file, customer: vm.customer }
            }).then(function (resp) {
                SweetAlert.swal("customer saved successfully!");
                $state.go('secure.customer');
            }, function (resp) {
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
                    if (res.data.image1) { vm.checkbox1 = true; vm.file[0] = true; }
                    if (res.data.image2) { vm.checkbox2 = true; vm.file[1] = true; }
                    if (res.data.image3) { vm.checkbox3 = true; vm.file[2] = true; }
                    if (res.data.image4) { vm.checkbox4 = true; vm.file[3] = true; }
                    if (res.data.image5) { vm.checkbox5 = true; vm.file[4] = true; }
                    if (res.data.image6) { vm.checkbox6 = true; vm.file[5] = true; }
                });
            }
        }

    }

})();