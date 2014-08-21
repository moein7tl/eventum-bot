var amqp               =   require('amqp'),brokerConnection,exchange,queue;
module.exports  =   function(_C,undefined){    
    var firstOption         =   {
        url:    _C.AMPQ_URL
        },            
        
        secondOption        =   {
            reconnect:                  _C.AMPQ_RECONNECT,
            reconnectBackoffStrategy:   _C.AMPQ_RECONNECT_STRATEGY,
            reconnectBackoffTime:       _C.AMPQ_BACKOFF_TIME,
        };

    if (!brokerConnection) brokerConnection    =   amqp.createConnection(firstOption,secondOption);
    
    brokerConnection.on('ready',function(){
        console.log('Broker is ready');
        exchange    =   brokerConnection.exchange('');
        brokerConnection.queue(_C.RABBITMQ_QUEUE, {passive:false, durable: true,exclusive:false,autoDelete:false }, function(q) { 
            queue   =   q;
        });
    });
    
    brokerConnection.on('close',function (){
        console.log("Broker is not ready");
    });
    
    function publish(msg){
        if (exchange){
            exchange.publish(_C.RABBITMQ_QUEUE, msg,{deliveryMode: 2}); 
        }
    }
    
    function subscribe(callback){
        if (queue){
            queue.subscribe({ack: true, prefetchCount: 1},callback);
        }    
    }
    
    return {
        'publish':      publish,
        'subscribe':    subscribe
    };
}