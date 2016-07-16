"use strict";

let numeral = require("numeral");

let color = "#009cdb";

exports.formatProperties = properties => {

    if (properties && properties.length>0) {
        let attachments = [];
        properties.forEach(property => {
            let fields = [];
            fields.push({title: "住所", value: `${property.get("State__c")} ${property.get("City__c")} ${property.get("Address__c")}`, short:true});
            fields.push({title: "リンク", value: "https://login.salesforce.com/" + property.getId(), short:true});
            fields.push({title: "部屋", value: property.get("Beds__c"), short:true});
            fields.push({title: "価格", value: `${numeral(property.get("Price__c")).format('$0,0')}`, short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "該当のレコードはありません"}];
    }
};

exports.formatPriceChanges = priceChanges => {
    if (priceChanges && priceChanges.length>0) {
        let attachments = [];
        priceChanges.forEach(priceChange => {
            let property = priceChange.get("Parent");
            let fields = [];
            fields.push({title: "住所", value: `${property.State__c} ${property.City__c} ${property.Address__c} `, short:true});
            fields.push({title: "リンク", value: "https://login.salesforce.com/" + property.Id, short:true});
            fields.push({title: "旧価格", value: `${numeral(priceChange.get("OldValue")).format('￥0,0')}`, short:true});
            fields.push({title: "新価格", value: `${numeral(priceChange.get("NewValue")).format('￥0,0')}`, short:true});
            attachments.push({color: color, fields: fields});
        });
        return attachments;
    } else {
        return [{text: "該当のレコードはありません"}];
    }

};
