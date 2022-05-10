var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('ContestsController', function ($scope, $http, $filter, $window, $rootScope, $location) {

    /////////Start Get Geo Location//////
    $scope.Latitude = "";
    $scope.Longitude = "";
    $scope.LocationErrorMSG = "";
    GetCurrentLocation();
    //GetTimeRemainingForQuiz();
    /////////End Get Geo Location//////

    //LoginService.CheckSession();
    //console.log('_' + Math.random().toString(36).substr(2, 9));

    //$.getJSON("http://jsonip.com/?callback=?", function (data) {
    //    console.log(data);
    //    alert(data.ip);
    //});
    //console.log(uniqueID());

    //if (localStorage.getItem("DummyUserID") === undefined || localStorage.getItem("DummyUserID") === null || localStorage.getItem("DummyUserID") === "") {
    //    localStorage.setItem("DummyUserID", uniqueID());
    //}
    //console.log(localStorage.getItem("DummyUserID"));

    $scope.Step1 = true;
    $scope.PartnerName = "";
    //GetContestsQuestion();
    $scope.QuestionAnswer = [];
    $scope.DummyUserID = uniqueID();
    //GetContest(2);

    //GetContest(0);

    var path = $location.$$path.split("/");
    $scope.ContestSlug = path[path.length - 1];

    if ($scope.ContestSlug === undefined || $scope.ContestSlug === null || $scope.ContestSlug === "contests") {
        GetContest(0);
    }
    else if ($scope.ContestSlug.indexOf("-") > 0) {
        var blog_id = $scope.ContestSlug.split("-");
        $scope.blog_id = blog_id[blog_id.length - 1];

        if ($scope.blog_id !== undefined && $scope.blog_id !== null && $scope.blog_id !== "") {
            GetContest($scope.blog_id);
        }
    }

    $scope.GetContestPage = function (PartnerSite, contest_id) {
        $window.location.href = '/contests/' + PartnerSite.toLowerCase() + '-' + contest_id;
    };

    function GetContestsQuestion(contest_id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                contest_id: contest_id
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetContestsForUser',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (details.QuizOver === 1) {
                            $scope.UserAlreadySubmitted = true;
                        }
                        else {
                            $scope.UserAlreadySubmitted = false;
                        }

                        $scope.ContestsData = _data;

                        //console.log($scope.ContestsData);

                        $scope.AllQuestions = [];

                        if (_data.length > 0) {
                            for (var i in _data) {
                                $scope.AllQuestions.push(_data[i].QuestionText);
                                //$scope.AllQuestions.push({
                                //    QuestionID: _data[i].QuestionID,
                                //    QuestionText: _data[i].QuestionText
                                //});
                            }
                        }

                        //console.log($scope.AllQuestions);

                        var uniqueQuestions = $scope.AllQuestions.filter(onlyUnique);
                        $scope.AllQuestions = uniqueQuestions;


                        //console.log($scope.AllQuestions);
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

    $scope.GetContest = function (contest_id) {
        GetContest(contest_id);
    };

    function GetContest(contest_id) {
        try {
            //ajaxindicatorstart('please wait..');
            var _obj = {
                id: contest_id,
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetContests',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.ContestsList = _data;
                        if (contest_id !== 0) {
                            $("#spnTnC").html(_data[0].tnc);
                            $scope.ContestOk = true;
                            $scope.contest_id = contest_id;
                            $scope.PartnerName = _data[0].PartnerSite;
                            GetContestsQuestion(contest_id);
                        }
                    }
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    $scope.SetQuestionAnswer = function (AnswerID, QuestionID) {
        //console.log(AnswerID);

        $('label[name=li_' + QuestionID + ']').removeClass('selectedclass');

        $('#li_' + AnswerID).addClass('selectedclass');

        //Find index of specific object using findIndex method.    
        var objIndex = $scope.QuestionAnswer.findIndex(obj => obj.QuestionID === QuestionID);

        if (objIndex !== undefined && objIndex !== null && objIndex !== "" && objIndex >= 0) {
            //Log object to Console.
            console.log("Before update: ", $scope.QuestionAnswer[objIndex]);

            //Update object's name property.
            $scope.QuestionAnswer[objIndex].AnswerID = AnswerID;

            //Log object to console again.
            console.log("After update: ", $scope.QuestionAnswer[objIndex]);
        }

        else {
            $scope.QuestionAnswer.push({
                QuestionID: QuestionID,
                AnswerID: AnswerID
            });
        }

        SubmitAnswer(QuestionID, AnswerID, "TMP", 0, $scope.contest_id, "");

        //$('li').removeClass('selectedclass'); 
        //$('input[name=rdbanswer_' + QuestionID + ']').attr("disabled", true);
        //$('label:has(input:checked)').addClass('selectedclass');
        //$('label:has(input:not(:checked))').removeClass('selectedclass');

    };

    function GetUniqueID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function uniqueID() {
        function chr4() {
            return Math.random().toString(16).slice(-4);
            //return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5));
            //return (Date.now().toString(36) + Math.random().toString(16).substr(2, 5));
        }
        return chr4() + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() +
            '-' + chr4() + chr4() + chr4();
    }

    $scope.CheckAnswer = function () {
        if ($scope.AllQuestions.length !== $scope.QuestionAnswer.length) {
            GetAlert("All questions are mandatory", "error");
        }
        else {
            $scope.Step1 = false; $scope.Step2 = false; $scope.Step3 = false; $scope.Step4 = true;
        }
    };

    $scope.SubmitContests = function (type) {
        if (type === 'Login') {
            Login($scope.emailid, $scope.password, 0, $scope.partner_user_name_login);
        }
        else if (type === 'Register') {
            Register($scope.partner_user_name);
        }
    };
    //SubmitAnswer(0, 0, "REAL", details.id);
    function SubmitContests(profileid, partner_user_name) {
        try {
            SubmitAnswer(0, 0, "REAL", profileid, $scope.contest_id, partner_user_name);
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    function SubmitAnswer(QuestionID, Answer, entry_type, person_id, contest_id, partner_user_name) {
        try {
            //ajaxindicatorstart('please wait..');
            var _obj = {
                DummyUserID: $scope.DummyUserID,
                QuestionID: QuestionID,
                Answer: Answer,
                entry_type: entry_type,
                person_id: person_id,
                contest_id: contest_id,
                partner_user_name: partner_user_name
            };

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/SubmitAnswer',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (details.IsSuccess === 0) {
                            GetAlert(details.ResponseMSG, details.ResponseType);
                            //Login(details.email, "LoginWithAdmin", 0);
                        }
                    }
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    //GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    function Register(partner_user_name) {

        if ($scope.password !== $scope.confirmpassword) {
            ajaxindicatorstop();
            GetAlert("Password and confirm password should be same!", "error");
        }
        else {

            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    username: $scope.name,
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
                            if (details.ResponseType == "success") {
                                //SubmitContests(details.id);
                                Login(details.email, "LoginWithAdmin", 0, partner_user_name);
                            }
                            else {
                                GetAlert(details.ResponseMSG, details.ResponseType);
                            }
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

    function Login(userid, password, IsLoginWithFaceBook, partner_user_name) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                userid: userid,
                password: password,
                latitude: $scope.Latitude,
                longitude: $scope.Longitude,
                IsLoginWithFaceBook: IsLoginWithFaceBook,
                name: "",
                facebook_id: ""
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/Login',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (details.IsSuccess === 1) {
                            SubmitContests(details.id, partner_user_name);
                            GetAlert("Congratulations on successfully submitting your entry to our contest. We wish you all the best.", "success", '/dashboard');
                            //$window.location.href = '/dashboard';
                        }
                        else { GetAlert(details.ResponseMSG, 'error'); }
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

    $scope.GetUserSubmittedQuizOrNot = function () {
        if ($scope.UserAlreadySubmitted === true) {
            GetAlert("One user can only participate once in this contest.", "error");
        }
        else {
            $scope.Step1 = false; $scope.Step2 = false; $scope.Step3 = true; $scope.Step4 = false;
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


    function GetTimeRemainingForQuiz() {
        try {
            return $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetTimeRemainingForQuiz',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d != null) {
                        if (data.data.d == "0") {
                            $("#sectimer").hide();
                        }
                        else {
                            $("#sectimer").show();
                            SetSeconds(data.data.d, 1);
                            //getCountdown(data.data.d);
                            //initializeClock('clockdiv', data.data.d);
                            //initializeClock('clockdiv1', data.data.d);
                            // initializeClock('countdown', data.data.d);
                        }
                    }
                    else {
                        $("#sectimer").hide();
                    }
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) { ajaxindicatorstop(); }
    }
});