/* 

Informasjon om kromosomlengder er hentet fra
http://www.ncbi.nlm.nih.gov/projects/genome/assembly/grc/human/data/

*/
var chromolength36 = [247249719, 242951149, 199501827, 191273063, 180857866, 170899992, 158821424, 146274826, 140273252, 135374737, 134452384, 132349534, 114142980, 106368585, 100338915, 88827254, 78774742, 76117153, 63811651, 62435964, 46944323, 49691432, 154913754];

var chromolength37 = [249250621, 243199373, 198022430, 191154276, 180915260, 171115067, 159138663, 146364022, 141213431, 135534747, 135006516, 133851895, 115169878, 107349540, 102531392, 90354753, 81195210, 78077248, 59128983, 63025520, 48129895, 51304566, 155270560];

var centrostart36 = [121236957, 91689898, 90587544, 49354874, 46441398, 58938125, 58058273, 43958052, 47107499, 39244941, 51450781, 34747961, 16000000, 15070000, 15260000, 35143302, 22187133, 15400898, 26923622, 26267569, 10260000, 11330000, 58598737];

var centroend36 = [123476957, 94689898, 93487544, 52354874, 49441398, 61938125, 61058273, 46958052, 50107499, 41624941, 54450781, 36142961, 17868000, 18070000, 18260000, 36943302, 22287133, 16764896, 29923622, 28033230, 13260000, 14330000, 61598737];

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

var matchblockList = [];

var mouseIsDown = false;


////********************* Viktig variabel
var scale = 0;

var drawFunction = displaySelect0;

function onChange(select) {
    var canvas = document.getElementById('chromobrowser');
    selectedChromosome = select[select.selectedIndex].value;
    chromosomeIndex = select.selectedIndex;
    scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    changeDisplay();
}

function onLimitChange(select) {
    selectedLimit = select[select.selectedIndex].value;
    changeDisplay();
}

function onComparisonChange(select) {
    displaySelection = select.selectedIndex;
    if (displaySelection === 1) {
        numOfRows = 2;
        drawFunction = displaySelect1;
    } else if (displaySelection === 2) {
        numOfRows = 4;
        drawFunction = displaySelect2;
    } else if (displaySelection === 3) {
        numOfRows = 4;
        drawFunction = displaySelect3;
    } else if (displaySelection === 4) {
        numOfRows = 4;
        drawFunction = displaySelect4;
    } else {
        numOfRows = 1;
        drawFunction = displaySelect0;
    }
    changeDisplay();
}

function onPersonSelectionChange(select, selector) {
    var request = db.transaction(["kits"], "readonly").objectStore('kits').index('name').get(select.value);
//    var store = transaction.objectStore("kits");
//    var index = store.index('name');
//    var request = index.get(select.value);
    request.onsuccess = function (e) {
        var res = e.target.result;
        //console.log(res);
        if (selector === 0) {
            selectedPersonA = res;
        }
        if (selector === 1) {
            selectedPersonB = res;
        }
        if (selector === 2) {
            selectedPersonC = res;
        }
        if (selector === 3) {
            selectedPersonD = res;
        }
        changeDisplay();
    };
}

function changeDisplay() {
    var i = 0;
    if (kitNames.length < 1) {
        return;
    }

    for (i = 0; i < 4; i++) {
        var dad = 'row' + i + 'dad';
        var mum = 'row' + i + 'mum';
        var dadButton = document.getElementById(dad);
        dadButton.classList.remove('show');
        var mumButton = document.getElementById(mum);
        mumButton.classList.remove('show');
    }

    rulerIsVisible = false;

    matchblockList = [];
    clearCanvas();
    drawChromo();
    drawFunction();
    var canvas = document.getElementById("chromobrowser");
    var contextBuffer = buffer.getContext('2d');
    contextBuffer.drawImage(canvas,0,0);
}

function displaySelect0() {
    var data = sortChromodata(selectedPersonA);
    drawPersondata(data, 0, selectedPersonA);
}

function displaySelect1() {
    var person1 = sortChromodata(selectedPersonA);
    var person2 = sortChromodata(selectedPersonB);
    
    var incommon = findCommonMatches(selectedPersonA, selectedPersonB);
    
    var row0 = testInCommon(person1, incommon, true);
    var row1 = testInCommon(person2, incommon, true);
    
    drawPersondata(row0, 0, selectedPersonA);
    drawPersondata(row1, 1, selectedPersonB);
    
    drawRawComparison(selectedPersonA, selectedPersonB, 1);
}

function displaySelect2() {
    var person1 = sortChromodata(selectedPersonA);
    var person2 = sortChromodata(selectedPersonB);
    
    var incommon = findCommonMatches(selectedPersonA, selectedPersonB);
    
    var row0 = testInCommon(person1, incommon, false);
    var row1 = testInCommon(person1, incommon, true);
    var row2 = testInCommon(person2, incommon, true);
    var row3 = testInCommon(person2, incommon, false);
    
    drawPersondata(row0, 0, selectedPersonA);
    drawPersondata(row1, 1, selectedPersonA);
    drawPersondata(row2, 2, selectedPersonB);
    drawPersondata(row3, 3, selectedPersonB);
    
    drawRawComparison(selectedPersonA, selectedPersonB, 2);
}

