describe('Event Emitter', function(){

	describe('Emit Events', function(){

		it('should recieve an event', function(done){
			
			var eventName = 'tl.event';

			tlEventEmitter.on(eventName, function(event, obj){
				console.log('event fired!');
				console.log(event);
				console.log(obj);
				obj.foo.should.equal('bar');
				done();
			});

			tlEventEmitter.emit(eventName, {
				foo: 'bar'
			});
		});
	});
});