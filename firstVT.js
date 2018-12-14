var firstgrammar;
var yufaString = "";

//产生式的前两个字符
function EasyProductions() {
    this.firstChar = null;
    this.secondChar = null;
    this.nextPtr = null;
};
//Tchar∈firstvt(Vchar)
function VTRelation() {
    this.Tchar = null;
    this.Vchar = null;
};

var MAX_NUM = 30;
//文法中终结符，非终结符数目
var tNum1, vNum1;
//储存终结符，非终结符
var tSymb1 = [], vSymb1 = [];
//存放VTRelation的栈
//stack<VTRelation *> stk;
var stk1 = [];
//26个非终结符的EasyProductions链表指针，序号为对应ascii码
var productions1 = [];
//firstvt矩阵
var firstvt = [];

//判断是否为终结符
function isTerminal1(c) {
    if (isIn(c, operater))
        return true;
    else
        return false;
}
//判断终结符是否已经保存至数组
function isInTNum1(c) {
    for (let i = 0; i < tNum1; i++) {
        if (tSymb1[i] == c)
            return true;
    }
    return false;
}

//判断终结符是否已经保存至数组
function isInVNum1(c) {
    for (let i = 0; i < vNum1; i++) {
        if (vSymb1[i] == c)
            return true;
    }
    return false;
}

//通过终结符字符找在数组中的编号
function findIndexByTchar1(c) {
    for (let i = 0; i < tNum1; i++) {
        if (tSymb1[i] == c) {
            return i;
        }
    }
    return -1;
}

//通过非终结符字符找在数组中的编号
function findIndexByVchar1(c) {
    for (let i = 0; i < vNum1; i++) {
        if (vSymb1[i] == c) {
            return i;
        }
    }
    return -1;
}

//将出现过的终结符或非终结符保存至数组
function saveSymb1(c) {
    if (isTerminal1(c)) { //是终结符
        if (!isInTNum1(c)) {
            tSymb1[tNum1] = c;
            tNum1++;
        }
    }
    else { //是非终结符
        if (!isInVNum1(c)) {
            vSymb1[vNum1] = c;
            vNum1++;
        }
    }
}


