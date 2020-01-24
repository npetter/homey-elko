const Homey = require('homey');

module.exports = class ESH316RFDriver extends Homey.Driver {

  // This method is called when a user is adding a device
  // and the 'list_devices' view is called
//	onPairListDevices( data, callback ) {
//		callback( null, [
//			{
//				name: 'Foo Device',
//				data: {
//					id: 'abcd1234567'
//				}
//			}
//		]);
//    }
    
    onInit(){
        this.log('Driver onInit called');
    }

    

}