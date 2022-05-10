var MyApp = angular.module('WhisperingShoutsAppAdmin');


MyApp.controller('RewardsController', function ($scope, $http, $window, $location, LoginService) {

        $scope.EditForm = false;
        $scope.IsAddForm = false;
        LoginService.CheckSession();
        GetRewardsData();

        $scope.ShowHideForm = function (status, id) {

            $scope.rewardtitle = "";
            $scope.rewardsubtitle = "";
            $scope.rewardvalue = "";
            $scope.rewarddescription = "";
            $scope.reward_id = 0;

            $scope.EditForm = status;

            if (id === undefined)
                $scope.IsAddForm = true;
            else
                $scope.IsAddForm = false;

            var FilterData = $scope.RewardsList.filter(x => x.reward_id == id);

            if (FilterData != null && FilterData.length > 0) {
                $scope.rewardtitle = FilterData[0].reward_title;
                $scope.rewardsubtitle = FilterData[0].reward_sub_title;
                $scope.rewardvalue = FilterData[0].reward_value;
                $scope.rewarddescription = FilterData[0].reward_description;
                $scope.reward_id = FilterData[0].reward_id;

            }

        };

        function GetRewardsData() {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "GET",
                    reward_title: "",
                    reward_sub_title: "",
                    reward_image: "",
                    reward_value: "",
                    poker_room: "",
                    reward_code: "",
                    valid_till: "",
                    reward_description: "",
                    reward_id: 0
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateRewardsData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];
                            $scope.RewardsList = _data;

                            setTimeout(function () {
                                $('#dtwithdrawrequest').DataTable({
                                    bDestroy: true,
                                    "pagingType": "full_numbers",
                                    "lengthMenu": [
                                        [10, 25, 50, -1],
                                        [10, 25, 50, "All"]
                                    ],
                                    responsive: false,
                                    language: {
                                        search: "_INPUT_",
                                        searchPlaceholder: "Search records"
                                    }

                                });
                            }, 1000);
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

        $scope.UpdateReward = function (reward_id, rewardtitle, reward_sub_title, rewardvalue, rewarddescription) {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "UPDATE",
                    reward_title: rewardtitle,
                    reward_sub_title: reward_sub_title,
                    reward_image: "",
                    reward_value: rewardvalue,
                    poker_room: "",
                    reward_code: "",
                    valid_till: "",
                    reward_description: rewarddescription,
                    reward_id: reward_id
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateRewardsData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];

                            GetAlert(details.ResponseMSG, details.ResponseType, 'rewards.html');
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

        $scope.AddReward = function (reward_id, rewardtitle, reward_sub_title, rewardvalue, rewarddescription) {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "ADD",
                    reward_title: rewardtitle,
                    reward_sub_title: reward_sub_title,
                    reward_image: "",
                    reward_value: rewardvalue,
                    poker_room: "",
                    reward_code: "",
                    valid_till: "",
                    reward_description: rewarddescription,
                    reward_id: 0
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateRewardsData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];

                            GetAlert(details.ResponseMSG, details.ResponseType, 'rewards.html');
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