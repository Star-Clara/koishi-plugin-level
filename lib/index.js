import { Time } from "koishi"
export const name = "level"
export const using = []
export async function apply(ctx){
  const logger = ctx.logger("level")
  
  ctx.database.extend("level_value",{
      key: "string",
      value: "string",
  },{
    primary: "key"
  })
  
  function mathRandomInt(a, b) {
    if (a > b) {
      // Swap a and b to ensure a is smaller.
      var c = a;
      a = b;
      b = c;
    }
    return Math.floor(Math.random() * (b - a + 1) + a);
  }
  
  
  ctx.middleware(async (session,next)=>{
    if (((await ctx.database.get('level_value',{key:(session.userId)+"."+'触发'}))[0]?.value) != 1) {
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'触发',value:'1'}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:1}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'下次签到时间',value:1}],['key'])
    } else {
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:Number((Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)) + 1))}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'等级',value:Number((((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10 - (((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10) % 1))}],['key'])
    }
    return next();
  })
  ctx.command('lv').action(async ({session},...args)=>{
  
  });
  
  ctx.command('个人信息').action(async ({session},...args)=>{
    await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'等级',value:Number((((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10 - (((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10) % 1))}],['key'])
    await session.send((['🌟等级：',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)),'&#10;','—————————&#10;','☀️您的经验值为',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)),'/',Number(((10 * Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) * (Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) + 1)) / 2))].join('')));
  
  });
  
  ctx.command('签到').action(async ({session},...args)=>{
    if (((await ctx.database.get('level_value',{key:(session.userId)+"."+'触发'}))[0]?.value) != 1) {
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'触发',value:'1'}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:1}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'下次签到时间',value:1}],['key'])
    } else {
      if ((Math.round(new Date() )) > ((await ctx.database.get('level_value',{key:(session.userId)+"."+'下次签到时间'}))[0]?.value)) {
        await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'签到奖励',value:(mathRandomInt(25, 50))}],['key'])
        await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'下次签到时间',value:(Number((Math.round(new Date() ))) + 64800000)}],['key'])
        await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:Number((Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)) + Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'签到奖励'}))[0]?.value))))}],['key'])
        await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'等级',value:Number((((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10 - (((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10) % 1))}],['key'])
        await session.send((['✔签到成功！请18小时后再来✔','&#10;','您获得了',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'签到奖励'}))[0]?.value)),'经验值！','&#10;','—————————&#10;','🌟您目前的等级：',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)),'&#10;','—————————&#10;','☀️您目前的的经验值：',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)),'/',Number(((10 * Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) * (Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) + 1)) / 2)),'&#10;','—————————&#10;','下次签到时间：',Time.template('yyyy-MM-dd hh:mm:ss',new Date(Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'下次签到时间'}))[0]?.value)))),''].join('')));
      } else {
        return (['未到签到时间，请稍后再试','&#10;','—————————&#10;','下次签到时间：',Time.template('yyyy-MM-dd hh:mm:ss',new Date(Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'下次签到时间'}))[0]?.value))))].join(''));
      }
    }
  
  });
  
}