'use strict';
var options, tableau;

tableau = angular.module('tableauApp', ['ngSanitize', 'ngMaterial', 'ngAria', 'ngAnimate', 'oitozero.ngSweetAlert', 'ngCookies', 'mdPickers', 'angular-md5', 'ngFileUpload', 'ui.router', 'ngDialog', 'angular-jwt', 'angular-storage', 'auth0', 'ui.bootstrap.contextMenu', 'rzModule', 'daterangepicker', 'ngMessages', 'obDateRangePicker', 'ngMorph', 'anim-in-out', '720kb.tooltips', 'btford.markdown', 'textAngular', 'ngImageCache']);

options = {};

options.api = {};

options.api.base_url = "https://tp-control.travelplanet.fr:3253/api";

tableau.config(["authProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider", "jwtInterceptorProvider", function(authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).state('login.account', {
    url: '/account',
    templateUrl: 'templates/loginVerify.html',
    controller: 'loginVerifyCtrl'
  }).state('login.checkaccount', {
    url: '/verify/:username',
    templateUrl: 'templates/accountVerify.html',
    controller: 'accountVerifyCtrl'
  }).state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  }).state('home.test', {
    url: '/dashboard/:client/:id',
    templateUrl: 'templates/iterativeLayout.html',
    controller: 'iterativeLayoutCtrl'
  }).state('home.error', {
    url: '/error',
    templateUrl: 'templates/error.html',
    constroller: 'errorCtrl'
  }).state('home.test.facture', {
    url: '/factures',
    templateUrl: 'templates/facture.html',
    controller: 'factureCtrl'
  }).state('home.profil', {
    url: '/profil',
    templateUrl: 'templates/profil.html',
    controller: 'profilCtrl'
  });
  jwtInterceptorProvider.tokenGetter = [
    'store', '$http', function(store, $http) {
      return store.get('JWT');
    }
  ];
  return $httpProvider.interceptors.push('jwtInterceptor');
}]).run(["$rootScope", "jwtHelper", "$location", "store", "alertFct", function($rootScope, jwtHelper, $location, store, alertFct) {
  return $rootScope.color = "#03a9f4";
}]);

tableau.controller('accountVerifyCtrl', ["$scope", "$location", "$stateParams", "$mdDialog", "$http", "ipFct", "store", "auth", "jwtHelper", "alertFct", function($scope, $location, $stateParams, $mdDialog, $http, ipFct, store, auth, jwtHelper, alertFct) {
  var username;
  username = $stateParams.username;
  $scope.data = [];
  $http({
    method: 'POST',
    url: options.api.base_url + '/verify',
    data: {
      username: username
    }
  }).success(function(data) {
    $mdDialog.hide();
    return $scope.data = data;
  }).error(function(err) {
    alertFct.loginError();
    $mdDialog.hide();
    return $location.path("/login/account");
  });
  $scope.name = $stateParams.username;
  $scope.backtoLoggin = function() {
    store.remove('JWT');
    return $location.path("/login/account");
  };
  $scope.user_image_url = '/img/user_account.png';
  $scope.background_image_url = '/img/wallpaper_account.jpg';
  return $scope.login = function(ev) {
    $mdDialog.show({
      controller: 'loadingCtrl',
      templateUrl: 'modals/loading.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      escapeToClose: false
    });
    return $http({
      method: 'POST',
      url: options.api.base_url + '/login',
      data: {
        username: username,
        password: $scope.password
      }
    }).success(function(data) {
      store.set('JWT', data.token);
      return $location.path("/home");
    }).error(function(err) {
      alertFct.loginError();
      return $mdDialog.hide();
    });
  };
}]);

