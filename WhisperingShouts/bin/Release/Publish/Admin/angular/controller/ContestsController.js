var MyApp = angular.module('WhisperingShoutsAppAdmin');


MyApp.controller('ContestsController', function ($scope, $http, $window, $location, LoginService) {

    $scope.EditForm = false;
    $scope.IsAddForm = false;
    LoginService.CheckSession();

    GetContests(0);

    $scope.ShowHideForm = function (status, id) {

        $scope.name = "";
        $scope.description = "";
        $scope.tnc = "";
        $scope.id = 0;

        $scope.EditForm = status;

        if (id === undefined)
            $scope.IsAddForm = true;
        else
            $scope.IsAddForm = false;

        var FilterData = $scope.ContestsList.filter(x => x.id == id);

        if (FilterData != null && FilterData.length > 0) {
            $scope.name = FilterData[0].name;
            $scope.description = FilterData[0].description;
            $scope.tnc = FilterData[0].tnc;
            //$scope.ddltype = FilterData[0].type;
            //$scope.start_date = FilterData[0].start_date;
            // $scope.end_date = FilterData[0].end_date;
            $scope.id = FilterData[0].id;
        }

    };

    function GetContests(id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetContests',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        $scope.ContestsList = _data;

                        setTimeout(function () {
                            $('#dtcontests').DataTable({
                                bDestroy: true,
                                "order": [[0, "desc"]],
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

    $scope.UpdateContests = function (id, name, type, start_date, end_date) {
        FileUpload(id, name, CKEDITOR.instances['description'].getData(), CKEDITOR.instances['tnc'].getData(), type, start_date, end_date, "UPDATE");
    };

    $scope.AddContests = function (id, name, type, start_date, end_date) {
        FileUpload(id, name, CKEDITOR.instances['description'].getData(), CKEDITOR.instances['tnc'].getData(), type, start_date, end_date, "ADD");
    };

    function AddUpdateContests(id, name, description, tnc, type, start_date, end_date, filename, request_type) {
        try {
            ajaxindicatorstart('please wait..');
            console.log(description);
            var _obj = {
                request_type: request_type,
                name: name,
                description: description,
                tnc: tnc,
                type: type,
                start_date: start_date,
                end_date: end_date,
                image_file_name: filename,
                id: id
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/AddUpdateContests',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, '/contests');
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


    function FileUpload(id, name, description, tnc, type, start_date, end_date, request_type) {

        ajaxindicatorstart('please wait..');

        var fileUpload = $("#fldcontestsimage").get(0);
        var files = fileUpload.files;
        var test = new FormData();
        for (var i = 0; i < files.length; i++) {
            test.append(files[i].name, files[i]);
        }
        $.ajax({
            url: "FileHandler.ashx?type=ContestsImage",
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
                        $scope.previewimage = "/images/contests/" + $scope.filename;
                        if (request_type === "UPDATE")
                            AddUpdateContests(id, name, description, tnc, type, start_date, end_date, $scope.filename, "UPDATE");
                        else if (request_type === "ADD")
                            AddUpdateContests(0, name, description, tnc, type, start_date, end_date, $scope.filename, "ADD");
                    });
                }
            },
            error: function (err) {
                ajaxindicatorstop();
                GetAlert(err.statusText, "error");
            }
        });
    }
});