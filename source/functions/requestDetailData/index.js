const request = require("request");
const xml2js = require('xml2js');

exports.handler = (_event, _context, _callback) => {
    let url = "http://openapi.youth.go.kr/openapi/service/";
    let key = "HF1eUr96KfQkuZe3Pl1v0stWJvCU8eH72E%2BPGfe%2BiUOMDUlk0P1%2FMgO4SpXf0qq74hzOF7ctuBDJl2L7aXXOsw%3D%3D";
    let path = _event.params.path;
    let apiPath = path.method;
    let options = {
        url : url,
        method : "GET",
        timeout : 20 * 1000
    };

    _context.callbackWaitsForEmptyEventLoop = false;

    switch(apiPath) {
        case "getCertiProgrmInfo" :
            options.url = options.url + "YouthActivInfoCertiSrvc/" + apiPath + "?serviceKey=" + key + "&key1=" + path.key; 
            break;
        case "getVolProgrmInfo" :
            options.url = options.url + "YouthActivInfoVolSrvc/" + apiPath + "?serviceKey=" + key + "&key1=" + path.key;
            break;
    }

    request(options, (_reqError, _response, _body) => {
        let statusCode = _response.statusCode;
        let parser = new xml2js.Parser();
        let result;

        if (statusCode === 200) {
            parser.parseString(_body, (_parserErr, _result) => {
                let header = _result.response.header[0];
                let body = _result.response.body[0];
                let item = body.items[0].item;

                result = {
                    resultCode : header.resultCode[0],
                    resultMsg : header.resultMsg[0],
                    numOfRows : body.numOfRows[0],
                    pageNo : body.pageNo[0],
                    totalCount : body.totalCount[0],
                    data : []
                };

                switch(apiPath) {
                    case "getCertiProgrmInfo" :
                        item.map((_item, _idx) => {
                            result.data.push(
                                {
                                    nums : _item.nums ? _item.nums[0] : "",
                                    orgnNm : _item.orgnNm ? _item.orgnNm[0] : "",
                                    pgmNm : _item.nums ? _item.pgmNm[0] : "",
                                    price : _item.price ? _item.price[0] : "",
                                    target : _item.target ? _item.target[0] : "",
                                    managerNm : _item.managerNm ? _item.managerNm[0] : "",
                                    email : _item.email ? _item.email[0] : "",
                                    tel : _item.tel ? _item.tel[0] : "",
                                    info1 : _item.info1 ? _item.info1[0] : "",
                                    info2 : _item.info2 ? _item.info2[0] : ""
                                }
                            );
                        });
                        break;
                    case "getVolProgrmInfo" :
                        item.map((_item, _idx) => {
                            result.data.push(
                                {
                                    orgnNm : _item.orgnNm ? _item.orgnNm[0] : "",
                                    pgmNm : _item.nums ? _item.pgmNm[0] : "",
                                    price : _item.price ? _item.price[0] : "",
                                    target : _item.target ? _item.target[0] : "",
                                    sdate : _item.sdate ? _item.sdate[0] : "",
                                    managerNm : _item.managerNm ? _item.managerNm[0] : "",
                                    addr : _item.addr ? _item.addr[0] : "",
                                    zip : _item.zip ? _item.zip[0] : "",
                                    place : _item.place ? _item.place[0] : "",
                                    tel : _item.tel ? _item.tel[0] : "",
                                    info1 : _item.info1 ? _item.info1[0] : "",
                                    info2 : _item.info2 ? _item.info2[0] : ""
                                }
                            );
                        });
                        break;
                }
            });
        }

        _callback(null, result);
    });
};