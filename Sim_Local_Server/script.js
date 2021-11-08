const local_url = "https://a3346286-a094-4a7a-80d1-e0ca60ed231c.mock.pstmn.io"
const maxZone = 8;
const dayThaiName = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const day_abTH = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อ."];
const day = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var arr_wday = [];
var day_rep; // use for modal

var tabNow = null;

var totalSeconds = 0;
var countup_timer;

var dataProgram;
var dataProgram_toShow = [];

var H_array = [];
var M_array = [];

var dataPassHW, dataSerialNo, dataZoneEn;

var pump_status = 0;
var valve_status_set = [];

var dataProgram_New = {
    nProgram: null,
    nZone: null,
    repeatD: null,
    repeatB: null,
    status: null,
    hour: null,
    minute: null,
    startT: null,
    stopT: null,
    duration: null,
    everyDay: null
};

var dataTimeHW = {
    hour: null,
    minute: null,
    day: null
}

var dt_show = [];


var datetime_New = {
    minute: null,
    hour: null,
    day: null,
    wday: null,
    month: null,
    year: null,
};

var event_con;

function OnLoad_Init() {

    HideTimerSettingProgram();
    HideScheduleProgram();
    HidePageZoneSetting();
    HidePageHWSetting();

    GetAllData_Init();

}

function GetAllData_Init() {

    GetProgramHW();
    GetZoneStatus();
    GetTimeHW();
    GetInFoHW();

    countup_timer = setInterval(function () { ++totalSeconds; seconds_1.innerHTML = totalSeconds; }, 1000);

    let cnt_wait_res = 0;
    const wait_res = setInterval(() => {
        console.log([dataProgram, dataPassHW, dataSerialNo, dataZoneEn, dataTimeHW]);
        if (cnt_wait_res <= 5) {
            if (dataProgram != undefined && dataPassHW != undefined && dataSerialNo != undefined && dataZoneEn != undefined && dataTimeHW != undefined) {

                RenderProgramDiv();
                RenderZoneDiv(dataZoneEn);
                RenderInfoHWDiv();

                // หลังจากโหลดทุกอย่างเสร็จเ
                HideLoader("setTimer");
                setTabPage("setTimer");
                clearInterval(wait_res);
            }
        }
        else {
            console.log("ไม่มีการตอบสนองจาก server");
            clearInterval(wait_res);
        }
        cnt_wait_res++;
    }, 1000);
}

function setTabPage(TabName) {

    tabNow = TabName;
    backMenu.style.display = "none";
    zone_part2.style.display = "none";

    let tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (let j = 0; j < tablinks.length; j++) {
        tablinks[j].className = tablinks[j].className.replace("active", "");
    }

    document.getElementById(tabNow).style.display = "block";
    document.getElementById("tab_" + tabNow).classList.add("active");

    if (tabNow == "setTimer") {
        setTimerTab();
    }
    else if (tabNow == "editZone") {
        editZoneTab();
    }
    if (tabNow == "editWifi") {
        editWifiTab();
        caltimetoshow();
        arr_wday = [0, 0, 0, 0, 0, 0, 0];
    }
}

function editWifiTab() {

    HideTimerSettingProgram();

    backMenu.style.display = "none";
    wifi_part1.style.display = "block";
    allTab.style.display = "block";

    wifiContent.style.display = "block";
    wifi_part2.style.display = "none";
    date_setting.style.display = "none";
}

function upd_UITime() {
    var refresh = 60000; // Refresh rate in milli seconds
    mytime = setTimeout('display_ct()', refresh)

}

function display_ct() {
    if (totalSeconds >= 60) {
        caltimetoshow();
    }
    upd_UITime();
}

function caltimetoshow() {

    let hh = dataTimeHW.hour;
    let mm = dataTimeHW.minute;
    let dd = day_abTH[dataTimeHW.day];

    let time = hh * 60 + mm;
    let dt = [hh, mm];

    if (totalSeconds >= 60) {
        let x = Math.floor(totalSeconds / 60);
        console.log("update--MIN", x);

        time = time + Math.floor(totalSeconds / 60);
        hh = Math.floor(time / 60);
        mm = Math.floor(time % 60);
        dt = [hh, mm];
        let dt_show = displayTimeHW(dt);
        hh_t3.innerHTML = dt_show[0];
        mm_t3.innerHTML = dt_show[1];
        date_t3.innerHTML = dd;

    } else {
        let dt_show = displayTimeHW(dt);
        //----display time
        hh_t3.innerHTML = dt_show[0];
        mm_t3.innerHTML = dt_show[1];
        date_t3.innerHTML = dd;
    }

}

function displayTimeHW(dt_show) {
    let time_ar = [dt_show[0], dt_show[1]];

    if (dt_show[0] >= 0 && dt_show[0] < 10 || dt_show[1] >= 0 && dt_show[1] < 10) {
        if (dt_show[0] >= 0 && dt_show[0] < 10) {
            time_ar[0] = "0" + dt_show[0].toString();
        }
        if (dt_show[1] >= 0 && dt_show[1] < 10) {
            time_ar[1] = "0" + dt_show[1].toString();
        }
    }
    else if (dt_show[0] >= 10 && dt_show[1] >= 10) {
        if (dt_show[0] == 24) {
            time_ar = ["00", dt_show[1]];
        }
        else {
            time_ar = [dt_show[0], dt_show[1]];
        }
    }

    return time_ar;


}

function setTimerTab() {

    HideButtonRemoveProgram();

    timer_part2.style.display = "none";
    timer_part1.style.display = "block";
    buttonTimerTab.style.display = "none";
    OnlyShowProgramTab.style.display = "block";
    save_editProgram.style.display = "none";
    event_con = "showOnly";

    disable_displayMode();
    HideToggleSwitch();


}

function editZoneTab() {

    allTab.style.display = "block";
    zone_part1.style.display = "block";
    backMenu.style.display = "none";
    zone_part2.style.display = "none";

    textEditzoneTab.style.display = "block";
    bt_manualMode.style.display = "block";
}

