var reducedMasterList = [];

function reduceRawdata() {
    console.log('begynner reduce')
    var rawindex = [];
    var transaction = db.transaction(["raw"], "readonly");
    var storeRaw = transaction.objectStore('raw');
    //var index = storeRaw.index('name');
    var cursorRaw = storeRaw.openCursor();
    cursorRaw.onsuccess = function (e) {
        var resRaw = e.target.result;
        if (resRaw) {
            var myraw = resRaw.value;
            console.log(myraw.name);
            rawindex[rawindex.length] = myraw;
            resRaw.continue();
        } else {
            reduceAlgo(rawindex);
            //storeReducedMasterList();
            console.log(reducedMasterList);
        }
    }
}

function reduceAlgo(rawindex) {
    if (rawindex.length > 0) {
        var reducedMaster = [];
        var firstRaw = rawindex[0].raw;

        for (var i = 1; i < 23; i++) {
            var compare = getChromosomeRaw(firstRaw, i);
            console.log(i);
            //console.log(compare.length);
            for (var j = 1; j < rawindex.length; j++) {
                var nextRaw = getChromosomeRaw(rawindex[j].raw, i);
                compare = extractComparedA(compare, nextRaw);
                console.log('etter ' + rawindex[j].name + ' ' + compare.length);

                
            }
            reducedMaster = reducedMaster.concat(compare);
        }

        // tar hver enkelt raadata og matcher med den alle matcher, reduserer til 1/10-del

        for (var i = 0; i < rawindex.length; i++) {
            var myraw = rawindex[i].raw;

            var myreduced = [];
            for (var j = 1; j < 23; j++) {
                console.log('kromo' + j);
                var rawA = getChromosomeRaw(myraw, j);
                var rawB = getChromosomeRaw(reducedMaster, j);
                console.log('masterlengde: ' + rawB.length);
                var result = extractComparedA(rawA, rawB);
                console.log('etter extract: ' + result.length);
                for (var k = 0; k < result.length; k = k + 10) {
                    myreduced[myreduced.length] = result[k];
                }
            }
            console.log('lager redusering for' +rawindex[i].name + ' lengde ' + myreduced.length);
            var finishedReduced = new UserRawdata(rawindex[i].name);
            finishedReduced.raw = myreduced;

            reducedMasterList[reducedMasterList.length] = finishedReduced;
        }
    }
}

function extractComparedA(compareA, compareB) {
    var result = [];
    var comparison = simpleRawSort(compareA, compareB);
    for (var i=0; i<comparison.length;i++) {
        result[result.length] = comparison[i][0];
    }
    return result;
}

function getChromosomeRaw(array, chromonumber) {
    var result = [];
    for (var i = 0; i< array.length; i++ ) {
        if (array[i].chromosome == chromonumber) {
            result[result.length] = array[i];
        }
    }
    return result;
}

function storeReducedMasterList() {
    console.log('starter lagring');
    console.log(reducedMasterList);

    var transaction = db.transaction(["reducedraw"], "readwrite");
    var store = transaction.objectStore("reducedraw");
    var del = store.delete(1);
    del.onsuccess = function(e) {
        var req = store.add(reducedMasterList,1);
    req.onsuccess = function(e) {
        console.log('lagret');
    }
    req.onerror = function(e) {
        console.log('lagring feilet');
    }
    }
    }