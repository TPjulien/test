'use strict';
var getBase2, getResultBase2, options, tableau;

tableau = angular.module('tableauApp', ['ngSanitize', 'ngMaterial', 'ngAria', 'ngAnimate', 'oitozero.ngSweetAlert', 'ngFileUpload', 'ui.router', 'angular-jwt', 'angular-storage', 'auth0', 'ui.bootstrap', 'ngMessages', 'anim-in-out', 'ngTable', 'md.data.table', 'smDateTimeRangePicker', 'vAccordion', 'wysiwyg.module', 'colorpicker.module', 'ngMap', 'ngIdle', 'vcRecaptcha', '720kb.datepicker']);

options = {};

options.api = {};

getBase2 = function() {
  var base, i, result;
  result = [];
  base = 32;
  i = 0;
  while (i < 32) {
    result.push(Math.pow(2, i));
    i++;
  }
  return result;
};

getResultBase2 = getBase2();

options.api.base_url = "https://api.tp-control.travelplanet.fr";

tableau.config(["authProvider", "$stateProvider", "$urlRouterProvider", "$httpProvider", "jwtInterceptorProvider", "$mdThemingProvider", "pickerProvider", "IdleProvider", "KeepaliveProvider", function(authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, $mdThemingProvider, pickerProvider, IdleProvider, KeepaliveProvider) {
  pickerProvider.setOkLabel('Enregistrer');
  pickerProvider.setCancelLabel('Fermer');
  pickerProvider.setDayHeader('shortName');
  pickerProvider.setDaysNames([
    {
      'single': 'D',
      'shortName': 'Dim',
      'fullName': 'Dimanche'
    }, {
      'single': 'L',
      'shortName': 'Lun',
      'fullName': 'Lundi'
    }, {
      'single': 'M',
      'shortName': 'Mar',
      'fullName': 'Mardi'
    }, {
      'single': 'M',
      'shortName': 'Mer',
      'fullName': 'Mercredi'
    }, {
      'single': 'J',
      'shortName': 'Jeu',
      'fullName': 'Jeudi'
    }, {
      'single': 'V',
      'shortName': 'Ven',
      'fullName': 'Vendredi'
    }, {
      'single': 'S',
      'shortName': 'Sam',
      'fullName': 'Samedi'
    }
  ]);
  pickerProvider.setDivider('au');
  pickerProvider.setMonthNames(["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Novembre", "Decembre"]);
  pickerProvider.setRangeDefaultList([
    {
      label: "Aujourd'hui",
      startDate: moment().startOf('day'),
      endDate: moment().endOf('day')
    }, {
      label: "7 derniers jours",
      startDate: moment().subtract(7, 'd'),
      endDate: moment()
    }, {
      label: "Ce mois-ci",
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }, {
      label: "Mois Dernier",
      startDate: moment().subtract(1, 'month').startOf('month'),
      endDate: moment()
    }, {
      label: "Les 3 derniers mois",
      startDate: moment().subtract('quarter'),
      endDate: moment().endOf('quarter')
    }, {
      label: "Jusqu'a aujourd'hui",
      startDate: moment().startOf('year'),
      endDate: moment()
    }, {
      label: "cette année",
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year')
    }, {
      label: "Autre",
      startDate: 'custom',
      endDate: 'custom'
    }
  ]);
  pickerProvider.setRangeCustomStartEnd(["Date de début", "Date de fin"]);
  $urlRouterProvider.otherwise('/login');
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).state('saml', {
    url: '/SAML/:tokenSaml',
    templateUrl: 'templates/samlCheck.html',
    controller: 'samlCtrl'
  }).state('gallery', {
    url: '/gallery',
    templateUrl: 'templates/gallery.html',
    controller: 'galleryCtrl'
  }).state('getImage', {
    url: '/img/:filename',
    templateUrl: 'templates/img.html',
    controller: 'imgCtrl'
  }).state('login.account', {
    url: '/account',
    templateUrl: 'templates/loginVerify.html',
    controller: 'loginVerifyCtrl'
  }).state('login.checkaccount', {
    url: '/verify/:Login/:SITE_ID',
    templateUrl: 'templates/accountVerify.html',
    controller: 'accountVerifyCtrl'
  }).state('login.comunity', {
    url: '/comunity',
    templateUrl: 'templates/comunityList.html',
    params: {
      data: null,
      username: null
    },
    controller: 'communityCtrl'
  }).state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  }).state('home.test', {
    url: '/dashboard',
    controller: 'iterativeLayoutCtrl',
    params: {
      embeds: null
    },
    templateUrl: 'templates/iterativeLayout.html'
  }).state('home.error', {
    url: '/error',
    templateUrl: 'templates/error.html',
    constroller: 'errorCtrl'
  }).state('home.test.facture', {
    url: '/factures',
    templateUrl: 'templates/datatable.html',
    controller: 'datatableCtrl'
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
  $httpProvider.interceptors.push('jwtInterceptor');
  IdleProvider.idle(600);
  IdleProvider.timeout(120);
  return KeepaliveProvider.interval(5);
}]);

tableau.controller('accountVerifyCtrl', ["$scope", "$location", "$stateParams", "$mdDialog", "$http", "ipFct", "store", "auth", "jwtHelper", "alertFct", function($scope, $location, $stateParams, $mdDialog, $http, ipFct, store, auth, jwtHelper, alertFct) {
  var Login, SITE_ID, verifyAccount;
  $scope.name = $stateParams.username;
  SITE_ID = $stateParams.SITE_ID;
  Login = $stateParams.Login;
  $scope.user_image_url = '/img/user_account.png';
  $scope.background_image_url = '/img/wallpaper_account.jpg';
  $scope.data = [];
  verifyAccount = function() {
    return $http({
      method: 'POST',
      url: options.api.base_url + '/verify/' + Login + '/' + SITE_ID,
      data: {
        SITE_ID: SITE_ID,
        username: Login
      }
    }).success(function(data) {
      $mdDialog.hide();
      return $scope.data = data;
    }).error(function(err) {
      alertFct.loginError();
      $mdDialog.hide();
      return $location.path("/login/account");
    });
  };
  verifyAccount();
  $scope.backToCommu = function() {
    store.remove('JWT');
    return $location.path("/login/account");
  };
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
        SITE_ID: SITE_ID,
        username: Login,
        password: $scope.password
      }
    }).success(function(data) {
      var get_action;
      store.set('JWT', data.token);
      if (store.get('JWT')) {
        get_action = "Logged with click";
        ipFct.insertDataIp(get_action);
      }
      return $location.path("/home");
    }).error(function(err) {
      alertFct.loginError();
      return $mdDialog.hide();
    });
  };
}]);

tableau.controller('aetmCtrl', ["$scope", "$sce", "$http", "tokenFactory", "store", "jwtHelper", "toastErrorFct", "$mdDialog", function($scope, $sce, $http, tokenFactory, store, jwtHelper, toastErrorFct, $mdDialog) {
  var getDataToken, site_id, uid;
  getDataToken = tokenFactory.tokenData();
  site_id = getDataToken.site_id + getDataToken.site_id;
  uid = getDataToken.UID;
  return $http({
    method: 'GET',
    url: 'https://api.tp-control.travelplanet.fr/aetmConnect/' + uid + '/' + site_id,
    data: {
      UID: getDataToken.UID
    }
  }).success(function(data) {
    $scope.LOGINNAME = data[0].LOGINNAME;
    $scope.SITE = data[0].SITE_ID;
    $scope.LANGUAGE = data[0].LANGUAGE;
    $scope.LOGIN_TYPE = "SSO";
    $scope.PASSWORD = data[0].PWD.replace(/"/g, "");
    return setTimeout((function() {
      return document.getElementById('formSubmit').click();
    }), 0);
  }).error(function(err) {
    console.log(err);
    return toastErrorFct.toastError("Impossible de se connecter au serveur d'aetm, veuillez retenter plus tard");
  });
}]);

tableau.controller('alertTableauCtrl', ["$scope", "$http", "$sce", "$stateParams", "jwtHelper", "store", function($scope, $http, $sce, $stateParams, jwtHelper, store) {
  var getTableau, getTableauToken, isMessage, onMarksSelection, reportSelectedMarks;
  $scope.init = function() {
    return getTableauToken();
  };
  isMessage = function(txt, msg) {
    return txt.substring(0, msg.length) === msg;
  };
  getTableauToken = function() {
    var url;
    url = options.api.base_url + '/tokenExchange';
    return $http.post(url, {
      tableau_site: "Customer",
      user_name: "Q1OAtravelpsup"
    }).then(function(data) {
      $scope.tableauToken = data.data.token;
      return getTableau();
    });
  };
  $scope.trustHtml = function() {
    var tableau_url, url;
    tableau_url = null;
    tableau_url = '/t/' + "Customer" + '/views/getData/Sheet1?:embed=yes&:toolbar=no';
    url = "https://data.travelplanet.fr/trusted/" + $scope.tableauToken + tableau_url;
    return url;
  };
  $scope.listenToMarksSelection = function() {
    $scope.viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
  };
  onMarksSelection = function(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks);
  };
  reportSelectedMarks = function(marks) {
    var html, infoDiv, markIndex, pair, pairIndex, pairs;
    html = '';
    markIndex = 0;
    while (markIndex < marks.length) {
      pairs = marks[markIndex].getPairs();
      html += '<b>Mark ' + markIndex + ':</b><ul>';
      pairIndex = 0;
      while (pairIndex < pairs.length) {
        pair = pairs[pairIndex];
        html += '<li><b>Field Name:</b> ' + pair.fieldName;
        html += '<br/><b>Value:</b> ' + pair.formattedValue + '</li>';
        pairIndex++;
      }
      html += '</ul>';
      markIndex++;
    }
    infoDiv = document.getElementById('markDetails');
    infoDiv.innerHTML = html;
  };
  getTableau = function() {
    var COMPLETE_INDICATOR, LOADED_INDICATOR, placeholder, tableauOptions, url, vizLoaded;
    url = $scope.trustHtml();
    LOADED_INDICATOR = 'tableau.loadIndicatorsLoaded';
    COMPLETE_INDICATOR = 'tableau.completed';
    placeholder = document.getElementById("vizContainer_2");
    vizLoaded = false;
    url = url;
    tableauOptions = {
      hideTabs: true,
      width: "100%",
      height: "800px",
      hideToolbar: true,
      onFirstInteractive: function() {
        $scope.listenToMarksSelection();
        return document.getElementById('getData').disabled = false;
      }
    };
    return $scope.viz = new tableau.Viz(placeholder, url, tableauOptions);
  };
  $scope.exportToPDF = function() {
    $scope.viz.showExportPDFDialog();
  };
  $scope.data_get = [];
  return $scope.getUnderlyingData = function() {
    var options, sheet;
    sheet = $scope.viz.getWorkbook().getActiveSheet();
    options = {
      maxRows: 10,
      ignoreSelection: true,
      ignoreAliases: false,
      includeAllColumns: false
    };
    return sheet.getUnderlyingDataAsync(options).then(function(t) {
      var table, tgt;
      table = t;
      $scope.data_get = JSON.stringify(table.getData());
      tgt = document.getElementById('dataTarget');
      return tgt.innerHTML = '<h4>Underlying Data:</h4><p>' + JSON.stringify(table.getData()) + '</p>';
    });
  };
}]);

