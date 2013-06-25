window.Model = function(modelData, populated) {
  var model = {
    events: {},
    digIn: function(path, value) {
      var data = this.data;
      if (!path) return data;
      path.split(".").forEach(function(key) {
        if (!data) return;
        data = data[key];
      });
      return data;
    },
    get: function(path) {
      var data = this.data;
      if (path) data = this.digIn(path);
      return data;
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
    subscribe: function(at, cb) {
      var self = this;
      if (arguments.length === 1) cb = at;

      setTimeout(function() {
        self.data = modelData;
        cb();
      }, 500);
    },
    at: function(path) {
      return new Model(this.digIn(path), true);
    },
    set: function(path, value) {
      var pathArr = path.split("."),
      key = pathArr.pop();
      
      this.digIn(pathArr.join("."))[key] = value;
      this.emit(path, "change", value);
      this.emit(path, "load", value);
    },
    push: function(path, model) {
      return this.insert(path, this.digIn(path).length, model);
    },
    insert: function(path, i, model) {
      var stuff = this.digIn(path);
      if (i >= stuff.length) {
        stuff.push(model);
      } else {
        stuff.splice(i, 0, model)
      }
      this.emit(path, "insert", i, model);
      return stuff.length;
    },
    del: function() {
      this.delWasCalledWith = arguments;
    }
  };

  if (populated) {
    model.data = modelData;
    model.subscribe = null;
  }

  return model;
};
