self.addEventListener('push', function(event) {
    const options = {
        body: '공연 시작 전입니다! 준비하세요!',
        icon: 'icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('공연 알림', options)
    );
});
