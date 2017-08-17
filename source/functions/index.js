const request = require("request");
const xml2js = require('xml2js');

exports.handler = (_event, _context, _callback) => {
    let url = "http://openapi.youth.go.kr/openapi/service/YouthActivInfoCertiSrvc/";
    let key = "HF1eUr96KfQkuZe3Pl1v0stWJvCU8eH72E%2BPGfe%2BiUOMDUlk0P1%2FMgO4SpXf0qq74hzOF7ctuBDJl2L7aXXOsw%3D%3D";
    let path = _event.params.path;
    let apiPath = path.method;
    let options = {
        url : url + apiPath + "?serviceKey=" + key + "&numOfRows=10",
        method : "GET",
        timeout : 10 * 1000
    };

    switch(apiPath) {
        case "getCertiProgrmList" :
        case "getVolProgrmList" :
        case "getYngbgsIntrlExchgProgrmList" :
            options.url = options.url + "&numOfRows=" + path.count;
            break;
    }

    request(options, (_reqError, _response, _body) => {
        let statusCode = _response.statusCode;
        let parser = new xml2js.Parser();
        let result = {
            statusCode : statusCode
        };

        if (statusCode === 200) {
            parser.parseString(_body, (_parserErr, _result) => {
                result.data = _result;
            });
        } else {
            result.data = {};
        }

        _callback(null, result);
    });
};