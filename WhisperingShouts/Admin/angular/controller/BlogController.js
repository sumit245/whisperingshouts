var MyApp = angular.module('WhisperingShoutsAppAdmin');


MyApp.controller('BlogController', function ($scope, $http, $window, $location, LoginService) {

    $scope.IsLoggedInByAdmin = false;
    $scope.EditForm = false;
    $scope.IsAddForm = false;
    IsLoggedInByAdmin();
    LoginService.CheckSessionForBlog();
    GetBlogData(0);


    function IsLoggedInByAdmin() {
        try {

            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/AdminCheckSession',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "success") {
                        $scope.IsLoggedInByAdmin = true;
                    }
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    $scope.ShowHideForm = function (status, id) {

        $scope.title = "";
        $scope.description = "";
        $scope.social_tag_description = "";
        $scope.short_description = "";
        $scope.id = 0;

        $scope.EditForm = status;

        if (id === undefined)
            $scope.IsAddForm = true;
        else
            $scope.IsAddForm = false;

        var FilterData = $scope.BlogList.filter(x => x.id == id);

        if (FilterData != null && FilterData.length > 0) {
            $scope.title = FilterData[0].title;
            $scope.description = FilterData[0].description;
            $scope.social_tag_description = FilterData[0].social_tag_description;
            $scope.short_description = FilterData[0].short_description;
            $scope.id = FilterData[0].id;
        }

    };

    function GetBlogData(id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetBlog',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        $scope.BlogList = _data;

                        setTimeout(function () {
                            $('#dtblog').DataTable({
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

    $scope.UpdateBlog = function (id, title, description, social_tag_description, short_description) {
        // AddUpdateBlog(id, title, description, social_tag_description, short_description, $scope.filename, "UPDATE");
        FileUpload(id, title, CKEDITOR.instances['description'].getData(), social_tag_description, short_description, "UPDATE");
    };

    $scope.AddBlog = function (title, description, social_tag_description, short_description) {
        //AddUpdateBlog(0, title, description, social_tag_description, short_description, $scope.filename, "ADD");
        FileUpload(0, title, CKEDITOR.instances['description'].getData(), social_tag_description, short_description, "ADD");
    };

    //$scope.UploadImage = function () {
    //    alert('');
    //};

    function AddUpdateBlog(id, title, description, social_tag_description, short_description, filename, type) {
        try {
            ajaxindicatorstart('please wait..');
            console.log(description);
            var _obj = {
                type: type,
                title: title,
                description: description,
                image_file_name: filename,
                social_tag_description: social_tag_description,
                short_description: short_description,
                id: id
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/AddUpdateBlog',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, '/blog');
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

    //$("#fldblogimage").change(function () {
    //    FileUpload();
    //});

    function FileUpload(id, title, description, social_tag_description, short_description, type) {

        var IsOk = 1;


        ajaxindicatorstart('please wait..');

        var fileUpload = $("#fldblogimage").get(0);
        var files = fileUpload.files;
        var test = new FormData();
        for (var i = 0; i < files.length; i++) {
            test.append(files[i].name, files[i]);
        }
        $.ajax({
            url: "FileHandler.ashx?type=BlogImage",
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
                        $scope.previewimage = "/images/blog/" + $scope.filename;
                        if (type === "UPDATE")
                            AddUpdateBlog(id, title, description, social_tag_description, short_description, $scope.filename, "UPDATE");
                        else if (type === "ADD")
                            AddUpdateBlog(0, title, description, social_tag_description, short_description, $scope.filename, "ADD");
                    });
                }
            },
            error: function (err) {
                IsOk = 0;
                ajaxindicatorstop();
                GetAlert(err.statusText, "error");
            }
        });
    }
});