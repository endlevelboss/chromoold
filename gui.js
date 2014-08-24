var ChromoGui = ChromoGui || {};

ChromoGui.topButtonClick = function (buttonNumber) {
    if (buttonNumber === 1) {
        this.button1();
    }
    if (buttonNumber === 2) {
        this.button2();
    }
    if (buttonNumber === 3) {
        this.button3();
    }
}

ChromoGui.button1 = function () {
    this.addSelected('chromobrowserButton', 'topbuttonselected');
    this.removeSelected('relationtreeButton', 'topbuttonselected');
    this.removeSelected('incommonButton', 'topbuttonselected');
    this.removeSelected('cbrowser', 'hidden');
    this.addSelected('relationships', 'hidden');
    this.addSelected('incommon', 'hidden');
}

ChromoGui.button2 = function() {
    this.removeSelected('chromobrowserButton','topbuttonselected');
    this.addSelected('relationtreeButton','topbuttonselected');
    this.removeSelected('incommonButton','topbuttonselected');
    this.addSelected('cbrowser', 'hidden');
    this.removeSelected('relationships', 'hidden');
    this.addSelected('incommon', 'hidden');
}

ChromoGui.button3 = function() {
    this.removeSelected('chromobrowserButton','topbuttonselected');
    this.removeSelected('relationtreeButton','topbuttonselected');
    this.addSelected('incommonButton','topbuttonselected');
    this.addSelected('cbrowser', 'hidden');
    this.addSelected('relationships', 'hidden');
    this.removeSelected('incommon', 'hidden');
}

ChromoGui.addSelected = function(id, myclass) {
    var dialog = document.getElementById(id);
    dialog.classList.add(myclass);
}

ChromoGui.removeSelected = function(id, myclass) {
    var dialog = document.getElementById(id);
    dialog.classList.remove(myclass);
}

