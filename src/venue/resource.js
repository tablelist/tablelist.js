
angular
	.module('tl')
	.factory('tl.venue.resource', ['tl.resource', function(resource){
		return resource('/venue/:id', {
			id: '@id',
			itemId: '@itemId',
			imageId: '@imageId'
		}, {
			create: { method: 'POST' },
			update: { method: 'PUT' },
			query: {
				method: 'GET',
				url: '/venue',
				isArray: true
			},
			queryAdmin: {
				method: 'GET',
				url: '/venue',
				isArray: true
			},
			schedule: {
				method: 'GET',
				url: '/venue/:id/schedule',
			},
			updateSchedule: {
				method: 'PUT',
				url: '/venue/:id/schedule',
			},

			/* Inventory */
			listInventory: {
				method: 'GET',
				url: '/venue/:id/inventory',
				isArray: false
			},

			listInventoryAdmin: {
				method: 'GET',
				url: '/venue/:id/inventory/admin',
				isArray: false
			},

			readInventory: {
				method: 'GET',
				url: '/venue/:id/inventory/:tableId',
				isArray: false
			},

			addInventory: {
				method: 'POST',
				url: '/venue/:id/inventory',
				isArray: false
			},

			updateInventory: {
				method: 'PUT',
				url: '/venue/:id/inventory/:tableId',
				isArray: false
			},

			/* Events */
			listEvents: {
				method: 'GET',
				url: '/venue/:id/event',
				isArray: true
			},

			// listEventsAdmin: {
			// 	method: 'GET',
			// 	url: '/venue/:id/event/admin',
			// 	isArray: false
			// },

			// readEvent: {
			// 	method: 'GET',
			// 	url: '/venue/:id/event/:tableId',
			// 	isArray: false
			// },

			addEvent: {
				method: 'POST',
				url: '/event/',
				isArray: false
			},

			// updateEvent: {
			// 	method: 'PUT',
			// 	url: '/venue/:id/event/:tableId',
			// 	isArray: false
			// },

			/* Items */
			listItems: {
				method: 'GET',
				url: '/venue/:id/item',
				isArray: true
			},
			addItem: {
				method: 'POST',
				url: '/venue/:id/item'
			},
			updateItem: {
				method: 'PUT',
				url: '/venue/:id/item/:itemId'
			},
			deleteItem: {
				method: 'DELETE',
				url: '/venue/:id/item/:itemId'
			},

			/* Staff */
			listStaff: {
				method: 'GET',
				url: '/venue/:id/user',
				isArray: true
			},
			addStaff: {
				method: 'POST',
				url: '/venue/:id/user',
				isArray: true
			},
			updateStaff: {
				method: 'PUT',
				url: '/venue/:id/user/:userId',
				isArray: true
			},
			removeStaff: {
				method: 'DELETE',
				url: '/venue/:id/user/:userId',
				isArray: true
			},

			/* Images */
			listImages: {
				method: 'GET',
				url: '/venue/:id/image',
				isArray: true
			},
			addImage: {
				method: 'POST',
				url: '/venue/:id/image',
				isArray: true
			},
			deleteImage: {
				method: 'DELETE',
				url: '/venue/:id/image/:imageId',
				isArray: true
			},
			setPrimaryImage: {
				method: 'PUT',
				url: '/venue/:id/image/:imageId',
				isArray: true
			},
		});
	}]);