tableau.controller('factureCtrl', ["$scope", "$http", "jwtHelper", "store", "$window", "$filter", function($scope, $http, jwtHelper, store, $window, $filter) {
  var counter, decode, getFilter, max_slider, min_slider, search_date_max, search_date_min, search_name, search_num_invoice, search_price_max, search_price_min, search_type, token, value;
  token = store.get('JWT');
  search_type = "none";
  search_num_invoice = "none";
  search_name = "none";
  search_price_min = 0;
  search_price_max = 10000;
  search_date_min = "none";
  search_date_max = "none";
  counter = 0;
  min_slider = 0;
  max_slider = 0;
  value = 50;
  decode = jwtHelper.decodeToken(token);
  $scope.tototo = function(min, max) {
    search_price_min = min;
    search_price_max = max;
    $scope.data = [];
    counter = 0;
    return $scope.testFacture(0, 50);
  };
  $scope.downloadPdf = function(selected) {
    return $http({
      method: "GET",
      url: options.api.base_url + '/downloadPDF/' + selected,
      responseType: 'arraybuffer'
    }).success(function(result) {
      var anchor, blobURL, myblob;
      myblob = new Blob([result], {
        type: 'application/pdf'
      });
      blobURL = (window.URL || window.webkitURL).createObjectURL(myblob);
      anchor = document.createElement("a");
      anchor.download = selected + '.pdf';
      anchor.href = blobURL;
      return anchor.click();
    });
  };
  $scope.watchPdf = function(selected) {
    return $http({
      method: "GET",
      url: options.api.base_url + '/downloadPDF/' + selected,
      responseType: 'arraybuffer'
    }).success(function(result) {
      var file, fileUrl;
      file = new Blob([result], {
        type: 'application/pdf'
      });
      fileUrl = URL.createObjectURL(file);
      return $window.open(fileUrl, 'C-Sharpcorner', 'width=600,height=800');
    });
  };
  $scope.getValues = function(min, max) {
    if (min < 1000 || max < 1000) {
      return $scope.slider.options.step = 50;
    } else if (min > 1000 && min < 3000 || max > 1000 && max < 3000) {
      return $scope.slider.options.step = 200;
    } else {
      return $scope.slider.options.step = 500;
    }
  };
  $scope.slider = {
    min: 0,
    max: 5000,
    options: {
      floor: 0,
      ceil: 5000,
      interval: 1000,
      step: value,
      translate: function(value) {
        return value + '€';
      },
      onChange: function() {
        return $scope.getValues($scope.slider.min, $scope.slider.max);
      },
      onEnd: function() {
        return $scope.tototo($scope.slider.min, $scope.slider.max);
      }
    }
  };
  $scope.convert = function(number) {
    var numberValue;
    numberValue = number;
    return numberValue.toFixed(2);
  };
  $scope.getColor = function(color) {
    var css;
    css = 'background-color:' + color;
    return css;
  };
  getFilter = function() {
    return $http({
      method: "GET",
      url: options.api.base_url + '/rules/' + decode[0].site_id + '/' + decode[0].user_id
    }).success(function(data) {
      $scope.allow_filters.rules_filter_canFilterDate = Boolean(+data[0].rules_filter_canFilterDate);
      $scope.allow_filters.rules_filter_canFilterNameClient = Boolean(+data[0].rules_filter_canFilterNameClient);
      $scope.allow_filters.rules_filter_canFilterNumberClient = Boolean(+data[0].rules_filter_canFilterNumberClient);
      $scope.allow_filters.rules_filter_canFilterPRice = Boolean(+data[0].rules_filter_canFilterPRice);
      return $scope.allow_filters.rules_filter_canFilterType = Boolean(+data[0].rules_filter_canFilterType);
    }).error(function(err) {
      return console.log(err);
    });
  };
  getFilter();
  $scope.testFacture = function(min, max) {
    return $http({
      method: "GET",
      url: options.api.base_url + '/pdfSearchFilter/' + search_type + '/' + search_num_invoice + '/' + search_price_min + '/' + search_price_max + '/' + min + '/' + max + '/' + search_name + '/' + search_date_min + '/' + search_date_max
    }).success(function(result) {
      var number;
      number = 0;
      while (number < result.length) {
        $scope.data.push({
          num: result[number]
        });
        number++;
      }
      return counter = result.length;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.loadMore = function() {
    if ($scope.information) {

    } else if (counter === 0) {
      $scope.testFacture($scope.data.length, $scope.data.length + 50);
      return counter += 50;
    } else {
      $scope.testFacture(counter, counter + 20);
      return counter += 20;
    }
  };
  $scope.getTypeFilter = function(type) {
    search_type = type;
    $scope.data = [];
    counter = 0;
    return $scope.testFacture(0, 50);
  };
  $scope.filterFacture = function(tmpStr) {
    if (tmpStr !== void 0) {
      if (tmpStr.length === 0) {
        search_num_invoice = "none";
        $scope.data = [];
        counter = 0;
        return $scope.testFacture(0, 50);
      } else {
        search_num_invoice = tmpStr;
        $scope.data = [];
        counter = 0;
        return $scope.testFacture(0, 50);
      }
    }
  };
  $scope.filterName = function(tmpStr) {
    if (tmpStr !== void 0) {
      if (tmpStr.length === 0) {
        search_name = "none";
        $scope.data = [];
        counter = 0;
        return $scope.testFacture(0, 50);
      } else {
        search_name = tmpStr;
        $scope.data = [];
        counter = 0;
        return $scope.testFacture(0, 50);
      }
    }
  };
  $scope.filterDate = function(start, end) {
    search_date_min = $filter('date')(start._d, "yyyy-MM-dd");
    search_date_max = $filter('date')(end._d, "yyyy-MM-dd");
    $scope.data = [];
    counter = 0;
    $scope.testFacture(0, 50);
    if (start._d.length === 0 && end._d.length === 0) {
      $scope.data = [];
      counter = 0;
      search_date_min = "none";
      search_date_max = "none";
      return $scope.testFacture(0, 50);
    }
  };
  $scope.checkName = function(name) {
    var newName;
    if (!name) {
      return newName = "Information indisponible";
    } else {
      return newName = name;
    }
  };
  $scope.getColor = function(type) {
    var color;
    ({
      color: void 0
    });
    if (type === "CommercialInvoice") {
      return color = "color: #2196F3";
    } else {
      return color = "color: #F44336";
    }
  };
  $scope.menuOptions = [
    [
      'Voir', function($itemScope) {
        var facture;
        facture = $itemScope.facture.num.NUM_INVOICE;
        return $scope.watchPdf(facture);
      }
    ], null, [
      'Telecharger', function($itemScope) {
        var facture;
        facture = $itemScope.facture.num.NUM_INVOICE;
        return $scope.downloadPdf(facture);
      }
    ]
  ];
  $scope.getColorFactureType = function(type) {
    var color;
    color = void 0;
    if (type === null) {
      return color = "color: #F44336";
    }
  };
  $scope.convertSupplier = function(suplier) {
    var translated;
    translated = void 0;
    if (suplier === null) {
      return translated = "Information indisponible";
    } else {
      return translated = suplier;
    }
  };
  $scope.convertFacType = function(type) {
    var typeTranslated;
    typeTranslated = void 0;
    if (type === "CommercialInvoice") {
      return typeTranslated = "Facture";
    } else if (type === "CreditNoteGoodsAndServices") {
      return typeTranslated = "Avoir";
    } else {
      return typeTranslated = "Donnée indisponible";
    }
  };
  return $scope.testFacture(0, 40);
}]);

tableau.controller('homeCtrl', ["$scope", "$mdSidenav", "$timeout", "logoutFct", "jwtHelper", "store", "$http", "$stateParams", "$location", "$interval", "$rootScope", "$sce", "$mdDialog", function($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog) {
  var buildDelayedToggler, debounce, decode, getRandomAnimation, getRandomNumber, tick, token;
  token = store.get('JWT');
  decode = jwtHelper.decodeToken(token);
  $rootScope.color = "#EAEAEA";
  $scope.firstname = decode[0].firstname;
  $scope.lastname = decode[0].lastname;
  $scope.favorite_color = decode[0].favorite_color;
  $scope.company = decode[0].company;
  $mdDialog.hide();
  $scope.goTO = function(id, view, view_label) {
    var path;
    $mdSidenav('left').close();
    path = 'home/dashboard/' + id + '/' + view;
    return $location.path(path);
  };
  $scope.getColor = function(color) {
    var css;
    css = 'background-color:' + color;
    return css;
  };
  getRandomNumber = function() {
    var max, min, random;
    min = 2000;
    max = 7000;
    random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random;
  };
  getRandomAnimation = function() {
    var random;
    random = Math.floor((Math.random() * 3) + 1);
    if (random === 1) {
      return "slideUpDown";
    } else if (random === 2) {
      return "slideLeft";
    } else {
      return "slideRight";
    }
  };
  $http({
    method: 'GET',
    url: options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
  }).success(function(result) {
    var i, len, ref, results, values;
    $scope.viewMenu = result;
    ref = $scope.viewMenu;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      values = ref[i];
      values.view_position = getRandomNumber(1);
      values.animation = null;
      results.push(values.animation = getRandomAnimation());
    }
    return results;
  }).error(function(err) {
    return console.log(err);
  });
  $scope.logOut = function() {
    return logoutFct.logOut();
  };
  tick = function() {
    return $scope.clock = Date.now();
  };
  tick();
  $interval(tick, 1000);
  $scope.getImage = function(src) {
    var url;
    url = "img/" + src;
    return url;
  };
  debounce = function(func, wait, context) {
    var debounced, timer;
    timer = void 0;
    return debounced = function() {
      var args;
      context = $scope;
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      return timer = $timeout((function() {
        timer = 0;
        return func.apply(context, args);
      }), wait || 10);
    };
  };
  buildDelayedToggler = function(navID) {
    return debounce((function() {
      return $mdSidenav(navID).toggle().then(function() {});
    }), 200);
  };
  return $scope.toggleLeft = buildDelayedToggler('left');
}]);

tableau.controller('iframeCtrl', ["$scope", "$sce", "$http", function($scope, $sce, $http) {
  return $http({
    method: 'GET',
    url: options.api.base_url + '/SSO',
    data: {
      LOGINNAME: 'helpdesk@travelplanet.fr',
      PASSWORD: 'travel2014'
    }
  }).success(function(data) {
    console.log("c'est connecté !");
    return console.log(data);
  }).error(function(err) {
    return console.log(err);
  });
}]);

tableau.controller('isolatedStepCtrl', ["$scope", "multiStepFormScope", function($scope, multiStepFormScope) {
  $scope.user = angular.copy(multiStepFormScope.user);
  $scope.$on('$destroy', function() {
    return multiStepFormScope.user = angular.copy($scope.user);
  });
  console.log(multiStepFormScope.user);
  return console.log("ça passe par ce scope isolated");
}]);

tableau.controller('iterativeLayoutCtrl', ["$scope", "$http", "$stateParams", "$sce", "store", "jwtHelper", "$interval", "$window", "$filter", "$location", "$mdDialog", function($scope, $http, $stateParams, $sce, store, jwtHelper, $interval, $window, $filter, $location, $mdDialog) {
  var counter, decode, getTemplate, isMessage, ticket, token, trustHtml;
  token = store.get('JWT');
  decode = jwtHelper.decodeToken(token);
  $scope.actualTemplate = [];
  $scope.viewMenu = [];
  $scope.view = $stateParams.client;
  $scope.getAllView = null;
  $scope.id = $stateParams.id;
  ticket = null;
  $scope.dataWithTicket = [];
  $scope.url = [];
  $scope.url.getLength = [];
  $scope.dimension = [];
  $scope.items = [];
  $scope.test = [];
  $scope.users = [];
  $scope.data = [];
  counter = 0;
  $scope.allow_filters = [];
  $scope.userText = null;
  $scope.date = {
    startDate: null,
    endDate: null
  };
  $scope.show = false;
  $scope.display = "none";
  $scope.dynamic_rows = function() {};
  getTemplate = function(site_id, view_id) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/currentView/' + decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id + '/' + decode[0].user_auth + '/' + decode[0].user_id
    }).success(function(result) {
      $scope.getAllView = result;
      return console.log(result);
    }).error(function(err) {
      return $location.path('/home/error');
    });
  };
  getTemplate($scope.view, $scope.id);
  $scope.set_height = function(height) {
    if (height) {
      return {
        height: height
      };
    } else {
      return height = {
        height: "500px"
      };
    }
  };
  trustHtml = function(token, link) {
    var url;
    url = "https://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no';
    return url;
  };
  isMessage = function(txt, msg) {
    return txt.substring(0, msg.length) === msg;
  };
  $scope.loadingText = "Chargement de la vue en cours ...";
  $scope.urlLoadingView = "modals/loadingView.html";
  return $scope.niggeh = function(getTableau) {
    var COMPLETE_INDICATOR, LOADED_INDICATOR, placeholder, tableauOptions, url, viz, vizLoaded;
    url = trustHtml(getTableau.token, getTableau.path_to_view);
    LOADED_INDICATOR = 'tableau.loadIndicatorsLoaded';
    COMPLETE_INDICATOR = 'tableau.completed';
    placeholder = document.getElementById(getTableau.embed_id);
    vizLoaded = false;
    url = url;
    tableauOptions = {
      hideTabs: true,
      width: "100%",
      height: getTableau.embed_height,
      onFirstInteractive: function() {
        $scope.show = true;
        return $scope.display = "block";
      }
    };
    viz = new tableau.Viz(placeholder, url, tableauOptions);
    return window.addEventListener('message', function(msg) {
      if (isMessage(msg.data, LOADED_INDICATOR)) {
        vizLoaded = true;
        return $scope.display = "none";
      } else if (isMessage(msg.data, COMPLETE_INDICATOR)) {
        if (vizLoaded) {
          viz.dispose();
          return $scope.display = "block";
        } else {
          $scope.urlLoadingView = "modals/errorLoading.html";
          $scope.loadingText = "Impossible de charger cette vue";
          return $scope.display = "none";
        }
      }
    });
  };
}]);

