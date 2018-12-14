var grammar;




/*
S->S;G|G
G->G(T)|H
H->a|(S)
T->T+S|S
*/


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
var tNum, vNum;
//储存终结符，非终结符
var tSymb = [], vSymb = [];
//存放VTRelation的栈
//stack<VTRelation *> stk;
var stk = [];
//26个非终结符的EasyProductions链表指针，序号为对应ascii码
var productions = [];
//lastvt矩阵
var lastvt = [];

//判断是否为终结符
function isTerminal(c) {
    if (isIn(c, operater)||c=="#")
        return true;
    else
        return false;
}
//判断终结符是否已经保存至数组
function isInTNum(c) {
    for (let i = 0; i < tNum; i++) {
        if (tSymb[i] == c)
            return true;
    }
    return false;
}

//判断终结符是否已经保存至数组
function isInVNum(c) {
    for (let i = 0; i < vNum; i++) {
        if (vSymb[i] == c)
            return true;
    }
    return false;
}

//通过终结符字符找在数组中的编号
function findIndexByTchar(c) {
    for (let i = 0; i < tNum; i++) {
        if (tSymb[i] == c) {
            return i;
        }
    }
    return -1;
}

//通过非终结符字符找在数组中的编号
function findIndexByVchar(c) {
    for (let i = 0; i < vNum; i++) {
        if (vSymb[i] == c) {
            return i;
        }
    }
    return -1;
}

//将出现过的终结符或非终结符保存至数组
function saveSymb(c) {
    if (isTerminal(c)) { //是终结符
        if (!isInTNum(c)) {
            tSymb[tNum] = c;
            tNum++;
        }
    }
    else { //是非终结符
        if (!isInVNum(c)) {
            vSymb[vNum] = c;
            vNum++;
        }
    }
}


