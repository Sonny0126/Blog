///////////////////
//     LEFT   /////
///////////////////
// ✅ 밤낮 조절 버튼 기능
const switchButton = document.getElementById('switch');
const switchImg = document.getElementById('switch-img');
const body = document.body;

window.onload = () => {
    body.style.backgroundImage = "url('Day.png')";
    displayCalendar();
};

switchButton.addEventListener('click', () => {
    const isNight = switchImg.getAttribute('src') === 'off.png';
    body.style.backgroundImage = isNight ? "url('Night.png')" : "url('Day.png')";
    switchImg.setAttribute('src', isNight ? 'on.png' : 'off.png');
});

// ✅ 페이지 이동 버튼 기능
const pageLinks = {
    button1: 'https://sonny0126.github.io/Web/',
    button2: 'https://sonny0126.github.io/BitFlow/',
    button3: 'https://www.notion.so/Son-e53d58b3025f42d68700120ed5c20715',
    button4: 'https://blog.naver.com/chewypig'
};

Object.keys(pageLinks).forEach(id => {
    document.getElementById(id).addEventListener('click', () => {
        window.location.href = pageLinks[id];
    });
});

///////////////////
//     RIGHT   ////
///////////////////
// ✅ 달력 기능
const calendarTitle = document.getElementById('calendarTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const days = document.querySelector('.days');
const selected = document.querySelector('.selected');

let dateToday = new Date();
let year = dateToday.getFullYear();
let month = dateToday.getMonth();

function displayCalendar() {
    const firstDay = new Date(year, month, 1);
    const firstDayIdx = firstDay.getDay();
    const lastDay = new Date(year, month + 1, 0);
    const numberOfDays = lastDay.getDate();

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

        if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getDate() === new Date().getDate()
        ) {
            div.classList.add('current-date');
        }

        days.appendChild(div);
    }

    setupDateSelection();
}

function setupDateSelection() {
    document.querySelectorAll('.days .day').forEach(day => {
        day.addEventListener('click', (e) => {
            selected.innerText = `Date: ${e.target.dataset.date}`;
        });
    });
}

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
//   BOTTOM   /////
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

function createTodo (storageData) { // 할 일 추가 기능
  let todoContents =todoInput.value;
    if(storageData){
      todoContents=storageData.contents
    }

	const todoList = document.querySelector('#todoList');
	const newLi = document.createElement('li'); // li 생성
    const newBtn = document.createElement('button'); // button 생성
	const newSpan = document.createElement('span'); // span 생성
  const deleteAll = document.querySelector('.delete-btn-wrap');
      
    newLi.appendChild(newBtn); // li안에 button 담기
	newLi.appendChild(newSpan); // li안에 span 담기
      
	newSpan.textContent = todoContents; // span 안에 value값 담기
      
	todoList.appendChild(newLi);
      
	todoInput.value = ''; // value 값에 빈 문자열 담기

  newBtn.addEventListener('click', () => { // 체크박스 클릭시 완료 표시
		newLi.classList.toggle('complete');

    saveItemsFn();
    });

  newLi.addEventListener('dblclick', () => {
    //더블 클릭시 삭제
    newLi.remove();
    saveItemsFn();
  })

    if (storageData && storageData.complete === true) {
      newLi.classList.add('complete')
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