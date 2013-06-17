describe("racer-list", function() {
  var element,
  list,
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
    list = element.list;
    element.on("model:load", function() {
      done();
    });
    model = element.model = new Model({items: []});
  });

  it("should have a list", function() {
    expect(list).to.exist;
    expect(list.nodeName).to.equal("SPAN");
  });

  it("should populate the list when a model is attached", function(done) {
    var model = new Model(modelData);

    element.on("model:load", function() {
      expect(list.items.length).to.equal(2);
      modelData.items.forEach(function(data, i) {
        expect(list.items[i].child.model).to.equal(data);
      });
      done();
    });
    element.model = model;
  });

  it("should populate on reverse if reverse is declared", function(done) {
    var model = new Model(modelData);
    element.reverse = true;

    element.on("model:load", function() {
      expect(list.items[0].child.model).to.equal(modelData.items[1]);
      expect(list.items[1].child.model).to.equal(modelData.items[0]);
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

      expect(list.items.length).to.equal(3);
      wrapper = list.items[2];
      expect(wrapper.nodeName).to.equal("RACER-ELEMENT");
      expect(wrapper.child.nodeName).to.equal("ELEMENT-WITH-MODEL");
      expect(wrapper.child.model).to.deep.equal(modelData.items[1]);
    });

    it("should manage when a document is appended in reverse mode", function() {
      element.reverse = true;
      element.model.data.items.push(modelData.items[1]);
      model.emit("items", "insert", 2, modelData.items[1]);

      expect(list.items.length).to.equal(3);
      expect(list.items[0].child.model).to.deep.equal(modelData.items[1]);
    });
  });

  it("should manage when an existing document is replaced", function() {
    element.model.data.items.push(modelData.items[0]);
    element.push(modelData.items[0]);
    model.emit("items.0", "change", modelData.items[1]);
    expect(list.childNodes[0].child.model).to.deep.equal(modelData.items[1]);
  });

  it("should delete when the document is deleted", function() {
    element.push(modelData.items[0]);
    element.push(modelData.items[1]);
    model.emit("items", "remove", 1);
    expect(list.items.length).to.equal(1);
    expect(list.items[0].child.model).to.equal(modelData.items[0]);
  });

  it("should have a del method for deleting from the model", function() {
    element.push(modelData.items[0]);
    element.del(0);
    expect(model.delWasCalledWith).to.deep.equal(["items", 0, 1]);
  });
});