tableau.controller('cacheCtrl', ["$scope", function($scope) {
  $scope.getRandomSpan = function() {
    return Math.floor((Math.random() * 6) + 1);
  };
  $scope.cacheNum = $scope.getRandomSpan();
  $scope.styleCached = "css/tableau-styles.css?v=" + $scope.cacheNum;
  return $scope.componentsCached = "css/tableau-components.css?v=" + $scope.cacheNum;
}]);

tableau.controller('communityCtrl', ["$scope", "$stateParams", "$http", "$location", "toastErrorFct", "$window", "$state", "$mdDialog", "store", "ipFct", "alertFct", "vcRecaptchaService", function($scope, $stateParams, $http, $location, toastErrorFct, $window, $state, $mdDialog, store, ipFct, alertFct, vcRecaptchaService) {
  var getCommunity, loginData, token, username;
  $scope.background_image_url = '/img/default_account_wallpaper.jpg';
  $scope.user_image_url = '/img/travel_planet_logo.png';
  $scope.checkCommunity = true;
  $scope.labelCommunities = [];
  loginData = $stateParams.data;
  username = $stateParams.username;
  $scope.communityChecked = false;
  $scope.idSelected = null;
  $scope.actualCommunity = [];
  $scope.captcha = true;
  $scope.comText = "Sélection de la communauté";
  $scope.choosed = function(data) {
    console.log("ceci est le login:", data);
    if (data.shib !== void 0) {
      if ((Object.keys(data.shib).length) !== 0) {
        return $http.post('https://api.tp-control.travelplanet.fr/setup', {
          login: data.login,
          url: data.shib.shib_url,
          field: data.shib.shib_field,
          siteID: data.site_id,
          issuer: data.shib.entity_id
        }).then(function(result) {
          return $window.location.href = "https://api.tp-control.travelplanet.fr/postShibboleth";
        });
      } else {
        $scope.actualCommunity = data;
        $scope.idSelected = data.label;
        return $scope.checkCommunity = false;
      }
    } else {
      $scope.actualCommunity = data;
      $scope.idSelected = data.label;
      return $scope.checkCommunity = false;
    }
  };
  getCommunity = function() {
    var i, key, len, temp;
    temp = [];
    if (loginData) {
      for (i = 0, len = loginData.length; i < len; i++) {
        key = loginData[i];
        temp.push(key.site_id);
      }
    }
    return $http.post('https://api.tp-control.travelplanet.fr/comSelect', {
      tabIn: temp,
      values: ["base", "sites"]
    }).then(function(result) {
      var id, j, len1, ref, tempLoop, tempResult, value;
      tempResult = [];
      ref = result.data;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        value = ref[j];
        id = value.id.toString() + value.id.toString();
        tempLoop = angular.fromJson(value.js_data);
        if (tempLoop.label.indexOf('{"label"') === -1) {
          tempResult.push({
            login: username,
            label: tempLoop.label,
            shib: tempLoop.shib,
            site_id: id
          });
          $scope.labelCommunities.push(tempLoop.label);
        }
        id = null;
      }
      $scope.communities = tempResult;
      if ($scope.communities.length === 0 && loginData) {
        toastErrorFct.toastError("L'utilisateur : " + username + " n'existe pas");
        return $state.go('login.account');
      } else if ($scope.communities.length === 1) {
        if ($scope.communities[0].shib) {
          return $http.post('https://api.tp-control.travelplanet.fr/setup', {
            url: $scope.communities[0].shib.shib_url,
            field: $scope.communities[0].shib.shib_field,
            siteID: $scope.communities[0].site_id,
            issuer: $scope.communities[0].shib.entity_id,
            login: $scope.communities[0].login
          }).then(function(result) {
            return $window.location.href = "https://api.tp-control.travelplanet.fr/postShibboleth";
          });
        } else {
          $scope.comText = "Votre communauté";
          $scope.actualCommunity = $scope.communities[0];
          $scope.idSelected = $scope.communities[0].label;
          return $scope.checkCommunity = false;
        }
      } else {
        $scope.comText = "Votre communauté";
        $scope.actualCommunity = $scope.communities[0];
        $scope.idSelected = $scope.communities[0].label;
        return $scope.checkCommunity = false;
      }
    });
  };
  getCommunity();
  $scope.setResponse = function(data) {
    return $scope.captcha = false;
  };
  token = function(data, callback) {
    var get_action;
    store.set('JWT', data.token);
    if (store.get('JWT')) {
      get_action = "Logged with click";
      ipFct.insertDataIp(get_action);
    }
    return callback(true);
  };
  return $scope.login = function() {
    var parameters, siteId;
    if ($scope.password.length <= 3) {
      return toastErrorFct.toastError("Erreur, le mot de passe est trop court");
    } else {
      $mdDialog.show({
        controller: 'loadingCtrl',
        templateUrl: 'modals/loading.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false,
        escapeToClose: false
      });
      siteId = $scope.actualCommunity.site_id;
      if (siteId.length > 4) {
        siteId = siteId.slice(0, 4);
      }
      parameters = {
        key_name: "login",
        key_value: username,
        site_id: siteId
      };
      return $http.post('https://api.tp-control.travelplanet.fr/sign/user_lookup/profils', {
        parameters: parameters,
        selected: "user_id"
      }).then(function(getId) {
        return $http.post('https://api.tp-control.travelplanet.fr/compare', {
          username: username,
          password: $scope.password,
          site_id: siteId,
          user_id: getId.data[0].user_id
        }).then(function(data) {
          return token(data.data, function(result) {
            return $mdDialog.hide($state.go("home"));
          });
        })["catch"](function(err) {
          toastErrorFct.toastError("Impossible d'acceder à cette communauté");
          return $mdDialog.hide();
        });
      });
    }
  };
}]);

var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

