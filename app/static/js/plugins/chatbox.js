$(document).ready(function(){

/********* Socket stuff ********************/
    var chatSocket = io.connect('http://' + document.domain + ':' + location.port+"/chat");
    var statusSocket = io.connect('http://' + document.domain + ':' + location.port+"/status");

    statusSocket.on('statusUpdate', function(data){
    	var friend_id = data['id'];
   		$('.user').each(function(){
   			if($(this).attr('data-user-id') == friend_id){
   				if(data['status'] === 'online')
   					$(this).addClass('online');
   				else
   					$(this).removeClass('online');
   			}
   		});
    });

    chatSocket.on('connect', function() {
        chatSocket.emit('my event', {data: 'I\'m connected!'});
    });

    chatSocket.on('income_chat', function(data){
    	var my_id = Cookies.get('user_id');
        if (my_id != data['id'])
        	return false;
		var msgBox = $('#box-'+data['sender_id']);
		console.log('the box len is: '+ msgBox.length);
		if(msgBox.length == 0){
			addMessageBox(data['sender_username'], data['sender_id']);
			msgBox = $('#box-'+data['sender_id']);
		}
	    addMessage(data['message'], 'msg_received', msgBox);
    });

    chatSocket.on('broadcast_room', function(data){
    	var msgBox;
        var my_id = Cookies.get('user_id');
        if (my_id == data['id']){
        	addMessageBox(data['sender_username'], data['sender_id']);
        	msgBox = $('#box-'+data['sender_id']);
            addMessage(data['message'], 'msg_received', msgBox);
            chatSocket.emit('join_room', data);
        }
    });



/********* UI stuff **********/

$('.user').click(function(){
	var userId = $(this).attr('data-user-id');
	var username = $(this).find('.chatName').text();
	//If no box for this user, add one
	if(activeBoxes.indexOf(userId) === -1){
		addMessageBox(username, userId);
		activeBoxes.push(userId);
	}else{
		$('.msg_container').find('#box-'+userId).show();
	}
});
	$('.chat_head').click(function(){
		$('.chat_body').slideToggle('slow');
	});

var msg_box_html = " <div class=\"msg_box\" id=\"box-{{userId}}\">"
        +"<div class=\"msg_head\">{{username}}"
            +"<div class=\"close\">x</div>"
        +"</div>"
        +"<div class=\"msg_wrap\">"
                +"<div class=\"msg_body\">"
                	+"<div class=\"msg_push\"></div>"
                +"</div>"
            +"<div class=\"msg_footer\">"
            +    "<textarea class=\"msg_input\" rows=\"4\"></textarea>"
            +"</div>"
        +"</div>"
    +"</div>";

var activeBoxes = [];

function addMessageBox(username, userId){
	var res = msg_box_html.replace("{{username}}", username)
				.replace("{{userId}}", userId);
	$('.msg_container').append(res);

	$('.msg_head').click(function(){
		$(this).parents('.msg_box').
			find('.msg_wrap').slideToggle('slow');
	});
	
	$('.close').click(function(){
		$(this).closest('.msg_box').hide();
	});
	
	$('textarea.msg_input').keypress(function(e){
        if (e.keyCode == 13) {
            var msg = $(this).val();
            var parent, friend_id;
			$(this).val('');
			parent = $(this).closest('.msg_box');
			addMessage(msg, 'msg_sent', parent);
			friend_id = parent.attr('id').split('-')[1];
            chatSocket.emit('start_chat', {
                id: friend_id,
                message: msg
            });
        }
    });
}

function addMessage(text, type, msgBox){
	if(text.trim() != ''){
		$("<div class=\""+type+"\">"+text+"</div>").insertBefore(msgBox.find('.msg_push'));
		var newscrollHeight = msgBox.find(".msg_body").prop("scrollHeight") - 20; 
		console.log('new scroll height is: ' + newscrollHeight);
        msgBox.find('.msg_body').animate({scrollTop: newscrollHeight}, 'normal');
	}
}
	
});