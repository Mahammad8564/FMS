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
            .state('secure.dashboard', {
                url: '/dashboard',
                templateUrl: '/dashboard/dashboard.html',
                title: 'Dashboard',
                highlight: 'dashboard',
                controller: 'DashboardController',
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
                url: '/customer/{customerId}/loan',
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
            .state('secure.stats', {
                url: '/stats',
                templateUrl: '/stats/stats.html',
                title: 'Stats',
                highlight: 'tats',
                controller: 'StatsController',
                controllerAs: 'vm'
            })
            .state('secure.notifications', {
                url: '/notifications',
                templateUrl: '/notifications/notifications.html',
                title: 'Notifications',
                highlight: 'notifications',
                controller: 'NotificationsController',
                controllerAs: 'vm'
            })
            .state('secure.invoice', {
                url: '/invoice',
                templateUrl: '/order/invoice.html',
                title: 'Invoice',
                highlight: 'invoice',
                controller: 'OrderController',
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
            .state('secure.setting.material', {
                url: '/material',
                templateUrl: '/setting/material/material.html',
                title: 'Material',
                highlight: 'material',
                highLightSetting: 'setting',
                controller: 'MaterialController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-material', {
                url: '/material/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/material/edit-material.html',
                title: 'Material',
                highlight: 'material',
                highLightSetting: 'setting',
                controller: 'MaterialController',
                controllerAs: 'vm'
            })
            .state('secure.setting.orderstatus', {
                url: '/orderstatus',
                templateUrl: '/setting/orderstatus/orderstatus.html',
                title: 'OrderStatus',
                highlight: 'orderstatus',
                highLightSetting: 'setting',
                controller: 'OrderStatusController',
                controllerAs: 'vm'
            })
            .state('secure.setting.edit-orderstatus', {
                url: '/orderstatus/{id}',
                params: {
                    id: { value: 'new' }
                },
                templateUrl: '/setting/orderstatus/edit-orderstatus.html',
                title: 'OrderStatus',
                highlight: 'orderstatus',
                highLightSetting: 'setting',
                controller: 'OrderStatusController',
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
