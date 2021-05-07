var today= new Date();
var day =new Date(today.getTime() - (today.getTimezoneOffset() * 60000 )).toISOString().split('T')[0]
var month=today.getMonth();
var year=today.getFullYear();

$(document).ready(function(){
    dayToV=today.getDate();
    view();
})
  

$("[name='first_day']").click(function() {
    fd=parseInt(($(this).val()));
    user.ViewSet.first_day=fd;
    view();
    setUser()
});


function viewcom() { 
 
    $('[class|="grid-col"]').off()
    $('[class="grid-col-2"]').click(function(){ ido=parseInt(this.firstElementChild.id)
        a=confirm("Are sure , Do you want to delete "+$(this).text()+" event")
        if (a){var send={'st':'delEv','ido':ido}
        myJSON = JSON.stringify(send);
        $.post("/edit_event", {'id': myJSON}, function() {        
            alert('deleted')
        view()})
    }})

    // making option for time slots, K IS TIMESLOTS
    k=60
    $('#start').html('<option>00:00</option>'); et1=$('#start').children().clone();
    $('#end').html('')
    t1.setHours(0,0,0,0)
    for (i=0 ;i<24*60;i+=k){
        t1.setMinutes(t1.getMinutes()+k);
        p=t1.toTimeString().slice(0,5)
        et1.html(p);
        et1.val(p);
        $('#start').append(et1.clone());
        $('#end').append(et1.clone())
    }
}   


function checkEvent() {
    var a= ($('#start').val()=="")||($('#end').val()=="")||($('#date').val()=="")||($('#title').val()=="")
    //add some code to check overlaping time ,....
    if (a) {
        alert ('Please complete event data entry!');
        return
    }
    $('#addEventBtn').prop('disabled',true);
    reminder=$('#reminder').val()
    title=$('#title').val();
    address=$('#descr').val();
    date=$('#date').val()
    start=$('#start').val();
    endt=$('#end').val();
    groupID=$('#group_list').val()
    var send={'st':'addEv', 'name':title, 'address':address , 'date':date,'start':start, 'endt':endt, 'groupID':groupID, 'reminder':reminder}
    myJSON = JSON.stringify(send);
    $.post("/edit_event", {'id': myJSON}, function(data) {
        $('#addEventBtn').prop('disabled',false)
        view()  
    })    
       
}

function changeEnd() {
    k=60
    $('#end').html('');
    et1=$('#start').children().eq(0).clone()
    st=$('#start').val()
    t1.setHours(st.slice(0,2),st.slice(3,5),0,0)
    h=parseInt(st.slice(0,2))*60+parseInt(st.slice(3,5))
    for (i=0 ;i<24*60-h-k;i+=k) {
        t1.setMinutes(t1.getMinutes()+k);
        p=t1.toTimeString().slice(0,5)
        et1.html(p);
        et1.val(p);
        $('#end').append(et1.clone())
    }
    et1.html('23:59');
    et1.val("23:59");
    $('#end').append(et1.clone()) 
}

/*
function editEventSubmit() {
    var a= ($('#start').val()=="")||($('#end').val()=="")||($('#date').val()=="")||($('#title').val()=="")
    //add some code to check overlaping time ,....
    if (a) {
        alert ('Please complete event data entry!');
        return
    }
    $('#addEventBtn').prop('disabled',true);
    reminder=$('#reminder').val()
    title=$('#title').val();
    address=$('#descr').val();
    date=$('#date').val()
    start=$('#start').val();
    endt=$('#end').val();
    groupID=$('#group_list').val()
    var send={'st':'editEv', 'name':title, 'address':address , 'date':date,'start':start, 'endt':endt, 'groupID':groupID, 'reminder':reminder}
    myJSON = JSON.stringify(send);
    $.post("/edit_event", {'id': myJSON}, function(data) {
        $('#editEventBtn').prop('disabled',false)
        view()  
    })    
       
}

 

function viewCh(e) {
    m=e.getAttribute('id')
    user.ViewSet.viewLy=m
    setUser() 
    location.replace('/dashboard')     
}
     



function changeshow(e) {
    m=e.parentElement.id.slice(6,)
    showG=e.checked;
    var send={'st':'showChange', 'id':m, 'showG':showG}
    myJSON = JSON.stringify(send);
    $.post("/edit_group", {'id': myJSON}, function(data){
        view()
    })
}



    

function setUser() {
    var send={'st':'save_user', 'user':user}
    myJSON = JSON.stringify(send);
    $.post("/edit_group", {'id': myJSON}, function(data){
        view()
    })
}*/