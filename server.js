"use strict";

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

let Botkit = require('botkit'),
    formatter = require('./modules/formatter'),
    salesforce = require('./modules/salesforce'),

    controller = Botkit.slackbot(),

    bot = controller.spawn({
        token: SLACK_BOT_TOKEN
    });

bot.startRTM(err => {
    if (err) {
        throw new Error('Slackへ接続することができません');
    }
});

controller.hears(['ヘルプ'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `以下のように問合せすることができます:
    "部屋数:3  場所:品川 価格:5000から7000"
    "部屋数:3 場所:品川"
    "場所:品川"
    "問合せ作成"`
    });
});
-
controller.hears(['部屋数:(.*) 場所:(.*) 価格:(.*)から(.*)', '部屋数:(.*) 場所:(.*) 価格:(.*)より(.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({bedrooms: match[1], city: match[2], priceMin: match[3], priceMax: match[4]})
        .then(properties => bot.reply(message, {
            text: "これらの物件が見つかりました:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['部屋数:(.*) 場所:(.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({bedrooms: match[1], city: match[2]})
        .then(properties => bot.reply(message, {
            text: "これらの物件が見つかりました:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['場所:(.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({city: match[1]})
        .then(properties => bot.reply(message, {
            text: "これらの物件が見つかりました:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['価格:(.*)から(.*)', '価格:(.*)より(.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findProperties({priceMin: match[1], priceMax: match[2]})
        .then(properties => bot.reply(message, {
            text: "これらの物件が見つかりました:",
            attachments: formatter.formatProperties(properties)
        }))
        .catch(error => bot.reply(message, error));
});

controller.hears(['部屋数:(.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    console.log(match[1]);
    salesforce.findProperties({bedrooms: match[1]})
        .then(properties => {
            console.log(properties);
            bot.reply(message, {
                text: "これらの物件が見つかりました:",
                attachments: formatter.formatProperties(properties)
            })
        })
        .catch(error => bot.reply(message, error));
});

controller.hears(['価格変更'], 'direct_message,direct_mention,mention', (bot, message) => {
    salesforce.findPriceChanges()
        .then(priceChanges => {
            bot.reply(message, {
                text: "以下が最近の価格変更です:",
                attachments: formatter.formatPriceChanges(priceChanges)
            })
        })
        .catch(error => bot.reply(message, error));
});


controller.hears(['問合せ作成', 'ケース作成'], 'direct_message,direct_mention,mention', (bot, message) => {

    let askSubject = (response, convo) => {

        convo.ask("件名は何にしますか？", (response, convo) => {
            askDescription(response, convo);
            convo.next();
        });

    };

    let askDescription = (response, convo) => {

        convo.ask('問合せの内容を入力してください', (response, convo) => {
            console.log("###convo");
            let responses = convo.getResponsesAsArray();
            salesforce.createCase({subject: responses[0].answer, description: responses[1].answer})
                .then(_case => {
                    bot.reply(message, {
                        text: "問合せを作成しました:",
                        //attachments: formatter.formatCase(_case)
                    });
                    convo.next();
                })
                .catch(error => {
                    bot.reply(message, error);
                    convo.next();
                });
        });

    };

    bot.reply(message, "かしこまりました。");
    bot.startConversation(message, askSubject);

});