//解析每条产生式的前两个字符
function analysisGrammar(buffer) {
    let start = 3;  //从3开始为产生式右部开头
    let offset = 0; //距离产生式右部开头的偏移量
    saveSymb(buffer[0]);
    while (true)
    {
        if (buffer[start + offset] != '|')
            saveSymb(buffer[start + offset]);
        if (start + offset + 1 >=buffer.length) //产生式结束
        {
            if (offset == 0) //只有一个字符
            {
                var production = new EasyProductions();
                production.firstChar = buffer[start + offset];
                production.firstCharsecondChar = 0;
                if (productions[buffer[0].charCodeAt() - 65] == null)
                {
                    productions[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    var temp = productions[buffer[0].charCodeAt() - 65].nextPtr;
                    productions[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            else //结尾有两个字符
            {
               var production = new EasyProductions();
                production.firstChar = buffer[start + offset]; //这里的first指的是倒数的，second同理
                production.secondChar = buffer[start + offset - 1];
                if (productions[buffer[0].charCodeAt() - 65] == null)
                {
                    productions[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    var temp = productions[buffer[0].charCodeAt() - 65].nextPtr;
                    productions[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            break; //唯一出口
        }
        else if (buffer[start + offset + 1] == '|') //遇到或，结束
        {
            if (offset == 0) //只有一个字符
            {
               var production = new EasyProductions();
                production.firstChar = buffer[start + offset];
                production.secondChar = 0;
                if (productions[buffer[0].charCodeAt() - 65] == null)
                {
                    productions[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    var temp = productions[buffer[0].charCodeAt() - 65].nextPtr;
                    productions[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            else //结尾有两个字符
            {
                var production = new EasyProductions();
                production.firstChar = buffer[start + offset];
                production.secondChar = buffer[start + offset - 1];
                if (productions[buffer[0] .charCodeAt()- 65] == null)
                {
                    productions[buffer[0].charCodeAt() - 65] = production;
                }
                else //头插法
                {
                    var temp= productions[buffer[0].charCodeAt() - 65].nextPtr;
                    productions[buffer[0].charCodeAt() - 65].nextPtr = production;
                    production.nextPtr = temp;
                }
            }
            start =start+ offset + 2;
            offset = 0;
        }
        else //没有遇到结尾
        {
            offset++;
        }
    }
}

//算法原理第一步：如果有这样的表达式：A=>a···或者A=>Ba···，那么a∈FIRSTVT(A)。
function stepOne() {
    for (let i = 0; i < productions.length; i++) //遍历每个非终结符的EasyProductions
    {
        var production = productions[i]; //链表头指针
        while (production != null) {
            if (isTerminal(production.firstChar)) { //产生式第一个字符是终结符
                //保存至矩阵中
                lastvt[findIndexByVchar(String.fromCharCode(i + 65))][findIndexByTchar(production.firstChar)] = 1;
                //保存到关系中并压栈
                var relation = new VTRelation();
                relation.Vchar = String.fromCharCode(i + 65);
                relation.Tchar = production.firstChar;
                stk.push(relation);
            }
            else if (isTerminal(production.secondChar) && production.secondChar != 0) { //产生式第一个字符不是终结符但第二个字符是终结符
                //保存至矩阵中
                lastvt[findIndexByVchar(String.fromCharCode(i + 65))][findIndexByTchar(production.secondChar)] = 1;
                //保存到关系中并压栈
                let relation = new VTRelation();
                relation.Vchar = String.fromCharCode(i + 65);
                relation.Tchar = production.secondChar;
                stk.push(relation);
            }
            production = production.nextPtr; //指向下个节点
        }
    }
}

//算法原理第二步：B=>A···且有a∈FIRSTVT(A)，则a∈FIRSTVT(B)
function stepTwo() {
    while (!(stk.length == 0)) { //栈不为空
        let relation = stk[stk.length-1];
        let nnn = stk.length;
        stk.pop();               //弹出,得到(A,a)
        for (let i = 0; i < productions.length; i++) //遍历每个非终结符的EasyProductions
        {
            if (String.fromCharCode(i + 65) == relation.Vchar) //A->···时跳过
                continue;
            let production = productions[i]; //链表头指针
            while (production != null) {
                if (production.firstChar == relation.Vchar) //找到B->A···,得到(B,a)
                {
                    if (lastvt[findIndexByVchar(String.fromCharCode(i + 65))][findIndexByTchar(relation.Tchar)] == 1) //已知则跳过
                    {
                        production = production.nextPtr; //指向下个节点
                        continue;
                    }
                    //保存至矩阵中
                    lastvt[findIndexByVchar(String.fromCharCode(i + 65))][findIndexByTchar(relation.Tchar)] = 1;
                    //保存到关系中并压栈
                    let relationStack = new VTRelation();
                    relationStack.Vchar = String.fromCharCode(i + 65);
                    relationStack.Tchar = relation.Tchar;
                    stk.push(relationStack);
                }
                production = production.nextPtr; //指向下个节点
            }
        }
    }
}
//打印lastVT矩阵
function printLastVT() {
    for (let i = 0; i < vNum; i++) {
        var str = "LastVT(" + vSymb[i] + ")={ ";
        for (let j = 0; j < tNum; j++) {
            if (lastvt[i][j] == 1) {
                str = str + tSymb[j]+" " ;
            }
        }
        console.log(str + " }");
        yufaString = yufaString + str + " }\n";
    
    }
    yufaString = yufaString +"\n";
}

function getLastVT() {
    tNum = 0, vNum = 0;
    grammar = document.getElementById("txtArea").value.split("\n");
    for (let i = 0; i < grammar.length; i++) {
        analysisGrammar(grammar[i]);
    }
    for (var i = 0; i < vNum; i++) {
        lastvt[i] = new Array();
        for (var j = 0; j < tNum; j++) {
            lastvt[i][j] =0;
        }
    }
    stepOne();
    stepTwo();
    printLastVT();
    return 0;

}