tableau.controller('loadingCtrl', ["$scope", function($scope) {}]);

tableau.controller('logOutCtrl', ["$scope", "$location", "ngDialog", "logoutFct", function($scope, $location, ngDialog, logoutFct) {
  return $scope.confirmLogout = function() {
    var promise;
    promise = logoutFactory.logOut();
    return promise.then(data, function() {
      $location.path('/login');
      return ngDialog.close();
    })["catch"](err, function() {
      return console.log(err);
    });
  };
}]);

tableau.controller('loginCtrl', ["$scope", "$http", "jwtHelper", "store", "auth", "$location", "SweetAlert", "alertFct", "$mdDialog", "ipFct", function($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct, $mdDialog, ipFct) {
  return $location.path("/login/account");
}]);

tableau.controller('loginVerifyCtrl', ["$http", "$location", "$scope", "$mdDialog", "store", "jwtHelper", function($http, $location, $scope, $mdDialog, store, jwtHelper) {
  var decode, token;
  if (store.get('JWT')) {
    token = store.get('JWT');
    decode = jwtHelper.decodeToken(token);
    $scope.get_username = decode[0].username;
    $location.path('/login/verify/' + $scope.get_username);
  }
  $scope.background_image_url = '/img/default_account_wallpaper.jpg';
  $scope.user_image_url = '/img/travel_planet_logo.png';
  return $scope.stepVerify = function(ev) {
    $mdDialog.show({
      controller: 'loadingCtrl',
      templateUrl: 'modals/loading.html',
      parent: angular.element(document.body),
      clickOutsideToClose: false,
      escapeToClose: false
    });
    return $location.path('/login/verify/' + $scope.username);
  };
}]);