function displaySelect3() {
    var person1 = sortChromodata(selectedPersonA);
    var person2 = sortChromodata(selectedPersonB);
    var person3 = sortChromodata(selectedPersonC);

    var incommon1 = findCommonMatches(selectedPersonA, selectedPersonB);
    var incommon2 = findCommonMatches(selectedPersonC, selectedPersonB);

    var row0 = testInCommon(person1, incommon1, true);
    var row1 = testInCommon(person2, incommon1, true);
    var row2 = testInCommon(person2, incommon2, true);
    var row3 = testInCommon(person3, incommon2, true);
    
    drawPersondata(row0, 0, selectedPersonA);
    drawPersondata(row1, 1, selectedPersonB);
    drawPersondata(row2, 2, selectedPersonB);
    drawPersondata(row3, 3, selectedPersonC);
    
    drawRawComparison(selectedPersonA, selectedPersonB, 1);
    drawRawComparison(selectedPersonB, selectedPersonC, 3);
}

function displaySelect4() { // Sammenligner to og to, fellestreff
    var person1 = sortChromodata(selectedPersonA);
    var person2 = sortChromodata(selectedPersonB);
    var person3 = sortChromodata(selectedPersonC);
    var person4 = sortChromodata(selectedPersonD);

    var incommon1 = findCommonMatches(selectedPersonA, selectedPersonB);
    var incommon2 = findCommonMatches(selectedPersonC, selectedPersonD);

    var row0 = testInCommon(person1, incommon1, true);
    var row1 = testInCommon(person2, incommon1, true);
    var row2 = testInCommon(person3, incommon2, true);
    var row3 = testInCommon(person4, incommon2, true);
    
    drawPersondata(row0, 0, selectedPersonA);
    drawPersondata(row1, 1, selectedPersonB);
    drawPersondata(row2, 2, selectedPersonC);
    drawPersondata(row3, 3, selectedPersonD);
    
    drawRawComparison(selectedPersonA, selectedPersonB, 1);
    drawRawComparison(selectedPersonB, selectedPersonC, 2);
    drawRawComparison(selectedPersonC, selectedPersonD, 3);
}

function drawPersondata(data, rownumber, selectedPerson) {
    var columns = checkColumnList(selectedPerson, data);
    drawColumnOverlay(rownumber, columns);
    drawData(data, rownumber, columns, chromosomeIndex);
    drawCrossovers(rownumber, columns);
}

function drawRawComparison(selectedA, selectedB, displayrow) {
    var personA = sortChromodata(selectedA);
    var rawA = sortRawdata(selectedA);
    var rawB = sortRawdata(selectedB);
    var compared = compareRaw(rawA, rawB);
    var comparedBlockdata = getChromodataByMatchname(personA, selectedB.name);
    drawRaw(compared, comparedBlockdata, displayrow);
}

function checkColumnList(user, datalist) {
    var useParentCheckbox = document.getElementById('useParentinfo');
    if (useParentCheckbox.checked) {
        var fathermatches = [];
        var fathercolumns = [];
        var mothermatches = [];
        var mothercolumns = [];
        var unknownmatches = [];
        var unknowncolumns = [];
        for (var i in datalist) {
            var heritage = getCustom('commonancestor', datalist[i].match);
            if (heritage != null) {
                var myheritage = getHeritageMap(user.name, heritage);
                //console.log(myheritage);
                datalist[i].bigcolumn = myheritage;
                //console.log(bigcol + ' ' + datalist[i].match);
                if (myheritage == 0) {
                    fathermatches[fathermatches.length] = datalist[i];
                } else if (myheritage == 1) {
                    mothermatches[mothermatches.length] = datalist[i];
                } else {
                    unknownmatches[unknownmatches.length] = datalist[i];
                }
            } else {
                datalist[i].bigcolumn = 2;
                unknownmatches[unknownmatches.length] = datalist[i];
            }
        }

        for (var i =0; i< fathermatches.length; i++) {
            checkColumn(fathercolumns, fathermatches[i], 0);
        }
        for (var i =0; i< mothermatches.length; i++) {
            checkColumn(mothercolumns, mothermatches[i], 0);
        }
        for (var i =0; i< unknownmatches.length; i++) {
            checkColumn(unknowncolumns, unknownmatches[i], 0);
        }

        var flength = fathercolumns.length;
        var mlength = mothercolumns.length;
        if (flength == 0) {
            flength = 1;
        }
        if (mlength == 0) {
            mlength = 1;
        }

        //console.log([fathercolumns.length, mothercolumns.length, unknowncolumns.length]);
        return [flength, mlength, unknowncolumns.length];

    } else {
        var columns = new Array();
        for (var i in datalist) {
            checkColumn(columns, datalist[i], 0);
        }
        return [columns.length];
    }
}

