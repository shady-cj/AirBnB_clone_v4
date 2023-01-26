$(function () {
    const inputCheckboxes = $("input[type='checkbox']");
    let activeAmenities = {}
    const h4Amenities = $(".amenities h4");
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
