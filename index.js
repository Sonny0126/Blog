///////////////////
///   LEFTUP    ///
///////////////////
// ✅ 밤낮 조절 버튼 기능
const switchButton = document.getElementById('switch');//switch ID를 받아와서 상수 만듬
const switchImg = document.getElementById('switch-img');//switch-img를 수정하는 switchImg 만듬
const body = document.body;

// 페이지가 로드되면 날씨 데이터를 가져오고 달력 표시
window.onload = () => {
  // 사용자의 현재 위치에서 날씨 정보 가져오기
  navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeatherForDate(lat, lon, new Date()); // 현재 위치와 날짜로 날씨 정보 가져오기
  });
};

switchButton.addEventListener('click', () => {//밤일 때 전구 불 On, 낮일 때 전구 불 Off
    const isNight = switchImg.getAttribute('src') === 'image/off.png';
    body.style.backgroundImage = isNight ? "url('image/Night.png')" : "url('image/Day.png')";
    switchImg.setAttribute('src', isNight ? 'image/on.png' : 'image/off.png');
});

//객체를 만들어서 button ID를 해당 URL에 각각 매핑
const pageLinks = {
    button1: 'https://sonny0126.github.io/Web/',
    button2: 'https://sonny0126.github.io/BitFlow/',
    button3: 'https://www.notion.so/Son-e53d58b3025f42d68700120ed5c20715',
    button4: 'https://blog.naver.com/chewypig'
};

// //키 값들을 불러와서 배열로가져와서 클릭 이벤트 추가
// Object.keys() 정적 메서드는 주어진 객체 자체의 열거 가능한 문자열 키를 가진 속성들의 이름을 배열로 반환합니다.
Object.keys(pageLinks).forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        window.location.href = pageLinks[id];
    });
});

//////////////////
///  calendar  ///
//////////////////
// ✅ 달력 기능
const calendarTitle = document.getElementById('calendarTitle');
const prevBtn = document.getElementById('prevBtn'); //이전 버튼
const nextBtn = document.getElementById('nextBtn'); //다음 버튼
const days = document.querySelector('.days'); //날들
const selected = document.querySelector('.selected'); //선택한 날들
const weatherData = {}; // 날씨 데이터를 저장할 객체

let dateToday = new Date();
let year = dateToday.getFullYear(); //년도
let month = dateToday.getMonth(); //달

// 날씨 정보 가져오기
function getWeatherForDate(lat, lon, date) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 날씨 정보를 날짜별로 저장
            data.list.forEach(item => {
                const forecastDate = item.dt_txt.split(" ")[0];
                if (!weatherData[forecastDate]) {
                    weatherData[forecastDate] = {
                        description: item.weather[0].description,
                        temp: item.main.temp,
                    };
                }
            });
            displayCalendar(); // 날씨 정보를 가져온 후 달력 표시
        })
        .catch(error => console.error("주간 날씨 데이터를 가져오는 데 실패했습니다.", error));
}

function displayCalendar() {
    const firstDay = new Date(year, month, 1); //첫째 날
    const firstDayIdx = firstDay.getDay(); // 이번 달 1일의 요일
    const lastDay = new Date(year, month + 1, 0); // 이번 달의 마지막 날짜
    const numberOfDays = lastDay.getDate(); //이번 달의 날짜 개수

    calendarTitle.innerText = dateToday.toLocaleString('ko-KR', {
        year: "numeric",
        month: "long",
        timeZone: 'Asia/Seoul'
    });

    days.innerHTML = '';

    for (let x = 0; x < firstDayIdx; x++) {
        let div = document.createElement('div');
        div.classList.add('empty');
        days.appendChild(div);
    }

    for (let x = 1; x <= numberOfDays; x++) {
        let div = document.createElement('div');
        let currentDate = new Date(year, month, x);
        div.dataset.date = currentDate.toDateString();
        div.innerText = x;
        div.classList.add('day');

        // 오늘 날짜
        if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getDate() === new Date().getDate()
        ) {
            div.classList.add('current-date'); //오늘 날짜
        }

        // 날씨 정보 추가
        const dateString = currentDate.toDateString();
        if (weatherData[dateString]) {
            const weatherDesc = weatherData[dateString].description;
            const temp = weatherData[dateString].temp;
            div.innerHTML += `<br>🌤 ${weatherDesc}, ${temp}°C`;
        }

        days.appendChild(div);
    }

    setupDateSelection();
}

// 날짜 클릭 시 선택한 날짜 표시
function setupDateSelection() {
    document.querySelectorAll('.days .day').forEach(day => {
        day.addEventListener('click', (e) => {
            selected.innerText = `Date: ${e.target.dataset.date}`;
        });
    });
}

// 이전, 다음 버튼 클릭 시 달력 변경
prevBtn.addEventListener('click', () => {
    month = month === 0 ? 11 : month - 1;
    if (month === 11) year -= 1;
    displayCalendar();
});

nextBtn.addEventListener('click', () => {
    month = month === 11 ? 0 : month + 1;
    if (month === 0) year += 1;
    displayCalendar();
});

///////////////////
/// To-do-List  ///
///////////////////

const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn'); // 추가 버튼 선택

const savedTodoList =JSON.parse(localStorage.getItem('saved-items'));
console.log(savedTodoList);

