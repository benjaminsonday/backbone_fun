$(function() {

Backbone.sync = function(method, model, success, error){
    success();
}

var Name = Backbone.Model.extend({
    defaults: {
        first: 'John',
        last:  'Doe'
    }
});

var FriendList = Backbone.Collection.extend({
    model: Name
});

var NameView = Backbone.View.extend({
    tagName: 'li',

    events: {
        'click span.swap':   'swap',
        'click span.delete': 'remove'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'unrender', 'swap', 'remove');

        this.model.bind('change', this.render);
        this.model.bind('remove', this.unrender);
    },

    render: function(){
        $(this.el).html('<span style="color:black;">' +
            this.model.get('first') + ' ' +
            this.model.get('last') +
        '</span> &nbsp; &nbsp; ' +
        '<span class="swap" style="font-family:sans-serif; color:blue; cursor:pointer;">[swap]</span> ' +
        '<span class="delete" style="cursor:pointer; color:red; font-family:sans-serif;">[delete]</span>');
        return this;
    },

    unrender: function(){
        $(this.el).remove();
    },

    swap: function(){
        var swapped = {
            first: this.model.get('last'),
            last:  this.model.get('first')
        };
        this.model.set(swapped);
    },

    remove: function(){
        this.model.destroy();
    }
});

// var FileEmailList = Backbone.Model.extend({

// });

// var FileEmailView = Backbone.View.extend({

//     initialize: function(){
//         _.bindAll(this, 'render', 'uploadFile');
//         this.render();
//     },

//     render: function(){
//         $(this.el).html("<input type='file'/>");
//         return this;
//     }
// });

var FriendsView = Backbone.View.extend({
    el: $('body'),
    events: {
        'click button#btn':   'addFriend',
        'change #fileSelect': 'getFileData'
    },

    initialize: function(){
        _.bindAll(this, 'render', 'addFriend', 'renderNewFriend', 'getFileData');

        this.collection = new FriendList();
        this.collection.bind('add', this.renderNewFriend);

        this.counter = 0;
        this.render();
    },

    render: function(){
        $(this.el).append("<button id='btn'>Add friend</button>");
        $(this.el).append("<input id='fileSelect' type='file'>");
        $(this.el).append("<ul></ul>");
    },

    getFileData: function(event){
        var file = event.target.files[0];
        var fileReader = new FileReader();
        fileReader.onload = function(e){
            var output = e.target.result;
            var lines = output.split("\n");
            alert(lines[0]);
        };
        fileReader.readAsText(file);
    },

    addFriend: function(){
        this.counter++;
        var name = new Name();
        name.set({
            first: name.get('first') + this.counter
        });
        this.collection.add(name);
    },

    renderNewFriend: function(name){
        var nameView = new NameView({
            model: name
        });
        // $('ul').append("<li>" + name.get('first') +
        //     " " + name.get('last') + "</li>");
        $('ul').append(nameView.render().el);
    }
});

var view = new FriendsView();

});