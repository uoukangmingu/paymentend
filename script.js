document.addEventListener('DOMContentLoaded', () => {
    const countdownElement = document.getElementById('countdown');
    const notifyBtn = document.getElementById('notifyBtn');

    // 공연 날짜 설정 (예: 2023년 12월 31일)
    const concertDate = new Date('2024-09-19T19:30:00').getTime();

    // 카운트다운 업데이트 함수
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = concertDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `공연까지 ${days}일 ${hours}시간 ${minutes}분 ${seconds}초 남았습니다!`;

        if (distance < 0) {
            clearInterval(countdownTimer);
            countdownElement.innerHTML = "공연이 시작되었습니다!";
        }
    }

    // 1초마다 카운트다운 업데이트
    const countdownTimer = setInterval(updateCountdown, 1000);

    // 알림 버튼 클릭 이벤트
    notifyBtn.addEventListener('click', () => {
        alert('공연 알림이 설정되었습니다!');
    });

    // 서비스 워커 등록
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.register('service-worker.js')
        .then(function(registration) {
            console.log('서비스 워커가 등록되었습니다.', registration.scope);
        })
        .catch(function(error) {
            console.log('서비스 워커 등록 실패:', error);
        });
    }

    notifyBtn.addEventListener('click', () => {
        requestNotificationPermission();
    });

    function requestNotificationPermission() {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                subscribeUserToPush();
            }
        });
    }

    function subscribeUserToPush() {
        navigator.serviceWorker.ready.then((registration) => {
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('YOUR_PUBLIC_VAPID_KEY')
            };

            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            // 여기서 pushSubscription을 서버로 보내 저장해야 함
            sendSubscriptionToBackend(pushSubscription);
        });
    }

    function sendSubscriptionToBackend(subscription) {
        // 여기서 서버로 구독 정보를 보내는 코드를 작성
        // 예: fetch('/api/save-subscription/', {method: 'POST', body: JSON.stringify(subscription)})
        console.log('서버로 구독 정보 전송:', subscription);
    }

    function urlBase64ToUint8Array(base64String) {
        // base64 디코딩 함수 (VAPID 키 변환용)
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
});
