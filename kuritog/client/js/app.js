var liaWithEditOrDeleteOnClick = function (Receipt, callback) {
	var $ReceiptListItem = $("<li>").text(Receipt.description),
		$ReceiptEditLink = $("<a>").attr("href", "Receipts/" + Receipt._id),
		$ReceiptRemoveLink = $("<a>").attr("href", "Receipts/" + Receipt._id);

	$ReceiptEditLink.addClass("linkEdit");
	$ReceiptRemoveLink.addClass("linkRemove");



	if (Receipt.status === 'В желаемом') {
		$ReceiptEditLink.text("Играть");
		$ReceiptEditLink.on("click", function() {

			var newDescription = Receipt.description + "Сыграно";

			if (newDescription !== null && newDescription.trim() !== "") {
				$.ajax({
					"url": "/Receipts/" + Receipt._id,
					"type": "PUT",
					"data": { "description": newDescription, "status": 'Куплено'},
				}).done(function (responde) {
					Receipt.status = 'Сыграно';
					callback();
				}).fail(function (err) {
					console.log("Произошла ошибка: " + err);
				});
			}

			return false;
		});	
		$ReceiptListItem.append($ReceiptEditLink);
	}
	else {
		$ReceiptRemoveLink.text("Удалить из списка");
		$ReceiptRemoveLink.on("click", function () {
			$.ajax({
				url: "/Receipts/" + Receipt._id,
				type: "DELETE"
			}).done(function (responde) {
				callback();
			}).fail(function (err) {
				console.log("error on delete 'Receipt'!");
			});
			return false;
		});
		$ReceiptListItem.append($ReceiptRemoveLink);
	}

	return $ReceiptListItem;
}

var main = function (ReceiptObjects) {
	"use strict";
	var tabs = [];
	
	tabs.push({
		"name": "История игр",

		"content": function(callback) {
			$.getJSON("Receipts.json", function (ReceiptObjects) {
				var $content = $("<ul>");
				for (var i = ReceiptObjects.length-1; i>=0; i--) {
					var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function() {
						$(".tabs a:first-child span").trigger("click");
					});
					$content.append($ReceiptListItem);
				}
				callback(null, $content);
			}).fail(function (jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});
	tabs.push({
		"name": "Список желаемого",
		"content": function(callback) {
			$.getJSON("Receipts.json", function (ReceiptObjects) {
				var $content, i;
				$content = $("<ul>");
				for (i = 0; i < ReceiptObjects.length; i++) {
					if (ReceiptObjects[i].status === 'В желаемом') {
						var $ReceiptListItem = liaWithEditOrDeleteOnClick(ReceiptObjects[i], function() {
							$(".tabs a:nth-child(2) span").trigger("click");
						});
						$content.append($ReceiptListItem);
					}
				}
				callback(null, $content);
			}).fail(function(jqXHR, textStatus, error) {
				callback(error, null);
			});
		}
	});

	tabs.push({
		"name": "Добавить в желаемое",
		"content":function () {
			$.get("Receipts.json", function (ReceiptObjects) {	
				$("main .content").append($place);
					var $place = $("<h3>").text("Введите название игры: "),
						$input = $("<input>").addClass("description"),
						$place2 = $("<h3>").text("Введите ссылку на сайт игры: "),
						$input2 = $("<input>").addClass("gamelink"),
						$button = $("<button>").text("Добавить"),
						$content1 = $("<ul>"),
						$content2 = $("<ul>");

				$content1.append($input);
				$content2.append($input2);
				$("main .content").append($place);
				$("main .content").append($content1);
				$("main .content").append($place2);
				$("main .content").append($content2);
				$("main .content").append($button); 

				
				function btnfunc() {
					var description = ('Название: ' + $input.val() + ' ;    Ссылка: ' + $input2.val() +' '),
										linkgame = ($input2.val()),
						newReceipt = {"description":description, "status": 'В желаемом', "gamelink":linkgame};
					$.post("Receipts", newReceipt, function(result) {
						$input.val("");
						$(".tabs a:first-child span").trigger("click");
					});
				}
				$button.on("click", function() {
					btnfunc();
				});
				$input.on('keydown',function(e){
					if (e.which === 13) {
						btnfunc();
					}
				});
			});
		}
	});

	tabs.push ({
		"name": "Выйти",
		"content":function() {
			document.location.href = "/index.html";
		}
	});

	tabs.forEach(function (tab) {
		var $aElement = $("<a>").attr("href",""),
			$spanElement = $("<span>").text(tab.name);
		$aElement.append($spanElement);
		$("main .tabs").append($aElement);

		$spanElement.on("click", function () {
			var $content;
			$(".tabs a span").removeClass("active");
			$spanElement.addClass("active");
			$("main .content").empty();
			tab.content(function (err, $content) {
				if (err !== null) {
					alert ("Возникла проблема при обработке запроса: " + err);
				} else {
					$("main .content").append($content);
				}
			});
			return false;
		});
	});

	$(".tabs a:first-child span").trigger("click");
}

$(document).ready(function() {
	$.getJSON("Receipts.json", function (ReceiptObjects) {
		main(ReceiptObjects);
	});
});
