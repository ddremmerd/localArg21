//---------------------- GLOBAL VAR
var tabNow = null;
var maxZone = 8;
var dataProgram;


var dataProgram_toShowSet = [];
//--------------------------

var H_array = [];
var M_array = [];
var countProgram = 0;
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

var dataProgramNew_toHW = {
    nZ: null,
    st: null,
    hh: null,
    mn: null,
    rD: null,
    dR: null,
}

var dayThaiName = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
var day_abTH = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อ."];
var day = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
var datetime_New = {
    minute: null,
    hour: null,
    day: null,
    wday: null,
    month: null,
    year: null,
};


//----------- param for board_time
var time_from_HW = {
    hour: null,
    minute: null,
    day: null
}

//---------- param for test message from HW
var msg_from_hw = "success";


function openTab(evt, TabName) {
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
        tablinks[j].className = tablinks[j].className.replace(" active", "");
    }

    document.getElementById(TabName).style.display = "block";
    evt.currentTarget.className += " active";
    document.getElementById("tab_" + TabName).classList.add("active");

    if (TabName == "setTimer") {
        setTimerTab();
    }

    if (TabName == "editZone") {
        EditZoneTab();
    }

    if (TabName == "editWifi") {
        EditWifiTab();
        DisplayTimeTab3();
        // getTimeFromBoard();
        // getSN_Pass();
    }
}

//----------------- calculation function
function DecToBi(dec, lengthBi) {
    let bi = (dec).toString(2);
    if (bi.length < lengthBi) {
        N = lengthBi - bi.length;
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

//----------------- display clock for time setting
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

function HourPrevArrow() {
    DisplayTimeSet("H", H_array[2] - 1);

    if (tabNow == 'setTimer')
        dataProgram_New.hour = H_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.hour = H_array[2];
}
function HourNextArrow() {
    DisplayTimeSet("H", H_array[2] + 1);

    if (tabNow == 'setTimer')
        dataProgram_New.hour = H_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.hour = H_array[2];
}
function MinutePrevArrow() {
    DisplayTimeSet("M", M_array[2] - 1);

    if (tabNow == 'setTimer')
        dataProgram_New.minute = M_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.minute = M_array[2];
}
function MinuteNextArrow() {
    DisplayTimeSet("M", M_array[2] + 1);

    if (tabNow == 'setTimer')
        dataProgram_New.minute = M_array[2];
    else if (tabNow == 'editWifi')
        datetime_New.minute = M_array[2];
}



function EditZoneTab() {
    DisplayZonePart1();
    textEditzoneTab.style.display = "block";
    bt_manualMode.style.display = "block";
    //-----get zone status from board
    GetZoneStatus();
}

function EditWifiTab() {

    wifiContent.style.display = "block";
    wifi_part2.style.display = "none";

    clearInterval(countup_timer)

}

function getTimeFromBoard() {

    // time_hw = time_from_HW;

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/get/TimeHW';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log("time for tab3", Http.responseText);
            let data = JSON.parse(Http.responseText);
            if (data != []) {
                time_from_HW.hour = data.hour;
                time_from_HW.minute = data.minute;
                time_from_HW.day = data.day;
                DisplayTimeTab3();

            }
        }
    }

    Http.send();

    return time_hw, time_from_HW;

}

function DisplayTimeTab3() {

    let hh = time_from_HW.hour;
    let mm = time_from_HW.minute;
    let dd = time_from_HW.day;

    // let hh = 19;
    // let mm = 45;
    // let dd = 5;

    dd_name = day_abTH[dd];

    date_t3.innerHTML = dd_name;
    hh_t3.innerHTML = hh;
    mm_t3.innerHTML = mm;

}

//------------------------- function of toggle day
function tryTogggle(ind, event) {

    console.log(event.target.className)
    // console.log(")

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

        // console.log("toggle day for DATA PROGRAM:", index);
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

        // console.log(dataProgram_New.repeatB)

        DisplayDayButton(dataProgram_New.repeatB, dataProgram_New.everyDay);

    }

    // DisplayDayButton(dataProgram_New.repeatB, dataProgram_New.everyDay);

}

//-------------display daybutton
function DisplayDayButton(repeatArray, everyD) {
    //[Mon, Tue, Wed, Thu, Fri, Sat, Sun]
    //[0,0,0,0,0,0,1]

    let sum = repeatArray.reduce((a, b) => a + b, 0);
    let everyday = document.getElementById("everyday");

    if (sum == 7) {
        everyday.setAttribute("class", "button-day day-selected");
        for (let n = 1; n < 8; n++) {
            let day = document.getElementById("day" + n)
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


// -------------------------------main function for tab3

function getSN_Pass() {

    // passHW = "99999999999";
    // serialNo = "dddddddddddd";

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/get/LocalAP';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            let data = JSON.parse(Http.responseText);
            if (data != []) {
                serialNo = data.sn;
                passHW = data.pass;

                serialNumber.value = serialNo;
                password.value = passHW;

            }
        }
    }

    Http.send();

    // var data = JSON.stringify();

    // serialNumber.value = "asfsdfasfasfsf";
    // password.value = "sdfs1235";

    return passHW, serialNo;

}

function DisplayEditDatetime() {
    allTab.style.display = "none";
    wifi_part1.style.display = "none";
    backMenu.style.display = "block";
    wifi_part2.style.display = "block";
    date_setting.style.display = "block";
    button_backZone.style.display = "block";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าตั้งค่าบอร์ด";
    button_backZone.setAttribute("onclick", "DisplayWifiPart1()");

    DisplayTimerSetting('timerNow');


}

function DisplayWifiPart1() {
    HideTimerSetting();
    HideEditDatetime();
    backMenu.style.display = "none";
    wifi_part1.style.display = "block";
    allTab.style.display = "block";
}

function HideTimerSetting() {
    timer_setting.style.display = "none";
}

function HideEditDatetime() {
    wifi_part2.style.display = "none";
    date_setting.style.display = "none";
}

//-----------------------------confirm time to board
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



        SendNewTimetoHW(set_timeHW);
    }

}