function disable_displayMode() {
    for (let n = 0; n < dataProgram_toShow.length; n++) {
        let display_func = document.getElementById("time_" + n);
        if (event_con == "showOnly") {
            display_func.setAttribute("onclick", "ShowDetail(" + n + ")");

        } else {
            display_func.removeAttribute("onclick", "ShowDetail(" + n + ")");
            HideToggleSwitch();

        }
    }
}

function HideToggleSwitch() {

    for (let n = 0; n < dataProgram_toShow.length; n++) {
        let edit_toggle = document.getElementById("column2_edit" + n);
        if (event_con == "showOnly") {
            edit_toggle.style.display = "none";
        } else {
            edit_toggle.style.display = "block";
        }
    }
}

function HideTimerSettingProgram() {
    timer_setting.style.display = "none";
    timer_part2.style.display = "none";
}

function HideScheduleProgram() {
    setTimer.style.display = "none";
}

function HidePageZoneSetting() {
    editZone.style.display = "none";
}

function HidePageHWSetting() {
    editWifi.style.display = "none";
}

function HideButtonRemoveProgram() {
    document.getElementById("button-green").innerHTML = "ลบคำสั่ง";
    document.getElementById("button-green").classList.add("button-green-line")
    document.getElementById("button-green").classList.remove("button-darkgreen-line")
    document.getElementById("addTimer").classList.add("addTimer");
    document.getElementById("addTimer").classList.remove("addtimer1");
}

function HideEditButtonForDelete() {
    for (let n = 0; n < dataProgram_toShow.length; n++) {
        let edit_btn = document.getElementById("column0_edit" + n);
        edit_btn.style.display = "none";
    }
}

function DisplayLoder(tab) {
    loderr.style.display = "block";

    console.log("display loader of tab:", tab);

    if (tabNow == "editWifi") {
        HidePageHWSetting();
        HideTimerSettingProgram();
    }
    else if (tabNow == "editZone") {
        // HidePageZoneSetting();
        zone_part1.style.display = "none";
        if (tab == "setMode" || tab == "setPump") {
            zone_part2.style.display = "none";
        }
    }
    else if (tabNow == "setTimer") {
        if (tab == "afteraddPro") {
            HideTimerSettingProgram();
        }
        else if (tab == "deletePro") {
            timer_part1.style.display = "none";
        }
    }


}

function HideLoader(tab) {
    loderr.style.display = "none";
    console.log("hide loader of tab:", tab);

    if (tabNow == "setTimer") {

        if (tab == "deletePro") {
            // timer_part1.style.display = "block";
            // EditProgramButton();
        }
    }
    else if (tabNow == "editZone") {
        if (tab == "setMode" || tab == "setPump" || tab == "setValve") {
            DisplaySetManual();
            valve_display();

        }

        else if (tab == "setAuto") {
            zone_part2.style.display = "none";
        }
    }
}

function ShowDetail(pro_in) {

    let H = Math.floor(dataProgram_toShow[pro_in].startTime / 60);
    let M = dataProgram_toShow[pro_in].startTime % 60;
    let h = Math.floor(dataProgram_toShow[pro_in].endTime / 60);
    let m = dataProgram_toShow[pro_in].endTime % 60;
    h = TimeString(h);
    m = TimeString(m);
    H = TimeString(H);
    M = TimeString(M);
    let repeattt;
    let alertMesg = H + "." + M + " น. ถึง " + h + "." + m + " น.";
    let msg;


    let sum = dataProgram_toShow[pro_in].repeatB;
    let reducer = (accumulator, curr) => accumulator + curr;
    let summ = sum.reduce(reducer);
    console.log("sum repeatD", sum, sum.reduce(reducer));
    if (summ == 7) {
        repeattt = "ทุกวัน"
        msg = "โปรแกรมรดน้ำโซน: " + dataProgram_toShow[pro_in].nZone + "<br>" + " ตั้งแต่เวลา:" + "<br>" + alertMesg + "<br>" + "  รดซ้ำทุก: " + repeattt;

    }
    else {
        let repeattt_bb = [];
        for (let i = 0; i < sum.length; i++) {

            if (sum[i] == 1) {
                let day_y = dayThaiName[i];
                repeattt_bb.push(day_y);
            }

        }

        repeattt_bb = repeattt_bb.toString();
        msg = "โปรแกรมรดน้ำโซน: " + dataProgram_toShow[pro_in].nZone + "<br>" + " ตั้งแต่เวลา:" + "<br>" + alertMesg + "<br>" + " รดซ้ำทุก: " + repeattt_bb;
        console.log("repeat B > name", repeattt)
    }

    OpenModal(msg, 'small');
    console.log("SHOW DETAIL OF PROGRAM:", dataProgram_toShow[pro_in]);
    // if(dataProgram_toShowSet_2[pro_in].repeatB)

}

function OpenModal(mesg, textSize) {
    console.log("MODAL:", mesg)
    modal = document.getElementById("myModal").style.display = "block";//opens the modal
    document.getElementById("errorMesg").innerHTML = mesg;
    if (textSize == 'big') {
        document.getElementById("errorMesg").classList.add("modal-content1");
        document.getElementById("errorMesg").style.fontSize = '23px';
    }
    else if (textSize == 'small') {
        document.getElementById("errorMesg").classList.remove("modal-content1");
        document.getElementById("errorMesg").style.fontSize = '20px';
    }
}

function OpenConfirmModal() {
    document.getElementById("confirm_modal").style.display = "block";//open the modal
}

function CloseConfirmModal(type_modal) {
    document.getElementById("confirm_modal").style.display = "none";//close the modal

    if (type_modal == 'notify_modal') {
        document.getElementById("alert_modal").style.display = "none";//close the modal

    }
}

function TimeString(t) {
    if (t.toString().length == 1) {
        t = "0" + t;
    }
    return t;
}

function CloseModal(type_alrt) {
    document.getElementById("myModal").style.display = "none";
    document.getElementById("errorMesg").classList.remove("modal-content1");
    document.getElementById("errorMesg").style.fontSize = '20px';


    //-------- notify modal
    if (type_alrt == "notify_modal") {
        document.getElementById("alert_modal").style.display = "none";
        document.getElementById("errorMesg").classList.remove("modal-content1");

    }
}

