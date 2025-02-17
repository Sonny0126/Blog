const CLIENT_ID = '730180124578-n6kv46c1eoi5159t1jhb6jbu5db914o3.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyCCCLytqT96rJQsmKF5i74uswlwQHm76oc';                 
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
        // FullCalendar에 이벤트를 직접 배열로 전달
        events: eventsData
      });
      calendar.render();
    }