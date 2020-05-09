//（hotel特別版本） 根據關鍵字爬谷歌地圖的商家資料輸出成csv表
//version 2.0 release date 200509
let rows = []
let store_num = 0//注意！從0開始

let Interval = setInterval(() => {
    // 如果商店名稱dom存在於頁面的話
    var dummy = 0
    var last_row_num = null
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[5]/div[2]/div/div[1]/span/span[2]')) {
        last_row_num = getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[5]/div[2]/div/div[1]/span/span[2]').innerHTML - 0
    }
    //當爬到清單最後一項目
    if (store_num == last_row_num) {
        (last_row_num % 20 == 0) ? change_page() : the_end()
    }
    //當頁面不在店家頁面內
    else if (!getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/h1')) {
        choose_which_store_to_crawl((store_num) % 20)
    }
    //當頁面在店家頁面內
    else {
        if(rows!=0){
            //若此業商家名稱 和 列表最後一行 名稱一樣 就不加入
            if (rows[rows.length-1][0] == getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/h1').innerHTML){
                return
            }
        }
        row = get_store_info_row()
        if (row!==-1)//非重複
            rows.push(row)
        store_num++
    }
}, 2000);


function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function get_store_info_row() {
    var row = []
//名稱0
    var name = getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/h1').innerHTML
    var rowsName = []
    rows.forEach(ele=>rowsName.push(ele[0]))
    if (name in rowsName)return -1
    row.push(name)
//星級1
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[1]/span/span')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[1]/span/span').innerHTML)
    }
    else {
        row.push('（空）')
    }
//類型2
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[2]/span[1]/span[1]/button')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[2]/span[1]/span[1]/button').innerHTML)
    }
    else {
        row.push('（空）')
    }
//價錢3
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[1]/div[4]/div/button/div/jsl[2]/div[2]/span')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[1]/div[4]/div/button/div/jsl[2]/div[2]/span').innerHTML)
    }
    else {
        row.push('（空）')
    }
//星集4
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[2]/span/span[2]/span[2]/span[1]/span')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[2]/span/span[2]/span[2]/span[1]/span').innerHTML)
    }
    else {
        row.push('（空）')
    }

//手機5
    row.push('沒有手機')
//網址6
    row.push('沒有網址')

//14-20
    var coulmn_number
    for (coulmn_number = 14; coulmn_number <= 20; coulmn_number++) {

        if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[' + coulmn_number + ']/div/div[1]/span[3]/span[3]')) {
            var text = getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[' + coulmn_number + ']/div/div[1]/span[3]/span[3]').innerHTML
            if(isFB(text))
                row[6]='https://www.facebook.com/search/pages/?q='+name
            else if(isPhoneNumber(text))
                row[5] = text
            else if(isUrl(text))
                row[6]=text
            else
                row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[' + coulmn_number + ']/div/div[1]/span[3]/span[3]').innerHTML)
        }
        else {
            row.push('（空）')
        }
    }
    getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/button/span').click()
    return row
}

function choose_which_store_to_crawl(row_num) {
    getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[5]/div[1]/div['+(2 * row_num + 1)+']/div[1]').click()
}

function change_page() {
    getElementByXpath('//*[@id="n7lv7yjyC35__section-pagination-button-next"]').click()
}

function exportToCsv(filename, rows) {
    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function the_end() {
    alert('結束爬取此業20個')
    alert('執行指令："exportToCsv(\'尚未命名\',rows)"下載爬取資料')
    killInterval()
}

function killInterval() {
    clearInterval(Interval);
}

function isPhoneNumber(text){
    if (text[0]==='0' && text[1]==='9') return true
    else return false
}

function isUrl (text) {
    if (text.search('.com')!==-1)return  true
    else if (text.search('.net')!==-1)return true
    else return false
}
function isFB(text) {
    if(text.search('facebook.com')!==-1) return true
    else return false
}