var amqp               =   require('amqp'),brokerConnection,exchange,queue;
module.exports  =   function(_C,undefined){    
    var firstOption         =   {
            host:                       _C.AMPQ_HOST,
            port:                       _C.AMPQ_PORT,
            login:                      _C.AMPQ_USER,
            password:                   _C.AMPQ_PASSWORD,
            connectionTimeout:          0,
            authMechanism:              'AMQPLAIN',
            vhost:                      '/',
            noDelay:                    true,
            ssl: { 
                    enabled : false
                }
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
        brokerConnection.queue(_C.RABBITMQ_QUEUE, { durable: true }, function(q) { 
            queue   =   q;
        });
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