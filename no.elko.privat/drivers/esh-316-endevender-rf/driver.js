const Homey = require('homey');

module.exports = class ESH316RFDriver extends Homey.Driver {

    onInit(){
        // Not sure if this file is even needed in my case. Athom documentation is sub-par.
        this.log('Driver onInit called');
    }

    

}