function EditProgramButton() {
    OnlyShowProgramTab.style.display = "none";
    buttonTimerTab.style.display = "block";
    save_editProgram.style.display = "block";
    event_con = "editMode";

    tab_editZone.disabled = true;
    tab_editWifi.disabled = true;
    tab_setTimer.disabled = true;

    disable_displayMode();

}

function ToggleProgram(pro_in) {

    if (dataProgram_toShow[pro_in].status == 0) {
        dataProgram_toShow[pro_in].status = 1;
    }
    else if (dataProgram_toShow[pro_in].status == 1) {
        dataProgram_toShow[pro_in].status = 0;
    }

    let update_hw = {
        hwId: dataProgram_toShow[pro_in].oriIndex,
        status: dataProgram_toShow[pro_in].status
    };

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/UpdateEnPro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }

    var data = JSON.stringify(update_hw);
    Http.send(data);


}

function ToggleZone(zoneIndex) {

    let zoneStatus = DecToBi(dataZoneEn, maxZone);

    if (zoneStatus[zoneIndex] == 0) {
        zoneStatus[zoneIndex] = 1;

    }
    else if (zoneStatus[zoneIndex] == 1) {
        zoneStatus[zoneIndex] = 0;
    }

    const zoneDecData = BiToDec(zoneStatus);
    DisplayLoder("setZone");
    PostSetZoneStatus(zoneDecData)

}

function SaveEditProgram() {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/get/SaveProgram';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {

            OnlyShowProgramTab.style.display = "block";
            buttonTimerTab.style.display = "none";
            save_editProgram.style.display = "none";
            event_con = "showOnly";
            HideToggleSwitch();
            disable_displayMode();
            HideLoader();
            location.reload();
            tab_editZone.disabled = false;
            tab_editWifi.disabled = false;
            tab_setTimer.disabled = false;
        }
        else if (Http.status === 404) {
            showNotificationModal("การเชื่อมต่อขัดข้อง");
        }
    }
    Http.send();

}

function ConfirmSetTime() {

    let set_timeHW;

    if (datetime_New.wday == null) {
        OpenModal("กรุณาเลือกวัน", 'big')

    } else {
        set_timeHW = {
            hour: datetime_New.hour,
            minute: datetime_New.minute,
            day: datetime_New.wday
        }
        DisplayLoder();
        PostSetTimeHW(set_timeHW);
    }

}

function SendNewPass() {

    var regEx = /[a-zA-Z0-9]{8,}/;
    let new_pass = document.getElementById('newpass');
    console.log("set new pass", new_pass.value)
    if (new_pass.value == '') {
        OpenModal("กรุณาใส่รหัสผ่านเพื่อบันทึกรหัสใหม่", "big");
    }
    else if (new_pass.value != null) {

        if (new_pass.value != dataPassHW) {
            let check_pass = regEx.test(new_pass.value);
            if (check_pass == false) {
                OpenModal("กรุณาใช้ภาษาอังกฤษหรือตัวเลขรวมกัน 8 ตัว", 'big');
            }
            else {
                //SendNewPasstoHW(new_pass.value);
                DisplayLoder();
                PostSetPassHW(new_pass.value);

                // console.log("send new pass to hw--", )
            }
        }
        else {
            OpenModal("รหัสผ่านซ้ำ", 'big');
        }

    }
}

function showNotificationModal(mesgg) {

    document.getElementById("alert_modal").style.display = "block";//opens the modal
    document.getElementById("errorMesg_1").innerHTML = mesgg;
}

function EditButtonForDelete() {

    let delete_button = document.getElementById("button-green").innerHTML;

    for (let n = 0; n < dataProgram_toShow.length; n++) {
        let col0 = document.getElementById("column0_edit" + n);
        let col1 = document.getElementById("column1_edit" + n);
        let col2 = document.getElementById("column2_edit" + n);

        if (col0.style.display == "block") {
            col0.style.display = "none";
            col1.setAttribute("class", "col-sm-8 col-s-8 col-8 left padding-left");
            col2.setAttribute("class", "col-sm-4 col-s-4 col-4 right padding-top-3");
        }
        else {
            col0.style.display = "block";
            col0.setAttribute("class", "col-sm-2 col-s-2 col-2 left padding-top-3");
            col1.setAttribute("class", "col-sm-6 col-s-6 col-6 left padding-left");
            col2.setAttribute("class", "col-sm-4 col-s-4 col-4 right padding-top-3");
        }


        let switch_color = document.getElementsByClassName("onoffswitch-inner")
        let input_tag = document.getElementsByTagName("input");
        let timer_pad = document.getElementById("column1_edit" + n);

        if (delete_button == 'ลบคำสั่ง') {
            switch_color[n].classList.toggle("onoffswitch1-inner");
            input_tag[n].disabled = true;
            addTimer.disabled = true;
            timer_pad.style.pointerEvents = 'none';
        }
        else {
            switch_color[n].classList.remove("onoffswitch1-inner");
            input_tag[n].disabled = false;
            addTimer.disabled = false;
            timer_pad.style.pointerEvents = 'auto';
        }
    }


    if (delete_button == 'ลบคำสั่ง') {
        DisplayRemoveProgram();
    }
    else {
        HideRemoveProgram();
    }

}

function DisplayRemoveProgram() {
    document.getElementById("button-green").innerHTML = "จบการลบ";
    document.getElementById("button-green").classList.add("button-darkgreen-line")
    document.getElementById("button-green").classList.remove("button-green-line")
    document.getElementById("addTimer").classList.add("addtimer1");
    document.getElementById("addTimer").classList.remove("addTimer");
}

function DisplayEditDatetime() {
    allTab.style.display = "none";
    wifi_part1.style.display = "none";
    backMenu.style.display = "block";
    wifi_part2.style.display = "block";
    date_setting.style.display = "block";
    button_backZone.style.display = "block";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าตั้งค่าบอร์ด";
    button_backZone.setAttribute("onclick", "setTabPage(\"editWifi\")");

    DisplayTimerSetting('timerNow', 0, 0);
    DisplayDayButton([0, 0, 0, 0, 0, 0, 0], 'clear');

}

function HideRemoveProgram() {
    addTimer.disabled = false;
    document.getElementById("button-green").innerHTML = "ลบคำสั่ง";
    document.getElementById("button-green").classList.add("button-green-line")
    document.getElementById("button-green").classList.remove("button-darkgreen-line")
    document.getElementById("addTimer").classList.add("addTimer");
    document.getElementById("addTimer").classList.remove("addtimer1");
}

