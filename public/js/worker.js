
let url;

self.addEventListener('push', e => {
  const data = e.data.json();
  url = data.url;
  var options = {
	title: data.title,  
    body: data.body,
    icon: 'https://www.vodafone.com/content/dam/vodcom/icons/Vod_Roundel_red%403x.png.rendition.1984.1984.png',
	//image: data.image,
	image: 'https://www.theexplode.com/wp-content/uploads/2017/10/vodafone.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
	//priority: 2,
	//progress: 90,
	requireInteraction: true,
    actions: [
      {action: 'explore', title: 'Read More',
        icon: 'images/checkmark.png'},
      {action: 'close', title: 'Close',
        icon: 'images/xmark.png'},
    ]
  };
  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});


self.addEventListener('notificationclick', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;
  var action = e.action;

  if (action === 'close') {
    notification.close();
  } else {
    clients.openWindow(url);
    notification.close();
  }
});


//listen for pushsubscriptionchage.. whether its expired or not
self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('Subscription expired');
  event.waitUntil(
    self.registration.pushManager.subscribe({ userVisibleOnly: true })
    .then(function(subscription) {
      console.log('Subscribed after expiration', subscription.endpoint);
      return fetch('/updateSubscription', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          //endpoint: subscription.endpoint
		  subscription
        })
      });
    })
  );
});

