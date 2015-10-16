angular
  .module('tl')
  .service('tl.feed.service', ['tl.service', 'tl.feed.resource',
    function(Service, Feed) {

      var FeedService = Service.extend(Feed);

      FeedService.prototype.create = function(options) {
        if (!options) throw new Error('FeedService.create - options is required');

        return Feed.create({}, options).$promise;
      };

      FeedService.prototype.remove = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.remove - feedId is required');
        options = options || {};

        options.id = feedId;

        return Feed.remove(options).$promise;
      };

      FeedService.prototype.list = function(options) {
        options = options || {};
        return Feed.list(options).$promise;
      };

      FeedService.prototype.listUserFeed = function(userId, options) {
        if (!userId) throw new Error('FeedService.listUserFeed - userId is required');
        options = options || {};

        options.userId = userId;

        return Feed.listUserFeed(options).$promise;
      };

      FeedService.prototype.addLike = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.addLike - feedId is required');

        return Feed.addLike({ id: feedId }, options).$promise;
      };

      FeedService.prototype.removeLike = function(feedId, options) {
        if (!feedId) throw new Error('FeedService.removeLike - feedId is required');

        return Feed.removeLike({ id: feedId }, options).$promise;
      };

      return new FeedService();
    }
  ]);
