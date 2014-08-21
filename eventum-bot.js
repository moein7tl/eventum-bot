var CONFIG                  =   require('config').Customer,
    Deferred                =   require('simply-deferred').Deferred,
    CronJob                 =   require('cron').CronJob,
    logger                  =   require('./modules/log')(__dirname+"/runtime/log/bot.log"),
    mongoose                =   require('mongoose'),
    broker                  =   require('./modules/broker')(CONFIG),
    crawler                 =   require('./modules/crawler')(CONFIG,mongoose.connection,broker);

mongoose.connect(CONFIG.MONGODB_STRING);

var tasks                   =   [];
var urls                    =   ["http://daarkoob.ir"];
    
  
new CronJob(CONFIG.CRON_JOB_PATTERN,function(){
    urls.forEach(function (url,i){
        if (tasks[i] === undefined || (tasks[i].pool && tasks[i].pool.getPoolSize() === 0)){
            tasks[i]    =   crawler(url);
        }
    });
},null, true, CONFIG.CRON_JOB_TIMEZONE);