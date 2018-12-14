var letter = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
var number = '0123456789';
var operater = '+-*/()';
var cifaString = "";

var dic = {};   //符号表
var table = [];   //单词栈

var inputString;

function start() {
    //TODO:初始化清空
    inputString = document.getElementById("inputString").value;
    lexicalAnalysis(inputString);
}

function isIn(s, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] == s)
            return true;
    }
    return false;
}

//词法分析
function lexicalAnalysis(string) {//输入为算术表达式
    var m = 0;//开始位置
    var state = 0;     //1：为标识符 2：为数字串 3：为运算符
    for (let i = 0; i < string.length; i++) {
        if (isIn(string[i], operater))//如果是运算符
        {
            if (state == 1) {//state=1表明其前面的为标识符
                cifaString=cifaString+string.slice(m, i)+"是标识符,类型码：1\n";
                dic[string.slice(m, i)] = 1;
                table.push(string.slice(m, i));
            }
            else if (state == 2) {//state=2表明其前面的为数字
                cifaString=cifaString+string.slice(m, i)+"是数字，类型码：2\n" ;
                dic[string.slice(m, i)] = 2;
                table.push(string.slice(m, i));
            }
            m = i + 1;
            state = 3;
            cifaString=cifaString+ string[i]+"是运算符，类型码：3\n" ;
            dic[string[i]] = 3;
            table.push(string[i]);
        } else if (isIn(string[i], number)) {//如果是数字
            if (i == m) {  //判断此时的数字是否为整数的第一个数字，若是则改变状态为无符号整数
                state = 2
            }
        } else if (isIn(string[i], letter)) {//如果是字母
            if (state == 2) {    //判断此时的状态，若state=2表明状态为无符号整数，而整数内不能包含字母，故报错
                cifaString=cifaString+"词法分析检测到错误,数字串中不能包含字母\n" ;
                return;
            }
            if (i == m) {//判断此时的字母是否为标识符的第一个字母，若是则改变状态为标识符
                state = 1
            }
        } else {//当输入的字符均不符合以上判断，则说明为非法字符，故报错
            cifaString=cifaString+"词法分析检测到非法字符\n" ;
            return;
        }
    }
    if (state == 1) { //当字符串检查完后，若字符串最后部分为标识符，应将其print出来
        cifaString=cifaString+  string.slice(m)+"是运算符，类型码：3\n" ;
        dic[string.slice(m)] = 1;
        table.push(string.slice(m));
    }
    else if (state == 2) { //若字符串最后部分为无符号整数，应将其print出来
        cifaString=cifaString+  string.slice(m)+"是无符号整数，类型码：2\n" ;
        dic[string.slice(m)] = 1;
        table.push(string.slice(m));
    }
    table.push('#');
    console.log("字符栈:", table, "\n词法正确");
}


