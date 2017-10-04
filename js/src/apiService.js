'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
function($, config, utils, messageTpl, cards, uuidv1){

	class ApiHandler{

		constructor(){
			this.options = {
				sessionId: uuidv1(),
				lang: "en"
			};
		}
        
		userSays(userInput, callback){

			callback(null, messageTpl.userplaintext({
				"payload": userInput,
				"senderName": config.userTitle,
				"senderAvatar": config.userAvatar,
				"time": utils.currentTime(),
				"className": 'pull-right'
			}));
		}

		askBot(userInput, callback){
			this.userSays(userInput, callback);

			this.options.query = userInput;
            let refr=this;
			$.ajax({
				type: "POST",
				url: config.chatServerURL + "query?v=20150910",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + config.accessToken
				},
				data: JSON.stringify(this.options),
				success: function(response) {
					let isCardorCarousel = false;
					let isImage = false;
					let isQuickReply = false;
					let isQuickReplyFromApiai = false;
					let imageUrl;
					//To find Card || Carousel
					let count = 0;
					let hasbutton;
					console.log(response);
					if(response.result.fulfillment.messages){
					for(let i in response.result.fulfillment.messages){
						if(response.result.fulfillment.messages[i].type == 0 ){
							let cardHTML = cards({
								"payload": response.result.fulfillment.messages[i].speech,
								"senderName": config.botTitle,
								"senderAvatar": config.botAvatar,
								"time": utils.currentTime(),
								"className": ''
							}, "plaintext");
							callback(null, cardHTML);
						}
						if(response.result.fulfillment.messages[i].type == 1){
							count = count + 1;
							hasbutton=(response.result.fulfillment.messages[i].buttons.length > 0) ? true :false;
							isCardorCarousel = true;           
						}
						if(response.result.fulfillment.messages[i].type == 2){
							isQuickReplyFromApiai = true;
						}
						if(response.result.fulfillment.messages[i].type == 3){
							isImage = true;
							imageUrl=response.result.fulfillment.messages[i].imageUrl;
						}
						if(response.result.fulfillment.messages[i].type == 4){
							console.log(response.result.fulfillment.messages[i])
							isQuickReply = (response.result.fulfillment.messages[i].payload.facebook.quick_replies.length > 0) ? true : false ;
							console.log(isQuickReply);
						}
					}
				}
				else{
					 let cardHTML = cards({
							"payload": response.result.fulfillment.speech,
							"senderName": config.botTitle,
							"senderAvatar": config.botAvatar,
							"time": utils.currentTime(),
							"className": ''
						}, "plaintext");
						callback(null, cardHTML);
						
					}
					//Carousel
					if(isCardorCarousel){
						if(count == 1){
							let cardHTML = cards({
								"payload": response.result.fulfillment.messages,
								"senderName": config.botTitle,
								"senderAvatar": config.botAvatar,
								"time": utils.currentTime(),
								"buttons":hasbutton,
								"className": ''
							}, "card");
							callback(null, cardHTML);
						} 
						else {
							let carouselHTML = cards({
								
									"payload": response.result.fulfillment.messages,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"buttons":hasbutton,
									"className": ''
								
							}, "carousel");
							callback(null, carouselHTML);
						
						}
					
					}
					//Image Response
					if(isImage){
							let cardHTML = cards({
								"payload": response.result.fulfillment.messages,
									"senderName": config.botTitle,
									"senderAvatar": config.botAvatar,
									"time": utils.currentTime(),
									"imgUrl": imageUrl
									
							}, "image");
						callback(null, cardHTML);
					
					}
					//CustomPayload Quickreplies
					if(isQuickReply){
						let cardHTML = cards({
							"payload": response.result.fulfillment.messages,
								"senderName": config.botTitle,
								"senderAvatar": config.botAvatar,
								"time": utils.currentTime(),
								"className": ''
						}, "quickreplies");
						callback(null, cardHTML);
						
					}
					//Apiai Quickreply
					if(isQuickReplyFromApiai){
						let cardHTML = cards({
                            "payload": response.result.fulfillment.messages,
							"senderName": config.botTitle,
							"senderAvatar": config.botAvatar,
							"time": utils.currentTime()							
							}, "quickreplyfromapiai");
						callback(null, cardHTML);
						
					}
				},
				error: function() {
					callback("Internal Server Error", null);
				}
			});
		}
	}

	return function(accessToken){
		return new ApiHandler();
	}
});