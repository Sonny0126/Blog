// 3자 쿠키 설정
document.cookie = "myCookie=value; path=/; Secure; SameSite=None";

// DOM이 준비되면 실행
document.addEventListener('DOMContentLoaded', () => {
    const switchButton = document.getElementById('switch');
    const switchImg = document.getElementById('switch-img');
    const body = document.body;

    // 초기 배경
    body.style.backgroundImage = "url('image/Day.png')";

    // ✅ 밤낮 전환 버튼
    switchButton.addEventListener('click', () => {
        const isNight = switchImg.getAttribute('src') === 'image/off.png';
        body.style.backgroundImage = isNight ? "url('image/Day.png')" : "url('image/Night.png')";
        switchImg.setAttribute('src', isNight ? 'image/on.png' : 'image/off.png');
    });

    // ✅ 페이지 링크 매핑
    const pageLinks = {
        button1: 'https://sonny0126.github.io/Liverpool/',
        button3: 'https://www.notion.so/Son-e53d58b3025f42d68700120ed5c20715',
        button4: 'https://blog.naver.com/chewypig'
    };

    Object.keys(pageLinks).forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => {
                window.location.href = pageLinks[id];
            });
        }
    });

    // ✅ To-do list 기능
    const todoInput = document.querySelector('#todoInput');
    const addBtn = document.querySelector('#addBtn');
    const todoList = document.querySelector('#todoList');
    const savedTodoList = JSON.parse(localStorage.getItem('saved-items')) || [];

    if (savedTodoList.length > 0) {
        savedTodoList.forEach(todo => createTodo(todo));
    }

    addBtn.addEventListener('click', () => {
        if (todoInput.value.trim() !== '') {
            createTodo();
        }
    });

    // 유튜브 버튼 기능
    const buttonImage = document.getElementById('Btnimage');
    buttonImage.addEventListener('click', () => {
        if (player && player.getPlayerState() !== 1) {
            player.playVideo();
            buttonImage.src = "image/pause.png";
        } else if (player) {
            player.pauseVideo();
            buttonImage.src = "image/play.png";
        }
    });

    // ✅ 유튜브 API 로드
    loadYouTubeAPI();
});

// ✅ keyCodeCheck 전역 연결
window.keyCodeCheck = function(event) {
    const todoInput = document.querySelector('#todoInput');
    if (event.key === "Enter" && todoInput.value.trim() !== '') {
        createTodo();
    }
}

// ✅ To-do 항목 생성 함수
function createTodo(storageData) {
    const todoInput = document.querySelector('#todoInput');
    const todoList = document.querySelector('#todoList');
    let todoContents = storageData ? storageData.contents : todoInput.value.trim();

    const existingTodos = Array.from(todoList.children).map(li => li.querySelector('span').textContent);
    if (existingTodos.includes(todoContents)) return;

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

    newCheckbox.addEventListener('change', () => {
        newLi.classList.toggle('complete', newCheckbox.checked);
        saveItemsFn();
    });

    newLi.addEventListener('dblclick', () => {
        newLi.remove();
        saveItemsFn();
    });

    if (storageData?.complete) {
        newLi.classList.add('complete');
        newCheckbox.checked = true;
    }

    saveItemsFn();
}

// ✅ To-do 저장 함수
function saveItemsFn() {
    const todoList = document.querySelectorAll('#todoList li');
    const saveItems = Array.from(todoList).map(li => ({
        contents: li.querySelector('span').textContent,
        complete: li.classList.contains('complete')
    }));

    if (saveItems.length === 0) {
        localStorage.removeItem('saved-items');
    } else {
        localStorage.setItem('saved-items', JSON.stringify(saveItems));
    }
}

// ✅ 전체 삭제 함수
window.deleteAll = function () {
    document.querySelectorAll('#todoList li').forEach(li => li.remove());
    localStorage.removeItem('saved-items');
}

// ✅ 유튜브 API 관련
function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
}

let player;
window.onYouTubeIframeAPIReady = function () {
    player = new YT.Player('youtubePlayer', {
        height: '200',
        width: '100%',
        videoId: 'hxktjr-wQa0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
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
