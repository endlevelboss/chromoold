// fra onload.js
var buffer = null;  // canvasbuffer for chromobrowser
var idbSupported = false; // er indexeddb supported?
var db; // ref til databasen


// fra data.js
var kitNames = [];  // brukernavn paa alle userkits i databasen
var matches = [];  // custom data 
var kitRawdata = []; // kortversjon av raadata for de som inneholder det
//var colorcode = ['khaki','blue', 'darkblue', 'deepskyblue', 'red', 'darkred', 'orangered', 'green', 'yellow','khaki','khaki']; // temp fargekart
var colorcode = [];
var heritagemapper = [];

function Heritagemap(name) {
    this.name = name;
    this.map = [];
}

function getHeritageMap(name, ancestor) {
    for (var i in heritagemapper) {
        if (heritagemapper[i].name == name) {
            var mymap = heritagemapper[i].map;
            for (var j in mymap) {
                if (mymap[j][0] == ancestor) {
                    return mymap[j][1];
                }
            }
        }
    }
    return null;
}


// fra chromodisplay.js

/* 

Informasjon om kromosomlengder er hentet fra
http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/

*/



// fra relationtree.js

