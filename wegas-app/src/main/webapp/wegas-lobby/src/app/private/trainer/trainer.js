angular.module('private.trainer', [
    'private.trainer.directives',
    'private.trainer.archives',
    'private.trainer.users',
    'private.trainer.settings'
])
.config(function ($stateProvider) {
    $stateProvider
        .state('wegas.private.trainer', {
            url: 'trainer',
            views: {
                'workspace': {
                    controller: 'TrainerCtrl as trainerCtrl',
                    templateUrl: 'app/private/trainer/trainer.tmpl.html'
                }
            }
        })
    ;
})
.controller('TrainerCtrl', function TrainerCtrl($rootScope, $state, Auth, $translate, WegasTranslations) {
    Auth.getAuthenticatedUser().then(function(user){
        if(user != null){
            if(!user.isAdmin && !user.isScenarist && !user.isTrainer){
                $state.go("wegas.private.player");
            }
            $("body").removeClass("player scenarist admin").addClass("trainer");
            $rootScope.translationWorkspace = {workspace: WegasTranslations.workspaces['TRAINER'][$translate.use()]};
        }
    });
})
;
