/* const publicVapidKey = 'BLzhvkZqLU5NS512DRuB7Qcuj9JeStGhxVRaBTe1J7TidMzJRcEqiakrM0dlKILWgMhIlQSUj4ZK6HEtqukXUT4';

const sub_but =document.getElementById('sub-button');

sub_but.addEventListener('click', function(){
	Notification.requestPermission(async function(status){
		if (status == 'granted'){
			console.log(status);
			const register = await navigator.serviceWorker.register('/js/worker.js');
			//scope: '/'
			//);
	
			//register push
			console.log('registering push');
			const subscription = await register.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
			});
			console.log('push registered');

			//send push notification
			await fetch('/subscribe', {
				method: 'POST',
				body: JSON.stringify(subscription),
				headers: {
					'content-type': 'application/json'
				}
			});

}
	});
});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

*/


const publicVapidKey = 'BLzhvkZqLU5NS512DRuB7Qcuj9JeStGhxVRaBTe1J7TidMzJRcEqiakrM0dlKILWgMhIlQSUj4ZK6HEtqukXUT4';

//check for service worker
const sub_but =document.getElementById('sub-button');

sub_but.addEventListener('click', function(){
	
	//get the values of the input fields
	const name = document.getElementById('name').value;
	const department = document.getElementById('department').value;
	 
	
	
	Notification.requestPermission(async function(status){
		if (status == 'granted'){
			console.log(status);

// async function send(){
	console.log('Registering service worker');
	const register = await navigator.serviceWorker.register('/js/worker.js',{	
	});
	console.log('service worker registered');
	
	//register push
	console.log('registering push');
	const subscription = await register.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
});

var obj = {"name": name, "department": department, "subscription": subscription}
console.log(subscription);
console.log('push registered');

//console.log(subscription);

//send push notification
console.log('sending push');
await fetch('/subscribe', {
	method: 'POST',
	body: JSON.stringify(obj),
	headers: {
		'content-type': 'application/json'
	}
});
console.log('push sent');
}

		});
	});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
		
