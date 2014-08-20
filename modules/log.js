module.exports  =   function(file){
    var logger  =   require('winston');
    logger.add(logger.transports.File, { filename: file });
    logger.remove(logger.transports.Console);
    return logger;
}