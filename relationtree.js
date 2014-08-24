var offsetX = 0;
var offsetY = 0;
var mouseDown = false;
var boxSelected = false;
var selectedBox = null;

var chooseDad = false;
var chooseMum = false;

var personBoxes = [];
var boxlength = 57;
var boxheight = 30;
var colorSelectorDown = false;



function mouseDownTree(e) {
    var canvas = document.getElementById("relationshipTree");
    var mouseX = e.pageX - canvas.offsetLeft;
    var mouseY = e.pageY - canvas.offsetTop;
    mouseDown = true;

    var newSelection = boxHit(mouseX, mouseY);
    if (newSelection) {
        if (chooseDad && selectedBox) {
            selectedBox.father = newSelection.name;
            var infobox = document.getElementById('fatherName');
            infobox.innerHTML = selectedBox.father;
        } else if (chooseMum && selectedBox) {
            selectedBox.mother = newSelection.name;
            var infobox = document.getElementById('motherName');
            infobox.innerHTML = selectedBox.mother;
        } else {
            selectedBox = newSelection;
            var infobox = document.getElementById('relationName');
            infobox.innerHTML = selectedBox.name;
            infobox = document.getElementById('fatherName');
            infobox.innerHTML = selectedBox.father;
            infobox = document.getElementById('motherName');
            infobox.innerHTML = selectedBox.mother;
            var mycanvas = document.getElementById('myColor');
            var ctx = mycanvas.getContext('2d');
            ctx.fillStyle = selectedBox.color;
            ctx.fillRect(0, 0, 20, 20);
        }
    }
    chooseDad = false;
    chooseMum = false;
}
function mouseUpTree(e) {
    //var canvas = document.getElementById("relationshipTree");
    //var mouseX = e.pageX - canvas.offsetLeft;
    //var mouseY = e.pageY - canvas.offsetTop;
    mouseDown = false;
    boxSelected = false;
}
function mouseMoveTree(e) { 
    if (mouseDown && boxSelected) {
        var canvas = document.getElementById("relationshipTree");
        var mouseX = e.pageX - canvas.offsetLeft;
        var mouseY = e.pageY - canvas.offsetTop;
        selectedBox.xpos = mouseX - offsetX;
        selectedBox.ypos = mouseY - offsetY;
        redrawTree();
    }
}

function mouseOutTree(e) {}


function PersonBox(name) {
    this.name = name
    this.xpos = 0;
    this.ypos = 0;
    this.father = '';
    this.mother = '';
    this.isKit = false;
    this.color = 'khaki';
}

function treeStartup() {
    var canvas = document.getElementById('colorSelect');
    var context = canvas.getContext('2d');
    var img = document.getElementById('colorImage');
    var offset = 2;
    var personBoxNames = [];

    console.log(personBoxes);
    for (var i in personBoxes) {
        if (personBoxNames.indexOf(personBoxes[i].name) === -1) {
            personBoxNames[personBoxNames.length] = personBoxes[i].name;
        }
    }
    console.log(personBoxNames);
    context.drawImage(img, 0, 0);

    for (var i in kitNames) {
        if (personBoxNames.indexOf(kitNames[i]) === -1) {
            var person = new PersonBox(kitNames[i]);
            var myindex = personBoxes.length;
            personBoxes[myindex] = person;
            personBoxes[myindex].xpos = 50 + offset * myindex;
            personBoxes[myindex].ypos = 150 + offset * myindex;
            personBoxes[myindex].isKit = true;
        }
    }

    updateFromTreedata();
    redrawTree();
}

function boxHit(mouseX, mouseY) {
    var result = null;
    for (var i in personBoxes) {
        //console.log(mouseX + ' ' + mouseY + ' ' + personBoxes[i].xpos);
        if (mouseY > personBoxes[i].ypos && mouseY < (personBoxes[i].ypos + boxheight)) {
            if (mouseX > personBoxes[i].xpos && mouseX < (personBoxes[i].xpos + boxlength)) {
                boxSelected = true;
                offsetX = mouseX - personBoxes[i].xpos;
                offsetY = mouseY - personBoxes[i].ypos;
                result = personBoxes[i];
            }
        }
    }
    return result;
}