tableau.controller('datatableCtrl', ["$scope", "$http", "jwtHelper", "store", "$window", "$filter", "$stateParams", "$sce", "toastErrorFct", function($scope, $http, jwtHelper, store, $window, $filter, $stateParams, $sce, toastErrorFct) {
  var counter, dataFormatted, filter_array_text, forbiddenWord, getBullet, getColumnName, getDatatable, getfilters, schema, table, verifyArray;
  $scope.datatable = [];
  $scope.datatable_filters = [];
  $scope.column_filter = [];
  filter_array_text = [];
  schema = null;
  table = null;
  counter = 50;
  $scope.datatable_columns = [];
  $scope.getInfo = [];
  $scope.columnNames = [];
  $scope.formattedJson = {};
  $scope.datatableData = [];
  $scope.filters = [];
  $scope.nameColumn = [];
  getColumnName = function(info) {
    var i, results;
    i = 0;
    results = [];
    while (i < info.length) {
      $scope.columnNames.push({
        column: info[i].column,
        width: info[i].width
      });
      results.push(i++);
    }
    return results;
  };
  dataFormatted = function(info) {
    var i, temp;
    temp = [];
    i = 0;
    while (i < info.length) {
      if (info[i].schema && info[i].table) {
        $scope.formattedJson.table_name = info[i].schema + "." + info[i].table;
      }
      temp.push({
        column_name: info[i].column
      });
      i++;
    }
    $scope.formattedJson.list_columns = temp;
    return getDatatable(0, 50);
  };
  getBullet = function(temp, callback) {
    var bulletTemp, data, j, len;
    bulletTemp = [];
    for (j = 0, len = temp.length; j < len; j++) {
      data = temp[j];
      if (data.has_bullet_filter) {
        bulletTemp = data;
      }
    }
    return callback(bulletTemp);
  };
  getfilters = function(info) {
    var filterTemp, temp;
    temp = {};
    filterTemp = [];
    angular.forEach(info, function(value, key) {
      return angular.forEach(value, function(value_deep, key_deep) {
        if (key_deep.indexOf('filter') !== -1) {
          if (value_deep.length !== 0) {
            temp = {};
            temp["schema"] = value.schema;
            temp["table"] = value.table;
            temp["column"] = value.column;
            temp[key_deep] = value_deep;
            filterTemp.push(temp);
            return temp = {};
          }
        }
      });
    });
    return getBullet(filterTemp, function(bulletTemp) {
      if (bulletTemp.schema === void 0) {
        bulletTemp.schema = [];
      }
      return $http.post('https://api.tp-control.travelplanet.fr/getBulletFilter', {
        schema: bulletTemp.schema,
        table: bulletTemp.table,
        column_name: bulletTemp.column
      }).then(function(result) {
        var data, filter, getArrayBullet, getBulletTemp, j, k, len, len1, ref;
        getBulletTemp = {};
        getArrayBullet = [];
        for (j = 0, len = filterTemp.length; j < len; j++) {
          data = filterTemp[j];
          if (data.has_bullet_filter) {
            ref = result.data;
            for (k = 0, len1 = ref.length; k < len1; k++) {
              filter = ref[k];
              angular.forEach(filter, function(value, key) {
                getBulletTemp['value'] = value;
                getBulletTemp['column'] = key;
                getArrayBullet.push(getBulletTemp);
                return getBulletTemp = {};
              });
            }
            data.filters = getArrayBullet;
          }
        }
        return $scope.filters = filterTemp;
      })["catch"](function(err) {
        return toastErrorFct.toastError('Impossible de trouver vos filtres de recherche');
      });
    });
  };
  $scope.init = function(info) {
    $scope.getInfo = info;
    getfilters($scope.getInfo.list_datatable);
    getColumnName($scope.getInfo.list_datatable);
    return dataFormatted($scope.getInfo.list_datatable);
  };
  $scope.getGenericNameRow = function() {
    var i, result;
    if ($scope.columnNames) {
      result = "";
      i = 0;
      while (i < $scope.columnNames.length) {
        result += "<p class='col s" + $scope.columnNames[i].width + " md-whiteframe-1dp truncate getSize' style='background-color:#64B5F6; color:white; text-align: center'>" + $scope.columnNames[i].column + "</p>";
        i++;
      }
      return result;
    }
  };
  getDatatable = function(min, max) {
    if (angular.equals($scope.formattedJson, {}) !== true) {
      return $http.post("https://api.tp-control.travelplanet.fr/getDatatable", {
        datas: $scope.formattedJson,
        min: min,
        max: max,
        filters: filter_array_text
      }).then(function(data) {
        if (counter === 0) {
          return $scope.datatableData = data.data;
        } else {
          if (data.data.constructor === Array) {
            return $scope.datatableData = $scope.datatableData.concat(data.data);
          }
        }
      })["catch"](function(err) {
        return toastErrorFct.toastError("Impossible d'afficher le resultat");
      });
    }
  };
  $scope.getGenericRow = function(data) {
    var i, result;
    result = [];
    delete data.$$hashKey;
    i = 0;
    angular.forEach(data, function(value, key) {
      var get_key, info, j, len, name, ref, width;
      width = null;
      ref = $scope.columnNames;
      for (j = 0, len = ref.length; j < len; j++) {
        info = ref[j];
        if (key === info.column) {
          width = info.width;
        }
      }
      name = value;
      get_key = key.toLowerCase();
      if (get_key.indexOf('date') !== -1) {
        name = $filter('date')(value, "dd/MM/yy");
      } else if (value === null) {
        name = "Donnée Indisponible";
      }
      return result += "<p class='col s" + width + " md-whiteframe-1dp truncate getSize' style='background-color:white; text-align:center;'>" + name + "</p>";
    });
    return result;
  };
  verifyArray = function(column_name) {
    var count, index, inside_index, inside_value, results, value_array;
    if (filter_array_text.length >= 0) {
      count = 0;
      results = [];
      for (index in filter_array_text) {
        value_array = filter_array_text[index];
        for (inside_index in value_array) {
          inside_value = value_array[inside_index];
          if (inside_value === column_name) {
            filter_array_text.splice(count, 1);
          }
        }
        results.push(count++);
      }
      return results;
    }
  };
  $scope.loadMore = function() {
    if (counter === 0) {
      getDatatable($scope.datatableData.length, $scope.datatableData.length + 50);
      return counter += 50;
    } else {
      getDatatable(counter, 20);
      return counter += 20;
    }
  };
  forbiddenWord = function(value) {
    var forbidden_word;
    forbidden_word = ['', 'all'];
    if (indexOf.call(forbidden_word, value) >= 0) {
      return false;
    } else {
      return true;
    }
  };
  $scope.filterText = function(value, columnName) {
    var object_to_filter;
    $scope.datatable_columns = [];
    counter = 0;
    verifyArray(columnName);
    if (forbiddenWord(value) === true) {
      object_to_filter = {};
      object_to_filter.column_name = columnName;
      object_to_filter.value = [value];
      filter_array_text.push(object_to_filter);
    }
    return getDatatable(0, 50);
  };
  $scope.filterDate = function(range_date, column_name, nameColumn) {
    var date_array, object_to_filter;
    $scope.datatable_columns = [];
    date_array = [];
    object_to_filter = {};
    counter = 0;
    verifyArray(nameColumn);
    date_array.push(range_date.startDate);
    date_array.push(range_date.endDate);
    object_to_filter.column_name = nameColumn;
    object_to_filter.value = date_array;
    filter_array_text.push(object_to_filter);
    return getDatatable(0, 50);
  };
  $scope.getGenericFilter = function(filter, key) {
    var dynamic_entry, modelText, result;
    result = "";
    modelText = filter.table + '_' + key.toString();
    dynamic_entry = "filterText(" + modelText + ", '" + filter.column + "')";
    angular.forEach(filter, function(names, key) {
      var j, len, nameFilter, ref;
      if (key.indexOf('search') !== -1) {
        result += "<h5 class = \"md-subhead\" style = \"text-align: left\"> Par " + names + " : </h5>";
        return result += '<input for         = "search" ng-change        = "' + dynamic_entry + '" ng-model         = "' + modelText + '" name             = "clientFacture" ng-model-options = "{debounce: 1000}" minlength        = "1" maxlength        = "10">';
      } else if (key.indexOf('date') !== -1) {
        result += "<h5 class = \"md-subhead\" style = \"text-align: left\"> Par " + names + " : </h5>";
        dynamic_entry = "filterDate(range, '" + names + "', '" + filter.column + "')";
        return result += '<sm-range-picker-input class           = "col s12" style           = "font-size:10px;" on-range-select = "' + dynamic_entry + '" value           = "' + key + '" is-required     = "false" format          = "YYYY-MM-DD" mode            = "date" week-start-day  = "monday" divider         = "Au"> </sm-range-picker-input>';
      } else if (key.indexOf('bullet') !== -1) {
        $scope.value = "";
        result += "<h5 class = \"md-subhead\" style = \"text-align: left\"> Par " + names + " : </h5>";
        dynamic_entry = "filterText(value,  '" + filter.column + "')";
        result += '<md-radio-group ng-change = "' + dynamic_entry + '" &nbsp; ng-model= "value">';
        result += '<md-radio-button value = "">Tout</md-radio-button>';
        ref = filter.filters;
        for (j = 0, len = ref.length; j < len; j++) {
          nameFilter = ref[j];
          result += '<md-radio-button value = "' + nameFilter.value + '"> ' + nameFilter.value + ' </md-radio-button>';
        }
        return result += '</md-radio-group>';
      }
    });
    return $sce.trustAsHtml(result);
  };
  return $scope.downloadPdf = function(selected) {
    var resources, temp2;
    if ($scope.getInfo.pdf_display === "true") {
      table = $scope.getInfo.table;
      schema = $scope.getInfo.schema;
      resources = [];
      temp2 = {};
      angular.forEach(selected, function(value, key) {
        var temp;
        temp = value.toString();
        if ((/^\d+$/.test(temp) === true) && (temp.length === 9) === true) {
          return temp2[key] = value;
        }
      });
      resources.push(temp2);
      return $http.post(options.api.base_url + '/downloadBlob', {
        values: resources,
        table: table,
        schema: schema
      }, {
        responseType: 'arraybuffer'
      }).then(function(data) {
        var a, blob, url;
        a = document.createElement('a');
        a.style = "display: none";
        blob = new Blob([data.data], {
          type: 'application/json'
        });
        url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'travelplanet.pdf';
        document.body.appendChild(a);
        a.click();
        return setTimeout((function() {
          document.body.removeChild(a);
          return window.URL.revokeObjectURL(url);
        }), 100);
      })["catch"](function(err) {
        return toastErrorFct.toastError('Impossible de Télécharger la facture sélectionnée');
      });
    }
  };
}]);

tableau.controller('emailCtrl', ["$scope", "$location", "$window", "$http", "alertFct", "store", "$sce", "jwtHelper", function($scope, $location, $window, $http, alertFct, store, $sce, jwtHelper) {
  var decode, site_id, token, uid;
  token = store.get('JWT');
  decode = jwtHelper.decodeToken(token);
  site_id = decode[0].site_id;
  uid = decode[0].UID;
  $scope.goTo = function(id) {
    var path;
    path = '/home/billet/' + id;
    return $location.path(path);
  };
  $scope.customMenu = [['bold', 'italic', 'underline', 'strikethrough'], ['font-color', 'hilite-color'], ['remove-format'], ['ordered-list', 'unordered-list', 'outdent', 'indent'], ['left-justify', 'center-justify', 'right-justify'], ['code', 'quote', 'paragraph'], ['link', 'image'], ['format-block'], ['font'], ['font-size']];
  $http({
    method: 'GET',
    url: options.api.base_url + '/infoMail/' + site_id
  }).success(function(data) {
    return $scope.infoMails = data;
  }).error(function(err) {
    return console.log(err);
  });
  $scope.infoReponse = function(billet_id) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/infoReponse/' + site_id + '/' + uid + '/' + billet_id
    }).success(function(data) {
      return $scope.infoReponses = data;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $http({
    method: 'GET',
    url: options.api.base_url + '/profilEmail/' + uid
  }).success(function(data) {
    return $scope.profilEmails = data;
  }).error(function(err) {
    return console.log(err);
  });
  $scope.showReponse = false;
  $scope.displayreponse = function() {
    return $scope.showReponse = true;
  };
  $scope.sendMail = function(expediteur, destinataire, objet, body) {
    if (expediteur !== void 0 && objet !== void 0 && body !== void 0) {
      return $http({
        method: 'POST',
        url: options.api.base_url + '/sendMail',
        data: {
          expediteur: expediteur,
          destinataire: destinataire,
          objet: objet,
          body: body
        }
      }).success(function(data) {
        return $http({
          method: 'POST',
          url: options.api.base_url + '/putHistoryMail',
          data: {
            SITE_ID: site_id,
            UID: uid,
            email_sender: expediteur,
            email_destination: destinataire,
            email_title: objet,
            email_body: body
          }
        }).success(function(data) {
          return alertFct.alertSendMail();
        }).error(function(err) {
          return console.log(err);
        });
      }).error(function(err) {
        return console.log(err);
      });
    }
  };
  $scope.getBillets = function() {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/getBillets/' + site_id + '/' + uid
    }).success(function(data) {
      return $scope.billets = data;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.showMails = false;
  $scope.displayMails = function() {
    return $scope.showMails = true;
  };
  $scope.getMailsByBillet = function(billet_id) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/getMailsByBillet/' + site_id + '/' + uid + '/' + billet_id
    }).success(function(data) {
      return $scope.mails = data;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  };
  return $scope.sendMail_reponse = function(expediteur, destinataire, objet, body, billet_id) {
    if (expediteur !== void 0 && objet !== void 0 && body !== void 0) {
      return $http({
        method: 'POST',
        url: options.api.base_url + '/sendMail',
        data: {
          expediteur: expediteur,
          destinataire: destinataire,
          objet: objet,
          body: body
        }
      }).success(function(data) {
        return $http({
          method: 'POST',
          url: options.api.base_url + '/putHistoryMail_reponse',
          data: {
            SITE_ID: site_id,
            UID: uid,
            BILLET_ID: billet_id,
            email_sender: expediteur,
            email_destination: destinataire,
            email_title: objet,
            email_body: body
          }
        }).success(function(data) {
          $scope.showReponse = false;
          $scope.getMailsByBillet(billet_id);
          return alertFct.alertSendMail();
        }).error(function(err) {
          return console.log(err);
        });
      }).error(function(err) {
        return console.log(err);
      });
    }
  };
}]);

