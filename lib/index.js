"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apply = exports.using = exports.name = void 0;
exports.name = "level";
exports.using = [];
async function apply(ctx) {
    ctx.command('个人信息').action(async ({ session }, ...args) => {
        if (((await ctx.database.get('level_exp_value', { key: (session.userId) + "." + '触发' }))[0]?.value) == 1) {
            await session.send(('您的经验值为' + String(Number(((await ctx.database.get('level_exp_value', { key: (session.userId) + "." + '经验值' }))[0]?.value)))));
        }
        else {
            await session.send((['需要至少发送一条信息', '', ''].join('')));
        }
    });
    ctx.database.extend("level_exp_value", {
        key: "string",
        value: "string",
    }, {
        primary: "key"
    });
    const logger = ctx.logger("level_pstr");
    ctx.middleware(async (session, next) => {
        if (((await ctx.database.get('level_exp_value', { key: (session.userId) + "." + '触发' }))[0]?.value) != 1) {
            await ctx.database.upsert('level_exp_value', [{ key: (session.userId) + "." + '触发', value: '1' }], ['key']);
            await ctx.database.upsert('level_exp_value', [{ key: (session.userId) + "." + '经验值', value: 1 }], ['key']);
        }
        else {
            logger.info(('收到消息，来自' + String(session.userId)));
            await ctx.database.upsert('level_exp_value', [{ key: (session.userId) + "." + '经验值', value: Number((Number(((await ctx.database.get('level_exp_value', { key: (session.userId) + "." + '经验值' }))[0]?.value)) + 1)) }], ['key']);
            logger.info(([session.userId, '的经验值为', Number(((await ctx.database.get('level_exp_value', { key: (session.userId) + "." + '经验值' }))[0]?.value))].join('')));
        }
        return next();
    });
}
exports.apply = apply;
