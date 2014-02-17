var os = require('os');
var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;
var BlenoCharacteristic = bleno.Characteristic;
var BlenoDescriptor = bleno.Descriptor;

if (os.platform() !== 'linux') {
  console.warn('this script only supports Linux!');
}

console.log('pseudo');

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);

  if (state === 'poweredOn') {
    bleno.startAdvertisingWithEIRData(new Buffer('0201061106d54e8938944fd483774f33f8d6851045041610c002', 'hex'),
                                      new Buffer('0809436869706f6c6f051219002d00020a04', 'hex'));
  } else {
    bleno.stopAdvertising();
  }
});

var stateCharacteristicNotifyCallback = null;

bleno.on('advertisingStart', function(error) {
  console.log('on -> advertisingStart ' + error);

  if (!error) {
    bleno.setServices([
      new BlenoPrimaryService({
        uuid: '180a',
        characteristics: [
          new BlenoCharacteristic({
            uuid: '2a23',
            properties: ['read'],
            // value: new Buffer('6d472200008cba1c', 'hex')
            onReadRequest: function(offset, callback) {
              console.log('2a23 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('6d472200008cba1c', 'hex'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a24',
            properties: ['read'],
            // value: new Buffer('MIII')
            onReadRequest: function(offset, callback) {
              console.log('2a24 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('MIII'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a25',
            properties: ['read'],
            // value: new Buffer('Chp112')
            onReadRequest: function(offset, callback) {
              console.log('2a25 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('Chp112'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a26',
            properties: ['read'],
            // value: new Buffer('1')
            onReadRequest: function(offset, callback) {
              console.log('2a26 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('1'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a27',
            properties: ['read'],
            // value: new Buffer('3a')
            onReadRequest: function(offset, callback) {
              console.log('2a27 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('3a'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a28',
            properties: ['read'],
            // value: new Buffer('1')
            onReadRequest: function(offset, callback) {
              console.log('2a28 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('1'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a29',
            properties: ['read'],
            // value: new Buffer('GEATRONIK')
            onReadRequest: function(offset, callback) {
              console.log('2a29 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('GEATRONIK'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a2a',
            properties: ['read'],
            // value: new Buffer('fe00436869706f6c6f', 'hex')
            onReadRequest: function(offset, callback) {
              console.log('2a2a onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('fe00436869706f6c6f', 'hex'));
            }
          }),
          new BlenoCharacteristic({
            uuid: '2a50',
            properties: ['read'],
            // value: new Buffer('010d0000001001', 'hex')
            onReadRequest: function(offset, callback) {
              console.log('2a50 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('010d0000001001', 'hex'));
            }
          })
        ]
      }),
      new BlenoPrimaryService({
        uuid: '6c1bd261c1b64f75842de452c05bec0c',
        characteristics: [
          new BlenoCharacteristic({
            uuid: 'fff1',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fff1 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('6d47228cba1c', 'hex')); // MyID
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff2',
            properties: ['write'],
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff2 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // DevID
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff3',
            properties: ['write'],
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff3 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // Code

              console.log('fff0 update 5');
              stateCharacteristicNotifyCallback(new Buffer('03', 'hex'));

              // if (data[6] === 0x00) {
              //   console.log('fff0 update e0');
              //   stateCharacteristicNotifyCallback(new Buffer('e0', 'hex'));
              // }
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff0',
            properties: ['read', 'notify'],
            onReadRequest: function(offset, callback) {
              console.log('fff0 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('10', 'hex')); // State
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff0 onSubscribe');

              stateCharacteristicNotifyCallback = updateValueCallback;
              
              console.log('fff0 (state) update 1');
              stateCharacteristicNotifyCallback(new Buffer('01', 'hex'));
            },
            onUnsubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff0 onUnsubscribe');
            }
          }),
          new BlenoCharacteristic({
            uuid: 'ffe0',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('ffe0 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('01', 'hex')); // Ctrl
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('ffe0 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // Ctrl
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff5',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fff5 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('1900', 'hex')); // ConnInt
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff5 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // ConnInt
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff6',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fff6 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('02', 'hex')); // Clr
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff6 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // Clr
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fffa',
            properties: ['read', 'notify'],
            onReadRequest: function(offset, callback) {
              console.log('fffa onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('cb', 'hex')); // Bat
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fffa onSubscribe');
            },
            onUnsubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fffa onUnsubscribe');
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fffe',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fffe onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('37', 'hex')); // TOset
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fffe onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // TOset
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fffc',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fffc onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('00', 'hex')); // SysCfg
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fffc onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // SysCfg
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fffd',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fffd onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('00', 'hex')); // SNFCfg
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fffd onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // SNFCfg
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff4',
            properties: ['write'],
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff4 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // ???
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff7',
            properties: ['read', 'write'],
            onReadRequest: function(offset, callback) {
              console.log('fff7 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('03', 'hex')); // ???
            },
            onWriteRequest: function(data, offset, withoutResponse, callback) {
              console.log('fff7 onWriteRequest: ' + data.toString('hex'));

              callback(BlenoCharacteristic.RESULT_SUCCESS); // ???
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff8',
            properties: ['read', 'notify'],
            onReadRequest: function(offset, callback) {
              console.log('fff8 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('17', 'hex')); // ??
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff8 onSubscribe');
            },
            onUnsubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff8 onUnsubscribe');
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fff9',
            properties: ['notify'],
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff9 onSubscribe');
            },
            onUnsubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fff9 onUnsubscribe');
            }
          }),
          new BlenoCharacteristic({
            uuid: 'fffb',
            properties: ['read', 'notify'],
            onReadRequest: function(offset, callback) {
              console.log('fffb onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('0000', 'hex')); // ??
            },
            onSubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fffb onSubscribe');
            },
            onUnsubscribe: function(maxValueSize, updateValueCallback) {
              console.log('fffb onUnsubscribe');
            }
          }),
          new BlenoCharacteristic({
            uuid: 'ffe1',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              console.log('ffe1 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('01', 'hex'));
            }
          }),
          new BlenoCharacteristic({
            uuid: 'ffe2',
            properties: ['read'],
            onReadRequest: function(offset, callback) {
              console.log('ffe1 onReadRequest');

              callback(BlenoCharacteristic.RESULT_SUCCESS, new Buffer('31', 'hex'));
            }
          })
        ]
      })
    ]);
  }
});

bleno.on('advertisingStop', function() {
  console.log('on -> advertisingStop');
});

bleno.on('servicesSet', function() {
  console.log('on -> servicesSet');
});
