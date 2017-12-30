var SerialPort = require( 'serialport' );
var readlineLib = require( 'readline' );

// first argument needs to be name of serial port to use
// use showPorts.js to figure out which port to use
var portName = process.argv[ 2 ];

// get serial port object
var port = new SerialPort( portName
                         , { autoOpen: true
						   , baudRate: 115200
						   }
						 );

// line-by-line parsing of console input and output
var rl = readlineLib.createInterface( process.stdin
								    , process.stdout 
								    );

// handle basic serial port events
port.on( 'open', showPortOpen )
	.on( 'close', showPortClose )
	.on( 'error', showError );

// accept input from console one line at a time
rl.on( 'line', writeSerialData );

// allocate a buffer to put ascii output into
var writebuf = new Buffer( 256 );

function writeSerialData( data ) {
	dta = data.trim();
	if ( "quit" == dta ) {
		port.close();
	} else {
		writebuf.write( dta + "\r", 'ascii' );
		port.write( writebuf );
	}
}

function showPortOpen() {
   console.log( 'port open. Data rate: ' + port.baudRate );
   console.log( 'Enter "quit" to stop this program' );
   port.write( "\r" ); // elicit a prompt from GRBL
   // handle input from GRBL now that port is open
   port.on( 'data', readSerialData );
}

function readSerialData( data ) {
	// the data received here is not parsed into lines
	// may consist of multiple and/or partial lines
   process.stdout.write( data.toString( 'ascii' ) );
}

function showPortClose() {
   console.log( 'port closed.' );
   process.exit( 0 );
}

function showError( error ) {
   console.log( 'Serial port error: ' + error );
}
