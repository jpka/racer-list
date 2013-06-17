window.Model = function(modelData, populated) {
  var model = {
    events: {},
    digIn: function(path) {
      var data = this.data;
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
    subscribe: function(cb) {
      var self = this;

      setTimeout(function() {
        self.data = modelData;
        cb();
      }, 500);
    },
    at: function(path) {
      return new Model(this.digIn(path), true);
    },
    set: function(path, value) {
      this.data[path] = value;
    },
    push: function(path, model) {
      this.digIn(path).push(model);
      return this.digIn(path).length;
    },
    insert: function(path, i, model) {
      var stuff = this.digIn(path);
      if (i >= stuff.length) {
        stuff.push(model);
      } else {
        stuff.splice(i, 0, model)
      }
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