if(savedTodoList){//로컬데이터가 존재하면 실행
  for(let i=0; i<savedTodoList.length; i++){
    createTodo(savedTodoList[i]);
  }
}

function keyCodeCheck(event) { // 엔터키로 추가
  if (event.key === "Enter" && todoInput.value.trim() !== '') {
      createTodo();
  }
}

addBtn.addEventListener('click', () => { // + 버튼으로 추가
  if(todoInput.value !== ''){ // 빈 값 입력 방지
      createTodo();
  }
})


function createTodo(storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
    todoContents = storageData.contents;
  }

  const todoList = document.querySelector('#todoList');
  const newLi = document.createElement('li'); 
  const newCheckbox = document.createElement('input'); // 체크박스 생성
  newCheckbox.type = 'checkbox'; // 체크박스 설정
  newCheckbox.classList.add('todo-checkbox'); 
  const newSpan = document.createElement('span'); // 할 일 텍스트
  const deleteAll = document.querySelector('.delete-btn-wrap');

  newLi.appendChild(newCheckbox); // li 안에 체크박스 추가
  newLi.appendChild(newSpan); // li 안에 span 추가

  newSpan.textContent = todoContents; // span 안에 value값 담기

  todoList.appendChild(newLi);

  todoInput.value = ''; // 입력 필드 초기화

  // ✅ 체크박스 클릭 시 완료 표시 (complete 클래스 추가)
  newCheckbox.addEventListener('change', () => {
    newLi.classList.toggle('complete', newCheckbox.checked);
    saveItemsFn();
  });

  // ✅ 더블 클릭 시 삭제
  newLi.addEventListener('dblclick', () => {
    newLi.remove();
    saveItemsFn();
  });

  // ✅ 기존 데이터가 있을 경우 체크박스 상태 유지
  if (storageData && storageData.complete === true) {
    newLi.classList.add('complete');
    newCheckbox.checked = true;
  }

  saveItemsFn();
}


  //전체 삭제버튼
  function deleteAll(){
    document.querySelectorAll('#todoList li').forEach(li => li.remove());
    saveItemsFn();
  }

  //로컬에 데이터 저장하기
  function saveItemsFn(){
    const saveItems=[];
    for(let i=0; i<todoList.children.length; i++){
      const todoObj ={
        contents: todoList.children[i].querySelector('span').textContent, //리스트 목록
        complete: todoList.children[i].classList.contains('complete')//완료 표시된 리스트
      };
      saveItems.push(todoObj); //배열 추가
    }


   if (saveItems.length === 0) { // 데이터가 없다면 값 삭제
        localStorage.removeItem('saved-items')
    }else{
        localStorage.setItem('saved-items', JSON.stringify(saveItems));
    }
  }

///////////////////
///   MUSIC   /////
///////////////////

// 유튜브 IFrame API 동적으로 로드하는 함수
function loadYouTubeAPI() {
  const script = document.createElement('script');
  script.src = 'https://www.youtube.com/iframe_api'; // 유튜브 API 스크립트 URL
  document.head.appendChild(script); // 헤드에 스크립트 추가
}

// 유튜브 플레이어를 초기화하는 함수
let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('youtubePlayer', {
      height: '200',
      width: '100%',
      videoId: 'hxktjr-wQa0', // 유튜브 영상 ID // 한로로 노래 클립
      playerVars: {
          'playsinline': 1,
          'controls': 0, // 컨트롤러 숨김
          'showinfo': 0,
          'modestbranding': 1
      }
  });
}

// 재생/정지 버튼 처리
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('Btnimage').addEventListener('click', () => {
      const buttonImage = document.getElementById('Btnimage');

      if (player.getPlayerState() !== 1) { // 재생 중이 아니면 실행
          player.playVideo();
          buttonImage.src = "image/pause.png"; // 재생 버튼을 일시 정지 버튼으로 변경
      } else { // 이미 재생 중이면 멈춤
          player.pauseVideo();
          buttonImage.src = "image/play.png"; // 일시 정지 버튼을 재생 버튼으로 변경
      }
  });

  // 유튜브 API 스크립트 로드
  loadYouTubeAPI();
});


//날씨 데이터 추가
const API_KEY = "6083dd2094c41abda26c43af65c3f9a5";

function getWeather() {
    navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const weatherDesc = data.weather[0].description;
                const temp = data.main.temp;
                document.querySelector("#weather").innerText = `🌤 ${weatherDesc}, ${temp}°C`;
            })
            .catch(error => console.error("날씨 정보를 가져오는 데 실패했습니다.", error));
    });
}

function getWeeklyWeather() {
  navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              const weatherByDate = {};
              data.list.forEach(item => {
                  const date = item.dt_txt.split(" ")[0];
                  if (!weatherByDate[date]) {
                      weatherByDate[date] = item;
                  }
              });

              document.querySelectorAll(".day").forEach(day => {
                  const date = day.dataset.date.split(" ")[0];
                  if (weatherByDate[date]) {
                      const weatherDesc = weatherByDate[date].weather[0].description;
                      const temp = weatherByDate[date].main.temp;
                      day.innerHTML += `<br>🌤 ${weatherDesc}, ${temp}°C`;
                  }
              });
          })
          .catch(error => console.error("주간 날씨 데이터를 가져오는 데 실패했습니다.", error));
  });
}