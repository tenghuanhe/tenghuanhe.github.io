"use strict";

let dappContractAddress = "n1sBBFp3NuDiSzvGWTdkoQwWQdxcdZPcZXQ";
var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

let NebPay = require("nebpay");
let nebPay = new NebPay();
let serialNumber;

let $rankTable = $('#rank-table');
let $rateTitle = $('#rate-title');
let $rateAuthor = $('#rate-author');
let $rateComment = $('#rate-comment');
let $rateScore = $('#rate-score');
let $rateBtn = $('#rate-btn');
let $queryTitle = $('#query-title');
let $queryAuthor = $('#query-author');
let $queryBookInfo = $('#query-book-info');
let $queryBtn = $('#query-btn');
let $queryResultTitle = $('#query-result-title');
let $queryResultAuthor = $('#query-result-author');
let $queryResultScore = $('#query-result-score');
let $queryResultCommentList = $('#query-result-comment-list');

let from = dappContractAddress;
let value = "0";
let nonce = "0";
let gas_price = "1000000";
let gas_limit = "2000000";
let callFunction = "fetchAll";
let callArgs = "[]";
let contract = {
    "function": callFunction,
    "args": callArgs
};

neb.api.call(from, dappContractAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
    let result = resp.result;
    let rateList = JSON.parse(result);

    let rateMap = rateList.reduce(function (accumulator, currentValue, currentIndex, array) {
        let title = currentValue['title'];
        let author = currentValue['author'];
        let rater = currentValue['rater'];
        let key = title + "-" + author;
        let score = parseInt(currentValue['score']);
        if (!accumulator[key]) {
            accumulator[key] = {
                'title': title,
                'author': author,
                'scoreList': [score]
            }
        } else {
            accumulator[key]['scoreList'].push(score);
        }
        return accumulator;
    }, {});

    let scoreResultList = [];
    for (let key in rateMap) {
        if (rateMap.hasOwnProperty(key)) {
            let entry = rateMap[key];
            scoreResultList.push({
                'title': entry['title'],
                'author': entry['author'],
                'score': (sum(entry['scoreList']) / entry['scoreList'].length).toFixed(1),
                'rateNumber': entry['scoreList'].length
            });
        }
    }

    scoreResultList.sort(function (a, b) {
        return b.score - a.score;
    });

    for (let i = 0; i < scoreResultList.length; i++) {
        let item = scoreResultList[i];
        $rankTable.find('tbody')
            .append($('<tr>')
                .append($('<td>')
                    .append(item.title)
                )
                .append($('<td>')
                    .append(item.author)
                )
                .append($('<td>')
                    .append(item.score)
                )
                .append($('<td>')
                    .append(item.rateNumber)
                )
                .append($('<td>')
                    .append('<button id="rate-btn-' + item.title + '-' + item.author + '" class="btn btn-sm btn-info rate-btn-cls">我也要评分</button>'))
                .append($('<td>')
                    .append('<button id="query-btn-' + item.title + '-' + item.author + '" class="btn btn-sm btn-success query-btn-cls">查看评价详情</button>'))
            );
    }
}).catch(function (err) {
    console.log(err);
});

$queryBookInfo.hide();

$rateBtn.click(function () {
    let title = $rateTitle.val().trim();
    let author = $rateAuthor.val().trim();
    let comment = $rateComment.val().trim();
    let score = $rateScore.val();
    if (title === null || title === "") {
        alert("empty title!");
        return;
    }
    if (author === null || title === "") {
        alert("empty author!");
        return;
    }

    let to = dappContractAddress;
    let value = "0";
    let callFunction = "rate";
    let callArgs = "[\"" + title + "\",\"" + author + "\",\"" + comment + "\",\"" + score + "\"]";
    serialNumber = nebPay.call(to, value, callFunction, callArgs, {
        listener: function (resp) {
            console.log(resp);
        }
    })
});

$queryBtn.click(function () {
    let title = $queryTitle.val().trim();
    let author = $queryAuthor.val().trim();
    if (title === null || title === "") {
        alert("empty title!");
        return;
    }
    if (author === null || title === "") {
        alert("empty author!");
        return;
    }

    let from = dappContractAddress;
    let value = "0";
    let nonce = "0";
    let gas_price = "1000000";
    let gas_limit = "2000000";
    let callFunction = "query";
    let callArgs = "[\"" + title + "\",\"" + author + "\"]";
    let contract = {
        "function": callFunction,
        "args": callArgs
    };

    $queryResultCommentList.empty();

    neb.api.call(from, dappContractAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
        let result = resp.result;
        let rateList = JSON.parse(result);
        console.log(rateList);
        let scores = [];
        let title = null;
        let author = null;

        rateList.forEach(function (rateItem) {
            title = rateItem['title'];
            author = rateItem['author'];
            let rater = rateItem['rater'];
            let comment = rateItem['comment'];
            scores.push(parseInt(rateItem['score']));

            $queryResultCommentList.append("<div class='row'><div class='row' style='margin-left: 15px; margin-right: 15px'>" + comment + "</div><div class='row' style='float: right; margin-right: 15px'>--" + rater + "</div></div>")
        });
        $queryResultTitle.text(title);
        $queryResultAuthor.text(author);
        $queryResultScore.text((sum(scores) / scores.length).toFixed(1));
        $queryBookInfo.show();
    }).catch(function (err) {
        console.log(err);
    });
});

$(document).on('click', '.rate-btn-cls', function () {
    let btnId = this.id;
    let title = btnId.split('-')[2];
    let author = btnId.split('-')[3];
    $rateTitle.val(title);
    $rateAuthor.val(author);

    $('.nav-tabs a[href="#rate-tab"]').tab('show')
});

$(document).on('click', '.query-btn-cls', function () {
    let btnId = this.id;
    let title = btnId.split('-')[2];
    let author = btnId.split('-')[3];
    $queryTitle.val(title);
    $queryAuthor.val(author);
    $('.nav-tabs a[href="#query-tab"]').tab('show');
    $queryBtn.click();
});

let sum = function (arr) {
    return arr.reduce(function (a, b) {
        return a + b;
    });
};