function updateFromTreedata() {
    // lager colorcode array
    colorcode = [];
    for (var i in personBoxes) {
        colorcode[colorcode.length] = [personBoxes[i].name, personBoxes[i].color];
    }

    // lager heritagemapping
    for (var i in kitNames) {
        //console.log(kitNames[i]);
        var mymap = new Heritagemap(kitNames[i]);
        var me = getPersonBox(kitNames[i]);
        //console.log(me);
        if (me) {
            var dad = getPersonBox(me.father);
            var mum = getPersonBox(me.mother);
        }
        var viaDad = false;
        var viaMum = false;
        for (var j in personBoxes) {
            viaDad = traceAncestor(dad, personBoxes[j].name);
            viaMum = traceAncestor(mum, personBoxes[j].name);
            var mapping = null;
            if (viaDad) {
                mapping = [personBoxes[j].name, 0];
            } else if (viaMum) {
                mapping = [personBoxes[j].name, 1];
            } else {
                mapping = [personBoxes[j].name, 2];
            }
            mymap.map[mymap.map.length] = mapping;
        }
        heritagemapper[heritagemapper.length] = mymap;
    }



    // lager html for slektsvelgerdialogen
    var myInnerHtml = '';
    for (var i = personBoxes.length - 1; i>-1; i--) {
        myInnerHtml = myInnerHtml + "<li onclick='selectAncestor(\"" + personBoxes[i].name + "\")'><canvas width='20' height='20' style='background: " + personBoxes[i].color + "'></canvas>" + personBoxes[i].name + "</li>";
    }
    var mymenu = document.getElementById('ancestorSelector');
    mymenu.innerHTML = myInnerHtml;
}

function traceAncestor(personBox, ancestorname) {
    if (personBox == null) {
        return false;
    }
    if (personBox.name == ancestorname) {
        return true;
    }
    var dad = getPersonBox(personBox.father);
    var mum = getPersonBox(personBox.mother);
    if (traceAncestor(dad, ancestorname) || traceAncestor(mum, ancestorname)) {
        return true;
    } else {
        return false;
    }
}
    

function getAncestorColor(name) {
    for (var i in colorcode) {
        if (colorcode[i][0] == name) {
            return colorcode[i][1];
        }
    }
    return null;
}

function redrawTree() {
    var canvas = document.getElementById('relationshipTree');
    var context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.lineWidth = 2;
    context.strokeStyle = '#474747';
    var cornerradius = 6;

    for (var i in personBoxes) {
        var xpos = personBoxes[i].xpos;
        var ypos = personBoxes[i].ypos;
        context.fillStyle = personBoxes[i].color;

        context.beginPath();
        context.moveTo(xpos + cornerradius, ypos);
        context.lineTo(xpos + boxlength - cornerradius, ypos);
        context.arcTo(xpos + boxlength, ypos, xpos + boxlength, ypos + cornerradius, cornerradius);
        context.lineTo(xpos + boxlength, ypos + boxheight - cornerradius);
        context.arcTo(xpos + boxlength, ypos + boxheight, xpos + boxlength - cornerradius, ypos + boxheight, cornerradius);
        context.lineTo(xpos + cornerradius, ypos + boxheight);
        context.arcTo(xpos, ypos + boxheight, xpos, ypos + boxheight - cornerradius, cornerradius);
        context.lineTo(xpos, ypos + cornerradius);
        context.arcTo(xpos, ypos, xpos + cornerradius, ypos, cornerradius);
        context.fill();
        //context.fillRect(personBoxes[i].xpos, personBoxes[i].ypos, boxlength, boxheight);
        context.stroke();

        context.fillStyle = "black";
        context.font = "Bold 13px Calibri";
        context.fillText(personBoxes[i].name, xpos + 6, 18 + ypos);
    }
}

function selectFather() {
    chooseDad = true;
    chooseMum = false;
}

function selectMother() {
    chooseDad = false;
    chooseMum = true;
}

function addPerson() {
    var input = document.getElementById('addtotree');
    var name = input.value;
    //console.log('->' + name + '<-');
    if (name != '') {
        var newPerson = new PersonBox(name);
        newPerson.xpos = 300;
        newPerson.ypos = 300;
        personBoxes[personBoxes.length] = newPerson;
    }
    input.value = '';
    redrawTree();
}



function colorSelectDown(e) {
    colorSelectorDown = true;
    selectColor(e);
}

function colorSelectMove(e) {
    if (colorSelectorDown) {
        selectColor(e);
    }
}

function colorSelectUp(e) {
    colorSelectorDown = false;
}

function selectColor(e) {
    if (selectedBox) {
        var canvas = document.getElementById('colorSelect');
        var context = canvas.getContext('2d');
        var x = e.pageX - canvas.offsetLeft;
        var y = e.pageY - canvas.offsetTop;
        var imgdata = context.getImageData(x, y, 1, 1).data;
        var color = '#' + rgbToHex(imgdata[0], imgdata[1], imgdata[2]);
        selectedBox.color = color;

        var mycanvas = document.getElementById('myColor');
            var ctx = mycanvas.getContext('2d');
            ctx.fillStyle = selectedBox.color;
            ctx.fillRect(0, 0, 20, 20);

        redrawTree();
    }
}

function rgbToHex(r,g,b) {
    return toHex(r) + toHex(g) + toHex(b);
}

function toHex(n) {
    n = parseInt(n, 10);
    if (isNaN(n)) return "00";
    n = Math.max(0, Math.min(n, 255));
    return "0123456789abcdef".charAt((n - n % 16) / 16) + "0123456789abcdef".charAt(n % 16);
}

function getPersonBox(name) {
    for (var i in personBoxes) {
        if (personBoxes[i].name == name) {
            return personBoxes[i];
        }
    }
    return null;
}