function SendNewTimetoHW(new_time) {

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/TimeHW';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }
    var data = JSON.stringify(new_time);
    Http.send(data);



}

//-------------------confirm new pass to board

let regEx = /[a-zA-Z0-9]{8,}/;
function SendNewPass() {


    let new_pass = document.getElementById('newpass');
    console.log("set new pass", new_pass.value)
    if (new_pass.value == '') {
        OpenModal("กรุณาใส่รหัสผ่านเพื่อบันทึกรหัสใหม่", "big")
    }
    else if (new_pass.value != null) {

        let check_pass = regEx.test(new_pass.value);
        if (check_pass == false) {
            OpenModal("กรุณาใช้ภาษาอังกฤษและตัวเลขเท่านั้น", 'big')
        }
        else {
            SendNewPasstoHW(new_pass.value);
            // console.log("send new pass to hw--", )
        }
    }
}

function SendNewPasstoHW(new_pass) {
    console.log("send new pass to hw--", new_pass)

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/SetPassWifi';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }

    var data = JSON.stringify({ "pss": new_pass });
    Http.send(data);

}



///--------------------------- main function for tab2

function GetZoneStatus() {

    dataZone = null //clear data
    RemoveZoneChildNode();


    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/get/Zone';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            let data = JSON.parse(Http.responseText);
            if (data != []) {
                zone_tab2 = data.zone;
                DiaplayZone(zone_tab2)
            }
        }
    }

    Http.send();
    return zone_tab2;

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

function DiaplayZone(zoneDec) {

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

function DisplayZonePart1() {
    allTab.style.display = "block";
    zone_part1.style.display = "block";
    backMenu.style.display = "none";
    zone_part2.style.display = "none";

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Manual';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }
    var data = JSON.stringify({ "Manual": 0 });
    Http.send(data);

}

function ToggleZone(prooo) {

    let zoneStatus = DecToBi(zone_tab2, maxZone);

    if (zoneStatus[prooo] == 0) {
        zoneStatus[prooo] = 1;

    }
    else if (zoneStatus[prooo] == 1) {
        zoneStatus[prooo] = 0;
    }

    let zone_tab2_dec = BiToDec(zoneStatus);

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Set/Zone';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            zone_tab2 = zone_tab2_dec;
        }
    }

    var data = JSON.stringify({ "zone": zone_tab2_dec });
    Http.send(data);

    console.log("tab2---", data);



}

function DisplayZonePart2() {
    allTab.style.display = "none";
    zone_part1.style.display = "none";
    backMenu.style.display = "block";
    zone_part2.style.display = "block";
    button_backZone.style.display = "block";
    button_backZone.style.width = "250px";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าจัดการอุปกรณ์";
    button_backZone.setAttribute("onclick", "BackToDisplayZonePart1()");
}

function BackToDisplayZonePart1() {


    //--------------condition of pupm sum
    // let sum = testValve_status.reduce((a, b) => a + b, 0);
    // let sumP = testPump_status.reduce((a, b) => a + b, 0);

    // if (sum != 0 || sumP != 0) {
    //     OpenModal("ระบบปิดปั๊มและวาล์วทั้งหมดแล้ว", 'big');
    //     PostValveControl(-1, 0, "AutoMode");
    // }
    // else {
    //     PostMode('auto');
    // }

    DisplayZonePart1();
    // console.log("--------back button", tabNow)
    if (tabNow == "editZone") {
        console.log("back button จัดการอุปกรณ์ CLEAR UI ใหม่เหมือนตอนเริ่มต้น")
        PostPumpandValvetoHW("restAll");
    }

}


function PostMode(mode, eventt) {
    
    let mode_num;

    if (mode == 'auto')
        mode_num = 0;
    else if (mode == 'manual')
        mode_num = 1;

    let postMode = {
        Manual: mode_num
    };

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Manual';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }

    var data = JSON.stringify(postMode);
    Http.send(data);


    console.log("POST mode", data);

    //----------------- sense from board

    DisplayZonePart2();
    CloseConfirmModal();

}

////-------------------- manage Modal
function OpenConfirmModal() {
    document.getElementById("confirm_modal").style.display = "block";//open the modal
}

