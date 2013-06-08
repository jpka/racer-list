describe("racer-collection", function() {
  var element,
  coll,
  modelData = {a: 1, b: 2},
  Model = function() {
    return {
      events: {},
      get: function() {
        return modelData;
      },
      on: function(name, path, cb) {
        if (!this.events[name]) {
          this.events[name] = [];
        }
        this.events[name].push(cb);
      },
      emit: function(name, args) {
        this.events[name].forEach(function(cb) {
          cb.apply(this, args);
        });
      },
      subscribe: function(cb) {
        setTimeout(cb, 500);
      },
      at: function() {
        return new Model();
      }
    };
  };

  beforeEach(function(done) {
    element = fixtures.window().document.createElement("racer-collection");
    coll = element.$.collection;
    element.childType = "element-with-model";
    element.addEventListener("subscribed", function() {
      done();
    });
    model = element.model = new Model();
  });

  it("should have a collection", function() {
    expect(coll).to.exist.and.to.have.property("add");
  });

  it("should create a racer-element that wraps around a new element of the designated type when a new document is inserted", function() {
    model.emit("change", ["a", modelData]);
    expect(coll.childNodes.length).to.equal(1);
    expect(coll.firstElementChild.nodeName).to.equal("RACER-ELEMENT");
    expect(coll.firstElementChild.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
    expect(coll.firstElementChild.child.model).to.deep.equal(modelData);
  });

  it("should manage when an existing document is replaced", function() {
    var newModelData = {a: 2, b: 1};
    model.emit("change", ["a", modelData]);
    model.emit("change", ["a", newModelData]);
    expect(coll.get("a").child.model).to.deep.equal(newModelData);
  });

  it("should delete when the document is deleted", function() {
    model.emit("change", ["a", modelData]);
    model.emit("change", ["a"]);
    expect(coll.childNodes.length).to.equal(0);
  });
});