tableau.controller('profilCreateCtrl', ["$scope", function($scope) {
  $scope.steps = [
    {
      templateUrl: '/views/stepsCreateUser/stepmandatory.html'
    }, {
      templateUrl: '/modals/stepsCreateUser/optionalstep.html',
      hasForm: true,
      isolatedScope: true,
      controller: 'isolatedStepCtrl',
      title: ''
    }
  ];
  return $scope.test = function() {
    console.log($scope.user);
    console.log($scope.gender);
    return alert(salut);
  };
}]);

tableau.controller("profilCtrl", ["$scope", "$mdDialog", "$http", "$q", function($scope, $mdDialog, $http, $q) {
  $http({
    method: 'GET',
    url: options.api.base_url + '/profils/blyweereri'
  }).success(function(data) {
    console.log(data);
    return $scope.profils = data[0];
  }).error(function(err) {
    return console.log(err);
  });
  $scope.getCodeNumber = function(country) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/phoneCode/' + country
    }).success(function(data) {
      return $scope.user.phoneCode = '+' + data[0].phonecode;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.listNumTel = [];
  $scope.test = [];
  $scope.submitNumPhone = function() {
    var phoneSub;
    phoneSub = {
      code: $scope.user.phoneCode,
      numero: $scope.user.numPhone
    };
    if ($scope.user.numPhone && $scope.user.phoneCode) {
      $scope.listNumTel.push(phoneSub);
      $scope.phoneSub = {};
      $scope.phone = false;
      return $scope.ajouterNum = true;
    }
  };
  $scope.required = true;
  $scope.mois = [
    {
      name: "Janvier"
    }, {
      name: "Février"
    }, {
      name: "Mars"
    }, {
      name: "Avril"
    }, {
      name: "Mai"
    }, {
      name: "Juin"
    }, {
      name: "Juillet"
    }, {
      name: "Août"
    }, {
      name: "Septembre"
    }, {
      name: "Octobre"
    }, {
      name: "Novembre"
    }, {
      name: "Décembre"
    }
  ];
  $scope.jours = [
    {
      name: "1"
    }, {
      name: "2"
    }, {
      name: "3"
    }, {
      name: "4"
    }, {
      name: "5"
    }, {
      name: "6"
    }, {
      name: "7"
    }, {
      name: "8"
    }, {
      name: "9"
    }, {
      name: "10"
    }, {
      name: "11"
    }, {
      name: "12"
    }, {
      name: "13"
    }, {
      name: "14"
    }, {
      name: "15"
    }, {
      name: "16"
    }, {
      name: "17"
    }, {
      name: "19"
    }, {
      name: "20"
    }, {
      name: "21"
    }, {
      name: "22"
    }, {
      name: "23"
    }, {
      name: "24"
    }, {
      name: "25"
    }, {
      name: "26"
    }, {
      name: "27"
    }, {
      name: "28"
    }, {
      name: "29"
    }, {
      name: "30"
    }, {
      name: "31"
    }
  ];
  $scope.annee = [
    {
      name: 1900
    }, {
      name: 1901
    }, {
      name: 1902
    }, {
      name: 1903
    }, {
      name: 1904
    }, {
      name: 1905
    }, {
      name: 1906
    }, {
      name: 1907
    }, {
      name: 1908
    }, {
      name: 1909
    }, {
      name: 1910
    }, {
      name: 1911
    }, {
      name: 1912
    }, {
      name: 1913
    }, {
      name: 1914
    }, {
      name: 1915
    }, {
      name: 1916
    }, {
      name: 1917
    }, {
      name: 1918
    }, {
      name: 1919
    }, {
      name: 1920
    }, {
      name: 1921
    }, {
      name: 1922
    }, {
      name: 1923
    }, {
      name: 1924
    }, {
      name: 1925
    }, {
      name: 1926
    }, {
      name: 1927
    }, {
      name: 1928
    }, {
      name: 1929
    }, {
      name: 1930
    }, {
      name: 1931
    }, {
      name: 1932
    }, {
      name: 1933
    }, {
      name: 1934
    }, {
      name: 1935
    }, {
      name: 1936
    }, {
      name: 1937
    }, {
      name: 1938
    }, {
      name: 1939
    }, {
      name: 1940
    }, {
      name: 1941
    }, {
      name: 1942
    }, {
      name: 1943
    }, {
      name: 1944
    }, {
      name: 1945
    }, {
      name: 1946
    }, {
      name: 1947
    }, {
      name: 1948
    }, {
      name: 1949
    }, {
      name: 1950
    }, {
      name: 1951
    }, {
      name: 1952
    }, {
      name: 1953
    }, {
      name: 1954
    }, {
      name: 1955
    }, {
      name: 1956
    }, {
      name: 1957
    }, {
      name: 1958
    }, {
      name: 1959
    }, {
      name: 1960
    }, {
      name: 1961
    }, {
      name: 1962
    }, {
      name: 1963
    }, {
      name: 1964
    }, {
      name: 1965
    }, {
      name: 1966
    }, {
      name: 1967
    }, {
      name: 1968
    }, {
      name: 1969
    }, {
      name: 1970
    }, {
      name: 1971
    }, {
      name: 1972
    }, {
      name: 1973
    }, {
      name: 1974
    }, {
      name: 1975
    }, {
      name: 1976
    }, {
      name: 1977
    }, {
      name: 1978
    }, {
      name: 1979
    }, {
      name: 1980
    }, {
      name: 1981
    }, {
      name: 1982
    }, {
      name: 1983
    }, {
      name: 1984
    }, {
      name: 1985
    }, {
      name: 1986
    }, {
      name: 1987
    }, {
      name: 1988
    }, {
      name: 1989
    }, {
      name: 1990
    }, {
      name: 1991
    }, {
      name: 1992
    }, {
      name: 1993
    }, {
      name: 1994
    }, {
      name: 1995
    }, {
      name: 1996
    }, {
      name: 1997
    }, {
      name: 1998
    }, {
      name: 1999
    }, {
      name: 2000
    }, {
      name: 2001
    }, {
      name: 2002
    }, {
      name: 2003
    }, {
      name: 2004
    }, {
      name: 2005
    }, {
      name: 2006
    }, {
      name: 2007
    }, {
      name: 2008
    }, {
      name: 2009
    }, {
      name: 2010
    }, {
      name: 2011
    }, {
      name: 2012
    }, {
      name: 2013
    }, {
      name: 2014
    }, {
      name: 2015
    }, {
      name: 2016
    }
  ];
  $scope.ajouterNum = true;
  $scope.phone = false;
  return $scope.showme = function() {
    $scope.phone = true;
    $scope.ajouterNum = false;
    return $http({
      method: 'GET',
      url: options.api.base_url + '/getCountry'
    }).success(function(data) {
      return $scope.country_phone = data;
    }).error(function(err) {
      return console.log(err);
    });
  };
}]);