function AddButton() {


    if (dataProgram.length == 48) {
        OpenModal('โปรแกรมรดน้ำเต็ม กรุณาลบบางโปรแกรมเพื่อสร้างใหม่', 'big')
    }
    else {
        DisplayTimerSetting('timerProgram', 0, 0);
        DisplayBacktoMenu();
        timer_part2.style.display = "block";
        ZoneList.value = -1;
        duration.value = "";

        DisplayTimerPart2Add();
        DisplayDayButton([0, 0, 0, 0, 0, 0, 0], 0);
        dataProgram_New.repeatB = [0, 0, 0, 0, 0, 0, 0].concat([0]);
        dataProgram_New.hour = 0;
        dataProgram_New.minute = 0;
        dataProgram_New.repeatD = 0;
        dataProgram_New.nZone = null;
        bt_cancelProgram.style.display = 'block';
        bt_okProgram.style.display = 'block';
    }

}

function BackToDisplayZone() {

    const postMode = {
        Manual: 0
    };
    DisplayLoder("setMode");
    PostSetMode(postMode, "setAuto")

}

function DisplaySetManual() {
    allTab.style.display = "none";
    zone_part1.style.display = "none";
    backMenu.style.display = "block";
    zone_part2.style.display = "block";
    button_backZone.style.display = "block";
    button_backZone.style.width = "250px";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าจัดการอุปกรณ์";
    button_backZone.setAttribute("onclick", "BackToDisplayZone()");
}

function DisplayTimerSetting(event) {
    timer_setting.style.display = "block";

    let hh = 0;
    let mm = 0;

    if (event == 'timerNow') {
        datetime_New.hour = hh;
        datetime_New.minute = mm;
        topic_time.innerHTML = "แก้ไขเวลานาฬิกาในบอร์ดปัจจุบัน";
        arr_wday = [0, 0, 0, 0, 0, 0, 0];
        console.log("HH:MM", hh, mm)
    }
    else if (event == 'timerProgram') {
        topic_time.innerHTML = "ตั้งเวลารดน้ำ";
    }

    DisplayTimeSet("H", hh); //display hour
    DisplayTimeSet("M", mm); //display minute

}

function DisplayTimeSet(set, T) {
    let time_set = [T - 2, T - 1, T, T + 1, T + 2];
    let T_max = null;
    let id = "";
    if (set == "H") {
        T_max = 24;
        id = "HourDisplay";
    }
    else if (set == "M") {
        T_max = 60;
        id = "MinuteDisplay";
    }

    for (let i = 0; i < time_set.length; i++) {
        if (time_set[i] < 0) {
            time_set[i] = T_max + time_set[i];
        }
        else if (time_set[i] >= T_max) {
            time_set[i] = time_set[i] - T_max;
        }
        document.getElementById(id + (i + 1)).innerHTML = time_set[i];
        if (time_set[i] < 10) {
            document.getElementById(id + (i + 1)).innerHTML = "0" + time_set[i];
        }
    }

    if (set == "H") { H_array = time_set; }
    else if (set == "M") { M_array = time_set; }
}

function DisplayBacktoMenu() {

    allTab.style.display = "none";
    backMenu.style.display = "block";
    timer_part1.style.display = "none";
    button_backZone.style.display = "block";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าคำสั่งรดน้ำ"
    button_backZone.setAttribute("onclick", "DisplayTimerPart1()");
}

function DisplayTimerPart1() {
    timer_part1.style.display = "block";
    timer_part2.style.display = "none";
    button_backZone.style.display = "none";
    allTab.style.display = "block";
    HideTimerSettingProgram();
    HideRemoveProgram();
}

function DisplayTimerPart2Add() {
    timer_part1.style.display = "none";
    timer_part2.style.display = "block";
    bt_okProgram.style.display = "block";
    bt_okProgram.setAttribute("onclick", "SaveProgram('add')");
    bt_cancelProgram.style.display = "block";
}

function HourPrevArrow() {
    DisplayTimeSet("H", H_array[2] - 1);
    // console.log("HourPrevArrow", H_array[2]);
    if (tabNow == 'setTimer')
        dataProgram_New.hour = H_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.hour = H_array[2];
}

function HourNextArrow() {
    DisplayTimeSet("H", H_array[2] + 1);
    // console.log("HourNextArrow", H_array[2]);
    if (tabNow == 'setTimer') {
        dataProgram_New.hour = H_array[2];
        // console.log("A");
    }
    else if (tabNow == 'editWifi') {
        datetime_New.hour = H_array[2];
        // console.log("B");
    }

}

function MinutePrevArrow() {
    DisplayTimeSet("M", M_array[2] - 1);
    // console.log("MinutePrevArrow", M_array[2]);
    if (tabNow == 'setTimer')
        dataProgram_New.minute = M_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.minute = M_array[2];
}

function MinuteNextArrow() {
    DisplayTimeSet("M", M_array[2] + 1);
    // console.log("MinuteNextArrow", M_array[2]);
    if (tabNow == 'setTimer')
        dataProgram_New.minute = M_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.minute = M_array[2];
}

function ToggleEveryday() {
    if (dataProgram_New.everyDay == true) {
        dataProgram_New.everyDay = false;
        dataProgram_New.repeatB = [0, 0, 0, 0, 0, 0, 0].concat([0]);
    }
    else {
        dataProgram_New.everyDay = true;
        dataProgram_New.repeatB = [1, 1, 1, 1, 1, 1, 1].concat([0]);
    }
    console.log(dataProgram_New.repeatB)

    DisplayDayButton(dataProgram_New.repeatB, dataProgram_New.everyDay);
}

