var socket = io();

const app = new Vue({

  el: '#app',
  data: {
    newMessage: '',
    avatar_url: `http://api.adorable.io/avatars/50/${new Date().getMilliseconds()}.png`,
    messages: [],
  },

  methods: {
    addMessage: function() {
      var text = this.newMessage.trim();
      if (text) {
        socket.emit('chat message', {
          text: text,
          avatar_url: this.avatar_url,
          datetime: new Date()
        });
        this.newMessage = '';
      }
    },

    messagesUpdate: function(msg) {
      this.messages.push(msg);
    },
  },
});

socket.on('chat message', function(msg){
  app.messagesUpdate(msg);
});