tableau.controller('reclamationCtrl', ["$scope", function($scope) {}]);

tableau.controller('rightCtrl', ["$scope", "$mdDialog", "$mdMedia", function($scope, $mdDialog, $mdMedia) {
  var DialogController;
  $scope.status = '  ';
  $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  $scope.showAlert = function(ev) {
    $mdDialog.show($mdDialog.alert().parent(angular.element(document.querySelector('#popupContainer'))).clickOutsideToClose(true).title('This is an alert title').textContent('You can specify some description text in here.').ariaLabel('Alert Dialog Demo').ok('Got it!').targetEvent(ev));
  };
  $scope.showConfirm = function(ev) {
    var confirm;
    confirm = $mdDialog.confirm().title('Would you like to delete your debt?').textContent('All of the banks have agreed to forgive you your debts.').ariaLabel('Lucky day').targetEvent(ev).ok('Please do it!').cancel('Sounds like a scam');
    $mdDialog.show(confirm).then((function() {
      $scope.status = 'You decided to get rid of your debt.';
    }), function() {
      $scope.status = 'You decided to keep your debt.';
    });
  };
  $scope.showPrompt = function(ev) {
    var confirm;
    confirm = $mdDialog.prompt().title('What would you name your dog?').textContent('Bowser is a common name.').placeholder('Dog name').ariaLabel('Dog name').initialValue('Buddy').targetEvent(ev).ok('Okay!').cancel('I\'m a cat person');
    $mdDialog.show(confirm).then((function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }), function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };
  $scope.showAdvanced = function(ev) {
    var useFullScreen;
    useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'dialog1.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: useFullScreen
    }).then((function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }), function() {
      $scope.status = 'You cancelled the dialog.';
    });
    $scope.$watch((function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }), function(wantsFullScreen) {
      $scope.customFullscreen = wantsFullScreen === true;
    });
  };
  $scope.showTabDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'tabDialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    }).then((function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }), function() {
      $scope.status = 'You cancelled the dialog.';
    });
  };
  $scope.showPrerenderedDialog = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      contentElement: '#myDialog',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true
    });
  };
  return;
  return DialogController = function($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  };
}]);


