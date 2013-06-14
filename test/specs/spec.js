describe("racer-collection", function() {
  var element,
  coll,
  modelData = {},
  Model = function(modelData) {
    return {
      events: {},
      data: modelData,
      get: function() {
        return this.data;
      },
      on: function(name, path, cb) {
        if (!this.events[name]) {
          this.events[name] = [];
        }
        this.events[name].push(cb);
      },
      emit: function() {
        var args = arguments;
        this.events["all"].forEach(function(cb) {
          cb.apply(this, args);
        });
      },
      subscribe: function(cb) {
        setTimeout(cb, 500);
      },
      at: function(path) {
        return new Model(this.data[path]);
      },
      set: function(path, value) {
        this.data[path] = value;
      }
    };
  };
  modelData[0] = {a: 1};
  modelData[1] = {b: 2};

  beforeEach(function(done) {
    element = fixtures.window().document.createElement("racer-collection");
    coll = element.collection;
    element.childType = "element-with-model";
    element.addEventListener("subscribe", function() {
      done();
    });
    model = element.model = new Model({});
  });

  it("should have a collection", function() {
    expect(coll).to.exist;
  });

  it("should populate the collection when a model is attached", function(done) {
    var model = new Model(modelData),
    key;

    element.addEventListener("items:subscribe", function() {
      expect(coll.childNodes.length).to.equal(2);
      for (key in modelData) {
        expect(coll.childNodes[key].child.model).to.equal(modelData[key]);
      }
      done();
    });
    element.model = model;
  });

  it("should create a racer-element that wraps around a new element of the designated type when a new document is inserted", function(done) {
    var wrapper;
    element.addEventListener("item:subscribe", function() {
      expect(coll.childNodes.length).to.equal(1);
      wrapper = coll.firstElementChild;
      expect(wrapper.nodeName).to.equal("RACER-ELEMENT");
      expect(wrapper.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
      expect(wrapper.child.model).to.deep.equal(modelData[0]);
      done();
    });
    element.model.data["0"] = modelData["0"];
    model.emit("0", "change", modelData["0"]);
  });

  it("should manage when an existing document is replaced", function() {
    var newModelData = {a: 2, b: 1};
    element.create(modelData);
    model.emit("0", "change", newModelData);
    expect(coll.childNodes[0].child.model).to.deep.equal(newModelData);
  });

  it("should delete when the document is deleted", function() {
    element.create(modelData);
    model.emit("0", "change");
    expect(coll.childNodes.length).to.equal(0);
  });
});