function testInCommon(person, inCommonList, useInCommon) {
    var isInCommon = [];
    for (var i in person) {
        var pos = inCommonList.indexOf(person[i].match);
        if (pos > -1 && useInCommon) {
            isInCommon[isInCommon.length] = new Data(person[i].match, person[i].chromo, person[i].start, person[i].end, person[i].lngth, person[i].snp) ;
        }
        if (pos == -1 && !useInCommon) {
            isInCommon[isInCommon.length] = new Data(person[i].match, person[i].chromo, person[i].start, person[i].end, person[i].lngth, person[i].snp) ;
        }
    }
    return isInCommon;
}

function drawRaw(data, blockdata, afterRowNumber){
    //alert('tegner raw');
    var canvas = document.getElementById("chromobrowser");
    var context = canvas.getContext("2d");
    var scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    var drawHeight = canvas.height - 50;
    var rowheight = (drawHeight - 6 * (numOfRows - 1)) / numOfRows;

    var ypos = 25 + rowheight * afterRowNumber + 6 *(afterRowNumber - 1) ;

    context.fillStyle = 'red';
    context.fillRect(25, ypos, canvas.width - 50, 6);
    context.fillStyle = 'yellow';
    for (var j = 0; j < blockdata.length; j++){
        var xpos = blockdata[j].start * scale + 25;
        var rectWidth = (blockdata[j].end - blockdata[j].start) * scale;
        context.fillRect(xpos, ypos, rectWidth, 6);
    }

    if (data.length > 0) {
        context.fillStyle = 'lightGrey';
        context.fillRect(25, ypos, canvas.width - 50, 3);
    }

    for (var i=0; i<data.length; i++) {
        //alert('iter:' + i + ' ' + data[i].color + ' ' + data[i].position);
        context.fillStyle = data[i].color;
        var xpos = data[i].position * scale + 25;
        context.fillRect(xpos, ypos, 1, 3);
    }

    
}

function drawData(data, rownumber, columnarray, chromoIndex) {
    var columns = 0;
    for (var colcount = 0; colcount < columnarray.length; colcount++) {
        columns = columns + columnarray[colcount];
    }
    var canvas = document.getElementById("chromobrowser");
    var context = canvas.getContext("2d");


    var rowheight = (canvas.height - 50 - 6 * (numOfRows - 1)) / numOfRows;
    var scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    var yscale = (canvas.height - 50 - 6 * (numOfRows - 1)) / (columns * numOfRows);

    for (var i = 0; i < data.length; i++) {
        var yoffset = 0;
        var useParentCheckbox = document.getElementById('useParentinfo');
        if (useParentCheckbox.checked) {
            var bigcol = data[i].bigcolumn;
            if (bigcol == 1) {
                yoffset = yscale * columnarray[0];
            }
            if (bigcol == 2) {
                yoffset = yscale * (columnarray[0] + columnarray[1]);
            }
        }

        var xpos = data[i].start * scale + 25;
        var ypos = 25 + yscale * data[i].column + rownumber * (rowheight + 6) + yoffset;
        var rectWidth = (data[i].end - data[i].start) * scale;
        var rectHeight = yscale;
        var cornerradius = 5;

        var matchBox = new MatchBlock('box', xpos, ypos, rectWidth, rectHeight, data[i]);
        matchblockList[matchblockList.length] = matchBox;

        context.fillStyle = "khaki";
        var colorresult = getCustom('commonancestor', data[i].match);
        if (colorresult != null) {
            //console.log('fant commonancestor:' + colorresult);
            var mycol = getAncestorColor(colorresult);
            if (mycol != null) {
                context.fillStyle = mycol;
            }
        }

        context.beginPath();
        context.moveTo(xpos + cornerradius, ypos);
        context.lineTo(xpos + rectWidth - cornerradius, ypos);
        context.arcTo(xpos + rectWidth, ypos, xpos + rectWidth, ypos + cornerradius, cornerradius);
        context.lineTo(xpos + rectWidth, ypos + rectHeight - cornerradius);
        context.arcTo(xpos + rectWidth, ypos + rectHeight, xpos + rectWidth - cornerradius, ypos + rectHeight, cornerradius);
        context.lineTo(xpos + cornerradius, ypos + rectHeight);
        context.arcTo(xpos, ypos + rectHeight, xpos, ypos + rectHeight - cornerradius, cornerradius);
        context.lineTo(xpos, ypos + cornerradius);
        context.arcTo(xpos, ypos, xpos + cornerradius, ypos, cornerradius);
        context.fill();

        context.lineWidth = 1;
        context.strokeStyle = '#474747';

        if (selectedMatchblock != null && selectedMatchblock.block.match == data[i].match) {
            context.lineWidth = 6;
            context.strokeStyle = 'white';
        } 
        for (var n in selectedInCommonList) {
            if (selectedInCommonList[n] == data[i].match) {
                context.lineWidth = 6;
                context.strokeStyle = 'red';
            }
        } 

        context.stroke();
        //context.fillRect(xpos, ypos, rectWidth, rectHeight);

        context.fillStyle = "black";
        context.font = "Bold 13px Calibri";
        context.fillText(data[i].match, xpos + 3, 13 + ypos);
        context.font = "12px Calibri";
        context.fillText(data[i].lngth + " cM", xpos + 5, 24 + ypos);
        //alert(data[i].column);
    }
}