/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be in foundin the LICENSE file at http://material.angularjs.org/license.
*
 */

tableau.controller('tableauCtrl', ["$scope", "$http", "$sce", function($scope, $http, $sce) {
  return $scope.display = "none";
}]);

tableau.controller("togglerightCtrl", ["$scope", "$timeout", "$mdSidenav", "$log", function($scope, $timeout, $mdSidenav, $log) {
  var buildDelayedToggler, buildToggler, debounce;
  debounce = function(func, wait, context) {
    var timer;
    timer = void 0;
    return function() {
      var context;
      var args;
      context = $scope;
      args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout((function() {
        timer = void 0;
        func.apply(context, args);
      }), wait || 10);
    };
  };

  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  buildDelayedToggler = function(navID) {
    return debounce((function() {
      $mdSidenav(navID).toggle().then(function() {
        $log.debug('toggle ' + navID + ' is done');
      });
    }), 200);
  };
  buildToggler = function(navID) {
    return function() {
      $mdSidenav(navID).toggle().then(function() {
        $log.debug('toggle ' + navID + ' is done');
      });
    };
  };
  $scope.toggleLeft = buildDelayedToggler('left');
  $scope.toggleRight = buildToggler('right');
  return $scope.isOpenRight = function() {
    return $mdSidenav('right').isOpen();
  };
}]);

