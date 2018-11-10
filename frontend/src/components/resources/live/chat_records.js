import {copy} from '../../../utils/Copy'

function parseFlow(flow) {
    let record = copy(flow);
    record.date_time = new Date(flow.date_time);    // 以 Date 的形式储存时间
    record.type = 'text';
    return record;
}

function parseList(list) {
    let records = [];
    for (let flow of list) {
        records.push(parseFlow(flow))
    }
    return records;
}

function formatDateTime(date_time) {
    let now = new Date();
    if (now.toLocaleDateString() === date_time.toLocaleDateString) {
        return date_time.toLocaleTimeString();
    }
    else {
        return date_time.toLocaleString();
    }
}

module.exports = {
    parseFlow, parseList, formatDateTime
};