function drawColumnOverlay(rownumber, columnsarray) {
    var useParentCheckbox = document.getElementById('useParentinfo');
    //console.log(useParentCheckbox);
    if (useParentCheckbox.checked) {
        var columns = 0;
        for (var colcount = 0; colcount < columnsarray.length; colcount++) {
            columns = columns + columnsarray[colcount];
        }

        var canvas = document.getElementById("chromobrowser");
        var context = canvas.getContext("2d");


        var rowheight = (canvas.height - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var scale = (canvas.width - 50) / chromolength[chromosomeIndex];

        var ypos = 25 + rownumber * (rowheight + 6)

        //context.fillStyle = 'cornflowerblue';
        //console.log(rowheight);
        var dadheight = rowheight * columnsarray[0] / columns;
        context.fillRect(25, ypos, canvas.width - 50, dadheight);
        if (columnsarray[0] > 0) {
            var elementname = 'row' + rownumber + 'dad';
            var slicebutton = document.getElementById(elementname);
            slicebutton.classList.add('show');
            slicebutton.style.top = dadheight / 2 + 0 + ypos - 12 + 'px';
        }
        //context.fillStyle = '#ffc2c2';
        var mumheight = rowheight * columnsarray[1] / columns;
        //context.fillRect(25, ypos + dadheight, canvas.width - 50, mumheight);
        if (columnsarray[1] > 0) {
            var elementname = 'row' + rownumber + 'mum';
            var slicebutton = document.getElementById(elementname);
            slicebutton.classList.add('show');
            slicebutton.style.top = mumheight / 2 + 0 + ypos + dadheight - 12 + 'px';
        }


        // tegner opp crossovers

        var owner = findRowOwner(rownumber);
        var crossovers = getCustomArray('crossover', owner.name);
        var mumcross = [];
        var dadcross = [];
        for (var i in crossovers) {
            if (crossovers[i][2]) {
                dadcross[dadcross.length] = crossovers[i];
            } else {
                mumcross[mumcross.length] = crossovers[i];
            }
        }

        dadcross = dadcross.sort(function (a, b) {
            return a[1] == b[1] ? 0 : +(a[1] > b[1]) || -1;
        })

        mumcross = mumcross.sort(function (a, b) {
            return a[1] == b[1] ? 0 : +(a[1] > b[1]) || -1;
        })

        var crossX = 25;
        var crossWidth = 0;
        var crossY = ypos;
        var crossHeight = dadheight;
        var counter = 0;
        var previousX = 25;
        for (var k in dadcross) {
            if (dadcross[k][0] == selectedChromosome) {
                crossX = 25 + dadcross[k][1] * scale;
                crossWidth = crossX - previousX;
                /*
                if (!crossovers[k][2]) {
                crossY = crossY + dadheight;
                crossHeight = mumheight;
                } */
                if (counter % 2 == 0) {
                    context.fillStyle = '#94b8ff';
                } else {
                    context.fillStyle = '#7693cc';
                }
                context.fillRect(previousX, crossY, crossWidth, crossHeight);
                counter++;
                previousX = crossX;
            }
        }
        crossWidth = canvas.width - 25 - previousX;
        if (counter % 2 == 0) {
            context.fillStyle = '#94b8ff';
        } else {
            context.fillStyle = '#7693cc';
        }
        context.fillRect(previousX, crossY, crossWidth, crossHeight);


        crossX = 25;
        crossY = crossY + dadheight;
        crossHeight = mumheight;
        previousX = 25;
        counter = 0;
        for (var j in mumcross) {
            if (mumcross[j][0] == selectedChromosome) {
                crossX = 25 + mumcross[j][1] * scale;
                crossWidth = crossX - previousX;
                if (counter % 2 == 0) {
                    context.fillStyle = '#ffb8b8';
                } else {
                    context.fillStyle = '#e6a6a6';
                }
                context.fillRect(previousX, crossY, crossWidth, crossHeight);
                counter++;
                previousX = crossX;
            }
        }
        crossWidth = canvas.width - 25 - previousX;
        if (counter % 2 == 0) {
            context.fillStyle = '#ffb8b8';
        } else {
            context.fillStyle = '#e6a6a6';
        }
        context.fillRect(previousX, crossY, crossWidth, crossHeight);

        var myPersonBox = getPersonBox(owner.name);
        console.log(myPersonBox);
        if (myPersonBox) {
            var crossovers = getCustomArray('crossover', myPersonBox.father);
            //console.log(crossovers);
            drawCrossoverData(crossovers, ypos, dadheight);
            crossovers = getCustomArray('crossover', myPersonBox.mother);
            drawCrossoverData(crossovers, ypos + dadheight, mumheight);
        }

        
        

        // tegner opp centromeres
        var midstart = centrostart[chromosomeIndex] * scale + 25;
        var midmid = (centroend[chromosomeIndex] + centrostart[chromosomeIndex]) * scale * 0.5 + 25;
        var midend = centroend[chromosomeIndex] * scale + 25;

        context.fillStyle = 'lightGrey';
        context.beginPath();
        context.moveTo(midstart, ypos + rowheight);
        context.lineTo(midend, ypos + rowheight);
        context.lineTo(midmid, ypos + rowheight / 2);
        context.lineTo(midend, ypos);
        context.lineTo(midstart, ypos);
        context.lineTo(midmid, ypos + rowheight / 2);
        context.fill();
    }
}

function drawCrossoverData(crossovers, ypos, height) {
    var canvas = document.getElementById('chromobrowser');
    var context = canvas.getContext('2d');
    for (var k in crossovers) {
        if (crossovers[k][0] == selectedChromosome) {
            console.log(crossovers[k][1]);
            var radius = 10;
            var crossX = 25 + crossovers[k][1] * scale;
            console.log(scale);
            var crossY = ypos;
            context.strokeStyle = 'red';
            if (crossovers[k][2]) {
                context.strokeStyle = 'blue';
            }
            context.beginPath();
            context.lineWidth = 2;
            context.moveTo(crossX, ypos);
            context.lineTo(crossX, ypos + height);
            context.stroke();
        }
    }
}

function drawCrossovers(rownumber, columnsarray) {
    var useParentCheckbox = document.getElementById('useParentinfo');
    //console.log(useParentCheckbox);
    if (useParentCheckbox.checked) {
        var columns = 0;
        for (var colcount = 0; colcount < columnsarray.length; colcount++) {
            columns = columns + columnsarray[colcount];
        }
        var canvas = document.getElementById("chromobrowser");
        var context = canvas.getContext("2d");


        var rowheight = (canvas.height - 50 - 6 * (numOfRows - 1)) / numOfRows;
        var scale = (canvas.width - 50) / chromolength[chromosomeIndex];

        var ypos = 25 + rownumber * (rowheight + 6)

        var dadheight = rowheight * columnsarray[0] / columns;
        var mumheight = rowheight * columnsarray[1] / columns;
        var owner = findRowOwner(rownumber);
        console.log(rownumber);
        console.log(owner);
        var crossovers = getCustomArray('crossover', owner.name);
        for (var k in crossovers) {
            if (crossovers[k][0] == selectedChromosome) {
                var radius = 10;
                var crossX = 25 + crossovers[k][1] * scale;
                var crossY = ypos;
                var crossHeight = dadheight;
                if (!crossovers[k][2]) {
                    crossY = crossY + dadheight;
                    crossHeight = mumheight;
                }
                context.fillStyle = 'khaki';
                context.beginPath();
                context.arc(crossX, crossY + crossHeight / 2, radius, 0, 2 * Math.PI, false);
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = '#474747';
                context.stroke();
                context.moveTo(crossX, crossY + crossHeight / 2 - 7);
                context.lineTo(crossX, crossY + crossHeight / 2 + 7);
                context.stroke();

                var matchBox = new MatchBlock('crossover', crossX, crossY + crossHeight / 2, 0, 0, crossovers[k]);
                matchblockList[matchblockList.length] = matchBox;
            }
        }
    }
}

function drawChromo(){
    var canvas = document.getElementById("chromobrowser");
    var context = canvas.getContext("2d");
    var drawWidth = canvas.width - 50;
    var drawHeight = canvas.height - 50;
    context.fillStyle = "darkCyan";
    context.font = "Bold 600px Calibri";
    var cornerradius = 10;

    var scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    var midstart = centrostart[chromosomeIndex] * scale + 25;
    var midmid = (centroend[chromosomeIndex] + centrostart[chromosomeIndex]) * scale * 0.5 + 25;
    var midend = centroend[chromosomeIndex] * scale + 25;

    


        var rowheight = (drawHeight - 6 * (numOfRows - 1)) / numOfRows;

    for (var i = 0; i < numOfRows; i++) {
        var xpos = 25;
        var ypos = 25 + (rowheight + 6)*i

        //context.fillRect(xpos,ypos, drawWidth, rowheight);
        context.beginPath();
        context.moveTo(xpos, ypos);
        context.arcTo(xpos - cornerradius, ypos, xpos - cornerradius, ypos + cornerradius, cornerradius);
        context.lineTo(xpos - cornerradius, ypos + rowheight - cornerradius);
        context.arcTo(xpos - cornerradius, ypos + rowheight, xpos, ypos + rowheight, cornerradius);
        context.lineTo(midstart, ypos + rowheight);
        context.lineTo(midmid, ypos + rowheight / 2);
        context.lineTo(midend, ypos + rowheight);
        context.lineTo(xpos + drawWidth, ypos + rowheight);
        context.arcTo(xpos + drawWidth + cornerradius, ypos + rowheight, xpos + drawWidth + cornerradius, ypos + rowheight - cornerradius, cornerradius);
        context.lineTo(xpos + drawWidth + cornerradius, ypos + cornerradius);
        context.arcTo(xpos + drawWidth + cornerradius, ypos, xpos + drawWidth, ypos, cornerradius);
        context.lineTo(midend, ypos);
        context.lineTo(midmid, ypos + rowheight / 2);
        context.lineTo(midstart, ypos);
        context.fill();

        //context.arc(50, 150, 50, 0, 2 * Math.PI, true);
        //context.fill();
        //context.beginPath();
        //context.arc(canvas.width - 50, 150, 50, 0, 2 * Math.PI, true);
        //context.fill();
        //context.fillStyle("white");
        //context.globalAlpha = 0.5;
        //alert('wider;e');
        //context.fillText("1", 25, 355);
        //context.globalAlpha = 1.0;
    }

    context.fillStyle = 'black';
    context.font = "Bold 13px Calibri";
    for (var j = 0; j < chromolength[chromosomeIndex]; j=j+10000000 ) {
        var label = j / 1000000;
        var xpos = j * scale +25;
        context.beginPath();
        context.moveTo(xpos, 20);
        context.lineTo(xpos, 24);
        context.stroke();

        context.fillText(label + "m", xpos-10, 19);
    }
}

function clearCanvas(){
    var canvas = document.getElementById("chromobrowser");
    var context = canvas.getContext("2d");
    context.fillStyle = "lightGrey";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function findCommonMatches(index1, index2){
    var result = new Array();
    var matches1 = findNames(index1);
    var matches2 = findNames(index2);
    //console.log(matches1);
    //console.log(matches2);
    for (var i = 0; i<matches1.length; i++){
        var pos = matches2.indexOf(matches1[i]);
        if (pos > -1) {
            result[result.length] = matches1[i];
        }
    }
    return result;
}

function findNames(owner){
    var matchnames = [];
    var matches = owner.matches;
    for (var i = 0; i< matches.length; i++ ){
        //console.log(matches[i].name);
        var pos = matchnames.indexOf(matches[i].name);
        if (pos == -1) {
            matchnames[matchnames.length] = matches[i].name;
        }
    }
    return matchnames;
}

function getChromodataByMatchname(data, name) {
    var matchdata = new Array();
    for (var i =0; i<data.length; i++ ){
        if (data[i].match == name) {
            matchdata[matchdata.length] = data[i];
        }
    }
    return matchdata;
}

function sortChromodata(myowner){
    var mydata = [];
    for (var i in myowner.matches){
        for (var j in myowner.matches[i].matchblocks) {
            var currentData = myowner.matches[i].matchblocks[j];
            if (currentData.chromo == selectedChromosome && Number(currentData.lngth) >= Number(selectedLimit)) {
                mydata[mydata.length] = new Data(currentData.match, currentData.chromo, currentData.start, currentData.end, currentData.lngth, currentData.snp);
            }
        }
    }
    mydata.sort(function (a, b) {
        return Number(a.start) - Number(b.start);
    })
    return mydata;
}



function sortRawdata(selectedPerson) {
    //console.log('sjekker raw');
    var myraw = [];
    for (var j = 0; j < kitRawdata.length; j++) {
        if(kitRawdata[j].name == selectedPerson.name) {
            myraw = kitRawdata[j].raw;
        }
    }
    
    var mydata = [];
    for (var i = 0; i < myraw.length; i++) {
        if (myraw[i].chromosome == selectedChromosome) {
            mydata[mydata.length] = myraw[i];
        }
    }
    //console.log(mydata.length);
    return mydata;
}

function simpleRawSort(rawA, rawB) {
    var ordered = [];
    var cont = true;
    var a = rawA.shift();
    var b = rawB.shift();
    while (cont) {
        if (a == undefined || b == undefined) {
            cont = false;
        } else if (Number(a.position) == Number(b.position)) {
            ordered[ordered.length] = [a, b, a.position];
            a = rawA.shift();
            b = rawB.shift();
        } else if (Number(a.position) > Number(b.position)) {
            //console.log( a.position + ' > ' + b.position );
            b = rawB.shift();
        } else {
            //console.log(a.position + ' < ' + b.position );
            a = rawA.shift();
        }
    }
    return ordered;
}

function sortRawComparison(rawA, rawB) {
    
    var ordered = [];
    if (rawA.length == rawB.length) {
        for (var i = 0; i < rawA.length; i++) {
            ordered[ordered.length] = [rawA[i], rawB[i], rawA[i].position];
        }
    } else {
        var cont = true;
        while (cont) {
            var a = rawA.shift();
            var b = rawB.shift();
            console.log(a.value + ':' + b.value);
            cont = recursiveFindEqual(a, b, rawA, rawB, ordered);
        }
    }
    //alert(ordered.length);
    return ordered;
}

function recursiveFindEqual(a, b, arrayA, arrayB, ordered) {
    //alert('a:' + a.position + ' b:' + b.position);
    if (a == undefined || b == undefined) {
        return false;
    } else {
        if (a.position == b.position) {
            ordered[ordered.length] = [a, b, a.position];
            return true;
        } else if (a.position > b.position) {
            var nextb = arrayB.shift();
            return recursiveFindEqual(a, nextb, arrayA, arrayB, ordered);
        } else {
            var nexta = arrayA.shift();
            return recursiveFindEqual(nexta, b, arrayA, arrayB, ordered);
        }
    }
}

function compareRaw(rawA, rawB) {
    var raw = simpleRawSort(rawA, rawB);
    var comparison = new Array();
    var compared = null;
    for (var i = 0; i < raw.length; i++) {
        //alert('starter runde' + i);
        var first = simpleCompare(raw[i][0].value[0], raw[i][1].value[0]);
        var second = simpleCompare(raw[i][0].value[1], raw[i][1].value[1]);
        //alert(raw[i][0].value[0] + raw[i][0].value[1] + ':' +raw[i][1].value[0]+raw[i][1].value[1] + " " + first + second);
        compared = new RawCompare('red', raw[i][2]);
        //alert('laget compared');
        if (first || second) {
            compared.color = 'yellow';
        }
        //alert('ferdig foerste if');
        if (first && second) {
            compared.color = 'green';
        }
        //alert('ferdig andre if');
        comparison[comparison.length] = compared;
        //alert('inserted i array');
    }
    return comparison;
}

function simpleCompare(valueA, valueB) {
    if (valueA == valueB) {
        return true;
    }
    return false;
}

function findGenomeInRaw(raw, name) {
    for (var i =0; i< raw.length; i++) {
        if (raw[i].name == name) {
            return raw[i];
        }
    }
    return null;
}

function checkColumn(columnarray, data, currentcolumn) {
    
    if (columnarray.length <= currentcolumn) {
        //console.log(columnarray.length + ' ' + currentcolumn);
        data.column = currentcolumn;
        columnarray[currentcolumn] = data;
        return;
    }
    //console.log('sammeligner ' + data.match + ' med ' + columnarray[currentcolumn].match);
    if (Number(columnarray[currentcolumn].end) > Number(data.start)) {
        //console.log(Number(columnarray[currentcolumn].end) + ' > ' +Number(data.start) +' =  true' );
        checkColumn(columnarray, data, currentcolumn + 1);
    } else {
        //console.log(Number(columnarray[currentcolumn].end) + ' > ' +Number(data.start) +' =  false' );
        data.column = currentcolumn;
        columnarray[currentcolumn] = data;
    }
}

function cbMouseOut(e) {
    mouseIsDown = false;
    moveCrossover = false;
}

function cbMouseMove(e) {
    if (mouseIsDown) {
        drawRuler(e);        
    }
}

var rulerIsVisible = false;
var rulerPosition = 0;

function drawRuler(e) {
    rulerIsVisible = true;
    var canvas = document.getElementById("chromobrowser");
    var canvasX = e.pageX - canvas.offsetLeft;
    var context = canvas.getContext('2d');
    clearCanvas();

    context.drawImage(buffer, 0, 0);
    context.fillStyle = '#474747';
    context.fillRect(canvasX, 20, 1, canvas.height);

    var scale = (canvas.width - 50) / chromolength[chromosomeIndex];
    rulerPosition = (canvasX - 25) / scale / 1000000;
    var label = rulerPosition.toString().substr(0, 5) + "m";
    context.fillText(label, canvasX - 10, 9);

    if (moveCrossover) {
        crossoverHasMoved = true;
        var radius = 10;
        context.fillStyle = '#ffebcc';
        context.beginPath();
        context.arc(selectedCrossover.xpos, selectedCrossover.ypos, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.fillStyle = 'khaki';
        context.beginPath();
        context.arc(canvasX, selectedCrossover.ypos, radius, 0, 2 * Math.PI, false);
        context.fill();
    }
}

function cbMouseUp(e) {
    mouseIsDown = false;
    if (moveCrossover) { // rutiner for aa endre posisjon paa crossover kommer her
        if (crossoverHasMoved) {
            selectedCrossover.block[1] = rulerPosition * 1000000;
            //console.log(selectedCrossover.block);
            //addCustom('crossover', owner.name, [selectedChromosome, rulerPosition * 1000000, isDad]);
        } else {
            selectedCrossover.block[0] = 0; // hack, vil fylle crossoverarray med nullpos, boer gjoeres noe med
        }
        changeDisplay();
    }

    moveCrossover = false;
    crossoverHasMoved = false;
}

var moveCrossover = false;
var crossoverHasMoved = false;
var selectedMatchblock = null;
var selectedCrossover = null;

function cbMouseDown(e) {
    //console.log('mosue donw paa chromocanvas');
    mouseIsDown = true;
    var canvas = document.getElementById("chromobrowser");
    var canvasX = e.pageX - canvas.offsetLeft;
    var canvasY = e.pageY - canvas.offsetTop;

    selectedCrossover = checkCrossoverHit(canvasX, canvasY);

    selectedMatchblock = checkMatchblockHit(canvasX, canvasY);
    //console.log(selectedMatchblock);

    if (selectedCrossover != null ) {
        
    } else if (selectedMatchblock != null) {
        selectedInCommonList = getCustom('incommon', selectedMatchblock.block.match);
        //console.log(selectedInCommonList);
        var dialog = document.getElementById('openDialog');
        dialog.classList.add('display');
        var header = document.getElementById('dialogHeader');
        header.innerHTML = selectedMatchblock.block.match;
        var closebutton = document.getElementById('myClose');
//        closebutton.addEventListener('mousedown', function (e) {
//            dialog.classList.remove('display');
//        }, false)

        changeDisplay();
    } else {
        drawRuler(e);
    }
}

function selectAncestor(relative) {
    //console.log('setter color:' + relative + '*' + selectedMatchblock.block.match);
    var selection = setCustom('commonancestor', selectedMatchblock.block.match, relative);
    //console.log('setter color')
    //selection[2] = relativeindex;
    //console.log(matches);
    changeDisplay();
}


var offsetX = 0;
var offsetY = 0;

function dialogDragstart(e) {
    var dialog = document.getElementById('openDialog');
    var dialogX = dialog.offsetLeft;
    var dialogY = dialog.offsetTop;
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    offsetX = mouseX - dialogX;
    offsetY = mouseY - dialogY;
    //console.log(offsetX + ' ' + offsetY);
}

function dialogDragend(e) {
    var mouseX = e.pageX;
    var mouseY = e.pageY;
    var dialog = document.getElementById('openDialog');
    dialog.style.left = (mouseX - offsetX) + "px";
    dialog.style.top = (mouseY - offsetY +6) + "px";

}

function checkCrossoverHit(xpos, ypos) { // sjekker om vi klikker paa crossoversirkel
    var selection = null;
    for (var i in matchblockList) {
        if (matchblockList[i].type == 'crossover') {
            var pointX = matchblockList[i].xpos;
            var pointY = matchblockList[i].ypos;
            var a = xpos - pointX;
            var b = ypos - pointY;
            var radius = Math.sqrt(a * a + b * b);
            if (radius <= 10) {
                selection = matchblockList[i];
                moveCrossover = true;
            }
        }
    }
    return selection;
}

function checkMatchblockHit(xpos, ypos) { // sjekke om vi klikker paa matchblock, returnerer valgt matchblokk eller null
    var selection = null;
    for (var i in matchblockList) {
        if (matchblockList[i].type == 'box') {
            var boxX = matchblockList[i].xpos;
            var boxY = matchblockList[i].ypos;
            var boxLength = matchblockList[i].length;
            var boxHeight = matchblockList[i].height;
            if (xpos > boxX && xpos < (boxX + boxLength)) {
                if (ypos > boxY && ypos < (boxY + boxHeight)) {
                    selection = matchblockList[i];
                }
            }
        }
    }
    return selection;
}

function findRowOwner(row) {
    if (displaySelection == 1 && row == 1) {
        return selectedPersonB;
    }
    if (displaySelection ==2 && row > 1) {
        return selectedPersonB;
    }
    if (displaySelection ==3 && (row ==1 || row == 2 )) {
        return selectedPersonB;
    }
    if (displaySelection == 3 && row==3) {
        return selectedPersonC;
    }
    if (displaySelection === 4 && row === 1) {
        return selectedPersonB;
    }
    if (displaySelection === 4 && row === 2) {
        return selectedPersonC;
    }
    if (displaySelection === 4 && row === 3) {
        return selectedPersonD;
    }
    return selectedPersonA;
}

function addCrossover(row, isDad) {
    var owner = findRowOwner(row);
    //console.log(owner);
    if (rulerIsVisible) {
        if (rulerPosition> 0 && rulerPosition < chromolength[selectedChromosome]) {
            addCustom('crossover', owner.name, [selectedChromosome, rulerPosition * 1000000, isDad]);
            //customdata[customdata.length] = ['crossover', owner.name, [rulerPosition*1000000, isDad]];
        }
    }

    //console.log(customdata);
    changeDisplay();
}
