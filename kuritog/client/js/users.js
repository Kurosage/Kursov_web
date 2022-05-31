var main = function (UsersObjects) {
	var asdf = 0;
	"use strict";
	var $input = $("<input placeholder='имя пользователя'>").addClass("username"),
		$butRegister = $("<button>").text("Зарегистрироваться"),
		$butLogin = $("<button>").text("Войти");

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

	$butLogin.on("click", function() {
		var username = $input.val();
		if (username !== null && username.trim() !== "") {
			var loginUser = {"username": username};
			
			$.ajax({
				'url': '/users/'+username,
				'type': 'GET'
			}).done(function(responde) {
				window.location.replace('users/' + username + '/');
			}).fail(function(jqXHR, textStatus, error) {
				console.log(error);
				alert("Произошла ошибка\n"+jqXHR.status + " " + jqXHR.textStatus);	
			});
		}
	});
	$("main .authorization").append($input);
	$("main .authorization").append($butLogin);
	$("main .authorization").append($butRegister);

}

$(document).ready(function() {
	sessionStorage.setItem('key', 'value');
	$.getJSON("users.json", function (UsersObjects) {
		main(UsersObjects);
	});
});