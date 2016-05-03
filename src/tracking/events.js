
angular
	.module('tl')
	.constant('TRACK_EVENTS', {
		
		// User
		UserVerifiedPhoneNumber: "TLUserPhoneVerified",
		UserUpdatedProfilePicture: "TLUserUpdatedProfilePicture",
		UserCompletedProfile: "TLUserCompletedProfile",

		// City
		CityViewed: "TLCityViewed",
		CityFeaturedViewed: "TLCityFeaturedViewed",
		CityTonightViewed: "TLCityTonightViewed",
		CityThisWeekViewed: "TLCityThisWeekViewed",
		CityApplied: "TLCityApplied",
		CityShared: "TLCityShared",

		// Venues
		VenueViewed: "TLVenueViewed",
		VenueInfoViewed: "TLVenueInfoViewed",
		VenueContactViewed: "TLVenueContactViewed",
		VenueMapViewed: "TLVenueMapViewed",
		VenueAppliedForAccess: "TLVenueAppliedForAccess",

		// Events
		EventViewed: "TLEventViewed",

		// Booking Flow
		BookingInventoryViewed: "TLBookingInventoryViewed",
		BookingAddBottlesViewed: "TLBookingAddBottlesViewed",
		BookingInfoViewed: "TLBookingInfoViewed",
		BookingReviewViewed: "TLBookingReviewViewed",
		BookingTermsViewed: "TLBookingTermsViewed",
		BookingComplete: "TLBookingComplete",
		BookingReservationComplete: "TLBookingReservationComplete",
		BookingPromoterComplete: "TLBookingPromoterComplete",
		BookingFailed: "TLBookingFailed",
		BookingReservationFailed: "TLBookingReservationFailed",
		BookingAddedToPassbook: "TLBookingAddedToPassbook",
		BookingInquiryViewed: "TLBookingInquiryViewed",
		BookingInquirySubmitted: "TLBookingInquirySubmitted",

		// Booking Join Flow
		BookingJoinPending: "TLBookingJoinPending",
		BookingJoinAccepted: "TLBookingJoinAccepted",
		BookingJoinCodeSent: "TLBookingJoinCodeSent",

		// Booking Review
		BookingReviewSubmitted: "TLBookingReviewSubmitted",

		// Membership
		MembershipInfoViewed: "TLMembershipInfoViewed",
		MembershipApplyViewed: "TLMembershipApplyViewed",
		MembershipCheckoutViewed: "TLMembershipCheckoutViewed",
		MembershipSubscribed: "TLMembershipSubscribed",
		MembershipUnsubscribed: "TLMembershipUnsubscribed",

		// Favorites
		FavoritedVenue: "TLFavoritedVenue",
		FavoritedEvent: "TLFavoritedEvent",

		// Referral
		ReferralEntered: "TLReferralEntered",
		ReferralSentFB: "TLReferralSentFB",
		ReferralSentTW: "TLReferralSentTW",
		ReferralSentSMS: "TLReferralSentSMS",
		ReferralSentEmail: "TLReferralSentEmail",

		// SMS
		SMSDownloadLinkRequested: "TLSMSDownloadLinkRequested",

		// Payment
		PaymentAdded: "TLPaymentAdded",
		PaymentUpdated: "TLPaymentUpdated",
		PaymentInfoError: "TLPaymentInfoError",

		// Promo Code
		CodeRedeemed: "TLPromoCodeRedeemed",

		// Rewards
		RewardViewed: "TLRewardViewed",
		RewardRedeemed: "TLRewardRedeemed",

		// About Us
		AboutBlogViewed: "TLAboutBlogViewed",
		AboutFacebookViewed: "TLAboutFacebookViewed",
		AboutTwitterViewed: "TLAboutTwitterViewed",
		AboutWebsiteViewed: "TLAboutWebsiteViewed",

		// Easter Eggs
		EasterEggAccountProfilePicture: "TLEasterEggAccountProfilePicture",

		// Inventory Search
		InventorySearched : "TLInventorySearched",
		InventorySearchResultSelected : "TLInventorySearchResultSelected",
	});