tableau.controller('galleryCtrl', ["$scope", "NgMap", function($scope, NgMap) {
  var addressEnd, addressStart, getPriceInfo;
  $scope.getMarker = [];
  $scope.address = null;
  $scope.endAddress = null;
  addressStart = [];
  addressEnd = [];
  $scope.destination = null;
  $scope.placeChanged = function() {
    $scope.place = this.getPlace();
    $scope.getMarker = $scope.place.geometry.location.lat() + ',' + $scope.place.geometry.location.lng();
    addressStart = $scope.place.geometry.location;
    return $scope.address = $scope.place.formatted_address;
  };
  $scope.placeEndChanged = function() {
    $scope.place = this.getPlace();
    $scope.getMarker = $scope.getMarker = $scope.place.geometry.location.lat() + ',' + $scope.place.geometry.location.lng();
    addressEnd = $scope.place.geometry.location;
    $scope.endAddress = $scope.place.formatted_address;
    $scope.destination = $scope.place.formatted_address;
    if ($scope.address !== null) {
      return getPriceInfo(addressStart, addressEnd);
    }
  };
  NgMap.getMap().then(function(map) {
    return $scope.map = map;
  });
  return getPriceInfo = function(start, end) {
    console.log('coord start : ', start.lat(), start.lng());
    return console.log('coord stop : ', end.lat(), end.lng());
  };
}]);

tableau.controller('homeCtrl', ["$scope", "logoutFct", "jwtHelper", "store", "$http", "$stateParams", "$location", "$sce", "$mdDialog", "toastErrorFct", "$q", "$state", "ipFct", "bitmaskFactory", "$timeout", "Idle", "$window", function($scope, logoutFct, jwtHelper, store, $http, $stateParams, $location, $sce, $mdDialog, toastErrorFct, $q, $state, ipFct, bitmaskFactory, $timeout, Idle, $window) {
  var IdleCtrl, decode, deleteAll, roles, site_id, token;
  Idle.watch();
  if (!store.get('JWT')) {
    return $state.go('login');
  } else {
    if (jwtHelper.isTokenExpired(store.get('JWT'))) {
      store.remove('JWT');
      return $state.go('login.account');
    } else {
      token = store.get('JWT');
      decode = jwtHelper.decodeToken(token);
      site_id = decode[0].site_id;
      $scope.isOpen = false;
      $scope.selectedDirection = "right";
      $scope.selectedMode = "md-scale";
      $scope.userInfos = [];
      $scope.viewsMenu = [];
      roles = [];
      $mdDialog.hide();
      $scope.$on('IdleStart', function() {
        return $mdDialog.show({
          controller: IdleCtrl,
          templateUrl: 'modals/idleMessage.html',
          parent: angular.element(document.body),
          clickOutsideToClose: false,
          escapeToClose: false
        });
      });
      IdleCtrl = function($scope, $mdDialog) {
        $scope.resterconnecter = function() {
          return $mdDialog.hide();
        };
        return $scope.logOut = function() {
          var get_action;
          $mdDialog.hide();
          get_action = "logged out";
          ipFct.insertDataIp(get_action);
          return logoutFct.logOut_SC();
        };
      };
      deleteAll = function(callback) {
        $mdDialog.hide();
        store.remove('JWT');
        store.remove('set');
        return callback(true);
      };
      $scope.$on('IdleTimeout', function() {
        return deleteAll(function(result) {
          return $state.go('login');
        });
      });
      $http.post('https://api.tp-control.travelplanet.fr/select/table2', {
        parameters: {
          "type": "click_role_by_user",
          "key": decode[0].site_id,
          "id1": decode[0].UID
        },
        selected: "id2"
      }).then(function(data) {
        var i, infoUser, key, len, menu, ref, rolesTemp;
        if (data.data.length === 0) {
          toastErrorFct.toastError("Ce compte n'a pas encore été configuré, vous allez être déconnectée dans 5 secondes");
          return $timeout((function() {
            return deleteAll(function(result) {
              return $state.go("login");
            });
          }), 5000);
        } else {
          rolesTemp = [];
          ref = data.data;
          for (i = 0, len = ref.length; i < len; i++) {
            key = ref[i];
            rolesTemp.push(key.id2);
          }
          roles.push(key.id2);
          infoUser = $http.post('https://api.tp-control.travelplanet.fr/select/table1', {
            parameters: {
              "type": "click",
              "key": "site",
              "id": decode[0].site_id
            },
            selected: "*"
          });
          menu = $http.post('https://api.tp-control.travelplanet.fr/menu/' + decode[0].site_id, {
            roles: rolesTemp
          });
          return $q.all([infoUser, menu]).then(function(data) {
            var temp;
            temp = angular.fromJson(data[0].data[0].js_data);
            if (temp.constructor !== Array) {
              temp = [temp];
            }
            $scope.userInfos = temp[0];
            return $scope.viewsMenu = data[1].data;
          });
        }
      });
      $scope.cancel = function() {
        return $mdDialog.hide();
      };
      $scope.goTo = function(embeds) {
        return $state.go('home.test', {
          embeds: embeds
        });
      };
      $scope.bindMenu = function(aggMenu) {
        var i, j, k, l, len, len1, len2, len3, menu, pos, ref, sorted, tempPosition, view, viewList, viewTemp;
        if (aggMenu.view_list) {
          if (aggMenu.view_list.length === 0 && !aggMenu.view_embed_data) {
            return "";
          }
        }
        viewList = aggMenu.view_list;
        tempPosition = [];
        viewTemp = [];
        if (viewList) {
          for (i = 0, len = viewList.length; i < len; i++) {
            sorted = viewList[i];
            tempPosition.push(sorted.view_position);
          }
        }
        tempPosition.sort(function(a, b) {
          return a - b;
        });
        for (j = 0, len1 = tempPosition.length; j < len1; j++) {
          pos = tempPosition[j];
          for (k = 0, len2 = viewList.length; k < len2; k++) {
            sorted = viewList[k];
            if (pos === sorted.view_position) {
              viewTemp.push(sorted);
            }
          }
        }
        aggMenu.view_list = viewTemp;
        $scope.color = aggMenu.groupe_color;
        menu = [];
        menu += "<md-fab-speed-dial md-open=\"\" md-direction=\"{{selectedDirection}}\" ng-class=\"selectedMode\">\n<md-fab-trigger>";
        if (aggMenu.view_embed_data) {
          menu += "<md-button style=\"height: 65px;width: 65px;padding:0; background-color: {{color}};\" ng-click=goTo(" + angular.toJson(aggMenu.view_embed_data) + ")  aria-label=\"menu\" class=\"md-fab\"><md-tooltip style=\"font-size:15px\" md-visible=\"demo.showTooltip\" md-direction=\"top\">" + aggMenu.groupe_libelle + "</md-tooltip>";
        } else {
          menu += "<md-button style=\"height: 65px;width: 65px;padding:0; background-color: {{color}};\"  aria-label=\"menu\" class=\"md-fab\"><md-tooltip style=\"font-size:15px\" md-visible=\"demo.showTooltip\" md-direction=\"top\">" + aggMenu.groupe_libelle + "</md-tooltip>";
        }
        menu += "<img style=\"height:60px;\" ng-src=\" " + aggMenu.groupe_logo + " \">\n  </md-button>\n</md-fab-trigger> <md-fab-actions> ";
        if (aggMenu.view_list) {
          if (aggMenu.view_list.length !== 0) {
            ref = aggMenu.view_list;
            for (l = 0, len3 = ref.length; l < len3; l++) {
              view = ref[l];
              $scope.getEmbeds = view.view_embed_data;
              menu += "<md-button style=\"padding:0;background-color:transparent;box-shadow: none;\" ng-click=goTo(" + angular.toJson($scope.getEmbeds) + ") aria-label=\"test\" class=\"md-fab md-raised md-mini\">\n<img ng-src=\" " + view.view_logo_base_64 + " \"><md-tooltip style=\"font-size:15px\" md-visible=\"demo.showTooltip\" md-direction=\"bottom\">" + view.view_label + "</md-tooltip>\n</md-button>";
            }
          }
        }
        menu += "</md-fab-actions></md-fab-speed-dial>";
        return $sce.trustAsHtml(menu);
      };
      return $scope.logOut = function() {
        var get_action;
        get_action = "logged out";
        ipFct.insertDataIp(get_action);
        return logoutFct.logOut();
      };
    }
  }
}]);

tableau.controller('imgCtrl', ["$scope", function($scope) {
  return console.log("");
}]);

tableau.controller('iterativeLayoutCtrl', ["$scope", "$stateParams", "store", "jwtHelper", "$http", "toastErrorFct", function($scope, $stateParams, store, jwtHelper, $http, toastErrorFct) {
  var decode, embedList, filterViewList, getId, getViews, token;
  getId = $stateParams.id;
  embedList = [];
  if ($stateParams.embeds === null) {
    embedList = store.get('set');
  } else {
    embedList = $stateParams.embeds;
    store.set('set', $stateParams.embeds);
  }
  $scope.data = [];
  token = store.get('JWT');
  decode = jwtHelper.decodeToken(token);
  filterViewList = function(data) {
    var i, temp;
    temp = [];
    i = 0;
    while (i < data.length) {
      if (temp.indexOf(data[i]) === -1) {
        temp.push(data[i]);
      }
      i++;
    }
    return temp;
  };
  getViews = function() {
    var values;
    values = ["click", "embed", decode[0].site_id];
    return $http.post('https://api.tp-control.travelplanet.fr/multipleSelect', {
      values: values,
      tabIn: embedList
    }).then(function(data) {
      var j, key, len, ref, results, temp;
      temp = null;
      ref = data.data;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        key = ref[j];
        temp = angular.fromJson(key.js_data);
        if (temp[0]) {
          results.push($scope.data.push(temp[0]));
        } else {
          results.push($scope.data.push(temp));
        }
      }
      return results;
    });
  };
  getViews();
  $scope.getController = null;
  return $scope.getTemplate = function(value) {
    var result_template;
    result_template = 'templates/' + value.embed_content_type.toLowerCase() + '.html';
    return result_template;
  };
}]);

tableau.controller('loadingCtrl', ["$scope", function($scope) {
  return console.log("");
}]);

tableau.controller('logOutCtrl', ["$scope", "$location", "logoutFct", "toastErrorFct", "ipFct", function($scope, $location, logoutFct, toastErrorFct, ipFct) {
  return $scope.confirmLogout = function() {
    var promise;
    promise = logoutFactory.logOut();
    return promise.then(data, function() {
      return $location.path('/login');
    })["catch"](err, function() {
      return toastErrorFct.toastError("Une erreur est survenue, error 500");
    });
  };
}]);

