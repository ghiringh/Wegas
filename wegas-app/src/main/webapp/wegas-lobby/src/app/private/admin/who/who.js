angular.module('private.admin.who', [
    'wegas.service.pusher',
    'private.admin.users.edit'
])
    .config(function($stateProvider) {
        "use strict";
        $stateProvider
            .state('wegas.private.admin.who', {
                url: '/who',
                views: {
                    'admin-container': {
                        controller: 'AdminWhoCtrl as adminWhoCtrl',
                        templateUrl: 'app/private/admin/who/who.tmpl.html'
                    }
                }
            });
    })

    .controller('AdminWhoCtrl', function AdminWhoCtrl($state, $scope, $rootScope, Auth, WegasPusher, $timeout) {
        "use strict";
        var ctrl = this;
        ctrl.who = [];
        ctrl.loading = true;
        ctrl.syncing = false;
        // This message is displayed as soon as it contains a non-empty string:
        ctrl.message = "";

        // Each array entry has properties { id: integer, name: string }
        ctrl.roles = WegasPusher.getRoles();

        ctrl.sync = function() {
            ctrl.syncing = true;
            var req = WegasPusher.syncMembers();
            req.success(function(){
                ctrl.updateWhoList();
                $timeout(function(){ ctrl.syncing = false; }, 250); // The spinner should be visible at least 1/4 sec.
            });
        };

        ctrl.updateWhoList = function() {
            var req = WegasPusher.getMembers();
            req.success(function(onlineUsers) {
                ctrl.who = onlineUsers;

                ctrl.loading = false;
                if (!$rootScope.$$phase) {
                    $scope.$apply();
                }
            });

        };

        ctrl.getConnectionDate = function(user) {
            var d =new Date(user.connectionDate);
            return d.toLocaleString()
        };

        $rootScope.$on('wegaspusher:update-members', function(e) {
            ctrl.message = "";
            ctrl.updateWhoList();
        });

        $rootScope.$on('wegaspusher:service-error', function(e, msg) {
            ctrl.message = msg;
            ctrl.updateWhoList();
        });

        // Required e.g. when closing the profile edition window:
        ctrl.updateWhoList();

    });