function ToggleDay(page, index, event) {

    if (page == "EditRealTime") {

        let sum = arr_wday.reduce((a, b) => a + b, 0);
        arr_wday[index] = 1;
        datetime_New.wday = index;

        let setdayy = document.getElementById("setRT_day" + (index + 1));
        setdayy.setAttribute("class", "button-day day-selected");

        for (i = 0; i < arr_wday.length; i++) {

            let setdayy1 = document.getElementById("setRT_day" + (i + 1))

            if (sum == 1 && i != index) {
                arr_wday[i] = 0;
                setdayy1.setAttribute("class", "button-day day-disselect");
            }

        }
        console.log(arr_wday, "WDAY:", datetime_New.wday)
    }
    else {

        if (dataProgram_New.everyDay == true) {
            dataProgram_New.repeatB = [0, 0, 0, 0, 0, 0, 0].concat([0]);
        }

        if (dataProgram_New.repeatB[index] == 0)
            dataProgram_New.repeatB[index] = 1;
        else
            dataProgram_New.repeatB[index] = 0;

        let sum = dataProgram_New.repeatB.reduce((a, b) => a + b, 0);

        if (sum == 7)
            dataProgram_New.everyDay = true;
        else
            dataProgram_New.everyDay = false;

        DisplayDayButton(dataProgram_New.repeatB, dataProgram_New.everyDay);

        console.log("toggle day for DATA PROGRAM:", dataProgram_New.repeatB);
    }

}

function DisplayDayButton(repeatArray, everyD) {

    let sum = repeatArray.reduce((a, b) => a + b, 0);
    let everyday = document.getElementById("everyday");

    if (sum == 7) {
        everyday.setAttribute("class", "button-day day-selected");
        for (let n = 1; n < 8; n++) {
            let day = document.getElementById("day" + n)
            day.setAttribute("class", "button-day day-disselect");
        }
    }
    else if (everyD == "clear") {
        datetime_New.wday = null;
        for (let n = 1; n < 8; n++) {
            let day = document.getElementById("setRT_day" + n)
            day.setAttribute("class", "button-day day-disselect");
        }
    }

    else {
        everyday.setAttribute("class", "button-day day-disselect");

        if (everyD == false) {
            for (let n = 0; n < day.length; n++) {
                let day = document.getElementById("day" + (n + 1));

                if (repeatArray[n] == 1)
                    day.setAttribute("class", "button-day day-selected");
                else
                    day.setAttribute("class", "button-day day-disselect");
            }
        }
    }
}

function PostMode(mode, state) {

    let mode_num;

    if (mode == 'auto')
        mode_num = 0;
    else if (mode == 'manual')
        mode_num = 1;

    const postMode = {
        Manual: mode_num
    };

    pump_0.setAttribute("class", "manual-button manual-off");
    for (let i = 0; i < 8; i++) {
        let zone_valve = document.getElementById('valve_' + i);
        zone_valve.setAttribute("class", "manual-button manual-off");
    }
    DisplayLoder("setMode1");
    PostSetMode(postMode, "setManual");
}

function PumpControl(pumpIndex) {

    let pump0 = document.getElementById('pump_0');
    if (pump_status == 0) {
        pump0.setAttribute("class", "manual-button manual-on");
        pump_status = 1;
        for (let j = 0; j < 8; j++) {
            let valve_set = document.getElementById("valve_" + j);
            valve_set.setAttribute("class", "manual-button manual-off");
        }
    }
    else {
        pump0.setAttribute("class", "manual-button manual-off");
        pump_status = 0;
        valve_status_set = [];

        for (let j = 0; j < 8; j++) {
            let valve_set = document.getElementById("valve_" + j);
            valve_set.setAttribute("class", "manual-button manual-disable");

        }
    }
    //เปิดหน้าจอโหลด
    DisplayLoder("setPump");
    PostSetPump(pump_status);
}

function valve_display() {

    let sum = valve_status_set.reduce((a, b) => a + b, 0);


    for (v = 0; v < 8; v++) {
        let id = document.getElementById("valve_" + v);

        if (valve_status_set[v] == 1) {
            id.setAttribute("class", "manual-button manual-on");
        }
        else {
            id.disabled = true;
            id.setAttribute("class", "manual-button manual-disable");
        }

    }



    if (sum == 0) {
        for (v = 0; v < 8; v++) {
            let id = document.getElementById("valve_" + v);
            id.setAttribute("class", "manual-button manual-off");
            id.disabled = false;
        }
    }



}

function ValveControl(val_ind, evt) {

    let sum = valve_status_set.reduce((a, b) => a + b, 0);
    let on_valve = document.getElementById("valve_" + val_ind);
    let vIndex = parseInt(val_ind);

    console.log("valve control", val_ind, sum, vIndex);

    if (pump_status == 1) {
        if (sum == 0) {
            valve_status_set[val_ind] = 1;
            OpenModal("ทดลองเปิดวาล์ว ใช้เวลา 5 วิ", "big");
            valve_display();
            DisplayLoder("setPump");
            PostSetValve(val_ind, 1);
        } else if (sum == 1) {
            if (valve_status_set[vIndex] == 1) {
                OpenModal("--------", "big");
                valve_status_set[vIndex] = 0;
                on_valve.setAttribute("class", "manual-button manual-off");
                OpenModal("ทดลองปิดวาล์ว ใช้เวลา 5 วิ", "big");
                valve_display();
                DisplayLoder("setPump");
                PostSetValve(val_ind, 0);

            } else {
                OpenModal("กรุณาปิดวาล์วโซนก่อน", "big");
            }
        }
    }
    else {
        OpenModal("กรุณาเปิดปั๊มก่อนเปิดวาล์ว", "big")
    }

}

//สำคัญก่อน save program  
function SaveProgram(event) {
    //check fill data
    console.log("CheckFillAddProgram", CheckFillAddProgram());
    if (CheckFillAddProgram() == 0) {
        console.log("IN LOOP checkAddProgram");
        console.log(checkAddProgram(dataProgram_toShow, dataProgram_New));
        if (checkAddProgram(dataProgram_toShow, dataProgram_New) == 0) {
            //ส่งข้อมูลไปให้ server
            const new_prog = {
                nZ: dataProgram_New.nZone,
                st: 1,
                hh: dataProgram_New.hour,
                mn: dataProgram_New.minute,
                rD: dataProgram_New.repeatD,
                dR: dataProgram_New.duration
            }
            console.log("SUCCESS ADD PROGRAM:", new_prog);
            DisplayLoder("afteraddPro");
            PostAddProToHW(new_prog);
        }
        else {
            //แจ้งเตือนว่าโปรแกรมซ้ำ
        }
    }
}

