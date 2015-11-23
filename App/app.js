(function () {
    "use strict";
    var app = angular.module('ZoomCar', ['chieffancypants.loadingBar', 'ngAnimate', 'ngMap', 'angularReverseGeocode']);
    app.config(function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = true;
    })
    var products = [];
    var sepProduct = [];
    var address;
    var length;
    var apihits;
    var num;
    var likes = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];


    
    app.controller("productController", ['$scope', '$http', 'cfpLoadingBar',  function ($scope, $http, cfpLoadingBar) {
        cfpLoadingBar.start();
        $http.get("https://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel").success(function (data) {
            cfpLoadingBar.start();

            $scope.products = data;
            if (localStorage.getItem("current2") === null) {
                $scope.likes = likes;
               
            } else
            {
                $scope.likes = JSON.parse(localStorage.getItem("current2"));

            }
            $scope.sepProduct = data.parcels[0];
            $scope.length = data.parcels.length;
            $scope.num = 0;
            $scope.addr($scope.sepProduct.live_location.latitude, $scope.sepProduct.live_location.longitude)
            
            cfpLoadingBar.complete();
        });
        $http.get("https://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits").success(function (data) {
            cfpLoadingBar.start();
            $scope.api_hits = data.api_hits;
            cfpLoadingBar.complete();
        });
        

        
       $scope.addr =  function(lat,lng){
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(lat,lng);
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        $scope.address = results[1].formatted_address;
                    } else {
                        $scope.address = "Location Not Found";
                    }
                } else {
                    $scope.addres =  'Geocoder failed due to: ' + status;
                }
            });
        }

       this.like1 = function (se) {
           $scope.likes[se] = $scope.likes[se] + 1;
           localStorage.setItem("current2", JSON.stringify($scope.likes));
           $scope.likes = JSON.parse(localStorage.getItem("current2"));
        }
        this.current = 0;
        this.setCurrent = function (setCurrent) {
            cfpLoadingBar.start();
            $scope.sepProduct = $scope.products.parcels[setCurrent];
            this.current = setCurrent;
            $scope.num = setCurrent;
            $scope.addr($scope.sepProduct.live_location.latitude, $scope.sepProduct.live_location.longitude);
            cfpLoadingBar.complete();
        };
     
        cfpLoadingBar.complete();
    }]);
    app.filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(',', '');
        };
    });
})();
