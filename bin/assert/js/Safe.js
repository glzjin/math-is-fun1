function Safe_string(text, blackchar) {
    let res = Array.prototype.filter.call(text, n => blackchar.indexOf(c) == -1);
    return res.join("");
}