function CloseConfirmModal(type_modal) {
    document.getElementById("confirm_modal").style.display = "none";//close the modal

    if (type_modal == 'notify_modal') {
        document.getElementById("alert_modal").style.display = "none";//close the modal

    }
}


//open the modal 
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

//--------- notification modal for hw feedback
function showNotificationModal(mesgg) {


    modal = document.getElementById("alert_modal").style.display = "block";//opens the modal
    document.getElementById("errorMesg_1").innerHTML = mesgg;
}

//clicks on <span> (x), close the modal
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
//clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    let modal = document.getElementById("myModal");
    let modal1 = document.getElementById("alert_modal");

    if (event.target == modal) {
        modal.style.display = "none";
    }
    else if (event.target == modal1) {
        modal1.style.display = "none";

    }
}

//--------loaeder display
function DisplayLoder() {
    loderr.style.display = "block";
}
function HideLoader() {
    loderr.style.display = "none";
}

//----------------------------function of tab1

function RemoveTimerChildNode() {
    for (let j = 0; j < countProgram; j++) {
        let child = document.getElementById("child_" + j);
        if (child != null) {
            let parent = document.getElementById("time_" + j);
            parent.removeChild(child);
        }
    }
}

var event_con;

function setTimerTab() {

    HideRemoveProgram();
    timer_part2.style.display = "none";
    timer_part1.style.display = "block";
    buttonTimerTab.style.display = "none";
    OnlyShowProgramTab.style.display = "block";
    save_editProgram.style.display = "none";
    event_con = "showOnly";
    GetProgram();
    disable_displayMode();
    HideToggleSwitch();


}

function EditProgramButton() {
    OnlyShowProgramTab.style.display = "none";
    buttonTimerTab.style.display = "block";
    save_editProgram.style.display = "block";
    event_con = "editMode";
    disable_displayMode();

}

function SaveEditProgram() {
    if (msg_from_hw == "con_err") {

        //-------------------- connection lost from HW
        showNotificationModal("การเชื่อมต่อขัดข้อง");
    }
    else if (msg_from_hw == "success") {

        OnlyShowProgramTab.style.display = "block";
        buttonTimerTab.style.display = "none";
        save_editProgram.style.display = "none";
        event_con = "showOnly";
        HideToggleSwitch();
        disable_displayMode();
        console.log("all status update", dataProgram_toShow_set_2)
    }


}


var dataProgram_toShow_set_2 = [];
var mode_status = "displayOnly";

