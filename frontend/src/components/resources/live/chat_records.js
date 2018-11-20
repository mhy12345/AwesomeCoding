import {copy} from '../../../utils/Copy'
import root_url from '../../../../config/http_root_url'

function parseFlow(flow) {  // 从流中获取到消息
    let record = copy(flow);
    record.path = root_url + record.path;
    record.date_time = new Date(flow.date_time);    // 以 Date 的形式储存时间
    return record;
}

function parseList(list) {  // 从数据库列表获取到消息列表
    let records = [];
    for (let flow of list) {
        records.push(parseFlow(flow))
    }
    return records;
}

function formatDateTime(date_time) {    // 以合适的形式显示日期时间
    let now = new Date();
    if (now.toLocaleDateString() === date_time.toLocaleDateString()) {
        return date_time.toLocaleTimeString();
    }
    else {
        return date_time.toLocaleString();
    }
}

module.exports = {
    parseFlow, parseList, formatDateTime
};