function checkAddProgram(refData, newData) {
    console.log("Length Program", refData.length);
    for (let index = 0; index < refData.length; index++) {
        console.log("checkDayProgram", newData.repeatB, refData[index].repeatB, checkDayProgram(newData.repeatB, refData[index].repeatB));
        if (checkDayProgram(newData.repeatB, refData[index].repeatB) == 1) {
            const refTime = [refData[index].startTime, refData[index].endTime];
            const newTime = [newData.startT, newData.stopT];
            if (checkTimeProgram(refTime, newTime, day_rep) == 1)
                return 1;
        }
    }
    return 0;
}

//case1: มีเวลารดน้ำซ้ำไหม (0=No,1=Yes)
function checkTimeProgram(refData, newData, day_rep) {
    if (newData[0] > refData[1] || refData[0] > newData[1]) {
        return 0;
    }

    else {

        let hh = Math.floor(refData[0] / 60);
        let mm = Math.floor(refData[0] % 60);
        let HH = Math.floor(refData[1] / 60);
        let MM = Math.floor(refData[1] % 60);
        let day_nn = dayThaiName[day_rep];

        let showhhmm = displayTimeHW([hh, mm]);
        let showHHMM = displayTimeHW([HH, MM]);

        console.log("return from displayTimeHW:", showhhmm, showHHMM)

        if (newData[1] > refData[0] || newData[0] > refData[1]) {

            let msg = "วัน" + day_nn + "มีโปรแกรมรดน้ำช่วง  " + showhhmm[0] + ":" + showhhmm[1] + " น. ถึง " + showHHMM[0] + ":" + showHHMM[1] + " น. อยู่แล้ว กรุณาเปลี่ยนเวลารดน้ำ นอกเหนือช่วงเวลาดังกล่าว";
            OpenModal(msg, "small");
        }
        return 1;
    }
}



//case2: มีวันรดน้ำซ้ำไหม (0=No,1=Yes)
function checkDayProgram(refData, newData) {
    for (let i = 0; i < refData.length; i++) {
        if (refData[i] == 1)
            if (newData[i] == refData[i]) {
                day_rep = i;
                return 1;
            }
    }
    return 0;
}

function CheckFillAddProgram() {

    let error = 1;
    dataProgram_New.nZone = parseInt(document.getElementById("ZoneList").value);
    dataProgram_New.duration = parseInt(document.getElementById("duration").value);
    dataProgram_New.startT = dataProgram_New.hour * 60 + dataProgram_New.minute;
    dataProgram_New.stopT = dataProgram_New.hour * 60 + dataProgram_New.minute + dataProgram_New.duration;
    dataProgram_New.repeatD = BiToDec(dataProgram_New.repeatB);

    if (dataProgram_New.nZone != -1) {
        if (dataProgram_New.duration > 0) {
            if (dataProgram_New.repeatD > 0) {
                error = 0;
            }
            else {
                OpenModal("เลือกวันรดน้ำ", 'big');
            }
        }
        else {
            OpenModal("ระบุเวลารดน้ำ", 'big');
        }
    }
    else {
        OpenModal("เลือก Zone", 'big');
    }
    return error;
}

function DeleteTimer(programIndex) {
    DisplayLoder("deletePro");
    PostDeleteProToHW(programIndex);
}

// --------------------------------------------------- Render UI------------------------------------------------------

//***********Render Zone Div****************************************

function RenderZoneDiv(zoneDec) {
    RemoveZoneChildNode();
    CreateDivZone(zoneDec);
}

function RemoveZoneChildNode() {
    for (let j = 0; j < maxZone; j++) {
        let child = document.getElementById("zChild_" + j);
        if (child != null) {
            let parent = document.getElementById("zone_" + j);
            parent.removeChild(child);
        }
    }
}

function CreateDivZone(zoneDec) {

    let zoneStatus = DecToBi(zoneDec, maxZone);

    for (let z = 0; z < maxZone; z++) {
        let zIndex = z;
        let tg_status = zoneStatus[z];

        //---------------column3------------------
        let input_tg = document.createElement("input");
        input_tg.setAttribute("id", "tgZone_" + zIndex);
        input_tg.setAttribute("onclick", "ToggleZone(" + zIndex + ")");
        input_tg.setAttribute("type", "checkbox");
        input_tg.setAttribute("name", "onoffswitch");
        input_tg.setAttribute("class", "onoffswitch-checkbox");

        let span1_tg = document.createElement("span");
        span1_tg.setAttribute("class", "onoffswitch-inner");
        let span2_tg = document.createElement("span");
        span2_tg.setAttribute("class", "onoffswitch-switch");

        let label_tg = document.createElement("label");
        label_tg.setAttribute("class", "onoffswitch-label");
        label_tg.setAttribute("for", "tgZone_" + zIndex);
        label_tg.appendChild(span1_tg);
        label_tg.appendChild(span2_tg);

        let div_tg2 = document.createElement("div");
        div_tg2.setAttribute("class", "onoffswitch");
        div_tg2.appendChild(input_tg);
        div_tg2.appendChild(label_tg)

        let div_tg1 = document.createElement("div");
        div_tg1.setAttribute("class", "switch");
        div_tg1.appendChild(div_tg2);

        let div_col_tg = document.createElement("div");
        div_col_tg.setAttribute("class", "col-sm-5 col-s-5 col-5 right");
        div_col_tg.appendChild(div_tg1);

        //---------------column1------------------
        let z_num = document.createElement("p");
        z_num.innerHTML = "โซน " + (zIndex + 1);
        z_num.setAttribute("id", "zNum_" + zIndex);

        //zone name column
        let div_col_zName = document.createElement("div");
        div_col_zName.setAttribute("class", "col-sm-7 col-s-7 col-7 left padding-left center");
        div_col_zName.appendChild(z_num);


        //div row
        let div_row = document.createElement("div");
        div_row.setAttribute("class", "row");
        div_row.appendChild(div_col_zName);
        div_row.appendChild(div_col_tg);

        //div boxboard
        let div_box = document.createElement("div");
        div_box.setAttribute("id", "zChild_" + zIndex);
        div_box.setAttribute("class", "box-underline");
        div_box.appendChild(div_row);

        let id = "zone_" + zIndex;
        let box = document.getElementById(id);
        box.appendChild(div_box);

        if (tg_status == 1) {
            document.getElementById("tgZone_" + zIndex).checked = true;
        }
        else {
            document.getElementById("tgZone_" + zIndex).checked = false;
        }
    }
}

