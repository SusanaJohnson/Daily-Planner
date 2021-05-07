from flask import Flask, render_template, request, json
import sqlite3 as sql
from datetime import date, time, datetime, timedelta
import calendar
import random
import time


app = Flask(__name__)

DATABASE ='/dailyplanner.db'
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


@app.route('/')
def home():
    return render_template('daily.html')


@app.route('/daily_calendar',methods = ['POST','GET'])
def daily():
    data_rec=json.loads(request.form['data'])   
    month = data_rec['month']
    year = data_rec['year']
    dayToV = data_rec['dayToV']
    fd=int(6)
    #all date views
    week_header, week_abbr, month_name, month_abbr, c = calendName(fd)
    j=0
    for i in c.itermonthdays4(year,month):
        if (i[1]==month and i[2]==dayToV):
            break
        j+=1
    #Set it to show 1 day
    st=(j/1)*1
    wekk=[]
    for i in c.itermonthdays4(year,month):
        if(st<=0 and st>-1):
            hd=month_abbr[i[1]]+' '+str(i[2])
            wekk.append({'week_head':hd,'id':date(i[0],i[1],i[2]).strftime('%Y-%m-%d'),'weekS':week_abbr[i[3]]+' '+hd})
        st-=1
    if wekk[0]['week_head'].split(' ')[0]==wekk[-1]['week_head'].split(' ')[0]:
         head_cal_day=wekk[0]['week_head']+', '+wekk[-1]['id'].split('-')[0]
    else:
        head_cal_day=wekk[0]['week_head']+', '+wekk[-1]['id'].split('-')[0]
    k =60
    t1= datetime(2020,2,2,0,0)
    td=timedelta(minutes=60)
    con=sql.connect("dailyplanner.db")
    con.row_factory =dict_factory
    cur=con.cursor()
    time_header=[]
    time_event=[]
    for i in range(0,1440,k):
        ta=t1.strftime('%H:%M')
        print(ta)
        time_header.append(ta)
        tb= (t1+td).strftime('%H:%M')
        for j in wekk:
            cur.execute("select event.eventname , groups.color, event.eventID, event.address as eventdescription \
            from event natural join groups where groups.showG=1 and  event.date =? \
            and ((event.start >= ? and event.start < ? ) or \
            (event.endt > ? and  event.endt <= ?) or ( event.start <= ? and  ? < event.endt))\
            order by event.start",(j['id'],ta,tb,ta,tb,ta,ta))
            time_event.append(cur.fetchall())

        t1+=td
    con.close() 
    data = {'head_cal_day':head_cal_day,'wekk':wekk, 'time_header':time_header,'time_event':time_event,'groups':1}
    return {'data':data}

def calendName(fd):
    week_name={0:'MONDAY', 1:'TUESDAY', 2:'WEDNESDAY', 3:'THURSDAY', 4:'FRIDAY', 5:'SATURDAY', 6:'SUNDAY'}
    month_name=[]
    for i in calendar.month_name:
        month_name.append(i)
    month_abbr=[]
    for i in calendar.month_abbr:
        month_abbr.append(i)
    # this is first day of week 0=monday 6=sunday 5=saturday 
    c=calendar.Calendar(firstweekday=fd)

    # make proper week header (to make a list)
    week_header=[]
    for i in c.iterweekdays():
        week_header.append(week_name[i]) 
    # make week abbr

    week_abbr=[]
    for i in calendar.day_abbr:
        week_abbr.append(i) 
    
    return week_header,week_abbr,month_name,month_abbr,c




@app.route('/edit_event', methods = ['POST','GET'])
def edit_event():
    jsd = json.loads(request.form['id'])
    con=sql.connect("dailyplanner.db")
    cur=con.cursor()
    if(jsd['st'] =='editEv' or jsd['st'] =='addEv'):
        name,address=jsd['name'],jsd['address']
        uname='Guest'
        date=jsd['date']
        start=jsd['start']
        endt=jsd['endt']
    if (jsd['st'] =='edit'):
        event_id=int(jsd['ido'])
        cur.execute('UPDATE event SET eventname=?,address=?,date=?,\
                    start=?,endt=? WHERE eventID=?',(name,address,date,start,endt,event_id))
       
    if (jsd['st']=='addEv'):
        cur.execute('INSERT INTO event(eventname,address,date,start,endt, username, groupID)\
                    VALUES (?,?,?,?,?,?,?)',(name,address,date,start,endt, 'Guest', 44))
          
    if (jsd['st']=='delEv'):
        a=int(jsd['ido'])
        cur.execute('DELETE FROM event WHERE eventID = ?;',(a,))
        #scheduler.remove_job(str(a))
    con.commit()
    con.close()
    con=sql.connect("dailyplanner.db")
    con.row_factory =dict_factory
    cur=con.cursor()

    if jsd['st']=='delEv':  #for delete mw should .........???
        date='2021-03-02'
    cur.execute("select * from event where date = ? Order by date,start;",(date,))

    events =cur.fetchall()
    con.close()
    day_data={'day_event':events,'day_id':date}
    return {'day_data':day_data}



    

def dict_factory(cursor, row):
    d = {}
    for indx, col in enumerate(cursor.description):
            d[col[0]] = row[indx]
    return d




if '__name__'=='__main__':
    app.run(debug=True)