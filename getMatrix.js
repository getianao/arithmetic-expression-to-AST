var matrix=[];//优先矩阵



function getEq(str) {
    var start = 3;//从第四个字符开始
    var offset = 0;
    for (; offset + start < str.length; offset++) {
        if (str[start + offset] == "|") {//从新开始
            start = start + offset + 1;
            offset + 0;
            continue;
        } else {
            if (isTerminal(str[start + offset])) {
                if (isTerminal(str[start + offset + 1])) {//A=>···ab···
                    matrix[findIndexByTchar(str[start + offset])][findIndexByTchar(str[start + offset + 1])] = '=';
                    offset = offset + 1;
                } else if (!isTerminal(str[start + offset + 1]) && isTerminal(str[start + offset + 2]) && str[start + offset + 1] != "|") {//A=>···aBb···
                    matrix[findIndexByTchar(str[start + offset])][findIndexByTchar(str[start + offset + 2])] = '=';
                    offset = offset + 2;
                }
            }
        }
    }
}


function getLs(str) {
    var start = 3;//从第四个字符开始
    var offset = 0;
    for (; offset + start+1 < str.length; offset++) {
        if (str[start + offset] == "|") {//从新开始
            start = start + offset + 1;
            offset + 0;
            continue;
        } else {
            if (isTerminal(str[start + offset])) {
                if (!isTerminal(str[start + offset + 1]) && str[start + offset + 1] != "|") {//A=>···aB···
                    for (let j = 0; j < tNum1; j++) {
                        if (firstvt[findIndexByVchar(str[start + offset + 1])][j] == 1) {
                            matrix[findIndexByTchar(str[start + offset])][j] = '<';
                        }
                    }
                }
            }
        }
    }
}

function getGt(str) {
    var start = 3;//从第四个字符开始
    var offset = 0;
    for (; offset + start +1< str.length; offset++) {
        if (str[start + offset] == "|") {//从新开始
            start = start + offset + 1;
            offset + 0;
            continue;
        } else {
            if (!isTerminal(str[start + offset]&& str[start + offset ] != "|")) {
                if (isTerminal(str[start + offset + 1]) ) {//A=>··Bb···
                    for (let j = 0; j < tNum1; j++) {
                        if (lastvt[findIndexByVchar(str[start + offset ])][j] == 1) {
                            matrix[j][findIndexByTchar(str[start + offset+1])] = '>';
                        }
                    }
                }
            }
        }
    }
}

function getMatrix() {

    //     =·关系
    // 查看所有产生式的右部，寻找A=>···ab···或者A=>···aBb···的产生式，可得a=·b。
    // <·关系
    // 查看所有产生式的右部，寻找A=>···aB···的产生式，对于每一b∈FIRSTVT(B)，可得a<·b。
    // >·关系
    // 查看所有产生式的右部，寻找A=>··Bb···的产生式，对于每一a∈LASTVT(B)，可得a>·b。

    //矩阵初始化
    for (var i = 0; i < tNum; i++) {
        matrix[i] = new Array();
        for (var j = 0; j < tNum; j++) {
            matrix[i][j] = 0;
        }
    }
    //1< 2= 3>
    //分析=2
    for (let i = 0; i < grammar.length; i++) {
        getEq(grammar[i]);
    }
    //分析<1
    for (let i = 0; i < grammar.length; i++) {
        getLs(grammar[i]);
    }
    //分析>3
    for (let i = 0; i < grammar.length; i++) {
        getGt(grammar[i]);
    }

    console.log(matrix);
}