//*********End Render Zone Div**************************************


//***********Render Program Div****************************************

function RenderProgramDiv(clearevt) {

    RemoveProgramChildNode();

    if (dataProgram.Data != [] && clearevt != "add" && clearevt != "clear") {
        dataProgram_toShow = [];
        for (let n = 0; n < dataProgram.Data.length; n++) {

            let start_time = ((dataProgram.Data[n].hh) * 60) + dataProgram.Data[n].mn;
            let end_time = (dataProgram.Data[n].hh * 60) + dataProgram.Data[n].mn + dataProgram.Data[n].dR;
            let repeat_bi = DecToBi(dataProgram.Data[n].rD, 8);
            let packDataProgram = {
                oriIndex: n,
                nZone: dataProgram.Data[n].nZ,
                status: dataProgram.Data[n].st,
                hour: dataProgram.Data[n].hh,
                minute: dataProgram.Data[n].mn,
                repeatD: dataProgram.Data[n].rD,
                repeatB: repeat_bi,
                startTime: start_time,
                endTime: end_time,
                duration: dataProgram.Data[n].dR

            };
            dataProgram_toShow.push(packDataProgram);
        }
    }
    CreateAllProgram();
}

function CreateAllProgram() {

    if (dataProgram_toShow != []) {
        dataProgram_toShow.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);
        for (let n = 0; n < dataProgram_toShow.length; n++) {
            CreateDivProgram(n, dataProgram_toShow[n].hour, dataProgram_toShow[n].minute, dataProgram_toShow[n].nZone, dataProgram_toShow[n].status);
        }
        HideEditButtonForDelete();
    }
}

function CreateDivProgram(progIndex, HH, MM, zone, status) {

    if (HH.toString().length == 1) {
        HH = "0" + HH;
    }
    if (MM.toString().length == 1) {
        MM = "0" + MM;
    }

    //---------------column0--------------------
    //delete button
    let div_del = document.createElement("div");
    div_del.setAttribute("id", "button" + progIndex);
    div_del.setAttribute("class", "button_edit")
    div_del.innerHTML = "&#8211;"
    div_del.setAttribute("onclick", "DeleteTimer(" + progIndex + ")");
    //delete column
    let div_col_del = document.createElement("div");
    div_col_del.setAttribute("id", "column0_edit" + progIndex);
    div_col_del.appendChild(div_del);

    //---------------column1---------------------
    //time
    let div_time = document.createElement("div");
    div_time.setAttribute("id", "time" + progIndex);
    div_time.setAttribute("class", "time");
    div_time.innerHTML = HH + " : " + MM;
    //zone
    let div_zone = document.createElement("div");
    div_zone.setAttribute("id", "zone" + progIndex);
    div_zone.setAttribute("class", "zone");
    div_zone.innerHTML = "โซน" + (zone + 1);
    //zone time column
    let div_col_zonetime = document.createElement("div");
    div_col_zonetime.setAttribute("id", "column1_edit" + progIndex);
    div_col_zonetime.setAttribute("class", "col-sm-7 col-s-7 col-7 left padding-left ");

    div_col_zonetime.appendChild(div_time);
    div_col_zonetime.appendChild(div_zone);

    //---------------column3------------------
    let input_tg = document.createElement("input");
    input_tg.setAttribute("id", "tgProgram_" + progIndex);
    input_tg.setAttribute("onclick", "ToggleProgram(" + progIndex + ")");
    input_tg.setAttribute("type", "checkbox");
    input_tg.setAttribute("name", "onoffswitch");
    input_tg.setAttribute("class", "onoffswitch-checkbox");

    let span1_tg = document.createElement("span");
    span1_tg.setAttribute("class", "onoffswitch-inner");
    let span2_tg = document.createElement("span");
    span2_tg.setAttribute("class", "onoffswitch-switch");

    let label_tg = document.createElement("label");
    label_tg.setAttribute("class", "onoffswitch-label");
    label_tg.setAttribute("for", "tgProgram_" + progIndex);
    label_tg.appendChild(span1_tg);
    label_tg.appendChild(span2_tg);

    let div_tg2 = document.createElement("div");
    div_tg2.setAttribute("class", "onoffswitch");
    div_tg2.appendChild(input_tg);
    div_tg2.appendChild(label_tg)

    let div_tg1 = document.createElement("div");
    div_tg1.setAttribute("class", "switch");
    div_tg1.appendChild(div_tg2);


    let div_col_tg = document.createElement("div");
    div_col_tg.setAttribute("id", "column2_edit" + progIndex);
    div_col_tg.setAttribute("class", "col-sm-5 col-s-5 col-5 right padding-top-3");
    div_col_tg.appendChild(div_tg1);
    //inner div
    let div_row = document.createElement("div");
    div_row.setAttribute("class", "row");
    div_row.appendChild(div_col_del);
    div_row.appendChild(div_col_zonetime);
    div_row.appendChild(div_col_tg);

    //outer div
    let div_box = document.createElement("div");
    div_box.setAttribute("id", "child_" + progIndex);
    div_box.setAttribute("class", "boxboard");
    div_box.appendChild(div_row);

    let id = "time_" + progIndex;
    let box = document.getElementById(id);
    box.appendChild(div_box);

    let tgID = "tgProgram_" + progIndex;
    let timeID = "time" + progIndex;
    let zoneID = "zone" + progIndex;

    if (status == 1) {
        document.getElementById(tgID).checked = true;
        document.getElementById(timeID).setAttribute("class", "time");
        document.getElementById(zoneID).setAttribute("class", "zone");
    }
    else {
        document.getElementById(tgID).checked = false;
        document.getElementById(timeID).setAttribute("class", "time_dis");
        document.getElementById(zoneID).setAttribute("class", "zone_dis");
    }
}

function RemoveProgramChildNode() {
    for (let j = 0; j < dataProgram_toShow.length; j++) {
        let child = document.getElementById("child_" + j);
        if (child != null) {
            let parent = document.getElementById("time_" + j);
            parent.removeChild(child);
        }
    }
}

