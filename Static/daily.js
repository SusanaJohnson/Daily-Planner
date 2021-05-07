//This is the daily.js file
function view() {

    var data = { 'dayToV': dayToV, 'month': month + 1, 'year': year }
    myJSON = JSON.stringify(data);
    $.post("/daily_calendar", { 'data': myJSON }, function (resp) {
         head_cal_day = resp.data.head_cal_day
        time_header = resp.data.time_header
        time_event = resp.data.time_event
        //display headers
        $('[class |="day grid-col-1"]').html("Time")
        $('[class |="day grid-col-2"]').html("Events: " + '<br>' +head_cal_day+'</br>')  /* Display the date here */
        $('[class |="day grid-col-3 last-col"]').html("Description")      

        m = $('[class |="grid-col"]').length

        //time interval 60 minutes also in app.py is 60 mins
        k = 60

        n = 3*24*60/k

        for (i = 0; i < n - m; i++) { $('[class |="grid-col"]').eq(0).after($('[class |="grid-col"]').eq(3).clone())}

        ThisEventNumber = 0
        i = 0
        for (i in time_header) {

            a = parseInt(i)
            if (ThisEventNumber >= time_header.length) {break}

            $('[class |="grid-col"]').eq(a * 3).html(time_header[i])


                    appointment = $('[class |="grid-col"]').eq(a * 3 + 1).html(" ").css("width", "400px")
                    description = $('[class |="grid-col"]').eq(a * 3 + 2).html(" ").css("width", "956px")

                    for (l = 0; l < time_event[i].length; l++ ) {
                        if (time_event[i].length >0) {
                            mulitpleOverBooked =time_event[i].length 
                            appointment.append("<div style='background-color:" + time_event[parseInt(i)][0].color +
                            "'id=" + time_event[i][0].eventID + ">" +time_event[parseInt(i)][0].eventname + "<br></div>")
                            description.append("<div style='background-color:" + time_event[parseInt(i)][0].color +
                            "'id=" + time_event[i][0].eventID + ">" + time_event[parseInt(i)][0].eventdescription +"<br></div>")
                        }

                    }

                    $('[class |="grid-col"]').eq(a*3).html(time_header[i])

        }


        a = today.getHours()
        b = today.getMinutes()
        b -= (b % k)
        sa = a.toString().padStart(2, 0)
        sb = b.toString().padStart(2, 0)
        timee = sa + ':' + sb
        ss1 = '[id="' + day + ' ' + timee + '"]'
        $(ss1).css('border', '3px outset red')

        viewcom()

    })
}
function forward() {
    var a = today
    a.setDate(a.getDate() + 1)
    month = a.getMonth()
    year = a.getFullYear()
    dayToV = a.getDate()
    view()
}

function back() {
    var a = today
    a.setDate(a.getDate() - 1)
    month = a.getMonth()
    year = a.getFullYear()
    dayToV = a.getDate()
    view()
}


function addPlan() {
    checkEvent();
    addModal.style.display = "none";
}