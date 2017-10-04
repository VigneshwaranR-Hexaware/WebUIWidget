'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */

define(['jquery', 'settings', 'apiService', 'utils'], function ($, config, apiService, utils) {

	$(function () {

		/* Web Popup Adjustment */
		function adjustPopups() {
			let msgboxh = $("div.header-popup").next().height();
			let chath = $("div.header-popup").next().next().height();
			let typetext = $("div.header-popup").next().next().next().height();
			let bodyh = $("body").height();
			let finalcalc = bodyh - (chath + typetext);
			let finalcss = 'calc(100%-' + finalcalc + 'px)';
			$("div.chat-body").css('height', 'calc(' + finalcalc + 'px)');
		}

		/*Query of when Web Popup=1 opens popup  window, hiding web headers*/
		let popup = window.location.search.substring(1).split("=");
		if (popup[1] == 1) {
			$("div.header-popup").addClass("hidden").slideUp("slow");
			adjustPopups();
		}
		else {
			$("div.header-popup").removeClass("hidden")
		}


		function sendMessage(refr, ev, textsm) {

			var text = refr.val() || textsm;
			if (text !== "") {
				refr.val('');
				refr.text('');
				//Calling ApiaiService call
				processor.askBot(text, function (error, html) {
					if (error) {
						alert(error); //change into some inline fancy display, show error in chat window.
					}
					if (html) {
						if (msg_container.hasClass('hidden')) { // can be optimimzed and removed from here
							msg_container.siblings("h1").addClass('hidden');
							msg_container.removeClass('hidden');
						}
						msg_container.append(html);
						utils.scrollSmoothToBottom($('div.chat-body'));

					}
				});
				ev.preventDefault();
			}
		}
		var chatKeyPressCount = 0;

		if (config.accessToken && config.chatServerURL) {
			var processor = apiService();
		}

		if (!processor) {
			throw new Error("Message processing manager is not defined!");
		}

		var msg_container = $("ul#msg_container");
		if (msg_container.find('li').length == 0) {
			msg_container.siblings("h1").removeClass('hidden');
		} else {
			msg_container.siblings("h1").addClass('hidden');
			msg_container.removeClass('hidden');
		}
		$("a#btn-send-message").click(function (e) {
			sendMessage($("#btn-input"), e);
		});
		//Chatbox Send message
		$("textarea#btn-input").keypress(function (e) {
			console.log('srinivasan');
			if (e.which == 13) {
				sendMessage($(this), e);
			}
		});

		//Quick Replies payload button Click
		$(document).on('click', '.QuickreplybtnPayload', function (e) {
			var payloadInput = $(this).data().quickrepliespayload;
			processor.askBot(payloadInput, function (error, html) {
				if (error) {
					console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
				}
				if (html) {
					msg_container.append(html);
					utils.scrollSmoothToBottom($('div.chat-body'));

				}
			});
			e.preventDefault();
		});

		$(document).on('click', '.cardresponsepayload', function (e) {
			var payloadInput = $(this).data().cardpayloadbutton;
			processor.askBot(payloadInput, function (error, html) {
				if (error) {
					console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
				}
				if (html) {

					msg_container.append(html);
					utils.scrollSmoothToBottom($('div.chat-body'));

				}
			});
			e.preventDefault();
		});

		$(document).on('click', '.caroselresponsepayload', function (e) {
			var payloadInput = $(this).data().carouselpayloadbutton;
			console.log('Button Payload' + payloadInput);
			processor.askBot(payloadInput, function (error, html) {
				if (error) {
					console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
				}
				if (html) {
					msg_container.append(html);
					utils.scrollSmoothToBottom($('div.chat-body'));

				}
			});
			e.preventDefault();
		});

        $(document).on('click', '.apiQuickreplybtnPayload', function (e) {
			var payloadInput = $(this).data().apiquickrepliespayload;
			processor.askBot(payloadInput, function (error, html) {
				if (error) {
					console.log("error occured while processing your Request") //change into some inline fancy display, show error in chat window.
				}
				if (html) {
					msg_container.append(html);

				}
			});
			e.preventDefault();
		}); 

        });
          
	});
  

		
		
		

    