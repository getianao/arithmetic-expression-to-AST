var root = {};
var nodeStack = [];

function compMatrix(char1, char2) {
    if (char1 == "#")
        return -1;
    if (char2 == "#")
        return 1;
    switch (matrix[findIndexByTchar(char1)][findIndexByTchar(char2)]) {
        case '=':
            return 0;
        case '<':
            return -1;
        case '>':
            return 1;
    }
}

function nextTchar(str, index) {//查找字符串str中index之后的下一个终结符
    var i = index + 1;
    for (i; i < str.length; i++) {
        if (isTerminal(str[i])) {
            return i;
        } else {
            continue;
        }
    }
    return null;
}

function startExec() {//开始算符优先分析
    var str = [];//栈
    var i = 1;//字符串从1开始
    var f = 0;//上一个终结符在栈的位置
    str.push("#");
    inputString2 = "#" + document.getElementById("inputString").value + "#";
    for (; i < inputString2.length; i++) {
        if (isTerminal(inputString2[i])) {
            switch (compMatrix(str[f], inputString2[i])) {
                case 1: {//>,结束i-1
                    //向前找
                    var ii = -1;
                    var flag = 0;
                    for (var j = str.length - 1; j >= 0; j--) {
                        if (isTerminal(str[j])) {
                            if (ii == -1) {//第一个非终结符
                                ii = j;
                                continue;
                            } else if (compMatrix(str[j], str[ii]) == -1) {//开始j+1
                                var num1, oper, num2;
                                var temp = str.slice(j + 1);
                                for (var ii = 0; ii < temp.length; ii++) {
                                    if (isTerminal(temp[ii])) {
                                        num1 = { name: temp.slice(0, ii) };
                                        oper = temp.slice(ii, ii + 1);
                                        num2 = { name: temp.slice(ii + 1) };
                                        var parentJson = [];
                                        if (num1.name == "$") {//结点
                                            parentJson.push(nodeStack[nodeStack.length - 1]);
                                            nodeStack.pop();
                                        } else {
                                            parentJson.push(num1);
                                        }
                                        if (num2.name == "$") {//结点
                                            parentJson.push(nodeStack[nodeStack.length - 1]);
                                            nodeStack.pop();
                                        } else {
                                            parentJson.push(num2);
                                        }
                                        var jsonNode = { name: oper, children: parentJson };
                                        nodeStack.push(jsonNode);//将新节点入栈
                                        for (var dd = 0; dd < temp.length; dd++) {
                                            str.pop();
                                        }
                                        str.push("$");
                                        f = str.length;
                                        root = jsonNode;
                                        i--;
                                        //f要重新设定
                                        for (var dd = str.length - 1; dd >= 0; dd--) {
                                            if (isTerminal(str[dd])) {
                                                f = dd;
                                                break;
                                            }
                                        }
                                        flag = 1
                                        break;
                                    }
                                }//json结点生成完毕
                            } else {
                                ii = j;
                            }
                        }
                        if (flag == 1)
                            break;
                    }
                    break;
                }
                case 0: {
                    str.push(inputString2[i]);//压栈
                    break;
                    //TODO:#/()
                }
                case -1: {
                    //继续
                    str.push(inputString2[i]);//压栈
                    f = str.length - 1;
                    break;
                }
            }
        } else {
            str.push(inputString2[i]);//压栈
        }
    }
    if (str.length > 3) {//还没有结束
    }
}
