describe("racer-collection", function() {
  var element,
  coll,
  modelData = {},
  Model;
  modelData[0] = {a: 1};
  modelData[1] = {b: 2};

  beforeEach(function(done) {
    Model = fixtures.window().Model;
    element = fixtures.window().document.querySelector("racer-collection").cloneNode();
    coll = element.collection;
    element.addEventListener("subscribe", function() {
      done();
    });
    model = element.model = new Model({});
  });

  it("should have a collection", function() {
    expect(coll).to.exist;
    expect(coll.nodeName).to.equal("SPAN");
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
