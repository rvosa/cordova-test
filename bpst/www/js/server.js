// imports
var http       = require('http');
var urlparser  = require('url');
var mongojs    = require('mongojs');
var os         = require('os');

// addresses and ports
var ip_http    = getIP();
var port_http  = '8080';
var ip_mongo   = '127.0.0.1';
var port_mongo = '27017';

// database handle
var mongo_uri  = 'mongodb://' + ip_mongo + ':' + port_mongo + '/babyphone';
var db = mongojs.connect(mongo_uri, [ 'sessions' ]);

// instantiate server
http.createServer(function (req, res) {
    console.log('Incoming request from '+req.connection.remoteAddress);
	
	// parse url to get session ID
	var parsed = urlparser.parse(req.url,true);
	var session_id = parsed.pathname.substring(1);
	
	// emit response containing the previous event in this session
	emitResponse(session_id,res,req);
	
	// store current event in this session
	persistEvent(session_id,parsed.query,req);
}).listen( port_http, ip_http );
console.log('Server running at http://'+ip_http+':'+port_http+'/');

function persistEvent (session_id,query,req) {
	if ( query.action != 'ping' ) {
		db.sessions.insert({
			role:    query.role,
			session: session_id,
			time:    new Date(),
			action:  query.action
		});
		console.log('Persisted '+query.action+' event from '+query.role);
	}
}

function emitResponse(session_id,res,req) {
    console.log("going to emit response");

	db.sessions.find( { 'session' : session_id },
		function (err,records) {

			// write header
			res.writeHead(200, {
				'Access-Control-Allow-Origin' : '*',
				'Content-Type' : 'text/plain'
			});		
		
			// no previous records found, emit empty object
			if ( err || !records.length ) {
				res.write('{}');
				console.log("no records found!");
			}
			
			// found records, emit last seen
			else {
				var i = records.length - 1;
				res.write(JSON.stringify(records[i]));
                console.log("returned record "+i+" in session "+session_id);
			}
			res.end();
		}	
	);
}

function getIP() {
    var ifaces = os.networkInterfaces();
    var ip;
    for ( var dev in ifaces ) {
        var alias = 0;
        ifaces[dev].forEach(function(details){
            if ( details.family == 'IPv4' ) {
                console.log(dev+(alias?':'+alias:''),details.address);
                ++alias;
                ip = details.address;
            }
        });
    }
    return ip;
}
