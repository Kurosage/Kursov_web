var main = function (UsersObjects) {
	var asdf = 0;
	"use strict";
	var $input = $("<input placeholder='имя пользователя'>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрировать"),
		$butDestroy = $("<button>").text("Удалить");

	$butRegister.on("click", function() {
		var username = $input.val();

		var example = /^[а-я]{3,20}(?<!000)$/ui;
		console.log(username);
		var check = example.test(username); 
		console.log(check);

		if (check) {
			if (username !== null && username.trim() !== "") {
				var newUser = {"username": username};
				$.post("users", newUser, function(result) {
					console.log(result);
					UsersObjects.push(newUser);
				}).done(function(responde) {
					console.log(responde);
					alert('Аккаунт создан');
					$butLogin.trigger("click");
				}).fail(function(jqXHR, textStatus, error) {
					console.log(error);
					if (jqXHR.status === 501) {
						alert("Такой пользователь уже зарегестрирован\nВведите другое имя пользователя");
					} else {					
						alert("Произошла ошибка\n"+jqXHR.status + " " + jqXHR.textStatus);	
					}
				});
			}
		}
		else {
			alert('Имя пользователя должен состоять из строчных букв и быть длиной не больше 20 символов\nПовторите ввод')
			$input.val("");
		}
	});
	$butDestroy.on("click", function() {
		if ($input.val() !== "") {
			if ($input.val() !== null && $input.val().trim() !== "") {
				var username = $input.val();
				
					$.ajax({
						'url': '/users/'+username,
						'type': 'DELETE',
					}).done(function(responde) {
						console.log(responde);
						$input.val("");
						alert('Пользователь удален');
					}).fail(function(jqXHR, textStatus, error) {
						console.log(error);
						alert("Произошла ошибка\n"+jqXHR.status + " " + jqXHR.textStatus);	
					});
				}
			
		}
	});

	$("main .authorization").append($input);
	$("main .authorization").append($butDestroy);
	 $("main .authorization").append($butRegister);


	 

}

$(document).ready(function() {
	sessionStorage.setItem('key', 'value');
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});