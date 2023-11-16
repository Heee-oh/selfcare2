// # 시작 함수
// 해당파일제일 최하단에 실행함수 존재함.
const init = () => {
	// 버튼 이벤트 등록
	document.querySelector("#logout").addEventListener('click', onLogout);
}


// 로그아웃
const onLogout = async () => {
	let data = await fetch("/token/remove", {
		headers: { "Content-Type": "application/json" },
		method: "GET"
	})
	.then(res => res.json());

	if (data.result) {
		console.log("로그아웃 성공");
		alert("정상적으로 로그아웃이 되었습니다.");
		window.location.href='/';
	} else {
		console.log("로그아웃 실패");
	}
}

const getCookie = (cookieName) => {
	let cookieValue=null;
	if(document.cookie){
		let array=document.cookie.split((escape(cookieName)+'='));
		if(array.length >= 2){
			let arraySub=array[1].split(';');
			cookieValue=unescape(arraySub[0]);
		}
	}
	return cookieValue;
}

init();


// if(getCookie('logined') === 'true') {
// 	window.location.reload();
// 	// window.location.href='/home';
// } else {
// 	document.querySelector("#loading").classList.add('display_none');
// }