pFloat = function(s, min, max) {
    s = s.replace(/,/g, '.');

    if (/^-?((\d+\.?\d*)|(\.\d+))$/.test(s)) {
        var v = parseFloat(s);
        if (!isNaN(min) && v < min) { return NaN; }
        if (!isNaN(max) && v > max) { return NaN; }
        return v;
    }
    
    return NaN;
};

zeropad = function (num, width) {
    var s = String(num);
    while (s.length < width) {
        s = "0" + s;
    }
    return s;
};
