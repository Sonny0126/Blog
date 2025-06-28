//3자 쿠키
document.cookie = "myCookie=value; path=/; Secure; SameSite=None";

///////////////////
///   LEFTUP    ///
///////////////////
// ✅ 밤낮 조절 버튼 기능
const switchButton = document.getElementById('switch');//switch ID를 받아와서 상수 만듬
const switchImg = document.getElementById('switch-img');//switch-img를 수정하는 switchImg 만듬
const body = document.body;

window.onload = () => { //이미지가 완전히 로드된 이후에 내부에 배경을 깔고, 켈린더 표시
    body.style.backgroundImage = "url('image/Day.png')";
};

switchButton.addEventListener('click', () => {
    const isNight = switchImg.getAttribute('src') === 'image/off.png';
    
    // 상태 전환
    body.style.backgroundImage = isNight ? "url('image/Day.png')" : "url('image/Night.png')";
    switchImg.setAttribute('src', isNight ? 'image/on.png' : 'image/off.png');
});


//객체를 만들어서 button ID를 해당 URL에 각각 매핑
const pageLinks = {
    button1: 'https://sonny0126.github.io/Liverpool/',
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

///////////////////
/// To-do-List  ///
///////////////////

const todoInput = document.querySelector('#todoInput');
const addBtn = document.querySelector('#addBtn');
const todoList = document.querySelector('#todoList');

const savedTodoList = JSON.parse(localStorage.getItem('saved-items')) || [];

// 🔁 selected-date-events 병합 없이 saved-items만 기준으로
if (savedTodoList.length > 0) {
  savedTodoList.forEach(todo => createTodo(todo));
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


// ✅ 중복 일정 추가 방지
function createTodo(storageData) {
  let todoContents = todoInput.value;
  if (storageData) {
      todoContents = storageData.contents;
  }

  // 이미 같은 내용의 일정이 있는지 확인
  const existingTodos = Array.from(todoList.children).map(li => li.querySelector('span').textContent);
  if (existingTodos.includes(todoContents)) return; // 중복 방지

  const newLi = document.createElement('li'); 
  const newCheckbox = document.createElement('input'); 
  newCheckbox.type = 'checkbox'; 
  newCheckbox.classList.add('todo-checkbox'); 
  const newSpan = document.createElement('span'); 
  newSpan.textContent = todoContents;

  newLi.appendChild(newCheckbox);
  newLi.appendChild(newSpan);
  todoList.appendChild(newLi);
  todoInput.value = '';

  // ✅ 체크박스 완료 표시
  newCheckbox.addEventListener('change', () => {
      newLi.classList.toggle('complete', newCheckbox.checked);
      saveItemsFn();
  });

  // ✅ 더블 클릭 시 삭제
  newLi.addEventListener('dblclick', () => {
      newLi.remove();
      saveItemsFn();
  });

  // ✅ 기존 데이터 반영 (완료 상태)
  if (storageData && storageData.complete === true) {
      newLi.classList.add('complete');
      newCheckbox.checked = true;
  }

  saveItemsFn();
}


  //전체 삭제버튼
  function deleteAll() {
    document.querySelectorAll('#todoList li').forEach(li => li.remove());
    localStorage.removeItem('saved-items'); // 확실히 삭제
  }

   // ✅ To-Do 리스트 저장 함수
  function saveItemsFn() {
    const saveItems = [];
    document.querySelectorAll('#todoList li').forEach(li => {
        saveItems.push({
            contents: li.querySelector('span').textContent,
            complete: li.classList.contains('complete')
        });
    });

    if (saveItems.length === 0) {
        localStorage.removeItem('saved-items');
    } else {
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