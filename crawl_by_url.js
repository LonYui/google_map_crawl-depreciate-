//根據關鍵字爬谷歌地圖的商家資料輸出成csv表
//version 1.0
let rows = []
let store_num = 1;
let Interval = setInterval(() => {
    // 如果商店名稱dom存在於頁面的話
    let dummy = 0;
    if (store_num == 20) {
        alert('結束爬取此業20個')
        alert('執行指令："export_csv()"下載爬取資料')
        killInterval()
    }
    else if (getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[1]/h1')) {
        rows.push(get_store_info_row())
    }
    else {
        choose_which_store_to_crawl(store_num)
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
    row.push(getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[2]/div[1]/div[2]/div/div[2]/span[1]/span[1]/button').innerHTML)
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

//input row
function choose_which_store_to_crawl(row) {
    store_num++
    getElementByXpath('//*[@id="pane"]/div/div[1]/div/div/div[4]/div[1]/div[' + (2 * row - 1) + ']').click()
}

function export_csv() {
    const rows_export = rows
    let csvContent = "data:text/csv;charset=utf-8,"
        + rows_export.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
}

function killInterval() {
    clearInterval(Interval);
}