tableau.controller('loginCtrl', ["$scope", "$location", "jwtHelper", "store", "$state", "ipFct", function($scope, $location, jwtHelper, store, $state, ipFct) {
  var get_action;
  if (store.get('JWT')) {
    if (jwtHelper.isTokenExpired(store.get('JWT'))) {
      store.remove('JWT');
      return $state.go('login.account');
    } else {
      get_action = "Logged back";
      ipFct.insertDataIp(get_action);
      return $state.go('home');
    }
  } else {
    return $state.go('login.account');
  }
}]);

tableau.controller('loginVerifyCtrl', ["$http", "$location", "$scope", "$mdDialog", "store", "jwtHelper", "toastErrorFct", "$window", "$state", function($http, $location, $scope, $mdDialog, store, jwtHelper, toastErrorFct, $window, $state) {
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
    var parameters;
    parameters = {
      key_name: "login",
      key_value: $scope.username
    };
    return $http.post('https://api.tp-control.travelplanet.fr/sign/user_lookup/profils', {
      parameters: parameters,
      selected: "site_id, user_id"
    }).then(function(data) {
      if (data.data.length === 0) {
        return toastErrorFct.toastError("L'utilisateur : " + $scope.username + " n'existe pas");
      } else {
        return $state.go('login.comunity', {
          data: data.data,
          username: $scope.username
        });
      }
    })["catch"](function(err) {
      return toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard");
    });
  };
}]);

tableau.controller('multipleViewCtrl', ["$scope", "$rootScope", function($scope, $rootScope) {
  return console.log("");
}]);

tableau.controller("profilsCtrl", ["$scope", "$mdDialog", "$http", "NgTableParams", "store", "jwtHelper", "$q", "toastErrorFct", function($scope, $mdDialog, $http, NgTableParams, store, jwtHelper, $q, toastErrorFct) {
  var arrayObjectIndexOf, community, decode, find, getSubData, site_id, toArray, toObject, token, uid;
  if (store.get('JWT')) {
    token = store.get('JWT');
    decode = jwtHelper.decodeToken(token);
    $scope.get_username = decode[0].username;
  }
  $scope.anotherMail = null;
  $scope.getCountryNumberphone = null;
  $scope.num_phone_user = null;
  $scope.getEmail = null;
  $scope.limitOptions = [5, 10, 15];
  $scope.selected = [];
  $scope.config = {
    itemsPerPage: 5,
    fillLastPage: true
  };
  $scope.required = true;
  uid = decode[0].UID;
  site_id = decode[0].site_id;
  community = decode[0].home_community;
  $scope.profils = [];
  $scope.cardNameChange = function(provider) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/card_name/' + provider
    }).success(function(data) {
      return $scope.card_name = data;
    }).error(function(err) {
      return toastErrorFct.toastError("Impossible d'acceder au cartes du voyageur");
    });
  };
  $scope.profilChange = function(site_id, uid) {
    var get_air_loyalty, get_air_loyalty_air_france, get_arranger, get_card_traveller, get_profil_change, get_profil_email, get_profil_phone, get_rail_loyalty;
    get_profil_email = $http.get(options.api.base_url + '/profilEmail/' + uid);
    get_profil_phone = $http.get(options.api.base_url + '/profilPhone/' + uid);
    get_card_traveller = $http.get(options.api.base_url + '/cardTraveller/' + uid);
    get_rail_loyalty = $http.get(options.api.base_url + '/rail_loyalty/' + uid);
    get_air_loyalty = $http.get(options.api.base_url + '/air_loyalty/' + uid);
    get_air_loyalty_air_france = $http.get(options.api.base_url + '/air_loyaltyAF/' + uid);
    get_profil_change = $http.get(options.api.base_url + '/profils/' + site_id + '/' + uid);
    get_arranger = $http.get(options.api.base_url + '/get_arranger/' + site_id + '/' + uid);
    return $q.all([get_profil_email, get_profil_phone, get_card_traveller, get_rail_loyalty, get_air_loyalty, get_air_loyalty_air_france, get_profil_change, get_arranger]).then(function(data) {
      $scope.profil_email = data[0].data;
      $scope.profil_phone = data[1].data;
      $scope.card_traveller = data[2].data;
      $scope.rail_loyalty = data[3].data;
      $scope.air_loyalty = data[4].data;
      $scope.air_loyalty_af = data[5].data;
      $scope.profils = data[6].data;
      return $scope.arrangers = data[7].data;
    })["catch"](function(err) {
      return toastErrorFct.toastError("Impossible d'acceder au profil de l'utilisateur");
    });
  };
  $scope.profilChange(site_id, uid);
  getSubData = function() {
    var get_air_seating_pref, get_community, get_country, get_provider, get_rail_class, get_rail_departure_station, get_rail_loyalty_program_code, get_rail_seat_position, get_rail_wagon_code;
    get_rail_class = $http.get(options.api.base_url + '/railClass');
    get_rail_wagon_code = $http.get(options.api.base_url + '/railWagonCode');
    get_rail_seat_position = $http.get(options.api.base_url + '/railSeatPosition');
    get_rail_departure_station = $http.get(options.api.base_url + '/railDepartureStation');
    get_provider = $http.get(options.api.base_url + '/provider');
    get_rail_loyalty_program_code = $http.get(options.api.base_url + '/rail_loyaltyprogramCode/');
    get_air_seating_pref = $http.get(options.api.base_url + '/airSeatingPref');
    get_country = $http.get(options.api.base_url + '/getCountry');
    get_community = $http.get(options.api.base_url + '/community/' + site_id);
    return $q.all([get_rail_class, get_rail_wagon_code, get_rail_seat_position, get_rail_departure_station, get_provider, get_rail_loyalty_program_code, get_air_seating_pref, get_country, get_community]).then(function(data) {
      $scope.rail_class = data[0].data;
      $scope.rail_wagon_code = data[1].data;
      $scope.rail_seat_position = data[2].data;
      $scope.rail_departure_station = data[3].data;
      $scope.provider = data[4].data;
      $scope.rail_loyalty_program_code = data[5].data;
      $scope.air_seating_pref = data[6].data;
      $scope.country = data[7].data;
      return $scope.community = data[8].data;
    })["catch"](function(err) {
      return toastErrorFct.toastError("Impossible d'acceder aux information du voyageur");
    });
  };
  getSubData();
  $scope.getusersCommunity = function(site_id, community) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/usersCommunity/' + site_id + '/' + community
    }).success(function(data) {
      $scope.usersCommunity = data;
      return $scope.query = {
        order: 'name',
        limit: 5,
        page: 1
      };
    }).error(function(err) {
      return toastErrorFct.toastError("Impossible d'acceder à la communauté du voyageur");
    });
  };
  $scope.ajouterNum = true;
  $scope.phone = false;
  $scope.showPanelTel = function() {
    $scope.phone = true;
    return $scope.ajouterNum = false;
  };
  $scope.hidePanelTel = function() {
    $scope.phone = false;
    return $scope.ajouterNum = true;
  };
  $scope.listNumTel = [];
  $scope.submitUserPhone = function(user_phone) {
    var phoneSub;
    phoneSub = {
      phone_number: user_phone,
      code_number: $scope.getCountryNumberphone
    };
    if (user_phone && $scope.getCountryNumberphone) {
      $scope.listNumTel.push(phoneSub);
      phoneSub = {};
      $scope.phone = false;
      $scope.ajouterNum = true;
      $scope.getCountryNumberphone = null;
      return $scope.numPhoneUser = null;
    }
  };
  $scope.deletePhoneNumber = function(id) {
    return $scope.profil_phone[id - 1].PhoneNumber = '';
  };
  $scope.ajouterMail = true;
  $scope.mail = false;
  $scope.showPanelMail = function() {
    $scope.mail = true;
    return $scope.ajouterMail = false;
  };
  $scope.hidePanelMail = function() {
    $scope.mail = false;
    return $scope.ajouterMail = true;
  };
  $scope.listMail = [];
  $scope.submitMail = function(mail) {
    var mailSub;
    mailSub = {
      mail: mail
    };
    if (mail) {
      $scope.listMail.push(mailSub);
      $scope.getEmail = '';
      $scope.mailSub = {};
      $scope.mail = false;
      $scope.ajouterMail = true;
      $scope.getEmail = null;
      return mail = null;
    }
  };
  $scope.ajouterValideur = true;
  $scope.valideur = false;
  $scope.showPanelValideur = function() {
    $scope.valideur = true;
    return $scope.ajouterValideur = false;
  };
  $scope.hidePanelValideur = function() {
    $scope.valideur = false;
    return $scope.ajouterValideur = true;
  };
  $scope.listValideur = [];
  $scope.submitValideur = function() {
    var valideurSub;
    valideurSub = {
      name: $scope.user.nomValideur
    };
    if ($scope.user.nomValideur) {
      $scope.listValideur.push(valideurSub);
      $scope.valideurSub = {};
      $scope.valideur = false;
      $scope.ajouterValideur = true;
      return $scope.user.nameValideur = null;
    }
  };
  $scope.ajouterChargeVoy = true;
  $scope.chargeVoy = false;
  $scope.showPanelChargeVoy = function() {
    $scope.chargeVoy = true;
    return $scope.ajouterChargeVoy = false;
  };
  $scope.hidePanelChargeVoy = function() {
    $scope.chargeVoy = false;
    return $scope.ajouterChargeVoy = true;
  };
  $scope.listChargeVoy = [];
  $scope.submitChargeVoy = function() {
    var chargeVoySub;
    chargeVoySub = {
      name: $scope.user.nomChargeVoy
    };
    if ($scope.user.nomChargeVoyr) {
      $scope.listChargeVoy.push(chargeVoySub);
      $scope.chargeVoySub = {};
      $scope.chargeVoy = false;
      $scope.ajouterChargeVoy = true;
      return $scope.user.nomChargeVoy = null;
    }
  };
  $scope.ajouterResponsable = true;
  $scope.responsable = false;
  $scope.showPanelResponsable = function() {
    $scope.responsable = true;
    return $scope.ajouterResponsable = false;
  };
  $scope.hidePanelResponsable = function() {
    $scope.responsable = false;
    return $scope.ajouterResponsable = true;
  };
  $scope.listResponsable = [];
  $scope.submitResponsable = function() {
    var responsableSub;
    responsableSub = {
      name: $scope.user.responsable
    };
    if ($scope.user.responsable) {
      $scope.listResponsable.push(responsableSub);
      $scope.responsableSub = {};
      $scope.responsable = false;
      $scope.ajouterResponsable = true;
      return $scope.user.nomResponsable = null;
    }
  };
  $scope.ajouterPasseport = true;
  $scope.passeport = false;
  $scope.showPanelPasseport = function() {
    $scope.passeport = true;
    return $scope.ajouterPasseport = false;
  };
  $scope.hidePanelPasseport = function() {
    $scope.passeport = false;
    return $scope.ajouterPasseport = true;
  };
  $scope.listPasseport = [];
  $scope.submitPasseport = function() {
    var passeportSub;
    passeportSub = {
      name: $scope.user.passeport
    };
    if ($scope.user.passeport) {
      $scope.listPasseport.push(passeportSub);
      $scope.passeportSub = {};
      $scope.passeport = false;
      $scope.ajouterPasseport = true;
      return $scope.user.nomPasseport = null;
    }
  };
  $scope.ajouterFidelite = true;
  $scope.fidelite = false;
  $scope.showPanelFidelite = function() {
    $scope.fidelite = true;
    return $scope.ajouterFidelite = false;
  };
  $scope.hidePanelFidelite = function() {
    $scope.fidelite = false;
    return $scope.ajouterFidelite = true;
  };
  $scope.listFidelite = [];
  $scope.submitFidelite = function() {
    var fideliteSub;
    fideliteSub = {
      name: $scope.user.fidelite
    };
    if ($scope.user.fidelite) {
      $scope.listFidelite.push(fideliteSub);
      $scope.fideliteSub = {};
      $scope.fidelite = false;
      $scope.ajouterFidelite = true;
      return $scope.user.nomFidelite = null;
    }
  };
  $scope.ajouterFideliteTrain = true;
  $scope.CarteFideliteTrain = false;
  $scope.showPanelCarteFideliteTrain = function() {
    $scope.CarteFideliteTrain = true;
    $scope.ajouterFideliteTrain = false;
    return $scope.TabRecupfideliteTrain = false;
  };
  $scope.hidePanelCarteFideliteTrain = function() {
    $scope.CarteFideliteTrain = false;
    $scope.ajouterFideliteTrain = true;
    return $scope.TabRecupfideliteTrain = true;
  };
  $scope.listFideliteTrain = [];
  $scope.submitFideliteTrain = function() {
    var fideliteTrainSub;
    fideliteTrainSub = {
      name: $scope.user.fideliteTrain
    };
    if ($scope.user.fideliteTrain) {
      $scope.listFidelite.push(fideliteSub);
      $scope.fideliteSub = {};
      $scope.CarteFideliteTrain = false;
      $scope.ajouterFideliteTrain = true;
      return $scope.user.nomFideliteTrain = null;
    }
  };
  $scope.ajouterCarteVoy = true;
  $scope.carteVoy = false;
  $scope.showPanelCarteVoy = function() {
    $scope.carteVoy = true;
    $scope.ajouterCarteVoy = false;
    return $scope.TabRecupCardVoy = false;
  };
  $scope.hidePanelCarteVoy = function() {
    $scope.carteVoy = false;
    $scope.ajouterCarteVoy = true;
    return $scope.TabRecupCardVoy = true;
  };
  $scope.listCarteVoy = [];
  $scope.submitCarteVoy = function() {
    var carteVoySub;
    carteVoySub = {
      name: $scope.user.carteVoy
    };
    if ($scope.user.carteVoy) {
      $scope.listCarteVoy.push(carteVoySub);
      $scope.carteVoySub = {};
      $scope.carteVoy = false;
      $scope.ajouterCarteVoy = true;
      return $scope.user.nomCarteVoy = null;
    }
  };
  $scope.ajouterFideliteHotel = true;
  $scope.fideliteHotel = false;
  $scope.showPanelFideliteHotel = function() {
    $scope.fideliteHotel = true;
    return $scope.ajouterFideliteHotel = false;
  };
  $scope.hidePanelFideliteHotel = function() {
    $scope.fideliteHotel = false;
    return $scope.ajouterFideliteHotel = true;
  };
  $scope.listFideliteHotel = [];
  $scope.submitFideliteHotel = function() {
    var fideliteHotelSub;
    fideliteHotelSub = {
      name: $scope.user.fidelite
    };
    if ($scope.user.fideliteHotel) {
      $scope.listFideliteHotel.push(fideliteHotelSub);
      $scope.fideliteHotelSub = {};
      $scope.fideliteHotel = false;
      $scope.ajouterFideliteHotel = true;
      return $scope.user.nomFideliteHotel = null;
    }
  };
  $scope.ajouterUser = false;
  $scope.showPanelUser = function() {
    return $scope.ajouterUser = true;
  };
  $scope.hidePanelUser = function() {
    return $scope.ajouterUser = false;
  };
  toArray = function(object, name) {
    var data, i;
    data = [];
    i = 0;
    while (i < object.length) {
      if (name === 'phone') {
        data.push(object[i].nicename);
      } else if (name === 'villeGare') {
        data.push(object[i].RailDepartureStation);
      }
      i++;
    }
    return data;
  };
  toObject = function(arr, name) {
    var i, rv;
    rv = [];
    i = 0;
    while (i < arr.length) {
      if (name === "villeGare") {
        rv[i] = {
          RailDepartureStation: arr[i]
        };
      } else {
        rv[i] = {
          nicename: arr[i]
        };
      }
      ++i;
    }
    return rv;
  };
  find = function(key, array) {
    var i, results;
    results = [];
    i = 0;
    while (i < array.length) {
      if (array[i].indexOf(key) === 0) {
        results.push(array[i]);
      }
      i++;
    }
    return results;
  };
  arrayObjectIndexOf = function(object, searchTerm, name) {
    var getArray, result, result2;
    searchTerm = searchTerm.substring(0, 1).toUpperCase() + searchTerm.substring(1);
    if (searchTerm) {
      getArray = toArray(object, name);
      result = find(searchTerm, getArray);
      result2 = toObject(result, name);
      return result2;
    }
  };
  $scope.getCodeNumber = function(country, value) {
    return $http({
      method: 'GET',
      url: options.api.base_url + '/phoneCode/' + country
    }).success(function(data) {
      if (data.length > 0) {
        return $scope.getCountryNumberphone = data[0].phonecode;
      }
    }).error(function(err) {
      return toastErrorFct.toastError("Impossible d'afficher le code numéro");
    });
  };
  return $scope.querySearch = function(query, name) {
    var result;
    if (name === 'villeGare') {
      result = arrayObjectIndexOf($scope.rail_departure_station, query, name);
    } else {
      result = arrayObjectIndexOf($scope.country, query, name);
    }
    return result;
  };
}]);

