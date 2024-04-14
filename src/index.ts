export const name = "level"
export const using = []
export async function apply(ctx){
  ctx.database.extend("level_value",{
      key: "string",
      value: "string",
  },{
    primary: "key"
  })
  
  const logger = ctx.logger("level")
    
  ctx.middleware(async (session,next)=>{
    if (((await ctx.database.get('level_value',{key:(session.userId)+"."+'触发'}))[0]?.value) != 1) {
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'触发',value:'1'}],['key'])
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:1}],['key'])
    } else {
      // logger.info(('收到消息，来自' + String(session.userId)));
      await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'经验值',value:Number((Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)) + 1))}],['key'])
      // logger.info(([session.userId,'的经验值为',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))].join('')));
      // logger.info(Number((((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10)));
    }
    return next();
  })
  ctx.command('个人信息').action(async ({session},...args)=>{
    await ctx.database.upsert('level_value',[{key:(session.userId)+"."+'等级',value:Number((((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10 - (((5 + Math.sqrt(25 - 4 * 5 * (1 - Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value))))) - 0) / 10) % 1))}],['key'])
    if (((await ctx.database.get('level_value',{key:(session.userId)+"."+'触发'}))[0]?.value) == 1) {
      await session.send((['🌟等级：',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)),'&#10;','—————————&#10;','☀️您的经验值为',Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'经验值'}))[0]?.value)),'/',Number(((10 * Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) * (Number(((await ctx.database.get('level_value',{key:(session.userId)+"."+'等级'}))[0]?.value)) + 1)) / 2))].join('')));
    } else {
      await session.send((['需要至少发送一条信息','',''].join('')));
    }
  
  });
  
}