function GetProgram(clearevt) {

    RemoveTimerChildNode();

    if (clearevt == "clear") {
        dataProgram.Data = []; //clear data
    }
    else if (clearevt == "add") {
        GetProgramHW();
        console.log("AAAAA");
    }
    else if (dataProgram.Data != [] && clearevt != "add") {

        dataProgram_toShow_set_2 = [];
        console.log("BBBBBB");
        for (let n = 0; n < dataProgram.Data.length; n++) {

            let start_time = ((dataProgram.Data[n].hh) * 60) + dataProgram.Data[n].mn;
            let end_time = (dataProgram.Data[n].hh * 60) + dataProgram.Data[n].mn + dataProgram.Data[n].dR;
            let repeat_bi = DecToBi(dataProgram.Data[n].rD, 8);

            let dataProgram_toShow = {

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

            dataProgram_toShow_set_2.push(dataProgram_toShow);
        }
    }
    countProgram = dataProgram_toShow_set_2.length;

    if (dataProgram_toShow_set_2 != []) {
        dataProgram_toShow_set_2.sort((a, b) => (a.startTime > b.startTime) ? 1 : -1);
        for (let n = 0; n < dataProgram_toShow_set_2.length; n++) {
            DisplayProgram(n, dataProgram_toShow_set_2[n].hour, dataProgram_toShow_set_2[n].minute, dataProgram_toShow_set_2[n].nZone, dataProgram_toShow_set_2[n].status, event_con);
        }
        HideEditButtonForDelete();
    }

}


function disable_displayMode() {
    for (let n = 0; n < dataProgram_toShow_set_2.length; n++) {
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

    for (let n = 0; n < countProgram; n++) {
        let edit_toggle = document.getElementById("column2_edit" + n);
        if (event_con == "showOnly") {
            edit_toggle.style.display = "none";
        } else {
            edit_toggle.style.display = "block";
        }
    }
}


function ToggleProgram(pro_in) {

    if (dataProgram_toShow_set_2[pro_in].status == 0) {
        dataProgram_toShow_set_2[pro_in].status = 1;
    }
    else if (dataProgram_toShow_set_2[pro_in].status == 1) {
        dataProgram_toShow_set_2[pro_in].status = 0;
    }

    console.log("zone: ", dataProgram_toShow_set_2[pro_in].nZone, " status:", dataProgram_toShow_set_2[pro_in].status);

    let update_hw = {
        hwId: dataProgram_toShow_set_2[pro_in].oriIndex,
        status: dataProgram_toShow_set_2[pro_in].status
    };

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/UpdateEnPro';
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

function ShowDetail(pro_in) {

    let H = Math.floor(dataProgram_toShow_set_2[pro_in].startTime / 60);
    let M = dataProgram_toShow_set_2[pro_in].startTime % 60;
    let h = Math.floor(dataProgram_toShow_set_2[pro_in].endTime / 60);
    let m = dataProgram_toShow_set_2[pro_in].endTime % 60;
    h = TimeString(h);
    m = TimeString(m);
    H = TimeString(H);
    M = TimeString(M);
    let repeattt;
    let alertMesg = H + "." + M + " น. ถึง " + h + "." + m + " น.";
    let msg;


    let sum = dataProgram_toShow_set_2[pro_in].repeatB;
    let reducer = (accumulator, curr) => accumulator + curr;
    let summ = sum.reduce(reducer);
    console.log("sum repeatD", sum, sum.reduce(reducer));
    if (summ == 7) {
        repeattt = "ทุกวัน"
        msg = "โปรแกรมรดน้ำโซน: " + dataProgram_toShow_set_2[pro_in].nZone + "<br>" + " ตั้งแต่เวลา:" + "<br>" + alertMesg + "<br>" + "  รดซ้ำทุก: " + repeattt;

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
        msg = "โปรแกรมรดน้ำโซน: " + dataProgram_toShow_set_2[pro_in].nZone + "<br>" + " ตั้งแต่เวลา:" + "<br>" + alertMesg + "<br>" + " รดซ้ำทุก: " + repeattt_bb;
        console.log("repeat B > name", repeattt)
    }

    OpenModal(msg, 'small');
    console.log("SHOW DETAIL OF PROGRAM:", dataProgram_toShow_set_2[pro_in]);
    // if(dataProgram_toShowSet_2[pro_in].repeatB)

}




var pro_Eachday = {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
};
function program_inEachDay() {


    for (let i = 0; i < dataProgram.length; i++) {
        for (n = 0; n < dataProgram[i].repeatB.length; n++) {
            if (dataProgram[i].repeatB[n] == 1) {
                let time_obj = {
                    startT: dataProgram[i].hour * 60 + dataProgram[i].minute,
                    stopT: dataProgram[i].hour * 60 + dataProgram[i].minute + dataProgram[i].duration
                }

                pro_Eachday[day[n]].push(time_obj)
                // console.log("วันที่มีโปรแกรม", n)
            }
        }
    }

    // console.log("PROGRAM EACH DAY", pro_Eachday)
}

function checkRepeatDay(objj) {

    console.log("เชควันซ้ำ")
    for (i = 0; i < objj.repeatB.length; i++) {
        if (objj.repeatB[i] == 1 && pro_Eachday[day[i]] != 0) {
            for (n = 0; n < pro_Eachday[day[i]].length; n++) {
                let startT = pro_Eachday[day[i]][n].hour * 60 + pro_Eachday[day[i]][n].min;
                let new_start_time = ((objj.hour) * 60) + objj.minute;
                if (new_start_time == startT) {
                    console.log("เวลาซ้ำ-----วันซ้ำ", day[i])
                    checkStart = 1;
                }
                else {
                    checkStart = 1;
                    console.log("เวลาซ้ำ-----วันNOOOซ้ำ", day[i])
                }
            }
            // console.log("HAVEEEE DAYY", pro_Eachday[day[i]])
        }

    }


}


var checkTimeAll = null;
var checkRepeat = [];
function checkTime(objj) {

    let new_start_time = ((objj.hour) * 60) + objj.minute;
    let new_end_time = (objj.hour * 60) + objj.minute + objj.duration;

    for (n = 0; n < dataProgram.length; n++) {
        let starttime = ((dataProgram[n].hour) * 60) + dataProgram[n].minute;
        let endtime = (dataProgram[n].hour * 60) + dataProgram[n].minute + dataProgram[n].duration;
        if (new_start_time == starttime) {
            console.log("เวลาเริ่มตรงกัน")


            for (i = 0; i < dataProgram[n].repeatB.length; i++) {

                if (dataProgram[n].repeatB[i] == 1) {
                    if (objj.repeatB[i] == 1) {
                        console.log(n, "เวลาซ้ำ ----- วันซ้ำ", day[i])
                    }
                } else {
                    if (objj.repeatB[i] == 0) {
                        console.log(n, "เวลาซ้ำ ----- วันไม่ซ้ำ", day[i])
                    }
                }

            }
        }
        else if (new_start_time != starttime) {
            if (new_start_time > starttime && new_start_time < endtime) {
                check_Between = 0;
                for (i = 0; i < dataProgram[n].repeatB.length; i++) {
                    if (objj.repeatB[i] == 1) {
                        if (dataProgram[n].repeatB[i] == 1) {

                            // let alrtmsg = "เวลาดังกล่าวมีโปรแกรมรดวัน" + dayThaiName[i] + "แล้ว กรุณาเปลี่ยนวันรดซ้ำ"

                            let alrtmsg = "วัน" + dayThaiName[i] + "มีคิวรดน้ำช่วง  " + "น. อยู่แล้ว กรุณาเปลี่ยนเวลาเริ่มรดน้ำ นอกเหนือช่วงเวลาดังกล่าว";
                            OpenModal(alrtmsg, 'small');
                            console.log("เวลาทับ ----- วันซ้ำ", day[i])

                        }

                    }
                }
            }
            else if (new_start_time < starttime && new_end_time > starttime) {
                for (i = 0; i < dataProgram[n].repeatB.length; i++) {
                    if (objj.repeatB[i] == 1) {
                        if (dataProgram[n].repeatB[i] == 1) {

                            let alrtmsg = "วัน" + dayThaiName[i] + "มีคิวรดน้ำช่วง  " + "น. อยู่แล้ว กรุณาเปลี่ยนเวลาเริ่มรดน้ำ นอกเหนือช่วงเวลาดังกล่าว";
                            OpenModal(alrtmsg, 'small');
                            console.log("เวลา      +++จบ+++++     ซ้อนกัน --- วันซ้ำ", day[i]);

                        }
                        else {
                            console.log("ไม่ซ้ำละจ้า", day[i]);

                        }
                    }
                }

            }

        }
    }

}



function TimeString(t) {
    if (t.toString().length == 1) {
        t = "0" + t;
    }
    return t;
}

function DisplayTimerPart1() {
    timer_part1.style.display = "block";
    timer_part2.style.display = "none";
    button_backZone.style.display = "none";
    allTab.style.display = "block";
    HideTimerSetting();
    HideRemoveProgram();
}

function DisplayTimerPart2Add() {
    timer_part1.style.display = "none";
    timer_part2.style.display = "block";
    bt_okProgram.style.display = "block";
    bt_okProgram.setAttribute("onclick", "SaveProgram('add')");
    bt_cancelProgram.style.display = "block";
}


function DisplayBacktoMenu() {

    allTab.style.display = "none";
    backMenu.style.display = "block";
    timer_part1.style.display = "none";
    button_backZone.style.display = "block";
    button_backZone.innerHTML = "&lt; ย้อนกลับ หน้าคำสั่งรดน้ำ"
    button_backZone.setAttribute("onclick", "DisplayTimerPart1()");
}

function EditButtonForDelete() {

    let delete_button = document.getElementById("button-green").innerHTML;

    for (let n = 0; n < countProgram; n++) {
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

function HideRemoveProgram() {
    document.getElementById("button-green").innerHTML = "ลบคำสั่ง";
    document.getElementById("button-green").classList.add("button-green-line")
    document.getElementById("button-green").classList.remove("button-darkgreen-line")
    document.getElementById("addTimer").classList.add("addTimer");
    document.getElementById("addTimer").classList.remove("addtimer1");
}
function DisplayRemoveProgram() {
    document.getElementById("button-green").innerHTML = "จบการลบ";
    document.getElementById("button-green").classList.add("button-darkgreen-line")
    document.getElementById("button-green").classList.remove("button-green-line")
    document.getElementById("addTimer").classList.add("addtimer1");
    document.getElementById("addTimer").classList.remove("addTimer");
}

function HideEditButtonForDelete() {
    for (let n = 0; n < countProgram; n++) {
        let edit_btn = document.getElementById("column0_edit" + n);
        edit_btn.style.display = "none";
    }
}

function AddButton() {


    if (dataProgram.length == 3) {
        OpenModal('โปรแกรมรดน้ำเต็ม กรุณาลบบางโปรแกรมเพื่อสร้างใหม่', 'big')
    }
    else {
        DisplayTimerSetting('timerProgram', 0, 0);
        DisplayBacktoMenu();
        timer_part2.style.display = "block";
        ZoneList.value = -1;
        duration.value = "";

        // dataProgram_New.nProgram = use_nProgram.notUse[0];
        DisplayTimerPart2Add();
        dataProgram_New.repeatB = [0, 0, 0, 0, 0, 0, 0].concat([0]);
        dataProgram_New.hour = 0;
        dataProgram_New.minute = 0;

        bt_cancelProgram.style.display = 'block';
        bt_okProgram.style.display = 'block';
    }

}

function DisplayTimerSetting(event) {
    timer_setting.style.display = "block";

    let hh = 0;
    let mm = 0;

    if (event == 'timerNow') {
        // hh = datetime_New.hour;
        // mm = datetime_New.minute;
        topic_time.innerHTML = "แก้ไขเวลานาฬิกาในบอร์ดปัจจุบัน";
        console.log("HH:MM", hh, mm)
    }
    else if (event == 'timerProgram') {
        // hh = dataProgram_New.hour;
        // mm = dataProgram_New.minute;
        topic_time.innerHTML = "ตั้งเวลารดน้ำ";
    }

    DisplayTimeSet("H", hh); //display hour
    DisplayTimeSet("M", mm); //display minute

}



function HideTimerSetting() {
    timer_setting.style.display = "none";
}


function DeleteTimer(pog_ind) {

    dataProgram_toShow_set_2.splice(pog_ind, 1);

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Delete/Pro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            GetProgram('clear');
            DisplayTimerPart1();
            console.log("update all program to hw", dataProgram_toShow_set_2)
        }
    }

    var data = JSON.stringify({ "hwId": pog_ind });
    Http.send(data);

}

function showNotificationModal(mesgg) {

    modal = document.getElementById("alert_modal").style.display = "block";//opens the modal
    document.getElementById("errorMesg_1").innerHTML = mesgg;
}


//-------------------------------------------------------to save
function CalculateStopTime(H, M, d) {
    return (H * 60 + M) + d;
}

function SaveProgram(event) {


    dataProgram_New.nZone = parseInt(document.getElementById("ZoneList").value);
    if (dataProgram_New.nZone != -1) {
        dataProgram_New.duration = parseInt(document.getElementById("duration").value);
        if (dataProgram_New.duration > 0) {
            if (dataProgram_New.hour >= 0 && dataProgram_New.minute >= 0) {
                dataProgram_New.startT = dataProgram_New.hour * 60 + dataProgram_New.minute;
                dataProgram_New.stopT = dataProgram_New.hour * 60 + dataProgram_New.minute + dataProgram_New.duration;
                // console.log("TIME CONVERTED===========", dataProgram_New.startT, dataProgram_New.stopT)
                dataProgram_New.status = 1;

                if (dataProgram_New.repeatB != null) {
                    let sum = dataProgram_New.repeatB.reduce((a, b) => a + b, 0);
                    // console.log("SUM----", sum)
                    if (sum > 0) {
                        dataProgram_New.repeatD = BiToDec(dataProgram_New.repeatB);

                        let ans = CheckTimerSetting(dataProgram_New.repeatB, dataProgram_New.startT, dataProgram_New.stopT, dataProgram_New.duration, pro_Eachday);

                        if (ans[0] == true) {

                            let objjjjjj = {
                                oriIndex: countProgram,
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

                            let new_prog = {
                                nZ: dataProgram_New.nZone,
                                st: 1,
                                hh: dataProgram_New.hour,
                                mn: dataProgram_New.minute,
                                rD: dataProgram_New.repeatD,
                                dR: dataProgram_New.duration
                            }

                            dataProgram_toShow_set_2.push(objjjjjj);

                            GetProgram('add');
                            sendNewProtoHW(new_prog);
                            DisplayTimerPart1();
                        }
                        else {
                            OpenModal(ans[1], 'small');
                        }
                    }
                    else if (sum == 0) {
                        OpenModal("เลือกวันรดน้ำ", 'big');
                    }
                    else {
                        console.log("error");
                    }
                }
                else {
                    OpenModal("เลือกวันรดน้ำ", 'big');
                }
            }
        }
        else if (dataProgram_New.duration == 0) {
            OpenModal("ระบุเวลารดน้ำ > 0", 'big');
        }
        else {
            OpenModal("ระบุเวลารดน้ำ", 'big');
        }
    }
    else {
        OpenModal("เลือก Zone", 'big');
    }
}

function sendNewProtoHW(new_pro_toHW) {

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Set/Pro';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }

    var data = JSON.stringify(new_pro_toHW);
    Http.send(data);

    console.log("new prog to HW JSON", data);

}


function CheckTimerSetting(repeatB, startT, stopT, duration, dayProgram) {
    let checkStart = [], checkBetween = [], checkStop = [];
    let checkAll;
    let str = "";

    //case1: มีเวลาเริ่มต้นรดน้ำซ้ำ
    checkStart = CheckStartTimeSet(repeatB, dayProgram, startT);
    // console.log("checkเวลาเริ่ม:", checkStart[0], repeatB, dayProgram, startT);

    if (checkStart[0] == true) {
        //case2: เวลาเริ่มอยู่ระหว่าง 
        checkBetween = CheckBetweenTimeSet(repeatB, dayProgram, startT);
        // console.log("checkเวลาระหว่าง:", checkBetween[0]);

        if (checkBetween[0] == true) {
            checkStop = CheckStopTimeSet(repeatB, dayProgram, startT, stopT, duration);
            // console.log("checkเวลาจบ:", checkStop[0]);
            if (checkStop[0] == true) {
                checkAll = true;
            }
            else {
                str = checkStop[1];
                checkAll = false;
            }
        }
        else {
            str = checkBetween[1];
            checkAll = false;
        }
    }
    else {
        str = checkStart[1];
        checkAll = false;
    }
    return [checkAll, str];
}

//case1: มีเวลาเริ่มต้นรดน้ำซ้ำ
function CheckStartTimeSet(repeatB, dayProgram, startT) {
    // console.log("checkเวลาเริ่ม:", repeatB, dayProgram, startT);
    let alertMesg = "";
    let check;

    for (let d = 0; d < day.length; d++) {
        if (repeatB[d] == 1) {
            let dayName = dayThaiName[d]; //dayName: วันที่จะ check ว่า program ใหม่ ตั้งค่าได้?
            let aDayProg = dayProgram[day[d]]; //aDayProg: โปรแกรมในวัน dayName เช่น โปรแกรมทั้งหมดของวันจันทร์

            if (check === false) { break; }
            else {
                if (aDayProg.length >= 1) {
                    let Filter = aDayProg.filter(function (el) { return el.startT == startT });
                    console.log("filter in checkstart time:", Filter);
                    if (Filter.length > 0) {
                        check = false;
                        let h = Math.floor(startT / 60);
                        let m = startT % 60;
                        h = TimeString(h);
                        m = TimeString(m);
                        // alertMesg = "มีการตั้งค่ารดน้ำ วัน:" + dayName + " เวลา:" + h + "." + m + " แล้ว";
                        alertMesg = "วัน" + dayName + " มีคิวรดน้ำเวลา " + h + "." + m + " น. อยู่แล้ว กรุณาเปลี่ยนวันรดน้ำนอกเหนือช่วงเวลาดัง";
                    }
                    else if (Filter.length == 0) {
                        check = true;
                    }
                    else {
                        check = false;
                        console.log("error CheckStartTimeSet");
                    }
                }
                else if (aDayProg == 0) {
                    check = true;
                }
            }
        }
    }
    return [check, alertMesg];
}
//case2: เวลาเริ่มอยู่ระหว่าง 
function CheckBetweenTimeSet(repeatB, dayProgram, startT) {
    let alertMesg = "";
    let check;

    for (let d = 0; d < day.length; d++) {
        if (repeatB[d] == 1) {
            let dayName = dayThaiName[d];
            let aDayProg = dayProgram[day[d]];

            if (check === false) { break; }
            else {
                if (aDayProg.length >= 1) {
                    let Filter = aDayProg.filter(function (el) { return (el.startT < startT) && (startT < el.stopT + 1) });
                    console.log("filter in CheckBetweenTimeSet time:", Filter);

                    if (Filter.length > 0) {
                        check = false;
                        let H = Math.floor(Filter[0].startT / 60);
                        let M = Filter[0].startT % 60;
                        let h = Math.floor(Filter[0].stopT / 60);
                        let m = Filter[0].stopT % 60;
                        h = TimeString(h);
                        m = TimeString(m);
                        H = TimeString(H);
                        M = TimeString(M);
                        alertMesg = "วัน" + dayName + "มีคิวรดน้ำช่วง  " + H + "." + M + " น. ถึง " + h + "." + m + " น. อยู่แล้ว กรุณาเปลี่ยนเวลาเริ่มรดน้ำ นอกเหนือช่วงเวลาดังกล่าว";
                    }
                    else if (Filter.length == 0) {
                        check = true;
                    }
                    else {
                        check = false;
                        console.log("error CheckBetweenTimeSet");
                    }
                }
                else if (aDayProg == 0) {
                    check = true;
                }
            }
        }
    }
    return [check, alertMesg];
}
//case3: เวลาเริ่มก่อน 
function CheckStopTimeSet(repeatB, dayProgram, startT, stopT, duration) {
    let alertMesg = "";
    let check;

    for (let d = 0; d < day.length; d++) {
        if (repeatB[d] == 1) {
            let dayName = dayThaiName[d];
            let aDayProg = dayProgram[day[d]];

            if (check === false) { break; }
            else {
                if (aDayProg.length >= 1) {
                    let Filter = aDayProg.filter(function (el) {
                        return startT < el.startT &&
                            (!(stopT < el.startT - 1) || stopT != el.startT - 1) && (stopT <= el.startT - 1 == false)
                    });

                    console.log("filter in CheckStopTimeSet time:", Filter);

                    if (Filter.length > 0) {
                        check = false;
                        let H = Math.floor(Filter[0].startT / 60);
                        let M = Filter[0].startT % 60;
                        let h = Math.floor(Filter[0].stopT / 60);
                        let m = Filter[0].stopT % 60;
                        let tBefore = Filter[0].startT - duration - 1;
                        let hBefore = parseInt(tBefore / 60);
                        let mBefore = tBefore - hBefore * 60;
                        let reduceDur = Filter[0].startT - startT - 1;
                        h = TimeString(h);
                        m = TimeString(m);
                        H = TimeString(H);
                        M = TimeString(M);
                        hBefore = TimeString(hBefore);
                        mBefore = TimeString(mBefore);
                        alertMesg = "เวลาที่ตั้งค่าซ้อนทับคิวการรดน้ำวัน" + dayName +
                            "ช่วงเวลา " + H + "." + M + " น. ถึง " + h + "." + m + "น. กรุณาลดเวลารดน้ำไม่ให้เกิน " + reduceDur +
                            "นาที หรือเปลี่ยนเวลาเริ่มต้นเป็น " + hBefore + "." + mBefore + " น.";

                    }
                    else if (Filter.length == 0) {
                        check = true;
                    }
                    else {
                        check = false;
                        console.log("error CheckStopTimeSet");
                    }
                }
                else if (aDayProg == 0) {
                    check = true;
                }
            }
        }
    }
    return [check, alertMesg];
}


function PostProgram(data) {
    let updateData = {};
    updateData.nProgram = data.nProgram;
    updateData.nZone = data.nZone;
    updateData.repeatD = data.repeatD;
    updateData.status = data.status;
    updateData.hour = data.hour;
    updateData.minute = data.minute;
    updateData.duration = data.duration;
    console.log("POST program", updateData);

}

function ProgramEachDay(event) {
    let programFilter = [];
    if (event == "edit") {
        //filter program index now ออก
        programFilter = dataProgram.filter(function (el) { return el.nProgram != dataProgram[progIndexNow].nProgram; });
        // console.table(programFilter, ["nProgram", "startT", "repeatD", "nZone"]);
    }
    else if (event == "add") {
        programFilter = dataProgram;
    }
    else {
        console.log("error");
    }

    let dayProgram = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
    };

    for (let n = 0; n < dataProgram.length; n++) {
        for (let d = 0; d < 7; d++) {
            if (dataProgram[n].repeatB[d] == 1) {

                let obj = {
                    startT: dataProgram[n].startT,
                    stopT: dataProgram[n].stopT
                }
                dayProgram[day[d]].push(obj);
            }
        }
    }
    return dayProgram;
}

function DisplayProgram(progIndex, HH, MM, zone, status, event_con) {
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

//----------------------tab 1-1 display program only no edit
function DisplayProgramOnly(progIndex, HH, MM, zone) {
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
    div_col_zonetime.setAttribute("onclick", "ShowDetail(" + progIndex + ")");
    div_col_zonetime.appendChild(div_time);
    div_col_zonetime.appendChild(div_zone);



    //inner div
    let div_row = document.createElement("div");
    div_row.setAttribute("class", "row");
    div_row.appendChild(div_col_del);
    div_row.appendChild(div_col_zonetime);

    //outer div
    let div_box = document.createElement("div");
    div_box.setAttribute("id", "child_" + progIndex);
    div_box.setAttribute("class", "boxboard");
    div_box.appendChild(div_row);

    let id = "time_" + progIndex;
    let box = document.getElementById(id);
    box.appendChild(div_box);

}

//---------------------- tab 2-2 function
var pump_man_msg = 'ok';
var pump_status = 0;
var valve_status;

function PumpControl(pumpIndex) {

    var pump0 = document.getElementById('pump_0');

    if (pump_status == 0) {
        pump0.setAttribute("class", "manual-button manual-on");
        pump_status = 1;

        for (let j = 0; j < 8; j++) {
            let valve_set = document.getElementById("valve_" + j);
            valve_set.setAttribute("class", "manual-button manual-off")
        }
    }
    else {
        pump0.setAttribute("class", "manual-button manual-off");
        pump_status = 0;

        for (let j = 0; j < 8; j++) {
            let valve_set = document.getElementById("valve_" + j);
            valve_set.setAttribute("class", "manual-button manual-off")
        }

    }

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Pump';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
        }
    }

    var data = JSON.stringify({ "pump": pump_status });
    Http.send(data);
}


var valve_status_set = [];

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
            postValvetoHW(val_ind, 1);


        } else if (sum == 1) {
            if (valve_status_set[vIndex] == 1) {
                OpenModal("--------", "big");
                valve_status_set[vIndex] = 0;
                on_valve.setAttribute("class", "manual-button manual-off");
                OpenModal("ทดลองปิดวาล์ว ใช้เวลา 5 วิ", "big");
                valve_display();
                postValvetoHW(val_ind, 0);

            } else {
                OpenModal("กรุณาปิดวาล์วโซนก่อน", "big");
            }
        }
    }
    else {
        OpenModal("กรุณาเปิดปั๊มก่อนเปิดวาล์ว", "big")
    }
}

