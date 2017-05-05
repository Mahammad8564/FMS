(function () {
    'use strict';

    angular.module('myra').controller('LateFeeController', LateFeeController);

    LateFeeController.$inject = ['Authentication','Restangular', '$state', '$stateParams'];

    function LateFeeController(Authentication,Restangular, $state, $stateParams) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.latefee = {
            isActive: true
        };
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/latefee/' + $stateParams.id).get().then(function (res) {
                vm.latefee = res.data;
            });
        }

        function edit(obj) {
            $state.go('secure.setting.edit-latefee', { id: obj.id });
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
            // vm.latefee.UserId = Authentication.user.id;
            if (!vm.latefee.id) {
                Restangular.all('api/latefee').post(vm.latefee).then(function (res) {
                    //swal("Material saved successfully!");
                    $state.go('secure.setting.latefee');
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/latefee/' + vm.latefee.id).patch(vm.latefee).then(function (res) {
                    //swal("Material updated successfully!");
                    $state.go('secure.setting.latefee');
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/latefee').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            });
        }

        function pageChange() {
            getList();
        }

        function search() {
            vm.options.page = 1;
            vm.options.where = 'title;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {
            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }

    }

})();