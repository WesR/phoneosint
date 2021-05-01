var sid = "";
var token = "";
var credsInCookie = false;

this.onload = function(e) {
    loadCreds();
}

function getNumber(number, queryParams) {
    fetch('https://lookups.twilio.com/v1/PhoneNumbers/+' + number + "?" + new URLSearchParams(queryParams), {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + btoa(sid + ':' + token)
            }
        }).then(response => response.json())
        .then(result => {
            console.log(result);
            document.getElementById("output").innerText = JSON.stringify(result, null, 2);
        });
}

function loadCreds() {
    var loadedSID = document.cookie.match('(^|;) ?sid=([^;]*)(;|$)');
    document.getElementById("sid").value = loadedSID ? loadedSID[2] : "";

    var loadedToken = document.cookie.match('(^|;) ?token=([^;]*)(;|$)');
    document.getElementById("token").value = loadedToken ? loadedToken[2] : "";

    if (loadedSID && loadedToken) {
        credsInCookie = true;
    }

    sid = document.getElementById("sid").value;
    token = document.getElementById("token").value;
}

function saveCreds() {
    sid = document.getElementById("sid").value;
    token = document.getElementById("token").value;

    var d = new Date;
    d.setTime(d.getTime() + 126144000000);
    document.cookie = "sid" + "=" + document.getElementById("sid").value + ";path=/;expires=" + d.toGMTString(); // + ";HttpOnly=True;Secure=True";
    document.cookie = "token" + "=" + document.getElementById("token").value + ";path=/;expires=" + d.toGMTString(); // + ";HttpOnly=True;Secure=True";
}

function formatPhoneNumber(number) {
    //+15108675310
    if (number.length == 10) {
        return "1" + number
    }
    return number
}

function search(type = "") {
    if (!credsInCookie) { //this is dumb and will write every time but idc
        saveCreds();
    }

    if (type == "deep") {
        queryParams = {
            "Type": "caller-name",
            "AddOns": "ekata_reverse_phone"
        }
    } else if (type = "carrier") {
        queryParams = {
            "Type": "carrier"
        }
    } else {
        queryParams = {
            "Type": "caller-name"
        }
    }

    getNumber(formatPhoneNumber(document.getElementById("phonenumber").value), queryParams);
}