var amqp               =   require('amqp'),brokerConnection,exchange,queue;
module.exports  =   function(_C,undefined){    
    var firstOption         =   {
            url:                        _C.AMPQ_URL,
        },
        secondOption        =   {
            reconnect:                  _C.AMPQ_RECONNECT,
            reconnectBackoffStrategy:   _C.AMPQ_RECONNECT_STRATEGY,
            reconnectBackoffTime:       _C.AMPQ_BACKOFF_TIME,
        };
    if (!brokerConnection) brokerConnection    =   amqp.createConnection(firstOption,secondOption);
    
    brokerConnection.on('ready',function(){
        exchange    =   brokerConnection.exchange('');
        brokerConnection.queue(_C.RABBITMQ_QUEUE, { durable: true }, function(q) { 
            queue   =   q;
        });
    });
    
    function publish(msg){
        if (exchange){
            exchange.publish(queue, { body: msg }); 
        }
    }
    
    function subscribe(callback){
        if (queue){
            queue.subscribe(callback);
        }    
    }
    
    return {
        'publish':      publish,
        'subscribe':    subscribe
    };
}