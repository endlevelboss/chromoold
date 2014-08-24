var mySelectedInCommonUser = null;
var mySelectedInCommonMatch = '';

function toggleInCommon(chkbox, name) { 
    if (chkbox.checked) {
        var match = getInCommonCustomData(mySelectedInCommonMatch);
        console.log(match);
        var inCommonMatch = getInCommonCustomData(name);
        if (match == null) {
            console.log('setter incommon');
            match = [];
            setCustom('incommon', mySelectedInCommonMatch, match);
        }
        if (match.indexOf(name) == -1) {
            match[match.length] = name;
        }
        if (inCommonMatch == null) {
            inCommonMatch = [];
            setCustom('incommon', name, inCommonMatch);
        }
        if (inCommonMatch.indexOf(mySelectedInCommonMatch) == -1) {
            inCommonMatch[inCommonMatch.length] = mySelectedInCommonMatch;
        }

         console.log(matches);
    } else {
        var match = getInCommonCustomData(mySelectedInCommonMatch);
        var inCommonMatch = getInCommonCustomData(name);
        for (var i=match.length-1; i > -1; i--){
            if (match[i] == name) {
                match.splice(i, 1); // sletter 
            }
        }
        for (var i=inCommonMatch.length-1; i > -1; i--){
            if (inCommonMatch[i] == mySelectedInCommonMatch) {
                inCommonMatch.splice(i, 1); // sletter 
            }
        }
    }
}

function onInCommonUserChange(select) {
    var user = select[select.selectedIndex].value;

    var transaction = db.transaction(["kits"], "readonly");
    var store = transaction.objectStore("kits");
    var index = store.index('name');
    var request = index.get(select.value);
    request.onsuccess = function (e) {
        mySelectedInCommonUser = e.target.result;
        updateInCommonMatchList();
        var matchlist = document.getElementById('othermatches');
        matchlist.innerHTML = '';
        mySelectedInCommonMatch = '';
    }
}
function updateInCommonMatchList() {
    $('#inCommonMatch').empty();
    if (mySelectedInCommonUser) {
        for (var i in mySelectedInCommonUser.matches) {
            addOption(document.selectInCommonMatch.inCommonMatch, mySelectedInCommonUser.matches[i].name, mySelectedInCommonUser.matches[i].name);
        }
    }
}

function onInCommonMatchChange(select) {
    var mymatch = select[select.selectedIndex].value;
    mySelectedInCommonMatch = mymatch;
    var matchArray = getInCommonCustomData(mymatch);
    var incommonmatches = [];
    for (var i in mySelectedInCommonUser.matches) {
        if (mySelectedInCommonUser.matches[i].name != mymatch) {
            incommonmatches[incommonmatches.length] = mySelectedInCommonUser.matches[i].name;
        }
    }
    var matchlist = document.getElementById('othermatches');
    var innerhtml = '';
    for (var i in incommonmatches) {
        var isChecked = '';
        if (matchArray != null && matchArray.indexOf(incommonmatches[i]) != -1) {
            isChecked = 'checked';
        }
        innerhtml = innerhtml + "<input type='checkbox' onclick='toggleInCommon(this, \"" + incommonmatches[i] + "\")' "+ isChecked +" />" + incommonmatches[i] + "<br>";
    }
    matchlist.innerHTML = innerhtml;
}

function getInCommonCustomData(name) {
    return getCustom('incommon', name);
    /*
    for (var i in myInCommons) {
        if (myInCommons[i][0] == mySelectedInCommonUser.name) {
            return myInCommons[i][1];
        }
    } 
    return null; */
}