//***********End Render Program Div****************************************

//***********Render Time (Tab3) Div****************************************

function RenderInfoHWDiv() {
    // date_t3.innerHTML = day_abTH[dataTimeHW.day];
    // hh_t3.innerHTML = dataTimeHW.hour;
    // mm_t3.innerHTML = dataTimeHW.minute;
    caltimetoshow();
    serialNumber.value = dataSerialNo;
    password.value = dataPassHW;
}

//***********EndRender Time (Tab3) Div****************************************

//----------------- calculation function
function DecToBi(dec, lengthBi) {
    let bi = (dec).toString(2);
    if (bi.length < lengthBi) {
        let N = lengthBi - bi.length;
        for (let i = 0; i < N; i++) {
            bi = 0 + bi;
        }
    }
    let biInteger = bi.split("").map(x => Number.parseInt(x, 10));
    return biInteger;
}

function BiToDec(bi) {
    let b = bi.toString().replace(/,/g, "");
    return dec = parseInt(b, 2);
}

// --------------------------------------------------- HTTP REQUEST------------------------------------------------------


function GetProgramHW() {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/get/AllPro';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            try {
                dataProgram = JSON.parse(Http.responseText);
            } catch (error) {
                console.log("Data Program Not Json");
            }
        }
        else if (Http.status === 404) {
            console.log("Server ไม่สามารถเชื่อมต่อได้");
        }
    }
    Http.send();
}

function GetZoneStatus() {

    dataZone = null //clear data

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/get/Zone';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            try {
                const data_recive = JSON.parse(Http.responseText);
                dataZoneEn = data_recive.zone
            } catch (error) {
                console.log("Data Zone Not Json");
            }

        }
        else if (Http.status === 404) {
            console.log("Server ไม่สามารถเชื่อมต่อได้");
        }
    }

    Http.send();
}

function GetTimeHW() {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/get/TimeHW';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            try {
                dataTimeHW = JSON.parse(Http.responseText);

            } catch (error) {
                console.log("Data Tine Not Json");
            }

        }
        else if (Http.status === 404) {
            console.log("Server ไม่สามารถเชื่อมต่อได้");
        }
    }

    Http.send();
}

function GetInFoHW() {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/get/LocalAP';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            try {
                let data_recive = JSON.parse(Http.responseText);
                dataPassHW = data_recive.pass;
                dataSerialNo = data_recive.sn;
            } catch (error) {
                console.log("Data Info Not Json");
            }

        }
        else if (Http.status === 404) {
            console.log("Server ไม่สามารถเชื่อมต่อได้");
        }
    }

    Http.send();
}

function PostAddProToHW(new_pro_toHW) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/Set/Pro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            const obj = {
                oriIndex: dataProgram_toShow.length,
                nZone: dataProgram_New.nZone,
                status: 1,
                hour: dataProgram_New.hour,
                minute: dataProgram_New.minute,
                repeatD: dataProgram_New.repeatD,
                repeatB: dataProgram_New.repeatB,
                duration: dataProgram_New.duration,
                startTime: dataProgram_New.hour * 60 + dataProgram_New.minute,
                endTime: dataProgram_New.hour * 60 + dataProgram_New.minute + dataProgram_New.duration

            }
            dataProgram_toShow.push(obj);
            HideLoader();
            RenderProgramDiv("add");
            DisplayTimerPart1();
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }
    const data = JSON.stringify(new_pro_toHW);
    Http.send(data);

}

function PostDeleteProToHW(hwId) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/Delete/Pro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            HideLoader();
            event_con = "editMode"
            RemoveProgramChildNode();
            dataProgram_toShow.splice(hwId, 1);
            RenderProgramDiv("clear");
            DisplayTimerPart1();
            disable_displayMode();

        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify({ "hwId": hwId });
    Http.send(data);

}

function PostSetZoneStatus(zoneData) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/UpdateEnPro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            HideLoader("setZone");
            dataZoneEn = zoneData;
            setTabPage("editZone");
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify({ "zone": zoneData });
    Http.send(data);

}

function PostSetMode(dataMode, state) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/Manual';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            if (state == 'setManual') {
                CloseConfirmModal();
                // setTabPage("editZone"); 
                HideLoader("setMode");
                // DisplaySetManual();

            }
            else if (state == 'setAuto') {
                setTabPage("editZone");
                HideLoader("setAuto");
                pump_status = 0;
                valve_status_set = [];
            }

        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify(dataMode);
    Http.send(data);
}

function PostSetPump(pump_status) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/Pump';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {

        if (Http.readyState === 4 && Http.status === 200) {
            //มี ปิดโหลดตรงนี้
            HideLoader("setPump");
            console.log(Http.responseText);
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify({ "pump": pump_status });
    Http.send(data);
}

function PostSetValve(index, status) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/Valve';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            //มี ปิดโหลดตรงนี้
            HideLoader("setValve");
            console.log(Http.responseText);
            CloseModal();
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify({ "nValve": index, "status": status });
    Http.send(data);
}

function PostSetTimeHW(dataTime) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/TimeHW';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {

        if (Http.readyState === 4 && Http.status === 200) {
            //มี ปิดโหลดตรงนี้
            HideLoader("editWifi");
            totalSeconds = 0;
            dataTimeHW = dataTime;
            caltimetoshow();
            upd_UITime();
            console.log("set time success---:", dataTime, dataTimeHW)
            setTabPage("editWifi");
            console.log(Http.responseText);
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify(dataTime);
    Http.send(data);
}

function PostSetPassHW(dataPass) {

    const Http = new XMLHttpRequest();
    const url = local_url + '/api/post/SetPassWifi';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            //มี ปิดโหลดตรงนี้

            OpenModal("ตั้งรหัสผ่านใหม่สำเร็จ", "big");
            HideLoader();
            password.value = dataPass;
            setTabPage("editWifi");
            console.log(Http.responseText);
        }
        else if (Http.status === 404) {
            console.log("เชื่อมต่อเครือข่ายผิดพลาด");
        }
    }

    const data = JSON.stringify({ "pss": dataPass });
    Http.send(data);
}
























