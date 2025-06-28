
const CLIENT_ID = '730180124578-n6kv46c1eoi5159t1jhb6jbu5db914o3.apps.googleusercontent.com';
let API_KEY = ''; // 전역 변수로 사용

async function fetchApiKey() {
  try {
    const response = await fetch('/apikey');
    const data = await response.json();
    API_KEY = data.apiKey;

    // API 키 받은 후 gapi 초기화 시작
    gapiLoaded();
  } catch (err) {
    console.error('API 키 가져오기 실패:', err);
  }
}

    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

    let tokenClient;    // OAuth 토큰 클라이언트
    let gapiInited = false;  // gapi 초기화 여부
    let calendar;       // FullCalendar 인스턴스

    // 2) gapi (Google API) 로드가 끝나면 호출되는 함수
    function gapiLoaded() {
      gapi.load('client', initGapiClient);
    }
     
    
    // 3) gapi.client 초기화 (API Key, discoveryDocs 설정)
    async function initGapiClient() {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
          // 어떤 구글 API를 쓸지 명시 (Calendar v3)
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
        });
        gapiInited = true;

        // 이제 OAuth 초기화 (토큰 클라이언트 만들기)
        initTokenClient();
      } catch (error) {
        console.error('gapi.client.init() 에러:', error);
      }
    }

    // 4) OAuth용 토큰 클라이언트를 초기화
    function initTokenClient() {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        prompt: '', // 이미 권한을 받은 경우 재로그인 없이 진행. 필요시 'consent'로 변경
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            // 토큰을 gapi에 설정
            gapi.client.setToken(tokenResponse);
            console.log('로그인 성공, 토큰:', tokenResponse.access_token);
            // 로그인 후 일정 불러오기
            loadCalendarEvents();
          } else {
            console.error('토큰 받기 실패:', tokenResponse);
          }
        }
      });

      // 로그인 버튼에 클릭 핸들러 연결
      const loadBtn = document.getElementById('loadBtn');
      loadBtn.onclick = () => {
        if (!gapiInited) {
          alert('Google API 로드가 안 된 상태입니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        // 사용자에게 OAuth 인증 창을 표시하여 로그인 진행
        tokenClient.requestAccessToken();
      };
    }

    const visitBtn = document.getElementById('visitBtn'); 
    
    visitBtn.onclick= () => {
        window.open("https://calendar.google.com", "_blank");
    }

    const themeBtn=document.getElementById('theme');

    themeBtn.onclick= () => {
        window.open("https://sonny0126.github.io/Blog/");
    }

    // 5) 구글 캘린더 이벤트 불러오기 (비동기)
    async function loadCalendarEvents() {
        try {
            
            // 오늘 날짜 기준, 1년 전
            const timeMin = new Date();
            timeMin.setFullYear(timeMin.getFullYear() - 1);

            // 오늘 날짜 기준, 1년 후
            const timeMax = new Date();
            timeMax.setFullYear(timeMax.getFullYear() + 1);

            // events.list API 호출
            const response = await gapi.client.calendar.events.list({
            calendarId: 'e5062d31941fee792a6dea052f64c1cf68216170e383b8c1e1f77f0504013111@group.calendar.google.com',
            timeMin: timeMin.toISOString(),
            timeMax: timeMax.toISOString(),
            showDeleted: false,
            singleEvents: true,
            orderBy: 'startTime'
            });

            const items = response.result.items;
            if (!items || items.length === 0) {
            console.log('가져올 이벤트가 없습니다.');
            renderCalendar([]);
            return;
            }

            // FullCalendar 이벤트 형식으로 매핑
            const eventsForFullCalendar = items.map(event => {
            const start = event.start.dateTime || event.start.date;
            const end = event.end.dateTime || event.end.date;
            return {
                id: event.id,
                title: event.summary || '(제목 없음)',
                start: start,
                end: end
            };
            });

            // FullCalendar에 표시
            renderCalendar(eventsForFullCalendar);
        } catch (error) {
            console.error('이벤트 가져오기 에러:', error);
        }
    }

    // 6) FullCalendar에 이벤트를 표시
    function renderCalendar(eventsData) {
      const calendarEl = document.getElementById('calendar');

      // 이미 달력이 초기화돼 있다면 업데이트만
      if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(eventsData);
        return;
      }

      // 처음 렌더링 시
      calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'ko',
        events: eventsData,
        dateClick: function (info) {
          showEventsForDate(info.dateStr, eventsData);
        }
      });
      calendar.render();
    }

      document.addEventListener('DOMContentLoaded', function () {
        let calendarEl = document.getElementById('calendar');
    
        let calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'ko', // 한국어 설정
            selectable: true, // 날짜 선택 가능
            events: [], // 여기에 Google 캘린더 API로 일정 로드 예정
            dateClick: function(info) {
                // 선택한 날짜의 일정 가져오기
                loadEventsForDate(info.dateStr);
            }
        });
    
        calendar.render();
    });
  
      function loadEventsForDate(dateStr) {
        let eventListDiv = document.getElementById('eventList');
        eventListDiv.innerHTML = `<h3>${dateStr}의 일정</h3>`; // 선택한 날짜 표시
    
        // Google Calendar API로 가져온 이벤트 리스트
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': new Date(dateStr).toISOString(), // 선택한 날짜의 00:00:00
            'timeMax': new Date(new Date(dateStr).setHours(23, 59, 59)).toISOString(), // 선택한 날짜의 23:59:59
            'showDeleted': false,
            'singleEvents': true,
            'orderBy': 'startTime'
        }).then(function (response) {
            let events = response.result.items;
    
            if (!events || events.length === 0) {
                eventListDiv.innerHTML += `<p>일정이 없습니다.</p>`;
                return;
            }
    
            // 일정 목록 표시
            let ul = document.createElement('ul');
            events.forEach(event => {
                let li = document.createElement('li');
                li.textContent = `${event.start.dateTime ? event.start.dateTime.split('T')[1].substring(0, 5) : '종일'} - ${event.summary}`;
                ul.appendChild(li);
            });
    
            eventListDiv.appendChild(ul);
        });
    }
  

    function showEventsForDate(dateStr, eventsData) {
      const eventListEl = document.getElementById('eventList');
      eventListEl.innerHTML = ''; // 기존 목록 초기화
  
      const filteredEvents = eventsData.filter(event => event.start.startsWith(dateStr));
  
      if (filteredEvents.length === 0) {
          eventListEl.innerHTML = '<p>이 날의 일정이 없습니다.</p>';
          localStorage.removeItem('selected-date-events'); // 일정이 없으면 삭제
      } else {
          const existingEvents = JSON.parse(localStorage.getItem('selected-date-events')) || [];
          const eventList = [...existingEvents]; // 기존 저장된 일정과 병합
  
          filteredEvents.forEach(event => {
              const eventData = { contents: event.title, complete: false };
  
              // 중복 일정 방지 (이미 저장된 일정인지 확인)
              if (!eventList.some(e => e.contents === eventData.contents)) {
                  eventList.push(eventData);
              }
  
              // 화면에도 일정 표시
              const eventItem = document.createElement('p');
              eventItem.textContent = event.title;
              eventListEl.appendChild(eventItem);
          });
  
          // `localStorage`에 일정 저장
          localStorage.setItem('selected-date-events', JSON.stringify(eventList));
      }
  }
  
    
    