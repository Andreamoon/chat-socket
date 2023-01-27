 //imposto una variabile per aprire i servizi socket sulla pagina e comunicare con il server
 var socket = io();
 /*=====================================================
 Metodo per controllare lo scroll della pagina
 ========================================================*/
 function scrollBottom() {
   //selettori
   var messages = $('#messages');
   var newMessage = messages.children('li:last-child');
   //altezze da scrollare
   var clientHeight = messages.prop('clientHeight');
   var scrollTop = messages.prop('scrollTop');
   var scrollHeight = messages.prop('scrollHeight');
   var newMessageHeight = newMessage.innerHeight();
   var lastMessageHeight = newMessage.prev().innerHeight();

   if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
     //console.log('potrebbe scrollare')
     messages.scrollTop(scrollHeight);
   }

 }

 //setto evento connessione con il server
 socket.on('connect', () => {
   //console.log('connesso al server');
   var params = jQuery.deparam(window.location.search);

   socket.emit('join', params, (err) => {
     if (err) {
       alert(err);
       window.location.href = '/';
     } else {
       console.log('no error')
     }
   });

 });

 //setto l'evento disconnnession
 socket.on('disconnect', () => {
   console.log('Client disconnesso dal server');
 });

 socket.on('updateUserList', function (users) {
   var ol = jQuery('<ol></ol>');

   users.forEach(function (user) {
     ol.append(jQuery('<li></li>').text(user));
   });

   jQuery('#users').html(ol);
 });


 //setto un nuovo envento 
 socket.on('newMessage', (message) => {
   //creo un template utilizzando mustache
   var formattedTime = moment(message.createdAt).format('h:mm a');
   var template = jQuery('#message-template').html();
   var html = Mustache.render(template, {
     text: message.text,
     from: message.from,
     createdAt: formattedTime
   });

   jQuery('#messages').append(html);
   scrollBottom();
   // var formattedTime = moment(message.createdAt).format('h:mm a');
   // var li = jQuery('<li></li>');
   // li.text(`${message.from} ${formattedTime} : ${message.text}`);
   // jQuery('#messages').append(li);
 });

 socket.on('newLocationMessage', (message) => {
   var formattedTime = moment(message.createdAt).format('h:mm a');
   var template = jQuery('#location-message-template').html();
   var html = Mustache.render(template, {

     from: message.from,
     url: message.url,
     createdAt: formattedTime
   });
   jQuery('#messages').append(html);
   scrollBottom();
   //var formattedTime = moment(message.createdAt).format('h:mm a');
   //var li = jQuery('<li></li>');
   //var a = jQuery('<a target="_blank">Posizione corrente </a>');
   //li.text(`${message.from} ${formattedTime}: `);
   //a.attr('href', message.url);
   //li.append(a);
   //jQuery('#messages').append(li);
 });
 //evento submit del form
 jQuery('#message-form').on('submit', (e) => {
   e.preventDefault();


   socket.emit('createMessage', {

     text: jQuery('[name=message]').val()
   }, function () {
     //una volta inviato il messagio cancello quello che ho scritt sulla casella di testo
     jQuery('[name=message]').val('');
   });
 });

 //Evento click Geolaction
 var buttonLocation = jQuery('#send-location');
 buttonLocation.on('click', () => {
   if (!navigator.geolocation) {
     return alert('geoLocation non supportata')
   }

   buttonLocation.attr('disabled', 'disabled').text('Inviando posizione...')

   navigator.geolocation.getCurrentPosition((position) => {
     buttonLocation.removeAttr('disabled').text('Invia posizione');
     //creo un evento locationeMessage da inviare al server
     socket.emit('createLocationMessage', {
       latitude: position.coords.latitude,
       longitude: position.coords.longitude
     });
   }, () => {
     buttonLocation.removeAttr('disabled').text('Invia posizione');
     alert('errore non è possibile utilizzare la geolocalizzazione');
   });
 });