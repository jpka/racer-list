(function() {
  function add(self, id, index, soft) {
    var wrapper = document.createElement("racer-element"),
    attr;

    if (!self.itemType) throw new Error("itemType was not declared");
    wrapper.child = document.createElement(self.itemType);
    wrapper.model = self._model.at(id);
    wrapper.id = "r-" + id;
    if (self.itemAttributes) {
      for (attr in self.itemAttributes) {
        wrapper.child[attr] = self.itemAttributes[attr];
      }
    }

    if (self.reverse) {
      index = self.items.length - index;
    }
    
    self.fire("item", wrapper);
    return self.list.insert(index, wrapper, null, soft);
  }

  Polymer("racer-list", {
    softUpdates: false,

    ready: function() {
      this.child = this.list = document.createElement("smart-list");
      if (this.newMessage) {
        this.child.newMessage = this.newMessage;
      }
    },
    get items() {
      return this.list.items;
    },
    push: function(item) {
      this.insert(this.items.length, item);
    },
    unshift: function(item) {
      this.insert(0, item);
    },
    insert: function(i, model) {
      this._refList.pass({local: true}).insert(i, model || {});
    },
    htmlId: function(id) {
      return "r-" + id;
    },
    get: function(id) {
      return this.list.get(this.htmlId(id));
    },
    del: function(i) {
      this._refList.remove(i);
    },
    onModelLoad: function() {
      var key,
      data,
      self = this;

      if (!this.filter) {
        this.filter = "dummy";
        this._model.fn("dummy", function() {
          return true;
        });
      }

      this.asyncMethod(function() {
        this._refList = this._model.filter("", this.filter).ref("_page." + this.filter, {updateIndices: true});
        this.listen();

        if (data = this._refList.get()) {
          data.forEach(function(item, i) {
            add(self, item.id, i);
          });
        }

        this.trigger("items:load");
      }, null, 1000);
    },
    onItemDelete: function(i, data, local) {
      if (data.id) {
        this.list.removeById(this.htmlId(data.id), !local);
      } else {
        this.list.removeByIndex(i, !local);
      }
    },
    onItemCreate: function(i, data, local) {
      add(this, data.id, i, !local);
    },
    listen: function() {
      var self = this;

      this._refList.on("all", function() {
        self.trigger.apply(self, arguments);
      });
    },
    onInsert: function(i, data, passed) {
      this.trigger("item:create", i, data[0], passed.local);
    },
    onRemove: function(i, data, passed) {
      this.trigger("item:delete", i, data[0], passed.local);
    },
    reset: function() {
      this.items.forEach(function(item) {
        item.reset();
      });
    }
  });
})();