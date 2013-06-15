describe("racer-list", function() {
  var element,
  coll,
  modelData = {
    items: [
      {a: 1},
      {b: 2}
    ]
  },
  Model;

  beforeEach(function(done) {
    Model = fixtures.window().Model;
    element = fixtures.window().document.querySelector("racer-list").cloneNode();
    coll = element.collection;
    element.on("model:load", function() {
      done();
    });
    model = element.model = new Model({items: []});
  });

  it("should have a collection", function() {
    expect(coll).to.exist;
    expect(coll.nodeName).to.equal("SPAN");
  });

  it("should populate the collection when a model is attached", function(done) {
    var model = new Model(modelData);

    element.on("model:load", function() {
      expect(coll.items.length).to.equal(2);
      modelData.items.forEach(function(data, i) {
        expect(coll.items[i].child.model).to.equal(data);
      });
      done();
    });
    element.model = model;
  });

  describe("insertions", function() {
    beforeEach(function() {
      element.push(modelData.items[0])
      element.push(modelData.items[0])
    });
    
    it("should manage when a document is appended", function() {
      var wrapper;

      element.model.data.items.push(modelData.items[1]);
      model.emit("items", "insert", 2, modelData.items[1]);

      expect(coll.items.length).to.equal(3);
      wrapper = coll.items[2];
      expect(wrapper.nodeName).to.equal("RACER-ELEMENT");
      expect(wrapper.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
      expect(wrapper.child.model).to.deep.equal(modelData.items[1]);
    });

    it("should manage when a document is prepended", function() {
      element.model.data.items.unshift(modelData.items[1]);
      model.emit("items", "insert", 0, modelData.items[1]);

      expect(coll.items.length).to.equal(3);
      expect(coll.items[0].child.model).to.deep.equal(modelData.items[1]);
    });

    it("should manage when a document is inserted at a random index", function() {
      element.model.data.items = [modelData.items[0], modelData.items[1], modelData.items[0]];
      model.emit("items", "insert", 1, modelData.items[1]);

      expect(coll.items.length).to.equal(3);
      expect(coll.items[1].child.model).to.deep.equal(modelData.items[1]);
    });
  });

  it("should manage when an existing document is replaced", function() {
    element.model.data.items.push(modelData.items[0]);
    element.push(modelData.items[0]);
    model.emit("items.0", "change", modelData.items[1]);
    expect(coll.childNodes[0].child.model).to.deep.equal(modelData.items[1]);
  });

  it("should delete when the document is deleted", function() {
    element.push(modelData.items[0]);
    element.push(modelData.items[1]);
    model.emit("items", "remove", 1);
    expect(coll.items.length).to.equal(1);
    expect(coll.items[0].child.model).to.equal(modelData.items[0]);
  });
});
