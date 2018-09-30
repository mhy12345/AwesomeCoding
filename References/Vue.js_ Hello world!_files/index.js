(function(window){ var document=window.document,location=window.location,history=window.history;function require() { throw new Error("You need to write <script src=\"/index.pack.js\"> to use require()") }
var app = new Vue({ 
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
});

})(window.SCRIMBA_WINDOW || window)