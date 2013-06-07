describe("socket.io-sl", function() {
  var element,
  stubSocket = {
    listeners: {},
    on: function(what, fn) {
      var listeners = this.listeners;
      if (!listeners[what]) {
        listeners[what] = [];
      }
      listeners[what].push(fn);
    },
    emit: function(what, arg) {
      var listeners = this.listeners[what];
      if (listeners) {
        listeners.forEach(function(fn) {
          fn(arg);
        });
      }
    }
  },
  stubIO = {
    connect: function() {
      return stubSocket;
    }
  };

  function populateList() {
    element.add("element-with-model", [{id: "a"}, {id: "b"}]);
  }

  beforeEach(function() {
    element = fixtures.window().document.createElement("jpka-socket.io-sl");
    element.childTagName = "element-with-model";
    element.path = "/path";
    element.io = stubIO;
  });

  it("should respond to create events", function() {
    var model = {id: "a", a: 1, b: 2};
    stubSocket.emit("create", model);
    expect(element.childNodes.length).to.equal(1);
    expect(element.childNodes[0].model).to.deep.equal(model);
    expect(element.childNodes[0].id).to.equal("a");
  });

  /*it("should respond to delete events", function() {
    populateList();
    stubSocket.emit("delete", {id: "1"});

    expect(element.childNodes.length).to.equal(1);
    expect(element.childNodes[0].id).to.equal("2");
  });*/

  /*it("should respond to update events", function() {
    var model = {id: "b", a: 1, b: 2};
    populateList();
    stubSocket.emit("update", model);

    expect(element.querySelector("#b").model).to.deep.equal(model);
  });*/
});
