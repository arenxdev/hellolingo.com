var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Helpers = (function () {
    function Helpers() {
    }
    Helpers.htmlEncode = function (text) {
        return $("<div />").text(text).html();
    };
    Helpers.isValidEmail = function (email) {
        var regex = /(([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+)/gi;
        return regex.test(email);
    };
    Helpers.isValidSkype = function (skype) {
        var regex = /^[a-zA-Z][a-zA-Z0-9\.,\-_]{5,31}$/gi;
        return regex.test(skype);
    };
    Helpers.wrapInDiv = function (text, className) {
        if (className === void 0) { className = ""; }
        var div = $("<div class=\"" + className + "\"/>").text(text);
        return $('<div/>').append(div).html();
    };
    Helpers.searchAndWrapInElement = function (text, searchFor, className, element) {
        if (element === void 0) { element = "span"; }
        var regex = new RegExp("\\b(" + Helpers.regExpEscape(searchFor) + "\\b)", "gi");
        return text.replace(regex, "<" + element + " class=\"" + className + "\">$1</" + element + ">");
    };
    Helpers.regExpEscape = function (str) {
        var specials = /[.*+?|()\[\]{}\\$^]/g;
        return str.replace(specials, "\\$&");
    };
    Helpers.listOfBirthYears = function () {
        var years = [];
        var thisYear = new Date().getFullYear();
        for (var i = thisYear - 16; i > thisYear - 95; i--)
            years.push(i);
        return years;
    };
    Helpers.extend = function (first, second) {
        var result = {};
        for (var id in first)
            result[id] = first[id];
        for (var id in second)
            if (!result.hasOwnProperty(id))
                result[id] = second[id];
        return result;
    };
    Helpers.decodeAttr = function (text) { return $("<div/>").html(text).text(); };
    return Helpers;
}());
var Set = (function () {
    function Set(failOnDuplicate) {
        if (failOnDuplicate === void 0) { failOnDuplicate = true; }
        var _this = this;
        this.failOnDuplicate = failOnDuplicate;
        this.array = [];
        this.add = function (value) {
            if (!_this.contains(value))
                _this.array.push(value);
            else if (_this.failOnDuplicate)
                throw ("Failed to add value to Set. Value already exists");
        };
        this.remove = function (value) { var index = _this.array.indexOf(value, 0); if (index > -1)
            _this.array.splice(index, 1); };
        this.contains = function (value) { return _this.array.indexOf(value) > -1; };
        this.any = function () { return _this.array.length !== 0; };
    }
    return Set;
}());
var LiteEvent = (function () {
    function LiteEvent() {
        var _this = this;
        this.handlers = [];
        this.on = function (handler) { return _this.handlers.push(handler); };
        this.off = function (handler) { return _this.handlers = _this.handlers.filter(function (h) { return h !== handler; }); };
        this.trigger = function (data) { return _this.handlers.slice(0).forEach(function (h) { return h(data); }); };
    }
    return LiteEvent;
}());
var sysend;
var Authentication;
(function (Authentication) {
    var AuthenticationService = (function () {
        function AuthenticationService($http, userService, $templateCache, $log, $cookies, statesService) {
            var _this = this;
            this.$http = $http;
            this.userService = userService;
            this.$templateCache = $templateCache;
            this.$log = $log;
            this.$cookies = $cookies;
            this.statesService = statesService;
            this.loginUrl = "/api/account/log-in";
            this.signUpUrl = "/api/account/sign-up";
            this.logoutUrl = "/api/account/log-out";
            this.stateToRedirect = { stateName: undefined, params: undefined };
            this.isAuthenticated = function () { return _this.userService.isUserExist(); };
            this.getStateToRedirect = function () { return _this.stateToRedirect; };
            this.login = function (credentials) {
                return _this.$http.post(_this.loginUrl, credentials)
                    .then(function (response) {
                    if (response.data.isAuthenticated)
                        _this.userService.create(response.data.userData);
                    return response.data;
                }, function () {
                    _this.$log.ajaxError("LogInPostFailed");
                    return false;
                });
            };
            this.signUp = function (user) {
                return _this.$http.post(_this.signUpUrl, user).then(function (response) {
                    if (response.data.isAuthenticated)
                        _this.userService.create(response.data.userData);
                    return response.data;
                }, function () {
                    _this.$log.ajaxError("SignUpPostFailed");
                    return { isAuthenticated: false, message: { text: "Well! Could you try that again?" } };
                });
            };
            this.logout = function () {
                return _this.$http.post(_this.logoutUrl, {})
                    .then(function (response) {
                    if (response.data.isAuthenticated === false) {
                        sysend.broadcast("logOut");
                        _this.applyLogOut();
                    }
                    return response.data.isAuthenticated;
                }, function () {
                    _this.$log.ajaxError("LogOutPostFailed");
                    return false;
                });
            };
            this.setStateToRedirect = function (stateName, params) {
                _this.stateToRedirect.stateName = stateName;
                _this.stateToRedirect.params = params;
            };
            sysend.on("logOut", function () {
                _this.applyLogOut();
                $log.appInfo("CrossSessionLogOutApplied");
            });
        }
        AuthenticationService.prototype.applyLogOut = function () {
            this.$cookies.remove(Config.CookieNames.loggedIn);
            this.userService.create(undefined);
            this.statesService.resetAllStates();
            this.statesService.goAndReload(States.home.name);
        };
        AuthenticationService.$inject = ["$http", "userService", "$templateCache", "$log", "$cookies", "statesService"];
        return AuthenticationService;
    }());
    Authentication.AuthenticationService = AuthenticationService;
})(Authentication || (Authentication = {}));
var FormInputsRegulator = (function () {
    function FormInputsRegulator() {
    }
    FormInputsRegulator.cleanFirstName = function (nameString) {
        if (nameString) {
            nameString = nameString.replace(FormInputsRegulator.firstNameStartRegExp, "")
                .replace(FormInputsRegulator.firstNameEndRegExp, "");
        }
        return nameString;
    };
    FormInputsRegulator.cleanLastName = function (nameString) {
        if (nameString) {
            nameString = nameString.trim()
                .replace(FormInputsRegulator.lastNameRegExp, "")
                .replace(FormInputsRegulator.lastNameStartTrimRegExp, "")
                .replace(FormInputsRegulator.lastNameEndTrimRegExp, "")
                .trim();
        }
        return nameString;
    };
    FormInputsRegulator.cleanLocation = function (locationString) {
        if (locationString) {
            locationString = locationString.trim()
                .replace(FormInputsRegulator.locationStartRegExp, "")
                .replace(FormInputsRegulator.locationEndRegExp, "")
                .replace(FormInputsRegulator.locationEndDotsRegExp, ".")
                .trim();
        }
        return locationString === "" ? undefined : locationString;
    };
    FormInputsRegulator.firstNameStartRegExp = /^[\u0020\\-]+/;
    FormInputsRegulator.firstNameEndRegExp = /[\u0020\\-]+$/;
    FormInputsRegulator.lastNameStartTrimRegExp = /^-+/;
    FormInputsRegulator.lastNameEndTrimRegExp = /-+$/;
    FormInputsRegulator.lastNameRegExp = /^\.+/;
    FormInputsRegulator.locationStartRegExp = /^[\u0020\.\(\),'&\\-]+/;
    FormInputsRegulator.locationEndRegExp = /[\u0020\(,'&\\-]+$/;
    FormInputsRegulator.locationEndDotsRegExp = /\.{2,}$/;
    return FormInputsRegulator;
}());
var Authentication;
(function (Authentication) {
    var SignUpUser = (function () {
        function SignUpUser() {
            this.lookToLearnWithTextChat = true;
            this.lookToLearnWithVoiceChat = true;
            this.lookToLearnWithGames = true;
            this.lookToLearnWithMore = false;
            switch (Runtime.uiCultureCode) {
                case "ar":
                    this.knows = 10;
                    break;
                case "es":
                    this.knows = 2;
                    break;
                case "fa":
                    this.knows = 21;
                    break;
                case "pl":
                    this.knows = 23;
                    break;
                case "pt-BR":
                    this.knows = 9;
                    break;
                case "ro":
                    this.knows = 25;
                    break;
                case "ru":
                    this.knows = 8;
                    break;
                case "tr":
                    this.knows = 17;
                    break;
                case "vi":
                    this.knows = 27;
                    break;
            }
        }
        return SignUpUser;
    }());
    Authentication.SignUpUser = SignUpUser;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var UserService = (function () {
        function UserService($q, $http, $log, countersService) {
            var _this = this;
            this.$q = $q;
            this.$http = $http;
            this.$log = $log;
            this.countersService = countersService;
            this.isUserDataLoaded = false;
            this.isInitLoadingStarted = false;
            this.create = function (user) {
                _this.currentUser = user;
                if (!_this.currentUser) {
                    _this.countersService.resetCounter(Services.Counters.MailBox);
                }
                return _this.currentUser;
            };
            this.getInitUserDataAsync = function () {
                if (_this.isInitLoadingStarted)
                    return;
                _this.isInitLoadingStarted = true;
                var deffered = _this.$q.defer();
                var httpPromise = _this.$http.get(Config.EndPoints.profileUrl);
                httpPromise.then(function (response) {
                    _this.isUserDataLoaded = true;
                    _this.isInitLoadingStarted = false;
                    if (response.data.isAuthenticated)
                        _this.handleAuthUserData(response.data);
                    deffered.resolve(response.data.isAuthenticated);
                }, function (arg) {
                    _this.currentUser = undefined;
                    _this.isInitLoadingStarted = false;
                    deffered.reject("Error during server request.");
                });
                return deffered.promise;
            };
            this.isUserExist = function () { return angular.isDefined(_this.currentUser); };
            this.getUser = function () { return angular.copy(_this.currentUser); };
            this.getTiles = function () {
                var tileIds = _this.defaultTileIds;
                for (var index in _this.filters) {
                    var filter = _this.filters[index];
                    if (filter.filterId === Dashboard.TileFilterValue.Promote && tileIds.indexOf(filter.tileId) === -1)
                        tileIds.push(filter.tileId);
                    else if (filter.filterId === Dashboard.TileFilterValue.Demote && tileIds.indexOf(filter.tileId) !== -1)
                        tileIds.splice(tileIds.indexOf(filter.tileId), 1);
                }
                return tileIds;
            };
            this.promoteTile = function (tileId) { return _this.setTile(tileId, Dashboard.TileFilterValue.Promote); };
            this.demoteTile = function (tileId) { return _this.setTile(tileId, Dashboard.TileFilterValue.Demote); };
            this.setTile = function (tileId, filterId) {
                if (_this.filters[tileId])
                    _this.filters[tileId].filterId = filterId;
                else
                    _this.filters[tileId] = { tileId: tileId, filterId: filterId };
            };
        }
        Object.defineProperty(UserService.prototype, "defaultTileIds", {
            get: function () { return [102, 104, 105, 108]; },
            enumerable: true,
            configurable: true
        });
        UserService.prototype.update = function (profile) {
            var _this = this;
            return this.$http
                .post(Config.EndPoints.profileUrl, profile)
                .then(function (response) {
                if (response.data.isUpdated)
                    _this.create(profile);
                return response.data;
            }, function () {
                _this.$log.ajaxError("PostProfile_PostFailed");
                return false;
            });
        };
        UserService.prototype.deleteUser = function (userData) {
            var _this = this;
            return this.$http
                .post(Config.EndPoints.postDeleteAccount, userData)
                .then(function (response) {
                if (response.data.isSuccess) {
                    _this.currentUser = undefined;
                }
                return response.data;
            }, function () {
                _this.$log.ajaxError("DeleteProfile_PostFailed");
                return false;
            });
        };
        UserService.prototype.resendEmailVerification = function () {
            return this.$http.get(Config.EndPoints.getResendEmailVerification).then(function () { return true; }, function () { return false; });
        };
        ;
        UserService.prototype.handleAuthUserData = function (serverResponse) {
            this.currentUser = angular.copy(serverResponse.userData);
            if (serverResponse.unreadMessagesCount) {
                this.countersService.setCounterValue(Services.Counters.MailBox, serverResponse.unreadMessagesCount);
            }
            this.filters = {};
            if (serverResponse.tileFilters) {
                for (var i = 0; i < serverResponse.tileFilters.length; i++) {
                    this.filters[serverResponse.tileFilters[i].tileId] = serverResponse.tileFilters[i];
                }
            }
        };
        UserService.prototype.updateTileFilters = function () {
            var _this = this;
            var filtersToUpdate = Array();
            for (var f in this.filters) {
                filtersToUpdate.push(this.filters[f]);
            }
            return this.$http
                .post(Config.EndPoints.postTilesFilter, filtersToUpdate)
                .then(function () { }, function () { _this.$log.ajaxWarn("UpdateTileFilters_PostFailed"); });
        };
        ;
        UserService.prototype.clearUserData = function () {
            this.currentUser = undefined;
            this.isUserDataLoaded = false;
        };
        UserService.prototype.setNoPrivateChat = function (bool) {
            this.currentUser.isNoPrivateChat = bool;
        };
        UserService.$inject = ["$q", "$http", "$log", "countersService"];
        return UserService;
    }());
    Authentication.UserService = UserService;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var LogInOrOutDirective = (function () {
        function LogInOrOutDirective(authService, userService, statesService, $log) {
            var _this = this;
            this.authService = authService;
            this.userService = userService;
            this.statesService = statesService;
            this.$log = $log;
            this.link = function ($scope, element) {
                $scope.isAuthenticated = _this.authService.isAuthenticated();
                $scope.hide = true;
                $scope.logOut = function (confirmMsg) {
                    if (confirm(confirmMsg) === false)
                        return;
                    _this.authService.logout().then(function () { return $scope.isAuthenticated = _this.authService.isAuthenticated(); });
                };
                $scope.$watch(function () {
                    return _this.authService.isAuthenticated();
                }, function (isAuthenticated) {
                    $scope.isAuthenticated = isAuthenticated;
                    $scope.hide = isAuthenticated && ($scope.showLogOff != null && !$scope.showLogOff);
                });
            };
            this.restrict = "E";
            this.scope = { showLogOff: "=" };
            this.templateUrl = "log-in-or-out-directive.tpl";
        }
        LogInOrOutDirective.factory = function () {
            var directive = function (authService, userService, statesService, $log) {
                return new LogInOrOutDirective(authService, userService, statesService, $log);
            };
            directive["$inject"] = ["authService", "userService", "statesService", "$log"];
            return directive;
        };
        return LogInOrOutDirective;
    }());
    Authentication.LogInOrOutDirective = LogInOrOutDirective;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var LogInDirective = (function () {
        function LogInDirective($timeout, authService, statesService, $log, serverResources) {
            var _this = this;
            this.$timeout = $timeout;
            this.authService = authService;
            this.statesService = statesService;
            this.$log = $log;
            this.serverResources = serverResources;
            this.link = function ($scope, element) {
                $scope.email = _this.statesService.params.emailOfExistingAccount;
                $scope.showExistingAccountAlert = $scope.email != undefined;
                $scope.validResult = new Authentication.LoginValidationResult();
                $scope.logIn = function () {
                    $scope.validResult.isEmailValid = true;
                    $scope.validResult.isPasswordValid = true;
                    $scope.isLogInFailed = false;
                    _this.$timeout(function () {
                        var credentials = { userName: $scope.email, password: $scope.password };
                        if (_this.validateForm($scope.logInForm, $scope.validResult)) {
                            _this.$log.appInfo("ValidLogInFormSubmitted", credentials);
                            _this.authService.login(credentials).then(function (loginServerResponse) {
                                if (loginServerResponse.isAuthenticated) {
                                    _this.statesService.resetAllStates();
                                    var stateToRedirect = _this.authService.getStateToRedirect();
                                    if (angular.isUndefined(stateToRedirect) || angular.isUndefined(stateToRedirect.stateName)) {
                                        stateToRedirect.stateName = States.home.name;
                                        stateToRedirect.params = undefined;
                                    }
                                    _this.statesService.goAndReload(stateToRedirect.stateName, stateToRedirect.params);
                                    _this.authService.setStateToRedirect(undefined, undefined);
                                }
                                else {
                                    $scope.isLogInFailed = true;
                                    _this.serverResources.getServerResponseText(loginServerResponse.message.code)
                                        .then(function (serverMessage) { $scope.logInServerFailedMessage = serverMessage; });
                                }
                            });
                        }
                        else
                            _this.$log.appInfo("InvalidLogInFormSubmitted", credentials);
                    }, 250);
                };
                $scope.goToSignUp = function () { return _this.statesService.go(States.signup.name); };
            };
            this.validateForm = function (formController, validation) {
                validation.isEmailValid = formController.email.$valid;
                validation.isPasswordValid = formController.password.$valid;
                return validation.isEmailValid && validation.isPasswordValid;
            };
            this.restrict = "E";
            this.scope = {};
            this.templateUrl = "Partials/Log-In-Directive";
        }
        LogInDirective.factory = function () {
            var directive = function ($timeout, authService, statesService, $log, serverResources) {
                return new LogInDirective($timeout, authService, statesService, $log, serverResources);
            };
            directive["$inject"] = ["$timeout", "authService", "statesService", "$log", "serverResources"];
            return directive;
        };
        return LogInDirective;
    }());
    Authentication.LogInDirective = LogInDirective;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var LoginValidationResult = (function () {
        function LoginValidationResult() {
            this.isEmailValid = true;
            this.isPasswordValid = true;
        }
        return LoginValidationResult;
    }());
    Authentication.LoginValidationResult = LoginValidationResult;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var SignUpFormValidation = (function () {
        function SignUpFormValidation(formCtrl, serverResources) {
            var _this = this;
            this.formCtrl = formCtrl;
            this.serverResources = serverResources;
            this.enabled = false;
            this.errors = {};
            serverResources.getAccountValidationErrors()
                .then(function (errorTransaltions) { _this.validationErrors = errorTransaltions; });
        }
        Object.defineProperty(SignUpFormValidation.prototype, "isEmailValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.email.$valid : true;
                if (!isValid)
                    this.errors["email"] = this.formCtrl.email.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isEmailCheckedValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.isEmailChecked.$valid : true;
                if (!isValid)
                    this.errors["isEmailChecked"] = this.formCtrl.isEmailChecked.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isPasswordValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.password.$valid : true;
                if (!isValid)
                    this.errors["password"] = this.formCtrl.password.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isReTypedPasswordValid", {
            get: function () {
                var isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.formCtrl.password.$modelValue === this.formCtrl.reTypedPassword.$modelValue);
                if (!isValid) {
                    this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "isFormValid", {
            get: function () {
                this.errors = {};
                return !this.enabled ? true : this.isEmailCheckedValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SignUpFormValidation.prototype, "signUpClientError", {
            get: function () {
                if (Object.keys(this.errors).length === 0)
                    return undefined;
                var passwordErrors = this.errors["password"];
                var errorText;
                if (passwordErrors) {
                    if (passwordErrors["minlength"])
                        errorText = this.validationErrors.passwordMinError;
                    else if (passwordErrors["maxlength"])
                        errorText = this.validationErrors.passwordMaxError;
                    else
                        errorText = this.validationErrors.defaultError;
                }
                else {
                    errorText = this.validationErrors.defaultError;
                }
                return errorText;
            },
            enumerable: true,
            configurable: true
        });
        return SignUpFormValidation;
    }());
    Authentication.SignUpFormValidation = SignUpFormValidation;
    var ProfileFormValidation = (function () {
        function ProfileFormValidation(formCtrl, user) {
            this.formCtrl = formCtrl;
            this.user = user;
            this.enabled = false;
        }
        Object.defineProperty(ProfileFormValidation.prototype, "isLearnsValid", {
            get: function () { return this.enabled ? this.user.learns : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isKnowsValid", {
            get: function () { return this.enabled ? this.user.knows : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isNameValid", {
            get: function () { return this.enabled ? this.isFirstNameValid && this.isLastNameValid : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFirstNameValid", {
            get: function () { return this.formCtrl.firstName.$valid && this.formCtrl.firstName.$modelValue.length >= 2; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isLastNameValid", {
            get: function () { return this.formCtrl.lastName.$valid; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isGenderValid", {
            get: function () { return this.enabled ? this.user.gender : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isBirthDateValid", {
            get: function () { return this.enabled ? this.user.birthMonth && this.user.birthYear : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isCountryValid", {
            get: function () { return this.enabled ? this.user.country !== undefined : true; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFormValid", {
            get: function () {
                return !this.enabled ? true :
                    this.isLearnsValid && this.isKnowsValid && this.isNameValid
                        && this.isBirthDateValid && this.isCountryValid && this.isGenderValid;
            },
            enumerable: true,
            configurable: true
        });
        return ProfileFormValidation;
    }());
    Authentication.ProfileFormValidation = ProfileFormValidation;
})(Authentication || (Authentication = {}));
var Authentication;
(function (Authentication) {
    var SignUpDirective = (function () {
        function SignUpDirective($timeout, authService, statesService, $rootScope, $log, serverResources) {
            var _this = this;
            this.$timeout = $timeout;
            this.authService = authService;
            this.statesService = statesService;
            this.$rootScope = $rootScope;
            this.$log = $log;
            this.serverResources = serverResources;
            this.restrict = "E";
            this.scope = {};
            this.templateUrl = "/partials/Sign-Up-Directive";
            this.link = function ($scope, element) {
                $scope.months = _this.serverResources.getMonths();
                $scope.years = Helpers.listOfBirthYears();
                $scope.languages = Languages.langsById;
                $scope.countries = _this.serverResources.getCountries();
                $scope.loading = false;
                $scope.user = new Authentication.SignUpUser();
                $scope.profileFormValidation = new Authentication.ProfileFormValidation($scope.profileForm, $scope.user);
                $scope.signUpFormValidation = new Authentication.SignUpFormValidation($scope.signUpForm, _this.serverResources);
                $scope.signUpFailedOnServer = false;
                $scope.setLearns = function (langs) { return $scope.user.learns = langs[0], $scope.user.learns2 = langs[1], $scope.user.learns3 = langs[2], langs; };
                $scope.setKnows = function (langs) { return $scope.user.knows = langs[0], $scope.user.knows2 = langs[1], $scope.user.knows3 = langs[2], langs; };
                $scope.setGenderAsMale = function () { return $scope.user.gender = Enums.Gender.male; };
                $scope.setGenderAsFemale = function () { return $scope.user.gender = Enums.Gender.female; };
                $scope.setMonth = function (index) {
                    $scope.user.birthMonth = $scope.months[index].id;
                    $scope.selectedMonth = $scope.months[index].text;
                };
                $scope.setCountry = function (c) {
                    $scope.user.country = c;
                    $scope.selectedCountry = $scope.countries[c];
                };
                $scope.submitProfile = function () {
                    $scope.profileFormValidation.enabled = true;
                    if ($scope.profileFormValidation.isFormValid) {
                        _this.$log.appInfo("ValidProfileFormSubmitted", { form: $scope.user });
                        _this.showModal();
                    }
                    else
                        _this.$log.appInfo("InvalidProfileFormSubmitted", { form: $scope.user });
                };
                $scope.signUp = function () {
                    $scope.signUpFailedOnServer = false;
                    $scope.signUpFormValidation.enabled = true;
                    if ($scope.signUpFormValidation.isFormValid === false) {
                        _this.$log.appInfo("InvalidSignUpFormSubmitted", { form: $scope.user });
                        return;
                    }
                    _this.$log.appInfo("ValidSignUpFormSubmitted", { form: $scope.user });
                    $scope.loading = true;
                    _this.authService.signUp($scope.user)
                        .then(function (data) {
                        $scope.loading = false;
                        if (data.isAuthenticated) {
                            goog_report_conversion();
                            _this.closeModal();
                            _this.statesService.resetAllStates();
                            _this.statesService.goAndReload(States.home.name);
                        }
                        else {
                            _this.handleSignUpFailure($scope, data);
                        }
                    });
                };
                $scope.removeIdenticalNames = function () {
                    if ($scope.user.firstName && $scope.user.lastName && $scope.user.firstName.toLowerCase() === $scope.user.lastName.toLowerCase()) {
                        $scope.user.firstName = "";
                        $scope.user.lastName = "";
                    }
                };
                $scope.cleanFirstName = function () {
                    $scope.removeIdenticalNames();
                    $scope.user.firstName = FormInputsRegulator.cleanFirstName($scope.user.firstName);
                };
                $scope.cleanLastName = function () {
                    $scope.removeIdenticalNames();
                    $scope.user.lastName = FormInputsRegulator.cleanLastName($scope.user.lastName);
                };
                $scope.cleanLocation = function () { return $scope.user.location = FormInputsRegulator.cleanLocation($scope.user.location); };
                _this.$rootScope.$on("$stateChangeStart", function () {
                    if ((_this.modalElement.data("bs.modal") || {}).isShown) {
                        _this.closeModal();
                    }
                });
                _this.modalElement = element.find("#signUpModal");
                try {
                    $scope.user.firstName = Runtime.SharedLingoData.first;
                    $scope.user.lastName = Runtime.SharedLingoData.last;
                    $scope.user.birthYear = Runtime.SharedLingoData.birthYear;
                    $scope.user.email = Runtime.SharedLingoData.email;
                    if (Runtime.SharedLingoData.gender === "m")
                        $scope.setGenderAsMale();
                    if (Runtime.SharedLingoData.gender === "f")
                        $scope.setGenderAsFemale();
                    $scope.user.isSharedLingoMember = !!Runtime.SharedLingoData.first;
                    if (Runtime.SharedLingoData.natives)
                        $scope.user.knows = _this.slLangToHlLang(Runtime.SharedLingoData.natives.split(",")[0]);
                    if (Runtime.SharedLingoData.learns)
                        $scope.user.learns = _this.slLangToHlLang(Runtime.SharedLingoData.learns.split(",")[0]);
                    if ($scope.user.knows === $scope.user.learns)
                        $scope.user.knows = null;
                    var country = _this.slCountryToHlCountry(Runtime.SharedLingoData.countryCode);
                    if (country)
                        $scope.setCountry(country);
                    $scope.user.location = Runtime.SharedLingoData.city;
                }
                catch (e) {
                    _this.$log.appError("FailImportSharedLingoDataIntoForm", {});
                }
            };
            this.slLangToHlLang = function (langCode) {
                switch (langCode) {
                    case "EN": return 1;
                    case "ES": return 2;
                    case "FR": return 3;
                    case "ZH": return 7;
                    case "RU": return 8;
                    case "PT": return 9;
                    case "IT": return 6;
                    case "PL": return 23;
                    case "KO": return 11;
                    case "JA": return 4;
                    case "HU": return 36;
                    case "VI": return 27;
                    case "DE": return 5;
                    case "NL": return 15;
                    case "TH": return 22;
                    case "TR": return 17;
                    case "AR": return 10;
                    case "IN": return 12;
                    default: return null;
                }
            };
            this.slCountryToHlCountry = function (countryCode) {
                switch (countryCode) {
                    case "US": return 100;
                    case "GB": return 101;
                    case "CA": return 102;
                    case "FR": return 104;
                    case "AU": return 105;
                    case "ES": return 106;
                    case "JP": return 107;
                    case "DE": return 108;
                    case "CN": return 109;
                    case "IT": return 111;
                    case "AR": return 112;
                    case "BR": return 113;
                    case "IR": return 114;
                    case "TR": return 115;
                    case "PK": return 117;
                    case "MX": return 119;
                    case "BE": return 120;
                    case "TW": return 121;
                    case "TH": return 122;
                    case "RU": return 123;
                    case "NL": return 124;
                    case "Nz": return 125;
                    case "PL": return 126;
                    case "KR": return 127;
                    case "IE": return 129;
                    case "EG": return 131;
                    case "SE": return 133;
                    case "SA": return 134;
                    case "MA": return 149;
                    case "DZ": return 162;
                    case "KW": return 163;
                    case "SY": return 171;
                    case "BH": return 172;
                    case "TN": return 179;
                    case "IQ": return 181;
                    default: return null;
                }
            };
            this.showModal = function () { return _this.modalElement.modal("show"); };
            this.closeModal = function () {
                _this.modalElement.modal("hide");
                $("body").removeClass("modal-open");
                $(".modal-backdrop").remove();
            };
        }
        SignUpDirective.prototype.handleSignUpFailure = function ($scope, serverResponse) {
            if (serverResponse.message.code === 2) {
                this.handleExistingEamilFailure($scope.user.email);
            }
            else {
                $scope.signUpFailedOnServer = true;
                this.serverResources.getServerResponseText(serverResponse.message.code).then(function (serverMessage) {
                    $scope.signUpServerFailedMessage = serverMessage;
                });
            }
        };
        ;
        SignUpDirective.prototype.handleExistingEamilFailure = function (email) {
            this.statesService.resetState(States.signup.name);
            var stateParams = { emailOfExistingAccount: email };
            this.statesService.go(States.login.name, stateParams);
        };
        SignUpDirective.factory = function () {
            var directive = function ($timeout, authService, statesService, $rootScope, $log, serverResources) {
                return new SignUpDirective($timeout, authService, statesService, $rootScope, $log, serverResources);
            };
            directive["$inject"] = ["$timeout", "authService", "statesService", "$rootScope", "$log", "serverResources"];
            return directive;
        };
        return SignUpDirective;
    }());
    Authentication.SignUpDirective = SignUpDirective;
})(Authentication || (Authentication = {}));
var Contacts;
(function (Contacts) {
    var DashboardWidget = (function () {
        function DashboardWidget() {
            this.restrict = "E";
            this.scope = {};
            this.controller = DashboardWidgetController;
            this.controllerAs = "widget";
            this.templateUrl = "dashboard-widget.tpl";
        }
        DashboardWidget.prototype.link = function () { };
        ;
        return DashboardWidget;
    }());
    Contacts.DashboardWidget = DashboardWidget;
    var DashboardWidgetController = (function () {
        function DashboardWidgetController($scope, $uibModal, contactsService, serverResources, $state) {
            this.$scope = $scope;
            this.$uibModal = $uibModal;
            this.contactsService = contactsService;
            this.serverResources = serverResources;
            this.$state = $state;
            this.sortUsersGetter = function (user) { return user.firstName; };
            this.$scope.languages = Languages.langsById;
            this.$scope.countries = this.serverResources.getCountries();
            this.$scope.contacts = this.contactsService.contacts;
        }
        DashboardWidgetController.prototype.chooseMember = function (user) {
            this.$uibModal.open({
                templateUrl: "modal-profile-view.tpl",
                controllerAs: "modalCtrl",
                controller: function () { return ({ user: user, showButtons: function () { return true; }, hasViewChatButton: function () { return true; } }); }
            });
        };
        DashboardWidgetController.prototype.sortUsersByKnows = function () { this.sortUsersGetter = function (user) { return Languages.langsById[Number(user.knows)].text; }; };
        DashboardWidgetController.prototype.sortUsersByLearns = function () { this.sortUsersGetter = function (user) { return Languages.langsById[Number(user.learns)].text; }; };
        DashboardWidgetController.$inject = ["$scope", "$uibModal", "contactsService", "serverResources", "$state"];
        return DashboardWidgetController;
    }());
    Contacts.DashboardWidgetController = DashboardWidgetController;
})(Contacts || (Contacts = {}));
var ContactUsCtrl = (function () {
    function ContactUsCtrl($scope, $http, $location, authService, statesService) {
        this.$scope = $scope;
        this.$http = $http;
        this.$location = $location;
        this.authService = authService;
        this.statesService = statesService;
        this.$scope.isAuthenticated = authService.isAuthenticated();
        this.$scope.contactMessage = {};
        this.disableValidation();
    }
    ContactUsCtrl.prototype.send = function () {
        var _this = this;
        if (!this.validateForm())
            return;
        this.$http.post(Config.EndPoints.postContactUsMessage, this.$scope.contactMessage)
            .then(function () { _this.statesService.closeState(States.contactUs.name); }, function (errorData) { throw new Error(errorData); });
    };
    ContactUsCtrl.prototype.validateForm = function () {
        this.$scope.isEmailInvalid = this.$scope.contactForm.email && !this.$scope.contactForm.email.$valid;
        this.$scope.isMessageInvalid = !this.$scope.contactForm.message.$valid;
        return !this.$scope.isEmailInvalid && !this.$scope.isMessageInvalid;
    };
    ContactUsCtrl.prototype.disableValidation = function () {
        this.$scope.isEmailInvalid = false;
        this.$scope.isMessageInvalid = false;
    };
    ContactUsCtrl.$inject = ["$scope", "$http", "$location", "authService", "statesService"];
    return ContactUsCtrl;
}());
var HomeFindBlockCtrl = (function () {
    function HomeFindBlockCtrl($scope, statesService) {
        var _this = this;
        this.$scope = $scope;
        this.statesService = statesService;
        this.$scope.findLanguages = {};
        this.$scope.languageChanged = function () {
            var knownId = _this.$scope.findLanguages.knownId;
            var learnId = _this.$scope.findLanguages.learnId;
            _this.statesService.go(States.findByLanguages.name, {
                known: (Languages.langsById[knownId] && Languages.langsById[knownId].name) || "any",
                learn: Languages.langsById[learnId] && Languages.langsById[learnId].name
            });
        };
    }
    HomeFindBlockCtrl.$inject = ["$scope", "statesService"];
    return HomeFindBlockCtrl;
}());
var TasbarButton = (function () {
    function TasbarButton(stateName, iconUrl, htmlText, hasCounter, disableClose) {
        this.stateName = stateName;
        this.iconUrl = iconUrl;
        this.htmlText = htmlText;
        this.hasCounter = hasCounter;
        this.disableClose = disableClose;
    }
    return TasbarButton;
}());
var TaskbarCtrl = (function () {
    function TaskbarCtrl($rootScope, $scope, $element, $timeout, $window, $sce, authService, $state) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$element = $element;
        this.$timeout = $timeout;
        this.$window = $window;
        this.$sce = $sce;
        this.authService = authService;
        this.$state = $state;
        var resizeTimeout = null;
        $scope.darkColor = function () { return _this.authService.isAuthenticated(); };
        $scope.hasShadow = function () {
            var isUnderbarState = $state.includes(States.find.name) || $state.includes(States.mailbox.name);
            return isUnderbarState && _this.authService.isAuthenticated();
        };
        $scope.logoCollapsed = false;
        $scope.isHomeCurrent = function () { return $state.current.name === States.home.name; };
        $scope.hideTaskBar = function () { return $state.current.name === States.signup.name; };
        $scope.buttonsOnTaskbar = [];
        $scope.showAlert = false;
        $rootScope.taskBarAlert = function (message) {
            $scope.alertMessage = message;
            $scope.showAlert = true;
        };
        $scope.addAppButton = function (btn) {
            $scope.buttonsOnTaskbar.push({
                stateName: btn.stateName,
                text: $sce.trustAsHtml(btn.htmlText),
                iconUrl: btn.iconUrl,
                disableClose: btn.disableClose,
                hasCounter: btn.hasCounter
            });
        };
        $scope.addAppButton(new TasbarButton(States.home.name, "/Images/Icons/taskbar-icon-dashboard-48.png", "Dashboard", false, true));
        $scope.addAppButton(new TasbarButton(States.textChat.name, "/Images/Icons/taskbar-icon-text-chat-48.png", "Text <br>Chat", true));
        $scope.addAppButton(new TasbarButton(States.mailbox.name, "/Images/Icons/taskbar-icon-mailbox-48.png", "Mail<br>Box", true));
        $scope.addAppButton(new TasbarButton(States.find.name, "/Images/Icons/taskbar-icon-find-48.png", "Members<br>Search"));
        $scope.addAppButton(new TasbarButton(States.profile.name, "/Images/Icons/taskbar-icon-profile-48.png", "Profile"));
        $scope.addAppButton(new TasbarButton(States.contactUs.name, "/Images/Icons/taskbar-icon-contact-us-48.png", "Contact<br>Us"));
        angular.element($window).bind("resize", function () {
            $timeout.cancel(resizeTimeout);
            resizeTimeout = $timeout($scope.spaceButtonsProperly, 500);
        });
        $scope.spaceButtonsProperly = function (indexOfButtonToKeepUncollapsed) {
            var maxWidth = $element.width();
            $scope.logoCollapsed = maxWidth < 480;
        };
    }
    TaskbarCtrl.$inject = ["$rootScope", "$scope", "$element", "$timeout", "$window", "$sce", "authService", "$state"];
    return TaskbarCtrl;
}());
var Dashboard;
(function (Dashboard) {
    var DashboardCtrl = (function () {
        function DashboardCtrl($scope, userService) {
            var _this = this;
            this.userService = userService;
            this.scope = Helpers.extend({}, {
                categories: this.tileCategories,
                categorizedTiles: this.categorizedTiles,
                pinnedTiles: this.pinnedTiles,
                isPinnedTile: function (tileId) { return _this.userService.getTiles().indexOf(tileId) !== -1; },
                switchInfoView: function () { return _this.switchInfoView(); },
                switchPinMode: function () { return _this.switchPinMode(); }
            });
            this.scope = angular.extend($scope, this.scope);
        }
        Object.defineProperty(DashboardCtrl.prototype, "tileCategories", {
            get: function () {
                return [
                    { id: 1 },
                    { id: 2, title: "i18nCategoryAllFeatures" },
                    { id: 3, title: "i18nCategoryFuture" }
                ];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DashboardCtrl.prototype, "categorizedTiles", {
            get: function () {
                var tiles = {
                    1: [
                        { id: 601, type: Dashboard.TileType.Widget, cssClass: "contact-list", widgetDirective: "contacts-tile-widget" },
                    ],
                    2: [
                        { id: 102, type: Dashboard.TileType.Feature, title: "i18nTileTextChatTitle", description: "i18nTileTextChatDesc", stateName: States.textChat.name, cssClass: "icon-text-chat" },
                        { id: 104, type: Dashboard.TileType.Feature, title: "i18nTileFindTitle", description: "i18nTileFindDesc", stateName: States.findByLanguages.name, cssClass: "icon-find" },
                        { id: 105, type: Dashboard.TileType.Feature, title: "i18nTileMailboxTitle", description: "i18nTileMailboxDesc", stateName: States.mailbox.name, cssClass: "icon-mailbox" },
                        { id: 106, type: Dashboard.TileType.Feature, title: "i18nTileFindBySharedTalkTitle", description: "i18nTileFindBySharedTalkDesc", stateName: States.findBySharedTalk.name, cssClass: "icon-find-by-sharedtalk" },
                        { id: 107, type: Dashboard.TileType.Feature, title: "i18nTileFindByLivemochaTitle", description: "i18nTileFindByLivemochaDesc", stateName: States.findByLivemocha.name, cssClass: "icon-find-by-livemocha" },
                        { id: 109, type: Dashboard.TileType.Feature, title: "i18nTileProfileTitle", description: "i18nTileProfileDesc", stateName: States.profile.name, cssClass: "icon-profile" },
                        { id: 118, type: Dashboard.TileType.Feature, title: "i18nTileChatHistoryTitle", description: "i18nTileChatHistoryDesc", stateName: States.textChatHistory.name, cssClass: "icon-chat-history" },
                        { id: 123, type: Dashboard.TileType.Feature, title: "i18nTileI18NTitle", description: "i18nTileI18NDesc", stateName: States.featureI18N.name, cssClass: "icon-in-your-language" },
                        { id: 901, type: Dashboard.TileType.Url, title: "i18nTileSharedLingoTitle", description: "i18nTileNotAvailDesc", url: "https://sharedlingo.hellolingo.com", cssClass: "icon-sharedlingo" },
                    ],
                    3: [
                        { id: 110, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-resources", title: "i18nTileYourResourcesTitle", description: "i18nTileYourResourcesDesc" },
                        { id: 114, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-advanced-find", title: "i18nTileAdvancedFindTitle", description: "i18nTileAdvancedFindDesc" },
                        { id: 111, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-features", title: "i18nTileYourFeaturesTitle", description: "i18nTileYourFeaturesDesc" },
                        { id: 112, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-your-mockups", title: "i18nTileYourMockupsTitle", description: "i18nTileYourMockupsDesc" },
                        { id: 122, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-review-and-edit", title: "i18nTileReviewAndEditTitle", description: "i18nTileReviewAndEditDesc" },
                        { id: 117, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-learning-content", title: "i18nTileLearningContentTitle", description: "i18nTileLearningContentDesc" },
                        { id: 121, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-games", title: "i18nTileGamesTitle", description: "i18nTileGamesDesc" },
                        { id: 113, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-ios-app", title: "i18nTileIosAppTitle", description: "i18nTileIosAppDesc" },
                        { id: 126, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-android-app", title: "i18nTileAndroidAppTitle", description: "i18nTileAndroidAppDesc" },
                        { id: 115, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "i18nTileSecretTool1Title", description: "i18nTileSecretTool1Desc" },
                        { id: 116, type: Dashboard.TileType.Feature, isPlanned: true, cssClass: "icon-secret-tool", title: "i18nTileSecretTool2Title", description: "i18nTileSecretTool2Desc" },
                    ]
                };
                return tiles;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DashboardCtrl.prototype, "pinnedTiles", {
            get: function () {
                var pinnedTiles = [];
                var tileIds = this.userService.getTiles();
                for (var i in this.categorizedTiles)
                    for (var _i = 0, _a = this.categorizedTiles[i]; _i < _a.length; _i++) {
                        var tile = _a[_i];
                        if (tileIds.indexOf(tile.id) !== -1)
                            pinnedTiles.push(tile);
                    }
                return pinnedTiles;
            },
            enumerable: true,
            configurable: true
        });
        DashboardCtrl.prototype.switchInfoView = function () {
            this.scope.showTileInfo = !this.scope.showTileInfo;
        };
        DashboardCtrl.prototype.switchPinMode = function () {
            this.scope.isPinMode = !this.scope.isPinMode;
            if (!this.scope.isPinMode) {
                this.userService.updateTileFilters();
                this.scope.categorizedTiles = this.categorizedTiles;
                this.scope.pinnedTiles = this.pinnedTiles;
            }
        };
        DashboardCtrl.$inject = ["$scope", "userService"];
        return DashboardCtrl;
    }());
    Dashboard.DashboardCtrl = DashboardCtrl;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var DashboardDirective = (function () {
        function DashboardDirective() {
            this.restrict = "E";
            this.link = function (scope, element, attrs) {
                scope.i18n = function (resource) { return Helpers.decodeAttr(attrs[resource.toLowerCase()]); };
            };
            this.scope = {};
            this.templateUrl = "Partials/Dashboard";
            this.controller = Dashboard.DashboardCtrl;
            this.replace = true;
        }
        return DashboardDirective;
    }());
    Dashboard.DashboardDirective = DashboardDirective;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    ;
    var DashboardTileCtrl = (function () {
        function DashboardTileCtrl($scope, $cookies, $log, $document, statesService, userService) {
            var _this = this;
            this.$cookies = $cookies;
            this.$log = $log;
            this.$document = $document;
            this.statesService = statesService;
            this.userService = userService;
            this.scope = Helpers.extend({}, {
                onTileClick: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.onTileClick.apply(_this, args);
                },
                onPinClick: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return _this.onPinClick.apply(_this, args);
                }
            });
            this.scope = angular.extend($scope, this.scope);
        }
        DashboardTileCtrl.prototype.onTileClick = function () {
            if (this.scope.tileDef.isPlanned)
                return;
            if (this.scope.tileDef.type === Dashboard.TileType.Feature)
                this.statesService.go(this.scope.tileDef.stateName, this.scope.tileDef.stateParams);
            if (this.scope.tileDef.type === Dashboard.TileType.Url)
                this.$log.appInfo("UrlClicked", { url: this.scope.tileDef.url });
        };
        DashboardTileCtrl.prototype.onPinClick = function ($event, tileId) {
            $event.stopPropagation();
            this.scope.isPinned = !this.scope.isPinned;
            if (this.scope.isPinned)
                this.userService.promoteTile(tileId);
            else
                this.userService.demoteTile(tileId);
        };
        DashboardTileCtrl.$inject = ["$scope", "$cookies", "$log", "$document", "statesService", "userService"];
        return DashboardTileCtrl;
    }());
    Dashboard.DashboardTileCtrl = DashboardTileCtrl;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var DashboardTileDirective = (function () {
        function DashboardTileDirective() {
            this.restrict = "E";
            this.scope = {
                i18n: "=",
                tileDef: "=",
                showInfo: "=",
                pinMode: "=",
                isPinned: "="
            };
            this.controller = Dashboard.DashboardTileCtrl;
            this.templateUrl = "dashboard-tile.tpl";
        }
        DashboardTileDirective.prototype.link = function () { };
        ;
        return DashboardTileDirective;
    }());
    Dashboard.DashboardTileDirective = DashboardTileDirective;
})(Dashboard || (Dashboard = {}));
var Dashboard;
(function (Dashboard) {
    var WidgetTileDirective = (function () {
        function WidgetTileDirective($parse, $compile, $injector) {
            var _this = this;
            this.$parse = $parse;
            this.$compile = $compile;
            this.$injector = $injector;
            this.restrict = "E";
            this.link = function (scope, element, attrs) {
                var directiveNameGetter = _this.$parse(attrs.directive);
                var directiveName = directiveNameGetter(scope);
                var widget = _this.$compile("<" + directiveName + "></" + directiveName + ">")(scope);
                element.replaceWith(widget);
            };
        }
        WidgetTileDirective.$inject = ["$parse", "$compile", "$injector"];
        return WidgetTileDirective;
    }());
    Dashboard.WidgetTileDirective = WidgetTileDirective;
})(Dashboard || (Dashboard = {}));
var AllowPattern = (function () {
    function AllowPattern() {
        this.require = "ngModel";
        this.link = function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                var regex = new RegExp(attrs.allowPattern.replace("[", "[^"));
                var cleanedInput = inputValue.replace(regex, "");
                if (cleanedInput !== inputValue) {
                    var el = element[0];
                    var start = el.selectionStart;
                    var end = el.selectionEnd + cleanedInput.length - inputValue.length;
                    modelCtrl.$setViewValue(cleanedInput);
                    modelCtrl.$render();
                    el.setSelectionRange(start, end);
                }
                return cleanedInput;
            });
        };
    }
    return AllowPattern;
}());
var FocusOnShow = (function () {
    function FocusOnShow($timeout) {
        var _this = this;
        this.$timeout = $timeout;
        this.restrict = "A";
        this.link = function ($scope, $element, $attr) {
            if ($attr.ngShow) {
                $scope.$watch($attr.ngShow, function (newValue) {
                    if (newValue === true)
                        _this.$timeout(function () {
                            var elt = $element.children().find("#" + $attr.focusOnShow);
                            if (elt) {
                                elt.prop("disabled", false);
                                elt.focus();
                            }
                        }, 0);
                });
            }
        };
    }
    FocusOnShow.$inject = ["$timeout"];
    return FocusOnShow;
}());
var LanguageSelectDirective = (function () {
    function LanguageSelectDirective(modalLanguagesService) {
        var _this = this;
        this.modalLanguagesService = modalLanguagesService;
        this.restrict = "AE";
        this.require = "ngModel";
        this.replace = true;
        this.scope = {
            languageChanged: "&"
        };
        this.template = ["<span class=\"language-select btn btn-default btn-stripped\" ng-click=\"setLangFilter()\">",
            "{{languageLabel()}}",
            "<span class=\"caret\"></span>",
            "</span>"].join("");
        this.link = function (scope, elem, attrs, modelCtrl) {
            scope.languages = Languages.langsById;
            scope.languageLabel = function () {
                var langId = modelCtrl.$modelValue;
                return langId && scope.languages[langId].text ? scope.languages[langId].text : "               ";
            };
            scope.setLangFilter = function () {
                var currentLangId = modelCtrl.$modelValue;
                _this.modalLanguagesService.getLanguage(currentLangId, elem)
                    .then(function (langId) {
                    var haveChanged = langId !== modelCtrl.$modelValue;
                    modelCtrl.$setViewValue(langId);
                    if (scope.languageChanged && haveChanged)
                        scope.languageChanged();
                });
            };
        };
    }
    LanguageSelectDirective.$inject = ["modalLanguagesService"];
    return LanguageSelectDirective;
}());
var LanguageSelectWidgetDIrective = (function () {
    function LanguageSelectWidgetDIrective($compile, serverResources) {
        var _this = this;
        this.$compile = $compile;
        this.serverResources = serverResources;
        this.restrict = "AE";
        this.scope = {
            setLanguage: "&",
            selectedLanguages: "="
        };
        this.template = function () {
            var template = "<h4 class='text-center'>{content}</h4>";
            var learLangFilterTempl = "<language-select ng-model=\"selectedLanguages.learnId\" language-changed=\"languageChanged('learn' );\"></language-select>";
            var knowLangFilterTempl = "<language-select ng-model=\"selectedLanguages.knownId\" language-changed=\"languageChanged('know' );\"></language-select>";
            var translatedResource = _this.serverResources.getLanguagesFilter();
            translatedResource = translatedResource.replace("#learn#", learLangFilterTempl).replace("#know#", knowLangFilterTempl);
            template = template.replace("{content}", translatedResource);
            return template;
        };
        this.link = function (scope, elem, attrs) {
            scope.languageChanged = function (langFilter) {
                scope.setLanguage({
                    langFilter: langFilter
                });
            };
        };
    }
    LanguageSelectWidgetDIrective.$inject = ["$compile", "serverResources"];
    return LanguageSelectWidgetDIrective;
}());
var OnEnter = (function () {
    function OnEnter() {
        this.restrict = "A";
    }
    OnEnter.prototype.compile = function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () { scope.$eval(attrs.onEnter); });
                    event.preventDefault();
                }
            });
        };
    };
    return OnEnter;
}());
var ShowDuringChangeState = (function () {
    function ShowDuringChangeState(spinnerService) {
        var _this = this;
        this.spinnerService = spinnerService;
        this.directiveLink = function ($scope, element) {
            $scope.showObject = _this.spinnerService.showSpinner;
        };
        this.link = this.directiveLink;
        this.restrict = "A";
    }
    ShowDuringChangeState.factory = function () {
        var directive = function (spinnerService) {
            return new ShowDuringChangeState(spinnerService);
        };
        directive["$inject"] = ["spinnerService"];
        return directive;
    };
    return ShowDuringChangeState;
}());
var SwitchDirective = (function () {
    function SwitchDirective($parse) {
        var _this = this;
        this.$parse = $parse;
        this.restrict = "AE";
        this.require = "?ngModel";
        this.replace = true;
        this.scope = {
            ngDisabled: "=",
            ngChecked: "=",
            name: "@",
            onLabel: "@",
            offLabel: "@"
        };
        this.template = ["<label for=\"{{::uniqueId}}\" class=\"switch\">",
            "<input type=\"checkbox\" id=\"{{::uniqueId}}\" class=\"switch-input\"",
            "ng-click=\"$event.stopPropagation()\" ng-model=\"checked\" ng-disabled=\"ngDisabled\">",
            "<div class=\"switch-label\">{{ checked ? onLabel : offLabel}}</div>",
            "</label>"].join("");
        this.link = function (scope, elem, attrs, modelCtrl) {
            scope.uniqueId = "checkbox-" + SwitchDirective.uniqueId++;
            var trueValue = true;
            var falseValue = false;
            if (attrs.ngTrueValue !== undefined) {
                trueValue = attrs.ngTrueValue !== 'false' && (attrs.ngTrueValue === 'true' || attrs.ngTrueValue);
            }
            if (attrs.ngFalseValue !== undefined) {
                falseValue = attrs.ngFalseValue !== 'false' && (attrs.ngFalseValue === 'true' || attrs.ngFalseValue);
            }
            if (scope.name !== undefined) {
                elem.find(':checkbox').prop('name', scope.name);
            }
            scope.$watch('ngDisabled', function (newVal) {
                elem.toggleClass('disabled', newVal);
            });
            if (attrs.ngModel) {
                scope.modelCtrl = modelCtrl;
                scope.$watch('modelCtrl.$modelValue', function (newVal, oldVal) {
                    scope.checked = modelCtrl.$modelValue === trueValue;
                }, true);
                elem.click(function (e) {
                    if (scope.ngDisabled) {
                        e.preventDefault();
                        return;
                    }
                    if (modelCtrl.$modelValue === falseValue) {
                        modelCtrl.$setViewValue(trueValue);
                    }
                    else {
                        modelCtrl.$setViewValue(falseValue);
                    }
                });
            }
            else if (attrs.ngChecked) {
                var expressionHandler = _this.$parse(attrs.ngToggle);
                scope.$watch('ngChecked', function (newVal) {
                    scope.checked = newVal === trueValue;
                }, true);
                elem.click(function (e) {
                    if (scope.ngDisabled) {
                        e.preventDefault();
                        return;
                    }
                    var newVal = scope.checked ? falseValue : trueValue;
                    expressionHandler(scope.$parent, { $value: newVal });
                });
            }
        };
    }
    SwitchDirective.uniqueId = 1;
    SwitchDirective.$inject = ["$parse"];
    return SwitchDirective;
}());
var TextChatRoom = (function () {
    function TextChatRoom($sce, $cookies, $timeout, userService, chatUsersService, $state) {
        var _this = this;
        this.$sce = $sce;
        this.$cookies = $cookies;
        this.$timeout = $timeout;
        this.userService = userService;
        this.chatUsersService = chatUsersService;
        this.$state = $state;
        this.templateUrl = "text-chat-room.tpl";
        this.replace = true;
        this.scope = {
            accessor: "=",
            roomId: "@",
            roomTitle: "@",
            localFirstName: "@",
            localLastName: "@",
            nameHighlightClass: "@",
            textPosted: "&",
            showTooltip: "&",
            openModal: "&",
            isPrivate: "=",
            callState: "=",
            requestCall: "&",
            cancelCall: "&",
            acceptCall: "&",
            declineCall: "&",
            hangoutCall: "&",
            undockingEnabled: "=",
            isUndocked: "=",
            isInactive: "=",
            onInputKeyPress: "=",
            privateChatWith: "="
        };
        this.link = function (scope, element, attrs) {
            scope.accessor = new TextChatRoomAccessor(scope, _this.$sce, _this.$timeout, _this.$state);
            TextChatRoom.i18N = function (resource) { return Helpers.decodeAttr(attrs[resource.toLowerCase()]); };
            scope.element = element;
            scope.messages = [];
            scope.users = [];
            scope.languages = Languages.langsById;
            scope.loading = true;
            scope.inputType = InputTypes.textInputType;
            scope.inputNavType = null;
            scope.global = {};
            scope.setFocusOnInput = setFocusOnInput;
            var inputField = $("#inputField", element);
            inputField.on("keydown", function (event) { return scope.onInputKeyPress(event.keyCode, scope.roomId); });
            function setFocusOnInput() { inputField[0].focus(); }
            scope.postMessage = function () {
                var text = inputField.val();
                if (!text)
                    return;
                if (scope.inputType === InputTypes.emailInputType) {
                    if (Helpers.isValidEmail(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipEmailInvalid"), "error")]);
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedEmailAddress, text);
                    text = JSON.stringify({ email: text });
                }
                if (scope.inputType === InputTypes.skypeInputType) {
                    if (Helpers.isValidSkype(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipSkypeInvalid"), "error")]);
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedSkypeId, text);
                    text = JSON.stringify({ skype: text });
                }
                if (scope.inputType === InputTypes.secretRoomInputType) {
                    if (Config.Regex.secretRoom.test(text) === false) {
                        scope.showTooltip([new MessageTooltip(TextChatRoom.i18N("i18nTooltipErrorTitle"), TextChatRoom.i18N("i18nTooltipSecretRoomInvalid"), "error")]);
                        return;
                    }
                    _this.$cookies.put(Config.CookieNames.sharedSecretRoom, text);
                    text = JSON.stringify({ secretRoom: text });
                }
                scope.accessor.addMessage(MessageOrigin.self, undefined, scope.localFirstName, scope.localLastName, text);
                scope.scrollToBottom();
                scope.accessor.resetLastSeenMark();
                scope.inputType = InputTypes.textInputType;
                inputField.val("");
                setFocusOnInput();
                scope.textPosted({ text: text });
            };
            scope.addUserNameOrShowModal = function (message) {
                var filteredUsers = scope.users.filter(function (u) { return u.id === message.userId; });
                var haveToInsertName = filteredUsers.length === 1 || !message.userId;
                if (haveToInsertName) {
                    var firstName = message.firstName;
                    if (firstName.toLowerCase() !== scope.localFirstName.toLowerCase())
                        inputField.val((inputField.val() + " " + firstName).trim());
                    setFocusOnInput();
                }
                else
                    scope.openModal({ userId: message.userId });
            };
            scope.showTooltip = function (tooltips) {
                scope.tooltips = tooltips;
                var tooltipEl = $("#tooltipMsg", scope.element);
                if (tooltipEl.css("display") !== "none")
                    tooltipEl.finish().hide();
                tooltipEl.show().delay(5000).fadeOut(500);
            };
            scope.setInputType = function (type, $event) {
                var comeFromNonSharing = scope.inputType !== InputTypes.emailInputType &&
                    scope.inputType !== InputTypes.skypeInputType &&
                    scope.inputType !== InputTypes.secretRoomInputType &&
                    type === InputTypes.skypeInputType;
                scope.inputType = type;
                var placeholder = "", text = "";
                switch (type) {
                    case InputTypes.textInputType:
                        placeholder = TextChatRoom.i18N("i18nPlaceholderSayHi");
                        break;
                    case InputTypes.emailInputType:
                        placeholder = TextChatRoom.i18N("i18nPlaceholderYourEmail");
                        text = _this.$cookies.get(Config.CookieNames.sharedEmailAddress) || "";
                        break;
                    case InputTypes.skypeInputType:
                        placeholder = TextChatRoom.i18N("i18nPlaceholderYourSkypeId");
                        text = _this.$cookies.get(Config.CookieNames.sharedSkypeId) || "";
                        break;
                    case InputTypes.secretRoomInputType:
                        placeholder = TextChatRoom.i18N("i18nPlaceholderEnterSecretRoom");
                        text = _this.$cookies.get(Config.CookieNames.sharedSecretRoom) || "";
                        break;
                }
                inputField.attr("placeholder", placeholder).val(text);
                if (comeFromNonSharing)
                    scope.toggleInputNav("share", $event);
                else
                    setFocusOnInput();
            };
            scope.toggleInputNav = function (type, $event) {
                if ($event)
                    $event.stopPropagation();
                if (type === scope.inputNavType)
                    type = null;
                $("body").off("click.inputnav");
                scope.inputNavType = type;
                $("div[id^=shareNav]", element).stop().fadeOut().fadeIn();
                $("div[id^=inputNav]", element).stop().fadeOut().fadeIn();
                if (scope.inputNavType)
                    $("body").one("click.inputnav", function (e) {
                        scope.toggleInputNav(null);
                        scope.$apply("inputNavType");
                    });
            };
            scope.showUserModal = function (userId) {
                if (!userId)
                    return;
                scope.openModal({ userId: userId, hideChatButton: scope.isPrivate });
            };
            scope.unMarkRecentUser = function (user, roomId) {
                var index = user.recentlyJoinedRooms.indexOf(roomId);
                if (index !== -1)
                    user.recentlyJoinedRooms.splice(index, 1);
            };
            scope.hasNewMessagesOutOfView = false;
            scope.messagesHtml = $("#roomMessages", element)[0];
            scope.processScrollInterval = setInterval(function () {
                if (!scope.needsScrollToBottom && !scope.needsScrollToNewMessage && !scope.needsMandatoryScrollToBottom)
                    return;
                else {
                    var elt = scope.messagesHtml;
                    if (elt.clientHeight === 0)
                        return;
                    else if (scope.needsMandatoryScrollToBottom)
                        scope.scrollToBottom();
                    else if (elt.scrollHeight - (elt.scrollTop + elt.clientHeight) < 150)
                        scope.scrollToBottom();
                    else if (scope.needsScrollToNewMessage)
                        scope.hasNewMessagesOutOfView = true;
                }
            }, 500);
            scope.scrollToBottom = function () { return _this.$timeout(function () {
                var elt = scope.messagesHtml;
                $(elt).animate({ scrollTop: elt.scrollHeight }, 500);
                scope.needsScrollToBottom = false;
                scope.needsScrollToNewMessage = false;
                scope.needsMandatoryScrollToBottom = false;
                scope.hasNewMessagesOutOfView = false;
            }); };
            scope.$parent.$watch(attrs["ngShow"], function (val) {
                if (val)
                    _this.$timeout(function () {
                        scope.scrollToBottom();
                        scope.setFocusOnInput();
                    });
            });
            var whosTypingNow = [];
            scope.$watch(function () { return scope.users; }, function (users) {
                angular.forEach(users, function (user) {
                    var typingIndex = whosTypingNow.indexOf(user.id);
                    if (user.roomTypingIn && typingIndex === -1) {
                        scope.needsScrollToBottom = true;
                        whosTypingNow.push(user.id);
                    }
                    if (!user.roomTypingIn && typingIndex !== -1) {
                        scope.needsScrollToBottom = true;
                        whosTypingNow.splice(typingIndex, 1);
                    }
                });
            }, true);
            if (scope.isPrivate)
                scope.$watch(function () { return _this.chatUsersService.onlineUsers; }, function (list) {
                    var found = false;
                    angular.forEach(list, function (user) { if (user.id === scope.privateChatWith)
                        found = true; });
                    scope.isPartnerOnline = found;
                }, true);
            scope.requestScrollOnResize = function () { return scope.needsMandatoryScrollToBottom = true; };
            window.addEventListener("resize", scope.requestScrollOnResize, false);
            scope.userId = _this.userService.getUser().id;
        };
    }
    TextChatRoom.getTextWithTooltips = function (text, keywords) {
        var result = new TextWithTooltips(text);
        result.tooltips = TextChatRoom.keywordsTooltips(text, keywords);
        var urlsResult = TextChatRoom.textWithUrlTooltips(text);
        result.text = urlsResult.text;
        result.tooltips = result.tooltips.concat(urlsResult.tooltips);
        var emailTooltips = TextChatRoom.emailsTooltips(text);
        result.tooltips = result.tooltips.concat(emailTooltips);
        return result;
    };
    TextChatRoom.keywordsTooltips = function (text, keywordsTooltips) {
        var tooltips = [];
        angular.forEach(keywordsTooltips, function (tooltip) {
            var regex = new RegExp("\\b(" + Helpers.regExpEscape(tooltip.label) + "\\b)", "gi");
            if (regex.test(text))
                tooltips.push(tooltip);
        });
        return tooltips;
    };
    TextChatRoom.textWithUrlTooltips = function (text) {
        var result = new TextWithTooltips(text);
        var expression = /(https?:\/\/((?:www\.|(?!www))[^\s\.]+\.[^\s]{2,})|(www\.[^\s]+\.[^\s]{2,})|https?:\/\/([^\s]+))/gi;
        var urls = text.match(new RegExp(expression.source, "gi"));
        angular.forEach(urls, function (url) {
            var properLink = url.toLowerCase().indexOf("http") === 0 ? url : "http://" + url;
            result.tooltips.push(new UrlTooltip(properLink, TextChatRoom.i18N("i18nTooltipVisit")));
            var reasonableUrl = url.length < 50 ? url : url.substr(0, 46) + "...";
            result.text = text.replace(url, reasonableUrl);
        });
        return result;
    };
    TextChatRoom.emailsTooltips = function (text) {
        var tooltips = [];
        var regex = /([a-zA-Z]+@[a-zA-Z]+.[a-zA-Z]{2,4})/gi;
        var emails = text.match(regex);
        angular.forEach(emails, function (email) { tooltips.push(new EmailTooltip(email, TextChatRoom.i18N("i18nTooltipSendEmail"))); });
        return tooltips;
    };
    TextChatRoom.$inject = ["$sce", "$cookies", "$timeout", "userService", "chatUsersService", "textChatRoomsService", "$state"];
    return TextChatRoom;
}());
;
var TextChatRoomAccessor = (function () {
    function TextChatRoomAccessor(scope, $sce, $timeout, $state) {
        var _this = this;
        this.scope = scope;
        this.$sce = $sce;
        this.$timeout = $timeout;
        this.$state = $state;
        this.addUser = function (user) { return _this.scope.users.unshift(user); };
        this.removeUser = function (userId) { return _this.scope.users = _this.scope.users.filter(function (user) { return user.id !== userId; }); };
        this.lastMessage = null;
        this.formatBold = function (htmlText) { return _this.formatText(htmlText, "*", "message-bold"); };
        this.formatUnderline = function (htmlText) { return _this.formatText(htmlText, "_", "message-underline"); };
        this.formatStrikethrough = function (htmlText) { return _this.formatText(htmlText, "~", "message-strikethrough"); };
        this.formatEmoticons = function (htmlText) {
            return htmlText.replace(":)", "😃").replace(":-)", "😃").replace("\^\^", "😃").replace("\^_\^", "😃")
                .replace(":d", "😀").replace(":D", "😀").replace(":-d", "😀").replace(":-D", "😀")
                .replace(":p", "😛").replace(":P", "😛").replace(":-p", "😛").replace(":-P", "😛")
                .replace(";)", "😉").replace(";-)", "😉")
                .replace(";p", "😜").replace(";P", "😜")
                .replace(":o", "😲").replace(":O", "😲").replace(":-o", "😲").replace(":-O", "😲")
                .replace("&lt;3", "💗");
        };
    }
    TextChatRoomAccessor.prototype.addMessage = function (origin, userId, firstName, lastName, text, firstLoad) {
        var _this = this;
        if (firstLoad === void 0) { firstLoad = false; }
        var message = new TextChatMessage(origin, userId, firstName, lastName, text);
        this.lastMessage = text;
        var json;
        try {
            json = JSON.parse(text);
        }
        catch (e) { }
        if (json) {
            if (json.skype) {
                message.tooltips.push(new SkypeTooltip(json.skype, TextChatRoom.i18N("i18nTooltipOpenWithSkype")));
                message.text = json.skype;
                message.htmlText = Helpers.wrapInDiv(json.skype, "icon-skype");
            }
            else if (json.email) {
                message.tooltips.push(new EmailTooltip(json.email, TextChatRoom.i18N("i18nTooltipSendEmail")));
                message.text = json.email;
                message.htmlText = Helpers.wrapInDiv(json.email, "icon-email");
            }
            else if (json.secretRoom) {
                message.tooltips.push(new UrlTooltip(this.$state.href(this.$state.get(States.textChatRoomCustom.name), { roomId: json.secretRoom }), TextChatRoom.i18N("i18nTooltipVisitSecretRoom")));
                message.text = json.secretRoom;
                message.htmlText = Helpers.wrapInDiv(json.secretRoom, "icon-key");
            }
            else if (json.audioStarted) {
                message.text = json.audioStarted;
                message.htmlText = Helpers.wrapInDiv(json.audioStarted, "audio-message audio-started");
            }
            else if (json.audioMessage) {
                message.text = json.email;
                message.htmlText = Helpers.wrapInDiv(json.audioMessage, "audio-message");
            }
            else if (json.chatRequest) {
                if (this.scope.userId !== json.chatRequest)
                    return;
                message.htmlText = Helpers.wrapInDiv(TextChatRoom.i18N("i18nCallHasBeenSent"), "chat-request-inline-status");
            }
            else if (json.chatRequestAccepted) {
                message.htmlText = Helpers.wrapInDiv(TextChatRoom.i18N("i18nInvitationAccepted"), "chat-request-inline-status accepted");
            }
            else if (json.timeAgo) {
                message.htmlText = Helpers.wrapInDiv(json.timeAgo, "time-ago");
            }
            else if (json.noPrivateChat) {
                this.scope.isDisabled = true;
                if (json.noPrivateChat.length !== 0)
                    this.scope.isDisabledButIsReachable = true;
                this.scope.joinedPublicRooms = [];
                json.noPrivateChat.forEach(function (roomId) {
                    var title = null;
                    if (angular.isDefined(Config.TopicChatRooms[roomId]))
                        title = Config.TopicChatRooms[roomId].text;
                    else if (angular.isDefined(Languages[roomId]))
                        title = Languages[roomId].text;
                    if (title)
                        _this.scope.joinedPublicRooms.push({ title: title, url: _this.$state.href(_this.$state.get(States.textChatRoomPublic.name), { roomId: roomId }) });
                });
                return;
            }
            else
                json = undefined;
        }
        if (!json) {
            var result = TextChatRoom.getTextWithTooltips(text, TextChatRoom.keywords);
            message.tooltips = message.tooltips.concat(result.tooltips);
            message.text = result.text;
            message.htmlText = Helpers.htmlEncode(message.text);
            message.htmlText = Helpers.searchAndWrapInElement(message.htmlText, this.scope.localFirstName, this.scope.nameHighlightClass);
        }
        message.htmlText = this.formatMessage(message.htmlText);
        message.htmlText = this.$sce.trustAsHtml(message.htmlText);
        var lastMessage = this.scope.messages[this.scope.messages.length - 1];
        if (!(message.origin === MessageOrigin.self && lastMessage && lastMessage.origin === MessageOrigin.self))
            this.markLastMessageAsLastSeen();
        this.scope.messages.push(message);
        if (this.scope.messages.length >= 300)
            this.scope.messages = this.scope.messages.slice(50);
        if (firstLoad)
            this.scope.needsMandatoryScrollToBottom = true;
        else
            this.scope.needsScrollToNewMessage = true;
    };
    TextChatRoomAccessor.prototype.resetLastSeenMark = function () {
        for (var i = 0; i < this.scope.messages.length - 1; i++)
            if (this.scope.messages[i].lastSeen) {
                this.scope.messages[i].lastSeen = false;
                return true;
            }
        return false;
    };
    TextChatRoomAccessor.prototype.hasLastSeenMark = function () {
        for (var i = 0; i < this.scope.messages.length - 1; i++)
            if (this.scope.messages[i].lastSeen)
                return true;
        return false;
    };
    TextChatRoomAccessor.prototype.markLastMessageAsLastSeen = function () {
        if (this.scope.messages.length !== 0 && !this.hasLastSeenMark())
            this.scope.messages[this.scope.messages.length - 1].lastSeen = true;
    };
    Object.defineProperty(TextChatRoomAccessor.prototype, "userCount", {
        get: function () { return this.scope.users.length; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextChatRoomAccessor.prototype, "loading", {
        get: function () { return this.scope.loading; },
        set: function (b) { this.scope.loading = b; },
        enumerable: true,
        configurable: true
    });
    TextChatRoomAccessor.prototype.initForFirstVisit = function () {
        var _this = this;
        if (this.scope.roomId === "hellolingo")
            this.$timeout(function () {
                _this.scope.accessor.addMessage(MessageOrigin.news, undefined, "", "", TextChatRoom.i18N("i18nFirstMessage"));
                _this.scope.scrollToBottom();
            }, 5000);
    };
    TextChatRoomAccessor.prototype.reset = function () {
        this.scope.messages = [];
        this.scope.users = [];
    };
    TextChatRoomAccessor.prototype.dispose = function () {
        window.removeEventListener("resize", this.scope.requestScrollOnResize);
        clearInterval(this.scope.processScrollInterval);
    };
    Object.defineProperty(TextChatRoomAccessor.prototype, "roomUsers", {
        get: function () { return this.scope.users; },
        enumerable: true,
        configurable: true
    });
    TextChatRoomAccessor.prototype.setFocusOnInput = function () { this.scope.setFocusOnInput(); };
    TextChatRoomAccessor.prototype.formatMessage = function (htmlText) {
        if (htmlText) {
            htmlText = this.formatBold(htmlText);
            htmlText = this.formatUnderline(htmlText);
            htmlText = this.formatStrikethrough(htmlText);
            htmlText = this.formatEmoticons(htmlText);
        }
        return htmlText;
    };
    TextChatRoomAccessor.prototype.formatText = function (htmlText, formatSymbol, cssClass) {
        var escapedSymbol = formatSymbol === "*" ? "\\*" : formatSymbol;
        var regexp = new RegExp(escapedSymbol + "(?:[^" + formatSymbol + "\\s]{1}|[^" + formatSymbol + "\\s][^" + formatSymbol + "]*[^" + formatSymbol + "\\s])" + escapedSymbol, "g");
        var match;
        do {
            match = regexp.exec(htmlText);
            if (match)
                match.forEach(function (m) {
                    var boldFormat = m.substr(1, m.length - 2);
                    htmlText = htmlText.replace(m, "<span class='" + cssClass + "'>" + boldFormat + "</span>");
                });
        } while (match);
        return htmlText;
    };
    return TextChatRoomAccessor;
}());
var TextChatRoomModel = (function () {
    function TextChatRoomModel(roomId, text, url, state, userId) {
        if (userId === void 0) { userId = null; }
        this.roomId = roomId;
        this.text = text;
        this.url = url;
        this.state = state;
        this.userId = userId;
        this.newMessagesCount = 0;
        this.isUndocked = false;
        this.isInactive = false;
    }
    Object.defineProperty(TextChatRoomModel.prototype, "isPrivate", {
        get: function () { return this.userId != null; },
        enumerable: true,
        configurable: true
    });
    ;
    return TextChatRoomModel;
}());
var AudioCallState = (function () {
    function AudioCallState() {
    }
    AudioCallState.initializing = "init";
    AudioCallState.requested = "requested";
    AudioCallState.connected = "connected";
    AudioCallState.finishing = "finishing";
    return AudioCallState;
}());
var TextChatMessage = (function () {
    function TextChatMessage(origin, userId, firstName, lastName, text) {
        this.origin = origin;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.text = text;
        this.tooltips = [];
    }
    Object.defineProperty(TextChatMessage.prototype, "hasTooltip", {
        get: function () { return this.tooltips.length !== 0; },
        enumerable: true,
        configurable: true
    });
    return TextChatMessage;
}());
var Tooltip = (function () {
    function Tooltip() {
    }
    return Tooltip;
}());
var KeywordTooltip = (function () {
    function KeywordTooltip(label, text) {
        this.label = label;
        this.text = text;
        this.link = "";
        this.type = "abbr";
    }
    return KeywordTooltip;
}());
var LinkedKeywordTooltip = (function () {
    function LinkedKeywordTooltip(label, text, link) {
        this.label = label;
        this.text = text;
        this.link = link;
        this.type = "keyword";
    }
    return LinkedKeywordTooltip;
}());
var UrlTooltip = (function (_super) {
    __extends(UrlTooltip, _super);
    function UrlTooltip(text, label) {
        var _this = _super.call(this) || this;
        _this.text = text;
        _this.label = label;
        _this.type = "url";
        _this.link = text;
        return _this;
    }
    return UrlTooltip;
}(Tooltip));
var EmailTooltip = (function (_super) {
    __extends(EmailTooltip, _super);
    function EmailTooltip(emailAddress, label) {
        var _this = _super.call(this) || this;
        _this.label = label;
        _this.type = "email";
        _this.text = emailAddress;
        _this.link = "mailto:" + emailAddress;
        return _this;
    }
    return EmailTooltip;
}(Tooltip));
var SkypeTooltip = (function (_super) {
    __extends(SkypeTooltip, _super);
    function SkypeTooltip(skypeId, label) {
        var _this = _super.call(this) || this;
        _this.label = label;
        _this.type = "skype";
        _this.text = skypeId;
        _this.link = "skype:" + skypeId + "?add";
        return _this;
    }
    return SkypeTooltip;
}(Tooltip));
var MessageTooltip = (function () {
    function MessageTooltip(label, text, type, link) {
        if (link === void 0) { link = ""; }
        this.label = label;
        this.text = text;
        this.type = type;
        this.link = link;
    }
    return MessageTooltip;
}());
var TextWithTooltips = (function () {
    function TextWithTooltips(text) {
        this.text = text;
        this.tooltips = new Array();
    }
    return TextWithTooltips;
}());
;
var Title = (function () {
    function Title($rootScope, serverResources) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.serverResources = serverResources;
        this.restrict = "E";
        this.link = function () {
            var listener = function (event, toState) { return _this.$rootScope.title = toState.title; };
            _this.$rootScope.$on("$stateChangeSuccess", listener);
        };
    }
    Title.$inject = ["$rootScope", "serverResources"];
    return Title;
}());
var TooltipLink = (function () {
    function TooltipLink() {
        this.restrict = "A";
        this.scope = { tooltip: "=tooltipLink" };
        this.link = function (scope, $element, $attr) {
            var link = scope.tooltip.link;
            if (link) {
                if (link.toLowerCase().indexOf(window.location.origin) === 0)
                    $element.attr("href", link.substring(window.location.origin.length));
                else if (link.toLowerCase().indexOf("http") === 0)
                    $element.attr("target", "_blank").attr("href", link);
                else if (link.charAt(0) === "/")
                    $element.attr("href", link);
                else
                    $element.attr("href", link)
                        .attr("onclick", "javascript:var tmp = window.onbeforeunload; window.onbeforeunload = null; window.location.href='" + link + "';  window.setTimeout(function () {window.onbeforeunload = tmp;}, 1000);");
            }
            else {
                $element.attr("target", "_self").attr("href", "javascript:void(0)");
            }
        };
    }
    return TooltipLink;
}());
;
var TrimPasswordDirective = (function () {
    function TrimPasswordDirective() {
        this.restrict = "A";
        this.require = "?ngModel";
        this.priority = 10;
    }
    TrimPasswordDirective.prototype.compile = function () {
        return function (scope, element, attrs, ngModel) {
            element.bind("input paste", function () {
                var s = ngModel.$viewValue;
                if (s === "") {
                    ngModel.$setViewValue(undefined);
                    ngModel.$render();
                }
            });
        };
    };
    return TrimPasswordDirective;
}());
var ProfileViewCtrl = (function () {
    function ProfileViewCtrl($scope, $http, $timeout, statesService, contactsService, serverResources) {
        var _this = this;
        this.$scope = $scope;
        this.$http = $http;
        this.$timeout = $timeout;
        this.statesService = statesService;
        this.contactsService = contactsService;
        this.serverResources = serverResources;
        this.languages = Languages.langsById;
        this.countries = this.serverResources.getCountries();
        this.hasListOfRooms = function () { return Array.isArray(_this.listOfRooms); };
        $scope.$watch(function () { return _this.user; }, function () {
            if (_this.user)
                _this.getMemberData(_this.user.id);
        });
    }
    ProfileViewCtrl.prototype.goToMailbox = function () {
        if (angular.isFunction(this.$scope.$parent.$close))
            this.$scope.$parent.$close();
        this.statesService.go(States.mailboxUser.name, { id: this.user.id, isNew: "new" });
    };
    ProfileViewCtrl.prototype.goToChat = function () {
        if (angular.isFunction(this.$scope.$parent.$close))
            this.$scope.$parent.$close();
        this.statesService.go(States.textChatRoomPrivate.name, { userId: this.user.id, firstName: this.user.firstName });
    };
    ProfileViewCtrl.prototype.getMemberData = function (memberId) {
        var _this = this;
        this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
            .success(function (member) { for (var attrName in member) {
            _this.user[attrName] = member[attrName];
        } })
            .error(function (errorData) { throw new Error(errorData); });
    };
    ProfileViewCtrl.prototype.onPinClick = function (pinMsg, unpinMsg) {
        if (this.isUserPinned()) {
            this.user.isPinned = false;
            this.contactsService.remove(this.user.id);
            this.notify(unpinMsg);
        }
        else {
            this.user.isPinned = true;
            this.contactsService.add(this.user);
            this.notify(pinMsg);
        }
    };
    ProfileViewCtrl.prototype.isUserPinned = function () {
        return !!this.user && this.contactsService.isUserInContacts(this.user.id);
    };
    ProfileViewCtrl.prototype.notify = function (message) {
        var _this = this;
        this.$timeout.cancel(this.notificationTimeout);
        this.notificationTimeout = this.$timeout(function () { return _this.showNotification = false; }, 3000);
        this.notification = message;
        this.showNotification = true;
    };
    ProfileViewCtrl.$inject = ["$scope", "$http", "$timeout", "statesService", "contactsService", "serverResources"];
    return ProfileViewCtrl;
}());
var ProfileViewDirective = (function () {
    function ProfileViewDirective() {
        this.restrict = "E";
        this.scope = {};
        this.templateUrl = "profile-view.tpl";
        this.controller = ProfileViewCtrl;
        this.controllerAs = "pv";
        this.bindToController = {
            user: "=",
            showButtons: "=",
            hasPinButton: "=",
            hasMailButton: "=",
            hasLightMailButton: "=",
            hasViewChatButton: "=",
            hasRequestChatButton: "=",
            hasAcceptChatRequestButton: "=",
            hasChatRequestedMessage: "=",
            hasRequestingChatLoader: "=",
            chatRequestedMessage: "@",
            listOfRooms: "=",
            onTitleClick: "&",
            onRequestChat: "&",
            ignoreChatRequest: "&?",
            onSwitchUserMute: "=",
            isMuted: "="
        };
        this.replace = true;
    }
    ProfileViewDirective.prototype.link = function () { };
    ;
    return ProfileViewDirective;
}());
var TaskButtonDirective = (function () {
    function TaskButtonDirective(countersService, $timeout, authService, $state, $stickyState, $log, statesService) {
        var _this = this;
        this.countersService = countersService;
        this.$timeout = $timeout;
        this.authService = authService;
        this.$state = $state;
        this.$stickyState = $stickyState;
        this.$log = $log;
        this.statesService = statesService;
        this.restrict = "AE";
        this.replace = true;
        this.scope = {
            buttonId: "=",
            iconUrl: "@",
            hideClose: "=",
            showCounter: "="
        };
        this.templateUrl = "task-button.tpl";
        this.link = function ($scope) {
            $scope.showButton = false;
            $scope.actionClick = function () {
                var stateToGo = $scope.buttonId;
                switch ($scope.buttonId) {
                    case States.mailbox.name:
                        _this.countersService.resetCounter(Services.Counters.MailBox);
                        break;
                    case States.textChat.name:
                        _this.countersService.resetCounter(Services.Counters.TextChat);
                        break;
                    default:
                        break;
                }
                _this.$log.appInfo("TaskBar_ChangeStateRequested", { stateName: stateToGo });
                if (!_this.$state.includes(stateToGo))
                    _this.$state.go(stateToGo);
            };
            $scope.isCurrentState = function () { return _this.$state.includes($scope.buttonId); };
            $scope.closeState = function () {
                _this.$log.appInfo("TaskBar_CloseStateRequested", { stateName: $scope.buttonId });
                _this.statesService.closeState($scope.buttonId);
            };
            $scope.isIconShown = function (stateName) { return _this.isIconShownOnTaskBar(stateName, _this.authService, _this.$state, _this.$stickyState); };
            if ($scope.showCounter) {
                $scope.$watch(function ($scope) {
                    return _this.isCounterValueChanged($scope.buttonId);
                }, function (newVal) {
                    $scope.showCounterBadge = false;
                    _this.$timeout(function () {
                        $scope.counterVal = newVal;
                        $scope.showButton = false;
                        $scope.hideClose = false;
                        $scope.showCounterBadge = !$scope.isCurrentState() && newVal > 0;
                        if ($scope.showCounterBadge) {
                            $scope.showButton = true;
                            $scope.hideClose = true;
                        }
                    }, 200);
                });
            }
        };
    }
    TaskButtonDirective.prototype.isIconShownOnTaskBar = function (state, authService, $state, $stickyState) {
        var inactiveStates = $stickyState.getInactiveStates();
        if (state === States.home.name)
            return authService.isAuthenticated() && inactiveStates.length >= 1;
        var found = false;
        angular.forEach(inactiveStates, function (inactiveState) {
            if (inactiveState.name === state)
                found = true;
        });
        return found || $state.includes(state);
    };
    TaskButtonDirective.prototype.isCounterValueChanged = function (forState) {
        switch (forState) {
            case States.mailbox.name:
                return this.countersService.getCounterValue(Services.Counters.MailBox);
            case States.textChat.name:
                return this.countersService.getCounterValue(Services.Counters.TextChat);
            default:
                return 0;
        }
    };
    TaskButtonDirective.$inject = ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log", "statesService"];
    return TaskButtonDirective;
}());
;
var UiCultureDropDown = (function () {
    function UiCultureDropDown($templateCache, authService, $stickyState, $state, modalService) {
        var _this = this;
        this.$templateCache = $templateCache;
        this.authService = authService;
        this.$stickyState = $stickyState;
        this.$state = $state;
        this.modalService = modalService;
        this.template = this.$templateCache.get("ui-culture-drop-down.tpl");
        this.i10NUnavailableStatusTemplate = "At this time, Hellolingo isn't available in #LANG#. Our members are actively translating Hellolingo in their preferred languages. Please <a href='/contact-us'>contact us</a> if you'd like to contribute to the #LANG# version of Hellolingo.";
        this.controller = ["$scope", "$cookies", function ($scope, $cookies) {
                $scope.uiCultures = {
                    "en": { text: Languages.english.text, i10NStatus: "Hellolingo in English is made possible thanks to our members and friends:<br><br><strong>Olga 'Awesome' S.<br>Laura K.<br>Mark A.</strong>" },
                    "fr": { text: Languages.french.text, i10NStatus: "Hellolingo est disponible en Français grâce à nos membres et amis:<br><br><strong>Claire Verday<br><a href='http://www.linkedin.com/in/bernardvanderydt' target='_blank'>Bernard Vanderydt</a></strong>" },
                    "de": { text: Languages.german.text, i10NStatus: "Hellolingo auf Deutsch wird mithilfe unserer Mitglieder und Freunde ermöglicht:<br><br><strong><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong>" },
                    "es": { text: Languages.spanish.text, i10NStatus: "Hellolingo en español es posible gracias a nuestros miembros y amigos:<br><br><strong>Quals & Co.<br><a href='/mailbox/user/31148/new' target='_blank'>Nina</a></strong>" },
                    "ko": { text: Languages.korean.text, i10NStatus: "Hellolingo 한국어 버전 제작은 저희의 회원들과 친구들 덕분에 가능했습니다:<br><br><strong>Bona Sheen</strong>" },
                    "nl": { text: Languages.dutch.text, i10NStatus: "Hellolingo in het Nederlands wordt mede mogelijk gemaakt door onze leden en vrienden:<br><br><strong>Poiet O.<br><a href='https://www.linkedin.com/in/flavia-rocco-a4bb07b8' target='_blank'>Flavia 'Sayuri' Rocco</a></strong>" },
                    "it": { text: Languages.italian.text, i10NStatus: "Hellolingo in italiano è reso possibile grazie ai nostri seguenti amici e membri:<br><br><strong>Alberto Fanciullacci</strong>" },
                    "pt-BR": { text: Languages.portuguese.text, i10NStatus: "Hellolingo em Português é possível graças a nossos membros e amigos:<br><br><strong>Mark A.</strong>" },
                    "ru": { text: Languages.russian.text, i10NStatus: "Русская версия Hellolingo появилась благодаря нашим участникам и друзьям:<br><br><strong>Olga 'Awesome' S.<br><a href='/mailbox/user/29433/new' target='_blank'>Liliya Vengura</a><br><a href='/mailbox/user/47633/new' target='_blank'>Dmitry Khomichuk</a></strong>" },
                    "zh-CN": { text: Languages.chinese.text, i10NStatus: "谢谢我们的用户和朋友们的帮助，使Hellolingo能够被翻译成中文版本。<br><br><strong>税诚 Alexander</strong><br><br>到现在为止，大约百分之95的Hellolingo已经被翻译成中文。我们将会把目前还未翻译部分的文本展示出来，如果您想帮助我们完成Hellolingo的中文部分，<a href='/contact-us'>请不要犹豫，赶快联系我们吧！</a>" },
                    "he": { text: Languages.hebrew.text, i10NStatus: "Hellolingo תורגם לעברית תודות לחברינו בישראל. <br><br><strong><a href='/mailbox/user/62058/new' target='_blank'>Ben x.</a></strong><br><br>כרגע רק כ-95% מ-Hellolingo מתורגם לעברית. טקסט שטרם תורגם מוצג באנגלית. אם אתם מעוניינים לעזור להשלים את הגרסה העברית של הלו-לינגו, אל תהססו וצרו קשר." },
                    "el": { text: Languages.greek.text, i10NStatus: "Το Hellolingo στα Ελληνικά είναι εφικτό χάρη στα μέλη και τους φίλους μας:<br><br><strong><a href='/mailbox/user/96680/new' target='_blank'>Andreas Panagiotidis</a></strong><br><br>Αυτή τη στιγμή, περίπου το 70% του Hellolingo είναι στα ελληνικά. Θα προβάλλουμε κείμενο που δεν έχει μεταφραστεί ακόμα στα αγγλικά. Μη διστάσετε να επικοινωνήσετε μαζί μας αν θέλετε να βοηθήσετε να ολοκληρωθεί η Ελληνική έκδοση του Hellolingo" },
                    "ja": { text: Languages.japanese.text, i10NStatus: "日本語でのHelloLingoはメンバーとお友達の寄付のおかげです。<br><br><strong>Keith McKay</strong><br><br>この時は５６％のHelloLingoが日本語で翻訳されています。まだ翻訳していない部分が英語で示されます。HelloLingoの日本語に変化に手を借りたかったら、気軽にどうぞ連絡してください。" },
                    "tr": { text: Languages.turkish.text, i10NStatus: "Hellolingo'nun Türkçe dilinde olmasını sağlayan üye ve arkadaşlarımıza teşekkürler.<br><br>Şimdlik, Hellolingo'nun yaklaşık %35'si Türkçeleştirilmiştir.Türkçeleştirilmemiş olanları İngilizce olarak göstereceğiz.Hellolingo'nun Türkçe sürümünü tamamlamak için yardım etmek isterseniz biz yazmaktan çekinmeyin" },
                    "cs": { text: Languages.czech.text, i10NStatus: "Hellolingo v Čeština je možné díky našim členům a přátelům. <br><br><strong><a href='/mailbox/user/73640/new' target='_blank'>Josef Bukač</a></strong><br><br>Nyní je asi 35% Hellolingo v Čeština. Budeme zobrazovat text, který dosud nebyl přeložený do angličtiny. Neváhejte nás kontaktovat, pokud chcete pomoct s kompletní Čeština verzí Hellolingo." },
                    "vi": { text: Languages.vietnamese.text, i10NStatus: "Một cộng đồng được xây nên bởi chính những thành viên. Hiện tại, khoảng 35% của Hellolingo là Tiếng Việt. <br><br><strong><a href='/mailbox/user/40229/new' target='_blank'>Khue Nguyen</a></strong><br><br>Chúng tôi sẽ hiển thị phần chưa được dịch bằng Tiếng Anh. Đừng ngần ngại liên hệ với chúng tôi nếu bạn muốn giúp hoàn thành phiên bản Tiếng Việt của Hellolingo." },
                    "et": { text: Languages.esperanto.text, i10NStatus: "Hellolingo en Esperanto eblas danke al niaj membroj kaj amikoj:<br><br><strong>'sennoma nordulo'</strong><br><br>Momente, ĉirkaŭ <strong>19%</strong> de Hellolingo disponeblas en Esperanto. Teksto ne tradukita montriĝos angle.<br><br>Ne hezitu <a href='/contact-us'>kontakti</a> nin se vi volas kontribui al kompletigo de la tasko." },
                    "pl": { text: Languages.polish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Polish") },
                    "sv": { text: Languages.swedish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Swedish") },
                    "fi": { text: Languages.finnish.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Finnish") },
                    "nb": { text: Languages.norwegian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Norwegian") },
                    "ro": { text: Languages.romanian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Romanian") },
                    "ar": { text: Languages.arabic.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Arabic") },
                    "fa": { text: Languages.persian.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Persian") },
                    "hi": { text: Languages.hindi.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Hindi") },
                    "th": { text: Languages.thai.text, i10NStatus: _this.i10NUnavailableStatusTemplate.replace(new RegExp("#LANG#", "g"), "Thai") }
                };
                $scope.uiCultureCode = Runtime.uiCultureCode;
                $scope.changeUiCultureTo = function (code, okButtonText) {
                    if (code !== Runtime.uiCultureCode) {
                        var targetCulture = $scope.uiCultures[code];
                        _this.modalService.open("<div class='i10nStatus' dir='" + (code === "he" ? "rtl" : "ltr") + "'>" + targetCulture.i10NStatus + "<div>", [{ label: okButtonText, result: true, cssClass: "btn btn-success" }], false).then(function (confirmed) {
                            if (confirmed) {
                                $cookies.put(Config.CookieNames.oldUiCulture, Runtime.uiCultureCode);
                                $cookies.put(Config.CookieNames.uiCulture, code);
                                Runtime.uiCultureCode = code;
                                location.reload();
                            }
                        });
                    }
                };
                $scope.isMember = function () { return _this.authService.isAuthenticated(); };
                $scope.isEnabled = function () {
                    return !_this.authService.isAuthenticated()
                        || ([States.home.name, States.livemocha.name, States.sharedTalk.name].some(function (s) { return s === _this.$state.current.name; })
                            && _this.$stickyState.getInactiveStates().length === 0);
                };
            }];
    }
    UiCultureDropDown.$inject = ["$templateCache", "authService", "$stickyState", "$state", "modalService"];
    return UiCultureDropDown;
}());
var Enums;
(function (Enums) {
    var Gender = (function () {
        function Gender() {
        }
        Gender.female = "F";
        Gender.male = "M";
        return Gender;
    }());
    Enums.Gender = Gender;
})(Enums || (Enums = {}));
var InputTypes;
(function (InputTypes) {
    InputTypes.textInputType = "textInputType";
    InputTypes.emailInputType = "emailInputType";
    InputTypes.skypeInputType = "skypeInputType";
    InputTypes.secretRoomInputType = "secretRoomInputType";
})(InputTypes || (InputTypes = {}));
var Languages;
(function (Languages) {
    Languages.english = { id: 1, tier: 1, culture: "en", name: "english", text: "English" };
    Languages.spanish = { id: 2, tier: 1, culture: "es", name: "spanish", text: "Español" };
    Languages.french = { id: 3, tier: 1, culture: "fr", name: "french", text: "Français" };
    Languages.japanese = { id: 4, tier: 1, culture: "ja", name: "japanese", text: "日本語" };
    Languages.german = { id: 5, tier: 1, culture: "de", name: "german", text: "Deutsch" };
    Languages.italian = { id: 6, tier: 1, culture: "it", name: "italian", text: "Italiano" };
    Languages.chinese = { id: 7, tier: 1, culture: "zh-CN", name: "chinese", text: "中文" };
    Languages.russian = { id: 8, tier: 1, culture: "ru", name: "russian", text: "Русский" };
    Languages.portuguese = { id: 9, tier: 1, culture: "pt-BR", name: "portuguese", text: "Português" };
    Languages.korean = { id: 11, tier: 1, culture: "ko", name: "korean", text: "한국어" };
    Languages.arabic = { id: 10, tier: 2, culture: "##", name: "arabic", text: "العربية" };
    Languages.bengali = { id: 44, tier: 2, culture: "##", name: "bengali", text: "বাংলা" };
    Languages.bosnian = { id: 46, tier: 2, culture: "##", name: "bosnian", text: "Bosanski" };
    Languages.bulgarian = { id: 45, tier: 2, culture: "##", name: "bulgarian", text: "Български" };
    Languages.cantonese = { id: 13, tier: 2, culture: "##", name: "cantonese", text: "广东话" };
    Languages.catalan = { id: 50, tier: 2, culture: "##", name: "catalan", text: "Català" };
    Languages.croatian = { id: 41, tier: 2, culture: "##", name: "croatian", text: "Hrvatski" };
    Languages.czech = { id: 38, tier: 2, culture: "##", name: "czech", text: "Čeština" };
    Languages.danish = { id: 35, tier: 2, culture: "##", name: "danish", text: "Dansk" };
    Languages.dutch = { id: 15, tier: 2, culture: "##", name: "dutch", text: "Nederlands" };
    Languages.esperanto = { id: 63, tier: 2, culture: "##", name: "esperanto", text: "Esperanto" };
    Languages.finnish = { id: 30, tier: 2, culture: "##", name: "finnish", text: "Suomi" };
    Languages.greek = { id: 19, tier: 2, culture: "##", name: "greek", text: "Ελληνικά" };
    Languages.hebrew = { id: 29, tier: 2, culture: "##", name: "hebrew", text: "עברית" };
    Languages.hindi = { id: 12, tier: 2, culture: "##", name: "hindi", text: "हिन्दी" };
    Languages.hungarian = { id: 36, tier: 2, culture: "##", name: "hungarian", text: "Magyar" };
    Languages.icelandic = { id: 47, tier: 2, culture: "##", name: "icelandic", text: "Íslenska" };
    Languages.indonesian = { id: 34, tier: 2, culture: "##", name: "indonesian", text: "Bahasa Indonesia" };
    Languages.irish = { id: 33, tier: 2, culture: "##", name: "irish", text: "Gaeilge" };
    Languages.lithuanian = { id: 57, tier: 2, culture: "##", name: "lithuanian", text: "Lietuvių" };
    Languages.norwegian = { id: 26, tier: 2, culture: "##", name: "norwegian", text: "Norsk" };
    Languages.persian = { id: 21, tier: 2, culture: "##", name: "persian", text: "فارسی" };
    Languages.polish = { id: 23, tier: 2, culture: "##", name: "polish", text: "Polski" };
    Languages.romanian = { id: 25, tier: 2, culture: "##", name: "romanian", text: "Română" };
    Languages.serbian = { id: 31, tier: 2, culture: "##", name: "serbian", text: "Српски/srpski" };
    Languages.slovak = { id: 56, tier: 2, culture: "##", name: "slovak", text: "Slovenčina" };
    Languages.slovenian = { id: 62, tier: 2, culture: "##", name: "slovenian", text: "Slovenščina" };
    Languages.swahili = { id: 43, tier: 2, culture: "##", name: "swahili", text: "Kiswahili" };
    Languages.swedish = { id: 18, tier: 2, culture: "##", name: "swedish", text: "Svenska" };
    Languages.tagalog = { id: 14, tier: 2, culture: "##", name: "tagalog", text: "Tagalog" };
    Languages.thai = { id: 22, tier: 2, culture: "##", name: "thai", text: "ไทย" };
    Languages.turkish = { id: 17, tier: 2, culture: "##", name: "turkish", text: "Türkçe" };
    Languages.ukrainian = { id: 55, tier: 2, culture: "##", name: "ukrainian", text: "Українська" };
    Languages.urdu = { id: 16, tier: 2, culture: "##", name: "urdu", text: "اُردُو" };
    Languages.vietnamese = { id: 27, tier: 2, culture: "##", name: "vietnamese", text: "Tiếng Việt" };
    Languages.estonian = { id: 69, tier: 2, culture: "##", name: "estonian", text: "Eesti" };
    Languages.albanian = { id: 53, tier: 2, culture: "##", name: "albanian", text: "Shqip" };
    Languages.latvian = { id: 65, tier: 2, culture: "##", name: "latvian", text: "Latviešu" };
    Languages.malay = { id: 28, tier: 2, culture: "##", name: "malay", text: "Bahasa Melayu" };
    Languages.mongolian = { id: 81, tier: 2, culture: "##", name: "mongolian", text: "Монгол" };
    Languages.macedonian = { id: 84, tier: 2, culture: "##", name: "macedonian", text: "Македонски" };
    Languages.kazakh = { id: 89, tier: 2, culture: "##", name: "kazakh", text: "Қазақ" };
    Languages.belarusian = { id: 94, tier: 2, culture: "##", name: "belarusian", text: "Беларуская" };
    Languages.georgian = { id: 82, tier: 2, culture: "##", name: "georgian", text: "ქართული" };
    Languages.armenian = { id: 51, tier: 2, culture: "##", name: "armenian", text: "Հայերեն" };
    var langsByIdBuilder = [];
    for (var i in Languages)
        langsByIdBuilder[Languages[i].id] = Languages[i];
    Languages.langsById = langsByIdBuilder;
})(Languages || (Languages = {}));
var Years;
(function (Years) {
    Years.getYears = function (from, to) {
        if (from === void 0) { from = 1920; }
        if (to === void 0) { to = 2000; }
        if (from >= to) {
            throw Error("Year from must be less then year to.");
        }
        var years = new Array();
        for (var i = to; i > from; i--) {
            years.push(i);
        }
        return years;
    };
})(Years || (Years = {}));
var Filters;
(function (Filters) {
    var SortMembersBy;
    (function (SortMembersBy) {
        SortMembersBy[SortMembersBy["Id"] = 1] = "Id";
        SortMembersBy[SortMembersBy["Name"] = 2] = "Name";
        SortMembersBy[SortMembersBy["Country"] = 3] = "Country";
        SortMembersBy[SortMembersBy["Knows"] = 4] = "Knows";
        SortMembersBy[SortMembersBy["Learns"] = 5] = "Learns";
    })(SortMembersBy = Filters.SortMembersBy || (Filters.SortMembersBy = {}));
    function findMembersFilter($filter, serverResources) {
        var countries = serverResources.getCountries();
        return function (members, propertyToSort) {
            var orderByFilter = $filter("orderBy");
            switch (propertyToSort) {
                case SortMembersBy.Name:
                    return orderByFilter(members, function (m) { return m.firstName; });
                case SortMembersBy.Country:
                    return orderByFilter(members, function (m) { return countries[m.country].text; });
                case SortMembersBy.Learns:
                    return orderByFilter(members, function (m) {
                        if (!Languages.langsById[m.learns])
                            return undefined;
                        return Languages.langsById[m.learns].text;
                    });
                case SortMembersBy.Knows:
                    return orderByFilter(members, function (m) {
                        if (!Languages.langsById[m.knows])
                            return undefined;
                        return Languages.langsById[m.knows].text;
                    });
                default:
                    return orderByFilter(members, function (m) { return -m.id; });
            }
        };
    }
    Filters.findMembersFilter = findMembersFilter;
})(Filters || (Filters = {}));
var Filters;
(function (Filters) {
    var app = angular.module("app.filters", []);
    app.filter("findMembers", ["$filter", "serverResources", Filters.findMembersFilter]);
})(Filters || (Filters = {}));
var Find;
(function (Find) {
    var FindMembersCtrl = (function () {
        function FindMembersCtrl($scope, $timeout, userService, statesService, membersService, $log, $uibModal, serverResources, findMembersFilter) {
            var _this = this;
            this.$timeout = $timeout;
            this.userService = userService;
            this.statesService = statesService;
            this.membersService = membersService;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.serverResources = serverResources;
            this.findMembersFilter = findMembersFilter;
            this.languages = Languages.langsById;
            this.nameState = States.findByName;
            this.languagesState = States.findByLanguages;
            this.sharedTalkState = States.findBySharedTalk;
            this.livemochaState = States.findByLivemocha;
            this.languageSelect = { learnId: 1 };
            this.nameSelect = { isSharedTalkMember: false, isLivemochaMember: false, isSharedLingoMember: false };
            this.maybeHasMoreMembers = true;
            this.sortParam = Filters.SortMembersBy.Id;
            this.loadingMoreMemebers = false;
            this.contactMember = function (id) { return _this.statesService.go(States.mailboxUser.name, { id: id, isNew: "new" }); };
            this.countries = serverResources.getCountries();
            this.user = this.userService.getUser();
            if (this.user) {
                $scope.isSharedTalkMember = this.user.isSharedTalkMember;
                $scope.isLivemochaMember = this.user.isLivemochaMember;
                $scope.isSharedLingoMember = this.user.isSharedLingoMember;
            }
            $scope.$on("$stateChangeSuccess", function (event, toState, toStateParams, fromState, fromStateParams) {
                if (!_this.statesService.includes(States.find.name))
                    return;
                _this.$timeout(function () { $("#FindViewContent").focus(); }, 0);
                var areParamsIdentical = (toStateParams.known === "" && toStateParams.learn === "") || (_this.lastStateParams && toStateParams.known === _this.lastStateParams.known && toStateParams.learn === _this.lastStateParams.learn);
                if (toState.name === _this.lastStateName && areParamsIdentical)
                    return;
                _this.$timeout(function () { $("#FindViewContent").scrollTop(0); }, 0);
                if (toState.name === States.findByLanguages.name) {
                    if (!_this.lastStateName) {
                        var stateLangs = _this.getLanguagesFromState();
                        if (!stateLangs.learnId && !stateLangs.knownId && _this.user) {
                            _this.languageSelect.learnId = _this.user.knows;
                            _this.goToLanguagesState();
                            return;
                        }
                        _this.loadUsersByLanguages();
                    }
                    else if (_this.lastStateName === States.findByLanguages.name)
                        _this.loadUsersByLanguages();
                    else
                        _this.goToLanguagesState();
                }
                if (toState.name === States.findByName.name && !_this.user)
                    _this.statesService.go(States.find.name);
                _this.lastStateName = toState.name;
                _this.lastStateParams = toStateParams;
                _this.nameSelect.isSharedTalkMember = false;
                _this.nameSelect.isLivemochaMember = false;
                _this.nameSelect.isSharedLingoMember = false;
                switch (statesService.current.name) {
                    case States.findByName.name:
                        _this.loadUsersByName();
                        break;
                    case States.findBySharedTalk.name:
                        _this.nameSelect.isSharedTalkMember = true;
                        _this.loadUsersByName();
                        break;
                    case States.findByLivemocha.name:
                        _this.nameSelect.isLivemochaMember = true;
                        _this.loadUsersByName();
                        break;
                    case States.findBySharedTalk.name:
                        _this.nameSelect.isSharedLingoMember = true;
                        _this.loadUsersByName();
                        break;
                }
            });
        }
        FindMembersCtrl.prototype.loadUsersByLanguages = function () {
            var _this = this;
            var stateLangs = this.getLanguagesFromState();
            this.languageSelect.learnId = stateLangs.learnId;
            this.languageSelect.knownId = stateLangs.learnId !== stateLangs.knownId ? stateLangs.knownId : undefined;
            this.membersService.getMembers({ learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId })
                .success(function (members) { _this.foundMembers = members; })
                .error(function (data) { _this.$log.appWarn("LoadUsersByLanguagesFailed", data); });
            this.maybeHasMoreMembers = true;
        };
        ;
        FindMembersCtrl.prototype.secondTierLangFilter = function (value) { return value.tier > 1; };
        ;
        FindMembersCtrl.prototype.setLearns = function (langId) {
            if (this.languageSelect.knownId === langId)
                this.languageSelect.knownId = undefined;
            this.languageSelect.learnId = this.languageSelect.learnId === langId ? undefined : langId;
            this.goToLanguagesState();
        };
        ;
        FindMembersCtrl.prototype.setKnows = function (langId) {
            if (this.languageSelect.learnId === langId)
                this.languageSelect.learnId = undefined;
            this.languageSelect.knownId = this.languageSelect.knownId === langId ? undefined : langId;
            this.goToLanguagesState();
        };
        ;
        FindMembersCtrl.prototype.updateSortParam = function (param) {
            this.sortParam = param;
        };
        FindMembersCtrl.prototype.showFoundMembers = function () {
            return this.findMembersFilter(this.foundMembers, this.sortParam);
        };
        FindMembersCtrl.prototype.goToLanguagesState = function () {
            this.statesService.go(States.findByLanguages.name, {
                known: (this.languageSelect.knownId && Languages.langsById[this.languageSelect.knownId].name) || "any",
                learn: this.languageSelect.learnId && Languages.langsById[this.languageSelect.learnId].name
            });
        };
        FindMembersCtrl.prototype.getLanguagesFromState = function () {
            var searchParams = this.statesService.getStateParams();
            var learnId = searchParams["learn"] && searchParams["learn"] !== "any" && Languages[searchParams["learn"]] ?
                Languages[searchParams["learn"]].id : undefined;
            var knownId = searchParams["known"] && searchParams["known"] !== "any" && Languages[searchParams["known"]] ?
                Languages[searchParams["known"]].id : undefined;
            return { learnId: learnId, knownId: knownId };
        };
        FindMembersCtrl.prototype.setMembership = function (target) {
            if (target === "SharedTalk") {
                this.nameSelect.isLivemochaMember = this.nameSelect.isSharedLingoMember = false;
            }
            else if (target === "Livemocha") {
                this.nameSelect.isSharedTalkMember = this.nameSelect.isSharedLingoMember = false;
            }
            else if (target === "SharedLingo") {
                this.nameSelect.isSharedTalkMember = this.nameSelect.isLivemochaMember = false;
            }
            this.loadUsersByName();
        };
        FindMembersCtrl.prototype.loadUsersByName = function () {
            var _this = this;
            this.membersService.getMembers(this.nameSelect)
                .success(function (members) { _this.foundMembers = members; })
                .error(function (data) { _this.$log.appWarn("LoadUsersByNameFailed", data); });
            this.maybeHasMoreMembers = true;
        };
        ;
        FindMembersCtrl.prototype.loadMoreUsers = function () {
            var _this = this;
            $("#FindViewContent").focus();
            var isFindByLanguagesState = this.statesService.current.name === States.findByLanguages.name;
            var currentSearchParams = isFindByLanguagesState ? { learnId: this.languageSelect.learnId, knownId: this.languageSelect.knownId }
                : this.nameSelect;
            var belowId = this.getLowestMemberId();
            var searchParams = angular.extend({ belowId: belowId }, currentSearchParams);
            this.loadingMoreMemebers = true;
            this.membersService.getMembers(searchParams)
                .success(function (members) {
                if (members && members.length > 0) {
                    Array.prototype.push.apply(_this.foundMembers, members);
                    if (members.length < 100)
                        _this.maybeHasMoreMembers = false;
                }
                else {
                    _this.maybeHasMoreMembers = false;
                }
                _this.loadingMoreMemebers = false;
            })
                .error(function (data) { _this.$log.appWarn("LoadMoreUsersFailed", data); _this.loadingMoreMemebers = false; });
        };
        FindMembersCtrl.prototype.chooseMember = function (user) {
            var _this = this;
            if (this.user.id === user.id)
                return;
            this.$uibModal.open({
                templateUrl: "modal-profile-view.tpl",
                controllerAs: "modalCtrl",
                controller: function () { return ({ user: user, showButtons: function () { return Boolean(_this.user); }, hasPinButton: function () { return _this.statesService.current.name !== States.findByLanguages.name; } }); }
            });
        };
        FindMembersCtrl.prototype.getLowestMemberId = function () {
            var memberWithLowestId = this.foundMembers.reduce(function (p, v) { return p.id < v.id ? p : v; });
            return memberWithLowestId.id;
        };
        FindMembersCtrl.$inject = ["$scope", "$timeout", "userService", "statesService", "membersService", "$log", "$uibModal", "serverResources", "findMembersFilter"];
        return FindMembersCtrl;
    }());
    Find.FindMembersCtrl = FindMembersCtrl;
})(Find || (Find = {}));
var MailBox;
(function (MailBox) {
    var MailStatus;
    (function (MailStatus) {
        MailStatus[MailStatus["Draft"] = 1] = "Draft";
        MailStatus[MailStatus["Sent"] = 2] = "Sent";
        MailStatus[MailStatus["Unread"] = 10] = "Unread";
        MailStatus[MailStatus["Read"] = 11] = "Read";
        MailStatus[MailStatus["Archived"] = 20] = "Archived";
    })(MailStatus = MailBox.MailStatus || (MailBox.MailStatus = {}));
    ;
    var MailBoxCtrl = (function () {
        function MailBoxCtrl($scope, $http, $filter, $q, $timeout, statesService, userService, mailboxServerService, modalService, serverResources, spinnerService, $attrs) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.$filter = $filter;
            this.$q = $q;
            this.$timeout = $timeout;
            this.statesService = statesService;
            this.userService = userService;
            this.mailboxServerService = mailboxServerService;
            this.modalService = modalService;
            this.serverResources = serverResources;
            this.spinnerService = spinnerService;
            this.$attrs = $attrs;
            this.defaultHistoryLoadStep = 3;
            this.defaultMessagesOnPage = 3;
            this.logger = new Services.EnhancedLog();
            this.mailCount = 0;
            this.isInboxLoading = false;
            this.messages = {};
            this.newMessage = { text: undefined, replyToMailId: undefined };
            this.isNewMessageOpen = false;
            this.showInsertPopup = false;
            this.sendingMessage = false;
            this.isInboxVisible = function () { return _this.statesService.is(States.mailboxInbox.name); };
            this.isArchivesVisible = function () { return _this.statesService.is(States.mailboxArchives.name); };
            this.isEmailVisible = function () { return _this.statesService.is(States.mailboxUser.name); };
            this.isNoMessagesInThread = function () {
                return !_this.currentMember || !_this.messages[_this.currentMember.id] || _this.messages[_this.currentMember.id].length === 0;
            };
            this.confirmInModal = function () { return _this.modalService.open("<h4 class=\"text-center\">" + _this.i18N("i18nYouCannotWriteMoreThanOneEmailMsg") + "<h4>", [{ label: "" + _this.i18N("i18nYes"), cssClass: "btn btn-warning", result: true },
                { label: "" + _this.i18N("i18nNo"), cssClass: "btn btn-success", result: false }]); };
            this.messageSentModal = function () { return _this.modalService.open("<h4 class=\"text-center\">" + _this.i18N("i18nMessageHasBeenSent") + "<h4>", [{ label: "" + _this.i18N("i18nOk"), cssClass: "btn btn-success", result: true }]); };
            this.notInsertPrevEmail = function () { return _this.showInsertPopup = false; };
            this.i18N = function (resource) { return Helpers.decodeAttr(_this.$attrs[resource.toLowerCase()]); };
            $scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, function (event, toState, toStateParam, fromState, fromStateParam) {
                _this.previousState = fromState;
                _this.previousStateParams = fromStateParam;
                switch (toState.name) {
                    case States.mailboxUser.name:
                        _this.initMemberMailBoxState(toStateParam);
                        break;
                    case States.mailboxInbox.name:
                    case States.mailboxArchives.name:
                        _this.initMailBoxState(toStateParam);
                        break;
                }
            });
            this.validator = new MailBox.MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18N("i18nMessageTextRequired"));
        }
        MailBoxCtrl.prototype.startNewMessage = function () {
            var currentMemberId = this.currentMember.id;
            var stateParam = { id: currentMemberId, isNew: "new" };
            this.statesService.go(States.mailboxUser.name, stateParam);
        };
        MailBoxCtrl.prototype.sendMessageToServer = function () {
            var _this = this;
            if (!this.validator.isEnabled) {
                this.validator = new MailBox.MessageValidator(this.newMessageForm, this.isNoMessagesInThread(), this.i18N("i18nMessageTextRequired"));
                this.validator.isEnabled = true;
            }
            if (this.validator.isValid) {
                var postMessageParams = this.getPostNewMessageParams();
                if (!postMessageParams.replyTo)
                    this.lastSentMessage = this.newMessage.text;
                this.sendingMessage = true;
                this.$http.post(Config.EndPoints.postMail, postMessageParams)
                    .then(function () {
                    _this.newMessage.text = undefined;
                    _this.newMessageForm.messageText.$setViewValue(undefined);
                    _this.newMessageForm.messageText.$render();
                    _this.newMessageForm.messageText.$setPristine();
                    _this.newMessageForm.$setPristine();
                    _this.isNewMessageOpen = false;
                    _this.sendingMessage = false;
                    _this.validator.isEnabled = false;
                    _this.messageSentModal().then(function () {
                        if (_this.previousState.name !== States.mailboxUser.name) {
                            _this.statesService.resetState(States.mailbox.name);
                            _this.statesService.go(_this.previousState.name, _this.previousStateParams);
                        }
                        else
                            _this.statesService.go(States.mailboxInbox.name, { notReload: false });
                    });
                }, function (errorData) { return _this.logger.appWarn("FailedToSendMail"); });
            }
            else
                this.logger.appInfo("AttemptToSendTooShortMail");
        };
        MailBoxCtrl.prototype.initMemberMailBoxState = function (toStateParam) {
            var _this = this;
            this.confirmToReloadUserMailState(toStateParam).then(function (confirmed) {
                if (confirmed)
                    _this.loadUserMailBoxState(toStateParam);
                else
                    _this.statesService.go(States.mailboxUser.name, { id: _this.currentMember.id, isNew: "new" });
            }, function (errorData) { return _this.logger.appError("FailedUserMailboxChangeStateConfirmation", errorData); });
        };
        MailBoxCtrl.prototype.loadUserMailBoxState = function (toStateParam) {
            var _this = this;
            if (!this.messages || Object.keys(this.messages).length === 0) {
                this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" })
                    .then(function (messages) {
                    _this.updateMailBox(messages.data);
                    _this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
                }, function (errorData) { return _this.logger.appWarn("FailedToLoadListOfMails"); });
            }
            else
                this.initMemberMailBoxStateAfterMessagesReady(toStateParam);
        };
        MailBoxCtrl.prototype.initMailBoxState = function (toStateParam) {
            var _this = this;
            if (!toStateParam || !toStateParam.notReload) {
                this.spinnerService.showSpinner.show = true;
                this.initInboxPromise = this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" })
                    .then(function (messages) {
                    _this.updateMailBox(messages.data);
                    _this.initInboxPromise = undefined;
                    _this.spinnerService.showSpinner.show = false;
                    _this.isInboxLoading = false;
                }, function (errorData) {
                    _this.spinnerService.showSpinner.show = false;
                    _this.isInboxLoading = false;
                    _this.logger.appWarn("FailedToLoadListOfMails");
                });
            }
            this.validator.isEnabled = false;
        };
        MailBoxCtrl.prototype.openMemberMessages = function (memberId) {
            var stateParams = { id: memberId, isNew: "" };
            this.statesService.go(States.mailboxUser.name, stateParams);
        };
        MailBoxCtrl.prototype.getCurrentMember = function (memberId) {
            var _this = this;
            var p = this.$q.defer();
            this.$http.post(Config.EndPoints.getMemberProfile, { "id": memberId })
                .success(function (member) {
                if (!_this.messages[member.id])
                    _this.messages[member.id] = new Array();
                _this.currentMember = member;
                _this.newMessage.text = undefined;
                _this.newMessageForm.messageText.$setViewValue(undefined);
                _this.newMessageForm.messageText.$render();
                _this.newMessageForm.messageText.$setPristine();
                p.resolve();
            }).error(function (errorData) { return p.reject(errorData); });
            return p.promise;
        };
        MailBoxCtrl.prototype.getMemberMessage = function (messageId, memberId) {
            var _this = this;
            var needToLoadContent = false, messageIndex = -1;
            for (var i = 0; i < this.messages[memberId].length; i++) {
                if (this.messages[memberId][i].id === messageId && !this.messages[memberId][i].content) {
                    messageIndex = i;
                    needToLoadContent = true;
                    break;
                }
            }
            if (needToLoadContent) {
                this.$http.post(Config.EndPoints.getMailContent, { "id": messageId })
                    .success(function (messageContent) {
                    if (messageContent)
                        _this.messages[memberId][messageIndex].content = messageContent.message;
                }).error(function (errorData) { return _this.logger.appWarn("FailedToLoadContentOfMail"); });
            }
        };
        MailBoxCtrl.prototype.createUserMailsDictionary = function (messages) {
            var mailsDict = {};
            if (!messages || messages.length === 0)
                return mailsDict;
            var currentUser = this.userService.getUser();
            for (var i = 0; i < messages.length; i++) {
                var msg = messages[i];
                var name_1 = msg.partnerDisplayName.split(" ");
                if (name_1.length !== 2) {
                    msg.firstName = msg.partnerDisplayName;
                }
                else {
                    msg.firstName = name_1[0];
                    msg.lastName = name_1[1];
                }
                msg.date = new Date(msg.when);
                var partnerId = currentUser.id === msg.fromId ? msg.toId : msg.fromId;
                if (mailsDict[partnerId]) {
                    mailsDict[partnerId].push(msg);
                }
                else {
                    mailsDict[partnerId] = [msg];
                }
            }
            return mailsDict;
        };
        MailBoxCtrl.prototype.createMailThreadList = function (messages) {
            var list = new Array();
            if (!messages)
                return list;
            angular.forEach(messages, function (messages, userId) {
                list.push({
                    userId: Number(userId),
                    firstName: messages[0].firstName,
                    lastName: messages[0].lastName,
                    subject: messages[0].subject,
                    date: messages[0].date,
                    status: messages[0].status,
                    replyTo: messages[0].replyToMail
                });
            });
            list = this.$filter("orderBy")(list, "date", true);
            return list;
        };
        MailBoxCtrl.prototype.loadNewMessages = function () {
            var userMessages = this.messages[this.currentMember.id];
            if (!userMessages || userMessages.length === 0)
                return;
            var loadStep = this.defaultHistoryLoadStep;
            for (var i = 0; i < userMessages.length; i++) {
                var message = userMessages[i];
                if (message.content)
                    continue;
                if (loadStep === 0)
                    break;
                this.getMemberMessage(message.id, this.currentMember.id);
                loadStep--;
            }
        };
        MailBoxCtrl.prototype.goToMailBox = function () {
            var mailboxStateParams = { notReload: false };
            this.statesService.go(States.mailboxInbox.name, mailboxStateParams);
        };
        MailBoxCtrl.prototype.updateMailBox = function (messages) {
            if (messages)
                this.messages = this.createUserMailsDictionary(messages);
            var threads = this.createMailThreadList(this.messages);
            this.mailBoxList = threads.filter(function (t) { return t.status !== MailStatus.Archived; });
            this.mailBoxArchivesList = threads.filter(function (t) { return t.status === MailStatus.Archived; });
        };
        MailBoxCtrl.prototype.initMemberMailBoxStateAfterMessagesReady = function (toStateParam) {
            var _this = this;
            if (toStateParam.isNew && toStateParam.isNew === "new") {
                this.isNewMessageOpen = true;
                if (this.lastSentMessage)
                    this.showInsertPopup = true;
            }
            else {
                this.isNewMessageOpen = false;
            }
            if (toStateParam.id) {
                var memberId_1 = Number(toStateParam.id);
                if (isNaN(memberId_1)) {
                    var toMailBoxParams = { notReload: false };
                    this.statesService.go(States.mailboxInbox.name, toMailBoxParams);
                    return;
                }
                if (!this.currentMember || this.currentMember.id !== memberId_1) {
                    this.currentMember = undefined;
                    this.getCurrentMember(memberId_1).then(function () {
                        _this.prepareViewDataForMemberThread(memberId_1);
                        _this.newMessageForm.$setPristine();
                    }, function (errorData) { return _this.logger.appWarn("FailedToGetCurrentMember"); });
                }
                else {
                    this.prepareViewDataForMemberThread(memberId_1);
                }
            }
        };
        MailBoxCtrl.prototype.prepareViewDataForMemberThread = function (memberId) {
            var _this = this;
            var prepareViewData = function () {
                _this.getMemberTopMessagesTexts(memberId, _this.defaultMessagesOnPage);
                var lastUserMessage = _this.messages[_this.currentMember.id][0];
                _this.canBeRepliedTo = lastUserMessage && lastUserMessage.toId === _this.userService.getUser().id;
                _this.isThreadArchived = _this.messages[memberId].length > 0 &&
                    _this.messages[memberId][0].status === MailStatus.Archived;
            };
            if (this.initInboxPromise)
                this.initInboxPromise.finally(prepareViewData);
            else
                prepareViewData();
        };
        MailBoxCtrl.prototype.getPostNewMessageParams = function () {
            var postMessageParams = { memberIdTo: this.currentMember.id, text: this.newMessage.text, replyTo: undefined };
            if (this.messages[this.currentMember.id] && this.messages[this.currentMember.id].length > 0 && this.messages[this.currentMember.id][0].fromId === this.currentMember.id) {
                postMessageParams["replyTo"] = this.messages[this.currentMember.id][0].id;
            }
            return postMessageParams;
        };
        MailBoxCtrl.prototype.getMemberTopMessagesTexts = function (memberId, defaultMessagesOnPage) {
            for (var i = 0; i < defaultMessagesOnPage; i++) {
                if (this.messages[memberId] && this.messages[memberId].length > i) {
                    this.getMemberMessage(this.messages[memberId][i].id, memberId);
                }
            }
        };
        MailBoxCtrl.prototype.confirmToReloadUserMailState = function (toStateParam) {
            var confirmationPromise = this.$q.defer();
            var memberId = Number(toStateParam.id);
            if (!memberId || !this.currentMember || !this.newMessageForm.messageText.$viewValue || this.currentMember.id === memberId)
                confirmationPromise.resolve(true);
            else
                this.confirmInModal().then(function (confirmed) { confirmationPromise.resolve(confirmed); });
            return confirmationPromise.promise;
        };
        MailBoxCtrl.prototype.insertPrevEmail = function () {
            this.newMessage.text = this.lastSentMessage;
            this.showInsertPopup = false;
            this.logger.appInfo("PreviousEmailPastedIn", { content: this.lastSentMessage });
        };
        MailBoxCtrl.prototype.archiveThread = function () {
            var _this = this;
            this.modalService.open("<h3 class=\"text-center\">" + this.i18N("i18nArchiveThreadConfirm") + "</h3>", [{ label: "" + this.i18N("i18nYes"), cssClass: "btn btn-warning", result: true },
                { label: "" + this.i18N("i18nNo"), cssClass: "btn btn-success", result: false }])
                .then(function (confirmed) {
                if (!confirmed)
                    return;
                _this.$http.post(Config.EndPoints.postArchiveThread, { id: _this.messages[_this.currentMember.id][0].id });
                _this.$timeout(function () {
                    _this.messages[_this.currentMember.id].forEach(function (m) { return m.status = MailStatus.Archived; });
                    _this.updateMailBox();
                    _this.goToMailBox();
                });
            });
        };
        MailBoxCtrl.$inject = ["$scope", "$http", "$filter", "$q", "$timeout", "statesService", "userService", "mailboxServerService", "modalService", "serverResources", "spinnerService", "$attrs"];
        return MailBoxCtrl;
    }());
    MailBox.MailBoxCtrl = MailBoxCtrl;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MailboxServerService = (function () {
        function MailboxServerService($http) {
            this.$http = $http;
        }
        MailboxServerService.prototype.getUserMailList = function () {
            var promise = this.$http({ url: Config.EndPoints.getListOfMails, method: "GET" });
            return promise;
        };
        MailboxServerService.$inject = ["$http"];
        return MailboxServerService;
    }());
    MailBox.MailboxServerService = MailboxServerService;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessagesHistoryDirective = (function () {
        function MessagesHistoryDirective() {
            this.link = function ($scope, element, attr, ctrl) { };
            this.$scope = {};
            this.controller = Ctrl;
            this.controllerAs = "ctrl";
            this.bindToController = {
                messages: "=",
                loadMessages: "&"
            };
            this.templateUrl = "mailbox-message-history.tpl";
            this.restrict = "E";
            this.replace = true;
        }
        return MessagesHistoryDirective;
    }());
    MailBox.MessagesHistoryDirective = MessagesHistoryDirective;
    var Ctrl = (function () {
        function Ctrl($scope, $http, $filter, userService, statesService) {
            this.$http = $http;
            this.$filter = $filter;
            this.userService = userService;
            this.statesService = statesService;
            this.user = this.userService.getUser();
            if (!this.user) {
                statesService.go(States.login.name);
            }
        }
        Ctrl.prototype.loadNextMessages = function () { this.loadMessages(); };
        Object.defineProperty(Ctrl.prototype, "shownMessages", {
            get: function () { return this.$filter("filter")(this.messages, function (message) { return message.content ? true : false; }); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Ctrl.prototype, "asMoreHistory", {
            get: function () { return this.shownMessages != null && this.shownMessages.length !== this.messages.length; },
            enumerable: true,
            configurable: true
        });
        Ctrl.$inject = ["$scope", "$http", "$filter", "userService", "statesService"];
        return Ctrl;
    }());
    MailBox.Ctrl = Ctrl;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessageStatusDirective = (function () {
        function MessageStatusDirective() {
            this.restrict = "A";
            this.link = function ($scope, $element, $attrs) {
                var status = $attrs["messageStatusVal"];
                var replyTo = $attrs["messageStatusReplyTo"];
                switch (status) {
                    case "10":
                        $element.addClass("message-unread");
                        break;
                    case "11":
                        $element.addClass("message-read");
                        break;
                    case "2":
                        if (replyTo === "") {
                            $element.addClass("message-sent");
                        }
                        else {
                            $element.addClass("message-replied");
                        }
                        break;
                    default:
                }
            };
        }
        return MessageStatusDirective;
    }());
    MailBox.MessageStatusDirective = MessageStatusDirective;
})(MailBox || (MailBox = {}));
var MailBox;
(function (MailBox) {
    var MessageValidator = (function () {
        function MessageValidator(messageFormControler, isThisInitMessage, messageNotValidLabel) {
            this.messageFormControler = messageFormControler;
            this.isThisInitMessage = isThisInitMessage;
            this.messageNotValidLabel = messageNotValidLabel;
            this.minLength = 40;
            this.isMinLengthFailed = false;
            this.isEnabled = false;
            this.messageTextRequired = messageNotValidLabel;
        }
        Object.defineProperty(MessageValidator.prototype, "isMessageValid", {
            get: function () {
                var isValidText = this.isThisInitMessage
                    ? this.includeMinLengthValidation()
                    : this.messageFormControler.messageText.$valid;
                if (!isValidText) {
                    var error = Object.keys(this.messageFormControler.messageText.$error)[0];
                    if (error === "required")
                        this.messageTextErrorMessage = this.messageTextRequired;
                    if (this.isMinLengthFailed)
                        this.messageTextErrorMessage = this.messageTextRequired;
                }
                else
                    this.messageTextErrorMessage = undefined;
                return isValidText;
            },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(MessageValidator.prototype, "isValid", {
            get: function () {
                return this.isEnabled ? this.isMessageValid : true;
            },
            enumerable: true,
            configurable: true
        });
        ;
        MessageValidator.prototype.includeMinLengthValidation = function () {
            if (this.messageFormControler && this.messageFormControler.messageText) {
                var viewVal = this.messageFormControler.messageText.$viewValue;
                this.isMinLengthFailed = (!viewVal || viewVal.length < this.minLength);
                return this.messageFormControler.messageText.$valid && !this.isMinLengthFailed;
            }
            this.isMinLengthFailed = false;
            return true;
        };
        return MessageValidator;
    }());
    MailBox.MessageValidator = MessageValidator;
    ;
})(MailBox || (MailBox = {}));
var Profile;
(function (Profile) {
    var ProfileController = (function () {
        function ProfileController($scope, $http, $timeout, $uibModal, $log, userService, statesService, $window, modalService, serverResources) {
            var _this = this;
            this.$http = $http;
            this.$timeout = $timeout;
            this.$uibModal = $uibModal;
            this.$log = $log;
            this.userService = userService;
            this.statesService = statesService;
            this.$window = $window;
            this.modalService = modalService;
            this.serverResources = serverResources;
            this.languages = Languages.langsById;
            this.years = Years.getYears();
            this.translationLabels = {};
            this.serverValidation = { show: false, message: undefined, code: undefined, isModal: false };
            this.updateLearns = function (langs) { return _this.editProfile.learns = langs[0], _this.editProfile.learns2 = langs[1], _this.editProfile.learns3 = langs[2], langs; };
            this.updateKnows = function (langs) { return _this.editProfile.knows = langs[0], _this.editProfile.knows2 = langs[1], _this.editProfile.knows3 = langs[2], langs; };
            this.setCountry = function (countryId) { return _this.editProfile.country = countryId; };
            this.setMonth = function (index) { return _this.editProfile.birthMonth = _this.months[index].id; };
            this.setYear = function (year) { return _this.editProfile.birthYear = year; };
            this.cleanLocation = function () {
                _this.editProfile.location = FormInputsRegulator.cleanLocation(_this.editProfile.location);
            };
            this.getLocalizedResources();
            this.user = this.userService.getUser();
            this.editProfile = this.user;
            this.months = this.serverResources.getMonths();
            this.countries = this.serverResources.getCountries();
        }
        ProfileController.prototype.saveProfile = function () {
            this.profileValidation.enabled = true;
            if (this.serverValidation.show) {
                this.setServerValidationToDefaults(this.serverValidation);
            }
            if (this.profileValidation.isFormValid) {
                this.$log.appInfo("ValidProfileFormSubmitted", { form: this.editProfile });
                this.showModal();
            }
            else {
                this.$log.appInfo("InvalidProfileFormSubmitted", { validationReport: this.profileValidation.validationReport, user: this.userService.getUser(), form: this.editProfile });
            }
        };
        ProfileController.prototype.showModal = function () {
            var _this = this;
            this.modalWindowInstance = this.$uibModal.open({
                templateUrl: "edit-profile-password.tpl",
                controller: "UserProfileModalCtrl",
                controllerAs: "profileModal",
                resolve: {
                    submitForm: function () { return function (userPassword, modalWindowInstance) {
                        _this.postDataToServer(_this.editProfile, _this.userService, userPassword, modalWindowInstance, _this.serverValidation);
                    }; },
                    serverValidation: function () { return _this.serverValidation; }
                }
            });
        };
        ProfileController.prototype.postDataToServer = function (editProfile, userService, userPassword, modalWindowInstance, serverValidation) {
            var _this = this;
            editProfile.currentPassword = userPassword;
            userService.update(editProfile).
                then(function (response) {
                if (response.isUpdated) {
                    _this.handleUpdateSuccessServerResponse(response, modalWindowInstance);
                }
                else {
                    _this.serverResources.getServerResponseText(response.message.code).then(function (serverMessage) {
                        serverValidation.message = serverMessage;
                    });
                    serverValidation.show = true;
                    serverValidation.code = response.message.code;
                    if (response.message.code === 6) {
                        serverValidation.isModal = true;
                    }
                    else {
                        modalWindowInstance.close();
                        serverValidation.isModal = false;
                    }
                    _this.$timeout(function () {
                        serverValidation.message = undefined;
                        serverValidation.show = false;
                    }, 5000);
                }
            }, function () {
            });
        };
        ProfileController.prototype.handleUpdateSuccessServerResponse = function (response, modalWindowInstance) {
            var _this = this;
            modalWindowInstance.close();
            modalWindowInstance.result.then(function () {
                _this.modalService.open("<h4>" + _this.translationLabels["profileUpdated"] + "</h4>", [{ label: _this.translationLabels["ok"], cssClass: "btn btn-success", result: true }]).then(function () {
                    var statePromise = _this.statesService.reload();
                    statePromise.then(function () {
                        _this.statesService.closeState(States.profile.name);
                    });
                });
            });
        };
        ProfileController.prototype.setServerValidationToDefaults = function (serverValidation) {
            this.serverValidation.show = false;
            this.serverValidation.message = undefined;
            this.serverValidation.code = undefined;
            this.serverValidation.isModal = false;
        };
        ProfileController.prototype.cleanPassword = function () {
            if (this.editProfile.password === "") {
                this.editProfile.password = undefined;
            }
        };
        ProfileController.prototype.cleanRetypePassword = function () {
            if (this.editProfile.reTypePassword === "") {
                this.editProfile.reTypePassword = undefined;
            }
        };
        ProfileController.prototype.showDeleteAccountModal = function () {
            var _this = this;
            this.$log.appInfo("CancelAccountRequested", { userId: this.editProfile.id });
            var deleteResult = this.modalWindowInstance = this.$uibModal.open({
                templateUrl: "edit-profile-delete-account.tpl",
                controller: Profile.DeleteProfileModalCtrl,
                controllerAs: "deleteModal",
                resolve: { id: function () { return _this.editProfile.id; } }
            });
            deleteResult.result.then(function (result) {
                if (result) {
                    _this.statesService.resetAllStates();
                    _this.statesService.goAndReload(States.home.name);
                }
                else {
                    _this.$log.appInfo("CancelAccountCancelled", { userId: _this.editProfile.id });
                }
            }, function () {
                _this.$log.appInfo("CancelAccountCancelled", { userId: _this.editProfile.id });
            });
        };
        ProfileController.prototype.getLocalizedResources = function () {
            var _this = this;
            this.serverResources.getProfileResources().then(function (translates) {
                _this.translationLabels["profileUpdated"] = translates.profileUpdated;
                _this.translationLabels["ok"] = translates.ok;
            });
        };
        ProfileController.$inject = ["$scope", "$http", "$timeout", "$uibModal", "$log", "userService", "statesService", "$window", "modalService", "serverResources"];
        return ProfileController;
    }());
    Profile.ProfileController = ProfileController;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileDirective = (function () {
        function ProfileDirective() {
            this.link = function ($scope, element, attr, profile) {
                profile.profileValidation = new Profile.ProfileFormValidation(profile.profileForm, profile.editProfile, profile.serverResources);
            };
            this.scope = {};
            this.templateUrl = "edit-profile.tpl";
            this.controller = "UserProfileCtrl";
            this.controllerAs = "profile";
            this.bindToController = {};
            this.restrict = "E";
            this.replace = true;
        }
        return ProfileDirective;
    }());
    Profile.ProfileDirective = ProfileDirective;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileFormValidation = (function () {
        function ProfileFormValidation(formCtrl, profile, serverResources) {
            var _this = this;
            this.formCtrl = formCtrl;
            this.profile = profile;
            this.enabled = false;
            this.errors = {};
            serverResources.getAccountValidationErrors()
                .then(function (errorTransaltions) { _this.validationErrors = errorTransaltions; });
        }
        Object.defineProperty(ProfileFormValidation.prototype, "isLearnsValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.learns) : true;
                if (!isValid) {
                    this.errors["learns"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isKnowsValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.knows) : true;
                if (!isValid) {
                    this.errors["knows"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isBirthDateValid", {
            get: function () {
                var isValid = this.enabled ? this.profile.birthMonth && this.profile.birthYear : true;
                if (!isValid) {
                    this.errors["birthDate"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isLocationValid", {
            get: function () {
                var isValid = this.enabled ? angular.isNumber(this.profile.country) && this.formCtrl.location.$valid : true;
                if (!isValid) {
                    this.errors["location"] = {};
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isIntroductionValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.introduction.$valid : true;
                if (!isValid) {
                    this.errors["location"] = this.formCtrl.introduction.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isEmailValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.email.$valid : true;
                if (!isValid) {
                    this.errors["email"] = this.formCtrl.email.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isPasswordValid", {
            get: function () {
                var isValid = this.enabled ? this.formCtrl.password.$valid : true;
                if (!isValid)
                    this.errors["password"] = this.formCtrl.password.$error;
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isReTypedPasswordValid", {
            get: function () {
                var isValid = !this.enabled ? true : this.formCtrl.reTypedPassword.$valid && (this.profile.password === this.profile.reTypePassword);
                if (!isValid) {
                    this.errors["reTypedPassword"] = this.formCtrl.reTypedPassword.$error;
                }
                return isValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "validationReport", {
            get: function () {
                return {
                    isLearnsValid: this.isLearnsValid,
                    isKnowsValid: this.isKnowsValid,
                    isBirthDateValid: this.isBirthDateValid,
                    isLocationValid: this.isLocationValid,
                    isIntroductionValid: this.isIntroductionValid,
                    isEmailValid: this.isEmailValid,
                    isPasswordValid: this.isPasswordValid,
                    isReTypedPasswordValid: this.isReTypedPasswordValid
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "isFormValid", {
            get: function () {
                this.errors = {};
                return !this.enabled ? true :
                    this.isLearnsValid && this.isKnowsValid && this.isBirthDateValid && this.isLocationValid
                        && this.isIntroductionValid && this.isEmailValid && this.isPasswordValid && this.isReTypedPasswordValid;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProfileFormValidation.prototype, "profileClientError", {
            get: function () {
                if (Object.keys(this.errors).length === 0)
                    return undefined;
                var passwordErrors = this.errors["password"];
                var errorText;
                if (passwordErrors) {
                    if (passwordErrors["minlength"])
                        errorText = this.validationErrors.passwordMinError;
                    else if (passwordErrors["maxlength"])
                        errorText = this.validationErrors.passwordMaxError;
                    else
                        errorText = this.validationErrors.defaultError;
                }
                else {
                    errorText = this.validationErrors.defaultError;
                }
                return errorText;
            },
            enumerable: true,
            configurable: true
        });
        return ProfileFormValidation;
    }());
    Profile.ProfileFormValidation = ProfileFormValidation;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileHelper = (function () {
        function ProfileHelper() {
        }
        ProfileHelper.val = 42;
        return ProfileHelper;
    }());
    Profile.ProfileHelper = ProfileHelper;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileModalController = (function () {
        function ProfileModalController($scope, $uibModalInstance, submitForm, serverValidation) {
            this.$uibModalInstance = $uibModalInstance;
            this.submitForm = submitForm;
            this.serverValidation = serverValidation;
            this.validationDisabled = true;
        }
        Object.defineProperty(ProfileModalController.prototype, "isFormValid", {
            get: function () { return this.validationDisabled ? true : angular.isDefined(this.password) && this.password !== ""; },
            enumerable: true,
            configurable: true
        });
        ProfileModalController.prototype.save = function () {
            if (this.validationDisabled)
                this.validationDisabled = false;
            if (this.isFormValid) {
                this.submitForm(this.password, this.$uibModalInstance);
            }
        };
        ProfileModalController.$inject = ["$scope", "$uibModalInstance", "submitForm", "serverValidation"];
        return ProfileModalController;
    }());
    Profile.ProfileModalController = ProfileModalController;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var DeleteProfileModalCtrl = (function () {
        function DeleteProfileModalCtrl($scope, $uibModalInstance, id, userService, statesService, serverResources) {
            this.$uibModalInstance = $uibModalInstance;
            this.id = id;
            this.userService = userService;
            this.statesService = statesService;
            this.serverResources = serverResources;
            this.isValidationEnabled = false;
            this.serverValidation = { show: false, message: undefined };
        }
        DeleteProfileModalCtrl.prototype.deleteAccount = function () {
            var _this = this;
            this.isValidationEnabled = true;
            this.serverValidation.show = false;
            this.serverValidation.message = undefined;
            this.userService.deleteUser({ userId: this.id, currentPassword: this.psw }).then(function (data) {
                if (data.isSuccess) {
                    _this.$uibModalInstance.close(true);
                }
                else {
                    _this.serverValidation.show = true;
                    _this.serverResources.getServerResponseText(data.message.code).then(function (translate) {
                        _this.serverValidation.message = translate;
                    });
                }
            }, function () { });
        };
        DeleteProfileModalCtrl.prototype.cancel = function () {
            this.$uibModalInstance.close(false);
        };
        DeleteProfileModalCtrl.prototype.isPasswordValid = function () {
            return this.isValidationEnabled ? this.deleteForm.password.$valid : true;
        };
        DeleteProfileModalCtrl.$inject = ["$scope", "$uibModalInstance", "id", "userService", "statesService", "serverResources"];
        return DeleteProfileModalCtrl;
    }());
    Profile.DeleteProfileModalCtrl = DeleteProfileModalCtrl;
})(Profile || (Profile = {}));
var Profile;
(function (Profile) {
    var ProfileLangsPicker = (function () {
        function ProfileLangsPicker() {
            this.link = function () { };
            this.scope = {};
            this.templateUrl = "profile-langs-picker.tpl";
            this.controller = ProfileLangsPickerCtrl;
            this.controllerAs = "pickerCtrl";
            this.bindToController = {
                currentLanguages: "=",
                blockedLanguages: "=",
                updateLanguages: "="
            };
            this.restrict = "E";
            this.replace = true;
        }
        return ProfileLangsPicker;
    }());
    Profile.ProfileLangsPicker = ProfileLangsPicker;
    var ProfileLangsPickerCtrl = (function () {
        function ProfileLangsPickerCtrl() {
            var _this = this;
            this.languages = Languages.langsById;
            this.isBlockedLang = function (langId) { return _this.currentLanguages.indexOf(langId) !== -1 || _this.blockedLanguages.indexOf(langId) !== -1; };
            this.isValidLang = function (lang) { return lang; };
            var langCount = this.currentLanguages.filter(function (value) { return Boolean(value); }).length;
            this.comboCount = langCount === 0 ? 1 : langCount;
        }
        ProfileLangsPickerCtrl.prototype.setLang = function (langIndex, langVal) {
            this.currentLanguages[langIndex] = langVal;
            this.updateLanguages(this.currentLanguages);
        };
        ProfileLangsPickerCtrl.prototype.removeLang = function () {
            this.comboCount--;
            this.setLang(this.comboCount, undefined);
        };
        return ProfileLangsPickerCtrl;
    }());
    Profile.ProfileLangsPickerCtrl = ProfileLangsPickerCtrl;
})(Profile || (Profile = {}));
var Services;
(function (Services) {
    var AjaxManager = (function () {
        function AjaxManager($q, $log, $injector) {
            var _this = this;
            this.$q = $q;
            this.$log = $log;
            this.$injector = $injector;
            this.request = function (config) {
                if (!config.timeout)
                    config.timeout = Config.Ajax.timeoutInMs;
                config.msBeforeAjaxCall = new Date().getTime();
                if (config.url.indexOf("uib/template/") !== 0
                    && config.url.substr(-".html".length) === ".html") {
                    config.url = config.url + "?v=" + Config.clientVersion;
                }
                return config;
            };
            this.response = function (response) {
                var timewarning = response.config.timewarning || Config.Ajax.timewarningInMs;
                if (timewarning) {
                    var timeTakenInMs = new Date().getTime() - response.config.msBeforeAjaxCall;
                    if (timeTakenInMs > timewarning && response.config.url !== Config.EndPoints.remoteLog)
                        _this.$log.ajaxWarn("SlowServerResponse", { timeTakenInMs: timeTakenInMs, url: response.config.url, data: response.config.data });
                }
                return response;
            };
            this.responseError = function (rejection) {
                var extraErrorData, errorType, downgradeToWarning = false;
                var errorData = { url: rejection.config.url, data: rejection.config.data };
                if (rejection && rejection.status === 499)
                    return rejection;
                if (rejection && rejection.status === 401) {
                    _this.$log.ajaxWarn("AjaxUnauthorized", $.extend({}, errorData));
                    _this.$injector.get("$state").go(States.login.name);
                    return rejection;
                }
                else if (rejection && rejection.status && rejection.data) {
                    errorType = "AjaxException";
                    extraErrorData = {
                        errorMessage: rejection.data.ExceptionMessage || rejection.data.Message,
                        status: rejection.status
                    };
                }
                else {
                    var timeTakenInMs = new Date().getTime() - rejection.config.msBeforeAjaxCall;
                    errorType = "AjaxTimeout";
                    downgradeToWarning = true;
                    extraErrorData = { timeTaken: timeTakenInMs };
                }
                if (rejection.config.url !== Config.EndPoints.remoteLog) {
                    if (downgradeToWarning)
                        _this.$log.ajaxWarn(errorType, $.extend(extraErrorData, errorData));
                    else
                        _this.$log.ajaxError(errorType, $.extend(extraErrorData, errorData));
                }
                return _this.$q.reject(rejection);
            };
        }
        AjaxManager.factory = function ($q, $log, $injector) { return new AjaxManager($q, $log, $injector); };
        AjaxManager.$inject = ["$q", "$log", "$injector"];
        return AjaxManager;
    }());
    Services.AjaxManager = AjaxManager;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var UsersSortingOptions;
    (function (UsersSortingOptions) {
        UsersSortingOptions[UsersSortingOptions["Default"] = 0] = "Default";
        UsersSortingOptions[UsersSortingOptions["Name"] = 1] = "Name";
        UsersSortingOptions[UsersSortingOptions["Knows"] = 2] = "Knows";
        UsersSortingOptions[UsersSortingOptions["Learns"] = 3] = "Learns";
        UsersSortingOptions[UsersSortingOptions["Country"] = 4] = "Country";
    })(UsersSortingOptions = Services.UsersSortingOptions || (Services.UsersSortingOptions = {}));
    var ChatUsersService = (function () {
        function ChatUsersService($timeout, userService, $filter, serverResources, $log) {
            var _this = this;
            this.$timeout = $timeout;
            this.userService = userService;
            this.$filter = $filter;
            this.serverResources = serverResources;
            this.$log = $log;
            this.onlineUsers = [];
            this.justLeftUsers = [];
            this.countOfUsers = { forPublicRooms: {}, inPrivateRooms: 0, inSecretRooms: 0 };
            this.derivedUserLists = [this.onlineUsers, this.justLeftUsers];
            this.countries = this.serverResources.getCountries();
            this.unmarkRecentUsers = function () { return _this.forEachUser(function (user) { return _this.unMarkRecentUser(user, Config.lobbySpecialRoom.name); }); };
            this.unMarkRecentUsersIn = function (roomId) { return _this.forEachUser(function (user) { return _this.unMarkRecentUser(user, roomId); }); };
            setInterval(function () { return _this.forEachUser(function (user) {
                user.roomTypingIn = undefined;
            }); }, 5 * 60 * 1000);
        }
        ChatUsersService.prototype.clearAllUsers = function () {
            angular.copy([], this.onlineUsers);
            angular.copy([], this.justLeftUsers);
        };
        ChatUsersService.prototype.forEachUser = function (fn) {
            angular.forEach(this.derivedUserLists, function (list) {
                angular.forEach(list, function (user) { return fn(user); });
            });
        };
        ChatUsersService.prototype.removeUserFromLists = function (userId) {
            var _this = this;
            var user;
            angular.forEach(this.derivedUserLists, function (users) {
                for (var i = users.length - 1; i >= 0; i--) {
                    if (users[i] == null || users[i] == undefined) {
                        _this.$log.appWarn("UndefinedListItemsInRemoveUserFromLists");
                        users.splice(i, 1);
                        continue;
                    }
                    if (users[i].id === userId)
                        user = users.splice(i, 1)[0];
                }
            });
            return user;
        };
        ChatUsersService.prototype.addUser = function (user) {
            this.removeUserFromLists(user.id);
            var index = this.onlineUsers.length;
            for (var i = 0; i <= this.onlineUsers.length - 1; i++)
                if (this.onlineUsers[i].isPinned === false) {
                    index = i;
                    break;
                }
            this.onlineUsers.splice(index, 0, user);
        };
        ChatUsersService.prototype.removeUser = function (userId) {
            var user = this.removeUserFromLists(userId);
            this.justLeftUsers.unshift(user);
            while (this.justLeftUsers.length - 1 >= (this.onlineUsers.length) * ChatUsersService.quittersRatio) {
                this.justLeftUsers.pop();
            }
        };
        ChatUsersService.prototype.sortBy = function (sortingOption) {
            var _this = this;
            if (sortingOption === void 0) { sortingOption = null; }
            var sorter = function (user) {
                switch (sortingOption) {
                    case UsersSortingOptions.Name: return user.firstName;
                    case UsersSortingOptions.Knows: return Languages.langsById[Number(user.knows)].text;
                    case UsersSortingOptions.Learns: return Languages.langsById[Number(user.learns)].text;
                    case UsersSortingOptions.Country: return _this.countries[user.country].text;
                    default: return -user.id;
                }
            };
            angular.forEach(this.derivedUserLists, function (list) {
                var sortedPinnedUsers = _this.$filter("orderBy")(_this.$filter("filter")(list, { isPinned: true }), sorter);
                var sortedNormalUsers = _this.$filter("orderBy")(_this.$filter("filter")(list, { isPinned: false }), sorter);
                angular.copy(sortedPinnedUsers.concat(sortedNormalUsers), list);
            });
        };
        ChatUsersService.prototype.getUser = function (userId) {
            var theUser;
            this.forEachUser(function (user) { if (user.id === userId)
                theUser = user; });
            return theUser;
        };
        ChatUsersService.prototype.unMarkRecentUser = function (user, roomId) {
            var roomIndex = user.recentlyJoinedRooms.indexOf(roomId);
            if (roomIndex !== -1)
                user.recentlyJoinedRooms.splice(roomIndex, 1);
        };
        ChatUsersService.quittersRatio = 1 / 10;
        ChatUsersService.$inject = ["$timeout", "userService", "$filter", "serverResources", "$log"];
        return ChatUsersService;
    }());
    Services.ChatUsersService = ChatUsersService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ContactsService = (function () {
        function ContactsService($http, $q, $state, authService) {
            var _this = this;
            this.$http = $http;
            this.$q = $q;
            this.$state = $state;
            this.authService = authService;
            this.contactList = [];
            if (!this.authService.isAuthenticated())
                return;
            this.getContacts().then(function (contacts) { return Array.prototype.push.apply(_this.contactList, contacts); });
        }
        ContactsService.prototype.getContacts = function () {
            var _this = this;
            return this.$http.get(Config.EndPoints.getContactsList).then(function (res) { return _this.$q.resolve(res.data); });
        };
        Object.defineProperty(ContactsService.prototype, "contacts", {
            get: function () {
                return this.contactList;
            },
            enumerable: true,
            configurable: true
        });
        ContactsService.prototype.add = function (member) {
            this.contactList.push(member);
            return this.$http.post(Config.EndPoints.postContactsAdd, { contactUserId: member.id, sourceState: this.$state.current.name.replace("root.", "") });
        };
        ContactsService.prototype.remove = function (contactUserId) {
            this.contactList.splice(this.contactList.indexOf(this.contactList.filter(function (member) { return member.id === contactUserId; })[0]), 1);
            return this.$http.post(Config.EndPoints.postContactsRemove, { contactUserId: contactUserId, sourceState: this.$state.current.name });
        };
        ContactsService.prototype.isUserInContacts = function (userId) {
            return this.contactList.filter(function (member) { return member.id === userId; }).length === 1;
        };
        ContactsService.$inject = ["$http", "$q", "$state", "authService"];
        return ContactsService;
    }());
    Services.ContactsService = ContactsService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var LogLevel;
    (function (LogLevel) {
        LogLevel[LogLevel["Info"] = 0] = "Info";
        LogLevel[LogLevel["Warn"] = 1] = "Warn";
        LogLevel[LogLevel["Error"] = 2] = "Error";
    })(LogLevel = Services.LogLevel || (Services.LogLevel = {}));
    ;
    var EnhancedLog = (function () {
        function EnhancedLog() {
            var _this = this;
            this.maxErrorRemotelyLogged = 250;
            this.currentErrorRemotelyLogged = 0;
            this.getErrorMessage = function (msg, location) {
                return (msg.stack || msg.message || ((typeof msg === "string" || msg instanceof String) ? msg : JSON.stringify(msg)))
                    + (location != undefined ? "\n    at " + location : "");
            };
            this.getMessage = function (tag, data) { return tag + (data ? " = " + JSON.stringify(data) : ""); };
            this.logTo = function (tag, data, logger, level) {
                var msg = _this.getMessage(tag, data);
                if (level !== LogLevel.Error || _this.currentErrorRemotelyLogged < _this.maxErrorRemotelyLogged)
                    EnhancedLog.http.post(Config.EndPoints.remoteLog, { logger: logger, level: level, path: window.location.pathname, message: msg });
                if (level === LogLevel.Error) {
                    _this.currentErrorRemotelyLogged++;
                    if (_this.currentErrorRemotelyLogged === _this.maxErrorRemotelyLogged)
                        EnhancedLog.http.post(Config.EndPoints.remoteLog, { logger: logger, level: LogLevel.Error, path: window.location.pathname, message: "MaxErrorRemotelyLoggedReached" });
                }
                switch (level) {
                    case LogLevel.Error:
                        _this.consoleError(tag, data);
                        debugger;
                        break;
                    case LogLevel.Warn:
                        _this.consoleWarn(tag, data);
                        break;
                    default:
                        _this.consoleInfo(tag, data);
                        break;
                }
            };
            this.trace = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.debug = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.log = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.info = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Info); };
            this.warn = function (msg) { _this.logTo(msg, null, Config.Loggers.angular, LogLevel.Warn); };
            this.error = function (msg, location) {
                if (msg) {
                    var errorMsg = _this.getErrorMessage(msg, location);
                    _this.logTo(errorMsg, null, Config.Loggers.angular, LogLevel.Error);
                }
            };
            this.consoleInfo = function (tag, data) { return console.info(_this.getMessage(tag, data)); };
            this.consoleWarn = function (tag, data) { return console.warn(_this.getMessage(tag, data)); };
            this.consoleError = function (tag, data) { return console.error(_this.getMessage(tag, data)); };
            this.appInfo = function (tag, data) { return _this.logTo(tag, data, Config.Loggers.client, LogLevel.Info); };
            this.appWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.client, LogLevel.Warn); };
            this.appError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.client, LogLevel.Error); };
            this.ajaxInfo = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Info); };
            this.ajaxWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Warn); };
            this.ajaxError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.ajax, LogLevel.Error); };
            this.signalRInfo = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Info); };
            this.signalRWarn = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Warn); };
            this.signalRError = function (tag, data) { _this.logTo(tag, data, Config.Loggers.signalR, LogLevel.Error); };
            this.signalRWarnWithString = function (tagString, data) { _this.logTo(tagString, data, Config.Loggers.signalR, LogLevel.Warn); };
            this.signalRErrorWithString = function (tagString, data) { _this.logTo(tagString, data, Config.Loggers.signalR, LogLevel.Error); };
        }
        return EnhancedLog;
    }());
    Services.EnhancedLog = EnhancedLog;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var MembersService = (function () {
        function MembersService($http, userService, $log) {
            this.$http = $http;
            this.userService = userService;
            this.$log = $log;
        }
        MembersService.prototype.getMembers = function (searchParams) {
            return this.$http.post(Config.EndPoints.postMembersList, searchParams);
        };
        MembersService.$inject = ["$http", "userService", "$log"];
        return MembersService;
    }());
    Services.MembersService = MembersService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ServerSocketState;
    (function (ServerSocketState) {
        ServerSocketState[ServerSocketState["Connecting"] = 0] = "Connecting";
        ServerSocketState[ServerSocketState["Connected"] = 1] = "Connected";
        ServerSocketState[ServerSocketState["Reconnecting"] = 2] = "Reconnecting";
        ServerSocketState[ServerSocketState["Disconnected"] = 4] = "Disconnected";
    })(ServerSocketState = Services.ServerSocketState || (Services.ServerSocketState = {}));
    var ServerSocketService = (function () {
        function ServerSocketService($q, $log, $timeout) {
            var _this = this;
            this.$q = $q;
            this.$log = $log;
            this.$timeout = $timeout;
            this.hubErrorWebSocketClosedCount = 0;
            this.connectHubFailureCount = 0;
            this.eventConnectionSlow = new LiteEvent();
            this.eventDisconnected = new LiteEvent();
            this.eventReconnected = new LiteEvent();
            this.eventStarting = new LiteEvent();
            this.eventStarted = new LiteEvent();
            this.eventFatalError = new LiteEvent();
            this.getHubProxy = function (hubName) { return $.connection[hubName] ? $.connection[hubName] : _this.hub.createHubProxy(hubName); };
            this.stop = function () { return _this.hub.stop(); };
            this.hub = $.hubConnection();
            this.hub.starting(function () { _this.$log.signalRInfo("HubStarting"); _this.eventStarting.trigger(); });
            this.hub.connectionSlow(function () { _this.$log.signalRWarn("HubConnectionSlow"); _this.eventConnectionSlow.trigger(); });
            this.hub.reconnecting(function () { _this.$log.signalRWarn("HubReconnecting"); });
            this.hub.reconnected(function () { _this.$log.signalRInfo("HubReconnected"); _this.eventReconnected.trigger(); });
            this.hub.disconnected(function () { _this.onHubDisconnected(); _this.eventDisconnected.trigger(); });
            this.hub.stateChanged(function (data) { return _this.onHubStateChanged(data); });
            this.hub.received(function (data) { return _this.onHubReceived(data); });
            this.hub.error(function (error) { return _this.onHubError(error); });
            setInterval(function () {
                if (_this.hubErrorWebSocketClosedCount !== 0) {
                    $log.signalRInfo("ResettinghubErrorWebSocketClosedCountToZero", { hubErrorWebSocketClosedCount: _this.hubErrorWebSocketClosedCount });
                    _this.hubErrorWebSocketClosedCount = 0;
                }
            }, 300000);
        }
        Object.defineProperty(ServerSocketService.prototype, "state", {
            get: function () { return this.hub.state; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ServerSocketService.prototype, "sessionId", {
            get: function () { return this.hub.id; },
            enumerable: true,
            configurable: true
        });
        ServerSocketService.prototype.start = function () {
            var _this = this;
            this.$log.signalRInfo("StartSignalRConnectionRequested");
            var startDeferred = this.$q.defer();
            if (this.connectHubFailureCount >= 10) {
                this.$log.signalRInfo("ConnectHubFailedTooMuch");
                startDeferred.reject("ConnectHubFailedTooMuch");
            }
            else if (this.hub.state === $.signalR.connectionState.disconnected) {
                this.$log.signalRInfo("ConnectingHub");
                this.hub.start().done(function (event) { return startDeferred.resolve(); })
                    .fail(function (error) {
                    _this.connectHubFailureCount++;
                    _this.$log.signalRError("HubStartFailed", error);
                    startDeferred.reject(error);
                });
            }
            else {
                this.$log.signalRInfo("StartWasCalledOnNonDisconnectedState", { state: this.hub.state });
                startDeferred.resolve();
            }
            return startDeferred.promise;
        };
        ServerSocketService.prototype.restart = function () {
            var _this = this;
            this.hub.stop();
            this.$timeout(function () { return _this.hub.start(); }, 500, false);
        };
        ServerSocketService.prototype.onHubStateChanged = function (data) {
            this.$log.signalRInfo("HubStateChanged", data);
            if (data.oldState === $.signalR.connectionState.connecting && data.newState === $.signalR.connectionState.connected) {
                this.$log.signalRInfo("ClientConnected");
                this.eventStarted.trigger();
            }
        };
        ServerSocketService.prototype.onHubReceived = function (data) {
            var dataCopy = angular.copy(data);
            if (dataCopy["I"] != undefined)
                return;
            if (dataCopy["M"] === "Pong")
                return;
            if (dataCopy["M"] === "Do")
                angular.forEach(dataCopy["A"][0], function (call) {
                    if (call["message"]["method"] === "AddInitialMessages" || call["message"]["method"] === "AddPrivateChatStatus")
                        call["message"]["args"] = "...";
                });
            if (dataCopy["E"] !== undefined)
                this.$log.signalRError("HubReceived", dataCopy);
            else
                this.$log.consoleInfo("HubReceived", dataCopy);
        };
        ServerSocketService.prototype.onHubError = function (error) {
            if (error.message === "WebSocket closed.")
                this.onWebSocketClosed();
            else
                this.$log.signalRError("HubError", { errorMessage: error["message"], stack: error["stack"] });
        };
        ServerSocketService.prototype.onHubDisconnected = function () {
            var _this = this;
            if (this.hub.lastError) {
                this.$log.signalRWarn("HubDisconnectedOnError", this.hub.lastError.message);
                this.$timeout(function () { _this.start(); }, 5000);
            }
            else {
                this.$log.signalRInfo("HubDisconnectedOnDemand", { sessionTag: Runtime.sessionTag });
            }
        };
        ServerSocketService.prototype.onWebSocketClosed = function () {
            this.hubErrorWebSocketClosedCount++;
            this.$log.signalRWarn("HubErrorWebSocketClosed", { occurences: this.hubErrorWebSocketClosedCount });
            this.hub.lastError = null;
            if (this.hubErrorWebSocketClosedCount === 5) {
                this.$log.signalRWarn("HubResetDueToExcessiveWebSocketClosedErrors");
                this.restart();
            }
            if (this.hubErrorWebSocketClosedCount === 10) {
                this.$log.signalRError("HubStopAndQuitChatDueToExcessiveWebSocketClosedErrors");
                this.eventFatalError.trigger();
                this.stop();
            }
        };
        ServerSocketService.$inject = ["$q", "$log", "$timeout"];
        return ServerSocketService;
    }());
    Services.ServerSocketService = ServerSocketService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var InvokeHandlers = (function () {
        function InvokeHandlers() {
        }
        return InvokeHandlers;
    }());
    Services.InvokeHandlers = InvokeHandlers;
    var HubService = (function () {
        function HubService($q, $log, $timeout, connection, hubName) {
            var _this = this;
            this.$q = $q;
            this.$log = $log;
            this.$timeout = $timeout;
            this.connection = connection;
            this.hubName = hubName;
            this.queuedOutgoingActions = [];
            this.invokeHandlers = {};
            this.queuedIncomingActions = [];
            this.previousOutgoingQueueLength = 0;
            this.outgoingQueueLengthGrowthCount = 0;
            this.hubProxy = connection.getHubProxy(hubName);
            this.hubProxy.on("Do", function (managedMessages) { return _this.onManagedMessages(managedMessages); });
            this.hubProxy.on("ResetClient", function () { return _this.connection.restart(); });
            this.connection.eventStarting.on(function () { return _this.expectedCallOrderId = 1; });
            this.connection.eventStarted.on(function () { return _this.processOutgoingQueue(); });
            this.connection.eventReconnected.on(function () { return _this.processOutgoingQueue(); });
            this.connection.eventDisconnected.on(function () { return _this.queuedOutgoingActions = []; });
        }
        HubService.prototype.on = function (hubAction, callback) {
            var _this = this;
            var fn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _this.processReceivedInvoke(String(hubAction), args);
            };
            this.hubProxy.on(String(hubAction), fn);
            if (!this.invokeHandlers[String(hubAction)])
                this.invokeHandlers[String(hubAction)] = [];
            this.invokeHandlers[String(hubAction)].push({ callback: callback, managedHandler: fn });
        };
        HubService.prototype.processReceivedInvoke = function (hubAction, hubArgs) {
            var _this = this;
            var handlers = this.invokeHandlers[hubAction];
            if (!handlers || !handlers.length) {
                this.$log.signalRError("MissingHubActionHandler", { hubAction: hubAction });
                return;
            }
            for (var idx = 0; idx < handlers.length; idx++) {
                this.$timeout(function (handler) {
                    try {
                        handler.apply(_this, hubArgs);
                    }
                    catch (e) {
                        var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
                        _this.$log.signalRErrorWithString(hubAction + "_Failed", errorData);
                    }
                }, 0, true, handlers[idx].callback);
            }
        };
        HubService.prototype.onManagedMessages = function (managedMessages) {
            var _this = this;
            try {
                if (managedMessages == null || managedMessages.length === 0) {
                    this.$log.signalRError("ManagedMessagesCannotBeNullOrEmpty");
                    return;
                }
                var processedMessagesCount = 0;
                var keepProcessing;
                managedMessages = managedMessages.concat(this.queuedIncomingActions || []);
                do {
                    keepProcessing = false;
                    managedMessages.forEach(function (managedMessage) {
                        if (managedMessage.orderId === _this.expectedCallOrderId) {
                            var action = managedMessage.message;
                            _this.processReceivedInvoke(String(action.method), action.args || []);
                            _this.expectedCallOrderId++;
                            processedMessagesCount++;
                            keepProcessing = true;
                        }
                    });
                } while (keepProcessing);
                this.queuedIncomingActions = [];
                managedMessages.forEach(function (managedMessage) {
                    if (managedMessage.orderId > _this.expectedCallOrderId)
                        _this.queuedIncomingActions.push(managedMessage);
                });
                if (this.queuedIncomingActions.length !== 0)
                    this.$log.signalRInfo("ManagedMessagesKeptForLater", { count: this.queuedIncomingActions.length });
            }
            catch (e) {
                var errorData = e && { errorMessage: e["message"], stack: e["stack"] };
                this.$log.signalRErrorWithString("Do_Failed", errorData);
            }
        };
        HubService.prototype.emit = function (action) {
            var _this = this;
            var argsAndCallback = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                argsAndCallback[_i - 1] = arguments[_i];
            }
            var callback = function () { };
            var args = angular.copy(argsAndCallback);
            if (args.length) {
                var hasCallback = typeof args[args.length - 1] == "function";
                if (hasCallback)
                    callback = args.splice(args.length - 1)[0];
            }
            if (this.connection.state === Services.ServerSocketState.Connected)
                (_a = this.hubProxy).invoke.apply(_a, [String(action)].concat(args)).done(function (result) {
                    callback.apply(_this, [null, result]);
                }).fail(function (err) {
                    var errorData = { args: args, error: { errorMessage: err["message"], stack: err["stack"] } };
                    if (err["message"] === "Connection started reconnecting before invocation result was received.") {
                        _this.$log.signalRWarnWithString("" + _this.hubName + action + "_Retrying", errorData);
                        _this.queuedOutgoingActions.push({ method: action, args: argsAndCallback });
                    }
                    else {
                        _this.$log.signalRErrorWithString("" + _this.hubName + action + "_Failed", errorData);
                        callback.apply(_this, [err]);
                    }
                });
            else {
                this.$log.signalRInfo("QueueingOutgoingAction", { action: action });
                this.queuedOutgoingActions.push({ method: action, args: argsAndCallback });
            }
            var _a;
        };
        HubService.prototype.processOutgoingQueue = function () {
            var actions = angular.copy(this.queuedOutgoingActions);
            this.queuedOutgoingActions = [];
            if (actions.length !== 0 && actions.length >= this.previousOutgoingQueueLength) {
                if (++this.outgoingQueueLengthGrowthCount >= 5) {
                    this.$log.signalRWarn("OutgoingQueueGrewTooManyTimesInARow");
                    this.queuedOutgoingActions = [];
                    this.previousOutgoingQueueLength = 0;
                    this.connection.restart();
                    return;
                }
                else
                    this.$log.signalRInfo("OutgoingQueueGrew");
            }
            else
                this.outgoingQueueLengthGrowthCount = 0;
            this.previousOutgoingQueueLength = actions.length;
            for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
                var action = actions_1[_i];
                this.emit.apply(this, [action.method].concat(action.args));
            }
        };
        HubService.prototype.detachAllHandlers = function () {
            for (var eventName in this.invokeHandlers)
                for (var handlers in this.invokeHandlers[eventName])
                    this.hubProxy.off(eventName, this.invokeHandlers[eventName][handlers].managedHandler);
            this.invokeHandlers = {};
        };
        return HubService;
    }());
    Services.HubService = HubService;
    var TextChatHubService = (function (_super) {
        __extends(TextChatHubService, _super);
        function TextChatHubService($q, $log, $timeout, connection) {
            var _this = _super.call(this, $q, $log, $timeout, connection, "TextChatHub") || this;
            _this.pingInterval = null;
            _this.pingIntervalDuration = 15 * 1000;
            _this.awaitingPong = false;
            _this.onAddInitialMessages = function (callback) { return _super.prototype.on.call(_this, "AddInitialMessages", callback); };
            _this.onAddInitialUsers = function (callback) { return _super.prototype.on.call(_this, "AddInitialUsers", callback); };
            _this.onAddInitialUsersTo = function (callback) { return _super.prototype.on.call(_this, "AddInitialUsersTo", callback); };
            _this.onAddMessage = function (callback) { return _super.prototype.on.call(_this, "AddMessage", callback); };
            _this.onAddPrivateChatStatus = function (callback) { return _super.prototype.on.call(_this, "AddPrivateChatStatus", callback); };
            _this.onAddUser = function (callback) { return _super.prototype.on.call(_this, "AddUser", callback); };
            _this.onAddUserTo = function (callback) { return _super.prototype.on.call(_this, "AddUserTo", callback); };
            _this.onAudioCallConnected = function (callback) { return _super.prototype.on.call(_this, "AudioCallConnected", callback); };
            _this.onCancelAudioCall = function (callback) { return _super.prototype.on.call(_this, "CancelAudioCall", callback); };
            _this.onDeclineAudioCall = function (callback) { return _super.prototype.on.call(_this, "DeclineAudioCall", callback); };
            _this.onHangoutAudioCall = function (callback) { return _super.prototype.on.call(_this, "HangoutAudioCall", callback); };
            _this.onMarkUserAsTyping = function (callback) { return _super.prototype.on.call(_this, "MarkUserAsTyping", callback); };
            _this.onPrivateChatRequestResponse = function (callback) { return _super.prototype.on.call(_this, "PrivateChatRequestResponse", callback); };
            _this.onRemoveUser = function (callback) { return _super.prototype.on.call(_this, "RemoveUser", callback); };
            _this.onRemoveUserFrom = function (callback) { return _super.prototype.on.call(_this, "RemoveUserFrom", callback); };
            _this.onRequestAudioCall = function (callback) { return _super.prototype.on.call(_this, "RequestAudioCall", callback); };
            _this.onSetInitialCountOfUsers = function (callback) { return _super.prototype.on.call(_this, "SetInitialCountOfUsers", callback); };
            _this.onSetUserIdle = function (callback) { return _super.prototype.on.call(_this, "SetUserIdle", callback); };
            _this.onUnmarkUserAsTyping = function (callback) { return _super.prototype.on.call(_this, "UnmarkUserAsTyping", callback); };
            _this.onUpdateCountOfUsers = function (callback) { return _super.prototype.on.call(_this, "UpdateCountOfUsers", callback); };
            _this.onLeaveRoom = function (callback) { return _super.prototype.on.call(_this, "LeaveRoom", callback); };
            _this.ping = function (orderId) { return _super.prototype.emit.call(_this, "Ping", orderId); };
            _this.requestResend = function (orderIds) { return _super.prototype.emit.call(_this, "RequestResend", orderIds); };
            _this.audioCallConnected = function (roomId) { return _super.prototype.emit.call(_this, "AudioCallConnected", roomId); };
            _this.blockPrivateChat = function (bool) { return _super.prototype.emit.call(_this, "BlockPrivateChat", bool); };
            _this.cancelAudioCall = function (roomId) { return _super.prototype.emit.call(_this, "CancelAudioCall", roomId); };
            _this.declineAudioCall = function (roomId, reason) { return _super.prototype.emit.call(_this, "DeclineAudioCall", roomId, reason); };
            _this.hangoutAudioCall = function (roomId) { return _super.prototype.emit.call(_this, "HangoutAudioCall", roomId); };
            _this.ignoreChatInvite = function (userId) { return _super.prototype.emit.call(_this, "IgnoreChatInvite", userId); };
            _this.subscribeToRoom = function (roomId) { return _super.prototype.emit.call(_this, "JoinRoom", roomId); };
            _this.leaveRoom = function (roomId) { return _super.prototype.emit.call(_this, "LeaveRoom", roomId); };
            _this.markAllCaughtUp = function (userId) { return _super.prototype.emit.call(_this, "MarkAllCaughtUp", userId); };
            _this.postChatEventTo = function (roomId, event, userId) { return _super.prototype.emit.call(_this, "PostChatEventTo", roomId, event, userId); };
            _this.postTo = function (roomId, message) { return _super.prototype.emit.call(_this, "PostTo", roomId, message); };
            _this.requestAudioCall = function (roomId) { return _super.prototype.emit.call(_this, "RequestAudioCall", roomId); };
            _this.requestPrivateChat = function (userId) { return _super.prototype.emit.call(_this, "RequestPrivateChat", userId); };
            _this.setTypingActivityIn = function (roomId) { return _super.prototype.emit.call(_this, "SetTypingActivityIn", roomId); };
            _this.setUserActive = function () { return _super.prototype.emit.call(_this, "SetUserActive"); };
            _this.connection.eventStarted.on(function () { return _this.awaitingPong = false; });
            _this.pingInterval = setInterval(function () {
                if (_this.awaitingPong) {
                    _this.$log.signalRWarn("MissingAwaitedPong");
                    _this.awaitingPong = false;
                }
                if (_this.connection.state === Services.ServerSocketState.Connected) {
                    _this.ping(_this.expectedCallOrderId - 1);
                    _this.awaitingPong = true;
                }
            }, _this.pingIntervalDuration);
            _super.prototype.on.call(_this, "Pong", _this.onPong);
            return _this;
        }
        TextChatHubService.prototype.detachAllHandlers = function () {
            _super.prototype.detachAllHandlers.call(this);
            clearInterval(this.pingInterval);
        };
        TextChatHubService.prototype.onPong = function (lastQueuedOrderId) {
            var _this = this;
            this.awaitingPong = false;
            var isAvail = function (orderId) { return _this.queuedIncomingActions.some(function (action) { return action.orderId === orderId; }); };
            var orderIds = (function (n, p) {
                var a = [];
                for (; n <= p; n++)
                    if (!isAvail(n))
                        a.push(n);
                return a;
            })(this.expectedCallOrderId, lastQueuedOrderId);
            if (orderIds.length !== 0)
                this.requestResend(orderIds);
        };
        TextChatHubService.$inject = ["$q", "$log", "$timeout", "serverConnectionService"];
        return TextChatHubService;
    }(HubService));
    Services.TextChatHubService = TextChatHubService;
    var VoiceChatHubService = (function (_super) {
        __extends(VoiceChatHubService, _super);
        function VoiceChatHubService($q, $log, $timeout, connection) {
            var _this = _super.call(this, $q, $log, $timeout, connection, "VoiceChatHub") || this;
            _this.getSessionid = function () { return _this.connection.sessionId; };
            _this.disconnect = null;
            return _this;
        }
        VoiceChatHubService.prototype.on = function (hubAction, callback) { _super.prototype.on.call(this, hubAction, callback); return this; };
        VoiceChatHubService.prototype.emit = function (hubAction) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return _super.prototype.emit.apply(this, [hubAction].concat(args));
        };
        VoiceChatHubService.$inject = ["$q", "$log", "$timeout", "serverConnectionService"];
        return VoiceChatHubService;
    }(HubService));
    Services.VoiceChatHubService = VoiceChatHubService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var RtcService = (function () {
        function RtcService($q, $document, $log, serverConnection, voiceChatHub) {
            var _this = this;
            this.$q = $q;
            this.$document = $document;
            this.$log = $log;
            this.serverConnection = serverConnection;
            this.voiceChatHub = voiceChatHub;
            this.hasBrowserCapabilities = function () { return navigator && navigator.mediaDevices && window.RTCPeerConnection && !_this.isMicAbsent; };
        }
        RtcService.prototype.checkCapabilities = function () {
            var _this = this;
            var deferred = this.$q.defer();
            if (this.isMicAbsent)
                deferred.reject("device");
            else if (!this.hasBrowserCapabilities())
                deferred.reject("browser");
            else if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    var mics = devices.filter(function (device) { return device.kind === "audioinput"; });
                    _this.isMicAbsent = !mics.length;
                    if (_this.isMicAbsent)
                        deferred.reject("device");
                    deferred.resolve();
                });
            }
            else
                deferred.resolve();
            return deferred.promise;
        };
        RtcService.prototype.init = function (caller) {
            var _this = this;
            this.initRtcDeferred = this.$q.defer();
            this.initSimpleWebRtc();
            this.serverConnection.start().then(function () { return _this.voiceChatHub.emit("init", _this.roomId, caller); }, function (err) { return _this.initRtcDeferred.reject(err); });
            return this.initRtcDeferred.promise;
        };
        RtcService.prototype.startRoomAudioCall = function (roomId, onPeerCreatedCallback, caller) {
            var _this = this;
            this.$log.appInfo("StartingRoomAudioCall", { roomId: roomId });
            this.onPeerCreatedCallback = onPeerCreatedCallback;
            this.callDeferred = this.$q.defer();
            this.callDeferred.promise.catch(function (err) {
                _this.$log.appWarn("StartRoomAudioCallPromiseFailed");
                _this.stopAudioCall("unsupported_" + err);
                return _this.$q.reject(err);
            });
            this.roomId = roomId;
            this.checkCapabilities()
                .then(function () { return _this.init(caller); }, function (reason) {
                _this.$log.appError("CheckCapabilitiesFailed", { reason: reason });
                _this.callDeferred.reject(reason);
                return _this.$q.reject(reason);
            })
                .then(function () {
                _this.$log.appInfo("StartingLocalVideo");
                _this.rtc.startLocalVideo();
            });
            return this.callDeferred.promise;
        };
        RtcService.prototype.initSimpleWebRtc = function () {
            var _this = this;
            if (!this.rtc)
                this.rtc = new SimpleWebRTC({
                    debug: true,
                    connection: this.voiceChatHub,
                    localVideoEl: "", remoteVideosEl: "",
                    media: { audio: true, video: false },
                    receiveMedia: { offerToReceiveAudio: 1, offerToReceiveVideo: 0 }
                })
                    .on("iceFailed", function (peer) { return _this.$log.appError("iceFailed"); })
                    .on("connectivityError", function (peer) { return _this.$log.appError("connectivityError"); })
                    .on("connectionReady", function () { return _this.initRtcDeferred.resolve(); })
                    .on("readyToCall", function () {
                    _this.$log.appInfo("ReadyToCallReceived");
                    _this.rtc.joinRoom(_this.roomId, function (err, res) {
                        if (err && _this.callDeferred) {
                            _this.$log.appWarn("JoinRoomReturnedError", { err: err });
                            _this.callDeferred.reject("join");
                        }
                        else if (_this.callDeferred) {
                            _this.$log.appInfo("JoinRoomCompleted", { err: err });
                            _this.callDeferred.resolve(res);
                        }
                    });
                })
                    .on("localMediaError", function (err) {
                    if (_this.callDeferred)
                        _this.callDeferred.reject("device");
                    _this.$log.appWarn("RtcLocalMediaError", { error: err.name || err });
                })
                    .on("localStream", function (stream) { return _this.localAudioTrack = stream.getAudioTracks()[0]; })
                    .on("createdPeer", function (peer) {
                    if (!peer || !peer.pc)
                        return;
                    if (_this.onPeerCreatedCallback)
                        _this.onPeerCreatedCallback(peer);
                });
        };
        RtcService.prototype.stopAudioCall = function (reason) {
            var _this = this;
            if (reason === void 0) { reason = "hangout"; }
            this.$log.appInfo("StoppingAudioCall", { reason: reason });
            var deferred = this.$q.defer();
            if (!this.rtc)
                deferred.resolve();
            else
                this.voiceChatHub.emit("callFinished", this.roomId, reason, function () {
                    _this.$log.appInfo("CallFinishedReceived");
                    _this.rtc.leaveRoom();
                    _this.rtc.stopLocalVideo();
                    _this.localAudioTrack = null;
                    _this.roomId = null;
                    deferred.resolve();
                });
            return deferred.promise;
        };
        RtcService.$inject = ["$q", "$document", "$log", "serverConnectionService", "voiceHubService"];
        return RtcService;
    }());
    Services.RtcService = RtcService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var SpinnerService = (function () {
        function SpinnerService() {
            this.showSpinner = {
                show: false
            };
        }
        return SpinnerService;
    }());
    Services.SpinnerService = SpinnerService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var TextChatRoomsService = (function () {
        function TextChatRoomsService($cookies, userService) {
            var _this = this;
            this.$cookies = $cookies;
            this.userService = userService;
            this.privateRoomIdFrom = function (partnerId) { return partnerId < _this.localUser.id ? partnerId + "-" + _this.localUser.id : _this.localUser.id + "-" + partnerId; };
            this.partnerIdFrom = function (privateRoomId) {
                var userIds = privateRoomId.split("-").map(function (userId) { return Number(userId); });
                return _this.localUser.id === userIds[0] ? userIds[1] : userIds[0];
            };
            this.validatePrivateRoomId = function (roomId) {
                try {
                    var partnerId = _this.partnerIdFrom(roomId);
                    return !isNaN(partnerId) && partnerId !== _this.localUser.id && _this.privateRoomIdFrom(partnerId) === roomId;
                }
                catch (e) {
                    return false;
                }
            };
        }
        Object.defineProperty(TextChatRoomsService.prototype, "rooms", {
            get: function () { return this.chatRooms; },
            enumerable: true,
            configurable: true
        });
        TextChatRoomsService.prototype.initiateRoomService = function () {
            this.chatRooms = {};
            this.localUser = this.userService.getUser();
        };
        TextChatRoomsService.prototype.addRoom = function (roomModel) {
            this.addRoomIdToCookies(roomModel);
            return this.chatRooms[roomModel.roomId] = roomModel;
        };
        TextChatRoomsService.prototype.deleteRoom = function (roomId) {
            delete this.chatRooms[roomId];
            this.removeRoomIdFromCookies(roomId);
        };
        TextChatRoomsService.prototype.getRoomsFromPreviousSession = function () {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            var cookiedRooms = angular.fromJson(cookieValue);
            return cookiedRooms ? cookiedRooms : {};
        };
        TextChatRoomsService.prototype.addRoomIdToCookies = function (room) {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            var cookiedRooms = cookieValue ? angular.fromJson(cookieValue) : {};
            cookiedRooms[room.roomId] = {
                stateName: room.state,
                text: room.text
            };
            this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
        };
        TextChatRoomsService.prototype.removeRoomIdFromCookies = function (roomId) {
            var cookieValue = this.$cookies.get(Config.CookieNames.roomsFromPreviousSession);
            if (!cookieValue)
                return;
            var cookiedRooms = angular.fromJson(cookieValue);
            delete cookiedRooms[roomId];
            this.$cookies.put(Config.CookieNames.roomsFromPreviousSession, angular.toJson(cookiedRooms));
        };
        TextChatRoomsService.$inject = ["$cookies", "userService"];
        return TextChatRoomsService;
    }());
    Services.TextChatRoomsService = TextChatRoomsService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var StatesService = (function () {
        function StatesService($rootScope, $state, $stateParams, $stickyState, $templateCache, $log, $deepStateRedirect, userService, $cookies) {
            var _this = this;
            this.$rootScope = $rootScope;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$stickyState = $stickyState;
            this.$templateCache = $templateCache;
            this.$log = $log;
            this.$deepStateRedirect = $deepStateRedirect;
            this.userService = userService;
            this.$cookies = $cookies;
            this.stateNamesHistory = [];
            this.$rootScope.$on("$stateChangeSuccess", function (event, toState) {
                _this.stateNamesHistory.push(toState.name);
                if (_this.stateNamesHistory.length > 100)
                    _this.stateNamesHistory.shift();
            });
        }
        StatesService.prototype.resetAllStates = function () {
            var _this = this;
            this.userService.clearUserData();
            this.$stickyState.reset("*");
            angular.forEach(States, function (state) {
                if (state.isRemoteTemplate)
                    _this.$templateCache.remove(state.templateUrl);
            });
        };
        StatesService.prototype.getStateParams = function () {
            return this.$stateParams;
        };
        StatesService.prototype.getStateCopyByName = function (name) {
            for (var key in States) {
                if (States.hasOwnProperty(key)) {
                    var state = States[key];
                    if (state.name === name) {
                        return angular.copy(state);
                    }
                }
            }
            return undefined;
        };
        StatesService.prototype.resetState = function (stateName) {
            var stateToReset = this.getStateCopyByName(stateName);
            this.$stickyState.reset(stateName);
            this.$deepStateRedirect.reset(stateName);
            if (stateToReset.isRemoteTemplate)
                this.$templateCache.remove(stateToReset.templateUrl);
        };
        StatesService.prototype.closeState = function (stateNameToClose) {
            var _this = this;
            var currentStateName = this.$state.current.name;
            var destinationStateName = States.home.name;
            var destinitionStateParams = {};
            var inactiveStates = this.$stickyState.getInactiveStates();
            for (var i = this.stateNamesHistory.length; i-- > 0;) {
                var candidateStateName = this.stateNamesHistory[i], found = false;
                angular.forEach(inactiveStates, function (inactiveState) {
                    if (candidateStateName.indexOf(stateNameToClose) == -1 && (candidateStateName === inactiveState.name || candidateStateName === currentStateName)) {
                        found = true;
                        destinitionStateParams = inactiveState.locals.globals.$stateParams;
                    }
                });
                if (found) {
                    destinationStateName = candidateStateName;
                    break;
                }
            }
            this.removeStateFromCookies(stateNameToClose);
            if (this.$state.includes(destinationStateName)) {
                this.$log.appInfo("ClosingStateImmediately", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                this.resetState(stateNameToClose);
            }
            else {
                this.$log.appInfo("ClosingStateInitiated", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                var successListener = this.$rootScope.$on("$stateChangeSuccess", function () {
                    successListener();
                    if (_this.$state.includes(destinationStateName)) {
                        _this.resetState(stateNameToClose);
                        _this.$log.appInfo("ClosingStateCompleted", { stateNameToClose: stateNameToClose, destinationStateName: destinationStateName });
                    }
                    else {
                        _this.$log.appError("ClosingStateFailedOnDestStateMismatch", { currentState: _this.$state.current.name, expectedState: destinationStateName });
                    }
                });
                var failureListener = this.$rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
                    failureListener();
                    _this.$log.appError("ClosingStateFailedOnStateChangeError", { from: fromState.name, to: toState.name, error: error });
                });
                this.$state.go(destinationStateName, destinitionStateParams);
            }
        };
        StatesService.prototype.go = function (to, params, options) { return this.$state.go(to, params, options); };
        StatesService.prototype.goAndReload = function (to, params) { return this.$state.go(to, params, { reload: true }); };
        StatesService.prototype.reload = function () { return this.$state.reload(); };
        Object.defineProperty(StatesService.prototype, "current", {
            get: function () { return this.$state.current; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(StatesService.prototype, "params", {
            get: function () { return this.$stateParams; },
            enumerable: true,
            configurable: true
        });
        ;
        StatesService.prototype.includes = function (state, params) { return this.$state.includes(state, params); };
        StatesService.prototype.is = function (state, params) { return this.$state.is(state, params); };
        StatesService.prototype.get = function (state, context) { return this.$state.get(state, context); };
        StatesService.prototype.href = function (state, params, options) { return this.$state.href(state, params, params); };
        StatesService.prototype.removeStateFromCookies = function (stateNameToClose) {
            var cookiesString = this.$cookies.get(Config.CookieNames.lastStates);
            if (!cookiesString)
                return;
            var stateNameParts = stateNameToClose.split(".");
            var statesInCookies = angular.fromJson(cookiesString);
            var stateNameIndx = statesInCookies.indexOf(stateNameParts[1]);
            if (stateNameIndx !== -1) {
                statesInCookies.splice(stateNameIndx, 1);
                this.$cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
            }
        };
        StatesService.$inject = ["$rootScope", "$state", "$stateParams", "$stickyState", "$templateCache", "$log", "$deepStateRedirect", "userService", "$cookies"];
        return StatesService;
    }());
    Services.StatesService = StatesService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    function translationErrorsHandlerService($log) {
        return function (translationId) {
            $log.appError("MissedTranslationResource", { missedTranslationId: translationId });
        };
    }
    Services.translationErrorsHandlerService = translationErrorsHandlerService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalSelectLanguageController = (function () {
        function ModalSelectLanguageController($scope, $uibModalInstance, serverResources, currentId) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.currentId = currentId;
            this.languages = Languages.langsById;
            this.languageSelect = { selectedId: undefined, blockedId: undefined };
            this.languageSelect.selectedId = currentId;
            serverResources.getSelectLangResources().then(function (translate) { _this.moreLabel = translate; });
        }
        Object.defineProperty(ModalSelectLanguageController.prototype, "secondTierButtonLabel", {
            get: function () {
                var id = this.languageSelect.selectedId;
                return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? this.languages[id].text : this.moreLabel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModalSelectLanguageController.prototype, "selectSecondTierClass", {
            get: function () {
                var id = this.languageSelect.selectedId;
                return id !== undefined && this.languages[id] && this.languages[id].tier > 1 ? "active" : undefined;
            },
            enumerable: true,
            configurable: true
        });
        ModalSelectLanguageController.prototype.secondTierLangFilter = function (value) { return value.tier > 1; };
        ;
        ModalSelectLanguageController.prototype.onSelect = function (langId) {
            this.$uibModalInstance.close(langId);
        };
        ModalSelectLanguageController.prototype.clear = function () {
            this.$uibModalInstance.close(undefined);
        };
        ModalSelectLanguageController.$inject = ["$scope", "$uibModalInstance", "serverResources", "currentId"];
        return ModalSelectLanguageController;
    }());
    Services.ModalSelectLanguageController = ModalSelectLanguageController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalSelectLanguageService = (function () {
        function ModalSelectLanguageService($uibModal, $q, $log) {
            this.$uibModal = $uibModal;
            this.$q = $q;
            this.$log = $log;
            this.modalCssClass = "lang-select-modal";
        }
        ModalSelectLanguageService.prototype.getLanguage = function (currentId, elementOrCssClass) {
            var _this = this;
            var cssClass = angular.isString(elementOrCssClass) ? elementOrCssClass : "";
            var modalDefferal = this.$q.defer();
            var modalResult = this.$uibModal.open({
                templateUrl: "select-language-service-modal.tpl",
                controller: Services.ModalSelectLanguageController,
                controllerAs: "modalSelect",
                resolve: { currentId: function () { return currentId; } },
                windowTopClass: this.modalCssClass + " " + cssClass,
                backdrop: true
            });
            if (!cssClass && elementOrCssClass) {
                var $element = elementOrCssClass;
                modalResult.rendered.then(function () {
                    var boundElOffset = $element.offset(), boundElHeight = $element.outerHeight(), modal = $("." + _this.modalCssClass + " .modal-dialog");
                    var documentScrollTop = document.documentElement.scrollTop
                        || document.body.scrollTop;
                    var modalTop = boundElOffset.top + boundElHeight - documentScrollTop + 10;
                    if (document.body.clientHeight < modalTop + modal.outerHeight())
                        modalTop = boundElOffset.top - modal.outerHeight() - documentScrollTop - 10;
                    modal.css({ marginTop: "0", top: modalTop + "px" });
                });
            }
            this.resolveModalData(modalResult, modalDefferal, currentId);
            return modalDefferal.promise;
        };
        ModalSelectLanguageService.prototype.resolveModalData = function (modalResult, deffered, curentId) {
            modalResult.result.then(function (languageId) {
                deffered.resolve(languageId);
            }, function () {
                deffered.resolve(curentId);
            });
        };
        ModalSelectLanguageService.$inject = ["$uibModal", "$q", "$log", "$window"];
        return ModalSelectLanguageService;
    }());
    Services.ModalSelectLanguageService = ModalSelectLanguageService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var EmailIsNotConfirmedModalController = (function () {
        function EmailIsNotConfirmedModalController($uibModalInstance, $state, userService) {
            this.$uibModalInstance = $uibModalInstance;
            this.$state = $state;
            this.userService = userService;
            this.verificationEmailSent = false;
            this.verificationEmailSentFail = false;
            this.emailAddress = userService.getUser().email;
        }
        EmailIsNotConfirmedModalController.prototype.resendEmail = function () {
            var _this = this;
            this.verificationEmailSent = true;
            this.userService.resendEmailVerification().then(function (isSent) {
                _this.verificationEmailSentFail = !isSent;
            });
        };
        EmailIsNotConfirmedModalController.prototype.goToProfile = function () {
            this.$state.go(States.profile.name);
            this.$uibModalInstance.close(true);
        };
        EmailIsNotConfirmedModalController.$inject = ["$uibModalInstance", "$state", "userService"];
        return EmailIsNotConfirmedModalController;
    }());
    Services.EmailIsNotConfirmedModalController = EmailIsNotConfirmedModalController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalWindowService = (function () {
        function ModalWindowService($uibModal, $q, $state) {
            this.$uibModal = $uibModal;
            this.$q = $q;
            this.$state = $state;
        }
        ModalWindowService.prototype.open = function (messageHtml, modalButtons, staticBackdrop) {
            if (staticBackdrop === void 0) { staticBackdrop = true; }
            var modalDefferal = this.$q.defer();
            var modalResult = this.$uibModal.open({
                templateUrl: "modal-window-service.tpl",
                controller: Services.ModalWindowServiceController,
                controllerAs: "modal",
                backdrop: staticBackdrop ? "static" : true,
                keyboard: true,
                resolve: {
                    message: function () { return messageHtml; },
                    buttons: function () { return modalButtons; }
                }
            });
            this.resolveModalData(modalResult, modalDefferal);
            return modalDefferal.promise;
        };
        ModalWindowService.prototype.openEmailIsNotConfirmModal = function () {
            var _this = this;
            var modalDefferal = this.$q.defer();
            this.$uibModal.open({
                templateUrl: "modal-email-not-confirmed.tpl",
                controller: Services.EmailIsNotConfirmedModalController,
                controllerAs: "modal",
                keyboard: true
            })
                .result.then(function () {
                modalDefferal.resolve();
            }, function () {
                if (_this.$state.is(States.emailNotConfirmed.name))
                    _this.$state.go(States.home.name);
                modalDefferal.resolve();
            });
            return modalDefferal.promise;
        };
        ModalWindowService.prototype.resolveModalData = function (modalResult, deffered) {
            modalResult.result.then(function (isConfirmed) {
                deffered.resolve(isConfirmed);
            }, function (errorData) {
                deffered.resolve(false);
            });
        };
        ModalWindowService.$inject = ["$uibModal", "$q", "$state"];
        return ModalWindowService;
    }());
    Services.ModalWindowService = ModalWindowService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ModalWindowServiceController = (function () {
        function ModalWindowServiceController($scope, $uibModalInstance, serverResources, message, buttons) {
            var _this = this;
            this.$uibModalInstance = $uibModalInstance;
            this.message = message;
            this.buttons = buttons;
            this.defaultButtons = [
                {
                    label: "Cancel",
                    cssClass: "btn btn-toggle",
                    result: false
                },
                {
                    label: "OK",
                    cssClass: "btn btn-success",
                    result: true
                }
            ];
            if (!buttons || buttons.length === 0) {
                serverResources.getModalWindowResourcrs().then(function (translates) {
                    _this.defaultButtons[0].label = translates.cancel;
                    _this.defaultButtons[1].label = translates.ok;
                });
                this.buttons = this.defaultButtons;
            }
            else {
                this.buttons = buttons.reverse();
            }
        }
        ModalWindowServiceController.prototype.buttonClick = function (buttonIndex) {
            var clickedButton = this.buttons[buttonIndex];
            if (clickedButton.callBackFn && typeof (clickedButton.callBackFn) === "function") {
                clickedButton.callBackFn();
            }
            this.$uibModalInstance.close(clickedButton.result);
        };
        ModalWindowServiceController.$inject = ["$scope", "$uibModalInstance", "serverResources", "message", "buttons"];
        return ModalWindowServiceController;
    }());
    Services.ModalWindowServiceController = ModalWindowServiceController;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var ServerResourcesProvider = (function () {
        function ServerResourcesProvider() {
            this.$get = ["$q", "$translate", function ($q, $translate) { return new ServerResourcesService($q, $translate); }];
        }
        ServerResourcesProvider.prototype.setupTranslationService = function ($translateProvider) {
            var translations = this.getTranslateResourcesFromHtml();
            $translateProvider
                .translations("en", translations)
                .useMissingTranslationHandler("translationErrorsHandler")
                .preferredLanguage("en")
                .useSanitizeValueStrategy(null);
        };
        ServerResourcesProvider.prototype.getTranslateResourcesFromHtml = function () {
            return angular.fromJson(document.getElementById("tranlsation-json").innerText);
        };
        return ServerResourcesProvider;
    }());
    Services.ServerResourcesProvider = ServerResourcesProvider;
    var ServerResourcesService = (function () {
        function ServerResourcesService($q, $translate) {
            this.$q = $q;
            this.$translate = $translate;
            this.buttonsResourcesPrefix = "buttons";
            this.textChatResourcesPrefix = "textChat";
            this.editProfileResourcesPrefix = "editProfile";
            this.siteResourcesPrefix = "site";
            this.responceCodes = {};
            this.months = {};
            this.countries = {};
            this.responceCodes[2] = "messages.emailInUse";
            this.responceCodes[1] = "messages.entriesAreInvalid";
            this.responceCodes[0] = "messages.hellolingoUpdated";
            this.responceCodes[6] = "messages.incorrectPassword";
            this.responceCodes[5] = "messages.provideStrongerPassword";
            this.responceCodes[4] = "messages.tryAgain";
            this.responceCodes[3] = "messages.verifyPassword";
        }
        ServerResourcesService.prototype.getServerResponseText = function (code) {
            var defer = this.$q.defer();
            this.$translate(this.responceCodes[code]).then(function (translate) {
                defer.resolve(translate);
            });
            return defer.promise;
        };
        ;
        ServerResourcesService.prototype.getMonths = function () {
            var months = [];
            for (var i = 1; i < 13; i++)
                months[i] = { id: i, text: this.months[i] };
            return months;
        };
        ServerResourcesService.prototype.getCountries = function () {
            var countries = [];
            for (var country in this.countries) {
                countries[country] = this.countries[country];
            }
            countries[100].displayOrder = 1;
            countries[101].displayOrder = 2;
            countries[104].displayOrder = 3;
            countries[108].displayOrder = 4;
            countries[111].displayOrder = 5;
            countries[107].displayOrder = 6;
            countries[109].displayOrder = 7;
            countries[127].displayOrder = 8;
            countries[123].displayOrder = 9;
            countries[113].displayOrder = 10;
            return countries;
        };
        ServerResourcesService.prototype.resolveTranslationsAsync = function () {
            this.resloveMonths();
            this.resolveCountries();
            this.resolveLanguageFilterResource();
        };
        ServerResourcesService.prototype.getProfileResources = function () {
            var translateResources = [
                this.editProfileResourcesPrefix + ".profileUpdated",
                this.buttonsResourcesPrefix + ".ok"
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var profileResources = {};
                profileResources.profileUpdated = translates[translateResources[0]];
                profileResources.ok = translates[translateResources[1]];
                defer.resolve(profileResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getSelectLangResources = function () {
            var defer = this.$q.defer();
            this.$translate(this.siteResourcesPrefix + ".more").then(function (translate) {
                defer.resolve(translate);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getModalWindowResourcrs = function () {
            var defer = this.$q.defer();
            var translateResources = [this.buttonsResourcesPrefix + ".cancel", this.buttonsResourcesPrefix + ".ok"];
            this.$translate(translateResources).then(function (translate) {
                var modalWindowResources = {};
                modalWindowResources.ok = translate[translateResources[0]];
                modalWindowResources.cancel = translate[translateResources[1]];
                defer.resolve(modalWindowResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getLanguagesFilter = function () {
            return this.languageFilterTranslation;
        };
        ServerResourcesService.prototype.getAccountValidationErrors = function () {
            var translateResources = [
                this.siteResourcesPrefix + ".defaultAccountError",
                this.siteResourcesPrefix + ".passwordLengthErrorMsg",
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translates) {
                var profileResources = {};
                profileResources.defaultError = translates[translateResources[0]];
                profileResources.passwordMinError = translates[translateResources[1]];
                profileResources.passwordMaxError = translates[translateResources[1]];
                defer.resolve(profileResources);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.getAudioChatResources = function () {
            var translateResources = [
                this.textChatResourcesPrefix + ".audio.busy",
                this.textChatResourcesPrefix + ".audio.unsupportedDevice",
                this.textChatResourcesPrefix + ".audio.unsupportedBrowser",
                this.textChatResourcesPrefix + ".audio.unsupportedJoin",
                this.textChatResourcesPrefix + ".audio.declineUnsupportedDevice",
                this.textChatResourcesPrefix + ".audio.declineUnsupportedBrowser",
                this.textChatResourcesPrefix + ".audio.declineBusy",
                this.textChatResourcesPrefix + ".audio.peerDeclined",
                this.textChatResourcesPrefix + ".audio.peerUnsupported",
                this.textChatResourcesPrefix + ".audio.peerBusy",
                this.textChatResourcesPrefix + ".audio.hangout",
                this.textChatResourcesPrefix + ".audio.peerHangout",
                this.textChatResourcesPrefix + ".audio.peerDisconnected",
                this.textChatResourcesPrefix + ".audio.youreConnected"
            ];
            var defer = this.$q.defer();
            this.$translate(translateResources).then(function (translate) {
                var translation = {
                    busy: translate[translateResources[0]],
                    unsupportedDevice: translate[translateResources[1]],
                    unsupportedBrowser: translate[translateResources[2]],
                    unsupportedJoin: translate[translateResources[3]],
                    declineUnsupportedDevice: translate[translateResources[4]],
                    declineUnsupportedBrowser: translate[translateResources[5]],
                    declineBusy: translate[translateResources[6]],
                    peerDeclined: translate[translateResources[7]],
                    peerUnsupported: translate[translateResources[8]],
                    peerBusy: translate[translateResources[9]],
                    hangout: translate[translateResources[10]],
                    peerHangout: translate[translateResources[11]],
                    peerDisconnected: translate[translateResources[12]],
                    youreConnected: translate[translateResources[13]]
                };
                defer.resolve(translation);
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.resloveMonths = function () {
            var _this = this;
            var monthNumbers = ["months.month1", "months.month2", "months.month3", "months.month4", "months.month5", "months.month6", "months.month7", "months.month8", "months.month9", "months.month10", "months.month11", "months.month12"];
            var defer = this.$q.defer();
            this.$translate(monthNumbers).then(function (translate) {
                for (var i = 1; i < 13; i++) {
                    _this.months[i] = translate["months.month" + i];
                }
                defer.resolve();
            });
            return defer.promise;
        };
        ServerResourcesService.prototype.resolveCountries = function () {
            var countries = angular.element.parseJSON(document.getElementById("countries-json").innerText);
            for (var code in countries) {
                var countryCode = Number(code.substring(1));
                this.countries[countryCode] = {
                    id: countryCode,
                    text: countries[code]
                };
            }
        };
        ServerResourcesService.prototype.resolveLanguageFilterResource = function () {
            var _this = this;
            var defer = this.$q.defer();
            this.$translate(this.siteResourcesPrefix + ".languageFilter").then(function (translate) {
                _this.languageFilterTranslation = translate;
                defer.resolve();
            });
            return defer.promise;
        };
        ServerResourcesService.$inject = ["$q", "$translate"];
        return ServerResourcesService;
    }());
    Services.ServerResourcesService = ServerResourcesService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var Counters;
    (function (Counters) {
        Counters[Counters["TextChat"] = 1] = "TextChat";
        Counters[Counters["MailBox"] = 2] = "MailBox";
    })(Counters = Services.Counters || (Services.Counters = {}));
})(Services || (Services = {}));
var Services;
(function (Services) {
    var TaskbarCounterService = (function () {
        function TaskbarCounterService() {
            this.counters = {};
            this.counters[Services.Counters.TextChat] = 0;
            this.counters[Services.Counters.MailBox] = 0;
        }
        TaskbarCounterService.prototype.setCounterValue = function (counter, value) {
            this.counters[counter] = value;
        };
        TaskbarCounterService.prototype.getCounterValue = function (counter) {
            return this.counters[counter];
        };
        TaskbarCounterService.prototype.resetCounter = function (counter) {
            this.counters[counter] = 0;
        };
        return TaskbarCounterService;
    }());
    Services.TaskbarCounterService = TaskbarCounterService;
})(Services || (Services = {}));
var Services;
(function (Services) {
    var TextChatSettingsCtrl = (function () {
        function TextChatSettingsCtrl(settings, $uibModalInstance, $log, textHubService) {
            this.settings = settings;
            this.$uibModalInstance = $uibModalInstance;
            this.$log = $log;
            this.textHubService = textHubService;
            this.initValues = angular.copy(settings);
        }
        TextChatSettingsCtrl.prototype.toggleSettings = function (type) {
            switch (type) {
                case TextChatSettingsType.AudioNotification:
                    this.settings.isAudioNotificationOn = !this.settings.isAudioNotificationOn;
                    break;
                case TextChatSettingsType.PrivateChat:
                    this.settings.isPrivateChatOn = !this.settings.isPrivateChatOn;
                    break;
                default:
                    this.$log.appWarn("UnexpectedTextChatSettingType", type);
                    break;
            }
        };
        TextChatSettingsCtrl.prototype.onDoneClick = function () {
            if (this.initValues.isPrivateChatOn !== this.settings.isPrivateChatOn)
                this.textHubService.blockPrivateChat(!this.settings.isPrivateChatOn);
            this.$uibModalInstance.close(this.settings);
        };
        TextChatSettingsCtrl.$inject = ["settings", "$uibModalInstance", "$log", "textHubService"];
        return TextChatSettingsCtrl;
    }());
    Services.TextChatSettingsCtrl = TextChatSettingsCtrl;
    var TextChatSettingsType;
    (function (TextChatSettingsType) {
        TextChatSettingsType[TextChatSettingsType["AudioNotification"] = 1] = "AudioNotification";
        TextChatSettingsType[TextChatSettingsType["PrivateChat"] = 2] = "PrivateChat";
    })(TextChatSettingsType || (TextChatSettingsType = {}));
})(Services || (Services = {}));
var Services;
(function (Services) {
    var TextChatSettingsService = (function () {
        function TextChatSettingsService($q, $uibModal) {
            this.$q = $q;
            this.$uibModal = $uibModal;
        }
        TextChatSettingsService.prototype.openSettings = function (settings) {
            var defer = this.$q.defer();
            var settingsResult = this.$uibModal.open({
                templateUrl: "text-chat-settings.tpl",
                controller: Services.TextChatSettingsCtrl,
                controllerAs: "settings",
                resolve: { settings: function () { return settings; } }
            });
            settingsResult.result.then(function (settings) {
                defer.resolve(settings);
            });
            return defer.promise;
        };
        TextChatSettingsService.$inject = ["$q", "$uibModal"];
        return TextChatSettingsService;
    }());
    Services.TextChatSettingsService = TextChatSettingsService;
})(Services || (Services = {}));
var State = (function () {
    function State(name, url, sticky, args) {
        if (sticky === void 0) { sticky = false; }
        if (args === void 0) { args = null; }
        this.name = name;
        this.url = url;
        this.sticky = sticky;
        if (args != null) {
            this.abstract = args.abstract;
            this.templateUrl = args.templateUrl;
            this.templateLess = args.templateLess;
            this.deepStateRedirect = args.deepStateRedirect;
        }
    }
    return State;
}());
var StatesHelper;
(function (StatesHelper) {
    var statesNotRequiringEmailConfirmations = [];
    function createUiRouterStates($stateProvider) {
        $stateProvider.state("root", {
            abstract: true,
            resolve: {
                userService: "userService",
                resolveResources: ["serverResources", function (serverResources) {
                        return serverResources.resolveTranslationsAsync();
                    }]
            }
        });
        var stateTitles = angular.element.parseJSON(document.getElementById("titles-json").innerText);
        for (var key in States) {
            var state = States[key];
            var views = {};
            views[state.name] = {};
            if (!state.templateLess) {
                if (!state.templateUrl)
                    state.templateUrl = "/partials" + state.url.slice(1);
                views[state.name]["templateUrl"] = state.templateUrl;
            }
            state.isRemoteTemplate = !state.templateLess && state.templateUrl.indexOf("/") === 0;
            var uiState = {
                title: stateTitles[key], url: state.url, views: views,
                sticky: state.sticky || false, dsr: state.deepStateRedirect
            };
            switch (state.name) {
                case States.login.name:
                    uiState.params = { emailOfExistingAccount: undefined };
                    break;
                case States.mailboxUser.name:
                    uiState.params = { id: undefined, isNew: { value: undefined, squash: true } };
                    break;
                case States.mailboxInbox.name:
                    uiState.params = { notReload: undefined };
                    break;
                case States.findByLanguages.name:
                    uiState.params = { known: { value: undefined, squash: true }, learn: { value: undefined, squash: true } };
                    break;
            }
            $stateProvider.state(state.name, uiState);
        }
        ;
        statesNotRequiringEmailConfirmations.push(States.home.name, States.contactUs.name, States.profile.name, States.termsOfUse.name, States.privacyPolicy.name, States.sharedTalk.name, States.livemocha.name);
    }
    StatesHelper.createUiRouterStates = createUiRouterStates;
    var isDataLoading = false;
    function onStateChangeStart(event, toState, toParam, fromState, $log, spinnerService, authService, userService, $state, $stickyState, modalService, $cookies) {
        spinnerService.showSpinner.show = true;
        if (!userService.isUserDataLoaded) {
            event.preventDefault();
            if (!userService.isInitLoadingStarted)
                userService.getInitUserDataAsync().then(function (authenticated) {
                    if (authenticated)
                        openStatesFromCookies($state, $cookies, authService, toState.name, angular.copy(toParam));
                    else
                        $state.go(toState.name, toParam, { reload: true });
                });
            return;
        }
        if (toState.name !== States.emailNotConfirmed.name && authService.isAuthenticated() && !userService.getUser().isEmailConfirmed && statesNotRequiringEmailConfirmations.indexOf(toState.name) === -1) {
            $log.appInfo("StateChangeRestricted", { toState: toState.name, cause: "EmailNotConfirmed" });
            $stickyState.reset("*");
            event.preventDefault();
            spinnerService.showSpinner.show = false;
            if (!isDataLoading) {
                isDataLoading = true;
                userService.getInitUserDataAsync().then(function () {
                    isDataLoading = false;
                    if (userService.getUser().isEmailConfirmed)
                        $state.go(toState.name, toParam, { reload: true });
                    else
                        modalService.openEmailIsNotConfirmModal();
                });
            }
            return;
        }
        if (toState.name === States.signup.name && authService.isAuthenticated()) {
            event.preventDefault();
            $state.go(States.home.name);
            return;
        }
        if ((toState.name === States.textChatHistory.name) && fromState.name.length === 0) {
            event.preventDefault();
            $state.go(States.textChatLobby.name);
            return;
        }
        ;
        if (toState.name !== States.login.name)
            authService.setStateToRedirect(toState.name, toParam);
        if (!authService.isAuthenticated() && toState.name === States.emailNotConfirmed.name) {
            event.preventDefault();
            $state.go(States.login.name);
            return;
        }
        if (fromState.name !== States.home.name && toState.name === States.emailNotConfirmed.name && authService.isAuthenticated()) {
            event.preventDefault();
            $state.go(States.home.name).then(function () { $state.go(States.emailNotConfirmed.name); });
            return;
        }
    }
    StatesHelper.onStateChangeStart = onStateChangeStart;
    var UiStateEventNames = (function () {
        function UiStateEventNames() {
        }
        Object.defineProperty(UiStateEventNames, "$stateChangeSuccess", {
            get: function () { return "$stateChangeSuccess"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UiStateEventNames, "$stateChangeStart", {
            get: function () { return "$stateChangeStart"; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UiStateEventNames, "$stateNotFound", {
            get: function () { return "$stateNotFound"; },
            enumerable: true,
            configurable: true
        });
        return UiStateEventNames;
    }());
    StatesHelper.UiStateEventNames = UiStateEventNames;
    var statesToSave = {
        "text-chat": "root.text-chat.lobby",
        "find": "root.find.languages"
    };
    function saveOpenedStateInCookies($state, $cookies) {
        var stateNamePart = $state.current.name.split(".")[1];
        if (Object.keys(statesToSave).indexOf(stateNamePart) !== -1) {
            var cookies = $cookies.get(Config.CookieNames.lastStates);
            var statesInCookies = (cookies ? angular.fromJson(cookies) : []);
            if (statesInCookies.indexOf(stateNamePart) === -1) {
                statesInCookies.push(stateNamePart);
                $cookies.put(Config.CookieNames.lastStates, angular.toJson(statesInCookies));
            }
        }
    }
    StatesHelper.saveOpenedStateInCookies = saveOpenedStateInCookies;
    function openStatesFromCookies($state, $cookies, authService, toStateName, toParam) {
        var cookies = $cookies.get(Config.CookieNames.lastStates);
        if (cookies) {
            $cookies.put(Config.CookieNames.lastStates, undefined);
            var statesInCookies = angular.fromJson(cookies);
            if (statesInCookies.length > 0) {
                loadStatesFunc(statesInCookies, $state, toStateName, toParam);
                return;
            }
        }
        $state.go(toStateName, toParam);
        function loadStatesFunc(statesToOpen, $state, currentStateName, currentStateParam) {
            if (statesToOpen.length > 0) {
                $state.go(statesToSave[statesToOpen[0]])
                    .then(function () {
                    if (statesToOpen.length > 1) {
                        var nextStates = statesToOpen.slice(1);
                        loadStatesFunc(nextStates, $state, currentStateName, currentStateParam);
                    }
                    else
                        $state.go(currentStateName, currentStateParam);
                });
            }
        }
    }
    StatesHelper.openStatesFromCookies = openStatesFromCookies;
})(StatesHelper || (StatesHelper = {}));
var States;
(function (States) {
    States.home = new State("root.home", "^/", true);
    States.termsOfUse = new State("root.terms-of-use", "^/terms-of-use");
    States.privacyPolicy = new State("root.privacy-policy", "^/privacy-policy");
    States.contactUs = new State("root.contact-us", "^/contact-us", true);
    States.signup = new State("root.signup", "^/signup", true);
    States.login = new State("root.login", "^/login");
    States.profile = new State("root.profile", "^/profile", true);
    States.emailNotConfirmed = new State("root.home.email-not-confirmed", "^/email-not-confirmed", true, { templateLess: true });
    States.sharedTalk = new State("root.sharedtalk", "^/sharedtalk");
    States.livemocha = new State("root.livemocha", "^/livemocha");
    States.sharedlingo = new State("root.sharedlingo", "^/sharedlingo");
    States.tt4You = new State("root.tt4you", "^/tt4you");
    States.xLingo = new State("root.xlingo", "^/xlingo");
    States.lingoFriends = new State("root.lingofriends", "^/lingofriends");
    States.atisba = new State("root.atisba", "^/atisba");
    States.lingApp = new State("root.lingapp", "^/lingapp");
    States.voxSwap = new State("root.voxswap", "^/voxswap");
    States.speakMania = new State("root.speakmania", "^/speakmania");
    States.palabea = new State("root.palabea", "^/palabea");
    States.lingUp = new State("root.lingup", "^/lingup");
    States.huiTalk = new State("root.huitalk", "^/huitalk");
    States.featureI18N = new State("root.made-by-members", "^/made-by-members");
    States.find = new State("root.find", "^/find", true, { deepStateRedirect: { default: "root.find.languages" } });
    States.findByLanguages = new State("root.find.languages", "^/find/languages/{known}/{learn}", true, { templateLess: true });
    States.findByName = new State("root.find.name", "^/find/name", true, { templateLess: true });
    States.findBySharedTalk = new State("root.find.sharedtalk", "^/find/sharedtalk", true, { templateLess: true });
    States.findByLivemocha = new State("root.find.livemocha", "^/find/livemocha", true, { templateLess: true });
    States.findBySharedLingo = new State("root.find.sharedlingo", "^/find/sharedlingo", true, { templateLess: true });
    States.mailbox = new State("root.mailbox", "^/mailbox", true, { deepStateRedirect: { default: "root.mailbox.inbox" } });
    States.mailboxInbox = new State("root.mailbox.inbox", "^/mailbox/inbox", true, { templateLess: true });
    States.mailboxArchives = new State("root.mailbox.archives", "^/mailbox/archives", true, { templateLess: true });
    States.mailboxUser = new State("root.mailbox.user", "^/mailbox/user/{id}/{isNew}", true, { templateLess: true });
    States.textChat = new State("root.text-chat", "^/text-chat", true, { deepStateRedirect: { default: "root.text-chat.lobby" } });
    States.textChatLobby = new State("root.text-chat.lobby", "/lobby", true, { templateLess: true });
    States.textChatHistory = new State("root.text-chat.history", "/history", true, { templateLess: true });
    States.textChatInvite = new State("root.text-chat.invite", "/invite-from/{userId}", true, { templateLess: true });
    States.textChatRoomPrivate = new State("root.text-chat.private", "/with/{userId}/{firstName}", true, { templateLess: true });
    States.textChatRoomPublic = new State("root.text-chat.public", "/in/{roomId}", true, { templateLess: true });
    States.textChatRoomCustom = new State("root.text-chat.custom", "/room/{roomId}", true, { templateLess: true });
    States.textChatRoomDualLang = new State("root.text-chat.dual", "/in/{langA}/{langB}", true, { templateLess: true });
})(States || (States = {}));
var TextChatCtrl = (function () {
    function TextChatCtrl($scope, $log, $cookies, $timeout, $state, $uibModal, spinnerService, chatUsersService, userService, connection, chatHub, rtc, countersService, statesService, textChatSettings, serverResources, contactsService, roomsService, $location, $filter) {
        var _this = this;
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$timeout = $timeout;
        this.$state = $state;
        this.$uibModal = $uibModal;
        this.spinnerService = spinnerService;
        this.chatUsersService = chatUsersService;
        this.userService = userService;
        this.connection = connection;
        this.chatHub = chatHub;
        this.rtc = rtc;
        this.countersService = countersService;
        this.statesService = statesService;
        this.textChatSettings = textChatSettings;
        this.serverResources = serverResources;
        this.contactsService = contactsService;
        this.roomsService = roomsService;
        this.$location = $location;
        this.$filter = $filter;
        this.initializing = true;
        this.chatRequests = {};
        this.audioCallRequests = new Set(false);
        this.showChatRequestMessageInProfile = false;
        this.mutedUsers = [];
        this.emitTyping = true;
        this.sounds = {
            messageAdded: new Audio("/Content/Sounds/IncomingMessage.mp3"),
            invitation: new Audio("/Content/Sounds/IncomingUser.mp3")
        };
        this.onConnectionDisconnected = function () { return _this.$scope.loading = true; };
        this.onConnectionReconnected = function () { return _this.$scope.loading = false; };
        this.onConnectionFatalError = function () { return _this.statesService.closeState(States.textChat.name); };
        this.onconnectionStarted = function () {
            _this.chatUsersService.clearAllUsers();
            _this.audioCallRequests = new Set(false);
            _this.reconnectExistingRooms();
            _this.applyPendingStateRequest();
            _this.$scope.loading = false;
        };
        this.connectionHandlers = [
            { event: this.connection.eventFatalError, handler: this.onConnectionFatalError },
            { event: this.connection.eventDisconnected, handler: this.onConnectionDisconnected },
            { event: this.connection.eventReconnected, handler: this.onConnectionReconnected },
            { event: this.connection.eventStarted, handler: this.onconnectionStarted }
        ];
        this.attachServerConnectionHandlers = function () {
            return _this.connectionHandlers.forEach(function (eventHandler) { return eventHandler.event.on(eventHandler.handler); });
        };
        this.detachServerConnectionHandlers = function () {
            return _this.connectionHandlers.forEach(function (eventHandler) { return eventHandler.event.off(eventHandler.handler); });
        };
        this.showRoom = function (roomId) { return _this.setStateTo(_this.roomsService.rooms[roomId]); };
        this.setStateTo = function (room) { return _this.$location.url(room.url); };
        this.chatStatusFor = function (userId) {
            for (var _i = 0, _a = _this.$scope.privateChatStatuses; _i < _a.length; _i++) {
                var status_1 = _a[_i];
                if (status_1.partner.id === userId)
                    return status_1;
            }
            return null;
        };
        this.leaveRoom = function (roomId, dueToInactivity) {
            if (dueToInactivity === void 0) { dueToInactivity = false; }
            var room = _this.roomsService.rooms[roomId];
            if (!room)
                return;
            _this.chatHub.leaveRoom(roomId);
            if (dueToInactivity)
                room.isInactive = true;
            else {
                room.accessor.dispose();
                if (room.isUndocked) {
                    room.isUndocked = false;
                    _this.$scope.undockedRooms.splice(_this.$scope.undockedRooms.indexOf(room), 1);
                    if (_this.$scope.undockedRooms.length === 0)
                        $(window).unbind("resize", _this.undockedStateWindowResizeHandler);
                }
                if (room.isPrivate && room.audioCallState)
                    _this.cancelAudioCall(roomId, "leftRoom");
                _this.chatUsersService.unMarkRecentUsersIn(roomId);
                _this.roomsService.deleteRoom(roomId);
                _this.setToValidState();
            }
        };
        this.reconnectRoom = function (roomId) {
            var room = _this.roomsService.rooms[roomId];
            room.accessor.reset();
            room.isInactive = false;
            _this.chatHub.subscribeToRoom(roomId);
        };
        this.undockedStateWindowResizeHandler = function () {
            if ($(window).innerWidth() <= 960)
                angular.forEach(_this.roomsService.rooms, function (room) {
                    if (room.isUndocked)
                        _this.dockRoom(room.roomId);
                });
        };
        this.undockRoom = function (roomId) {
            if (angular.element(window).width() < 960)
                return false;
            var room = _this.roomsService.rooms[roomId];
            if (room.accessor)
                room.accessor.dispose();
            room.isUndocked = true;
            _this.$scope.undockedRooms.push(room);
            if (room.accessor && !room.accessor.loading)
                _this.chatHub.subscribeToRoom(roomId);
            $(window).bind("resize", _this.undockedStateWindowResizeHandler);
            _this.$state.go(States.textChatLobby.name);
            return true;
        };
        this.dockRoom = function (roomId) {
            var room = _this.roomsService.rooms[roomId];
            room.isUndocked = false;
            room.newMessagesCount = 0;
            room.accessor.dispose();
            _this.$scope.undockedRooms.splice(_this.$scope.undockedRooms.indexOf(room), 1);
            _this.chatHub.subscribeToRoom(roomId);
            _this.setStateTo(room);
            if (_this.$scope.undockedRooms.length === 0)
                $(window).unbind("resize", _this.undockedStateWindowResizeHandler);
        };
        this.onStateChangeSuccess = function (event, toState, toStateParams) {
            var stateDef = { state: toState, params: toStateParams };
            if (_this.connection.state === Services.ServerSocketState.Disconnected || _this.connection.state === Services.ServerSocketState.Connecting) {
                _this.pendingStateRequest = stateDef;
                return;
            }
            else
                _this.applyStateChange(stateDef);
        };
        this.onTextPostedInRoom = function (roomId, message) {
            if (!_this.roomsService.rooms[roomId].isPrivate)
                _this.chatUsersService.unMarkRecentUsersIn(roomId);
            _this.chatHub.postTo(roomId, message);
            _this.emitTyping = _this.previousPostedText !== message;
            _this.previousPostedText = message;
        };
        this.addMessage = function (msg) {
            var user = _this.chatUsersService.getUser(msg.userId);
            if (user)
                user.roomTypingIn = undefined;
            else
                _this.$log.appWarn("UserNotFoundInAddMessage", { msg: msg });
            if (_this.isUserMuted(msg.userId)) {
                _this.$log.appInfo("MutedChatMessage", { mutedUserId: msg.userId, roomId: msg.roomId, text: msg.text });
                return;
            }
            var json = null;
            try {
                json = JSON.parse(msg.text);
            }
            catch (e) { }
            var partner = _this.getPartnerFromRoomId(msg.roomId);
            if (json && json.chatRequest) {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (!_this.userService.getUser().isNoPrivateChat)
                    _this.$scope.privateChatStatuses.push({ partner: partner, statusId: 21, statusAt: _this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") });
                _this.addChatRequest(partner, 21);
            }
            else {
                var room = _this.roomsService.rooms[msg.roomId];
                if (json && json.chatRequestAccepted) {
                    if (!room)
                        _this.addChatRequest(partner, 2);
                    partner.isPrivatePartner = true;
                }
                if (room) {
                    _this.setMessageOrigin(msg);
                    _this.notifyOfMessageAddition(msg.roomId);
                    room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text);
                    _this.increaseNotificationCount();
                    if (room.isPrivate && (msg.roomId === _this.currentRoomId() || room.isUndocked))
                        _this.chatHub.markAllCaughtUp(msg.userId);
                }
                else {
                    var status_2 = _this.chatStatusFor(msg.userId);
                    if (!status_2 || (status_2.statusId !== 21 && status_2.statusId !== 23))
                        _this.addChatRequest(partner, 10);
                }
            }
        };
        this.getPartnerFromRoomId = function (roomId) {
            var partnerId = _this.roomsService.partnerIdFrom(roomId);
            return _this.chatUsersService.getUser(partnerId);
        };
        this.showUserModal = function (userOrItsId, hideChatButton) {
            var user;
            if (angular.isObject(userOrItsId))
                user = userOrItsId;
            else
                user = { id: userOrItsId };
            _this.showChatRequestMessageInProfile = false;
            _this.$uibModal.open({
                templateUrl: "modal-profile-view.tpl",
                controllerAs: "modalCtrl",
                controller: function () { return ({
                    user: user,
                    showButtons: function () { return !_this.showChatRequestMessageInProfile; },
                    hasViewChatButton: function () { return !_this.isUserMuted(user.id) && !hideChatButton && user.isPrivatePartner; },
                    hasRequestChatButton: function () { return !_this.isUserMuted(user.id) && !hideChatButton && !user.isPrivatePartner; },
                    hasLightMailButton: function () { return !_this.isUserMuted(user.id); },
                    switchUserMute: function () { return _this.switchUserMute(user.id); },
                    requestChat: function (user) { return _this.requestChat(user); },
                    hasChatRequestedMessage: function () { return _this.showChatRequestMessageInProfile; },
                    isMuted: function () { return _this.isUserMuted(user.id); }
                }); }
            });
        };
        this.requestAudioCall = function (roomId) {
            if (!_this.isAudioCallAllowed(roomId))
                return;
            _this.$log.appInfo("RequestAudioCallStarted", { roomId: roomId });
            _this.roomsService.rooms[roomId].audioCallState = AudioCallState.initializing;
            var onPeerCreatedCallback = function (peer) { return _this.peerCreatedHandler(_this.roomsService.rooms[roomId], peer); };
            _this.rtc.startRoomAudioCall(roomId, onPeerCreatedCallback, true)
                .then(function () {
                _this.$log.appInfo("SendingRequestAudioCall", { roomId: roomId });
                _this.chatHub.requestAudioCall(roomId);
                _this.requestAudioCallTimeout = _this.$timeout(function (roomId) {
                    var room = _this.roomsService.rooms[roomId];
                    if (room.audioCallState !== AudioCallState.initializing)
                        return;
                    _this.cancelAudioCall(roomId, "timeout");
                }, TextChatCtrl.audioCallRequestTimeoutInMs, true, roomId);
            }, function (cause) {
                _this.$log.appWarn("AbortingRequestAudioCall", { cause: cause });
                _this.roomsService.rooms[roomId].audioCallState = null;
                _this.renderAudioCallChatMessage(roomId, "unsupported_" + cause);
            });
        };
        this.acceptAudioCall = function (roomId) {
            _this.$log.appInfo("AudioCallAcceptRequest", { roomId: roomId });
            _this.audioCallRequests.remove(roomId);
            var onPeerCreatedCallback = function (peer) { return _this.peerCreatedHandler(_this.roomsService.rooms[roomId], peer); };
            _this.rtc.startRoomAudioCall(roomId, onPeerCreatedCallback, false)
                .then(function () { _this.$log.appInfo("AudioCallAccepted", { roomId: roomId }); }, function () { _this.declineAudioCall(roomId, "unsupported_device"); });
        };
        this.declineAudioCall = function (roomId, reason) {
            if (reason === void 0) { reason = "declined"; }
            _this.$log.appInfo("DeclineAudioCall", { roomId: roomId, reason: reason });
            _this.audioCallCleanup(roomId);
            if (reason !== "declined")
                _this.renderAudioCallChatMessage(roomId, "decline_" + reason);
            _this.chatHub.declineAudioCall(roomId, reason);
        };
        this.cancelAudioCall = function (roomId, reason) {
            if (reason === void 0) { reason = "cancelled"; }
            _this.$log.appInfo("CancelAudioCall", { roomId: roomId, reason: reason });
            _this.audioCallCleanup(roomId);
            _this.rtc.stopAudioCall(reason);
            _this.chatHub.cancelAudioCall(roomId);
        };
        this.hangUpAudioCall = function (roomId) {
            _this.$log.appInfo("HangUpAudioCall", { roomId: roomId });
            _this.finishAudioCall(roomId);
            _this.chatHub.hangoutAudioCall(roomId);
        };
        this.audioCallRequested = function (roomId) {
            _this.$log.appInfo("AudioCallRequested", { roomId: roomId });
            var partnerId = _this.roomsService.partnerIdFrom(roomId);
            if (_this.isUserMuted(partnerId)) {
                _this.$log.appInfo("AudioCallMutedFor", { roomId: roomId, partnerId: partnerId });
                return;
            }
            _this.audioCallRequests.add(roomId);
            var room = _this.roomsService.rooms[roomId];
            if (room) {
                _this.notifyOfMessageAddition(roomId);
            }
            else {
                var partner = _this.getPartnerFromRoomId(roomId);
                _this.addChatRequest(partner, 10);
                _this.increaseNotificationCount();
                return;
            }
            if (_this.rtc.roomId && _this.rtc.roomId !== roomId) {
                _this.declineAudioCall(roomId, "busy");
                return;
            }
            _this.rtc.checkCapabilities().then(function () {
                room.audioCallState = AudioCallState.requested;
                _this.increaseNotificationCount();
            }, function (reason) { return _this.declineAudioCall(roomId, "unsupported_" + reason); });
        };
        this.switchUserMute = function (userId) {
            var _a = _this.isUserMuted(userId) ?
                ["ChatUserUnmuted", function (id) { return _this.removeMutedUserIdFromCookies(id); }, "UnmutedUser"] :
                ["ChatUserMuted", function (id) { return _this.addMutedUserIdToCookies(id); }, "MutedUser"], logTag = _a[0], action = _a[1], event = _a[2];
            _this.$log.appInfo(logTag, { userId: userId });
            _this.chatHub.postChatEventTo(_this.currentRoomId() ? _this.currentRoomId() : "none", event, userId);
            action(userId);
        };
        this.openSettings = function () {
            var settings = {
                isAudioNotificationOn: Runtime.TextChatSettings.playMessageAddedSound.valueOf(),
                isPrivateChatOn: !_this.userService.getUser().isNoPrivateChat
            };
            var settingsResult = _this.textChatSettings.openSettings(settings);
            settingsResult.then(function (settings) {
                Runtime.TextChatSettings.playMessageAddedSound = settings.isAudioNotificationOn;
                _this.userService.setNoPrivateChat(!settings.isPrivateChatOn);
            });
        };
        this.localUser = userService.getUser();
        this.roomsService.initiateRoomService();
        $scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, function (event, toState, toStateParams) { return _this.onStateChangeSuccess(event, toState, toStateParams); });
        $scope.$on(StatesHelper.UiStateEventNames.$stateChangeStart, function (event, toState, toParam, fromState, fromParams) { return _this.onStateChangeStart(event, toState, toParam, fromState, fromParams); });
        $scope.$on("$destroy", function () { _this.disconnectAll(); _this.$log.signalRInfo("OnTextChatDetroy"); });
        $scope.rooms = this.roomsService.rooms;
        $scope.privateChatStatuses = [];
        $scope.hasPrivateChatStatuses = function () { return Object.keys(_this.$scope.privateChatStatuses).length >= 1; };
        $scope.currentRoomId = function () { return _this.currentRoomId(); };
        $scope.undockedRooms = [];
        $scope.firstName = this.localUser.firstName;
        $scope.lastName = this.localUser.lastName;
        $scope.loading = true;
        $scope.inactive = false;
        $scope.chatRequests = this.chatRequests;
        $scope.countries = this.serverResources.getCountries();
        $scope.languages = Languages.langsById;
        $scope.isAudioCallAllowed = this.isAudioCallAllowed;
        $scope.newUsersCount = function () { var cnt = 0; angular.forEach(_this.chatUsersService.onlineUsers, function (user) { if (user.recentlyJoinedRooms.indexOf(Config.lobbySpecialRoom.name) !== -1)
            cnt++; }); return cnt; };
        $scope.newUsersCountPerRoom = function (roomId) { var cnt = 0; angular.forEach(_this.chatUsersService.onlineUsers, function (user) { if (user.recentlyJoinedRooms.indexOf(roomId) !== -1)
            cnt++; }); return cnt; };
        $scope.isUserMuted = function (userId) { return _this.isUserMuted(userId); };
        $scope.isRoomShown = function (room) { return _this.currentRoomId() === room.roomId; };
        $scope.isLobbyTabShown = function () { return $state.includes(States.textChatLobby.name); };
        $scope.isChatHistoryTabShown = function () { return $state.includes(States.textChatHistory.name); };
        $scope.isPrivateInviteShown = function (userId) { return $state.includes(States.textChatInvite.name) && Number($state.params.userId) === Number(userId); };
        $scope.leaveRoom = this.leaveRoom;
        $scope.reconnectRoom = this.reconnectRoom;
        $scope.joinPrivateRoom = function (withUser) { return _this.statesService.go(States.textChatRoomPrivate.name, { userId: withUser.id, firstName: withUser.firstName }); };
        $scope.requestChat = function (withUser) { return _this.requestChat(withUser); };
        $scope.undockRoom = this.undockRoom;
        $scope.dockRoom = this.dockRoom;
        $scope.onRoomInputKeyDown = function (keyCode, roomId) { return _this.onRoomInputKeyDown(keyCode, roomId); };
        $scope.privateChatHistoryUrl = this.$state.href(States.textChatHistory.name);
        $scope.lobbyUrl = this.$state.href(States.textChatLobby.name);
        $scope.openSettings = this.openSettings;
        $scope.ignoreChatRequest = function (userId) { return _this.ignoreChatRequest(userId); };
        $scope.selectPrivateChatStatus = function (status) { return _this.openChatTrackerItem(status); };
        $scope.onTextPostedInRoom = this.onTextPostedInRoom;
        $scope.showUserModal = this.showUserModal;
        $scope.switchUserMute = this.switchUserMute;
        $scope.requestAudioCall = this.requestAudioCall;
        $scope.cancelAudioCall = this.cancelAudioCall;
        $scope.acceptAudioCall = this.acceptAudioCall;
        $scope.declineAudioCall = this.declineAudioCall;
        $scope.hangoutAudioCall = this.hangUpAudioCall;
        $scope.closeChat = function () { return _this.statesService.closeState(States.textChat.name); };
        this.serverResources.getAudioChatResources().then(function (translations) { return _this.audioMessages = translations; });
        this.loadMutedUsers();
        this.restoreRoomsFromCookies();
        this.attachHubHandlers();
        this.attachServerConnectionHandlers();
        this.connection.start();
    }
    TextChatCtrl.prototype.attachHubHandlers = function () {
        var _this = this;
        this.chatHub.onSetInitialCountOfUsers(function (countOfUsers) { return _this.chatUsersService.countOfUsers = countOfUsers; });
        this.chatHub.onUpdateCountOfUsers(function (roomId, count) { return _this.chatUsersService.countOfUsers.forPublicRooms[roomId] = count; });
        this.chatHub.onAddPrivateChatStatus(function (status) { return _this.digestChatTrackerData(status); });
        this.chatHub.onAddInitialUsers(function (users) { return _this.addInitialUsers(users); });
        this.chatHub.onAddUser(function (user) { return _this.addUserToChat(user); });
        this.chatHub.onAddInitialUsersTo(function (roomId, users) { return _this.addInitialUsersTo(roomId, users); });
        this.chatHub.onAddUserTo(function (roomId, userId) { return _this.addUserTo(roomId, userId); });
        this.chatHub.onAddInitialMessages(function (messages) { return _this.addInitialMessages(messages); });
        this.chatHub.onAddMessage(function (message) { return _this.addMessage(message); });
        this.chatHub.onRequestAudioCall(function (roomId) { return _this.audioCallRequested(roomId); });
        this.chatHub.onCancelAudioCall(function (roomId) { return _this.audioCallCancelled(roomId); });
        this.chatHub.onDeclineAudioCall(function (roomId, reason) { return _this.audioCallDeclined(roomId, reason); });
        this.chatHub.onHangoutAudioCall(function (roomId, userId) { return _this.audioCallHangouted(roomId, userId); });
        this.chatHub.onPrivateChatRequestResponse(function (listOfRooms) { return _this.$scope.$broadcast("onPrivateChatRequestResponseReceived", listOfRooms); });
        this.chatHub.onLeaveRoom(function (roomId) {
            _this.leaveRoom(roomId, true);
            _this.notifyOfMessageAddition(roomId);
            _this.$log.appInfo("InactiveUserBootedOutOfRoom", { userId: _this.localUser.id, roomId: roomId });
        });
        this.chatHub.onRemoveUser(function (userId) {
            var privateRoomId = _this.roomsService.privateRoomIdFrom(userId);
            var privateRoom = _this.roomsService.rooms[privateRoomId];
            if (privateRoom) {
                if (privateRoom.audioCallState && privateRoom.audioCallState !== AudioCallState.connected)
                    _this.audioCallDeclined(privateRoomId, "leftRoom");
            }
            else {
                _this.audioCallCleanup(privateRoomId);
            }
            _this.chatUsersService.removeUser(userId);
        });
        this.chatHub.onRemoveUserFrom(function (roomId, userId) {
            _this.chatUsersService.unMarkRecentUser(_this.chatUsersService.getUser(userId), roomId);
            var room = _this.roomsService.rooms[roomId];
            if (room) {
                room.accessor.removeUser(userId);
                if (room.isPrivate && room.audioCallState && room.audioCallState !== AudioCallState.connected)
                    _this.audioCallDeclined(roomId, "leftRoom");
            }
            else if (!/^\d+-\d+$/.exec(roomId))
                _this.$log.signalRError("RemoveUserFromMissingRoomError", roomId);
            else {
                _this.audioCallCleanup(roomId);
            }
        });
        this.chatHub.onMarkUserAsTyping(function (roomId, userId) {
            if (userId !== _this.localUser.id && !_this.isUserMuted(userId))
                _this.chatUsersService.getUser(userId).roomTypingIn = roomId;
        });
        this.chatHub.onUnmarkUserAsTyping(function (userId) {
            var user = _this.chatUsersService.getUser(userId);
            if (user)
                user.roomTypingIn = undefined;
        });
        this.chatHub.onAudioCallConnected(function (roomId, userId) {
            var isSameUser = userId === _this.localUser.id;
            if (!_this.roomsService.rooms[roomId] || isSameUser && _this.roomsService.rooms[roomId].audioCallState !== AudioCallState.connected)
                _this.audioCallCleanup(roomId);
        });
        this.chatHub.onSetUserIdle(function (userId) {
            if (_this.localUser.id === userId) {
                _this.$scope.inactive = true;
                _this.disconnectAll();
                _this.$scope.loading = false;
            }
        });
    };
    TextChatCtrl.prototype.reconnectExistingRooms = function () {
        var _this = this;
        angular.forEach(this.roomsService.rooms, function (room) {
            room.accessor.reset();
            _this.chatHub.subscribeToRoom(room.roomId);
        });
    };
    TextChatCtrl.prototype.restoreRoomsFromCookies = function () {
        var rooms = this.roomsService.getRoomsFromPreviousSession();
        for (var roomId in rooms) {
            var room = rooms[roomId];
            try {
                if (room.stateName === States.textChatRoomPrivate.name && !this.roomsService.validatePrivateRoomId(roomId))
                    throw Error();
                if (roomId !== "hellolingo" && roomId !== "english")
                    this.joinRoom(roomId, room.text, room.stateName, false);
            }
            catch (e) {
                this.$log.appInfo("dumpFailingRoomFromCookie", { roomId: roomId, room: room });
                this.roomsService.removeRoomIdFromCookies(roomId);
            }
        }
    };
    TextChatCtrl.prototype.addInitialUsers = function (users) {
        var _this = this;
        this.chatUsersService.clearAllUsers();
        var usersWhoHaveJustLeft = new Array();
        angular.forEach(users, function (userObj) {
            var user = new TextChatUser(userObj);
            user.isPinned = _this.contactsService.isUserInContacts(user.id);
            _this.chatUsersService.addUser(user);
            if (user.hasJustLeft)
                usersWhoHaveJustLeft.push(user.id);
        });
        for (var _i = 0, usersWhoHaveJustLeft_1 = usersWhoHaveJustLeft; _i < usersWhoHaveJustLeft_1.length; _i++) {
            var userId = usersWhoHaveJustLeft_1[_i];
            this.chatUsersService.removeUser(userId);
        }
        this.chatUsersService.sortBy();
    };
    TextChatCtrl.prototype.disconnectAll = function () {
        this.connection.stop();
        this.chatHub.detachAllHandlers();
        this.detachServerConnectionHandlers();
    };
    TextChatCtrl.prototype.currentRoomId = function () {
        var validStates = [States.textChatRoomCustom.name, States.textChatRoomDualLang.name, States.textChatRoomPrivate.name, States.textChatRoomPublic.name];
        if (validStates.indexOf(this.$state.current.name) === -1)
            return undefined;
        var params = this.$state.params;
        var roomId = params.roomId;
        if (params.userId)
            roomId = this.roomsService.privateRoomIdFrom(params.userId);
        if (params.langA)
            roomId = params.langA + "+" + params.langB;
        return roomId;
    };
    TextChatCtrl.prototype.setToValidState = function () {
        for (var roomId in this.roomsService.rooms)
            if (!this.roomsService.rooms[roomId].isUndocked) {
                this.showRoom(roomId);
                return;
            }
        this.$state.go(States.textChatLobby.name);
    };
    TextChatCtrl.prototype.requestChat = function (user) {
        this.showChatRequestMessageInProfile = true;
        var status = this.chatStatusFor(user.id);
        if (status) {
            if (status.statusId === 21 || status.statusId === 23 || status.statusId === 22)
                this.$scope.joinPrivateRoom(status.partner);
            else
                this.$log.appError("UnexpectedExistingStatusInChatRequest", { status: status });
            return;
        }
        this.chatHub.requestPrivateChat(user.id);
        var partner = this.chatUsersService.getUser(user.id);
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        if (partner) {
            this.$scope.privateChatStatuses.push({ partner: partner, statusId: 1, statusAt: this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") });
            partner.isPrivatePartner = true;
        }
        else
            this.$log.appError("AddChatRequestToHistoryFailedOnMissingPartner", { userId: user.id });
    };
    TextChatCtrl.prototype.joinRoom = function (roomId, roomText, roomStateName, subscribe) {
        var _this = this;
        if (subscribe === void 0) { subscribe = true; }
        var params = States.textChatRoomPrivate.name === roomStateName ? { firstName: roomText, userId: this.roomsService.partnerIdFrom(roomId) } : (States.textChatRoomDualLang.name === roomStateName ? { langA: roomId.split("+")[0], langB: roomId.split("+")[1] } :
            { roomId: roomId });
        var roomUrl = this.statesService.href(this.statesService.get(roomStateName), params);
        var room = this.roomsService.addRoom(new TextChatRoomModel(roomId, roomText, roomUrl, roomStateName, params.userId));
        if (params.userId) {
            var status_3 = this.chatStatusFor(params.userId);
            var partner = this.chatUsersService.getUser(params.userId);
            if (status_3) {
                switch (status_3.statusId) {
                    case 21:
                        status_3.statusId = 22;
                        break;
                    case 23:
                        status_3.statusId = 22;
                        break;
                }
                if (partner)
                    partner.isPrivatePartner = true;
            }
            else {
                var tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                if (partner)
                    this.$scope.privateChatStatuses.push({ partner: partner, statusId: 11, statusAt: this.$filter('date')(tomorrow, "yyyy-MM-ddTHH:mm:ss") });
            }
            delete this.chatRequests[params.userId];
            if (this.audioCallRequests.contains(roomId)) {
                this.audioCallRequested(roomId);
                this.audioCallRequests.remove(roomId);
            }
        }
        if (subscribe)
            this.chatHub.subscribeToRoom(roomId);
        this.$timeout(function () {
            room.accessor.initForFirstVisit();
            room.accessor.loading = true;
        }, 0);
        if (!this.initializing && this.$scope.undockedRooms.length === 0) {
            if (this.undockRoom(roomId))
                this.$timeout(function () { return _this.$state.go(States.textChatLobby.name); }, 0);
        }
    };
    TextChatCtrl.prototype.notifyOfMessageAddition = function (roomId) {
        var params = this.$state.params;
        if (params.roomId !== roomId && params.langA + "+" + params.langB !== roomId && (!params.userId || params.userId.toString() !== this.roomsService.partnerIdFrom(roomId).toString()))
            this.roomsService.rooms[roomId].newMessagesCount++;
        if (Runtime.TextChatSettings.playMessageAddedSound)
            this.sounds.messageAdded.play();
    };
    TextChatCtrl.prototype.setMessageOrigin = function (msg) {
        msg.origin = msg.firstName === "[News]" ? MessageOrigin.news : MessageOrigin.otherUser;
    };
    TextChatCtrl.prototype.onStateChangeStart = function (event, toState, toParam, fromState, fromParam) {
        if (this.$state.includes(States.textChat.name) === false)
            return;
        if (this.currentRoomId())
            if (this.roomsService.rooms[this.currentRoomId()])
                if (this.roomsService.rooms[this.currentRoomId()].accessor)
                    this.roomsService.rooms[this.currentRoomId()].accessor.resetLastSeenMark();
        if (fromState.name === States.textChatLobby.name)
            this.chatUsersService.unmarkRecentUsers();
        if (fromParam && fromParam.roomId)
            this.chatUsersService.unMarkRecentUsersIn(fromParam.roomId);
        if (fromParam && fromParam.langA)
            this.chatUsersService.unMarkRecentUsersIn(fromParam.langA + "+" + fromParam.langB);
        if (fromParam && fromParam.userId)
            this.chatUsersService.unMarkRecentUsersIn(this.roomsService.privateRoomIdFrom(fromParam.userId));
        if (this.roomsService.rooms[toParam.roomId] && this.roomsService.rooms[toParam.roomId].isUndocked) {
            this.spinnerService.showSpinner.show = false;
            event.preventDefault();
        }
        this.previousStateDef = { state: fromState, params: fromParam };
    };
    TextChatCtrl.prototype.applyStateChange = function (stateDef) {
        this.chatHub.setUserActive();
        if (this.$state.includes(States.textChat.name) === false)
            return;
        this.countersService.resetCounter(Services.Counters.TextChat);
        if (stateDef.state.name === States.textChatLobby.name) { }
        else if (stateDef.state.name === States.textChatHistory.name)
            delete this.$scope.invitingUser;
        else if (stateDef.state.name === States.textChatInvite.name) {
            var userId = stateDef.params.userId;
            this.$scope.invitingUser = { id: userId };
        }
        else if ([States.textChatRoomCustom, States.textChatRoomPublic, States.textChatRoomPrivate, States.textChatRoomDualLang]
            .some(function (state) { return stateDef.state.name === state.name; })) {
            this.applyRoomStateChange(stateDef);
        }
        this.initializing = false;
    };
    TextChatCtrl.prototype.applyRoomStateChange = function (stateDef) {
        var roomId;
        if (stateDef.state.name === States.textChatRoomPrivate.name)
            roomId = this.roomsService.privateRoomIdFrom(stateDef.params.userId);
        else if (stateDef.state.name === States.textChatRoomDualLang.name)
            roomId = stateDef.params.langA + "+" + stateDef.params.langB;
        else
            roomId = stateDef.params.roomId;
        if ((stateDef.state.name === States.textChatRoomPublic.name && Languages[roomId] == null && Config.TopicChatRooms[roomId] == null) ||
            (stateDef.state.name === States.textChatRoomCustom.name && !Config.Regex.secretRoom.test(roomId))) {
            this.$log.appWarn("MalformedRoomRequested", { roomId: roomId, stateName: stateDef.state.name });
            this.$state.go(States.textChatLobby.name);
            return;
        }
        if (stateDef.state.name === States.textChatRoomDualLang.name && (Languages[stateDef.params.langA] == null || Languages[stateDef.params.langB] == null)) {
            this.$log.appWarn("MalformedRoomRequested", { langA: stateDef.params.langA, langB: stateDef.params.langB, stateName: stateDef.state.name });
            this.$state.go(States.textChatLobby.name);
            return;
        }
        if (!this.roomsService.rooms[roomId]) {
            var roomText = roomId;
            if (stateDef.state.name === States.textChatRoomPublic.name) {
                var language = Languages[roomId];
                var topic = Config.TopicChatRooms[roomId];
                roomText = language ? language.text : topic.text;
            }
            else if (stateDef.state.name === States.textChatRoomPrivate.name) {
                roomText = stateDef.params.firstName;
            }
            else if (stateDef.state.name === States.textChatRoomDualLang.name) {
                roomText = Languages[stateDef.params.langA].text + " + " + Languages[stateDef.params.langB].text;
            }
            this.joinRoom(roomId, roomText, stateDef.state.name);
        }
        if (stateDef.state.name === States.textChatRoomPrivate.name) {
            this.chatHub.markAllCaughtUp(Number(stateDef.params.userId));
        }
        var room = this.roomsService.rooms[roomId];
        room.newMessagesCount = 0;
    };
    TextChatCtrl.prototype.addUserTo = function (roomId, userId) {
        var room = this.roomsService.rooms[roomId];
        if (!room)
            return;
        var user = this.chatUsersService.getUser(userId);
        if (!user) {
            this.$log.signalRWarn("UserIdNotFoundInAddUserTo", { userId: userId });
            return;
        }
        user.recentlyJoinedRooms.push(roomId);
        room.accessor.addUser(user);
    };
    TextChatCtrl.prototype.addInitialUsersTo = function (roomId, initialUsers) {
        var _this = this;
        var room = this.roomsService.rooms[roomId];
        if (!room)
            return;
        this.$timeout(function () {
            angular.forEach(initialUsers, function (userId) {
                var user = _this.chatUsersService.getUser(userId);
                if (user) {
                    user.recentlyJoinedRooms = [];
                    room.accessor.addUser(user);
                }
                else {
                    _this.$log.signalRWarn("UserIdNotFoundInAddInitialUsersTo", { userId: userId });
                }
            });
            var user = _this.localUser;
            user.isSelf = true;
            user.recentlyJoinedRooms = [];
            _this.roomsService.rooms[roomId].accessor.addUser(user);
        });
    };
    TextChatCtrl.prototype.digestChatTrackerData = function (trackers) {
        var _this = this;
        this.$scope.privateChatStatuses = [];
        angular.forEach(trackers, function (status) {
            if (_this.isUserMuted(status.partner.id))
                return;
            if (_this.userService.getUser().isNoPrivateChat && status.statusId === 21)
                return;
            status.partner.isPinned = _this.contactsService.isUserInContacts(status.partner.id);
            _this.$scope.privateChatStatuses.push(status);
            var chatUser = _this.chatUsersService.getUser(status.partner.id);
            if (chatUser) {
                if (status.statusId === 21 || status.statusId === 2)
                    _this.addChatRequest(status.partner, Number(status.statusId));
                else if (status.statusId !== 23)
                    chatUser.isPrivatePartner = true;
            }
            if (status.statusId === 10) {
                var room = _this.roomsService.rooms[_this.roomsService.privateRoomIdFrom(status.partner.id)];
                if (room)
                    room.newMessagesCount = 1;
                else
                    _this.addChatRequest(status.partner, Number(status.statusId));
            }
        });
    };
    TextChatCtrl.prototype.addInitialMessages = function (messages) {
        var _this = this;
        this.$timeout(function () {
            angular.forEach(messages, function (msg) {
                if (!_this.isUserMuted(msg.userId)) {
                    _this.setMessageOrigin(msg);
                    var room = _this.roomsService.rooms[msg.roomId];
                    if (!room)
                        return;
                    room.accessor.addMessage(msg.origin, msg.userId, msg.firstName, msg.lastName, msg.text, true);
                    room.accessor.resetLastSeenMark();
                }
            });
            angular.forEach(_this.roomsService.rooms, function (room) { return room.accessor.loading = false; });
            _this.spinnerService.showSpinner.show = false;
            _this.$scope.$apply();
        });
    };
    TextChatCtrl.prototype.addChatRequest = function (user, trackerStatusId) {
        if (this.userService.getUser().isNoPrivateChat)
            return;
        this.chatRequests[user.id] = {
            user: user, trackerStatusId: trackerStatusId,
            url: trackerStatusId === 21
                ? this.$state.href(States.textChatInvite.name, { userId: user.id })
                : this.$state.href(States.textChatRoomPrivate.name, { userId: user.id, firstName: user.firstName })
        };
        if (Runtime.TextChatSettings.playUserNewInvitation)
            this.sounds.invitation.play();
        this.increaseNotificationCount();
    };
    TextChatCtrl.prototype.ignoreChatRequest = function (userId) {
        delete this.chatRequests[userId];
        var status = this.chatStatusFor(userId);
        status.statusId = 23;
        this.$state.go(this.previousStateDef.state.name, this.previousStateDef.params);
        this.chatHub.ignoreChatInvite(userId);
    };
    TextChatCtrl.prototype.openChatTrackerItem = function (status) {
        if (status.statusId === 21 || status.statusId === 23)
            this.$state.go(States.textChatInvite.name, { userId: status.partner.id });
        else
            this.$scope.joinPrivateRoom(status.partner);
    };
    ;
    TextChatCtrl.prototype.addUserToChat = function (args) {
        var _this = this;
        var user = new TextChatUser(args);
        user.isPinned = this.contactsService.isUserInContacts(user.id);
        user.isSelf = user.id === this.localUser.id;
        this.chatUsersService.addUser(user);
        this.$scope.privateChatStatuses.forEach(function (status) {
            if (status.partner.id === user.id) {
                user.isPrivatePartner = true;
                if (status.statusId === 21 || status.statusId === 2)
                    _this.addChatRequest(user, status.statusId);
            }
        });
        user.recentlyJoinedRooms.push(Config.lobbySpecialRoom.name);
    };
    TextChatCtrl.prototype.isAudioCallAllowed = function (roomId) {
        for (var id in this.roomsService.rooms) {
            if (this.roomsService.rooms[id].audioCallState) {
                this.renderAudioCallChatMessage(roomId, "busy");
                return false;
            }
        }
        return true;
    };
    TextChatCtrl.prototype.audioCallCancelled = function (roomId) {
        this.$log.appInfo("AudioCallCancelled", { roomId: roomId });
        this.decreaseNotificationCount();
        this.audioCallCleanup(roomId);
    };
    TextChatCtrl.prototype.audioCallDeclined = function (roomId, reason) {
        this.$log.appInfo("AudioCallDeclined", { roomId: roomId });
        var room = this.roomsService.rooms[roomId];
        if (!room || this.audioCallRequests.contains(roomId)) {
            this.audioCallCleanup(roomId);
            return;
        }
        this.audioCallCleanup(roomId);
        reason = "peer_" + reason;
        var messageKey = reason;
        if (reason.indexOf("unsupported") > -1)
            messageKey = "peer_unsupported";
        if (reason.indexOf("leftRoom") > -1)
            messageKey = "peer_disconnected";
        this.renderAudioCallChatMessage(roomId, messageKey);
        this.rtc.stopAudioCall(reason);
    };
    TextChatCtrl.prototype.audioCallHangouted = function (roomId, userId) {
        this.$log.appInfo("AudioCallHungUp", { roomId: roomId });
        if (userId === this.localUser.id)
            return;
        if (!this.roomsService.rooms[roomId])
            return;
        this.finishAudioCall(roomId, "peer_hangout");
    };
    TextChatCtrl.prototype.finishAudioCall = function (roomId, reason) {
        var _this = this;
        if (reason === void 0) { reason = "hangout"; }
        var room = this.roomsService.rooms[roomId];
        if (room && (!room.audioCallState || room.audioCallState === AudioCallState.finishing))
            return;
        var eventData = { roomId: roomId, userId: this.localUser.id, reason: reason };
        this.$log.appInfo("AudioCallFinishing", eventData);
        this.audioCallCleanup(roomId);
        if (room)
            room.audioCallState = AudioCallState.finishing;
        this.renderAudioCallChatMessage(roomId, reason);
        this.rtc.stopAudioCall(reason).then(function () {
            if (room)
                room.audioCallState = null;
            _this.$log.appInfo("AudioCallFinished", eventData);
        });
    };
    TextChatCtrl.prototype.cancelAudioCallTimeout = function () {
        if (this.requestAudioCallTimeout) {
            this.$timeout.cancel(this.requestAudioCallTimeout);
            this.requestAudioCallTimeout = null;
        }
    };
    TextChatCtrl.prototype.renderAudioCallChatMessage = function (roomId, reason) {
        var _this = this;
        var messageText;
        switch (reason) {
            case "busy":
                messageText = this.audioMessages.busy;
                break;
            case "unsupported_device":
                messageText = this.audioMessages.unsupportedDevice;
                break;
            case "unsupported_browser":
                messageText = this.audioMessages.unsupportedBrowser;
                break;
            case "unsupported_join":
                messageText = this.audioMessages.unsupportedJoin;
                break;
            case "decline_unsupported_device":
                messageText = this.audioMessages.declineUnsupportedDevice;
                break;
            case "decline_unsupported_browser":
                messageText = this.audioMessages.declineUnsupportedBrowser;
                break;
            case "decline_busy":
                messageText = this.audioMessages.declineBusy;
                break;
            case "peer_declined":
                messageText = this.audioMessages.peerDeclined;
                break;
            case "peer_unsupported":
                messageText = this.audioMessages.peerUnsupported;
                break;
            case "peer_busy":
                messageText = this.audioMessages.peerBusy;
                break;
            case "hangout":
                messageText = this.audioMessages.hangout;
                break;
            case "peer_hangout":
                messageText = this.audioMessages.peerHangout;
                break;
            case "peer_disconnected":
                messageText = this.audioMessages.peerDisconnected;
                break;
            default:
                this.$log.appError("FailedToMapReasonToMessage", { reason: reason });
                return;
        }
        var text = JSON.stringify({ audioMessage: messageText });
        this.$timeout(function () { return _this.roomsService.rooms[roomId].accessor.addMessage(MessageOrigin.system, null, null, null, text); });
    };
    TextChatCtrl.prototype.audioCallCleanup = function (roomId) {
        this.cancelAudioCallTimeout();
        var room = this.roomsService.rooms[roomId];
        if (room)
            room.audioCallState = null;
        if (this.audioCallRequests.contains(roomId)) {
            this.audioCallRequests.remove(roomId);
        }
    };
    TextChatCtrl.prototype.peerCreatedHandler = function (room, peer) {
        var _this = this;
        this.$log.appInfo("PeerCreatedHandler", { roomId: room.roomId });
        if (!room.audioCallState) {
            this.$log.appError("RoomAudioCallStateMissing", { roomId: room.roomId, userId: this.localUser.id });
            return;
        }
        if (room.audioCallState !== AudioCallState.connected) {
            this.$log.appInfo("AudioCallConnected", { roomId: room.roomId, userId: this.localUser.id });
            this.cancelAudioCallTimeout();
            room.audioCallState = AudioCallState.connected;
            room.accessor.addMessage(MessageOrigin.system, null, null, null, JSON.stringify({ audioStarted: this.audioMessages.youreConnected }));
            this.chatHub.audioCallConnected(room.roomId);
        }
        else
            this.$log.appError("UnexpectedRoomAudioCallState", { roomId: room.roomId, audioCallState: room.audioCallState });
        if (!peer || !peer.pc) {
            this.$log.appError("MissingAudioPeerHanlder", { roomId: room.roomId });
            return;
        }
        peer.pc.on("iceConnectionStateChange", function (event) {
            _this.$log.appInfo("IceConnectionStateChange", { state: peer.pc.iceConnectionState });
            if (peer.pc.iceConnectionState === "closed" || peer.pc.iceConnectionState === "failed") {
                if (!room.audioCallState) {
                    _this.$log.appWarn("MissingAudioCallStateOnIceClose", { roomId: room.roomId, iceState: peer.pc.iceConnectionState });
                    return;
                }
                if (peer.pc.iceConnectionState === "failed")
                    _this.$log.appInfo("IceConnectionFailed", { roomId: room.roomId, audioCallState: room.audioCallState });
                _this.finishAudioCall(room.roomId, "peer_disconnected");
            }
            else
                _this.$log.appWarn("UnhandledIceConnectionState", { state: peer.pc.iceConnectionState, audioCallState: room.audioCallState });
        });
    };
    TextChatCtrl.prototype.increaseNotificationCount = function () {
        if (this.$state.includes(States.textChat.name) === false) {
            var counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            this.countersService.setCounterValue(Services.Counters.TextChat, counterVal + 1);
        }
    };
    TextChatCtrl.prototype.decreaseNotificationCount = function () {
        if (this.$state.includes(States.textChat.name) === false) {
            var counterVal = this.countersService.getCounterValue(Services.Counters.TextChat);
            if (counterVal > 0)
                this.countersService.setCounterValue(Services.Counters.TextChat, counterVal - 1);
        }
    };
    TextChatCtrl.prototype.onRoomInputKeyDown = function (keyCode, roomId) {
        var sortedRoomIds = Object.keys(this.roomsService.rooms);
        if (sortedRoomIds.length >= 2 && (keyCode === 38 || keyCode === 40)) {
            var fxMoveRoomToEnd = function (room) { return sortedRoomIds.push(sortedRoomIds.splice(sortedRoomIds.indexOf(room.roomId), 1)[0]); };
            this.$scope.undockedRooms.forEach(fxMoveRoomToEnd);
            var roomIdIndex = sortedRoomIds.indexOf(roomId);
            if (keyCode === 38 && roomIdIndex > 0) {
                if (this.roomsService.rooms[roomId].isUndocked)
                    this.roomsService.rooms[sortedRoomIds[roomIdIndex - 1]].accessor.setFocusOnInput();
                this.showRoom(sortedRoomIds[roomIdIndex - 1]);
                this.$scope.$apply();
            }
            if (keyCode === 40 && roomIdIndex < sortedRoomIds.length - 1) {
                var nextRoomIndex = roomIdIndex + 1;
                var selectedRoom = this.roomsService.rooms[sortedRoomIds[nextRoomIndex]];
                if (!selectedRoom.isUndocked)
                    this.showRoom(sortedRoomIds[nextRoomIndex]);
                else
                    selectedRoom.accessor.setFocusOnInput();
                this.$scope.$apply();
            }
        }
        if (keyCode !== 13 && keyCode !== 38 && keyCode !== 40 && this.emitTyping)
            this.chatHub.setTypingActivityIn(roomId);
    };
    TextChatCtrl.prototype.addMutedUserIdToCookies = function (userId) {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (!cookiesValueString)
            cookiesValueString = "[]";
        var mutedUsers = JSON.parse(cookiesValueString);
        if (!mutedUsers.some(function (id) { return id === userId; }))
            mutedUsers.push(userId);
        this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
        this.loadMutedUsers();
    };
    TextChatCtrl.prototype.isUserMuted = function (userId) {
        return this.mutedUsers.some(function (id) { return id === userId; });
    };
    TextChatCtrl.prototype.removeMutedUserIdFromCookies = function (userId) {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (cookiesValueString) {
            var mutedUsers = JSON.parse(cookiesValueString);
            var indx = mutedUsers.indexOf(userId);
            if (indx !== -1) {
                mutedUsers.splice(indx, 1);
                this.$cookies.put(Config.CookieNames.mutedUsers, JSON.stringify(mutedUsers));
            }
        }
        this.loadMutedUsers();
    };
    TextChatCtrl.prototype.loadMutedUsers = function () {
        var cookiesValueString = this.$cookies.get(Config.CookieNames.mutedUsers);
        if (cookiesValueString)
            this.mutedUsers = JSON.parse(cookiesValueString);
    };
    TextChatCtrl.prototype.applyPendingStateRequest = function () {
        if (this.pendingStateRequest)
            this.applyStateChange(this.pendingStateRequest);
        this.pendingStateRequest = null;
    };
    TextChatCtrl.audioCallRequestTimeoutInMs = 2 * 60 * 1000;
    TextChatCtrl.$inject = ["$scope", "$log", "$cookies", "$timeout", "$state", "$uibModal", "spinnerService", "chatUsersService", "userService",
        "serverConnectionService", "textHubService", "simpleWebRtcService", "countersService", "statesService", "textChatSettings", "serverResources",
        "contactsService", "textChatRoomsService", "$location", "$filter"];
    return TextChatCtrl;
}());
var MessageOrigin = (function () {
    function MessageOrigin() {
    }
    MessageOrigin.self = "Self";
    MessageOrigin.otherUser = "OtherUser";
    MessageOrigin.news = "News";
    MessageOrigin.system = "System";
    return MessageOrigin;
}());
;
var TextChatUser = (function () {
    function TextChatUser(user) {
        this.isSelf = false;
        this.recentlyJoinedRooms = [];
        this.isPinned = false;
        this.isPrivatePartner = false;
        for (var prop in user)
            this[prop] = user[prop];
    }
    return TextChatUser;
}());
var ListOfUsersPublicRooms = (function () {
    function ListOfUsersPublicRooms() {
    }
    return ListOfUsersPublicRooms;
}());
var TextChat;
(function (TextChat) {
    var TextChatLobbyCtrl = (function () {
        function TextChatLobbyCtrl($scope, $uibModal, chatUsersService, $state, userService, serverResources, roomsService) {
            var _this = this;
            this.$uibModal = $uibModal;
            this.chatUsersService = chatUsersService;
            this.$state = $state;
            this.userService = userService;
            this.serverResources = serverResources;
            this.roomsService = roomsService;
            this.languages = Languages.langsById;
            this.countries = this.serverResources.getCountries();
            this.lobbyRoomId = Config.lobbySpecialRoom.name;
            this.allRooms = this.getListOfRooms();
            this.filteredRooms = this.getFilteredListOfRooms();
            this.isRoomJoined = function (roomId) { return _this.joinedRooms[roomId]; };
            this.isPrivateRoomJoined = function (partnerId) { return _this.joinedRooms[_this.roomsService.privateRoomIdFrom(partnerId)] != null; };
            this.onlineUsers = this.chatUsersService.onlineUsers;
            this.justLeftUsers = this.chatUsersService.justLeftUsers;
            this.totalUsersCount = function () { return _this.onlineUsers.length + _this.justLeftUsers.length + Math.round(_this.onlineUsers.length / 5); };
            this.selectedUserListOfRooms = null;
            this.currentTierFilter = 2;
            this.unMarkRecentUser = function (user) { return _this.chatUsersService.unMarkRecentUser(user, Config.lobbySpecialRoom.name); };
            this.onUserClick = function (userId) {
                _this.selectedUserId = _this.selectedUserId === userId ? undefined : userId;
                _this.showChatRequestMessageInProfile = false;
                _this.showRequestingChatLoaderInProfile = false;
                _this.selectedUserListOfRooms = null;
            };
            this.onRequestChat = function (userObj) {
                _this.showRequestingChatLoaderInProfile = true;
                _this.selectedUserId = userObj.user.id;
                _this.requestChat(userObj);
            };
            this.switchFilter = function () {
                _this.currentTierFilter = (_this.currentTierFilter % 3) + 1;
                _this.filteredRooms = _this.getFilteredListOfRooms();
            };
            $scope.$watchCollection(function () { return _this.chatUsersService.countOfUsers; }, function (newCounts) {
                _this.privateUsersCount = newCounts.inPrivateRooms;
                _this.secretRoomsUsersCount = newCounts.inSecretRooms;
            });
            $scope.$watchCollection(function () { return _this.chatUsersService.countOfUsers.forPublicRooms; }, function (newCounts) {
                angular.forEach(_this.allRooms, function (room) { return room.countOfUsers = newCounts[room.roomId]; });
                _this.filteredRooms = _this.getFilteredListOfRooms();
            });
            $scope.$on(StatesHelper.UiStateEventNames.$stateChangeSuccess, function (event, toState, toStateParams) { return delete _this.selectedUserId; });
            $scope.$on("onPrivateChatRequestResponseReceived", function (e, listOfRooms) {
                _this.showRequestingChatLoaderInProfile = false;
                if (listOfRooms.isNoPrivateChat) {
                    _this.selectedUserListOfRooms = [];
                    listOfRooms.roomIds.forEach(function (roomId) {
                        var title = null, url;
                        if (angular.isDefined(Config.TopicChatRooms[roomId]))
                            title = Config.TopicChatRooms[roomId].text;
                        else if (angular.isDefined(Languages[roomId]))
                            title = Languages[roomId].text;
                        else if (roomId.indexOf("+") !== -1) {
                            var _a = roomId.split('+'), langA = _a[0], langB = _a[1];
                            title = Languages[langA].text + " + " + Languages[langB].text;
                            url = _this.$state.href(_this.$state.get(States.textChatRoomDualLang.name), { langA: langA, langB: langB });
                        }
                        if (url == null)
                            url = _this.$state.href(_this.$state.get(States.textChatRoomPublic.name), { roomId: roomId });
                        if (title)
                            _this.selectedUserListOfRooms.push({ title: title, url: url });
                    });
                }
                else {
                    _this.showChatRequestMessageInProfile = true;
                }
            });
        }
        TextChatLobbyCtrl.prototype.getListOfRooms = function () {
            var _this = this;
            var user = this.userService.getUser();
            var rooms = new Array();
            var userLangIds = [user.knows, user.knows2, user.learns, user.learns2].filter(function (n) { return n !== null && n !== undefined; });
            angular.forEach(userLangIds, function (langId) {
                var language = Languages.langsById[langId];
                var roomUrl = _this.$state.href(States.textChatRoomPublic.name, { roomId: language.name });
                rooms.push({ roomId: language.name, roomLabel: language.text, roomUrl: roomUrl, tier: 1 });
            });
            var addedRoomIds = new Array();
            angular.forEach(userLangIds, function (langIdA) {
                angular.forEach(userLangIds, function (langIdB) {
                    if (langIdA === langIdB || langIdA > 11 || langIdB > 11)
                        return;
                    var _a = langIdA < langIdB ? [Languages.langsById[langIdA], Languages.langsById[langIdB]] : [Languages.langsById[langIdB], Languages.langsById[langIdA]], langA = _a[0], langB = _a[1];
                    var roomId = langA.name + "+" + langB.name;
                    if (addedRoomIds.indexOf(roomId) !== -1)
                        return;
                    addedRoomIds.push(roomId);
                    var roomUrl = _this.$state.href(States.textChatRoomDualLang.name, { langA: langA.name, langB: langB.name });
                    rooms.push({ roomId: roomId, roomLabel: langA.text + " + " + langB.text, roomUrl: roomUrl, tier: 1 });
                });
            });
            var otherRooms = new Array();
            angular.forEach(Languages.langsById, function (lang) {
                if (userLangIds.some(function (id) { return Languages.langsById[id].name === lang.name; }))
                    return;
                var roomUrl = _this.$state.href(States.textChatRoomPublic.name, { roomId: lang.name });
                otherRooms.push({ roomId: lang.name, roomLabel: lang.text, roomUrl: roomUrl, tier: 3 });
            });
            otherRooms = otherRooms.sort(function (a, b) { return a.roomLabel <= b.roomLabel ? -1 : 1; });
            return rooms.concat(otherRooms);
        };
        TextChatLobbyCtrl.prototype.getFilteredListOfRooms = function () {
            var _this = this;
            return this.allRooms.filter(function (room) { return room.tier <= _this.currentTierFilter || (_this.currentTierFilter === 2 && room.countOfUsers >= 2); });
        };
        TextChatLobbyCtrl.prototype.sortUsersByName = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Name);
        };
        TextChatLobbyCtrl.prototype.sortUsersByKnows = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Knows);
        };
        TextChatLobbyCtrl.prototype.sortUsersByLearns = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Learns);
        };
        TextChatLobbyCtrl.prototype.sortUsersByCountry = function () {
            this.chatUsersService.unmarkRecentUsers();
            this.chatUsersService.sortBy(Services.UsersSortingOptions.Country);
        };
        TextChatLobbyCtrl.$inject = ["$scope", "$uibModal", "chatUsersService", "$state", "userService", "serverResources", "textChatRoomsService"];
        return TextChatLobbyCtrl;
    }());
    TextChat.TextChatLobbyCtrl = TextChatLobbyCtrl;
})(TextChat || (TextChat = {}));
var TextChat;
(function (TextChat) {
    var TextChatLobbyDirective = (function () {
        function TextChatLobbyDirective() {
            this.link = function ($scope, element, attr, lobby) { };
            this.$scope = {};
            this.templateUrl = "text-chat-lobby.tpl";
            this.controller = "TextChatLobbyCtrl";
            this.controllerAs = "lobby";
            this.bindToController = {
                joinedRooms: "=",
                goToPrivate: "&",
                requestChat: "&",
                isUserMuted: "=",
                onSwitchUserMute: "="
            };
            this.rerstrict = "E";
            this.replace = true;
        }
        return TextChatLobbyDirective;
    }());
    TextChat.TextChatLobbyDirective = TextChatLobbyDirective;
})(TextChat || (TextChat = {}));
var Validation;
(function (Validation) {
    var ValidationEmailDirective = (function () {
        function ValidationEmailDirective() {
            var _this = this;
            this.emailRegexp = /^[_a-z0-9]+[a-z0-9.+-]*@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,15}$/i;
            this.require = "ngModel";
            this.restrict = "A";
            this.link = function (scope, elm, attrs, ctrl) {
                var emailRegExpLocal = _this.emailRegexp;
                if (ctrl && ctrl.$validators.email) {
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || emailRegExpLocal.test(modelValue);
                    };
                }
            };
        }
        return ValidationEmailDirective;
    }());
    Validation.ValidationEmailDirective = ValidationEmailDirective;
})(Validation || (Validation = {}));
var _this = this;
window.onerror = function (msg, url, line) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/api/log", true);
    xmlhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xmlhttp.send(JSON.stringify({
        logger: "javascript",
        level: "Error",
        path: window.location.pathname,
        message: "JavascriptError = " + JSON.stringify({ error: msg, url: url, line: line })
    }));
    debugger;
};
var Config;
(function (Config) {
    Config.clientVersion = "166";
    var Loggers;
    (function (Loggers) {
        Loggers.client = "WebClient";
        Loggers.angular = "Angular";
        Loggers.ajax = "Ajax";
        Loggers.signalR = "SignalRClient";
    })(Loggers = Config.Loggers || (Config.Loggers = {}));
    var Ajax;
    (function (Ajax) {
        Ajax.timewarningInMs = 3000;
        Ajax.timeoutInMs = 10000;
    })(Ajax = Config.Ajax || (Config.Ajax = {}));
    var EndPoints;
    (function (EndPoints) {
        EndPoints.postDeleteAccount = "/api/account/delete";
        EndPoints.getResendEmailVerification = "/api/account/resend-email-verification";
        EndPoints.postTilesFilter = "/api/account/filter";
        EndPoints.profileUrl = "/api/account/profile";
        EndPoints.postContactUsMessage = "/api/care/message";
        EndPoints.getContactsList = "/api/contact-list";
        EndPoints.postContactsAdd = "/api/contact-list/add";
        EndPoints.postContactsRemove = "/api/contact-list/remove";
        EndPoints.remoteLog = "/api/log";
        EndPoints.postMail = "/api/mailbox/post-mail";
        EndPoints.getListOfMails = "/api/mailbox/get-list-of-mails";
        EndPoints.getMailContent = "/api/mailbox/get-mail-content";
        EndPoints.postArchiveThread = "/api/mailbox/archive";
        EndPoints.getMemberProfile = "/api/members/get-profile";
        EndPoints.postMembersList = "/api/members/list";
    })(EndPoints = Config.EndPoints || (Config.EndPoints = {}));
    var CookieNames;
    (function (CookieNames) {
        CookieNames.deviceTag = "DeviceTag";
        CookieNames.oldUiCulture = "OldUiCulture";
        CookieNames.sessionTag = "SessionTag";
        CookieNames.uiCulture = "UiCulture";
        CookieNames.loggedIn = "LoggedIn";
        CookieNames.playMessageAddedSound = "PlayMessageAddedSound";
        CookieNames.sharedSkypeId = "SharedSkypeId";
        CookieNames.sharedSecretRoom = "SharedSecretRoom";
        CookieNames.sharedEmailAddress = "SharedEmailAddress";
        CookieNames.playUserNewInvitation = "PlayUserNewInvitation";
        CookieNames.mutedUsers = "MutedUsers";
        CookieNames.roomsFromPreviousSession = "RoomsFromPreviousSession";
        CookieNames.lastStates = "LastStates";
    })(CookieNames = Config.CookieNames || (Config.CookieNames = {}));
    ;
    Config.lobbySpecialRoom = { name: "text-chat-lobby", text: null };
    var TopicChatRooms;
    (function (TopicChatRooms) {
        TopicChatRooms.hellolingo = { name: "hellolingo", text: "Hellolingo" };
    })(TopicChatRooms = Config.TopicChatRooms || (Config.TopicChatRooms = {}));
    Config.isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    var Regex;
    (function (Regex) {
        Regex.secretRoom = /^[a-zA-Z0-9]{6,20}$/;
    })(Regex = Config.Regex || (Config.Regex = {}));
})(Config || (Config = {}));
var app = angular.module("app", ["app.filters", "ngCookies", "ct.ui.router.extras", "ui.bootstrap", "ngAnimate", "ngSanitize", "pascalprecht.translate"]);
app.config(["$locationProvider", "$httpProvider", "$stateProvider", "$stickyStateProvider", "$urlRouterProvider",
    "$translateProvider", "serverResourcesProvider", "$cookiesProvider",
    function ($locationProvider, $httpProvider, $stateProvider, $stickyStateProvider, $urlRouterProvider, $translateProvider, serverResourcesProvider, $cookiesProvider) {
        StatesHelper.createUiRouterStates($stateProvider);
        $urlRouterProvider.otherwise(function ($injector, $location) {
            $injector.get("$log").appWarn("Angular404", { url: $location.path() });
            $injector.get("$state").go(States.home.name);
        });
        $locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix("!");
        $httpProvider.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
        $httpProvider.interceptors.push(["$q", "$log", "$injector", Services.AjaxManager.factory]);
        $cookiesProvider.defaults.expires = new Date(2099, 1, 31, 0, 0, 0);
        serverResourcesProvider.setupTranslationService($translateProvider);
    }
]);
var Runtime;
(function (Runtime) {
    var SharedLingoData = (function () {
        function SharedLingoData() {
        }
        return SharedLingoData;
    }());
    Runtime.SharedLingoData = SharedLingoData;
    var TextChatSettings = (function () {
        function TextChatSettings() {
        }
        Object.defineProperty(TextChatSettings, "playMessageAddedSound", {
            get: function () { return Runtime.getBooleanCookie(Config.CookieNames.playMessageAddedSound, true); },
            set: function (val) { Runtime.saveBooleanCookie(Config.CookieNames.playMessageAddedSound, val); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextChatSettings, "playUserNewInvitation", {
            get: function () { return Runtime.getBooleanCookie(Config.CookieNames.playUserNewInvitation, true); },
            set: function (val) { Runtime.saveBooleanCookie(Config.CookieNames.playUserNewInvitation, true); },
            enumerable: true,
            configurable: true
        });
        return TextChatSettings;
    }());
    Runtime.TextChatSettings = TextChatSettings;
    function getBooleanCookie(cookieName, defaultValue) {
        var val = Runtime.ngCookies.get(cookieName);
        return val == undefined ? defaultValue : val === "true";
    }
    Runtime.getBooleanCookie = getBooleanCookie;
    function saveBooleanCookie(cookieName, val) { Runtime.ngCookies.put(cookieName, val ? "true" : "false"); }
    Runtime.saveBooleanCookie = saveBooleanCookie;
})(Runtime || (Runtime = {}));
app.run(["$rootScope", "$cookies", "$state", "$log", "$window", "$http", "authService", "userService", "spinnerService", "$stickyState", "serverResources", "modalService", "$location",
    function ($rootScope, $cookies, $state, $log, $window, $http, authService, userService, spinnerService, $stickyState, serverResources, modalService, $location) {
        Services.EnhancedLog.http = $http;
        Runtime.SharedLingoData.first = $location.search().first;
        Runtime.SharedLingoData.last = $location.search().last;
        Runtime.SharedLingoData.birthYear = $location.search().bornYear;
        Runtime.SharedLingoData.email = $location.search().email;
        Runtime.SharedLingoData.gender = $location.search().gender;
        Runtime.SharedLingoData.natives = $location.search().natives;
        Runtime.SharedLingoData.learns = $location.search().learns;
        Runtime.SharedLingoData.countryCode = $location.search().countryCode;
        Runtime.SharedLingoData.city = $location.search().city;
        $rootScope.goToState = function (stateName) { return $state.go(stateName); };
        $rootScope.$state = $state;
        Runtime.ngCookies = $cookies;
        Runtime.uiCultureCode = $cookies.get(Config.CookieNames.uiCulture);
        Runtime.sessionTag = $cookies.get(Config.CookieNames.sessionTag);
        if (!Runtime.uiCultureCode || Runtime.uiCultureCode == undefined) {
            setTimeout(function () {
                $log.appWarn("MissingProperCookies", Runtime.ngCookies.getAll());
                $rootScope.taskBarAlert("Cookies are disabled! :-(");
                $rootScope.fatalFailure = true;
            }, 1);
            return;
        }
        else
            $log.appInfo("CookieReport", Runtime.ngCookies.getAll());
        $log.appInfo("InitialWindowSize", { width: $(window).innerWidth(), height: $(window).innerHeight() });
        $(window).resize(function () {
            clearTimeout(_this.resizeTimeout);
            _this.resizeTimeout = setTimeout(function () {
                $log.appInfo("WindowResized", { width: $(window).innerWidth(), height: $(window).innerHeight() });
            }, 500);
        });
        $rootScope.$on("$stateChangeStart", function (event, toState, toParam, fromState) {
            StatesHelper.onStateChangeStart(event, toState, toParam, fromState, $log, spinnerService, authService, userService, $state, $stickyState, modalService, $cookies);
        });
        $rootScope.$on("$stateChangeSuccess", function (event, toState, toParam, fromState) {
            $log.appInfo("StateChangeSuccess", { from: fromState.name, to: toState.name, toParam: toParam });
            spinnerService.showSpinner.show = false;
            $window.scrollTo(0, 0);
            if (toState.name === States.emailNotConfirmed.name)
                !userService.getUser().isEmailConfirmed
                    ? modalService.openEmailIsNotConfirmModal()
                    : $state.go(States.home.name);
            StatesHelper.saveOpenedStateInCookies($state, $cookies);
        });
        $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
            $log.appError("StateChangeError", { from: fromState.name, to: toState.name });
            spinnerService.showSpinner.show = false;
            throw error;
        });
        var checkCount = 0;
        var newClientRequestReceived = false;
        var check = function () { return $http.post("/api/check", { version: Config.clientVersion, count: checkCount++ })
            .success(function (response) {
            if (response.message && response.message.code === 0) {
                if (newClientRequestReceived) {
                    $log.appInfo("ForcingPageRefreshToGetNewClient");
                    window.onbeforeunload = null;
                    window.location.href = window.location.href;
                }
                newClientRequestReceived = true;
                serverResources.getServerResponseText(response.message.code).then(function (serverMessage) {
                    $rootScope.taskBarAlert(serverMessage);
                });
            }
        }); };
        check();
        setInterval(check, 300000);
        $window.onbeforeunload = function () {
            if (!Config.isFirefox) {
                if ($state.includes(States.signup.name) || ($state.includes(States.mailboxUser.name) && $state.params["isNew"])) {
                    $log.appInfo("PageRefreshOrClosePrevented", { state: $state.current.name });
                    return "";
                }
            }
            $log.appInfo("PageRefreshOrCloseAccepted", { state: $state.current.name });
            return undefined;
        };
    }]);
app.service("$log", Services.EnhancedLog);
app.service("statesService", Services.StatesService);
app.service("userService", Authentication.UserService);
app.service("authService", Authentication.AuthenticationService);
app.service("spinnerService", Services.SpinnerService);
app.service("membersService", Services.MembersService);
app.service("mailboxServerService", MailBox.MailboxServerService);
app.service("chatUsersService", Services.ChatUsersService);
app.service("textChatRoomsService", Services.TextChatRoomsService);
app.service("serverConnectionService", Services.ServerSocketService);
app.service("simpleWebRtcService", Services.RtcService);
app.service("textHubService", Services.TextChatHubService);
app.service("voiceHubService", Services.VoiceChatHubService);
app.service("modalService", Services.ModalWindowService);
app.service("countersService", Services.TaskbarCounterService);
app.service("modalLanguagesService", Services.ModalSelectLanguageService);
app.service("contactsService", Services.ContactsService);
app.service("textChatSettings", Services.TextChatSettingsService);
app.service("translationErrorsHandler", ["$log", Services.translationErrorsHandlerService]);
app.provider("serverResources", Services.ServerResourcesProvider);
app.controller("TextChatCtrl", TextChatCtrl);
app.controller("TaskbarCtrl", TaskbarCtrl);
app.controller("TextChatLobbyCtrl", TextChat.TextChatLobbyCtrl);
app.controller("FindCtrl", Find.FindMembersCtrl);
app.controller("MailboxCtrl", MailBox.MailBoxCtrl);
app.controller("UserProfileCtrl", Profile.ProfileController);
app.controller("UserProfileModalCtrl", Profile.ProfileModalController);
app.controller("ContactUsCtrl", ContactUsCtrl);
app.controller("HomeFindBlockCtrl", HomeFindBlockCtrl);
app.directive("textChatRoom", ["$sce", "$cookies", "$timeout", "userService", "chatUsersService", "$state", function ($sce, $cookies, $timeout, userService, chatUsersService, $state) { return new TextChatRoom($sce, $cookies, $timeout, userService, chatUsersService, $state); }]);
app.directive("allowPattern", function () { return new AllowPattern(); });
app.directive("trimPassword", function () { return new TrimPasswordDirective(); });
app.directive("strictEmailValidator", function () { return new Validation.ValidationEmailDirective(); });
app.directive("onEnter", function () { return new OnEnter(); });
app.directive("title", ["$rootScope", "serverResources", function ($rootScope, serverResources) { return new Title($rootScope, serverResources); }]);
app.directive("focusOnShow", ["$timeout", function ($timeout) { return new FocusOnShow($timeout); }]);
app.directive("signUp", Authentication.SignUpDirective.factory());
app.directive("logInOrOut", Authentication.LogInOrOutDirective.factory());
app.directive("logIn", Authentication.LogInDirective.factory());
app.directive("showDuringChangeState", ShowDuringChangeState.factory());
app.directive("tooltipLink", function () { return new TooltipLink(); });
app.directive("textChatLobby", function () { return new TextChat.TextChatLobbyDirective; });
app.directive("messageStatus", function () { return new MailBox.MessageStatusDirective(); });
app.directive("messagesHistory", function () { return new MailBox.MessagesHistoryDirective(); });
app.directive("userProfile", function () { return new Profile.ProfileDirective(); });
app.directive("profileLangsPicker", function () { return new Profile.ProfileLangsPicker(); });
app.directive("profileView", function () { return new ProfileViewDirective(); });
app.directive("dashboard", function () { return new Dashboard.DashboardDirective(); });
app.directive("dashboardTile", function () { return new Dashboard.DashboardTileDirective(); });
app.directive("switch", ["$parse", function ($parse) { return new SwitchDirective($parse); }]);
app.directive("tileWidget", ["$parse", "$compile", "$injector", function ($parse, $compile, $injector) { return new Dashboard.WidgetTileDirective($parse, $compile, $injector); }]);
app.directive("contactsTileWidget", function () { return new Contacts.DashboardWidget(); });
app.directive("languageSelect", ["modalLanguagesService", function (modalLanguagesService) { return new LanguageSelectDirective(modalLanguagesService); }]);
app.directive("selectLanguagesWidget", ["$compile", "serverResources", function ($compile, serverResources) { return new LanguageSelectWidgetDIrective($compile, serverResources); }]);
app.directive("taskbarButton", ["countersService", "$timeout", "authService", "$state", "$stickyState", "$log", "statesService", function (countersService, $timeout, authService, $state, $stickyState, $log, statesService) { return new TaskButtonDirective(countersService, $timeout, authService, $state, $stickyState, $log, statesService); }]);
app.directive("uiCultureDropDown", ["$templateCache", "authService", "$stickyState", "$state", "modalService", function ($templateCache, authService, $stickyState, $state, modalService) { return new UiCultureDropDown($templateCache, authService, $stickyState, $state, modalService); }]);
app.config(["$httpProvider", function ($httpProvider) {
        if (!$httpProvider.defaults.headers.get)
            $httpProvider.defaults.headers.get = {};
        $httpProvider.defaults.headers.get["Cache-Control"] = "no-cache";
        $httpProvider.defaults.headers.get["Pragma"] = "no-cache";
    }]);
var Helper;
(function (Helper) {
    function safeApply(scope) {
        if (!scope.$$phase)
            scope.$apply();
    }
    Helper.safeApply = safeApply;
})(Helper || (Helper = {}));
var Dashboard;
(function (Dashboard) {
    var TileFilterValue;
    (function (TileFilterValue) {
        TileFilterValue[TileFilterValue["Promote"] = 1] = "Promote";
        TileFilterValue[TileFilterValue["Demote"] = 2] = "Demote";
    })(TileFilterValue = Dashboard.TileFilterValue || (Dashboard.TileFilterValue = {}));
    var TileType;
    (function (TileType) {
        TileType[TileType["Header"] = 1] = "Header";
        TileType[TileType["Feature"] = 2] = "Feature";
        TileType[TileType["Url"] = 3] = "Url";
        TileType[TileType["Widget"] = 4] = "Widget";
    })(TileType = Dashboard.TileType || (Dashboard.TileType = {}));
})(Dashboard || (Dashboard = {}));
//# sourceMappingURL=app.js.map