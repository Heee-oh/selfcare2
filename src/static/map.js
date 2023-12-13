window.onload = function () {
    handleRefresh();
};

function handleRefresh() {
    getData();
    // addBound(700);/
}

var map;
var marker;
var mapContainer;
var lat, lng;

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.009605246272, 127.26396485292), // 지도의 중심좌표
        level: 6 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption); 

const apikey = "516278585562686b3731556f6b7147";
const url = 'https://openapi.gg.go.kr/MindHealthPromotionCenter/';

async function getData() {
    try {
        const response = await fetch(url + '?SIGUN_CD=41550');
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }
        
        const xmlData = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "application/xml");
        handleXmlData(xmlDoc);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
const uniqueCenters = new Set(); // 중복을 방지하기 위한 Set 객체 생성
function handleXmlData(xmlDoc) {
    const rows = xmlDoc.querySelectorAll('row');

 

    const dataDiv = document.getElementById("mental");

    Array.from(rows).forEach(row => {
        const centerName = row.querySelector('CENTER_NM').textContent;
        
        // 중복된 센터명이 이미 처리되었다면 건너뛰기
        if (uniqueCenters.has(centerName)) {
            console.log(`중복된 센터명 발견: ${centerName}`);
            return;
        }


        const reprsntTel = row.querySelector('TELNO').textContent;
        const roadaddress = row.querySelector('REFINE_ROADNM_ADDR').textContent;
        console.log(`센터명: ${centerName}, 전화번호: ${reprsntTel}, 도로명 주소: ${roadaddress}`);

        const div = document.createElement("div");
        div.className = "mental-item";
        div.innerHTML = `<p><strong class="center-name">[센터명]: ${centerName}</strong><br><span class="tel">☎)전화번호: ${reprsntTel}</span><br>도로명 주소: ${roadaddress}</p>`;

        dataDiv.appendChild(div);

        // Set에 센터명 추가하여 중복 방지
        uniqueCenters.add(centerName);

        var imageSrc = "./static/icon/marker.png",
            imageSize = new daum.maps.Size(27, 40),
            imageOption = {offset: new daum.maps.Point(14, 28)};

        var latitude = row.querySelector('REFINE_WGS84_LAT').textContent;
        var longitude = row.querySelector('REFINE_WGS84_LOGT').textContent;
        var telno = reprsntTel;
        var address = roadaddress;

        addMarker(imageSrc, imageSize, imageOption, latitude, longitude, centerName, telno, address);
    });
}
getData();




if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, 
            lon = position.coords.longitude; 
        
        var locPosition = new kakao.maps.LatLng(lat, lon), 
            message = '<div style="padding:5px; border-radius: 5px;">현재 위치</div>'; 
        
        alert(locPosition);
        displayMarker(locPosition, message);
            
      });
    
} else { 
    
    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker(locPosition, message);
}

function displayMarker(locPosition, message) {

    
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    
    var iwContent = message, 
        iwRemoveable = true;

    
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
     
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경
    map.setCenter(locPosition);  
}


function addMarker(imageSrc, imageSize, imageOption, latitude, longitude, name, tel, address){
    var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imageOption,),
    markerPosition = new daum.maps.LatLng(latitude, longitude);
    var marker = new daum.maps.Marker({
        position: markerPosition,
        image: markerImage,
        clickable: true,
        zIndex: 7
    });
    marker.setMap(map);

		var content = "<div class='infowindow-container'>" +
		"<h5 class='mental-name font-weight-bold'>" + name + "</h5>" +
		"<p class='mental-info'>" +
		"<strong>주소:</strong> " + address + '<br>' +
		"<strong>전화번호:</strong> " + tel + '<br>' + "</p>" + "</div>";

					

    var iwContent = content,
        iwPosition = markerPosition,
        iwRemoveable = true;

    var infowindow = new daum.maps.InfoWindow({
        position: iwPosition,
        content: iwContent,
        removable: iwRemoveable,
        zIndex: 10
		
    });
    
    daum.maps.event.addListener(marker, 'click', function() {
	
	infowindow.open(map, marker);
	});
	

}


// function addBound(radius){
//     var bound = new daum.maps.Circle({
//         center: map.getCenter(),
//         radius: radius,
//         strokeweight: 5,
//         strokeColor: "#F7D358",
//         strokeOpacity: 0.5,
//         strokeStyle: 'solid',
//         fillColor: '#F7FE2E',
//         fillOpacity: 0.3,
//         zIndex: 1
//     });
//     bound.setMap(map)

//     daum.maps.event.addListener(map, 'dragstart', function(){
//         bound.setMap(null);
//     });
// }



function computeDistance (startCoords,destCoords){
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    var Radius = 6371;
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
                             Math.cos(startLatRads) * Math.cos(destLatRads) *
                             Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degrees){
    var radians = (degrees * Math.PI)/180;
    return radians;
}

//뭐 를 해 결 할 라 고 했 나 요 오 ~
// 키워드 입력에서 uncatch 제 컴퓨터에서 개인 서버 뛰어서 일단 해결방안 찾았습니다. 
// call
// 뭔 소 리 지 ~
// 개 인 컴 퓨 터 랑 저 기 랑 다 르 다?

// 서버 컴퓨터의 자료를 깃에 올리고 제 개인 컴퓨터에 같은 환경으로 서버 띄어서 에러 잡고 여기다가 해결하는 방식으로 하고있습니다. 
// 개 컴퓨터에서 오류 잡고 그 코드를 여기다가 옮기려 합니다. 
// OK
// 하 던 것 하 구 , 잠 깐 모 니 터 링 할 께 유 쏘 뤼 
// 넵 알겠습니다. 
