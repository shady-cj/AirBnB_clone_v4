$(function () {
    const inputCheckboxes = $("input[type='checkbox']");
    let activeAmenities = {};
    const h4Amenities = $(".amenities h4");
    const apiStatus = $("#api_status");
    const searchButton = $("button[type='button']")
    const searchFilter = {}


    // Getting the status of the backend api
    $.get("http://0.0.0.0:5001/api/v1/status/", function(apiResponse){
       if (apiResponse.status == "OK") {
            $(apiStatus).addClass("available")
       }
       else {
            $(apiStatus).removeClass("available")
       }
    })

    // On when search button is clicked update the places with respect to the amenities
    // clicked
    $(searchButton).on("click", function() {
        $.each(activeAmenities, function(amenityId, amenityName){
            searchFilter.amenity = searchFilter.amenity?[...searchFilter.amenity, amenityId]:[amenityId];
        })
        
        // load places
        loadDefaultPlaces(searchFilter)
    })

    // Getting places and updating the html
    loadDefaultPlaces()
    function loadDefaultPlaces(data={}) {
        $.ajax({
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            type: "POST",
            dataType: "json",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            },
            success: function(data) {
                const placeSection = $("section.places")
                let places_articles = ""
                $.each(data, function(index, place) {
                    const html = ` <article>
                        <div class="title_box">
                        <h2>${ place.name }</h2>
                        <div class="price_by_night">${ place.price_by_night }</div>
                        </div>
                        <div class="information">
                        <div class="max_guest">${ place.max_guest } Guest${ place.max_guest > 1 ? "s":"" }</div>
                            <div class="number_rooms">${ place.number_rooms } Bedroom${ place.number_rooms > 1 ?"s":""}</div>
                            <div class="number_bathrooms">${ place.number_bathrooms } Bathroom${ place.number_bathrooms > 1 ? "s" : "" }</div>
                        </div>
                        <div class="user">
                            <b>Owner:</b> ${ place.user?.first_name?place.user.first_name:"" } ${ place.user?.last_name?place.user.last_name:"" }
                            </div>
                            <div class="description">
                            ${place.description?place.description:""}
                            </div>
                    </article>`
                    places_articles += html
    
                })
                $(placeSection).html(places_articles)
            },
            error: function(error) {
                console.log(error)
            }
        })
    
    }
  
    // Updating the amenities checkboxes
    $(inputCheckboxes).each(function(index, el) {
        $(el).change(function(){
            const id = $(this).attr("data-id");
            const name = $(this).attr("data-name")
            let text = ""
            if ($(this)[0].checked) {
                activeAmenities[id] = name
            } else {
                if (id in activeAmenities) delete activeAmenities[id]
            }
            $.each(activeAmenities, function(amenityId, amenityName){
                text += amenityName + ", "
            })
            text = text.slice(0, -2);
            text += "&nbsp;"

            $(h4Amenities).html(text)
        })
    })
})
