serverLocation = "https://app.healthcloudsa.com/api/";
apiKey = "664c64a5-13f9-4747-b976-f20340c05320";

var search = function (element) {

    element.disabled = true;

    var searchVal = $("#hccSearchInput")[0].value;
    var categoryId = $('option:selected').attr('id');

    var container = $("#hccMediaItems")[0];

    var loadingText = "<div style='width:100%'><h4 class='text-center'>Loading Content...</h4></div>";

    container.innerHTML = loadingText;

    var ApiRequest = { apiKey: apiKey, searchKey: searchVal, categoryId: categoryId };
    $.ajax({
        type: "POST",
        data: JSON.stringify(ApiRequest),
        url: serverLocation + "HCCMedia/Search",
        contentType: "application/json",
        success: function (data, status, xhr) {
            container.innerHTML = "";
            var noResultLabel = document.getElementById("noResults");

            if (data == null || data.length == 0) {
                noResultLabel.style.display = "block";
            }
            else {
                noResultLabel.style.display = "none";
            }

            for (var i = 0; i < data.length; i++) {

                var mediaItem =
                    '<div class="card card-body " style="width:100%">' +
                    '<h4  class="card-title mt-0">' + data[i].protocolName + '</h4>' +
                    '<p class="card-text"><small style="text-transform: uppercase;">' + data[i].categoryName + '</small></p>' +
                    '<p class="card-text">' + data[i].summary + '</p>' +
                    '<button type="button" class="btn btn-primary waves-effect waves-light" id="' + data[i].mediaId + '" onclick="getMediaUrl(this,this.id)">' +
                    'Request' +
                    '</button>' +
                    '</div>';

                var div = document.createElement('div');
                div.setAttribute('class', 'col-xl-4');
                div.innerHTML = mediaItem;

                container.appendChild(div);
            }

            element.disabled = false;
        },
        error: function (xhr, status, error) {
            alert('Error occurred - ' + error);
            element.disabled = false;
        }
    });
};


var populateDropdown = function (data) {
    var dropdown = $("#hccCategoryDropdown");

    for (var i = 0; i < data.length; i++) {
        var option = document.createElement("option");
        option.id = data[i].categoryId;
        option.innerText = data[i].name;

        dropdown.append(option);
    }
};

var getCategories = function () {

    var ApiRequest = { ApiKey: apiKey };

    $.ajax({
        type: "POST",
        data: JSON.stringify(ApiRequest),
        url: serverLocation + "HCCMedia/CategoryList",
        contentType: "application/json",
        success: function (data, status, xhr) {
            populateDropdown(data);
        },
        error: function (xhr, status, error) {
            alert('Error occurred - ' + error);
        }
    });
};

getMediaUrl = function (element, mediaId) {

    if (element["redirectUrl"] != null) {
        window.open(element["redirectUrl"].url, "_blank");
    }
    else {
        var ApiRequest = { ApiKey: apiKey, reference: "test", mediaId: mediaId };
        $.ajax({
            type: "POST",
            data: JSON.stringify(ApiRequest),
            url: serverLocation + "HCCMedia/GetMediaURL",
            contentType: "application/json",
            success: function (data, status, xhr) {
                element.innerHTML = 'Play';
                element.className = 'btn btn-success btn-block';
                element["redirectUrl"] = data;
            },
            error: function (xhr, status, error) {
                alert('Error occurred - ' + error);
            }
        });
    }
}


$(document).ready(function () {
    getCategories();
});