tableau.factory('alertFct', ["SweetAlert", "store", function(SweetAlert, store) {
  return {
    alertExpiration: function() {
      SweetAlert.swal({
        title: "Session Expiré",
        text: "Session expiré, retour à la page de connexion",
        type: "warning"
      });
      return store.remove('JWT');
    },
    tokenNotFound: function() {},
    loginError: function() {
      store.remove('JWT');
      return SweetAlert.swal({
        title: "Connexion refusé",
        text: "Login ou mot de passe éroné, veuillez vous reconnecter",
        type: "error"
      });
    }
  };
}]);

tableau.factory('ipFct', ["SweetAlert", "$location", "store", "$http", function(SweetAlert, $location, store, $http) {
  return {
    insertDataIp: function(action) {
      return $http({
        method: 'POST',
        url: options.api.base_url + '/rules/ip',
        data: {
          action: action
        }
      }).success(function(data) {
        return true;
      }).error(function(err) {
        return false;
      });
    }
  };
}]);

tableau.factory('logoutFct', ["SweetAlert", "$location", "store", "$rootScope", function(SweetAlert, $location, store, $rootScope) {
  return {
    logOut: function() {
      return SweetAlert.swal({
        title: "Deconnexion",
        text: "Ceci mettra fin à votre session, continuer ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Deconnexion",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        if (isConfirm) {
          if (store.get('JWT')) {
            store.remove('JWT');
            $location.path('/login/account');
            return $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')";
          } else {
            $location.path('/login/account');
            return $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')";
          }
        }
      });
    }
  };
}]);





