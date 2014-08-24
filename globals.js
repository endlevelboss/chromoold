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

var chromolength36 = [247249719, 242951149, 199501827, 191273063, 180857866, 170899992, 158821424, 146274826, 140273252, 135374737, 134452384, 132349534, 114142980, 106368585, 100338915, 88827254, 78774742, 76117153, 63811651, 62435964, 46944323, 49691432, 154913754];

var chromolength37 = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067, 159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540, 102531392, 90354753, 81195210, 78077248, 59128983, 63025520, 48129895, 51304566, 155270560]

var centrostart36 = [121236957, 91689898, 90587544, 49354874, 46441398, 58938125, 58058273, 43958052, 47107499, 39244941, 51450781, 34747961, 16000000, 15070000, 15260000, 35143302, 22187133, 15400898, 26923622, 26267569, 10260000, 11330000, 58598737]

var centroend36 = [123476957, 94689898, 93487544, 52354874, 49441398, 61938125, 61058273, 46958052, 50107499, 41624941, 54450781, 36142961, 17868000, 18070000, 18260000, 36943302, 22287133, 16764896, 29923622, 28033230, 13260000, 14330000, 61598737]

var centrostart37 = [121535434, 92326171, 90504854, 49660117, 46405641, 58830166, 58054331, 43838887, 47367679, 39254935, 51644205, 34856694, 16000000, 16000000, 17000000, 35335801, 22263006, 15460898, 24681782, 26369569, 11288129, 13000000, 58632012];

var centroend37 = [124535434, 95326171, 93504854, 52660117, 49405641, 61830166, 61054331, 46838887, 50367679, 42254935, 54644205, 37856694, 19000000, 19000000, 20000000, 38335801, 25263006, 18460898, 27681782, 29369569, 14288129, 16000000, 61632012];

/* ***************************
   *  Velg oensket build her *
   *************************** */
var chromolength = chromolength36;  
var centrostart = centrostart36;
var centroend = centroend36;


var selectedChromosome = 1;
var selectedLimit = 5;
var chromosomeIndex = 0;
var displaySelection = 0;
var selectedPersonA = null;
var selectedPersonB = null;
var selectedPersonC = null;
var selectedPersonD = null;
var numOfRows = 1;

var selectedInCommonList = null;

var matchblockList = new Array();

var mouseIsDown = false;


////********************* Viktig variabel
var scale = 0;


// fra relationtree.js