function postValvetoHW(val_ind, sttt) {

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/post/Valve';
    Http.open("POST", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            CloseModal();

        }
    }

    var data = JSON.stringify({ "nValve": val_ind, "status": sttt });
    Http.send(data);

    console.log("post valve status:", data);

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


function PostPumpandValvetoHW(eeeee) {
    console.log("post pump and valve to HW", eeeee);
}

//--------------- test timer countup

var totalSeconds = 0;
var countup_timer;

function setTime() {
    var secondsLabel = document.getElementById("seconds_1");

    ++totalSeconds;

    let sss = totalSeconds;
    secondsLabel.innerHTML = sss.toString();
}

function GetProgramHW() {

    const Http = new XMLHttpRequest();
    const url = 'http://192.168.4.1/api/get/AllPro';
    Http.open("GET", url, true);
    Http.setRequestHeader("Content-Type", "application/json");
    Http.onreadystatechange = (e) => {
        if (Http.readyState === 4 && Http.status === 200) {
            console.log(Http.responseText);
            dataProgram = JSON.parse(Http.responseText);
        }
    }
    Http.send();

    return dataProgram;

}

var passHW, time_hw, serialNo, zone_tab2;



function GetAllData() {

    // --------- data for tab1 from hw
    dataProgram = GetProgramHW();
    console.log("---- get program from hw:", dataProgram);



    // --------- data for tab2 from hw
    zone_tab2 = GetZoneStatus();
    console.log("---- get zone for tab2:", zone_tab2);

    //---------- data for tab3 from hw
    time_hw = getTimeFromBoard();
    passHW = getSN_Pass();

    console.log("---- data program:", time_hw, "password:", passHW, "serialNo:", serialNo);

    const wait_res = setInterval(() => {
        console.log([dataProgram, zone_tab2, time_hw, serialNo]);
        if (dataProgram != undefined && zone_tab2 != undefined && time_hw != undefined && serialNo != undefined) {
            HideTimerSetting();
            HideLoader();
            document.getElementById("tab_setTimer").click();
            clearInterval(wait_res);
        }
    }, 1000);

}


function Init() {

    countup_timer = setInterval(setTime, 1000);

    HideTimerSetting();
    GetAllData();
    setTimer.style.display = "none";
    editZone.style.display = "none";
    editWifi.style.display = "none";

}