(function () {
    'use strict';

    angular.module('myra').controller('AgentController', AgentController);

    AgentController.$inject = ['Authentication','Restangular', '$state', '$stateParams'];

    function AgentController(Authentication,Restangular, $state, $stateParams) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.agent = {
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
            Restangular.one('api/agent/' + $stateParams.id).get().then(function (res) {
                vm.agent = res.data;
            });
        }

        function edit(obj) {
            $state.go('secure.setting.edit-agent', { id: obj.id });
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
            // vm.agent.UserId = Authentication.user.id;
            if (!vm.agent.id) {
                Restangular.all('api/agent').post(vm.agent).then(function (res) {
                    //swal("Material saved successfully!");
                    $state.go('secure.setting.agent');
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/agent/' + vm.agent.id).patch(vm.agent).then(function (res) {
                    //swal("Material updated successfully!");
                    $state.go('secure.setting.agent');
                }, function (err) {
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/agent').getList(vm.options).then(function (res) {
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