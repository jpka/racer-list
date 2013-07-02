Polymer.register(this, {
  _authoredLocally: {},

  ready: function() {
    this.appendChild(document.createElement("smart-list"));
  },
  get list() {
    return this.child;
  },
  get items() {
    return this.list.items;
  },
  add: function(key) {
    var wrapper = document.createElement("racer-element"),
    attr;

    if (!this.itemType) throw new Error("itemType was not declared");
    wrapper.child = document.createElement(this.itemType);
    wrapper.model = this._model.at(this.at + "." + key);
    if (this.itemAttributes) {
      for (attr in this.itemAttributes) {
        wrapper.child[attr] = this.itemAttributes[attr];
      }
    }

    wrapper.id = "r-" + key;

    if (this._isArray) {
      if (this.reverse) {
        key = this.items.length - key;
      }
      this.list.insert(key, wrapper);
    } else {
      this.list[this.reverse ? "unshift" : "push"](wrapper);
    }
  },
  push: function(item) {
    var length = this.items.length;

    if (this._isArray) {
      this.insert(this.items.length, item);
    } else {
      while (this._model.get(this.at + "." + length)) {
        length += 1;
      }
      this.set(length, item);
    }
  },
  unshift: function(item) {
    if (!this._isArray) throw new Error("Can't unshift on an object!");
    this.insert(0, item);
  },
  insert: function(i, model) {
    if (!this._isArray) throw new Error("Can't insert on an object!");
    this._authoredLocally[i] = true;
    this._model.insert(this.at, i, model || {});
  },
  set: function(key, model) {
    this._authoredLocally[key] = true;
    this._model.set(this.at + "." + key, model);
  },
  get: function(id) {
    return this.list.get("r-" + id);
  },
  del: function(key) {
    if (this._isArray) {
      this._model.del(this.at, key, 1);
    } else {
      this._model.del(this.at + "." + key);
    }
  },
  onModelLoad: function() {
    var key,
    data,
    self = this;

    if (!this.at) throw new Error("at attribute must be specified");
    data = this._model.get(this.at);

    this._isArray = Array.isArray(data);

    if (data) {
      Object.keys(data).forEach(function(key) {
        self.add(key);
      });
    }

    this.trigger("items:load");
  },
  onItemDelete: function(key) {
    this._authoredLocally[key] = false;
    this.list.rm("r-" + key);
  },
  onItemCreate: function(key) {
    this.add(key);
  },
  onForeignItemCreate: function(key) {
    this.add(key);
  },
  onItemUpdate: function(key, data) {
    var item;

    if (this._isArray) {
      item = this.list.items[key];
    } else {
      item = this.get(key);
    }
    item.update(data);
  },
  onChange: function(key, data) {
    var ev = "";

    if (this._isArray) {
      ev = "update";
    } else {
      if (key.indexOf(".") > -1) return;
      if (data) {
        if (this.get(key)) {
          ev = "update";
        } else {
          return; //create will be catched by load.
        }
      } else {
        ev = "delete";
      }
    }

    this.trigger("item:" + ev, key, data);
  },
  onLoad: function(key) {
    var ev = "item:create";
    if (this._isArray || this.get(key)) return;
    if (!this._authoredLocally[key]) {
      ev = "foreign:" + ev;
    }
    this.trigger(ev, key);
  },
  onInsert: function(i) {
    this.trigger("item:create", i);
  },
  onRemove: function(i) {
    this.trigger("item:delete", i);
  },
  reset: function() {
    this.items.forEach(function(item) {
      item.reset();
    });
  }
});