tableau.directive('drawing', function() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      var angle, animate, centerX, centerY, ctx, cx, cy, draw, init, radius, rangeTwoX, rangeTwoY, rangeX, rangeY, ship, speed, to_radiant;
      ship = new Image();
      angle = 0;
      rangeX = 30;
      rangeY = 10;
      rangeTwoX = 150;
      rangeTwoY = 50;
      speed = 2;
      ctx = element[0].getContext('2d');
      cx = 200;
      radius = 40;
      cy = 75;
      angle = 0;
      centerX = element[0].width / 2;
      centerY = element[0].height / 2;
      to_radiant = Math.PI / 180;
      init = function() {
        ship.src = "/img/icons/plane_fixed.png";
        return window.requestAnimationFrame(animate);
      };
      draw = function(rotationY, rotationX, shipAngle) {
        ctx.clearRect(0, 0, element[0].width, element[0].height);
        ctx.save();
        ctx.beginPath();
        ctx.translate(rotationX, rotationY);
        ctx.rotate(shipAngle);
        ctx.drawImage(ship, -50, -50, 92, 92);
        ctx.stroke();
        return ctx.restore();
      };
      animate = function() {
        var drawAngle, newX, newY, rotationX, rotationY;
        ctx.clearRect(0, 0, element[0].width, element[0].height);
        newX = Math.cos((90 + angle) * to_radiant) * rangeX;
        newY = Math.sin((90 + angle) * to_radiant) * rangeY;
        rotationX = centerX - Math.cos(angle * to_radiant) * rangeTwoX;
        rotationY = centerY + Math.sin(angle * to_radiant) * rangeTwoY;
        if (angle > 0 && angle < 180) {
          drawAngle = -Math.atan(-rangeY / (rangeX * Math.tan(angle * to_radiant)));
        } else if (angle > 180 && angle < 360) {
          drawAngle = Math.PI + Math.atan(-rangeY / (rangeX * Math.tan((-angle - 180) * to_radiant)));
        } else if (angle === 180) {
          drawAngle = -90;
        } else {
          drawAngle = 90;
        }
        if (angle + speed > 360) {
          angle = 0;
        } else {
          angle += speed;
        }
        draw(rotationY, rotationX, drawAngle);
        return requestAnimationFrame(animate);
      };
      window.requestAnimationFrame(animate);
      return init();
    }
  };
});

tableau.directive('whenScrolled', function() {
  return function(scope, elm, attr) {
    var raw;
    raw = elm[0];
    return elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        return scope.$apply(attr.whenScrolled);
      }
    });
  };
});

tableau.directive('phoneInput', ["$filter", "$browser", function($filter, $browser) {
  return {
    require: 'ngModel',
    link: function($scope, $element, $attrs, ngModelCtrl) {
      var listener;
      listener = function() {
        var value;
        value = $element.val().replace(/[^0-9]/g, '');
        $element.val($filter('tel')(value, false));
      };
      ngModelCtrl.$parsers.push(function(viewValue) {
        return viewValue.replace(/[^0-9]/g, '').slice(0, 10);
      });
      ngModelCtrl.$render = function() {
        $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
      };
      $element.bind('change', listener);
      $element.bind('keydown', function(event) {
        var key;
        key = event.keyCode;
        if (key === 91 || 15 < key && key < 19 || 37 <= key && key <= 40) {
          return;
        }
        $browser.defer(listener);
      });
      $element.bind('paste cut', function() {
        $browser.defer(listener);
      });
    }
  };
}]);
