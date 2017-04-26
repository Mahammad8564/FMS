(function () {
    'use strict';

    angular.module('myra')
        .config(routeConfig)
        .run(highLightMenu);

    function routeConfig($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: '/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                title: 'Login',
                onEnter: ['$state', 'Authentication', function ($state, Authentication) {
                    if (Authentication.isAuthenticated()) {
                        $state.go('secure.home');
                    }
                }],
            })
            .state('secure', {
                url: '/secure',
                templateUrl: '/shared/secure.html',
                title: 'Secure',
                controller: 'SecureController',
                controllerAs: 'vm',
                abstract: true,
                onEnter: ['$state', 'Authentication', function ($state, Authentication) {
                    if (!Authentication.isAuthenticated()) {
                        $state.go('login');
                    }
                }],
            })
            .state('secure.home', {
                url: '/home',
                templateUrl: '/home/home.html',
                title: 'Home',
                highlight: 'home',
                controller: 'HomeController',
                controllerAs: 'vm'
            })
            .state('secure.customer', {
                url: '/customer',
                templateUrl: '/customer/customer.html',
                title: 'Customer',
                highlight: 'customer',
                controller: 'CustomerController',
                controllerAs: 'vm'
            })
            .state('secure.customer-order-detail', {
                url: '/customer/{customerId}/order',
                templateUrl: '/order/customer-order-detail.html',
                title: 'Customer Order',
                highlight: 'customer',
                controller: 'OrderController',
                controllerAs: 'vm'
            })
            .state('secure.edit-customer', {
                url: '/customer/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/customer/edit-customer.html',
                title: 'Customer',
                highlight: 'customer',
                controller: 'CustomerController',
                controllerAs: 'vm'
            })
            .state('secure.loan', {
                url: '/loan',
                templateUrl: '/loan/loan.html',
                title: 'Loan',
                highlight: 'loan',
                controller: 'LoanController',
                controllerAs: 'vm'
            })
            .state('secure.edit-loan', {
                url: '/loan/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/loan/edit-loan.html',
                title: 'Loan',
                highlight: 'loan',
                controller: 'LoanController',
                controllerAs: 'vm'
            })
            .state('secure.loan-detail', {
                url: '/loandetail/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/loan/loan-detail.html',
                title: 'Customer loan',
                highlight: 'loan',
                controller: 'LoanController',
                controllerAs: 'vm'
            })
            .state('secure.reports', {
                url: '/reports',
                templateUrl: '/reports/reports.html',
                title: 'Reports',
                highlight: 'reports',
                controller: 'ReportsController',
                controllerAs: 'vm'
            })
            .state('secure.setting', {
                url: '/setting',
                templateUrl: '/setting/setting.html',
                title: 'Setting',
                highlight: 'setting',
                controller: 'SettingController',
                controllerAs: 'vm',
                abstract: true
            })
            .state('secure.setting.user', {
                url: '/user',
                templateUrl: '/setting/user/user.html',
                title: 'User',
                highlight: 'user',
                highLightSetting: 'setting',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-user', {
                url: '/user/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/user/edit-user.html',
                title: 'User',
                highlight: 'user',
                highLightSetting: 'setting',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('secure.setting.reset-user', {
                url: '/user/{id}/change',
                templateUrl: '/setting/user/reset-user.html',
                title: 'User',
                highlight: 'user',
                highLightSetting: 'setting',
                controller: 'UserController',
                controllerAs: 'vm'
            })
            .state('secure.setting.agent', {
                url: '/agent',
                templateUrl: '/setting/agent/agent.html',
                title: 'Agent',
                highlight: 'agent',
                highLightSetting: 'setting',
                controller: 'AgentController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-agent', {
                url: '/agent/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/agent/edit-agent.html',
                title: 'Agent',
                highlight: 'agent',
                highLightSetting: 'setting',
                controller: 'AgentController',
                controllerAs: 'vm'
            })
            .state('secure.setting.latefee', {
                url: '/latefee',
                templateUrl: '/setting/latefee/latefee.html',
                title: 'LateFees',
                highlight: 'latefee',
                highLightSetting: 'setting',
                controller: 'AgentController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-latefee', {
                url: '/latefee/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/latefee/edit-latefee.html',
                title: 'Late Fee',
                highlight: 'latefee',
                highLightSetting: 'setting',
                controller: 'AgentController',
                controllerAs: 'vm'
            })
            .state('secure.setting.loanoption', {
                url: '/loanoption',
                templateUrl: '/setting/loanoption/loanoption.html',
                title: 'LoanOption',
                highlight: 'loanoption',
                highLightSetting: 'setting',
                controller: 'LoanOptionController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-loanoption', {
                url: '/loanoption/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/loanoption/edit-loanoption.html',
                title: 'LoanOption',
                highlight: 'loanoption',
                highLightSetting: 'setting',
                controller: 'LoanOptionController',
                controllerAs: 'vm'
            })
            ;

        $urlRouterProvider.otherwise('/login');
    }

    function highLightMenu($rootScope) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;

        });
    }

})();
