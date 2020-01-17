# google_map_crawl
根據關鍵字爬谷歌地圖的商家資料輸出成csv表

## 操作步驟（MAC）

1. 打開chrome
2. 到[谷歌](https://www.google.com.tw/maps?hl=zh-TW&tab=rl)地圖
3. 輸入關鍵字 （比如：台北車站 咖啡）
4. 打開DevTool (⌘+⌥(alt)+J)
5. 執行程式碼（附錄一）

等待... （！注意切換到桌面二（⌃+➡️）的話程式會停掉）

1. 執行指令

   ```javascript
   exportToCsv('尚未命名',rows)
   ```

   end

附表一

```javascript
//根據關鍵字爬谷歌地圖的商家資料輸出成csv表
//version 1.0
let rows = []
let store_num = 0//注意！從0開始
let Interval = setInterval(() => {
    // 如果商店名稱dom存在於頁面的話
    var dummy = 0
    var last_row_num = null
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]')) {
        last_row_num = getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[4]/div[2]/div/div[1]/span/span[2]').innerHTML - 0
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
        rows.push(get_store_info_row())
        store_num++
    }
}, 2000);

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function get_store_info_row() {
    var row = []
//名稱
    row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/h1').innerHTML)
//星級
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[1]/span/span')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[1]/span[1]/span/span').innerHTML)
    }
    else {
        row.push('（空）')
    }
//類型
    if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[2]/span[1]/span[1]/button')) {
        row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[2]/span[1]/span[1]/button').innerHTML)
    }
    else {
        row.push('（空）')
    }
//9-12
    var coulmn_number
    for (coulmn_number = 9; coulmn_number <= 15; coulmn_number++) {
        if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[' + coulmn_number + ']/div/div[1]/span[3]/span[3]')) {
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
    getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[4]/div[1]/div[' + (2 * row_num + 1) + ']').click()
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

```

