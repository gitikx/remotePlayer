let myApp = angular.module("myApp", []);

myApp.component("mainComponent", {
    controller: function ($http) {
        let ctrl = this;

        ctrl.mode = true;

        ctrl.$onInit = function () {
            ctrl.nowPlaying = "none tracks chosen";
            ctrl.status = null;

            $http.get("/getMusic").then(result => {
                ctrl.files = result.data;
            })
        };

        ctrl.play = function (id) {
            $http({
                method: 'GET',
                url: '/play',
                params: {
                    id: id
                }
            }).then(result => {
                ctrl.status = result.data + " ";
            }, result => {
                ctrl.status = result.data + " ";
            }).finally((result) => {
                ctrl.nowPlaying = ctrl.files[id].name;
            });
        };

        ctrl.switchMode = function () {
            ctrl.mode = !ctrl.mode;
        }
    },
    templateUrl: "mainComponentTemplate.html"
});