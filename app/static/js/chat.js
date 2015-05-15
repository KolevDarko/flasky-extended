$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    
    socket.on('connect', function() {
        socket.emit('my event', {data: 'I\'m connected!'});
    });

    socket.on('income_chat', function(data){
        var my_id = Cookies.get('user_id');
        if (data['receiver_id'] == my_id){
            addMessage(data, 'right');
        };
    });

    socket.on('broadcast_room', function(data){
        var my_id = Cookies.get('user_id');
        if (my_id == data['id']){
            addMessage(data['message'], 'right');
            socket.emit('join_room', data);
        }
    });

    function addMessage(message, pos){
        var elem = $('<div>');
        elem.text(message);
        elem.attr('style', 'text-align:'+pos);
            // .attr('innerHtml', message)
            // .attr('style', 'text-align:'+pos);
        $('#chatBox').append(elem);
        var newscrollHeight = $("#chatBox").prop("scrollHeight") - 20; 
        $('#chatBox').animate({scrollTop: newscrollHeight}, 'normal');
    }

    $('#startChat').click(function(){
        var friend_id = $('#friendsList').val();
        var msg = $('#chatMessage').val();
        addMessage(msg, 'left');
        socket.emit('start_chat', {
            id: friend_id,
            message: msg
        });
    });
});
