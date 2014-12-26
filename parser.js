var fileCount = 0;
var maxFiles = 0;
var interval = null;
var userRaw = null;

function callReader(files) {
    filelistChromo = files;
    readChromofiles(files);
    //onStartup();
}

function readChromofiles(files) {
    //console.log('i chromofilereader');
    //console.log(files);
    maxFiles = files.length;
    interval = setInterval(filesLoaded, 500);
    for (var k = 0; k < files.length; k++ ) {
        readfile(files[k], k);
    }
}


function filesLoaded(){
    if (fileCount == maxFiles) {
        fileCount = 0;
        //interval = null;
        clearInterval(interval);
        
        //saveLocalstorage();
        console.log('ferdig lastet');
        onStartup();
    }
}



function readfile(file, filenumber) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var currentKit = null;
        var text = reader.result;
        var result = text.split(/\r\n|\r|\n/g);

        for (var i = 0; i < result.length; i++) {
            currentKit = testLines(result[i], currentKit);
        }
        fileCount++;

        // legger filinfo til databasen
        var transaction = db.transaction(["kits"], "readwrite");
        var store = transaction.objectStore("kits");
        var index = store.index('name');
        var request = index.get(currentKit.name);
        request.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                store.put(currentKit);
                console.log('updating ' + currentKit.name);
            } else {
                store.add(currentKit);
                console.log('adding ' + currentKit.name);
            }
        }
        request.onerror = function (e) {
            console.log('errror gitt');
            console.log(e.target.error);
        }
    }
    reader.readAsText(file);
}

function testLines(mystring, kit) {
    var returnvalue = kit;
    if (mystring.charAt(0) == '"') {
        var last = mystring.lastIndexOf('"');
        var names = mystring.substr(1, last - 1);
        var nameArray = names.split('","');
        var data = mystring.substr(last + 2, mystring.length - last + 2);
        var dataArray = data.split(',');

        returnvalue = addChromodata(nameArray, dataArray, kit);
    }
    return returnvalue;
}

function addChromodata(namearray, dataarray, kit) {
    kit = updatePerson(namearray[0], kit);
    //console.log(kit);
    //var myowner = checkExisting(owners, namearray[0], User); // finner brukernavn, lager ny bruker dersom ikke eksisterer
    var mymatch = checkMatch(namearray[1], kit);
    //var mymatch = checkExisting(myowner.matches, namearray[1],  Match); // finner matchnavn, lager ny match hvis ikke eksisterer
    var mydata = checkData(mymatch, dataarray, kit); // sjekker om blokken allerede er lagret, legger til paa match om den ikke er det
    //var myownerraw = checkExisting(ownersRawdata, namearray[0], User);
    
    
    /*
    if (mydata != null) {
        myowner.dataArray[myowner.dataArray.length] = mydata;
        mymatch.dataArray[mymatch.dataArray.length] = mydata;
    } */
    return kit;
}

function updatePerson(kitname, kit) {
    if (kit == null)  {
        return new User(kitname);
    }
    if (kit.name != kitname) {
        return new User(kitname);
    }
    return kit;
}

function checkMatch(matchname, kit) {
    for (var i = 0; i<kit.matches.length; i++) {
        if (kit.matches[i].name == matchname) {
            return kit.matches[i];
        }
    }
    var newmatch = new Match(matchname);
    kit.matches[kit.matches.length] = newmatch;
    return newmatch;
}

/*
function checkExisting(array, name, myConstructor) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].name == name) {
            return array[i];
        }
    }
    var mymatch = new myConstructor(name);
    array[array.length] = mymatch;
    return mymatch;
}

*/



function callAutosomalReader(file){
    userRaw = new UserRawdata(selectedPersonD.name);
    var reader = new FileReader();

    reader.onload = function (e) {
        var text = reader.result;
        var result = text.split(/\r\n|\r|\n/g);
        for (var i = 0; i < result.length; i++) {
            testAutosomal(result[i]);
        }

        console.log(selectedPersonD);

        var transaction = db.transaction(["raw"], "readwrite");
        var store = transaction.objectStore("raw");
        var index = store.index('name');
        var request = index.get(userRaw.name);
        request.onsuccess = function (e) {
            var res = e.target.result;
            if (res) {
                store.put(userRaw);
                console.log('updating ' + userRaw.name);
            } else {
                var sjekk = store.add(userRaw);
                console.log('adding ' + userRaw.name);
                sjekk.onsuccess = function (e) {
                    console.log('suksess');
                }

                sjekk.onerror = function (e) {
                    console.log('ikke sukksess');
                    console.log(e);
                }
            }
        }
        request.onerror = function (e) {
            console.log('Error gitt');
            console.log(e.target.error);
        }
    }
    reader.readAsText(file[0]);
}

function testAutosomal(mystring){
    if (mystring.charAt(0) == '"') {
        var stringElements = mystring.split(',');
        for (var i =0; i<stringElements.length; i++){
            stringElements[i] = stripChars(stringElements[i]);
        }
        var raw = new RawData(stringElements);

        if (raw != null) {
            userRaw.raw[userRaw.raw.length] = raw;
        }
    }
}

function stripChars(myString){
    // removes first and last char in string
    var newString = myString.substr(1, myString.length - 2);
    return newString;
}

/*

function displayString(mystring) {
    var li = document.createElement("li");
    li.innerHTML = mystring;
    var display = document.getElementById("test");
    display.appendChild(li);
} */