tableau.controller('samlCtrl', ["$scope", "$window", "$stateParams", "store", "$location", "jwtHelper", "$http", "toastErrorFct", "$state", function($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct, $state) {
  var decode, token;
  token = $stateParams.tokenSaml;
  decode = jwtHelper.decodeToken(token);
  return $http.post('https://api.tp-control.travelplanet.fr/samlLogin', {
    login: decode.login,
    username: decode.mail,
    siteID: decode.siteID,
    field: decode.ssoId
  }).then(function(data) {
    store.set('JWT', data.data.token);
    return $state.go("home");
  })["catch"](function(err) {
    return toastErrorFct.toastError("Impossible de se connecter avec cet identifiant");
  });
}]);

tableau.controller('tableauCtrl', ["$scope", "$http", "$sce", "$stateParams", "jwtHelper", "store", "$mdDialog", function($scope, $http, $sce, $stateParams, jwtHelper, store, $mdDialog) {
  var decode, getTableau, getTableauToken, isMessage, onMarksSelection, reportSelectedMarks, site_id, site_id_parse, token, uid, user_id;
  token = store.get('JWT');
  decode = jwtHelper.decodeToken(token);
  $scope.tableauToken = [];
  $scope.tableauData = [];
  $scope.tableauDisplay = "none";
  $scope.loadingDisplay = "block";
  site_id = decode[0].site_id;
  uid = decode[0].UID;
  site_id_parse = site_id.substr(0, 4);
  user_id = site_id_parse + uid;
  $scope.loadingText = "Chargement de la vue en cours ...";
  $scope.urlLoadingView = "modals/loadingView.html";
  $scope.width = false;
  $scope.init = function(info) {
    $scope.tableauData = info;
    return getTableauToken();
  };
  $scope.listenToMarksSelection = function() {
    $scope.viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, onMarksSelection);
  };
  $scope.exportToPDF = function() {
    $scope.viz.showExportPDFDialog();
  };
  onMarksSelection = function(marksEvent) {
    return marksEvent.getMarksAsync().then(reportSelectedMarks);
  };
  $scope.selected_data = [];
  reportSelectedMarks = function(marks) {
    var html, markIndex, obj, pair, pairIndex, pairs, results;
    $scope.selected_data = [];
    html = '';
    markIndex = 0;
    results = [];
    while (markIndex < marks.length) {
      pairs = marks[markIndex].getPairs();
      pairIndex = 0;
      while (pairIndex < pairs.length) {
        pair = pairs[pairIndex];
        obj = {
          fieldName: pair.fieldName,
          formattedValue: pair.formattedValue
        };
        $scope.selected_data.push(obj);
        pairIndex++;
      }
      results.push(markIndex++);
    }
    return results;
  };
  getTableauToken = function() {
    var url;
    url = options.api.base_url + '/tokenExchange';
    return $http.post(url, {
      tableau_site: $scope.tableauData.tableau_site,
      user_name: user_id
    }).then(function(data) {
      $scope.tableauToken = data.data.token;
      return getTableau();
    });
  };
  $scope.trustHtml = function() {
    var tableau_url, url;
    tableau_url = null;
    if ($scope.tableauData.tableau_site === "Default") {
      tableau_url = '/views/' + $scope.tableauData.tableau_view + '?:embed=yes&:toolbar=no';
    } else {
      tableau_url = '/t/' + $scope.tableauData.tableau_site + '/views/' + $scope.tableauData.tableau_view + '?:embed=yes&:toolbar=no';
    }
    url = "https://data.travelplanet.fr/trusted/" + $scope.tableauToken + tableau_url;
    return url;
  };
  isMessage = function(txt, msg) {
    return txt.substring(0, msg.length) === msg;
  };
  getTableau = function() {
    var COMPLETE_INDICATOR, LOADED_INDICATOR, placeholder, tableauOptions, url, vizLoaded;
    url = $scope.trustHtml();
    LOADED_INDICATOR = 'tableau.loadIndicatorsLoaded';
    COMPLETE_INDICATOR = 'tableau.completed';
    placeholder = document.getElementById($scope.info.embed_id);
    vizLoaded = false;
    url = url;
    tableauOptions = {
      hideTabs: true,
      width: "100%",
      height: "800px",
      hideToolbar: true,
      onFirstInteractive: function() {
        return $scope.listenToMarksSelection();
      }
    };
    $scope.viz = new tableau.Viz(placeholder, url, tableauOptions);
    ({
      onFirstInteractive: function() {
        return $scope.display = "block";
      }
    });
    return window.addEventListener('message', function(msg) {
      if (isMessage(msg.data, LOADED_INDICATOR)) {
        vizLoaded = true;
        return $scope.display = "none";
      } else if (isMessage(msg.data, COMPLETE_INDICATOR)) {
        $scope.width = $scope.viz.getVizSize().sheetSize.maxSize.width + 'px';
        $scope.tableauDisplay = "block";
        $scope.loadingDisplay = "none";
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
  $scope.data_get = [];
  $scope.choices = [];
  return $scope.getUnderlyingData = function() {};
}]);

tableau.controller('uploadCtrl', ["$scope", "$http", "Upload", function($scope, $http, Upload) {
  var upload;
  $scope.uploadNatixis = function(file) {
    var filename, url;
    url = "http://api-interne-dev.travelplanet.fr/api/Banque/MatchNatixis";
    filename = "Natixis";
    if (file.length <= 0 || file === null) {
      return SweetAlert.swal({
        title: "Fichier invalide",
        text: "Format invalide, veuillez uploader un fichier de type xlsx",
        type: "warning"
      });
    } else {
      return upload(file, url, filename);
    }
  };
  $scope.uploadFiles = function(file) {
    var filename, url;
    url = "http://api-interne-dev.travelplanet.fr/api/Banque/MatchSGPalatine";
    filename = "Banque";
    if (file.length <= 0 || file === null) {
      return SweetAlert.swal({
        title: "Fichier invalide",
        text: "Format invalide, veuillez uploader un fichier de type xlsx",
        type: "warning"
      });
    } else {
      return upload(file, url, filename);
    }
  };
  upload = function(file, url, filename) {
    return Upload.upload({
      method: 'POST',
      url: url,
      responseType: 'arraybuffer',
      data: {
        file: file
      }
    }).then((function(resp, status, headers) {
      var blob, clickEvent, contentType, ex, linkElement;
      contentType = 'application/zip';
      linkElement = document.createElement('a');
      try {
        blob = new Blob([resp.data], {
          type: contentType
        });
        url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', filename);
        clickEvent = new MouseEvent('click', {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });
        return linkElement.dispatchEvent(clickEvent);
      } catch (error) {
        ex = error;
        return console.log(ex);
      }
    }), function(resp) {
      return console.log('error status: ' + resp.status);
    });
  };
  return $scope.downloadNatixisCFONG = function() {
    return $http({
      method: 'GET',
      url: 'http://api-interne-dev.travelplanet.fr/api/Banque/GenerateNatixisCFONB'
    }).success(function(data) {
      var blob, clickEvent, contentType, ex, filename, linkElement, url;
      contentType = 'text/plain';
      linkElement = document.createElement('a');
      filename = "Travel_planet_la_date";
      try {
        blob = new Blob([data], {
          type: contentType
        });
        url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', filename);
        clickEvent = new MouseEvent('click', {
          "view": window,
          "bubbles": true,
          "cancelable": false
        });
        return linkElement.dispatchEvent(clickEvent);
      } catch (error) {
        ex = error;
        return console.log(ex);
      }
    }).error(function(err) {
      return console.log(err);
    });
  };
}]);

tableau.controller('workflowCtrl', ["$scope", "$http", "$sce", "alertFct", function($scope, $http, $sce, alertFct) {
  var currentDate, day, isNotEmpty, month, year;
  currentDate = new Date();
  day = currentDate.getDate();
  month = currentDate.getMonth() + 1;
  year = currentDate.getFullYear();
  $scope.go = false;
  $scope.selected = {};
  $scope.file = {};
  $scope.multiple_custom = {};
  $scope.today = year + "-" + month + "-" + day;
  $scope.displayload = false;
  $scope.init = function(info) {
    return $scope.allowedWorkflows = info.list_workflow;
  };
  $scope.getInfosWokflow = function() {
    return $http({
      method: "POST",
      url: options.api.base_url + "/infosWokflow",
      data: {
        workflow: $scope.WORKFLOW_NAME
      }
    }).success(function(data) {
      return $scope.infosWokflow = data;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.getParameters = function() {
    $scope.queries = null;
    $scope.parameters = [];
    $scope.listBoxs = [];
    return $http({
      method: "POST",
      url: options.api.base_url + "/getParameters",
      data: {
        workflow: $scope.WORKFLOW_NAME
      }
    }).success(function(data) {
      var i, j, len, len1, parameter, ref, ref1, results;
      angular.forEach(data.list, function(value, key) {
        if (value.TYPE === "DropDown" || value.TYPE === "ListBox") {
          $scope.listBoxs.push(value);
          return angular.forEach($scope.listBoxs, function(valueL, keyL) {
            var array, listName, query;
            if (valueL.VALUE_TYPE !== 'query') {
              listName = valueL.NAME;
              value = valueL.VALUE;
              array = value.split("\n");
              array.pop();
              return $scope[listName] = array;
            } else if (valueL.VALUE_TYPE === 'query') {
              query = valueL.VALUE;
              return $http({
                method: "GET",
                url: options.api.base_url + "/query/" + query
              }).success(function(data_query) {
                $scope.queries = data_query;
                $scope.queries.NAME = valueL.NAME;
                return $scope.go = true;
              }).error(function(err) {
                return console.log(err);
              });
            }
          });
        } else {
          $scope.parameters.push(value);
          return $scope.go = true;
        }
      });
      ref = $scope.parameters;
      for (i = 0, len = ref.length; i < len; i++) {
        parameter = ref[i];
        $scope.selected[parameter.NAME] = parameter.DEFAULT_VALUE;
      }
      angular.forEach(data.listbox, function(value, key) {
        if (value.TYPE === "DropDown" || value.TYPE === "ListBox") {
          $scope.listBoxs.push(value);
          return angular.forEach($scope.listBoxs, function(valueL, keyL) {
            var array, listName, query;
            if (valueL.VALUE_TYPE !== 'query') {
              listName = valueL.NAME;
              value = valueL.VALUE;
              array = value.split("\n");
              array.pop();
              return $scope[listName] = array;
            } else if (valueL.VALUE_TYPE === 'query') {
              query = valueL.VALUE;
              return $http({
                method: "GET",
                url: options.api.base_url + "/query/" + query
              }).success(function(data_query) {
                $scope.queries = data_query;
                $scope.queries.NAME = valueL.NAME;
                return $scope.go = true;
              }).error(function(err) {
                return console.log(err);
              });
            }
          });
        } else {
          $scope.parameters.push(value);
          return $scope.go = true;
        }
      });
      ref1 = $scope.parameters;
      results = [];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        parameter = ref1[j];
        results.push($scope.selected[parameter.NAME] = parameter.DEFAULT_VALUE);
      }
      return results;
    }).error(function(err) {
      return console.log(err);
    });
  };
  $scope.return_html = function(parameter) {
    var html, info;
    html = null;
    info = parameter.NAME;
    if (parameter.TYPE === "Date") {
      html = "  <div class=\"col s6\">\n<div class=\"row\">\n  <label class=\"\">" + parameter.LIBELLE + "</label>\n<datepicker date-format=\"yyyy-MM-dd\" date-set=\"  " + $scope.today + "  \" class=\"ng-isolate-scope\">\n<input class=\"input_workflow\" style=\"width: 90%;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;\" ng-model=\" selected." + info + " \" type=\"text\"/>\n    </datepicker>\n  </div>\n</div> ";
    } else if (parameter.TYPE === "FileBrowse") {
      html = "      <div class=\"file-field input-field\">\n<div class=\"file_workflow btn\">\n  <i class=\"material-icons\">input</i>\n  <input file-model=\" file." + info + "\" type=\"file\" multiple>\n</div>\n<div class=\"file-path-wrapper\">\n  <input file-model=\" file." + info + "\" class=\"file-path validate\" type=\"text\" placeholder=\"Uploader un ou plusieurs fichiers\">\n  </div>\n</div>";
    } else if (parameter.TYPE === "TextBox") {
      html = "  <div class=\"col s12\">\n<div class=\"row\">\n  <label  class=\" labelstyle\">{{parameter.LIBELLE}}</label>\n  <md-input-container class=\"md-block\">\n    <input class=\"input_workflow\" ng-model=\" selected." + info + "\" aria-label=\"email\" type=\"text\" ng-pattern=\"word\" style=\"margin: 0;height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;\" name=\"mail\" required=\"\">\n                          </md-input-container>\n</div>\n                      </div> ";
    } else if (parameter.TYPE === "BooleanGroup") {
      html = "  <div style=\"margin-bottom:25px\"  class=\"col s4\">\n<div class=\"row\">\n    <md-switch style=\"margin-left:5px;\"ng-model=\" selected." + info + "\" aria-label=\"BooleanGroup\">\n                              {{parameter.LIBELLE}}\n                            </md-switch>\n</div>\n                      </div> ";
    }
    return html = $sce.trustAsHtml(html);
  };
  $scope.return_html_listBox = function(parameter) {
    var array, html, libelle, listName, value;
    if (parameter.NAME !== "SiteID") {
      listName = parameter.NAME;
      libelle = parameter.LIBELLE;
      value = parameter.VALUE;
      array = value.split("\n");
      array.pop();
      $scope[listName] = array;
      if (parameter.TYPE === 'ListBox' && parameter.MULTIPLE_CUSTOM === "False") {
        html = "  <div style=\"margin-top:10px\" class=\"col s12\">\n<div class=\"row\">\n  <label class=\"\">" + libelle + "</label>\n<fieldset class=\"fieldset\">\n  <md-input-container ng-repeat=\"data in " + listName + "\" class=\"col s6\">\n<md-checkbox ng-model=\"selected." + listName + "[data]\" aria-label=\"CheckBoxList\">\n          {{data}}\n        </md-checkbox>\n      </md-input-container>\n    </fieldset>\n  </div>\n</div> ";
      } else if (parameter.TYPE === 'ListBox' && parameter.MULTIPLE_CUSTOM === "True") {
        html = "  <div style=\"margin-top:10px\" class=\"col s12\">\n<div class=\"row\">\n  <label class=\"\">" + libelle + "</label>\n<fieldset class=\"fieldset\">\n  <md-input-container ng-repeat=\"data in " + listName + "\" class=\"col s6\">\n<md-checkbox ng-model=\" multiple_custom." + listName + "[data]\" aria-label=\"CheckBoxList\">\n          {{data}}\n        </md-checkbox>\n      </md-input-container>\n    </fieldset>\n  </div>\n</div> ";
      } else if (parameter.TYPE === 'DropDown') {
        html = "  <div class=\"col s12\">\n<div class=\"row\">\n  <label  class=\"\">" + libelle + "</label>\n<md-input-container class=\"col s6\" style=\"margin-right: 10px;margin-bottom: 10px;width:100%;height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;\">\n  <md-select aria-label=\"$index\" style=\"height: 50px;\" ng-model=\" selected." + listName + "\">\n<md-option ng-repeat=\"data in " + listName + "\" value=\"{{data}}\">{{data}}</md-option>\n      </md-select>\n    </md-input-container>\n  </div>\n</div> ";
      }
      return html = $sce.trustAsHtml(html);
    }
  };
  isNotEmpty = function(obj) {
    var prop;
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return true;
      }
    }
  };
  return $scope.submit = function() {
    var json_data, multiple, string, url;
    $scope.height = $('#main').height();
    $scope.height = $scope.height - 50;
    $scope.height_circular = $scope.height / 1.4;
    $scope.height_circular = $scope.height_circular + "px";
    $scope.height = $scope.height + "px";
    $scope.displayload = true;
    $scope.string = " ";
    multiple = {};
    angular.forEach($scope.listBoxs, function(valueL, keyL) {
      if (valueL.MULTIPLE_CUSTOM === "True") {
        $scope.string = valueL.MULTIPLE_START;
        $scope.multiple_separator = valueL.MULTIPLE_SEPARATOR;
        $scope.multiple_end = valueL.MULTIPLE_END;
        return $scope.multiple_name = valueL.NAME;
      }
    });
    angular.forEach($scope.multiple_custom, function(value, key) {
      var data;
      data = Object.keys(value);
      if (data.length > 0) {
        angular.forEach(data, function(valueD, key) {
          return $scope.string += valueD + $scope.multiple_separator;
        });
        return $scope.string = $scope.string.substring(0, $scope.string.length - 1);
      }
    });
    $scope.string += $scope.multiple_end;
    console.log($scope.string);
    multiple[$scope.multiple_name] = $scope.string;
    if ($scope.multiple_name) {
      $scope.selected = angular.merge(multiple, $scope.selected);
    }
    string = "@travelplanet.fr";
    if (isNotEmpty($scope.file)) {
      if ($scope.infosWokflow.length >= 1) {
        $scope.selected['path'] = $scope.infosWokflow[0].PATH;
        $scope.selected['type'] = $scope.infosWokflow[0].TYPE;
        $scope.selected['workflow_name'] = $scope.WORKFLOW_NAME;
        if ($scope.selected.TP_MAIL.indexOf(string) !== -1) {
          json_data = JSON.stringify($scope.selected).replace(/\\n|\\r/g, "");
          console.log(json_data);
          return $http({
            method: "POST",
            url: "http://api-interne.travelplanet.fr/api/Alteryx/Workflow",
            data: {
              json_data: json_data,
              file: $scope.file
            },
            transformResponse: [
              function(data) {
                return console.log(data);
              }
            ]
          }).success(function(data) {
            console.log(data);
            alertFct.okCreateFactory();
            return $scope.displayload = false;
          }).error(function(err) {
            return console.log("une error est survenue");
          });
        } else {
          return alertFct.alertSend();
        }
      }
    } else {
      url = "http://api-interne.travelplanet.fr/api/Alteryx/Workflow";
      if ($scope.infosWokflow.length >= 1) {
        $scope.selected['path'] = $scope.infosWokflow[0].PATH;
        $scope.selected['type'] = $scope.infosWokflow[0].TYPE;
        $scope.selected['workflow_name'] = $scope.WORKFLOW_NAME;
        if ($scope.selected.TP_MAIL.indexOf(string) !== -1) {
          json_data = JSON.stringify($scope.selected).replace(/\\n|\\r/g, "");
          console.log(json_data);
          return $http({
            method: "POST",
            url: url,
            data: json_data,
            transformResponse: [
              function(data) {
                return console.log(data);
              }
            ]
          }).success(function(data) {
            console.log(data);
            alertFct.okCreateFactory();
            return $scope.displayload = false;
          }).error(function(err) {
            return console.log("une error est survenue");
          });
        } else {
          return alertFct.alertSend();
        }
      }
    }
  };
}]);

tableau.factory('alertExpirationFct', ["SweetAlert", "store", function(SweetAlert, store) {
  return {
    alertExpiration: function() {
      SweetAlert.swal({
        title: "Session Expirée",
        text: "Session expirée, retour à la page de connexion",
        type: "warning"
      });
      return store.remove('JWT');
    },
    tokenNotFound: function() {},
    loginError: function() {
      store.remove('JWT');
      return SweetAlert.swal({
        title: "Connexion refusée",
        text: "Login ou mot de passe erroné, veuillez vous reconnecter",
        type: "error"
      });
    },
    alertSendMail: function() {
      return SweetAlert.swal({
        title: "Mail Envoyé!",
        text: "Votre mail a bien été transmis à nos équipes. Nous nous engageons à vous répondre dans les plus brefs délais",
        imageUrl: "img/sendMail.gif"
      });
    }
  };
}]);

tableau.factory('alertFct', ["SweetAlert", "$http", "$location", "$state", function(SweetAlert, $http, $location, $state) {
  return {
    okCreateFactory: function() {
      return SweetAlert.swal("Bien Joué!", "Cet élément est maintenant enregistré!", "success");
    },
    alertSend: function() {
      return SweetAlert.swal({
        title: "Attention !",
        text: "L'adresse email de destination doit contenir '@travelplanet.fr' ",
        imageUrl: "img/warning.svg"
      });
    }
  };
}]);

tableau.factory('bitmaskFactory', function() {
  return {
    compare: function(listA, listB) {
      var array, i, range;
      range = Math.min.apply(Math, [listA.length, listB.length]);
      array = [];
      i = 0;
      while (i < range) {
        array.push(listA[i] & listB[i]);
        i++;
      }
      return array;
    },
    fuse: function(listA, listB) {
      var getArray, i, range;
      range = Math.max.apply(Math, [listA.length, listB.length]);
      getArray = [];
      i = -1;
      while (i < range) {
        i++;
        if (i < Math.min.apply(Math, [listA.length, listB.length])) {
          getArray.push(listA[i] + listB[i]);
        } else {
          if (i >= listA.length) {
            getArray.push(listB[i]);
          } else {
            getArray.push(listA[i]);
          }
        }
      }
      return getArray;
    },
    decode: function(map_embed) {
      var base, i, list, n, q, r;
      i = 0;
      list = [];
      while (i < map_embed.length) {
        if (map_embed[i] !== 0) {
          base = 31;
          n = map_embed[i];
          r = n;
          while (r !== 0) {
            r = n % getResultBase2[base];
            q = (n - r) / getResultBase2[base];
            if (q === 1) {
              list.push(base + (32 * i));
            }
            n = r;
            base--;
          }
        }
        i++;
      }
      return list;
    }
  };
});

tableau.factory('ipFct', ["$location", "$http", "store", "jwtHelper", function($location, $http, store, jwtHelper) {
  return {
    insertDataIp: function(get_action) {
      var decode, token;
      if (store.get('JWT')) {
        token = store.get('JWT');
        decode = jwtHelper.decodeToken(token);
        return $.getJSON('https://freegeoip.net/json/?callback', function(data) {
          var date, geo;
          geo = data;
          date = new Date();
          return $http({
            method: 'POST',
            url: options.api.base_url + '/log',
            data: {
              ip: geo.ip,
              country_code: geo.country_code,
              country_name: geo.country_name,
              region_name: geo.region_name,
              zip_code: geo.zip_code,
              time_zone: geo.time_zone,
              lattitude: geo.latitude,
              longitude: geo.longitude,
              action: get_action,
              user_id: decode[0].UID,
              username: decode[0].username
            }
          }).error(function(err) {
            return console.log(err);
          });
        });
      }
    }
  };
}]);

tableau.factory('logoutFct', ["SweetAlert", "$location", "store", "$rootScope", "$http", "$window", "jwtHelper", "ipFct", "$state", function(SweetAlert, $location, store, $rootScope, $http, $window, jwtHelper, ipFct, $state) {
  return {
    logOut: function() {
      return SweetAlert.swal({
        title: "Déconnexion",
        text: "Ceci mettra fin à votre session, continuer ?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Deconnexion",
        cancelButtonText: "Annuler",
        closeOnConfirm: true,
        closeOnCancel: true
      }, function(isConfirm) {
        var decode, is_saml, token;
        if (isConfirm) {
          if (store.get('JWT')) {
            token = store.get('JWT');
            decode = jwtHelper.decodeToken(token);
            is_saml = decode[0].is_saml;
            if (is_saml === false) {
              store.remove("JWT");
              store.remove("set");
              return $location.path("login");
            } else {
              store.remove("JWT");
              store.remove("set");
              return $state.go("login");
            }
          }
        }
      });
    },
    logOut_SC: function() {
      var decode, is_saml, token;
      if (store.get('JWT')) {
        token = store.get('JWT');
        decode = jwtHelper.decodeToken(token);
        is_saml = decode[0].is_saml;
        store.remove('JWT');
        store.remove('set');
        return $location.path('/login/account');
      }
    }
  };
}]);

tableau.factory('redirectInterceptor', ["$q", "$location", "$window", function($q, $location, $window) {
  return {
    'response': function(response) {
      if (typeof response.data === 'string' && response.data.indexOf('My Login Page') > -1) {
        $window.location.href = '/login.html';
        return $q.reject(response);
      } else {
        return response;
      }
    }
  };
}]);

tableau.factory('toastErrorFct', ["$mdToast", function($mdToast) {
  return {
    toastError: function(value) {
      return $mdToast.show($mdToast.simple().textContent(value).position('bottom right').hideDelay(3000));
    }
  };
}]);

tableau.factory('tokenFactory', ["store", "jwtHelper", function(store, jwtHelper) {
  return {
    tokenData: function() {
      var decode, token;
      token = store.get('JWT');
      decode = jwtHelper.decodeToken(token);
      return decode[0];
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

tableau.directive('compile', ["$compile", "$timeout", function($compile, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      $timeout((function() {
        return $compile(elem.contents())(scope);
      }), 100);
    }
  };
}]);

tableau.directive('filter', ["$compile", "$timeout", function($compile, $timeout) {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      $timeout((function() {
        return $compile(elem.contents())(scope);
      }), 100);
    }
  };
}]);

tableau.directive('dynamicController', [
  '$controller', function($controller) {
    return {
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs) {
        var locals;
        locals = {
          $scope: scope,
          $element: element,
          $attrs: attrs
        };
        element.data('$Controller', $controller(scope.$eval(attrs.dynamicController), locals));
      }
    };
  }
]);

tableau.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter, {
            'event': event
          });
        });
        event.preventDefault();
      }
    });
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
