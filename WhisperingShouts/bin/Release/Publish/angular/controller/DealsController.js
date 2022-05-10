var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('DealsController', function ($scope, $http, $filter, $window, $rootScope, $location) {

    $scope.options = [];
    $scope.FilterData = [
        {
            id: 1, name: 'Rakeback'
        },
        {
            id: 2, name: 'Coupon'
        },
        {
            id: 3, name: 'Promotion'
        }
    ];
    $scope.filteredvalue = [];
    $scope.appliedFilters = [];
    $scope.TempdealsFilterList = [];

    //$scope.FilterTable = function (type, index) {

    //    $scope.FilterData[index].checked = !$scope.FilterData[index].checked;
    //    if ($scope.FilterData[index].checked) {
    //        $scope.filteredvalue.push(type);
    //        //alert(type);
    //        //$scope.filteredvalue = $scope.filteredvalue == "" ? type : $scope.filteredvalue + "," + type;
    //    }
    //    else {
    //        $scope.filteredvalue = [];
    //    }

    //};

    $scope.FilterDeals = function (dealtypesearch, index) {
        //$scope.TempdealsFilterList = [];
        $scope.FilterData[index].checked = !$scope.FilterData[index].checked;

        //if ($scope.dealsFilterList.find(x => x == element)) {
        //    $scope.dealsFilterList.splice($scope.dealsFilterList.findIndex(x => x.type == dealtypesearch), 1);
        //}

        //$scope.dealsFilterList.splice($scope.dealsFilterList.findIndex(x => x.type == dealtypesearch), 1);

        if ($scope.FilterData[index].checked == false) {
            var item1 = $filter('filter')($scope.TempdealsFilterList, { type: dealtypesearch });
            if (item1.length > 0) {
                for (var j in item1) {
                    //$scope.TempdealsFilterList.splice(item1[j]);
                    $scope.TempdealsFilterList.splice($scope.TempdealsFilterList.findIndex(x => x.type == dealtypesearch), 1);
                }
            }
        }

        else if ($scope.FilterData[0].checked || $scope.FilterData[1].checked || $scope.FilterData[2].checked) {
            var item = $filter('filter')($scope.dealsList, { type: dealtypesearch });
            if (item.length > 0) {
                for (var i in item) {
                    $scope.TempdealsFilterList.push(item[i]);
                }
            }
        }
        else {
            $scope.TempdealsFilterList = [];
            $scope.dealsFilterList = $scope.dealsList;
        }

        if ($scope.TempdealsFilterList.length > 0) {
            $scope.dealsFilterList = $scope.TempdealsFilterList;
        }
        else {
            $scope.dealsFilterList = $scope.dealsList;
        }

        //if ($scope.FilterData[index].checked) {
        //    //$scope.appliedFilters.push({ type: dealtypesearch });

        //    if (dealtypesearch !== undefined) {
        //        //$scope.filteritem = productnamesearch;
        //        //$scope.appliedFilters.push({ name: productnamesearch });
        //        var item = $filter('filter')($scope.dealsList, { type: dealtypesearch });

        //        if (item.length > 0) {

        //            for (var i in item) {
        //                $scope.dealsFilterList.push(item[i]);
        //            }

        //            //tasks.forEach((object) => {
        //            //    if (object[type] === dealtypesearch) {
        //            //        $scope.dealsFilterList.push(object);
        //            //    }
        //            //});

        //            // $scope.dealsFilterList = $scope.dealsFilterList + item;
        //            //$scope.dealsFilterList.push(item);
        //        }
        //    }

        //}
        //else {
        //    $scope.dealsFilterList = $scope.dealsList;
        //}

        //else {
        //    $scope.appliedFilters = [];
        //}

        //if (dealtypesearch !== undefined) {
        //    //$scope.filteritem = productnamesearch;
        //    //$scope.appliedFilters.push({ name: productnamesearch });
        //    var item = $filter('filter')($scope.dealsList, { type: dealtypesearch });

        //    if (item.length > 0) {
        //        $scope.dealsFilterList = item;
        //    }
        //}
        //else {
        //    $scope.dealsFilterList = $scope.dealsList;
        //}
    };

    GetDeals();

    function GetDeals() {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                deals_id: 0
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetDeals',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.dealsList = _data;
                        $scope.dealsFilterList = _data;
                        $scope.RakebackCount = _data[0].RakebackCount;
                        $scope.CouponsCount = _data[0].CouponsCount;
                        $scope.PromotionsCount = _data[0].PromotionsCount;
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