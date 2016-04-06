'use strict';


var myApp = angular.module('dawgApp', ['ngSanitize', 'ui.router', 'firebase']);

myApp.service("user", function() {
    //this.currentUser = [];
    this.currentUser = '';
    this.cart = [];
    this.addToCart = function(newCartObject) {
        this.cart.push(newCartObject);
        console.log(this.cart);
    }
});

myApp.config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
        .state('home', {
          url: "/",
          templateUrl: "partials/home.html"
        })
        .state('cart', {
          url: "/cart",
          templateUrl: "partials/cart.html"
        })
        .state('detail', {
          url: "/bean/{id}",
          templateUrl: "partials/bean.html"
        })
        .state('order', {
          url: "/order",
          templateUrl: "partials/order.html"
        });
    })
    .controller("MainCtrl", ["user", "$firebaseAuth","$scope", function(user, $firebaseAuth, $scope) {
        var ref = new Firebase("https://glaring-inferno-9704.firebaseio.com");
        $scope.authObj = $firebaseAuth(ref);
        var authData1 = $scope.authObj.$getAuth();
        if (authData1) {
            user.currentUser = authData1.uid;
            console.log(user.currentUser);
        } else {
            ref.authAnonymously(function(error, authData) {
                if (error) {
                    console.log(error);
                } else {
                    authData1 = authData;
                    user.currentUser = authData1.uid;
                    console.log(user.currentUser);
                }
            }, {
                remember: 'sessionOnly'
            });
        }
    }])
    .controller("OrdersCtrl", ["$scope", "$http", function($scope, $http) {
       
        $http.get("data/products.json").then(function(response) {
            $scope.beans = response.data;
        });   
    }])
    .controller("BeanCtrl", ["$scope", "$stateParams", "$http", "$filter", "user", "$firebaseObject", function($scope, $stateParams, $http, $filter, user, $firebaseObject) {
        $scope.iden = $stateParams.id;
        
        var ref = new Firebase('https://glaring-inferno-9704.firebaseio.com');
        var usersRef = ref.child('allPeople');
        
        $scope.allPeople = $firebaseObject(usersRef);
        
        $scope.grinds = ["Whole Bean", "Espresso", "French Press", "Cone Drip", "Filter", "Flat Bottom filter"];
        $scope.grind = "Whole Bean";
        $scope.quantity = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        $scope.quant = "1";
        
        $http.get("data/products.json").then(function(response) {
            $scope.bean = $filter("filter")(response.data, {
                id: $scope.iden
            }, true)[0];
        }); 
        $scope.cartObject = {};
        $scope.newItem = {};
        $scope.getBeanAndPrice = function(bean, price) {
            $scope.newItem['bean'] = bean;
            $scope.newItem['price'] = price;
            $scope.newItem['grind'] = $scope.cartObject.grind;
            $scope.newItem['quantity'] = $scope.cartObject.quantity;
            console.log($scope.newItem);
        };
        $scope.addToCart = function() {
            user.addToCart($scope.newItem);
            $scope.allPeople.user.currentUser = user.cart;
            usersRef.$save();
            console.log($scope.allPeople);
        }
        
    }]);
    // .controller("CartCtrl", ["$scope", "$http", "$firebaseArray", "$firebaseObject", function($scope, $http, $firebaseArray, $firebaseObject) {
        
    // }]);