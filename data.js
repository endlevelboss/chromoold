/*
function runTempNot() {
    // midlertidig funksjon, for litt testdata intill det blir mulig aa lage fargekart selv
    console.log('running temp');
    setCustom('heritage', 'Tony Asle  Ingebrigtsen', [2, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0]);
    setCustom('heritage', 'Tore Ingebrigtsen c/o   Ingebrigtsen', [2,0,0,0,1,1,1,2,2,2,2, 2]);
    setCustom('heritage', 'Anne Ingebrigtsen c/o  Ingebrigtsen', [2,2,2,2,2,2,2,0,1,2,2,2]);
    setCustom('heritage', 'Tor A Ingebrigtsen c/o  Ingebrigtsen ', [2,0,0,0,0,0,0,1,1,0,1,0]);
    setCustom('heritage','Ole Bakstad c/o  Ingebrigtsen' , [2,1,1,1,1,1,1,2,2,2,2,1]);
    setCustom('heritage','Randi Bakstad c/o  Ingebrigtsen' , [2,0,0,0,1,1,1,2,2,2,2,2]);
} */

function User(name) {
    this.name = name;
    this.matches = [];
    this.customData = [];
}

function UserRawdata(name) {
    this.name = name;
    this.raw = [];
}

function Match(name) {
    this.name = name;
    this.matchblocks = [];
}

function Matchname(name) {
    this.name = name;
    //this.kits = [];
    this.customdata = [];
    /*
    function addKit(kitname) {
        if (this.kits.indexOf(kitname) == -1) {
            this.kits[this.kits.length] = kitname;
        }
    } */
}

function RawData(myarray) {
    this.chromosome = myarray[1];
    this.position = myarray[2];
    var chars = myarray[3].split('');
    this.value = chars.sort();
}

function RawCompare(color, position) {
    this.color = color;
    this.position = position;
}

function Data(matchname, chromo, start, end, lngth, snp) {
    this.match = matchname;
    this.chromo = chromo;
    this.start = start;
    this.end = end;
    this.lngth = lngth;
    this.snp = snp;
    this.column = 0;
    this.bigcolumn = 0;
}

function MatchBlock(type, xpos, ypos, length, height, block) {
    this.type = type;
    this.xpos = xpos;
    this.ypos = ypos;
    this.length = length;
    this.height = height;
    this.block = block;
}

function Tuple(varA, varB){
    this.varA = varA;
    this.varB = varB;
}

function checkData(mymatch, dataarray) {
    for (var i = 0; i < mymatch.matchblocks.length; i++) {
        if (mymatch.matchblocks[i].chromo == dataarray[0] && mymatch.matchblocks[i].start == dataarray[1]) {
            return null;
        }
    }
    var mydata = new Data(mymatch.name, dataarray[0], dataarray[1], dataarray[2], dataarray[3] + "." + dataarray[4], dataarray[5]);
    mymatch.matchblocks[mymatch.matchblocks.length] = mydata;
    return mydata;
}

function addCustom(type,name,value) {
    var mymatch = null;
    for (var match in matches ){
        if (matches[match].name == name) {
            mymatch = matches[match];
        }
    }
    if (mymatch == null) {
        mymatch = new Matchname(name);
        mymatch.customdata[mymatch.customdata.length] = [type, value];
        matches[matches.length] = mymatch;
    } else {
        mymatch.customdata[mymatch.customdata.length] = [type, value];
    }
}

function setCustom(type, name, value) {
    var mymatch = null;
    for (var match in matches ){
        if (matches[match].name == name) {
            mymatch = matches[match];
        }
    }
    if (mymatch == null) {
        //console.log('mymatch null');
        mymatch = new Matchname(name);
        mymatch.customdata[mymatch.customdata.length] = [type, value];
        matches[matches.length] = mymatch;
    } else {
    //console.log('mymatch ikke null');
        var existing = null;
        for (var cust in mymatch.customdata) {
            if (mymatch.customdata[cust][0] == type) {
                existing = mymatch.customdata[cust];
            }
        }
        if (existing != null) {
            existing[1] = value;
        } else {
            mymatch.customdata[mymatch.customdata.length] = [type, value];
        }
    }
}

function getCustom(type, myname) {
    for (var match in matches) {
        if (matches[match].name == myname) {
            for(cust in matches[match].customdata) {
                if (matches[match].customdata[cust][0] == type) {
                    return matches[match].customdata[cust][1];
                }
            }
        }
    } 
    return null; 
}

function getCustomArray(type, name) {
    var foundValues = [];

    for (var match in matches) {
        if (matches[match].name == name) {
            for(cust in matches[match].customdata) {
                if (matches[match].customdata[cust][0] == type) {
                    foundValues[foundValues.length] = matches[match].customdata[cust][1];
                }
            }
        }
    }
    return foundValues;
}


function cleanCustom() {
    for (var i in matches) {
        for (var j = matches[i].customdata.length; j--;) {
            //console.log(matches[i].customdata[j]);
            if (matches[i].customdata[j][0] == 'crossover' && matches[i].customdata[j][1][0] == 0) { //sletter crossovers med kromosom satt til 0
                console.log('****************');
                console.log(matches[i].customdata[j]);
                matches[i].customdata.splice(j, 1);
            }
        }
    }
}

function displayData() {
    var myarray = owners;
    var display = document.getElementById("test");
    //display.innerHTML = "";
    for (var i = 0; i < myarray.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = myarray[i].name + " : " + myarray[i].dataArray.length;
        display.appendChild(li);
    }
}