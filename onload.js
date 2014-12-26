
// Handtering av indexedDB
document.addEventListener('DOMContentLoaded', function () {
    if ('indexedDB' in window) {
        idbSupported = true;
    }

    if (idbSupported) {
        var openRequest = indexedDB.open('chromobrowser', 1);

        openRequest.onupgradeneeded = function (e) {
            console.log('Upgrading...');
            var thisDB = e.target.result;

            if (!thisDB.objectStoreNames.contains('kits')) {
                var objectStore = thisDB.createObjectStore('kits', { keyPath: "name" });
                objectStore.createIndex('name', 'name', { unique: true });
            } /*
            if (!thisDB.objectStoreNames.contains('matches')) {
                var objectStore = thisDB.createObjectStore('matches');
            }  */
            if (!thisDB.objectStoreNames.contains('raw')) {
                var objectStore = thisDB.createObjectStore('raw', { autoIncrement: true });
                objectStore.createIndex('name', 'name', { unique: true });
            } 
            if (!thisDB.objectStoreNames.contains('reducedraw')) {
                var objectStore = thisDB.createObjectStore('reducedraw');
            }  
        }

        openRequest.onsuccess = function (e) {
            //console.log('Success!');
            db = e.target.result;
            onStartup();
        }

        openRequest.onerror = function (e) {
            console.log('Error');
            console.log(e);
        }
    }
}, false);



window.onload = function () {
    var fileinput = document.getElementById("fileinput");
    fileinput.addEventListener("change", function (e) {
        callReader(fileinput.files);
    });

    var genedata = document.getElementById("autosomal");
    genedata.addEventListener("change", function (e) {
        callAutosomalReader(genedata.files);
    });

    var canvas = document.getElementById("chromobrowser");
    var ctx = canvas.getContext('2d');
    ctx.canvas.width = window.innerWidth - 150;
    ctx.canvas.height = window.innerHeight - 30;
    canvas.addEventListener("mousedown", cbMouseDown, false);
    canvas.addEventListener("mouseup", cbMouseUp, false);
    canvas.addEventListener("mousemove", cbMouseMove, false);
    canvas.addEventListener("mouseout", cbMouseOut, false);

    var treecanvas = document.getElementById("relationshipTree");
    ctx = treecanvas.getContext('2d');
    ctx.canvas.width = window.innerWidth - 150;
    ctx.canvas.height = window.innerHeight - 30;
    treecanvas.addEventListener("mousedown", mouseDownTree, false);
    treecanvas.addEventListener("mouseup", mouseUpTree, false);
    treecanvas.addEventListener("mousemove", mouseMoveTree, false);
    treecanvas.addEventListener("mouseout", mouseOutTree, false);

    var colSelector = document.getElementById('colorSelect');
    colSelector.addEventListener('mousedown', colorSelectDown, false);
    colSelector.addEventListener('mousemove', colorSelectMove, false);
    colSelector.addEventListener('mouseup', colorSelectUp, false);
    colSelector.addEventListener('mouseout', colorSelectUp, false);

    var dialog = document.getElementById("openDialog");
    dialog.addEventListener('dragstart', dialogDragstart, false);
    dialog.addEventListener('dragend', dialogDragend, false);

    buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;


    //loadLocalstorage();

    /*
    for (var i = 0; i < owners.length; i++) {
        var newUser = new User(owners[i].name);
        ownersRawdata[ownersRawdata.length] = newUser;
    } */

    //console.log(owners);
    //alert(buffer.height);
}

window.onbeforeunload = function (e) {
    cleanCustom();
    saveLocalstorage();
}

function loadLocalstorage() {
    var chromobrowserdata = localStorage.chromobrowser;
    if (chromobrowserdata != undefined) {
        var cbdata = JSON.parse(chromobrowserdata);
        matches = cbdata[0];
        var relationtreedata = getCustom('relationtree','chromobrowserglobalcustom');
        if (relationtreedata != null) {
            personBoxes = relationtreedata;
        }
    }
}

function saveLocalstorage() {
    // lagre relationtreedata
    setCustom('relationtree','chromobrowserglobalcustom',personBoxes);
    var chromobrowserdata = JSON.stringify([matches]);
    localStorage.chromobrowser = chromobrowserdata;
}

function onStartup() {
    var transaction = db.transaction(['kits'], "readonly");
    var store = transaction.objectStore('kits');

    var cursor = store.openCursor();
    cursor.onsuccess = function (e) {
        var res = e.target.result;
        if (res) {
            var user = res.value;
            //console.log(user);
            kitNames[kitNames.length] = user.name;
            res.continue();
        } else {
            loadLocalstorage();

            //runTemp();
            var canvas = document.getElementById('chromobrowser');
            scale = (canvas.width - 50) / chromolength[chromosomeIndex];

            $('#personAList').empty();
            $('#personBList').empty();
            $('#personCList').empty();
            $('#personDList').empty();
            $('#inCommonUser').empty();
            for (var i = 0; i < kitNames.length; i++) {
                addOption(document.selectPersonA.personAList, kitNames[i], kitNames[i]);
                addOption(document.selectPersonB.personBList, kitNames[i], kitNames[i]);
                addOption(document.selectPersonC.personCList, kitNames[i], kitNames[i]);
                addOption(document.selectPersonD.personDList, kitNames[i], kitNames[i]);
                addOption(document.selectInCommonUser.inCommonUser, kitNames[i], kitNames[i]);
            }
            if (kitNames.length > 0) {
                var transaction = db.transaction(["kits"], "readonly");
                var store = transaction.objectStore("kits");
                var index = store.index('name');
                var request = index.get(kitNames[0]);
                request.onsuccess = function (e) {
                    var res = e.target.result;
                    selectedPersonA = res;
                    selectedPersonB = res;
                    selectedPersonC = res;
                    selectedPersonD = res;
                    changeDisplay();

                    treeStartup();
                }
            } 
            var transaction = db.transaction(["raw"], "readonly");
            var storeRaw = transaction.objectStore('raw');
            var cursorRaw = storeRaw.openCursor();
            cursorRaw.onsuccess = function (e) {
                var resRaw = e.target.result;
                if (resRaw) {
                    var myraw = resRaw.value;
                    //console.log(myraw);
                    kitRawdata[kitRawdata.length] = myraw;
                    //console.log(kitRawdata);
                    resRaw.continue();
                }
            }
        }
    }
}
function addOption(list, text, value){
    var optn = document.createElement("option");
    optn.text = text;
    optn.value = value;
    list.add(optn);
}