//解析每条产生式的前两个字符
function analysisGrammar1(buffer) {
    let start = 3;  //从3开始为产生式右部开头
    let offset = 0; //距离产生式右部开头的偏移量
    saveSymb1(buffer[0]);
    while (start + offset < buffer.length) //产生式读完 //没有换行符
    {
        if (buffer[start + offset] != '|')
            saveSymb1(buffer[start + offset]);
        if (offset == 0 && buffer[start + offset] != '|') //开头
        {
            if (buffer[start + offset + 1] != 0 || buffer[start + offset + 1] != '|') //开头有两字符
            {
                let production = new EasyProductions();
                production.firstChar = buffer[start + offset];
                production.secondChar = buffer[start + offset + 1];
                if (productions1[buffer[0].charCodeAt() - 65] == null) {
                    productions1[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    let temp = productions1[buffer[0].charCodeAt() - 65].nextPtr;
                    productions1[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            else //开头只有一个字符
            {
                let production = new EasyProductions();
                production.firstChar = buffer[start + offset];
                production.secondChar = 0;
                if (productions1[buffer[0].charCodeAt() - 65] == null) {
                    productions1[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    let temp = productions1[buffer[0].charCodeAt() - 65].nextPtr;
                    productions1[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            offset++;
        }
        else //不是开头，跳过
        {
            if (buffer[start + offset] == '|')//重新开头
            {
                offset++;
                start = start + offset;
                offset = 0;
            }
            else {
                offset++;
            }
        }
    }
}


//算法原理第一步：如果有这样的表达式：A=>a···或者A=>Ba···，那么a∈FIRSTVT(A)。
function stepOne1() {
    for (let i = 0; i < productions1.length; i++) //遍历每个非终结符的EasyProductions
    {
        var production = productions1[i]; //链表头指针
        while (production != null) {
            if (isTerminal1(production.firstChar)) { //产生式第一个字符是终结符
                //保存至矩阵中
                firstvt[findIndexByVchar1(String.fromCharCode(i + 65))][findIndexByTchar1(production.firstChar)] = 1;
                //保存到关系中并压栈
                var relation = new VTRelation();
                relation.Vchar = String.fromCharCode(i + 65);
                relation.Tchar = production.firstChar;
                stk1.push(relation);
            }
            else if (isTerminal1(production.secondChar) && production.secondChar != 0) { //产生式第一个字符不是终结符但第二个字符是终结符
                //保存至矩阵中
                firstvt[findIndexByVchar1(String.fromCharCode(i + 65))][findIndexByTchar1(production.secondChar)] = 1;
                //保存到关系中并压栈
                let relation = new VTRelation();
                relation.Vchar = String.fromCharCode(i + 65);
                relation.Tchar = production.secondChar;
                stk1.push(relation);
            }
            production = production.nextPtr; //指向下个节点
        }
    }
}

//算法原理第二步：B=>A···且有a∈FIRSTVT(A)，则a∈FIRSTVT(B)
function stepTwo1() {
    while (!(stk1.length == 0)) { //栈不为空
        let relation = stk1[stk1.length-1];
        let nnn = stk1.length;
        stk1.pop();               //弹出,得到(A,a)
        for (let i = 0; i < productions1.length; i++) //遍历每个非终结符的EasyProductions
        {
            if (String.fromCharCode(i + 65) == relation.Vchar) //A->···时跳过
                continue;
            let production = productions1[i]; //链表头指针
            while (production != null) {
                if (production.firstChar == relation.Vchar) //找到B->A···,得到(B,a)
                {
                    if (firstvt[findIndexByVchar1(String.fromCharCode(i + 65))][findIndexByTchar1(relation.Tchar)] == 1) //已知则跳过
                    {
                        production = production.nextPtr; //指向下个节点
                        continue;
                    }
                    //保存至矩阵中
                    firstvt[findIndexByVchar1(String.fromCharCode(i + 65))][findIndexByTchar1(relation.Tchar)] = 1;
                    //保存到关系中并压栈
                    let relationStack = new VTRelation();
                    relationStack.Vchar = String.fromCharCode(i + 65);
                    relationStack.Tchar = relation.Tchar;
                    stk1.push(relationStack);
                }
                production = production.nextPtr; //指向下个节点
            }
        }
    }
}
//打印FirstVT矩阵
function printFirstVT() {
    for (let i = 0; i < vNum1; i++) {
        var str = "FirstVT(" + vSymb1[i] + ")={ ";
        for (let j = 0; j < tNum1; j++) {
            if (firstvt[i][j] == 1) {
                str = str + tSymb1[j]+" " ;
            }
        }
        console.log(str + " }");
        yufaString = yufaString + str + " }\n";
        
    }
    yufaString = yufaString +"\n";
}

function getFirstVT() {
    tNum1 = 0, vNum1 = 0;
    firstgrammar = document.getElementById("txtArea").value.split("\n");
    for (let i = 0; i < firstgrammar.length; i++) {
        analysisGrammar1(firstgrammar[i]);
    }
    for (var i = 0; i < vNum1; i++) {
        firstvt[i] = new Array();
        for (var j = 0; j < tNum1; j++) {
            firstvt[i][j] =0;
        }
    }
    stepOne1();
    stepTwo1();
    printFirstVT();
    return 0;

}
function showInf() {
    cifaString = cifaString+"\n"+"符号表：" +  JSON.stringify(dic,null, "\t") + "\n\n" + "单词栈：" + JSON.stringify(table)  + "\n\n" + "词法正确!";
    document.getElementById("cifa").value = cifaString;
    yufaString = yufaString + "优先矩阵："+JSON.stringify(matrix, null, " ");
   document.getElementById("yufa").value = yufaString;
   document.getElementById("json").value =  JSON.stringify(root, null, "\t");
}

function getVT() {
    start();
    getFirstVT();
    getLastVT();
    getMatrix();
    console.log("终结符：", tSymb1);
    startExec();
    showInf();
    showTree();
}