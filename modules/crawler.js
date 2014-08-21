module.exports  =   function(_C,connection,broker,undefined){
    var extractor   =   require('email-extractor').Extractor;
    var EventBot    =   require('./eventBot');
    var $           =   require('simply-deferred');
    var Deferred    =   $.Deferred;
    var swig        =   require('swig');

    
    function countEmailByUrl(email,url){
        var dfr =   new Deferred;
        EventBot.count({'url':url,'email':email}, function(err,counter){
                if (err){
                    dfr.reject();
                } else {
                    dfr.resolve(counter);
                }
        });              
        return dfr;
    }
    
    function getLastSent(email){
        var dfr =   new Deferred;
        
        EventBot.find({'email':email}).sort([['date','descending']]).limit(1).exec(function (err,records){
            if (err){
                dfr.reject();
            } else if (records.length !== 0) {
                dfr.resolve(new Date(records[0]['date']));
            } else {
                dfr.resolve(new Date(0));
            }
        });
        return dfr;
    }
    
    
    function invite(email,url){
        var headers  = "MIME-Version: 1.0" + "\r\n";
        headers     += "Content-type:text/html;charset=UTF-8" + "\r\n";
        headers     += _C.HEADER_FROM  + "\r\n";
        headers     += _C.HEADER_RETURN_PATH + "\r\n";
        headers     += "To: " + email + "\r\n";

        var content =   {
            'to'        :   email,
            'subject'   :   _C.EMAIL_SUBJECT,
            'body'      :   swig.renderFile('./template/invite.html'),
            'headers'   :   headers
        };
        
        broker.publish(JSON.stringify(content));
        var event   =   new EventBot({'email':email,'url':url});
        event.save(function (err,reply){
            if (err){
                console.log(err);
            }
        });
    }
    
    return function(startUrl){
        return extractor(startUrl,function (url,email){
            $.when( countEmailByUrl(email,url),
                    getLastSent(email)
                    ).done(function(byUrlCounter,date){
                        var decision    =   byUrlCounter === 0 && ( ( (new Date).getTime() - date.getTime() ) >= _C.TIME_THRESHOLD );
                        if (decision){
                            invite(email,url);
                        }
                    });
        });        
    }
}