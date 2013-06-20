describe("Objects", function() {
  var element,
  list,
  modelData = {
    items: {
      a: {a: 1},
      b: {a: 2}
    }
  },
  Model;

  beforeEach(function(done) {
    Model = fixtures.window().Model;
    element = fixtures.window().document.querySelector("racer-list").cloneNode();
    list = element.$.list;
    element.on("model:load", function() {
      done();
    });
    model = element.model = new Model({items: {}});
  });

  it("should populate the list when a model is attached", function(done) {
    element.on("model:load", function() {
      expect(element.items.length).to.equal(2);
      expect(list.items[0].child.model.a).to.equal(modelData.items["a"].a);
      expect(list.items[1].child.model.a).to.equal(modelData.items["b"].a);
      done();
    });
    element.model = new Model(modelData);
  });

  it("should populate on reverse if reverse is declared", function(done) {
    element.reverse = true;

    element.on("model:load", function() {
      expect(list.items[0].child.model.a).to.equal(modelData.items["b"].a);
      expect(list.items[1].child.model.a).to.equal(modelData.items["a"].a);
      done();
    });
    element.model = new Model(modelData);
  });

  describe("insertions", function() {
    beforeEach(function() {
      element.set("a", modelData.items["a"]);
    });
    
    it("should manage when a document is appended", function() {
      var wrapper;

      element.model.data.items.b = modelData.items["b"];
      element.model.emit("items.b", "change", modelData.items["b"]);
      element.model.emit("items.b", "load", modelData.items["b"]);

      expect(list.items.length).to.equal(2);
      wrapper = list.items[1];
      expect(wrapper.nodeName).to.equal("RACER-ELEMENT");
      expect(wrapper.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
      expect(wrapper.child.model.a).to.deep.equal(modelData.items["b"].a);
    });

    it("should manage when a document is appended in reverse mode", function() {
      element.reverse = true;
      element.model.data.items.b = modelData.items["b"];
      element.model.emit("items.b", "change", modelData.items["b"]);
      element.model.emit("items.b", "load", modelData.items["b"]);

      expect(list.items.length).to.equal(2);
      expect(list.items[0].child.model.a).to.deep.equal(modelData.items["b"].a);
    });
  });

  it("should manage when an existing document is replaced", function() {
    element.set("a", modelData.items["a"]);
    element.model.data.items.a = modelData.items["b"];
    model.emit("items.a", "change", modelData.items["b"]);
    expect(list.items[0].child.model.a).to.deep.equal(modelData.items["b"].a);
  });

  it("should delete when the document is deleted", function() {
    element.set("a", modelData.items["a"]);
    element.set("b", modelData.items["b"]);
    model.emit("items.b", "change");
    expect(list.items.length).to.equal(1);
    expect(list.items[0].child.model.a).to.equal(modelData.items["a"].a);
  });

  it("deleting deletes only one item", function() {
    element.del("a");
    expect(model.delWasCalledWith).to.deep.equal(["items.a"]);
  });

  it("discards events intended for the child", function() {
    element.set("a", modelData.items["a"]);
    expect(list.items.length).to.equal(1);
  });
});
