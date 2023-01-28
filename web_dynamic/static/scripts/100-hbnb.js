$(function () {
    const amenityInputCheckboxes = $(".amenities input[type='checkbox']");
    const stateCitiesInputCheckboxes = $(".locations input[type='checkbox']")
    let activeAmenities = {};
    let activeStates = {};
    let activeCities = {};
    let activeStateCities = {};
    const h4Amenities = $(".amenities h4");
    const h4Locations = $(".locations > h4")
    const apiStatus = $("#api_status");
    const searchButton = $("button[type='button']")
    let searchFilter = {}
    let filterChanged = false


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
        if (filterChanged) searchFilter = {}
        else return;
        $.each(activeAmenities, function(amenityId, amenityName){
            searchFilter.amenity = searchFilter.amenity?[...searchFilter.amenity, amenityId]:[amenityId];
        })

        $.each(activeStateCities, function(id, name){
            const splitText = id.split(".")
            const type = splitText[0]
            id = splitText.slice(1).join("")
            searchFilter[type] = searchFilter[type]?[...searchFilter[type], id]:[id];
        })
        
        // load places
        loadDefaultPlaces(searchFilter)
        filterChanged = false
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

    // Updating Locations checkboxes
    $(stateCitiesInputCheckboxes).each(function(index, elem) { 
        $(elem).change(function() {
            const id = $(this).attr("data-id");
            const name = $(this).attr("data-name");
            let text = ""

            if ($(this)[0].checked) {
                if ($(this).parent().is("h2")) {
                    activeStateCities[`state.${id}`] = name
                } else {
                    activeStateCities[`city.${id}`] = name
                }
            } else {
                if ($(this).parent().is("h2")) {
                   if (id in activeStates) delete activeStateCities[`state.${id}`]

                } else {
                    if (id in activeCities) delete activeStateCities[`city.${id}`]
                    
                }
            }
            $.each(activeStateCities, function(id, name) {
                text += name + ", "
            })
            text = text.slice(0, -2)
            text += "&nbsp;"
            $(h4Locations).html(text)
            filterChanged = true
            
        })
        
    })
  
    // Updating the amenities checkboxes
    $(amenityInputCheckboxes).each(function(index, el) {
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
            filterChanged = true
        })
    })
})
