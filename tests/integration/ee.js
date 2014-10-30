// describe('Event Emitter', function(){

// 	describe('Emit Events', function(){

// 		it('should register for user updated event', function(){
// 			var eventName = tlUser.service.EVENTS().USER_UPDATED;
// 			eventName.should.equal('tl.user.updated');
// 			tlEventEmitter.on(eventName, function(event, user){
// 				console.log('User updated!');
// 				console.log(user);
// 			});
// 		});

// 		it('should recieve an event', function(done){
			
// 			var eventName = 'tl.event';

// 			tlEventEmitter.on(eventName, function(event, obj){
// 				console.log('event fired!');
// 				console.log(event);
// 				console.log(obj);
// 				obj.foo.should.equal('bar');
// 				done();
// 			});

// 			tlEventEmitter.emit(eventName, {
// 				foo: 'bar'
// 			});
// 		});
// 	});
// });