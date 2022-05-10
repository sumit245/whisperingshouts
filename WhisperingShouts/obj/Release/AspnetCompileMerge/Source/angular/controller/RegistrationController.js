var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('RegistrationController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    $scope.IsReferralCodeExists = false;

    var CurrentPage = $location.path();
    if (CurrentPage.indexOf("registration") < 0) {
        LoginService.CheckSession();
        GetProfileData();
    }

    var path = $location.$$path.split("/");
    $scope.refrelcode = path[path.length - 1];

    if ($scope.refrelcode !== undefined && $scope.refrelcode !== "registration") {
        $scope.IsReferralCodeExists = true;
    }
    else {
        $scope.refrelcode = "";
    }

    $scope.ThankYouPage = false;
    $scope.PhoneNumberValidation = /[6789][0-9]{9}/;
    $scope.EmailValidation = /[^@]+@[^@]+\.[a-zA-Z]{2,6}/;
    $scope.AadhaarValidation = /[0-9]{12}/;
    $scope.uname1 = /[A-Z][a-zA-Z]{6}[0-9]{5}/;
    $scope.PanValidation = /[a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}/;

    $scope.previewimage = "img/user_image1.png";

    /////////Start Get Geo Location//////
    $scope.Latitude = "";
    $scope.Longitude = "";
    $scope.LocationErrorMSG = "";
    GetCurrentLocation();
    /////////End Get Geo Location//////

    $scope.Register = function () {

        if ($scope.password !== $scope.confirmpassword) {
            GetAlert("Password and confirm password should be same!", "error");
        }
        else {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    username: $scope.username,
                    emailid: $scope.emailid,
                    mobileno: $scope.mobileno,
                    password: $scope.password,
                    refrelcode: $scope.refrelcode === undefined ? "" : $scope.refrelcode,
                    latitude: $scope.Latitude,
                    longitude: $scope.Longitude
                };
                $http({
                    method: 'POST',
                    url: 'WhisperingShoutsService.asmx/Register',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];
                            if (details.ResponseType == "success")
                                $scope.ThankYouPage = true;
                            else
                                GetAlert(details.ResponseMSG, details.ResponseType);
                        }
                    }),
                    error(function (ex) {
                        ajaxindicatorstop();
                        GetAlert("Slow network detected, please try again!", "error");
                    });
            }
            catch (ex) {
                //ajaxindicatorstop();
            }
        }
    };

    function GetProfileData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetDashboardData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.ProfileData = _data;
                        $scope.DashboardData = _data[0];
                        $scope.previewimage = "/Album/ProfilePic/" + _data[0].image_path;
						$scope.filename =  _data[0].image_path;
                        $scope.username = _data[0].name;
                        $scope.mobileno = _data[0].mobile;
                        $scope.pancard = _data[0].pancard;
                        $scope.aadhaarcard = _data[0].aadhaar_card;
                        $scope.bankname = _data[0].bank_name;
                        $scope.bankaccount = _data[0].account_no;
                        $scope.bankifsc = _data[0].IFSC;
                        $scope.bankupi = _data[0].UPI;

                        $scope.initialMobileNo = _data[0].mobile;
                        $scope.initialMobileVerified = _data[0].mobileVerified;

                        $scope.mobileVerified = _data[0].mobileVerified;
                        $scope.emailVerified = _data[0].emailVerified;

                        $scope.kyc_approved = _data[0].kyc_approved;
                    }
                }),
                error(function (ex) {
                    ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    $scope.UpdateProfile = function () {

        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                username: $scope.username,
                mobileno: $scope.mobileno,
                filename: $scope.filename,
                pancard: $scope.pancard,
                aadhaarcard: $scope.aadhaarcard,
                bankname: $scope.bankname,
                bankaccount: $scope.bankaccount,
                bankifsc: $scope.bankifsc,
                bankupi: $scope.bankupi
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/UpdateProfile',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
					window.a = _data;
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, "", 'yes');
                    }else{
						 GetAlert('Profile updated.', 'success');
					}
                }),
                error(function (ex) {
                    ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    };

    function GetCurrentLocation() {
        getLocation();
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                $scope.LocationErrorMSG = "Geolocation is not supported by this browser.";
                console.log($scope.LocationErrorMSG);
            }
        }
        function showPosition(position) {
            $scope.Latitude = position.coords.latitude;
            $scope.Longitude = position.coords.longitude;

            //console.log($scope.Latitude);
            //console.log($scope.Longitude);

            //x.innerHTML = "Latitude: " + position.coords.latitude +
            //    "<br>Longitude: " + position.coords.longitude;
        }
        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.LocationErrorMSG = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.LocationErrorMSG = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    $scope.LocationErrorMSG = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.LocationErrorMSG = "An unknown error occurred.";
                    break;
            }
            console.log($scope.LocationErrorMSG);
        }
    }

    $("#fldselfie").change(function () {
        var IsOk = 1;

        ajaxindicatorstart('please wait..');

        var fileUpload = $("#fldselfie").get(0);
        var files = fileUpload.files;
        var test = new FormData();
        for (var i = 0; i < files.length; i++) {
            test.append(files[i].name, files[i]);
        }
        //?profileid=" + $scope.profileid
        $.ajax({
            url: "FileHandler.ashx",
            type: "POST",
            contentType: false,
            processData: false,
            data: test,
            success: function (result) {
                ajaxindicatorstop();
                if (result === "fail") {
                    $scope.$apply(function () {
                        $scope.textcolor = "red";
                        $scope.filename = "";
                        $scope.fileuploadmsg = "File uploading fail, please try again";
                    });
                }
                else {
                    $scope.$apply(function () {
                        $scope.textcolor = "green";
                        $scope.filename = result;
                        $scope.fileuploadmsg = "File uploaded successfully";
                        $scope.previewimage = "/Album/ProfilePic/" + $scope.filename;
                    });
                }
            },
            error: function (err) {
                IsOk = 0;
                ajaxindicatorstop();
                GetAlert(err.statusText, "error");
            }
        });
    });

    $scope.UploadImage = function () {

        var IsOk = 1;

        ajaxindicatorstart('please wait..');

        var fileUpload = $("#fldselfie").get(0);
        var files = fileUpload.files;
        var test = new FormData();
        for (var i = 0; i < files.length; i++) {
            test.append(files[i].name, files[i]);
        }
        //?profileid=" + $scope.profileid
        $.ajax({
            url: "FileHandler.ashx",
            type: "POST",
            contentType: false,
            processData: false,
            data: test,
            success: function (result) {
                ajaxindicatorstop();
                if (result === "fail") {
                    $scope.$apply(function () {
                        $scope.textcolor = "red";
                        $scope.filename = "";
                        $scope.fileuploadmsg = "File uploading fail, please try again";
                    });
                }
                else {
                    $scope.$apply(function () {
                        $scope.textcolor = "green";
                        $scope.filename = result;
                        $scope.fileuploadmsg = "File uploaded successfully";
                    });
                }
            },
            error: function (err) {
                IsOk = 0;
                ajaxindicatorstop();
                GetAlert(err.statusText, "error");
            }
        });

        return IsOk;
    };

    $scope.setFocus = function (nextId) {
        var code1 = $window.document.getElementById('code' + (nextId - 1));
        var code2 = $window.document.getElementById('code' + nextId);
        if (code1.value != '')
            code2.focus();
        else {
            code1.focus();
        }
    };

    $scope.generateOtp = function () {

        if ($scope.mobileno === null || $scope.mobileno === undefined || $scope.mobileno === "") {
            GetAlert("* Please enter mobile.", "error");
        }
        else if ($scope.mobileno.length !== 10) {
            GetAlert("* Please enter valid mobile.", "error");
        }
        else {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    mobile: $scope.mobileno,
                    otpType: 'verify mobile',
                    userType: 'user'
                };
                $http({
                    method: 'POST',
                    url: 'WhisperingShoutsService.asmx/generateOtp',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null) {
                            var details = _data["Table"][0];
                            if (details.success === 1) {
                                $scope.showOtpVerifaction = true;
                                $("#spnMsg").html("OTP has been sent to your registered number.");
                                //$scope.otp = details.otp;
                            }
                            else { GetAlert(details.message, 'error'); }
                        }
                    }),
                    error(function (ex) {
                        ajaxindicatorstop();
                        GetAlert("Slow network detected, please try again!", "error");
                    });
            }
            catch (ex) {
                //ajaxindicatorstop();
            }
        }
    };

    $scope.verifyOtp = function () {

        if ($scope.mobileno === null || $scope.mobileno === undefined || $scope.mobileno === "") {
            GetAlert("* Please enter mobile.", "error");
        }
        else if ($scope.mobileno.length !== 10) {
            GetAlert("* Please enter valid mobile.", "error");
        }
        else if ($scope.code1 === null || $scope.code1 === undefined || $scope.code1 === ""
            || $scope.code2 === null || $scope.code2 === undefined || $scope.code2 === ""
            || $scope.code3 === null || $scope.code3 === undefined || $scope.code3 === ""
            || $scope.code4 === null || $scope.code4 === undefined || $scope.code14 === "") {
            GetAlert("* Please enter verification code.", "error");
        }
        else {
            var finalOtp = $scope.code1 + '' + $scope.code2 + '' + $scope.code3 + '' + $scope.code4;

            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    mobile: $scope.mobileno,
                    otp: finalOtp,
                    otpType: 'verify mobile',
                    userType: 'user'
                };
                $http({
                    method: 'POST',
                    url: 'WhisperingShoutsService.asmx/verifyOtp',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null) {
                            var details = _data["Table"][0];
                            if (details.success === 1) {
                                $scope.mobileVerified = 1;
                                $("#spnMsg").html("Your mobile has been verified successfully!.");
                                $scope.code1 = null;
                                $scope.code2 = null;
                                $scope.code3 = null;
                                $scope.code4 = null;
                                $scope.showOtpVerifaction = false;
                            }
                            else { GetAlert(details.message, 'error'); }
                        }
                    }),
                    error(function (ex) {
                        ajaxindicatorstop();
                        GetAlert("Slow network detected, please try again!", "error");
                    });
            }
            catch (ex) {
                //ajaxindicatorstop();
            }
        }
    }

    $scope.checkMobileChanged = function () {
        if ($scope.mobileno.length == 10) {
            if ($scope.initialMobileNo !== $scope.mobileno) {
                $scope.mobileVerified = 0;
            }
            else {
                $scope.mobileVerified = $scope.initialMobileVerified;
            }
        }
    }
    $("#branchAddress").html('');

    $("#bankifsc").blur(function () {
        $scope.verifyUPI(false);
    });

    $scope.verifyUPI = function (_update) {
        $("#branchAddress").html('');
        var _obj = {
            ifscCode: $scope.bankifsc
        }
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/verifyIFSC',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data.Table.length > 0) {
                        $scope.msgColor = 'green';
                        $("#branchAddress").html("IFSC code has been verified");
                        if (_update == true) {
                            UpdateProfile();
                        }
                    }
                    else {
                        $scope.msgColor = 'red';
                        $("#branchAddress").html("Invalid IFSC Code");
                    }
                }),
                error(function (ex) {
                    ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

});