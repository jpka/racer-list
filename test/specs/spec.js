describe("racer-collection", function() {
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
    element = fixtures.window().document.querySelector("racer-collection").cloneNode();
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

  it("should create a racer-element that wraps around a new element of the designated type when a new document is inserted", function() {
    var wrapper;

    element.model.data.items.push(modelData.items[0]);
    model.emit("items", "insert", 0, modelData.items[0]);

    expect(coll.items.length).to.equal(1);
    wrapper = coll.items[0];
    expect(wrapper.nodeName).to.equal("RACER-ELEMENT");
    expect(wrapper.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
    expect(wrapper.child.model).to.deep.equal(modelData.items[0]);
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
