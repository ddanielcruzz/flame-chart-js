(function () {
  'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var domain;

  // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).
  function EventHandlers() {}
  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }

  // nodejs oddity
  // require('events') === require('events').EventEmitter
  EventEmitter.EventEmitter = EventEmitter;

  EventEmitter.usingDomains = false;

  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined;

  // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.
  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function() {
    this.domain = null;
    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active ) ;
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  };

  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.
  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n))
      throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined)
      return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  };

  // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.
  function emitNone(handler, isFn, self) {
    if (isFn)
      handler.call(self);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self);
    }
  }
  function emitOne(handler, isFn, self, arg1) {
    if (isFn)
      handler.call(self, arg1);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1);
    }
  }
  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn)
      handler.call(self, arg1, arg2);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2);
    }
  }
  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn)
      handler.call(self, arg1, arg2, arg3);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].call(self, arg1, arg2, arg3);
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn)
      handler.apply(self, args);
    else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);
      for (var i = 0; i < len; ++i)
        listeners[i].apply(self, args);
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var doError = (type === 'error');

    events = this._events;
    if (events)
      doError = (doError && events.error == null);
    else if (!doError)
      return false;

    domain = this.domain;

    // If there is no 'error' event listener then throw.
    if (doError) {
      er = arguments[1];
      if (domain) {
        if (!er)
          er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
      return false;
    }

    handler = events[type];

    if (!handler)
      return false;

    var isFn = typeof handler === 'function';
    len = arguments.length;
    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;
      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;
      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;
      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower
      default:
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        emitMany(handler, isFn, this, args);
    }

    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;

    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');

    events = target._events;
    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type,
                    listener.listener ? listener.listener : listener);

        // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object
        events = target._events;
      }
      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] :
                                            [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      }

      // Check for listener leak
      if (!existing.warned) {
        m = $getMaxListeners(target);
        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' +
                              existing.length + ' ' + type + ' listeners added. ' +
                              'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }
  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }
  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener =
      function prependListener(type, listener) {
        return _addListener(this, type, listener, true);
      };

  function _onceWrap(target, type, listener) {
    var fired = false;
    function g() {
      target.removeListener(type, g);
      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }
    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function')
      throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener =
      function prependOnceListener(type, listener) {
        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');
        this.prependListener(type, _onceWrap(this, type, listener));
        return this;
      };

  // emits a 'removeListener' event iff the listener was removed
  EventEmitter.prototype.removeListener =
      function removeListener(type, listener) {
        var list, events, position, i, originalListener;

        if (typeof listener !== 'function')
          throw new TypeError('"listener" argument must be a function');

        events = this._events;
        if (!events)
          return this;

        list = events[type];
        if (!list)
          return this;

        if (list === listener || (list.listener && list.listener === listener)) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else {
            delete events[type];
            if (events.removeListener)
              this.emit('removeListener', type, list.listener || listener);
          }
        } else if (typeof list !== 'function') {
          position = -1;

          for (i = list.length; i-- > 0;) {
            if (list[i] === listener ||
                (list[i].listener && list[i].listener === listener)) {
              originalListener = list[i].listener;
              position = i;
              break;
            }
          }

          if (position < 0)
            return this;

          if (list.length === 1) {
            list[0] = undefined;
            if (--this._eventsCount === 0) {
              this._events = new EventHandlers();
              return this;
            } else {
              delete events[type];
            }
          } else {
            spliceOne(list, position);
          }

          if (events.removeListener)
            this.emit('removeListener', type, originalListener || listener);
        }

        return this;
      };

  EventEmitter.prototype.removeAllListeners =
      function removeAllListeners(type) {
        var listeners, events;

        events = this._events;
        if (!events)
          return this;

        // not listening for removeListener, no need to emit
        if (!events.removeListener) {
          if (arguments.length === 0) {
            this._events = new EventHandlers();
            this._eventsCount = 0;
          } else if (events[type]) {
            if (--this._eventsCount === 0)
              this._events = new EventHandlers();
            else
              delete events[type];
          }
          return this;
        }

        // emit removeListener for all listeners on all events
        if (arguments.length === 0) {
          var keys = Object.keys(events);
          for (var i = 0, key; i < keys.length; ++i) {
            key = keys[i];
            if (key === 'removeListener') continue;
            this.removeAllListeners(key);
          }
          this.removeAllListeners('removeListener');
          this._events = new EventHandlers();
          this._eventsCount = 0;
          return this;
        }

        listeners = events[type];

        if (typeof listeners === 'function') {
          this.removeListener(type, listeners);
        } else if (listeners) {
          // LIFO order
          do {
            this.removeListener(type, listeners[listeners.length - 1]);
          } while (listeners[0]);
        }

        return this;
      };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;

    if (!events)
      ret = [];
    else {
      evlistener = events[type];
      if (!evlistener)
        ret = [];
      else if (typeof evlistener === 'function')
        ret = [evlistener.listener || evlistener];
      else
        ret = unwrapListeners(evlistener);
    }

    return ret;
  };

  EventEmitter.listenerCount = function(emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;
  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  };

  // About 1.5x faster than the two-arg version of Array#splice().
  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
      list[i] = list[k];
    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);
    while (i--)
      copy[i] = arr[i];
    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);
    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }
    return ret;
  }

  class UIPlugin extends EventEmitter {
      constructor() {
          super();
      }
      init(renderEngine, interactionsEngine) {
          this.renderEngine = renderEngine;
          this.interactionsEngine = interactionsEngine;
      }
  }

  const MIN_BLOCK_SIZE = 1;
  const STICK_DISTANCE = 0.25;
  const MIN_CLUSTER_SIZE = MIN_BLOCK_SIZE * 2 + STICK_DISTANCE;
  const walk = (treeList, cb, parent = null, level = 0) => {
      treeList.forEach((child) => {
          const res = cb(child, parent, level);
          if (child.children) {
              walk(child.children, cb, res || child, level + 1);
          }
      });
  };
  const flatTree = (treeList) => {
      const result = [];
      let index = 0;
      walk(treeList, (node, parent, level) => {
          const newNode = {
              source: node,
              end: node.start + node.duration,
              parent,
              level,
              index: index++,
          };
          result.push(newNode);
          return newNode;
      });
      return result.sort((a, b) => a.level - b.level || a.source.start - b.source.start);
  };
  const getFlatTreeMinMax = (flatTree) => {
      let isFirst = true;
      let min = 0;
      let max = 0;
      flatTree.forEach(({ source: { start }, end }) => {
          if (isFirst) {
              min = start;
              max = end;
              isFirst = false;
          }
          else {
              min = min < start ? min : start;
              max = max > end ? max : end;
          }
      });
      return { min, max };
  };
  const calcClusterDuration = (nodes) => {
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      return lastNode.source.start + lastNode.source.duration - firstNode.source.start;
  };
  const checkNodeTimeboundNesting = (node, start, end) => (node.source.start < end && node.end > start) || (node.source.start > start && node.end < end);
  const checkClusterTimeboundNesting = (node, start, end) => (node.start < end && node.end > start) || (node.start > start && node.end < end);
  const defaultClusterizeCondition = (prevNode, node) => prevNode.source.color === node.source.color && prevNode.source.type === node.source.type;
  function metaClusterizeFlatTree(flatTree, condition = defaultClusterizeCondition) {
      return flatTree
          .reduce((acc, node) => {
          const lastCluster = acc[acc.length - 1];
          const lastNode = lastCluster && lastCluster[lastCluster.length - 1];
          if (lastNode && lastNode.level === node.level && condition(lastNode, node)) {
              lastCluster.push(node);
          }
          else {
              acc.push([node]);
          }
          return acc;
      }, [])
          .filter((nodes) => nodes.length)
          .map((nodes) => ({
          nodes,
      }));
  }
  const clusterizeFlatTree = (metaClusterizedFlatTree, zoom, start = 0, end = 0, stickDistance = STICK_DISTANCE, minBlockSize = MIN_BLOCK_SIZE) => {
      let lastCluster = null;
      let lastNode = null;
      let index = 0;
      return metaClusterizedFlatTree
          .reduce((acc, { nodes }) => {
          lastCluster = null;
          lastNode = null;
          index = 0;
          for (const node of nodes) {
              if (checkNodeTimeboundNesting(node, start, end)) {
                  if (lastCluster && !lastNode) {
                      lastCluster[index] = node;
                      index++;
                  }
                  else if (lastCluster &&
                      lastNode &&
                      (node.source.start - (lastNode.source.start + lastNode.source.duration)) * zoom <
                          stickDistance &&
                      node.source.duration * zoom < minBlockSize &&
                      lastNode.source.duration * zoom < minBlockSize) {
                      lastCluster[index] = node;
                      index++;
                  }
                  else {
                      lastCluster = [node];
                      index = 1;
                      acc.push(lastCluster);
                  }
                  lastNode = node;
              }
          }
          return acc;
      }, [])
          .map((nodes) => {
          const node = nodes[0];
          const duration = calcClusterDuration(nodes);
          return {
              start: node.source.start,
              end: node.source.start + duration,
              duration,
              type: node.source.type,
              color: node.source.color,
              level: node.level,
              nodes,
          };
      });
  };
  const reclusterizeClusteredFlatTree = (clusteredFlatTree, zoom, start, end, stickDistance, minBlockSize) => {
      return clusteredFlatTree.reduce((acc, cluster) => {
          if (checkClusterTimeboundNesting(cluster, start, end)) {
              if (cluster.duration * zoom <= MIN_CLUSTER_SIZE) {
                  acc.push(cluster);
              }
              else {
                  acc.push(...clusterizeFlatTree([cluster], zoom, start, end, stickDistance, minBlockSize));
              }
          }
          return acc;
      }, []);
  };

  function createCommonjsModule(fn) {
    var module = { exports: {} };
  	return fn(module, module.exports), module.exports;
  }

  var colorName = {
  	"aliceblue": [240, 248, 255],
  	"antiquewhite": [250, 235, 215],
  	"aqua": [0, 255, 255],
  	"aquamarine": [127, 255, 212],
  	"azure": [240, 255, 255],
  	"beige": [245, 245, 220],
  	"bisque": [255, 228, 196],
  	"black": [0, 0, 0],
  	"blanchedalmond": [255, 235, 205],
  	"blue": [0, 0, 255],
  	"blueviolet": [138, 43, 226],
  	"brown": [165, 42, 42],
  	"burlywood": [222, 184, 135],
  	"cadetblue": [95, 158, 160],
  	"chartreuse": [127, 255, 0],
  	"chocolate": [210, 105, 30],
  	"coral": [255, 127, 80],
  	"cornflowerblue": [100, 149, 237],
  	"cornsilk": [255, 248, 220],
  	"crimson": [220, 20, 60],
  	"cyan": [0, 255, 255],
  	"darkblue": [0, 0, 139],
  	"darkcyan": [0, 139, 139],
  	"darkgoldenrod": [184, 134, 11],
  	"darkgray": [169, 169, 169],
  	"darkgreen": [0, 100, 0],
  	"darkgrey": [169, 169, 169],
  	"darkkhaki": [189, 183, 107],
  	"darkmagenta": [139, 0, 139],
  	"darkolivegreen": [85, 107, 47],
  	"darkorange": [255, 140, 0],
  	"darkorchid": [153, 50, 204],
  	"darkred": [139, 0, 0],
  	"darksalmon": [233, 150, 122],
  	"darkseagreen": [143, 188, 143],
  	"darkslateblue": [72, 61, 139],
  	"darkslategray": [47, 79, 79],
  	"darkslategrey": [47, 79, 79],
  	"darkturquoise": [0, 206, 209],
  	"darkviolet": [148, 0, 211],
  	"deeppink": [255, 20, 147],
  	"deepskyblue": [0, 191, 255],
  	"dimgray": [105, 105, 105],
  	"dimgrey": [105, 105, 105],
  	"dodgerblue": [30, 144, 255],
  	"firebrick": [178, 34, 34],
  	"floralwhite": [255, 250, 240],
  	"forestgreen": [34, 139, 34],
  	"fuchsia": [255, 0, 255],
  	"gainsboro": [220, 220, 220],
  	"ghostwhite": [248, 248, 255],
  	"gold": [255, 215, 0],
  	"goldenrod": [218, 165, 32],
  	"gray": [128, 128, 128],
  	"green": [0, 128, 0],
  	"greenyellow": [173, 255, 47],
  	"grey": [128, 128, 128],
  	"honeydew": [240, 255, 240],
  	"hotpink": [255, 105, 180],
  	"indianred": [205, 92, 92],
  	"indigo": [75, 0, 130],
  	"ivory": [255, 255, 240],
  	"khaki": [240, 230, 140],
  	"lavender": [230, 230, 250],
  	"lavenderblush": [255, 240, 245],
  	"lawngreen": [124, 252, 0],
  	"lemonchiffon": [255, 250, 205],
  	"lightblue": [173, 216, 230],
  	"lightcoral": [240, 128, 128],
  	"lightcyan": [224, 255, 255],
  	"lightgoldenrodyellow": [250, 250, 210],
  	"lightgray": [211, 211, 211],
  	"lightgreen": [144, 238, 144],
  	"lightgrey": [211, 211, 211],
  	"lightpink": [255, 182, 193],
  	"lightsalmon": [255, 160, 122],
  	"lightseagreen": [32, 178, 170],
  	"lightskyblue": [135, 206, 250],
  	"lightslategray": [119, 136, 153],
  	"lightslategrey": [119, 136, 153],
  	"lightsteelblue": [176, 196, 222],
  	"lightyellow": [255, 255, 224],
  	"lime": [0, 255, 0],
  	"limegreen": [50, 205, 50],
  	"linen": [250, 240, 230],
  	"magenta": [255, 0, 255],
  	"maroon": [128, 0, 0],
  	"mediumaquamarine": [102, 205, 170],
  	"mediumblue": [0, 0, 205],
  	"mediumorchid": [186, 85, 211],
  	"mediumpurple": [147, 112, 219],
  	"mediumseagreen": [60, 179, 113],
  	"mediumslateblue": [123, 104, 238],
  	"mediumspringgreen": [0, 250, 154],
  	"mediumturquoise": [72, 209, 204],
  	"mediumvioletred": [199, 21, 133],
  	"midnightblue": [25, 25, 112],
  	"mintcream": [245, 255, 250],
  	"mistyrose": [255, 228, 225],
  	"moccasin": [255, 228, 181],
  	"navajowhite": [255, 222, 173],
  	"navy": [0, 0, 128],
  	"oldlace": [253, 245, 230],
  	"olive": [128, 128, 0],
  	"olivedrab": [107, 142, 35],
  	"orange": [255, 165, 0],
  	"orangered": [255, 69, 0],
  	"orchid": [218, 112, 214],
  	"palegoldenrod": [238, 232, 170],
  	"palegreen": [152, 251, 152],
  	"paleturquoise": [175, 238, 238],
  	"palevioletred": [219, 112, 147],
  	"papayawhip": [255, 239, 213],
  	"peachpuff": [255, 218, 185],
  	"peru": [205, 133, 63],
  	"pink": [255, 192, 203],
  	"plum": [221, 160, 221],
  	"powderblue": [176, 224, 230],
  	"purple": [128, 0, 128],
  	"rebeccapurple": [102, 51, 153],
  	"red": [255, 0, 0],
  	"rosybrown": [188, 143, 143],
  	"royalblue": [65, 105, 225],
  	"saddlebrown": [139, 69, 19],
  	"salmon": [250, 128, 114],
  	"sandybrown": [244, 164, 96],
  	"seagreen": [46, 139, 87],
  	"seashell": [255, 245, 238],
  	"sienna": [160, 82, 45],
  	"silver": [192, 192, 192],
  	"skyblue": [135, 206, 235],
  	"slateblue": [106, 90, 205],
  	"slategray": [112, 128, 144],
  	"slategrey": [112, 128, 144],
  	"snow": [255, 250, 250],
  	"springgreen": [0, 255, 127],
  	"steelblue": [70, 130, 180],
  	"tan": [210, 180, 140],
  	"teal": [0, 128, 128],
  	"thistle": [216, 191, 216],
  	"tomato": [255, 99, 71],
  	"turquoise": [64, 224, 208],
  	"violet": [238, 130, 238],
  	"wheat": [245, 222, 179],
  	"white": [255, 255, 255],
  	"whitesmoke": [245, 245, 245],
  	"yellow": [255, 255, 0],
  	"yellowgreen": [154, 205, 50]
  };

  var isArrayish = function isArrayish(obj) {
  	if (!obj || typeof obj === 'string') {
  		return false;
  	}

  	return obj instanceof Array || Array.isArray(obj) ||
  		(obj.length >= 0 && (obj.splice instanceof Function ||
  			(Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
  };

  var simpleSwizzle = createCommonjsModule(function (module) {



  var concat = Array.prototype.concat;
  var slice = Array.prototype.slice;

  var swizzle = module.exports = function swizzle(args) {
  	var results = [];

  	for (var i = 0, len = args.length; i < len; i++) {
  		var arg = args[i];

  		if (isArrayish(arg)) {
  			// http://jsperf.com/javascript-array-concat-vs-push/98
  			results = concat.call(results, slice.call(arg));
  		} else {
  			results.push(arg);
  		}
  	}

  	return results;
  };

  swizzle.wrap = function (fn) {
  	return function () {
  		return fn(swizzle(arguments));
  	};
  };
  });

  /* MIT license */

  var colorString = createCommonjsModule(function (module) {
  var reverseNames = {};

  // create a list of reverse color names
  for (var name in colorName) {
  	if (colorName.hasOwnProperty(name)) {
  		reverseNames[colorName[name]] = name;
  	}
  }

  var cs = module.exports = {
  	to: {},
  	get: {}
  };

  cs.get = function (string) {
  	var prefix = string.substring(0, 3).toLowerCase();
  	var val;
  	var model;
  	switch (prefix) {
  		case 'hsl':
  			val = cs.get.hsl(string);
  			model = 'hsl';
  			break;
  		case 'hwb':
  			val = cs.get.hwb(string);
  			model = 'hwb';
  			break;
  		default:
  			val = cs.get.rgb(string);
  			model = 'rgb';
  			break;
  	}

  	if (!val) {
  		return null;
  	}

  	return {model: model, value: val};
  };

  cs.get.rgb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var abbr = /^#([a-f0-9]{3,4})$/i;
  	var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
  	var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var keyword = /(\D+)/;

  	var rgb = [0, 0, 0, 1];
  	var match;
  	var i;
  	var hexAlpha;

  	if (match = string.match(hex)) {
  		hexAlpha = match[2];
  		match = match[1];

  		for (i = 0; i < 3; i++) {
  			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
  			var i2 = i * 2;
  			rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = parseInt(hexAlpha, 16) / 255;
  		}
  	} else if (match = string.match(abbr)) {
  		match = match[1];
  		hexAlpha = match[3];

  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i] + match[i], 16);
  		}

  		if (hexAlpha) {
  			rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
  		}
  	} else if (match = string.match(rgba)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = parseInt(match[i + 1], 0);
  		}

  		if (match[4]) {
  			rgb[3] = parseFloat(match[4]);
  		}
  	} else if (match = string.match(per)) {
  		for (i = 0; i < 3; i++) {
  			rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
  		}

  		if (match[4]) {
  			rgb[3] = parseFloat(match[4]);
  		}
  	} else if (match = string.match(keyword)) {
  		if (match[1] === 'transparent') {
  			return [0, 0, 0, 0];
  		}

  		rgb = colorName[match[1]];

  		if (!rgb) {
  			return null;
  		}

  		rgb[3] = 1;

  		return rgb;
  	} else {
  		return null;
  	}

  	for (i = 0; i < 3; i++) {
  		rgb[i] = clamp(rgb[i], 0, 255);
  	}
  	rgb[3] = clamp(rgb[3], 0, 1);

  	return rgb;
  };

  cs.get.hsl = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var match = string.match(hsl);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = (parseFloat(match[1]) + 360) % 360;
  		var s = clamp(parseFloat(match[2]), 0, 100);
  		var l = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

  		return [h, s, l, a];
  	}

  	return null;
  };

  cs.get.hwb = function (string) {
  	if (!string) {
  		return null;
  	}

  	var hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
  	var match = string.match(hwb);

  	if (match) {
  		var alpha = parseFloat(match[4]);
  		var h = ((parseFloat(match[1]) % 360) + 360) % 360;
  		var w = clamp(parseFloat(match[2]), 0, 100);
  		var b = clamp(parseFloat(match[3]), 0, 100);
  		var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
  		return [h, w, b, a];
  	}

  	return null;
  };

  cs.to.hex = function () {
  	var rgba = simpleSwizzle(arguments);

  	return (
  		'#' +
  		hexDouble(rgba[0]) +
  		hexDouble(rgba[1]) +
  		hexDouble(rgba[2]) +
  		(rgba[3] < 1
  			? (hexDouble(Math.round(rgba[3] * 255)))
  			: '')
  	);
  };

  cs.to.rgb = function () {
  	var rgba = simpleSwizzle(arguments);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
  		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
  };

  cs.to.rgb.percent = function () {
  	var rgba = simpleSwizzle(arguments);

  	var r = Math.round(rgba[0] / 255 * 100);
  	var g = Math.round(rgba[1] / 255 * 100);
  	var b = Math.round(rgba[2] / 255 * 100);

  	return rgba.length < 4 || rgba[3] === 1
  		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
  		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
  };

  cs.to.hsl = function () {
  	var hsla = simpleSwizzle(arguments);
  	return hsla.length < 4 || hsla[3] === 1
  		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
  		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
  };

  // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
  // (hwb have alpha optional & 1 is default value)
  cs.to.hwb = function () {
  	var hwba = simpleSwizzle(arguments);

  	var a = '';
  	if (hwba.length >= 4 && hwba[3] !== 1) {
  		a = ', ' + hwba[3];
  	}

  	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
  };

  cs.to.keyword = function (rgb) {
  	return reverseNames[rgb.slice(0, 3)];
  };

  // helpers
  function clamp(num, min, max) {
  	return Math.min(Math.max(min, num), max);
  }

  function hexDouble(num) {
  	var str = num.toString(16).toUpperCase();
  	return (str.length < 2) ? '0' + str : str;
  }
  });

  /* MIT license */

  var conversions = createCommonjsModule(function (module) {
  // NOTE: conversions should only return primitive values (i.e. arrays, or
  //       values that give correct `typeof` results).
  //       do not use box values types (i.e. Number(), String(), etc.)

  var reverseKeywords = {};
  for (var key in colorName) {
  	if (colorName.hasOwnProperty(key)) {
  		reverseKeywords[colorName[key]] = key;
  	}
  }

  var convert = module.exports = {
  	rgb: {channels: 3, labels: 'rgb'},
  	hsl: {channels: 3, labels: 'hsl'},
  	hsv: {channels: 3, labels: 'hsv'},
  	hwb: {channels: 3, labels: 'hwb'},
  	cmyk: {channels: 4, labels: 'cmyk'},
  	xyz: {channels: 3, labels: 'xyz'},
  	lab: {channels: 3, labels: 'lab'},
  	lch: {channels: 3, labels: 'lch'},
  	hex: {channels: 1, labels: ['hex']},
  	keyword: {channels: 1, labels: ['keyword']},
  	ansi16: {channels: 1, labels: ['ansi16']},
  	ansi256: {channels: 1, labels: ['ansi256']},
  	hcg: {channels: 3, labels: ['h', 'c', 'g']},
  	apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
  	gray: {channels: 1, labels: ['gray']}
  };

  // hide .channels and .labels properties
  for (var model in convert) {
  	if (convert.hasOwnProperty(model)) {
  		if (!('channels' in convert[model])) {
  			throw new Error('missing channels property: ' + model);
  		}

  		if (!('labels' in convert[model])) {
  			throw new Error('missing channel labels property: ' + model);
  		}

  		if (convert[model].labels.length !== convert[model].channels) {
  			throw new Error('channel and label counts mismatch: ' + model);
  		}

  		var channels = convert[model].channels;
  		var labels = convert[model].labels;
  		delete convert[model].channels;
  		delete convert[model].labels;
  		Object.defineProperty(convert[model], 'channels', {value: channels});
  		Object.defineProperty(convert[model], 'labels', {value: labels});
  	}
  }

  convert.rgb.hsl = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var min = Math.min(r, g, b);
  	var max = Math.max(r, g, b);
  	var delta = max - min;
  	var h;
  	var s;
  	var l;

  	if (max === min) {
  		h = 0;
  	} else if (r === max) {
  		h = (g - b) / delta;
  	} else if (g === max) {
  		h = 2 + (b - r) / delta;
  	} else if (b === max) {
  		h = 4 + (r - g) / delta;
  	}

  	h = Math.min(h * 60, 360);

  	if (h < 0) {
  		h += 360;
  	}

  	l = (min + max) / 2;

  	if (max === min) {
  		s = 0;
  	} else if (l <= 0.5) {
  		s = delta / (max + min);
  	} else {
  		s = delta / (2 - max - min);
  	}

  	return [h, s * 100, l * 100];
  };

  convert.rgb.hsv = function (rgb) {
  	var rdif;
  	var gdif;
  	var bdif;
  	var h;
  	var s;

  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var v = Math.max(r, g, b);
  	var diff = v - Math.min(r, g, b);
  	var diffc = function (c) {
  		return (v - c) / 6 / diff + 1 / 2;
  	};

  	if (diff === 0) {
  		h = s = 0;
  	} else {
  		s = diff / v;
  		rdif = diffc(r);
  		gdif = diffc(g);
  		bdif = diffc(b);

  		if (r === v) {
  			h = bdif - gdif;
  		} else if (g === v) {
  			h = (1 / 3) + rdif - bdif;
  		} else if (b === v) {
  			h = (2 / 3) + gdif - rdif;
  		}
  		if (h < 0) {
  			h += 1;
  		} else if (h > 1) {
  			h -= 1;
  		}
  	}

  	return [
  		h * 360,
  		s * 100,
  		v * 100
  	];
  };

  convert.rgb.hwb = function (rgb) {
  	var r = rgb[0];
  	var g = rgb[1];
  	var b = rgb[2];
  	var h = convert.rgb.hsl(rgb)[0];
  	var w = 1 / 255 * Math.min(r, Math.min(g, b));

  	b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

  	return [h, w * 100, b * 100];
  };

  convert.rgb.cmyk = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var c;
  	var m;
  	var y;
  	var k;

  	k = Math.min(1 - r, 1 - g, 1 - b);
  	c = (1 - r - k) / (1 - k) || 0;
  	m = (1 - g - k) / (1 - k) || 0;
  	y = (1 - b - k) / (1 - k) || 0;

  	return [c * 100, m * 100, y * 100, k * 100];
  };

  /**
   * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
   * */
  function comparativeDistance(x, y) {
  	return (
  		Math.pow(x[0] - y[0], 2) +
  		Math.pow(x[1] - y[1], 2) +
  		Math.pow(x[2] - y[2], 2)
  	);
  }

  convert.rgb.keyword = function (rgb) {
  	var reversed = reverseKeywords[rgb];
  	if (reversed) {
  		return reversed;
  	}

  	var currentClosestDistance = Infinity;
  	var currentClosestKeyword;

  	for (var keyword in colorName) {
  		if (colorName.hasOwnProperty(keyword)) {
  			var value = colorName[keyword];

  			// Compute comparative distance
  			var distance = comparativeDistance(rgb, value);

  			// Check if its less, if so set as closest
  			if (distance < currentClosestDistance) {
  				currentClosestDistance = distance;
  				currentClosestKeyword = keyword;
  			}
  		}
  	}

  	return currentClosestKeyword;
  };

  convert.keyword.rgb = function (keyword) {
  	return colorName[keyword];
  };

  convert.rgb.xyz = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;

  	// assume sRGB
  	r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
  	g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
  	b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

  	var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
  	var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
  	var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

  	return [x * 100, y * 100, z * 100];
  };

  convert.rgb.lab = function (rgb) {
  	var xyz = convert.rgb.xyz(rgb);
  	var x = xyz[0];
  	var y = xyz[1];
  	var z = xyz[2];
  	var l;
  	var a;
  	var b;

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  	l = (116 * y) - 16;
  	a = 500 * (x - y);
  	b = 200 * (y - z);

  	return [l, a, b];
  };

  convert.hsl.rgb = function (hsl) {
  	var h = hsl[0] / 360;
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var t1;
  	var t2;
  	var t3;
  	var rgb;
  	var val;

  	if (s === 0) {
  		val = l * 255;
  		return [val, val, val];
  	}

  	if (l < 0.5) {
  		t2 = l * (1 + s);
  	} else {
  		t2 = l + s - l * s;
  	}

  	t1 = 2 * l - t2;

  	rgb = [0, 0, 0];
  	for (var i = 0; i < 3; i++) {
  		t3 = h + 1 / 3 * -(i - 1);
  		if (t3 < 0) {
  			t3++;
  		}
  		if (t3 > 1) {
  			t3--;
  		}

  		if (6 * t3 < 1) {
  			val = t1 + (t2 - t1) * 6 * t3;
  		} else if (2 * t3 < 1) {
  			val = t2;
  		} else if (3 * t3 < 2) {
  			val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
  		} else {
  			val = t1;
  		}

  		rgb[i] = val * 255;
  	}

  	return rgb;
  };

  convert.hsl.hsv = function (hsl) {
  	var h = hsl[0];
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var smin = s;
  	var lmin = Math.max(l, 0.01);
  	var sv;
  	var v;

  	l *= 2;
  	s *= (l <= 1) ? l : 2 - l;
  	smin *= lmin <= 1 ? lmin : 2 - lmin;
  	v = (l + s) / 2;
  	sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

  	return [h, sv * 100, v * 100];
  };

  convert.hsv.rgb = function (hsv) {
  	var h = hsv[0] / 60;
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;
  	var hi = Math.floor(h) % 6;

  	var f = h - Math.floor(h);
  	var p = 255 * v * (1 - s);
  	var q = 255 * v * (1 - (s * f));
  	var t = 255 * v * (1 - (s * (1 - f)));
  	v *= 255;

  	switch (hi) {
  		case 0:
  			return [v, t, p];
  		case 1:
  			return [q, v, p];
  		case 2:
  			return [p, v, t];
  		case 3:
  			return [p, q, v];
  		case 4:
  			return [t, p, v];
  		case 5:
  			return [v, p, q];
  	}
  };

  convert.hsv.hsl = function (hsv) {
  	var h = hsv[0];
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;
  	var vmin = Math.max(v, 0.01);
  	var lmin;
  	var sl;
  	var l;

  	l = (2 - s) * v;
  	lmin = (2 - s) * vmin;
  	sl = s * vmin;
  	sl /= (lmin <= 1) ? lmin : 2 - lmin;
  	sl = sl || 0;
  	l /= 2;

  	return [h, sl * 100, l * 100];
  };

  // http://dev.w3.org/csswg/css-color/#hwb-to-rgb
  convert.hwb.rgb = function (hwb) {
  	var h = hwb[0] / 360;
  	var wh = hwb[1] / 100;
  	var bl = hwb[2] / 100;
  	var ratio = wh + bl;
  	var i;
  	var v;
  	var f;
  	var n;

  	// wh + bl cant be > 1
  	if (ratio > 1) {
  		wh /= ratio;
  		bl /= ratio;
  	}

  	i = Math.floor(6 * h);
  	v = 1 - bl;
  	f = 6 * h - i;

  	if ((i & 0x01) !== 0) {
  		f = 1 - f;
  	}

  	n = wh + f * (v - wh); // linear interpolation

  	var r;
  	var g;
  	var b;
  	switch (i) {
  		default:
  		case 6:
  		case 0: r = v; g = n; b = wh; break;
  		case 1: r = n; g = v; b = wh; break;
  		case 2: r = wh; g = v; b = n; break;
  		case 3: r = wh; g = n; b = v; break;
  		case 4: r = n; g = wh; b = v; break;
  		case 5: r = v; g = wh; b = n; break;
  	}

  	return [r * 255, g * 255, b * 255];
  };

  convert.cmyk.rgb = function (cmyk) {
  	var c = cmyk[0] / 100;
  	var m = cmyk[1] / 100;
  	var y = cmyk[2] / 100;
  	var k = cmyk[3] / 100;
  	var r;
  	var g;
  	var b;

  	r = 1 - Math.min(1, c * (1 - k) + k);
  	g = 1 - Math.min(1, m * (1 - k) + k);
  	b = 1 - Math.min(1, y * (1 - k) + k);

  	return [r * 255, g * 255, b * 255];
  };

  convert.xyz.rgb = function (xyz) {
  	var x = xyz[0] / 100;
  	var y = xyz[1] / 100;
  	var z = xyz[2] / 100;
  	var r;
  	var g;
  	var b;

  	r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
  	g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
  	b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

  	// assume sRGB
  	r = r > 0.0031308
  		? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
  		: r * 12.92;

  	g = g > 0.0031308
  		? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
  		: g * 12.92;

  	b = b > 0.0031308
  		? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
  		: b * 12.92;

  	r = Math.min(Math.max(0, r), 1);
  	g = Math.min(Math.max(0, g), 1);
  	b = Math.min(Math.max(0, b), 1);

  	return [r * 255, g * 255, b * 255];
  };

  convert.xyz.lab = function (xyz) {
  	var x = xyz[0];
  	var y = xyz[1];
  	var z = xyz[2];
  	var l;
  	var a;
  	var b;

  	x /= 95.047;
  	y /= 100;
  	z /= 108.883;

  	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
  	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
  	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

  	l = (116 * y) - 16;
  	a = 500 * (x - y);
  	b = 200 * (y - z);

  	return [l, a, b];
  };

  convert.lab.xyz = function (lab) {
  	var l = lab[0];
  	var a = lab[1];
  	var b = lab[2];
  	var x;
  	var y;
  	var z;

  	y = (l + 16) / 116;
  	x = a / 500 + y;
  	z = y - b / 200;

  	var y2 = Math.pow(y, 3);
  	var x2 = Math.pow(x, 3);
  	var z2 = Math.pow(z, 3);
  	y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
  	x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
  	z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

  	x *= 95.047;
  	y *= 100;
  	z *= 108.883;

  	return [x, y, z];
  };

  convert.lab.lch = function (lab) {
  	var l = lab[0];
  	var a = lab[1];
  	var b = lab[2];
  	var hr;
  	var h;
  	var c;

  	hr = Math.atan2(b, a);
  	h = hr * 360 / 2 / Math.PI;

  	if (h < 0) {
  		h += 360;
  	}

  	c = Math.sqrt(a * a + b * b);

  	return [l, c, h];
  };

  convert.lch.lab = function (lch) {
  	var l = lch[0];
  	var c = lch[1];
  	var h = lch[2];
  	var a;
  	var b;
  	var hr;

  	hr = h / 360 * 2 * Math.PI;
  	a = c * Math.cos(hr);
  	b = c * Math.sin(hr);

  	return [l, a, b];
  };

  convert.rgb.ansi16 = function (args) {
  	var r = args[0];
  	var g = args[1];
  	var b = args[2];
  	var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

  	value = Math.round(value / 50);

  	if (value === 0) {
  		return 30;
  	}

  	var ansi = 30
  		+ ((Math.round(b / 255) << 2)
  		| (Math.round(g / 255) << 1)
  		| Math.round(r / 255));

  	if (value === 2) {
  		ansi += 60;
  	}

  	return ansi;
  };

  convert.hsv.ansi16 = function (args) {
  	// optimization here; we already know the value and don't need to get
  	// it converted for us.
  	return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };

  convert.rgb.ansi256 = function (args) {
  	var r = args[0];
  	var g = args[1];
  	var b = args[2];

  	// we use the extended greyscale palette here, with the exception of
  	// black and white. normal palette only has 4 greyscale shades.
  	if (r === g && g === b) {
  		if (r < 8) {
  			return 16;
  		}

  		if (r > 248) {
  			return 231;
  		}

  		return Math.round(((r - 8) / 247) * 24) + 232;
  	}

  	var ansi = 16
  		+ (36 * Math.round(r / 255 * 5))
  		+ (6 * Math.round(g / 255 * 5))
  		+ Math.round(b / 255 * 5);

  	return ansi;
  };

  convert.ansi16.rgb = function (args) {
  	var color = args % 10;

  	// handle greyscale
  	if (color === 0 || color === 7) {
  		if (args > 50) {
  			color += 3.5;
  		}

  		color = color / 10.5 * 255;

  		return [color, color, color];
  	}

  	var mult = (~~(args > 50) + 1) * 0.5;
  	var r = ((color & 1) * mult) * 255;
  	var g = (((color >> 1) & 1) * mult) * 255;
  	var b = (((color >> 2) & 1) * mult) * 255;

  	return [r, g, b];
  };

  convert.ansi256.rgb = function (args) {
  	// handle greyscale
  	if (args >= 232) {
  		var c = (args - 232) * 10 + 8;
  		return [c, c, c];
  	}

  	args -= 16;

  	var rem;
  	var r = Math.floor(args / 36) / 5 * 255;
  	var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
  	var b = (rem % 6) / 5 * 255;

  	return [r, g, b];
  };

  convert.rgb.hex = function (args) {
  	var integer = ((Math.round(args[0]) & 0xFF) << 16)
  		+ ((Math.round(args[1]) & 0xFF) << 8)
  		+ (Math.round(args[2]) & 0xFF);

  	var string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert.hex.rgb = function (args) {
  	var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  	if (!match) {
  		return [0, 0, 0];
  	}

  	var colorString = match[0];

  	if (match[0].length === 3) {
  		colorString = colorString.split('').map(function (char) {
  			return char + char;
  		}).join('');
  	}

  	var integer = parseInt(colorString, 16);
  	var r = (integer >> 16) & 0xFF;
  	var g = (integer >> 8) & 0xFF;
  	var b = integer & 0xFF;

  	return [r, g, b];
  };

  convert.rgb.hcg = function (rgb) {
  	var r = rgb[0] / 255;
  	var g = rgb[1] / 255;
  	var b = rgb[2] / 255;
  	var max = Math.max(Math.max(r, g), b);
  	var min = Math.min(Math.min(r, g), b);
  	var chroma = (max - min);
  	var grayscale;
  	var hue;

  	if (chroma < 1) {
  		grayscale = min / (1 - chroma);
  	} else {
  		grayscale = 0;
  	}

  	if (chroma <= 0) {
  		hue = 0;
  	} else
  	if (max === r) {
  		hue = ((g - b) / chroma) % 6;
  	} else
  	if (max === g) {
  		hue = 2 + (b - r) / chroma;
  	} else {
  		hue = 4 + (r - g) / chroma + 4;
  	}

  	hue /= 6;
  	hue %= 1;

  	return [hue * 360, chroma * 100, grayscale * 100];
  };

  convert.hsl.hcg = function (hsl) {
  	var s = hsl[1] / 100;
  	var l = hsl[2] / 100;
  	var c = 1;
  	var f = 0;

  	if (l < 0.5) {
  		c = 2.0 * s * l;
  	} else {
  		c = 2.0 * s * (1.0 - l);
  	}

  	if (c < 1.0) {
  		f = (l - 0.5 * c) / (1.0 - c);
  	}

  	return [hsl[0], c * 100, f * 100];
  };

  convert.hsv.hcg = function (hsv) {
  	var s = hsv[1] / 100;
  	var v = hsv[2] / 100;

  	var c = s * v;
  	var f = 0;

  	if (c < 1.0) {
  		f = (v - c) / (1 - c);
  	}

  	return [hsv[0], c * 100, f * 100];
  };

  convert.hcg.rgb = function (hcg) {
  	var h = hcg[0] / 360;
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	if (c === 0.0) {
  		return [g * 255, g * 255, g * 255];
  	}

  	var pure = [0, 0, 0];
  	var hi = (h % 1) * 6;
  	var v = hi % 1;
  	var w = 1 - v;
  	var mg = 0;

  	switch (Math.floor(hi)) {
  		case 0:
  			pure[0] = 1; pure[1] = v; pure[2] = 0; break;
  		case 1:
  			pure[0] = w; pure[1] = 1; pure[2] = 0; break;
  		case 2:
  			pure[0] = 0; pure[1] = 1; pure[2] = v; break;
  		case 3:
  			pure[0] = 0; pure[1] = w; pure[2] = 1; break;
  		case 4:
  			pure[0] = v; pure[1] = 0; pure[2] = 1; break;
  		default:
  			pure[0] = 1; pure[1] = 0; pure[2] = w;
  	}

  	mg = (1.0 - c) * g;

  	return [
  		(c * pure[0] + mg) * 255,
  		(c * pure[1] + mg) * 255,
  		(c * pure[2] + mg) * 255
  	];
  };

  convert.hcg.hsv = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	var v = c + g * (1.0 - c);
  	var f = 0;

  	if (v > 0.0) {
  		f = c / v;
  	}

  	return [hcg[0], f * 100, v * 100];
  };

  convert.hcg.hsl = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;

  	var l = g * (1.0 - c) + 0.5 * c;
  	var s = 0;

  	if (l > 0.0 && l < 0.5) {
  		s = c / (2 * l);
  	} else
  	if (l >= 0.5 && l < 1.0) {
  		s = c / (2 * (1 - l));
  	}

  	return [hcg[0], s * 100, l * 100];
  };

  convert.hcg.hwb = function (hcg) {
  	var c = hcg[1] / 100;
  	var g = hcg[2] / 100;
  	var v = c + g * (1.0 - c);
  	return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };

  convert.hwb.hcg = function (hwb) {
  	var w = hwb[1] / 100;
  	var b = hwb[2] / 100;
  	var v = 1 - b;
  	var c = v - w;
  	var g = 0;

  	if (c < 1) {
  		g = (v - c) / (1 - c);
  	}

  	return [hwb[0], c * 100, g * 100];
  };

  convert.apple.rgb = function (apple) {
  	return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
  };

  convert.rgb.apple = function (rgb) {
  	return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
  };

  convert.gray.rgb = function (args) {
  	return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };

  convert.gray.hsl = convert.gray.hsv = function (args) {
  	return [0, 0, args[0]];
  };

  convert.gray.hwb = function (gray) {
  	return [0, 100, gray[0]];
  };

  convert.gray.cmyk = function (gray) {
  	return [0, 0, 0, gray[0]];
  };

  convert.gray.lab = function (gray) {
  	return [gray[0], 0, 0];
  };

  convert.gray.hex = function (gray) {
  	var val = Math.round(gray[0] / 100 * 255) & 0xFF;
  	var integer = (val << 16) + (val << 8) + val;

  	var string = integer.toString(16).toUpperCase();
  	return '000000'.substring(string.length) + string;
  };

  convert.rgb.gray = function (rgb) {
  	var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
  	return [val / 255 * 100];
  };
  });

  /*
  	this function routes a model to all other models.

  	all functions that are routed have a property `.conversion` attached
  	to the returned synthetic function. This property is an array
  	of strings, each with the steps in between the 'from' and 'to'
  	color models (inclusive).

  	conversions that are not possible simply are not included.
  */

  function buildGraph() {
  	var graph = {};
  	// https://jsperf.com/object-keys-vs-for-in-with-closure/3
  	var models = Object.keys(conversions);

  	for (var len = models.length, i = 0; i < len; i++) {
  		graph[models[i]] = {
  			// http://jsperf.com/1-vs-infinity
  			// micro-opt, but this is simple.
  			distance: -1,
  			parent: null
  		};
  	}

  	return graph;
  }

  // https://en.wikipedia.org/wiki/Breadth-first_search
  function deriveBFS(fromModel) {
  	var graph = buildGraph();
  	var queue = [fromModel]; // unshift -> queue -> pop

  	graph[fromModel].distance = 0;

  	while (queue.length) {
  		var current = queue.pop();
  		var adjacents = Object.keys(conversions[current]);

  		for (var len = adjacents.length, i = 0; i < len; i++) {
  			var adjacent = adjacents[i];
  			var node = graph[adjacent];

  			if (node.distance === -1) {
  				node.distance = graph[current].distance + 1;
  				node.parent = current;
  				queue.unshift(adjacent);
  			}
  		}
  	}

  	return graph;
  }

  function link(from, to) {
  	return function (args) {
  		return to(from(args));
  	};
  }

  function wrapConversion(toModel, graph) {
  	var path = [graph[toModel].parent, toModel];
  	var fn = conversions[graph[toModel].parent][toModel];

  	var cur = graph[toModel].parent;
  	while (graph[cur].parent) {
  		path.unshift(graph[cur].parent);
  		fn = link(conversions[graph[cur].parent][cur], fn);
  		cur = graph[cur].parent;
  	}

  	fn.conversion = path;
  	return fn;
  }

  var route = function (fromModel) {
  	var graph = deriveBFS(fromModel);
  	var conversion = {};

  	var models = Object.keys(graph);
  	for (var len = models.length, i = 0; i < len; i++) {
  		var toModel = models[i];
  		var node = graph[toModel];

  		if (node.parent === null) {
  			// no possible conversion, or this node is the source model.
  			continue;
  		}

  		conversion[toModel] = wrapConversion(toModel, graph);
  	}

  	return conversion;
  };

  var convert = {};

  var models = Object.keys(conversions);

  function wrapRaw(fn) {
  	var wrappedFn = function (args) {
  		if (args === undefined || args === null) {
  			return args;
  		}

  		if (arguments.length > 1) {
  			args = Array.prototype.slice.call(arguments);
  		}

  		return fn(args);
  	};

  	// preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  function wrapRounded(fn) {
  	var wrappedFn = function (args) {
  		if (args === undefined || args === null) {
  			return args;
  		}

  		if (arguments.length > 1) {
  			args = Array.prototype.slice.call(arguments);
  		}

  		var result = fn(args);

  		// we're assuming the result is an array here.
  		// see notice in conversions.js; don't use box types
  		// in conversion functions.
  		if (typeof result === 'object') {
  			for (var len = result.length, i = 0; i < len; i++) {
  				result[i] = Math.round(result[i]);
  			}
  		}

  		return result;
  	};

  	// preserve .conversion property if there is one
  	if ('conversion' in fn) {
  		wrappedFn.conversion = fn.conversion;
  	}

  	return wrappedFn;
  }

  models.forEach(function (fromModel) {
  	convert[fromModel] = {};

  	Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
  	Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

  	var routes = route(fromModel);
  	var routeModels = Object.keys(routes);

  	routeModels.forEach(function (toModel) {
  		var fn = routes[toModel];

  		convert[fromModel][toModel] = wrapRounded(fn);
  		convert[fromModel][toModel].raw = wrapRaw(fn);
  	});
  });

  var colorConvert = convert;

  var _slice = [].slice;

  var skippedModels = [
  	// to be honest, I don't really feel like keyword belongs in color convert, but eh.
  	'keyword',

  	// gray conflicts with some method names, and has its own method defined.
  	'gray',

  	// shouldn't really be in color-convert either...
  	'hex'
  ];

  var hashedModelKeys = {};
  Object.keys(colorConvert).forEach(function (model) {
  	hashedModelKeys[_slice.call(colorConvert[model].labels).sort().join('')] = model;
  });

  var limiters = {};

  function Color(obj, model) {
  	if (!(this instanceof Color)) {
  		return new Color(obj, model);
  	}

  	if (model && model in skippedModels) {
  		model = null;
  	}

  	if (model && !(model in colorConvert)) {
  		throw new Error('Unknown model: ' + model);
  	}

  	var i;
  	var channels;

  	if (obj == null) { // eslint-disable-line no-eq-null,eqeqeq
  		this.model = 'rgb';
  		this.color = [0, 0, 0];
  		this.valpha = 1;
  	} else if (obj instanceof Color) {
  		this.model = obj.model;
  		this.color = obj.color.slice();
  		this.valpha = obj.valpha;
  	} else if (typeof obj === 'string') {
  		var result = colorString.get(obj);
  		if (result === null) {
  			throw new Error('Unable to parse color from string: ' + obj);
  		}

  		this.model = result.model;
  		channels = colorConvert[this.model].channels;
  		this.color = result.value.slice(0, channels);
  		this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
  	} else if (obj.length) {
  		this.model = model || 'rgb';
  		channels = colorConvert[this.model].channels;
  		var newArr = _slice.call(obj, 0, channels);
  		this.color = zeroArray(newArr, channels);
  		this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
  	} else if (typeof obj === 'number') {
  		// this is always RGB - can be converted later on.
  		obj &= 0xFFFFFF;
  		this.model = 'rgb';
  		this.color = [
  			(obj >> 16) & 0xFF,
  			(obj >> 8) & 0xFF,
  			obj & 0xFF
  		];
  		this.valpha = 1;
  	} else {
  		this.valpha = 1;

  		var keys = Object.keys(obj);
  		if ('alpha' in obj) {
  			keys.splice(keys.indexOf('alpha'), 1);
  			this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
  		}

  		var hashedKeys = keys.sort().join('');
  		if (!(hashedKeys in hashedModelKeys)) {
  			throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
  		}

  		this.model = hashedModelKeys[hashedKeys];

  		var labels = colorConvert[this.model].labels;
  		var color = [];
  		for (i = 0; i < labels.length; i++) {
  			color.push(obj[labels[i]]);
  		}

  		this.color = zeroArray(color);
  	}

  	// perform limitations (clamping, etc.)
  	if (limiters[this.model]) {
  		channels = colorConvert[this.model].channels;
  		for (i = 0; i < channels; i++) {
  			var limit = limiters[this.model][i];
  			if (limit) {
  				this.color[i] = limit(this.color[i]);
  			}
  		}
  	}

  	this.valpha = Math.max(0, Math.min(1, this.valpha));

  	if (Object.freeze) {
  		Object.freeze(this);
  	}
  }

  Color.prototype = {
  	toString: function () {
  		return this.string();
  	},

  	toJSON: function () {
  		return this[this.model]();
  	},

  	string: function (places) {
  		var self = this.model in colorString.to ? this : this.rgb();
  		self = self.round(typeof places === 'number' ? places : 1);
  		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to[self.model](args);
  	},

  	percentString: function (places) {
  		var self = this.rgb().round(typeof places === 'number' ? places : 1);
  		var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
  		return colorString.to.rgb.percent(args);
  	},

  	array: function () {
  		return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
  	},

  	object: function () {
  		var result = {};
  		var channels = colorConvert[this.model].channels;
  		var labels = colorConvert[this.model].labels;

  		for (var i = 0; i < channels; i++) {
  			result[labels[i]] = this.color[i];
  		}

  		if (this.valpha !== 1) {
  			result.alpha = this.valpha;
  		}

  		return result;
  	},

  	unitArray: function () {
  		var rgb = this.rgb().color;
  		rgb[0] /= 255;
  		rgb[1] /= 255;
  		rgb[2] /= 255;

  		if (this.valpha !== 1) {
  			rgb.push(this.valpha);
  		}

  		return rgb;
  	},

  	unitObject: function () {
  		var rgb = this.rgb().object();
  		rgb.r /= 255;
  		rgb.g /= 255;
  		rgb.b /= 255;

  		if (this.valpha !== 1) {
  			rgb.alpha = this.valpha;
  		}

  		return rgb;
  	},

  	round: function (places) {
  		places = Math.max(places || 0, 0);
  		return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
  	},

  	alpha: function (val) {
  		if (arguments.length) {
  			return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
  		}

  		return this.valpha;
  	},

  	// rgb
  	red: getset('rgb', 0, maxfn(255)),
  	green: getset('rgb', 1, maxfn(255)),
  	blue: getset('rgb', 2, maxfn(255)),

  	hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) { return ((val % 360) + 360) % 360; }), // eslint-disable-line brace-style

  	saturationl: getset('hsl', 1, maxfn(100)),
  	lightness: getset('hsl', 2, maxfn(100)),

  	saturationv: getset('hsv', 1, maxfn(100)),
  	value: getset('hsv', 2, maxfn(100)),

  	chroma: getset('hcg', 1, maxfn(100)),
  	gray: getset('hcg', 2, maxfn(100)),

  	white: getset('hwb', 1, maxfn(100)),
  	wblack: getset('hwb', 2, maxfn(100)),

  	cyan: getset('cmyk', 0, maxfn(100)),
  	magenta: getset('cmyk', 1, maxfn(100)),
  	yellow: getset('cmyk', 2, maxfn(100)),
  	black: getset('cmyk', 3, maxfn(100)),

  	x: getset('xyz', 0, maxfn(100)),
  	y: getset('xyz', 1, maxfn(100)),
  	z: getset('xyz', 2, maxfn(100)),

  	l: getset('lab', 0, maxfn(100)),
  	a: getset('lab', 1),
  	b: getset('lab', 2),

  	keyword: function (val) {
  		if (arguments.length) {
  			return new Color(val);
  		}

  		return colorConvert[this.model].keyword(this.color);
  	},

  	hex: function (val) {
  		if (arguments.length) {
  			return new Color(val);
  		}

  		return colorString.to.hex(this.rgb().round().color);
  	},

  	rgbNumber: function () {
  		var rgb = this.rgb().color;
  		return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
  	},

  	luminosity: function () {
  		// http://www.w3.org/TR/WCAG20/#relativeluminancedef
  		var rgb = this.rgb().color;

  		var lum = [];
  		for (var i = 0; i < rgb.length; i++) {
  			var chan = rgb[i] / 255;
  			lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
  		}

  		return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  	},

  	contrast: function (color2) {
  		// http://www.w3.org/TR/WCAG20/#contrast-ratiodef
  		var lum1 = this.luminosity();
  		var lum2 = color2.luminosity();

  		if (lum1 > lum2) {
  			return (lum1 + 0.05) / (lum2 + 0.05);
  		}

  		return (lum2 + 0.05) / (lum1 + 0.05);
  	},

  	level: function (color2) {
  		var contrastRatio = this.contrast(color2);
  		if (contrastRatio >= 7.1) {
  			return 'AAA';
  		}

  		return (contrastRatio >= 4.5) ? 'AA' : '';
  	},

  	isDark: function () {
  		// YIQ equation from http://24ways.org/2010/calculating-color-contrast
  		var rgb = this.rgb().color;
  		var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
  		return yiq < 128;
  	},

  	isLight: function () {
  		return !this.isDark();
  	},

  	negate: function () {
  		var rgb = this.rgb();
  		for (var i = 0; i < 3; i++) {
  			rgb.color[i] = 255 - rgb.color[i];
  		}
  		return rgb;
  	},

  	lighten: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[2] += hsl.color[2] * ratio;
  		return hsl;
  	},

  	darken: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[2] -= hsl.color[2] * ratio;
  		return hsl;
  	},

  	saturate: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[1] += hsl.color[1] * ratio;
  		return hsl;
  	},

  	desaturate: function (ratio) {
  		var hsl = this.hsl();
  		hsl.color[1] -= hsl.color[1] * ratio;
  		return hsl;
  	},

  	whiten: function (ratio) {
  		var hwb = this.hwb();
  		hwb.color[1] += hwb.color[1] * ratio;
  		return hwb;
  	},

  	blacken: function (ratio) {
  		var hwb = this.hwb();
  		hwb.color[2] += hwb.color[2] * ratio;
  		return hwb;
  	},

  	grayscale: function () {
  		// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
  		var rgb = this.rgb().color;
  		var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
  		return Color.rgb(val, val, val);
  	},

  	fade: function (ratio) {
  		return this.alpha(this.valpha - (this.valpha * ratio));
  	},

  	opaquer: function (ratio) {
  		return this.alpha(this.valpha + (this.valpha * ratio));
  	},

  	rotate: function (degrees) {
  		var hsl = this.hsl();
  		var hue = hsl.color[0];
  		hue = (hue + degrees) % 360;
  		hue = hue < 0 ? 360 + hue : hue;
  		hsl.color[0] = hue;
  		return hsl;
  	},

  	mix: function (mixinColor, weight) {
  		// ported from sass implementation in C
  		// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
  		if (!mixinColor || !mixinColor.rgb) {
  			throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
  		}
  		var color1 = mixinColor.rgb();
  		var color2 = this.rgb();
  		var p = weight === undefined ? 0.5 : weight;

  		var w = 2 * p - 1;
  		var a = color1.alpha() - color2.alpha();

  		var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
  		var w2 = 1 - w1;

  		return Color.rgb(
  				w1 * color1.red() + w2 * color2.red(),
  				w1 * color1.green() + w2 * color2.green(),
  				w1 * color1.blue() + w2 * color2.blue(),
  				color1.alpha() * p + color2.alpha() * (1 - p));
  	}
  };

  // model conversion methods and static constructors
  Object.keys(colorConvert).forEach(function (model) {
  	if (skippedModels.indexOf(model) !== -1) {
  		return;
  	}

  	var channels = colorConvert[model].channels;

  	// conversion methods
  	Color.prototype[model] = function () {
  		if (this.model === model) {
  			return new Color(this);
  		}

  		if (arguments.length) {
  			return new Color(arguments, model);
  		}

  		var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
  		return new Color(assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha), model);
  	};

  	// 'static' construction methods
  	Color[model] = function (color) {
  		if (typeof color === 'number') {
  			color = zeroArray(_slice.call(arguments), channels);
  		}
  		return new Color(color, model);
  	};
  });

  function roundTo(num, places) {
  	return Number(num.toFixed(places));
  }

  function roundToPlace(places) {
  	return function (num) {
  		return roundTo(num, places);
  	};
  }

  function getset(model, channel, modifier) {
  	model = Array.isArray(model) ? model : [model];

  	model.forEach(function (m) {
  		(limiters[m] || (limiters[m] = []))[channel] = modifier;
  	});

  	model = model[0];

  	return function (val) {
  		var result;

  		if (arguments.length) {
  			if (modifier) {
  				val = modifier(val);
  			}

  			result = this[model]();
  			result.color[channel] = val;
  			return result;
  		}

  		result = this[model]().color[channel];
  		if (modifier) {
  			result = modifier(result);
  		}

  		return result;
  	};
  }

  function maxfn(max) {
  	return function (v) {
  		return Math.max(0, Math.min(max, v));
  	};
  }

  function assertArray(val) {
  	return Array.isArray(val) ? val : [val];
  }

  function zeroArray(arr, length) {
  	for (var i = 0; i < length; i++) {
  		if (typeof arr[i] !== 'number') {
  			arr[i] = 0;
  		}
  	}

  	return arr;
  }

  var color = Color;

  const DEFAULT_COLOR = color.hsl(180, 30, 70);
  class FlameChartPlugin extends UIPlugin {
      constructor({ data, colors }) {
          super();
          this.name = 'flameChartPlugin';
          this.data = data;
          this.userColors = colors;
          this.parseData();
          this.reset();
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          this.interactionsEngine.on('change-position', this.handlePositionChange.bind(this));
          this.interactionsEngine.on('select', this.handleSelect.bind(this));
          this.interactionsEngine.on('hover', this.handleHover.bind(this));
          this.interactionsEngine.on('up', this.handleMouseUp.bind(this));
          this.initData();
      }
      handlePositionChange({ deltaX, deltaY }) {
          const startPositionY = this.positionY;
          const startPositionX = this.renderEngine.parent.positionX;
          this.interactionsEngine.setCursor('grabbing');
          if (this.positionY + deltaY >= 0) {
              this.setPositionY(this.positionY + deltaY);
          }
          else {
              this.setPositionY(0);
          }
          this.renderEngine.tryToChangePosition(deltaX);
          if (startPositionX !== this.renderEngine.parent.positionX || startPositionY !== this.positionY) {
              this.renderEngine.parent.render();
          }
      }
      handleMouseUp() {
          this.interactionsEngine.clearCursor();
      }
      setPositionY(y) {
          this.positionY = y;
      }
      reset() {
          this.colors = {};
          this.lastRandomColor = DEFAULT_COLOR;
          this.positionY = 0;
          this.selectedRegion = null;
      }
      calcMinMax() {
          const { flatTree } = this;
          const { min, max } = getFlatTreeMinMax(flatTree);
          this.min = min;
          this.max = max;
      }
      handleSelect(region) {
          const selectedRegion = this.findNodeInCluster(region);
          if (this.selectedRegion !== selectedRegion) {
              this.selectedRegion = selectedRegion;
              this.renderEngine.render();
              this.emit('select', this.selectedRegion?.data, 'flame-chart-node');
          }
      }
      handleHover(region) {
          this.hoveredRegion = this.findNodeInCluster(region);
      }
      findNodeInCluster(region) {
          const mouse = this.interactionsEngine.getMouse();
          if (region && region.type === 'cluster') {
              const hoveredNode = region.data.nodes.find(({ level, source: { start, duration } }) => {
                  const { x, y, w } = this.calcRect(start, duration, level);
                  return mouse.x >= x && mouse.x <= x + w && mouse.y >= y && mouse.y <= y + this.renderEngine.blockHeight;
              });
              if (hoveredNode) {
                  return {
                      data: hoveredNode,
                      type: 'node',
                  };
              }
          }
          return null;
      }
      getColor(type = '_default', defaultColor) {
          if (defaultColor) {
              return defaultColor;
          }
          else if (this.colors[type]) {
              return this.colors[type];
          }
          else if (this.userColors[type]) {
              const color$1 = new color(this.userColors[type]);
              this.colors[type] = color$1.rgb().toString();
              return this.colors[type];
          }
          this.lastRandomColor = this.lastRandomColor.rotate(27);
          this.colors[type] = this.lastRandomColor.rgb().toString();
          return this.colors[type];
      }
      setData(data) {
          this.data = data;
          this.parseData();
          this.initData();
          this.reset();
          this.renderEngine.recalcMinMax();
          this.renderEngine.resetParentView();
      }
      parseData() {
          this.flatTree = flatTree(this.data);
          this.calcMinMax();
      }
      initData() {
          this.metaClusterizedFlatTree = metaClusterizeFlatTree(this.flatTree);
          this.initialClusterizedFlatTree = clusterizeFlatTree(this.metaClusterizedFlatTree, this.renderEngine.zoom, this.min, this.max);
          this.reclusterizeClusteredFlatTree();
      }
      reclusterizeClusteredFlatTree() {
          this.actualClusterizedFlatTree = reclusterizeClusteredFlatTree(this.initialClusterizedFlatTree, this.renderEngine.zoom, this.renderEngine.positionX, this.renderEngine.positionX + this.renderEngine.getRealView());
      }
      calcRect(start, duration, level) {
          const w = duration * this.renderEngine.zoom;
          return {
              x: this.renderEngine.timeToPosition(start),
              y: level * (this.renderEngine.blockHeight + 1) - this.positionY,
              w: w <= 0.1 ? 0.1 : w >= 3 ? w - 1 : w - w / 3,
          };
      }
      renderTooltip() {
          if (this.hoveredRegion) {
              if (this.renderEngine.options.tooltip === false) {
                  return true;
              }
              else if (typeof this.renderEngine.options.tooltip === 'function') {
                  this.renderEngine.options.tooltip(this.hoveredRegion, this.renderEngine, this.interactionsEngine.getGlobalMouse());
              }
              else {
                  const { data: { source: { start, duration, name }, children, }, } = this.hoveredRegion;
                  const timeUnits = this.renderEngine.getTimeUnits();
                  const selfTime = duration - (children ? children.reduce((acc, { duration }) => acc + duration, 0) : 0);
                  const nodeAccuracy = this.renderEngine.getAccuracy() + 2;
                  const header = `${name}`;
                  const dur = `duration: ${duration.toFixed(nodeAccuracy)} ${timeUnits} ${children?.length ? `(self ${selfTime.toFixed(nodeAccuracy)} ${timeUnits})` : ''}`;
                  const st = `start: ${start.toFixed(nodeAccuracy)}`;
                  this.renderEngine.renderTooltipFromData([{ text: header }, { text: dur }, { text: st }], this.interactionsEngine.getGlobalMouse());
              }
              return true;
          }
          return false;
      }
      render() {
          const { width, blockHeight, height, minTextWidth } = this.renderEngine;
          this.lastUsedColor = null;
          this.reclusterizeClusteredFlatTree();
          const processCluster = (cb) => (cluster) => {
              const { start, duration, level } = cluster;
              const { x, y, w } = this.calcRect(start, duration, level);
              if (x + w > 0 && x < width && y + blockHeight > 0 && y < height) {
                  cb(cluster, x, y, w);
              }
          };
          const renderCluster = (cluster, x, y, w) => {
              const { type, nodes, color } = cluster;
              const mouse = this.interactionsEngine.getMouse();
              if (mouse.y >= y && mouse.y <= y + blockHeight) {
                  addHitRegion(cluster, x, y, w);
              }
              if (w >= 0.25) {
                  this.renderEngine.addRectToRenderQueue(this.getColor(type, color), x, y, w);
              }
              if (w >= minTextWidth && nodes.length === 1) {
                  this.renderEngine.addTextToRenderQueue(nodes[0].source.name, x, y, w);
              }
          };
          const addHitRegion = (cluster, x, y, w) => {
              this.interactionsEngine.addHitRegion('cluster', cluster, x, y, w, blockHeight);
          };
          this.actualClusterizedFlatTree.forEach(processCluster(renderCluster));
          if (this.selectedRegion && this.selectedRegion.type === 'node') {
              const { source: { start, duration }, level, } = this.selectedRegion.data;
              const { x, y, w } = this.calcRect(start, duration, level);
              this.renderEngine.addStrokeToRenderQueue('green', x, y, w, this.renderEngine.blockHeight);
          }
          clearTimeout(this.renderChartTimeout);
          this.renderChartTimeout = setTimeout(() => {
              this.interactionsEngine.clearHitRegions();
              this.actualClusterizedFlatTree.forEach(processCluster(addHitRegion));
          }, 16);
      }
  }

  const mergeObjects = (defaultStyles, styles = {}) => Object.keys(defaultStyles).reduce((acc, key) => {
      if (styles[key]) {
          acc[key] = styles[key];
      }
      else {
          acc[key] = defaultStyles[key];
      }
      return acc;
  }, {});
  const isNumber = (val) => typeof val === 'number';

  const defaultTimeGridPluginStyles = {
      font: '10px sans-serif',
      fontColor: 'black',
  };
  class TimeGridPlugin extends UIPlugin {
      constructor(settings = {}) {
          super();
          this.name = 'timeGridPlugin';
          this.setSettings(settings);
      }
      setSettings({ styles }) {
          this.styles = mergeObjects(defaultTimeGridPluginStyles, styles);
          if (this.renderEngine) {
              this.overrideEngineSettings();
          }
      }
      overrideEngineSettings() {
          this.renderEngine.setSettingsOverrides({ styles: this.styles });
          this.height = Math.round(this.renderEngine.charHeight + 10);
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          this.overrideEngineSettings();
      }
      render() {
          this.renderEngine.parent.timeGrid.renderTimes(this.renderEngine);
          this.renderEngine.parent.timeGrid.renderLines(0, this.renderEngine.height, this.renderEngine);
          return true;
      }
  }

  class MarksPlugin extends UIPlugin {
      constructor(marks) {
          super();
          this.name = 'marksPlugin';
          this.marks = this.prepareMarks(marks);
          this.calcMinMax();
      }
      calcMinMax() {
          const { marks } = this;
          if (marks.length) {
              this.min = marks.reduce((acc, { timestamp }) => (timestamp < acc ? timestamp : acc), marks[0].timestamp);
              this.max = marks.reduce((acc, { timestamp }) => (timestamp > acc ? timestamp : acc), marks[0].timestamp);
          }
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          this.interactionsEngine.on('hover', this.handleHover.bind(this));
          this.interactionsEngine.on('select', this.handleSelect.bind(this));
      }
      handleHover(region) {
          this.hoveredRegion = region;
      }
      handleSelect(region) {
          if (region && region.type === 'timestamp') {
              this.selectedRegion = region;
              this.emit('select', region.data, 'timestamp');
              this.renderEngine.render();
          }
          else if (this.selectedRegion && !region) {
              this.selectedRegion = null;
              this.emit('select', null, 'timestamp');
              this.renderEngine.render();
          }
      }
      get height() {
          return this.renderEngine.blockHeight + 1;
      }
      prepareMarks(marks) {
          return marks
              .map(({ color: color$1, ...rest }) => ({
              ...rest,
              color: new color(color$1).alpha(0.7).rgb().toString(),
          }))
              .sort((a, b) => a.timestamp - b.timestamp);
      }
      setMarks(marks) {
          this.marks = this.prepareMarks(marks);
          this.calcMinMax();
          this.renderEngine.recalcMinMax();
          this.renderEngine.resetParentView();
      }
      calcMarksBlockPosition(position, prevEnding) {
          if (position > 0) {
              if (prevEnding > position) {
                  return prevEnding;
              }
              return position;
          }
          return position;
      }
      render() {
          this.marks.reduce((prevEnding, node) => {
              const { timestamp, color, shortName } = node;
              const { width } = this.renderEngine.ctx.measureText(shortName);
              const fullWidth = width + this.renderEngine.blockPaddingLeftRight * 2;
              const position = this.renderEngine.timeToPosition(timestamp);
              const blockPosition = this.calcMarksBlockPosition(position, prevEnding);
              this.renderEngine.addRectToRenderQueue(color, blockPosition, 0, fullWidth);
              this.renderEngine.addTextToRenderQueue(shortName, blockPosition, 0, fullWidth);
              this.interactionsEngine.addHitRegion('timestamp', node, blockPosition, 0, fullWidth, this.renderEngine.blockHeight);
              return blockPosition + fullWidth;
          }, 0);
      }
      postRender() {
          this.marks.forEach((node) => {
              const { timestamp, color } = node;
              const position = this.renderEngine.timeToPosition(timestamp);
              this.renderEngine.parent.setStrokeColor(color);
              this.renderEngine.parent.ctx.beginPath();
              this.renderEngine.parent.ctx.setLineDash([8, 7]);
              this.renderEngine.parent.ctx.moveTo(position, this.renderEngine.position);
              this.renderEngine.parent.ctx.lineTo(position, this.renderEngine.parent.height);
              this.renderEngine.parent.ctx.stroke();
          });
      }
      renderTooltip() {
          if (this.hoveredRegion && this.hoveredRegion.type === 'timestamp') {
              if (this.renderEngine.options.tooltip === false) {
                  return true;
              }
              else if (typeof this.renderEngine.options.tooltip === 'function') {
                  this.renderEngine.options.tooltip(this.hoveredRegion, this.renderEngine, this.interactionsEngine.getGlobalMouse());
              }
              else {
                  const { data: { fullName, timestamp }, } = this.hoveredRegion;
                  const marksAccuracy = this.renderEngine.getAccuracy() + 2;
                  const header = `${fullName}`;
                  const time = `${timestamp.toFixed(marksAccuracy)} ${this.renderEngine.timeUnits}`;
                  this.renderEngine.renderTooltipFromData([{ text: header }, { text: time }], this.interactionsEngine.getGlobalMouse());
              }
              return true;
          }
          return false;
      }
  }

  const MIN_PIXEL_DELTA = 85;
  const defaultTimeGridStyles = {
      color: 'rgba(90,90,90,0.20)',
  };
  class TimeGrid {
      constructor(settings) {
          this.start = 0;
          this.end = 0;
          this.accuracy = 0;
          this.delta = 0;
          this.setSettings(settings);
      }
      setDefaultRenderEngine(renderEngine) {
          this.renderEngine = renderEngine;
          this.timeUnits = this.renderEngine.getTimeUnits();
      }
      setSettings({ styles }) {
          this.styles = mergeObjects(defaultTimeGridStyles, styles);
          if (this.renderEngine) {
              this.timeUnits = this.renderEngine.getTimeUnits();
          }
      }
      recalc() {
          const timeWidth = this.renderEngine.max - this.renderEngine.min;
          const initialLinesCount = this.renderEngine.width / MIN_PIXEL_DELTA;
          const initialTimeLineDelta = timeWidth / initialLinesCount;
          const realView = this.renderEngine.getRealView();
          const proportion = realView / (timeWidth || 1);
          this.delta = initialTimeLineDelta / Math.pow(2, Math.floor(Math.log2(1 / proportion)));
          this.start = Math.floor((this.renderEngine.positionX - this.renderEngine.min) / this.delta);
          this.end = Math.ceil(realView / this.delta) + this.start;
          this.accuracy = this.calcNumberFix();
      }
      calcNumberFix() {
          const strTimelineDelta = (this.delta / 2).toString();
          if (strTimelineDelta.includes('e')) {
              return Number(strTimelineDelta.match(/\d+$/)?.[0]);
          }
          const zeros = strTimelineDelta.match(/(0\.0*)/);
          return zeros ? zeros[0].length - 1 : 0;
      }
      getTimelineAccuracy() {
          return this.accuracy;
      }
      forEachTime(cb) {
          for (let i = this.start; i <= this.end; i++) {
              const timePosition = i * this.delta + this.renderEngine.min;
              const pixelPosition = this.renderEngine.timeToPosition(Number(timePosition.toFixed(this.accuracy)));
              cb(pixelPosition, timePosition);
          }
      }
      renderLines(start, height, renderEngine = this.renderEngine) {
          renderEngine.setCtxColor(this.styles.color);
          this.forEachTime((pixelPosition) => {
              renderEngine.fillRect(pixelPosition, start, 1, height);
          });
      }
      renderTimes(renderEngine = this.renderEngine) {
          renderEngine.setCtxColor(renderEngine.styles.fontColor);
          renderEngine.setCtxFont(renderEngine.styles.font);
          this.forEachTime((pixelPosition, timePosition) => {
              renderEngine.fillText(timePosition.toFixed(this.accuracy) + this.timeUnits, pixelPosition + renderEngine.blockPaddingLeftRight, renderEngine.charHeight);
          });
      }
  }

  const defaultTimeframeSelectorPluginStyles = {
      font: '9px sans-serif',
      fontColor: 'black',
      overlayColor: 'rgba(112, 112, 112, 0.5)',
      graphStrokeColor: 'rgb(0, 0, 0, 0.2)',
      graphFillColor: 'rgb(0, 0, 0, 0.25)',
      bottomLineColor: 'rgb(0, 0, 0, 0.25)',
      knobColor: 'rgb(131, 131, 131)',
      knobStrokeColor: 'white',
      knobSize: 6,
      height: 60,
      backgroundColor: 'white',
  };
  class TimeframeSelectorPlugin extends UIPlugin {
      constructor(data, settings) {
          super();
          this.name = 'timeframeSelectorPlugin';
          this.data = data;
          this.shouldRender = true;
          this.setSettings(settings);
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          this.interactionsEngine.on('down', this.handleMouseDown.bind(this));
          this.interactionsEngine.on('up', this.handleMouseUp.bind(this));
          this.interactionsEngine.on('move', this.handleMouseMove.bind(this));
          this.setSettings();
      }
      handleMouseDown(region, mouse) {
          if (region) {
              if (region.type === 'timeframeKnob') {
                  if (region.data === 'left') {
                      this.leftKnobMoving = true;
                  }
                  else {
                      this.rightKnobMoving = true;
                  }
                  this.interactionsEngine.setCursor('ew-resize');
              }
              else if (region.type === 'timeframeArea') {
                  this.selectingActive = true;
                  this.startSelectingPosition = mouse.x;
              }
          }
      }
      handleMouseUp(region, mouse, isClick) {
          let isDoubleClick = false;
          if (this.timeout) {
              isDoubleClick = true;
          }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => (this.timeout = void 0), 300);
          this.leftKnobMoving = false;
          this.rightKnobMoving = false;
          this.interactionsEngine.clearCursor();
          if (this.selectingActive && !isClick) {
              this.applyChanges();
          }
          this.selectingActive = false;
          if (isClick && !isDoubleClick) {
              const rightKnobPosition = this.getRightKnobPosition();
              const leftKnobPosition = this.getLeftKnobPosition();
              if (mouse.x > rightKnobPosition) {
                  this.setRightKnobPosition(mouse.x);
              }
              else if (mouse.x > leftKnobPosition && mouse.x < rightKnobPosition) {
                  if (mouse.x - leftKnobPosition > rightKnobPosition - mouse.x) {
                      this.setRightKnobPosition(mouse.x);
                  }
                  else {
                      this.setLeftKnobPosition(mouse.x);
                  }
              }
              else {
                  this.setLeftKnobPosition(mouse.x);
              }
              this.applyChanges();
          }
          if (isDoubleClick) {
              this.renderEngine.parent.setZoom(this.renderEngine.getInitialZoom());
              this.renderEngine.parent.setPositionX(this.renderEngine.min);
              this.renderEngine.parent.render();
          }
      }
      handleMouseMove(region, mouse) {
          if (this.leftKnobMoving) {
              this.setLeftKnobPosition(mouse.x);
              this.applyChanges();
          }
          if (this.rightKnobMoving) {
              this.setRightKnobPosition(mouse.x);
              this.applyChanges();
          }
          if (this.selectingActive) {
              if (this.startSelectingPosition >= mouse.x) {
                  this.setLeftKnobPosition(mouse.x);
                  this.setRightKnobPosition(this.startSelectingPosition);
              }
              else {
                  this.setRightKnobPosition(mouse.x);
                  this.setLeftKnobPosition(this.startSelectingPosition);
              }
              this.renderEngine.render();
          }
      }
      postInit() {
          this.offscreenRenderEngine = this.renderEngine.makeChild();
          this.offscreenRenderEngine.setSettingsOverrides({ styles: this.styles });
          this.timeGrid = new TimeGrid({ styles: this.renderEngine.parent.timeGrid.styles });
          this.timeGrid.setDefaultRenderEngine(this.offscreenRenderEngine);
          this.offscreenRenderEngine.on('resize', () => {
              this.offscreenRenderEngine.setZoom(this.renderEngine.getInitialZoom());
              this.offscreenRender();
          });
          this.offscreenRenderEngine.on('min-max-change', () => (this.shouldRender = true));
          this.setData(this.data);
      }
      setLeftKnobPosition(mouseX) {
          const maxPosition = this.getRightKnobPosition();
          if (mouseX < maxPosition - 1) {
              const realView = this.renderEngine.getRealView();
              const delta = this.renderEngine.setPositionX(this.offscreenRenderEngine.pixelToTime(mouseX) + this.renderEngine.min);
              const zoom = this.renderEngine.width / (realView - delta);
              this.renderEngine.setZoom(zoom);
          }
      }
      setRightKnobPosition(mouseX) {
          const minPosition = this.getLeftKnobPosition();
          if (mouseX > minPosition + 1) {
              const realView = this.renderEngine.getRealView();
              const delta = this.renderEngine.positionX +
                  realView -
                  (this.offscreenRenderEngine.pixelToTime(mouseX) + this.renderEngine.min);
              const zoom = this.renderEngine.width / (realView - delta);
              this.renderEngine.setZoom(zoom);
          }
      }
      getLeftKnobPosition() {
          return (this.renderEngine.positionX - this.renderEngine.min) * this.renderEngine.getInitialZoom();
      }
      getRightKnobPosition() {
          return ((this.renderEngine.positionX - this.renderEngine.min + this.renderEngine.getRealView()) *
              this.renderEngine.getInitialZoom());
      }
      applyChanges() {
          this.renderEngine.parent.setPositionX(this.renderEngine.positionX);
          this.renderEngine.parent.setZoom(this.renderEngine.zoom);
          this.renderEngine.parent.render();
      }
      setSettings({ styles } = { styles: this.styles }) {
          this.styles = mergeObjects(defaultTimeframeSelectorPluginStyles, styles);
          this.height = this.styles.height;
          if (this.offscreenRenderEngine) {
              this.offscreenRenderEngine.setSettingsOverrides({ styles: this.styles });
              this.timeGrid.setSettings({ styles: this.renderEngine.parent.timeGrid.styles });
          }
          this.shouldRender = true;
      }
      setData(data) {
          this.data = data;
          const dots = [];
          const tree = flatTree(this.data);
          const { min, max } = getFlatTreeMinMax(tree);
          let maxLevel = 0;
          this.min = min;
          this.max = max;
          this.clusters = metaClusterizeFlatTree(tree, () => true);
          this.actualClusters = clusterizeFlatTree(this.clusters, this.renderEngine.zoom, this.min, this.max, 2, Infinity);
          this.actualClusterizedFlatTree = reclusterizeClusteredFlatTree(this.actualClusters, this.renderEngine.zoom, this.min, this.max, 2, Infinity).sort((a, b) => a.start - b.start);
          this.actualClusterizedFlatTree.forEach(({ start, end, level }, index) => {
              if (maxLevel < level + 1) {
                  maxLevel = level + 1;
              }
              dots.push({
                  pos: start,
                  sort: 0,
                  level: level,
                  index,
                  type: 'start',
              }, {
                  pos: start,
                  sort: 1,
                  level: level + 1,
                  index,
                  type: 'start',
              }, {
                  pos: end,
                  sort: 2,
                  level: level + 1,
                  index,
                  type: 'end',
              }, {
                  pos: end,
                  sort: 3,
                  level: level,
                  index,
                  type: 'end',
              });
          });
          this.dots = dots.sort((a, b) => {
              if (a.pos !== b.pos) {
                  return a.pos - b.pos;
              }
              if (a.index === b.index) {
                  return a.sort - b.sort;
              }
              if (a.type === 'start' && b.type === 'start') {
                  return a.level - b.level;
              }
              else if (a.type === 'end' && b.type === 'end') {
                  return b.level - a.level;
              }
              return 0;
          });
          this.maxLevel = maxLevel;
          this.offscreenRender();
      }
      offscreenRender() {
          const zoom = this.offscreenRenderEngine.getInitialZoom();
          this.offscreenRenderEngine.setZoom(zoom);
          this.offscreenRenderEngine.setPositionX(this.offscreenRenderEngine.min);
          this.offscreenRenderEngine.clear();
          this.timeGrid.recalc();
          this.timeGrid.renderLines(0, this.offscreenRenderEngine.height);
          this.timeGrid.renderTimes();
          this.offscreenRenderEngine.setStrokeColor(this.styles.graphStrokeColor);
          this.offscreenRenderEngine.setCtxColor(this.styles.graphFillColor);
          this.offscreenRenderEngine.ctx.beginPath();
          const levelHeight = (this.height - this.renderEngine.charHeight - 4) / this.maxLevel;
          if (this.dots.length) {
              this.offscreenRenderEngine.ctx.moveTo((this.dots[0].pos - this.offscreenRenderEngine.min) * zoom, this.castLevelToHeight(this.dots[0].level, levelHeight));
              this.dots.forEach((dot) => {
                  const { pos, level } = dot;
                  this.offscreenRenderEngine.ctx.lineTo((pos - this.offscreenRenderEngine.min) * zoom, this.castLevelToHeight(level, levelHeight));
              });
          }
          this.offscreenRenderEngine.ctx.closePath();
          this.offscreenRenderEngine.ctx.stroke();
          this.offscreenRenderEngine.ctx.fill();
          this.offscreenRenderEngine.setCtxColor(this.styles.bottomLineColor);
          this.offscreenRenderEngine.ctx.fillRect(0, this.height - 1, this.offscreenRenderEngine.width, 1);
      }
      castLevelToHeight(level, levelHeight) {
          return this.height - level * levelHeight;
      }
      renderTimeframe() {
          const relativePositionX = this.renderEngine.positionX - this.renderEngine.min;
          const currentLeftPosition = relativePositionX * this.renderEngine.getInitialZoom();
          const currentRightPosition = (relativePositionX + this.renderEngine.getRealView()) * this.renderEngine.getInitialZoom();
          const currentLeftKnobPosition = currentLeftPosition - this.styles.knobSize / 2;
          const currentRightKnobPosition = currentRightPosition - this.styles.knobSize / 2;
          const knobHeight = this.renderEngine.height / 3;
          this.renderEngine.setCtxColor(this.styles.overlayColor);
          this.renderEngine.fillRect(0, 0, currentLeftPosition, this.renderEngine.height);
          this.renderEngine.fillRect(currentRightPosition, 0, this.renderEngine.width - currentRightPosition, this.renderEngine.height);
          this.renderEngine.setCtxColor(this.styles.overlayColor);
          this.renderEngine.fillRect(currentLeftPosition - 1, 0, 1, this.renderEngine.height);
          this.renderEngine.fillRect(currentRightPosition + 1, 0, 1, this.renderEngine.height);
          this.renderEngine.setCtxColor(this.styles.knobColor);
          this.renderEngine.fillRect(currentLeftKnobPosition, 0, this.styles.knobSize, knobHeight);
          this.renderEngine.fillRect(currentRightKnobPosition, 0, this.styles.knobSize, knobHeight);
          this.renderEngine.renderStroke(this.styles.knobStrokeColor, currentLeftKnobPosition, 0, this.styles.knobSize, knobHeight);
          this.renderEngine.renderStroke(this.styles.knobStrokeColor, currentRightKnobPosition, 0, this.styles.knobSize, knobHeight);
          this.interactionsEngine.addHitRegion('timeframeKnob', 'left', currentLeftKnobPosition, 0, this.styles.knobSize, knobHeight, 'ew-resize');
          this.interactionsEngine.addHitRegion('timeframeKnob', 'right', currentRightKnobPosition, 0, this.styles.knobSize, knobHeight, 'ew-resize');
          this.interactionsEngine.addHitRegion('timeframeArea', null, 0, 0, this.renderEngine.width, this.renderEngine.height, 'text');
      }
      render() {
          if (this.shouldRender) {
              this.shouldRender = false;
              this.offscreenRender();
          }
          this.renderEngine.copy(this.offscreenRenderEngine);
          this.renderTimeframe();
          return true;
      }
  }

  const getValueByChoice = (array, property, fn) => array.length ? array.reduce((acc, { [property]: value }) => fn(acc, value), array[0][property]) : null;
  const defaultWaterfallPluginStyles = {
      defaultHeight: 68,
  };
  class WaterfallPlugin extends UIPlugin {
      constructor({ items, intervals }, settings) {
          super();
          this.name = 'waterfallPlugin';
          this.styles = defaultWaterfallPluginStyles;
          this.height = defaultWaterfallPluginStyles.defaultHeight;
          this.positionY = 0;
          this.initialData = [];
          this.setData({ items, intervals });
          this.setSettings(settings);
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          this.interactionsEngine.on('change-position', this.handlePositionChange.bind(this));
          this.interactionsEngine.on('hover', this.handleHover.bind(this));
          this.interactionsEngine.on('select', this.handleSelect.bind(this));
          this.interactionsEngine.on('up', this.handleMouseUp.bind(this));
      }
      handlePositionChange({ deltaX, deltaY }) {
          const startPositionY = this.positionY;
          const startPositionX = this.renderEngine.parent.positionX;
          this.interactionsEngine.setCursor('grabbing');
          if (this.positionY + deltaY >= 0) {
              this.setPositionY(this.positionY + deltaY);
          }
          else {
              this.setPositionY(0);
          }
          this.renderEngine.tryToChangePosition(deltaX);
          if (startPositionX !== this.renderEngine.parent.positionX || startPositionY !== this.positionY) {
              this.renderEngine.parent.render();
          }
      }
      handleMouseUp() {
          this.interactionsEngine.clearCursor();
      }
      handleHover(region) {
          this.hoveredRegion = region;
      }
      handleSelect(region) {
          if (region) {
              this.selectedRegion = region;
              this.emit('select', this.initialData[region.data], 'waterfall-node');
              this.renderEngine.render();
          }
          else if (this.selectedRegion && !region) {
              this.selectedRegion = null;
              this.emit('select', null, 'waterfall-node');
              this.renderEngine.render();
          }
      }
      setPositionY(y) {
          this.positionY = y;
      }
      setSettings({ styles }) {
          this.styles = mergeObjects(defaultWaterfallPluginStyles, styles);
          this.height = this.styles.defaultHeight;
          this.positionY = 0;
      }
      setData({ items: data, intervals: commonIntervals }) {
          this.positionY = 0;
          this.initialData = data;
          this.data = data
              .map(({ name, intervals, timing, ...rest }, index) => {
              const resolvedIntervals = typeof intervals === 'string' ? commonIntervals[intervals] : intervals;
              const preparedIntervals = resolvedIntervals
                  .map(({ start, end, color, type, name }) => ({
                  start: typeof start === 'string' ? timing[start] : start,
                  end: typeof end === 'string' ? timing[end] : end,
                  color,
                  name,
                  type,
              }))
                  .filter(({ start, end }) => typeof start === 'number' && typeof end === 'number');
              const blocks = preparedIntervals.filter(({ type }) => type === 'block');
              const blockStart = getValueByChoice(blocks, 'start', Math.min) || 0;
              const blockEnd = getValueByChoice(blocks, 'end', Math.max) || 0;
              const min = getValueByChoice(preparedIntervals, 'start', Math.min) || 0;
              const max = getValueByChoice(preparedIntervals, 'end', Math.max) || 0;
              return {
                  ...rest,
                  intervals: preparedIntervals,
                  textBlock: {
                      start: blockStart,
                      end: blockEnd,
                  },
                  name,
                  timing,
                  min,
                  max,
                  index,
              };
          })
              .filter(({ intervals }) => intervals.length)
              .sort((a, b) => a.min - b.min || b.max - a.max);
          if (data.length) {
              this.min = this.data.reduce((acc, { min }) => Math.min(acc, min), this.data[0].min);
              this.max = this.data.reduce((acc, { max }) => Math.max(acc, max), this.data[0].max);
          }
          if (this.renderEngine) {
              this.renderEngine.recalcMinMax();
              this.renderEngine.resetParentView();
          }
      }
      calcRect(start, duration, isEnd) {
          const w = duration * this.renderEngine.zoom;
          return {
              x: this.renderEngine.timeToPosition(start),
              w: isEnd ? (w <= 0.1 ? 0.1 : w >= 3 ? w - 1 : w - w / 3) : w,
          };
      }
      renderTooltip() {
          if (this.hoveredRegion) {
              if (this.renderEngine.options.tooltip === false) {
                  return true;
              }
              else if (typeof this.renderEngine.options.tooltip === 'function') {
                  const { data: index } = this.hoveredRegion;
                  const data = { ...this.hoveredRegion };
                  data.data = this.data.find(({ index: i }) => index === i);
                  this.renderEngine.options.tooltip(data, this.renderEngine, this.interactionsEngine.getGlobalMouse());
              }
              else {
                  const { data: index } = this.hoveredRegion;
                  const dataItem = this.data.find(({ index: i }) => index === i);
                  if (dataItem) {
                      const { name, intervals, timing, meta = [] } = dataItem;
                      const timeUnits = this.renderEngine.getTimeUnits();
                      const nodeAccuracy = this.renderEngine.getAccuracy() + 2;
                      const header = { text: `${name}` };
                      const intervalsHeader = {
                          text: 'intervals',
                          color: this.renderEngine.styles.tooltipHeaderFontColor,
                      };
                      const intervalsTexts = intervals.map(({ name, start, end }) => ({
                          text: `${name}: ${(end - start).toFixed(nodeAccuracy)} ${timeUnits}`,
                      }));
                      const timingHeader = { text: 'timing', color: this.renderEngine.styles.tooltipHeaderFontColor };
                      const timingTexts = Object.entries(timing)
                          .filter(([, time]) => typeof time === 'number')
                          .map(([name, time]) => ({
                          text: `${name}: ${time.toFixed(nodeAccuracy)} ${timeUnits}`,
                      }));
                      const metaHeader = { text: 'meta', color: this.renderEngine.styles.tooltipHeaderFontColor };
                      const metaTexts = meta
                          ? meta.map(({ name, value, color }) => ({
                              text: `${name}: ${value}`,
                              color,
                          }))
                          : [];
                      this.renderEngine.renderTooltipFromData([
                          header,
                          intervalsHeader,
                          ...intervalsTexts,
                          timingHeader,
                          ...timingTexts,
                          ...(metaTexts.length ? [metaHeader, ...metaTexts] : []),
                      ], this.interactionsEngine.getGlobalMouse());
                  }
              }
              return true;
          }
          return false;
      }
      render() {
          const rightSide = this.renderEngine.positionX + this.renderEngine.getRealView();
          const leftSide = this.renderEngine.positionX;
          const blockHeight = this.renderEngine.blockHeight + 1;
          const stack = [];
          const viewedData = this.data
              .filter(({ min, max }) => !((rightSide < min && rightSide < max) || (leftSide > max && rightSide > min)))
              .map((entry) => {
              while (stack.length && entry.min - stack[stack.length - 1].max > 0) {
                  stack.pop();
              }
              const level = stack.length;
              const result = {
                  ...entry,
                  level,
              };
              stack.push(entry);
              return result;
          });
          viewedData.forEach(({ name, intervals, textBlock, level, index }) => {
              const y = level * blockHeight - this.positionY;
              if (y + blockHeight >= 0 && y - blockHeight <= this.renderEngine.height) {
                  const textStart = this.renderEngine.timeToPosition(textBlock.start);
                  const textEnd = this.renderEngine.timeToPosition(textBlock.end);
                  this.renderEngine.addTextToRenderQueue(name, textStart, y, textEnd - textStart);
                  const { x, w } = intervals.reduce((acc, { color, start, end, type }, index) => {
                      const { x, w } = this.calcRect(start, end - start, index === intervals.length - 1);
                      if (type === 'block') {
                          this.renderEngine.addRectToRenderQueue(color, x, y, w);
                      }
                      return {
                          x: acc.x === null ? x : acc.x,
                          w: w + acc.w,
                      };
                  }, { x: null, w: 0 });
                  if (this.selectedRegion && this.selectedRegion.type === 'waterfall-node') {
                      const selectedIndex = this.selectedRegion.data;
                      if (selectedIndex === index) {
                          this.renderEngine.addStrokeToRenderQueue('green', x ?? 0, y, w, this.renderEngine.blockHeight);
                      }
                  }
                  this.interactionsEngine.addHitRegion('waterfall-node', index, x ?? 0, y, w, this.renderEngine.blockHeight);
              }
          }, 0);
      }
  }

  const defaultTogglePluginStyles = {
      height: 16,
      color: 'rgb(202,202,202, 0.25)',
      strokeColor: 'rgb(138,138,138, 0.50)',
      dotsColor: 'rgb(97,97,97)',
      fontColor: 'black',
      font: '10px sans-serif',
      triangleWidth: 10,
      triangleHeight: 7,
      triangleColor: 'black',
      leftPadding: 10,
  };
  class TogglePlugin extends UIPlugin {
      constructor(title, settings) {
          super();
          this.name = 'togglePlugin';
          this.setSettings(settings);
          this.title = title;
      }
      setSettings({ styles }) {
          this.styles = mergeObjects(defaultTogglePluginStyles, styles);
          this.height = this.styles.height + 1;
      }
      init(renderEngine, interactionsEngine) {
          super.init(renderEngine, interactionsEngine);
          const nextEngine = this.getNextEngine();
          nextEngine.setFlexible();
          this.interactionsEngine.on('click', (region) => {
              if (region && region.type === 'toggle' && region.data === this.renderEngine.id) {
                  const nextEngine = this.getNextEngine();
                  if (nextEngine.collapsed) {
                      nextEngine.expand();
                  }
                  else {
                      nextEngine.collapse();
                  }
                  this.renderEngine.parent.recalcChildrenSizes();
                  this.renderEngine.parent.render();
              }
          });
          this.interactionsEngine.on('down', (region) => {
              if (region && region.type === 'knob-resize' && region.data === this.renderEngine.id) {
                  const prevEngine = this.getPrevEngine();
                  this.interactionsEngine.setCursor('row-resize');
                  this.resizeActive = true;
                  this.resizeStartHeight = prevEngine.height;
                  this.resizeStartPosition = this.interactionsEngine.getGlobalMouse().y;
              }
          });
          this.interactionsEngine.parent.on('move', () => {
              if (this.resizeActive) {
                  const prevEngine = this.getPrevEngine();
                  const mouse = this.interactionsEngine.getGlobalMouse();
                  if (prevEngine.flexible) {
                      const newPosition = this.resizeStartHeight - (this.resizeStartPosition - mouse.y);
                      if (newPosition <= 0) {
                          prevEngine.collapse();
                          prevEngine.resize({ height: 0 });
                      }
                      else {
                          if (prevEngine.collapsed) {
                              prevEngine.expand();
                          }
                          prevEngine.resize({ height: newPosition });
                      }
                      this.renderEngine.parent.render();
                  }
              }
          });
          this.interactionsEngine.parent.on('up', () => {
              this.interactionsEngine.clearCursor();
              this.resizeActive = false;
          });
      }
      getPrevEngine() {
          const prevRenderEngineId = (this.renderEngine.id ?? 0) - 1;
          return this.renderEngine.parent.children[prevRenderEngineId];
      }
      getNextEngine() {
          const nextRenderEngineId = (this.renderEngine.id ?? 0) + 1;
          return this.renderEngine.parent.children[nextRenderEngineId];
      }
      render() {
          const nextEngine = this.getNextEngine();
          const prevEngine = this.getPrevEngine();
          const triangleFullWidth = this.styles.leftPadding + this.styles.triangleWidth;
          const centerW = this.renderEngine.width / 2;
          const centerH = this.styles.height / 2;
          this.renderEngine.setCtxFont(this.styles.font);
          this.renderEngine.setCtxColor(this.styles.color);
          this.renderEngine.setStrokeColor(this.styles.strokeColor);
          this.renderEngine.fillRect(0, 0, this.renderEngine.width, this.styles.height);
          this.renderEngine.setCtxColor(this.styles.fontColor);
          this.renderEngine.addTextToRenderQueue(this.title, triangleFullWidth, 0, this.renderEngine.width);
          this.renderEngine.renderTriangle(this.styles.triangleColor, this.styles.leftPadding, this.styles.height / 2, this.styles.triangleWidth, this.styles.triangleHeight, nextEngine.collapsed ? 'right' : 'bottom');
          const { width: titleWidth } = this.renderEngine.ctx.measureText(this.title);
          const buttonWidth = titleWidth + triangleFullWidth;
          this.interactionsEngine.addHitRegion('toggle', this.renderEngine.id, 0, 0, buttonWidth, this.styles.height, 'pointer');
          if (prevEngine.flexible) {
              this.renderEngine.renderCircle(this.styles.dotsColor, centerW, centerH, 1.5);
              this.renderEngine.renderCircle(this.styles.dotsColor, centerW - 10, centerH, 1.5);
              this.renderEngine.renderCircle(this.styles.dotsColor, centerW + 10, centerH, 1.5);
              this.interactionsEngine.addHitRegion('knob-resize', this.renderEngine.id, buttonWidth, 0, this.renderEngine.width - buttonWidth, this.styles.height, 'row-resize');
          }
      }
  }

  // eslint-disable-next-line prettier/prettier -- prettier complains about escaping of the " character
  const allChars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890_-+()[]{}\\/|\'";:.,?~';
  const checkSafari = () => {
      const ua = navigator.userAgent.toLowerCase();
      return ua.includes('safari') ? !ua.includes('chrome') : false;
  };
  const getPixelRatio = (ctx) => {
      const dpr = window.devicePixelRatio || 1;
      const bsr = ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1;
      return dpr / bsr;
  };
  const defaultRenderSettings = {
      tooltip: undefined,
      timeUnits: 'ms',
  };
  const defaultRenderStyles = {
      blockHeight: 16,
      blockPaddingLeftRight: 4,
      backgroundColor: 'white',
      font: `10px sans-serif`,
      fontColor: 'black',
      tooltipHeaderFontColor: 'black',
      tooltipBodyFontColor: '#688f45',
      tooltipBackgroundColor: 'white',
      headerHeight: 14,
      headerColor: 'rgba(112, 112, 112, 0.25)',
      headerStrokeColor: 'rgba(112, 112, 112, 0.5)',
      headerTitleLeftPadding: 16,
  };
  class BasicRenderEngine extends EventEmitter {
      constructor(canvas, settings) {
          super();
          this.width = canvas.width;
          this.height = canvas.height;
          this.isSafari = checkSafari();
          this.canvas = canvas;
          this.ctx = canvas.getContext('2d', { alpha: false });
          this.pixelRatio = getPixelRatio(this.ctx);
          this.setSettings(settings);
          this.applyCanvasSize();
          this.reset();
      }
      setSettings({ options, styles }) {
          this.options = mergeObjects(defaultRenderSettings, options);
          this.styles = mergeObjects(defaultRenderStyles, styles);
          this.timeUnits = this.options.timeUnits;
          this.blockHeight = this.styles.blockHeight;
          this.ctx.font = this.styles.font;
          const { actualBoundingBoxAscent: fontAscent, actualBoundingBoxDescent: fontDescent, width: allCharsWidth, } = this.ctx.measureText(allChars);
          const { width: placeholderWidth } = this.ctx.measureText('…');
          const fontHeight = fontAscent + fontDescent;
          this.blockPaddingLeftRight = this.styles.blockPaddingLeftRight;
          this.blockPaddingTopBottom = Math.ceil((this.blockHeight - fontHeight) / 2);
          this.charHeight = fontHeight + 1;
          this.placeholderWidth = placeholderWidth;
          this.avgCharWidth = allCharsWidth / allChars.length;
          this.minTextWidth = this.avgCharWidth + this.placeholderWidth;
      }
      reset() {
          this.textRenderQueue = [];
          this.strokeRenderQueue = [];
          this.rectRenderQueue = {};
      }
      setCtxColor(color) {
          if (color && this.lastUsedColor !== color) {
              this.ctx.fillStyle = color;
              this.lastUsedColor = color;
          }
      }
      setStrokeColor(color) {
          if (color && this.lastUsedStrokeColor !== color) {
              this.ctx.strokeStyle = color;
              this.lastUsedStrokeColor = color;
          }
      }
      setCtxFont(font) {
          if (font && this.ctx.font !== font) {
              this.ctx.font = font;
          }
      }
      fillRect(x, y, w, h) {
          this.ctx.fillRect(x, y, w, h);
      }
      fillText(text, x, y) {
          this.ctx.fillText(text, x, y);
      }
      renderBlock(color, x, y, w) {
          this.setCtxColor(color);
          this.ctx.fillRect(x, y, w, this.blockHeight);
      }
      renderStroke(color, x, y, w, h) {
          this.setStrokeColor(color);
          this.ctx.setLineDash([]);
          this.ctx.strokeRect(x, y, w, h);
      }
      clear(w = this.width, h = this.height, x = 0, y = 0) {
          this.ctx.clearRect(x, y, w, h - 1);
          this.setCtxColor(this.styles.backgroundColor);
          this.ctx.fillRect(x, y, w, h);
          this.emit('clear');
      }
      timeToPosition(time) {
          return time * this.zoom - this.positionX * this.zoom;
      }
      pixelToTime(width) {
          return width / this.zoom;
      }
      setZoom(zoom) {
          this.zoom = zoom;
      }
      setPositionX(x) {
          const currentPos = this.positionX;
          this.positionX = x;
          return x - currentPos;
      }
      addRectToRenderQueue(color, x, y, w) {
          if (!this.rectRenderQueue[color]) {
              this.rectRenderQueue[color] = [];
          }
          this.rectRenderQueue[color].push({ x, y, w });
      }
      addTextToRenderQueue(text, x, y, w) {
          if (text) {
              const textMaxWidth = w - (this.blockPaddingLeftRight * 2 - (x < 0 ? x : 0));
              if (textMaxWidth > 0) {
                  this.textRenderQueue.push({ text, x, y, w, textMaxWidth });
              }
          }
      }
      addStrokeToRenderQueue(color, x, y, w, h) {
          this.strokeRenderQueue.push({ color, x, y, w, h });
      }
      resolveRectRenderQueue() {
          Object.entries(this.rectRenderQueue).forEach(([color, items]) => {
              this.setCtxColor(color);
              items.forEach(({ x, y, w }) => this.renderBlock(color, x, y, w));
          });
          this.rectRenderQueue = {};
      }
      resolveTextRenderQueue() {
          this.setCtxColor(this.styles.fontColor);
          this.textRenderQueue.forEach(({ text, x, y, textMaxWidth }) => {
              const { width: textWidth } = this.ctx.measureText(text);
              if (textWidth > textMaxWidth) {
                  const avgCharWidth = textWidth / text.length;
                  const maxChars = Math.floor((textMaxWidth - this.placeholderWidth) / avgCharWidth);
                  const halfChars = (maxChars - 1) / 2;
                  if (halfChars > 0) {
                      text =
                          text.slice(0, Math.ceil(halfChars)) +
                              '…' +
                              text.slice(text.length - Math.floor(halfChars), text.length);
                  }
                  else {
                      text = '';
                  }
              }
              if (text) {
                  this.ctx.fillText(text, (x < 0 ? 0 : x) + this.blockPaddingLeftRight, y + this.blockHeight - this.blockPaddingTopBottom);
              }
          });
          this.textRenderQueue = [];
      }
      resolveStrokeRenderQueue() {
          this.strokeRenderQueue.forEach(({ color, x, y, w, h }) => {
              this.renderStroke(color, x, y, w, h);
          });
          this.strokeRenderQueue = [];
      }
      setMinMax(min, max) {
          const hasChanges = min !== this.min || max !== this.max;
          this.min = min;
          this.max = max;
          if (hasChanges) {
              this.emit('min-max-change', min, max);
          }
      }
      getTimeUnits() {
          return this.timeUnits;
      }
      tryToChangePosition(positionDelta) {
          const realView = this.getRealView();
          if (this.positionX + positionDelta + realView <= this.max && this.positionX + positionDelta >= this.min) {
              this.setPositionX(this.positionX + positionDelta);
          }
          else if (this.positionX + positionDelta <= this.min) {
              this.setPositionX(this.min);
          }
          else if (this.positionX + positionDelta + realView >= this.max) {
              this.setPositionX(this.max - realView);
          }
      }
      getInitialZoom() {
          if (this.max - this.min > 0) {
              return this.width / (this.max - this.min);
          }
          return 1;
      }
      getRealView() {
          return this.width / this.zoom;
      }
      resetView() {
          this.setZoom(this.getInitialZoom());
          this.setPositionX(this.min);
      }
      resize(width, height) {
          const isWidthChanged = typeof width === 'number' && this.width !== width;
          const isHeightChanged = typeof height === 'number' && this.height !== height;
          if (isWidthChanged || isHeightChanged) {
              this.width = isWidthChanged ? width : this.width;
              this.height = isHeightChanged ? height : this.height;
              this.applyCanvasSize();
              this.emit('resize', { width: this.width, height: this.height });
              return isHeightChanged;
          }
          return false;
      }
      applyCanvasSize() {
          this.canvas.style.backgroundColor = 'white';
          this.canvas.style.overflow = 'hidden';
          this.canvas.style.width = this.width + 'px';
          this.canvas.style.height = this.height + 'px';
          this.canvas.width = this.width * this.pixelRatio;
          this.canvas.height = this.height * this.pixelRatio;
          this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
          this.ctx.font = this.styles.font;
          this.lastUsedColor = null;
          this.lastUsedStrokeColor = null;
      }
      copy(engine) {
          const ratio = this.isSafari ? 1 : engine.pixelRatio;
          if (engine.canvas.height) {
              this.ctx.drawImage(engine.canvas, 0, 0, engine.canvas.width * ratio, engine.canvas.height * ratio, 0, engine.position || 0, engine.width * ratio, engine.height * ratio);
          }
      }
      renderTooltipFromData(fields, mouse) {
          const mouseX = mouse.x + 10;
          const mouseY = mouse.y + 10;
          const maxWidth = fields
              .map(({ text }) => text)
              .map((text) => this.ctx.measureText(text))
              .reduce((acc, { width }) => Math.max(acc, width), 0);
          const fullWidth = maxWidth + this.blockPaddingLeftRight * 2;
          this.ctx.shadowColor = 'black';
          this.ctx.shadowBlur = 5;
          this.setCtxColor(this.styles.tooltipBackgroundColor);
          this.ctx.fillRect(mouseX, mouseY, fullWidth + this.blockPaddingLeftRight * 2, (this.charHeight + 2) * fields.length + this.blockPaddingLeftRight * 2);
          this.ctx.shadowColor = 'transparent';
          this.ctx.shadowBlur = 0;
          fields.forEach(({ text, color }, index) => {
              if (color) {
                  this.setCtxColor(color);
              }
              else if (!index) {
                  this.setCtxColor(this.styles.tooltipHeaderFontColor);
              }
              else {
                  this.setCtxColor(this.styles.tooltipBodyFontColor);
              }
              this.ctx.fillText(text, mouseX + this.blockPaddingLeftRight, mouseY + this.blockHeight - this.blockPaddingTopBottom + (this.charHeight + 2) * index);
          });
      }
      renderShape(color, dots, posX, posY) {
          this.setCtxColor(color);
          this.ctx.beginPath();
          this.ctx.moveTo(dots[0].x + posX, dots[0].y + posY);
          dots.slice(1).forEach(({ x, y }) => this.ctx.lineTo(x + posX, y + posY));
          this.ctx.closePath();
          this.ctx.fill();
      }
      renderTriangle(color, x, y, width, height, direction) {
          const halfHeight = height / 2;
          const halfWidth = width / 2;
          let dots;
          switch (direction) {
              case 'top':
                  dots = [
                      { x: 0 - halfWidth, y: halfHeight },
                      { x: 0, y: 0 - halfHeight },
                      { x: halfWidth, y: halfHeight },
                  ];
                  break;
              case 'right':
                  dots = [
                      { x: 0 - halfHeight, y: 0 - halfWidth },
                      { x: 0 - halfHeight, y: halfWidth },
                      { x: halfHeight, y: 0 },
                  ];
                  break;
              case 'bottom':
                  dots = [
                      { x: 0 - halfWidth, y: 0 - halfHeight },
                      { x: halfWidth, y: 0 - halfHeight },
                      { x: 0, y: halfHeight },
                  ];
                  break;
              case 'left':
                  dots = [
                      { x: halfHeight, y: 0 - halfWidth },
                      { x: halfHeight, y: halfWidth },
                      { x: 0 - halfHeight, y: 0 },
                  ];
                  break;
          }
          this.renderShape(color, dots, x, y);
      }
      renderCircle(color, x, y, radius) {
          this.ctx.beginPath();
          this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
          this.setCtxColor(color);
          this.ctx.fill();
      }
  }

  class OffscreenRenderEngine extends BasicRenderEngine {
      constructor({ width, height, parent, id }) {
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          super(canvas, { options: parent.options, styles: parent.styles });
          this.width = width;
          this.height = height;
          this.parent = parent;
          this.id = id;
          this.children = [];
          this.applyCanvasSize();
      }
      makeChild() {
          const child = new OffscreenRenderEngine({
              width: this.width,
              height: this.height,
              parent: this.parent,
              id: void 0,
          });
          this.children.push(child);
          child.setMinMax(this.min, this.max);
          child.resetView();
          return child;
      }
      setFlexible() {
          this.flexible = true;
      }
      collapse() {
          this.collapsed = true;
          this.clear();
      }
      expand() {
          this.collapsed = false;
      }
      setSettingsOverrides(settings) {
          this.setSettings({
              styles: mergeObjects(this.styles, settings.styles),
              options: mergeObjects(this.options, settings.options),
          });
          this.children.forEach((child) => child.setSettingsOverrides(settings));
      }
      // @ts-ignore - overrides a parent function which has different signature
      resize({ width, height, position }, isParentCall) {
          const isHeightChanged = super.resize(width, height);
          if (!isParentCall && isHeightChanged) {
              this.parent.recalcChildrenSizes();
          }
          if (typeof position === 'number') {
              this.position = position;
          }
          this.children.forEach((child) => child.resize({ width, height, position }));
      }
      setMinMax(min, max) {
          super.setMinMax(min, max);
          this.children.forEach((child) => child.setMinMax(min, max));
      }
      setSettings(settings) {
          super.setSettings(settings);
          if (this.children) {
              this.children.forEach((child) => child.setSettings(settings));
          }
      }
      tryToChangePosition(positionDelta) {
          this.parent.tryToChangePosition(positionDelta);
      }
      recalcMinMax() {
          this.parent.calcMinMax();
      }
      getTimeUnits() {
          return this.parent.getTimeUnits();
      }
      getAccuracy() {
          return this.parent.timeGrid.accuracy;
      }
      renderTimeGrid() {
          this.parent.timeGrid.renderLines(0, this.height, this);
      }
      renderTimeGridTimes() {
          this.parent.timeGrid.renderTimes(this);
      }
      standardRender() {
          this.resolveRectRenderQueue();
          this.resolveTextRenderQueue();
          this.resolveStrokeRenderQueue();
          this.renderTimeGrid();
      }
      renderTooltipFromData(fields, mouse) {
          this.parent.renderTooltipFromData(fields, mouse);
      }
      resetParentView() {
          this.parent.resetView();
          this.parent.render();
      }
      render() {
          this.parent.partialRender(this.id);
      }
  }

  const MAX_ACCURACY = 6;
  class RenderEngine extends BasicRenderEngine {
      constructor({ canvas, settings, timeGrid, plugins }) {
          super(canvas, settings);
          this.plugins = plugins;
          this.children = [];
          this.requestedRenders = [];
          this.timeGrid = timeGrid;
          this.timeGrid.setDefaultRenderEngine(this);
      }
      makeInstance() {
          const offscreenRenderEngine = new OffscreenRenderEngine({
              width: this.width,
              height: 0,
              id: this.children.length,
              parent: this,
          });
          offscreenRenderEngine.setMinMax(this.min, this.max);
          offscreenRenderEngine.resetView();
          this.children.push(offscreenRenderEngine);
          return offscreenRenderEngine;
      }
      calcMinMax() {
          const min = this.plugins
              .map(({ min }) => min)
              .filter(isNumber)
              .reduce((acc, min) => Math.min(acc, min));
          const max = this.plugins
              .map(({ max }) => max)
              .filter(isNumber)
              .reduce((acc, max) => Math.max(acc, max));
          this.setMinMax(min, max);
      }
      calcTimeGrid() {
          this.timeGrid.recalc();
      }
      setMinMax(min, max) {
          super.setMinMax(min, max);
          this.children.forEach((engine) => engine.setMinMax(min, max));
      }
      setSettings(data) {
          super.setSettings(data);
          if (this.children) {
              this.children.forEach((engine) => engine.setSettings(data));
              this.recalcChildrenSizes();
          }
      }
      resize(width, height) {
          const currentWidth = this.width;
          super.resize(width, height);
          this.recalcChildrenSizes();
          if (this.getInitialZoom() > this.zoom) {
              this.resetView();
          }
          else if (this.positionX > this.min) {
              this.tryToChangePosition(-this.pixelToTime((width - currentWidth) / 2));
          }
          return true;
      }
      recalcChildrenSizes() {
          const childrenSizes = this.getChildrenSizes();
          this.freeSpace = childrenSizes.reduce((acc, { height }) => acc - height, this.height);
          this.children.forEach((engine, index) => {
              engine.resize(childrenSizes[index], true);
          });
      }
      getChildrenSizes() {
          const indexes = this.children.map((engine, index) => index);
          const enginesTypes = indexes.map((index) => {
              const plugin = this.plugins[index];
              const engine = this.children[index];
              if (engine.flexible && plugin.height) {
                  return 'flexibleStatic';
              }
              else if (!plugin.height) {
                  return 'flexibleGrowing';
              }
              return 'static';
          });
          const freeSpace = enginesTypes.reduce((acc, type, index) => {
              const plugin = this.plugins[index];
              const engine = this.children[index];
              if (engine.collapsed) {
                  return acc;
              }
              else if (type === 'flexibleGrowing') {
                  return acc - (engine.height || 0);
              }
              else if (type === 'flexibleStatic') {
                  return acc - (engine?.height || plugin?.height || 0);
              }
              else if (type === 'static') {
                  return acc - (this.plugins[index]?.height ?? 0);
              }
              return acc;
          }, this.height);
          const flexibleGrowingCount = enginesTypes.filter((type) => type === 'flexibleGrowing').length;
          const freeSpacePart = Math.floor(freeSpace / flexibleGrowingCount);
          return enginesTypes.reduce((acc, type, index) => {
              const engine = this.children[index];
              const plugin = this.plugins[index];
              let height;
              if (engine.collapsed) {
                  height = 0;
              }
              else {
                  switch (type) {
                      case 'static':
                          height = plugin.height;
                          break;
                      case 'flexibleGrowing':
                          height = (engine.height || 0) + freeSpacePart;
                          break;
                      case 'flexibleStatic':
                          height = engine.height || this.plugins[index].height;
                          break;
                  }
              }
              acc.result.push({
                  width: this.width,
                  position: acc.position,
                  height,
              });
              acc.position += height;
              return acc;
          }, {
              position: 0,
              result: [],
          }).result;
      }
      getAccuracy() {
          return this.timeGrid.accuracy;
      }
      setZoom(zoom) {
          if (this.getAccuracy() < MAX_ACCURACY || zoom <= this.zoom) {
              super.setZoom(zoom);
              this.children.forEach((engine) => engine.setZoom(zoom));
              return true;
          }
          return false;
      }
      setPositionX(x) {
          const res = super.setPositionX(x);
          this.children.forEach((engine) => engine.setPositionX(x));
          return res;
      }
      renderPlugin(index) {
          const plugin = this.plugins[index];
          const engine = this.children[index];
          engine?.clear();
          if (!engine.collapsed) {
              const isFullRendered = plugin?.render?.();
              if (!isFullRendered) {
                  engine.standardRender();
              }
          }
      }
      partialRender(id) {
          if (typeof id === 'number') {
              this.requestedRenders.push(id);
          }
          if (!this.lastPartialAnimationFrame) {
              this.lastPartialAnimationFrame = requestAnimationFrame(() => {
                  this.requestedRenders.forEach((index) => this.renderPlugin(index));
                  this.shallowRender();
                  this.requestedRenders = [];
                  this.lastPartialAnimationFrame = null;
              });
          }
      }
      shallowRender() {
          this.clear();
          this.timeGrid.renderLines(this.height - this.freeSpace, this.freeSpace);
          this.children.forEach((engine) => {
              if (!engine.collapsed) {
                  this.copy(engine);
              }
          });
          let tooltipRendered = false;
          this.plugins.forEach((plugin) => {
              if (plugin.postRender) {
                  plugin.postRender();
              }
              if (plugin.renderTooltip) {
                  tooltipRendered = tooltipRendered || Boolean(plugin.renderTooltip());
              }
          });
          if (!tooltipRendered && typeof this.options.tooltip === 'function') {
              // notify tooltip of nothing to render
              this.options.tooltip(null, this, null);
          }
      }
      render() {
          if (typeof this.lastPartialAnimationFrame === 'number') {
              cancelAnimationFrame(this.lastPartialAnimationFrame);
          }
          this.requestedRenders = [];
          this.lastPartialAnimationFrame = null;
          if (!this.lastGlobalAnimationFrame) {
              this.lastGlobalAnimationFrame = requestAnimationFrame(() => {
                  this.timeGrid.recalc();
                  this.children.forEach((engine, index) => this.renderPlugin(index));
                  this.shallowRender();
                  this.lastGlobalAnimationFrame = null;
              });
          }
      }
  }

  class SeparatedInteractionsEngine extends EventEmitter {
      constructor(parent, renderEngine) {
          super();
          this.id = SeparatedInteractionsEngine.getId();
          this.parent = parent;
          this.renderEngine = renderEngine;
          renderEngine.on('clear', () => this.clearHitRegions());
          ['down', 'up', 'move', 'click', 'select'].forEach((eventName) => parent.on(eventName, (region, mouse, isClick) => {
              if (!region || region.id === this.id) {
                  this.resend(eventName, region, mouse, isClick);
              }
          }));
          ['hover'].forEach((eventName) => parent.on(eventName, (region, mouse) => {
              if (!region || region.id === this.id) {
                  this.emit(eventName, region, mouse);
              }
          }));
          parent.on('change-position', (data, startMouse, endMouse, instance) => {
              if (instance === this) {
                  this.emit('change-position', data, startMouse, endMouse);
              }
          });
          this.hitRegions = [];
      }
      static getId() {
          return SeparatedInteractionsEngine.count++;
      }
      resend(event, ...args) {
          if (this.renderEngine.position <= this.parent.mouse.y &&
              this.renderEngine.height + this.renderEngine.position >= this.parent.mouse.y) {
              this.emit(event, ...args);
          }
      }
      getMouse() {
          const { x, y } = this.parent.mouse;
          return {
              x,
              y: y - this.renderEngine.position,
          };
      }
      getGlobalMouse() {
          return this.parent.mouse;
      }
      clearHitRegions() {
          this.hitRegions = [];
      }
      addHitRegion(type, data, x, y, w, h, cursor) {
          this.hitRegions.push({
              type,
              data,
              x,
              y,
              w,
              h,
              cursor,
              id: this.id,
          });
      }
      setCursor(cursor) {
          this.parent.setCursor(cursor);
      }
      clearCursor() {
          this.parent.clearCursor();
      }
  }
  SeparatedInteractionsEngine.count = 0;

  class InteractionsEngine extends EventEmitter {
      constructor(canvas, renderEngine) {
          super();
          this.renderEngine = renderEngine;
          this.canvas = canvas;
          this.hitRegions = [];
          this.instances = [];
          this.mouse = {
              x: 0,
              y: 0,
          };
          this.handleMouseWheel = this.handleMouseWheel.bind(this);
          this.handleMouseDown = this.handleMouseDown.bind(this);
          this.handleMouseUp = this.handleMouseUp.bind(this);
          this.handleMouseMove = this.handleMouseMove.bind(this);
          this.initListeners();
          this.reset();
      }
      makeInstance(renderEngine) {
          const separatedInteractionsEngine = new SeparatedInteractionsEngine(this, renderEngine);
          this.instances.push(separatedInteractionsEngine);
          return separatedInteractionsEngine;
      }
      reset() {
          this.selectedRegion = null;
          this.hoveredRegion = null;
          this.hitRegions = [];
      }
      destroy() {
          this.removeListeners();
      }
      initListeners() {
          if (this.canvas) {
              this.canvas.addEventListener('wheel', this.handleMouseWheel);
              this.canvas.addEventListener('mousedown', this.handleMouseDown);
              this.canvas.addEventListener('mouseup', this.handleMouseUp);
              this.canvas.addEventListener('mouseleave', this.handleMouseUp);
              this.canvas.addEventListener('mousemove', this.handleMouseMove);
          }
      }
      removeListeners() {
          if (this.canvas) {
              this.canvas.removeEventListener('wheel', this.handleMouseWheel);
              this.canvas.removeEventListener('mousedown', this.handleMouseDown);
              this.canvas.removeEventListener('mouseup', this.handleMouseUp);
              this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
              this.canvas.removeEventListener('mousemove', this.handleMouseMove);
          }
      }
      handleMouseWheel(e) {
          const { deltaY, deltaX } = e;
          e.preventDefault();
          const realView = this.renderEngine.getRealView();
          const initialZoom = this.renderEngine.getInitialZoom();
          const startPosition = this.renderEngine.positionX;
          const startZoom = this.renderEngine.zoom;
          const positionScrollDelta = deltaX / this.renderEngine.zoom;
          let zoomDelta = (deltaY / 1000) * this.renderEngine.zoom;
          this.renderEngine.tryToChangePosition(positionScrollDelta);
          zoomDelta =
              this.renderEngine.zoom - zoomDelta >= initialZoom ? zoomDelta : this.renderEngine.zoom - initialZoom;
          if (zoomDelta !== 0) {
              const zoomed = this.renderEngine.setZoom(this.renderEngine.zoom - zoomDelta);
              if (zoomed) {
                  const proportion = this.mouse.x / this.renderEngine.width;
                  const timeDelta = realView - this.renderEngine.width / this.renderEngine.zoom;
                  const positionDelta = timeDelta * proportion;
                  this.renderEngine.tryToChangePosition(positionDelta);
              }
          }
          this.checkRegionHover();
          if (startPosition !== this.renderEngine.positionX || startZoom !== this.renderEngine.zoom) {
              this.renderEngine.render();
          }
      }
      handleMouseDown() {
          this.moveActive = true;
          this.mouseDownPosition = {
              x: this.mouse.x,
              y: this.mouse.y,
          };
          this.mouseDownHoveredInstance = this.hoveredInstance;
          this.emit('down', this.hoveredRegion, this.mouse);
      }
      handleMouseUp() {
          this.moveActive = false;
          const isClick = this.mouseDownPosition &&
              this.mouseDownPosition.x === this.mouse.x &&
              this.mouseDownPosition.y === this.mouse.y;
          if (isClick) {
              this.handleRegionHit();
          }
          this.emit('up', this.hoveredRegion, this.mouse, isClick);
          if (isClick) {
              this.emit('click', this.hoveredRegion, this.mouse);
          }
      }
      handleMouseMove(e) {
          if (this.moveActive) {
              const mouseDeltaY = this.mouse.y - e.offsetY;
              const mouseDeltaX = (this.mouse.x - e.offsetX) / this.renderEngine.zoom;
              if (mouseDeltaY || mouseDeltaX) {
                  this.emit('change-position', {
                      deltaX: mouseDeltaX,
                      deltaY: mouseDeltaY,
                  }, this.mouseDownPosition, this.mouse, this.mouseDownHoveredInstance);
              }
          }
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
          this.checkRegionHover();
          this.emit('move', this.hoveredRegion, this.mouse);
      }
      handleRegionHit() {
          const selectedRegion = this.getHoveredRegion();
          this.emit('select', selectedRegion, this.mouse);
      }
      checkRegionHover() {
          const hoveredRegion = this.getHoveredRegion();
          if (hoveredRegion) {
              if (!this.currentCursor && hoveredRegion.cursor) {
                  this.renderEngine.canvas.style.cursor = hoveredRegion.cursor;
              }
              else if (!this.currentCursor) {
                  this.clearCursor();
              }
              this.hoveredRegion = hoveredRegion;
              this.emit('hover', hoveredRegion, this.mouse);
              this.renderEngine.partialRender();
          }
          else if (this.hoveredRegion && !hoveredRegion) {
              if (!this.currentCursor) {
                  this.clearCursor();
              }
              this.hoveredRegion = null;
              this.emit('hover', null, this.mouse);
              this.renderEngine.partialRender();
          }
      }
      getHoveredRegion() {
          const hoveredRegion = this.hitRegions.find(({ x, y, w, h }) => this.mouse.x >= x && this.mouse.x <= x + w && this.mouse.y >= y && this.mouse.y <= y + h);
          if (hoveredRegion) {
              return hoveredRegion;
          }
          const hoveredInstance = this.instances.find(({ renderEngine }) => renderEngine.position <= this.mouse.y && renderEngine.height + renderEngine.position >= this.mouse.y);
          this.hoveredInstance = hoveredInstance;
          if (hoveredInstance) {
              const offsetTop = hoveredInstance.renderEngine.position;
              return hoveredInstance.hitRegions.find(({ x, y, w, h }) => this.mouse.x >= x &&
                  this.mouse.x <= x + w &&
                  this.mouse.y >= y + offsetTop &&
                  this.mouse.y <= y + h + offsetTop);
          }
          return null;
      }
      clearHitRegions() {
          this.hitRegions = [];
      }
      addHitRegion(type, data, x, y, w, h, cursor) {
          this.hitRegions.push({
              type,
              data,
              x,
              y,
              w,
              h,
              cursor,
          });
      }
      setCursor(cursor) {
          this.renderEngine.canvas.style.cursor = cursor;
          this.currentCursor = cursor;
      }
      clearCursor() {
          const hoveredRegion = this.getHoveredRegion();
          this.currentCursor = null;
          if (hoveredRegion?.cursor) {
              this.renderEngine.canvas.style.cursor = hoveredRegion.cursor;
          }
          else {
              this.renderEngine.canvas.style.cursor = '';
          }
      }
  }

  class FlameChartContainer extends EventEmitter {
      constructor({ canvas, plugins, settings }) {
          super();
          const styles = settings?.styles ?? {};
          this.timeGrid = new TimeGrid({ styles: styles?.timeGrid });
          this.renderEngine = new RenderEngine({
              canvas,
              settings: {
                  styles: styles?.main,
                  options: settings.options,
              },
              plugins,
              timeGrid: this.timeGrid,
          });
          this.interactionsEngine = new InteractionsEngine(canvas, this.renderEngine);
          this.plugins = plugins;
          const children = Array(this.plugins.length)
              .fill(null)
              .map(() => {
              const renderEngine = this.renderEngine.makeInstance();
              const interactionsEngine = this.interactionsEngine.makeInstance(renderEngine);
              return { renderEngine, interactionsEngine };
          });
          this.plugins.forEach((plugin, index) => {
              plugin.init(children[index].renderEngine, children[index].interactionsEngine);
          });
          this.renderEngine.calcMinMax();
          this.renderEngine.resetView();
          this.renderEngine.recalcChildrenSizes();
          this.renderEngine.calcTimeGrid();
          this.plugins.forEach((plugin) => plugin.postInit?.());
          this.renderEngine.render();
      }
      render() {
          this.renderEngine.render();
      }
      resize(width, height) {
          this.renderEngine.resize(width, height);
          this.renderEngine.render();
      }
      execOnPlugins(fnName, ...args) {
          let index = 0;
          while (index < this.plugins.length) {
              if (this.plugins[index][fnName]) {
                  this.plugins[index][fnName](...args);
              }
              index++;
          }
      }
      setSettings(settings) {
          this.timeGrid.setSettings({ styles: settings.styles?.timeGrid });
          this.renderEngine.setSettings({ options: settings.options, styles: settings.styles?.main });
          this.plugins.forEach((plugin) => plugin.setSettings?.({ styles: settings.styles?.[plugin.name] }));
          this.renderEngine.render();
      }
      setZoom(start, end) {
          const zoom = this.renderEngine.width / (end - start);
          this.renderEngine.setPositionX(start);
          this.renderEngine.setZoom(zoom);
          this.renderEngine.render();
      }
  }

  const defaultSettings = {};
  class FlameChart extends FlameChartContainer {
      constructor({ canvas, data, marks, waterfall, colors, settings = defaultSettings, plugins = [], }) {
          const activePlugins = [];
          const { headers: { waterfall: waterfallName = 'waterfall', flameChart: flameChartName = 'flame chart' } = {} } = settings;
          const styles = settings?.styles ?? {};
          const timeGridPlugin = new TimeGridPlugin({ styles: styles?.timeGridPlugin });
          activePlugins.push(timeGridPlugin);
          let marksPlugin;
          let waterfallPlugin;
          let timeframeSelectorPlugin;
          let flameChartPlugin;
          if (marks) {
              marksPlugin = new MarksPlugin(marks);
              marksPlugin.on('select', (node, type) => this.emit('select', node, type));
              activePlugins.push(marksPlugin);
          }
          if (waterfall) {
              waterfallPlugin = new WaterfallPlugin(waterfall, { styles: styles?.waterfallPlugin });
              waterfallPlugin.on('select', (node, type) => this.emit('select', node, type));
              if (data) {
                  activePlugins.push(new TogglePlugin(waterfallName, { styles: styles?.togglePlugin }));
              }
              activePlugins.push(waterfallPlugin);
          }
          if (data) {
              timeframeSelectorPlugin = new TimeframeSelectorPlugin(data, { styles: styles?.timeframeSelectorPlugin });
              flameChartPlugin = new FlameChartPlugin({ data, colors });
              flameChartPlugin.on('select', (node, type) => this.emit('select', node, type));
              if (waterfall) {
                  activePlugins.push(new TogglePlugin(flameChartName, { styles: styles?.togglePlugin }));
              }
              activePlugins.push(flameChartPlugin);
              activePlugins.unshift(timeframeSelectorPlugin);
          }
          super({
              canvas,
              settings,
              plugins: [...activePlugins, ...plugins],
          });
          if (flameChartPlugin && timeframeSelectorPlugin) {
              this.setData = (data) => {
                  if (flameChartPlugin) {
                      flameChartPlugin.setData(data);
                  }
                  if (timeframeSelectorPlugin) {
                      timeframeSelectorPlugin.setData(data);
                  }
              };
              this.setFlameChartPosition = ({ x, y }) => {
                  if (typeof x === 'number') {
                      this.renderEngine.setPositionX(x);
                  }
                  if (typeof y === 'number' && flameChartPlugin) {
                      flameChartPlugin.setPositionY(y);
                  }
                  this.renderEngine.render();
              };
          }
          if (marksPlugin) {
              this.setMarks = (data) => {
                  if (marksPlugin) {
                      marksPlugin.setMarks(data);
                  }
              };
          }
          if (waterfallPlugin) {
              this.setWaterfall = (data) => {
                  if (waterfallPlugin) {
                      waterfallPlugin.setData(data);
                  }
              };
          }
      }
  }

  var chars = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

  var randomString = function randomString(length) {
    var minLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    var rndLength = rnd(length, minLength);
    var str = '';

    for (var i = rndLength; i--;) {
      str += chars[rnd(chars.length - 1)];
    }

    return str;
  };

  var rnd = function rnd(max) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return Math.round(Math.random() * (max - min)) + min;
  };

  var rndFloat = function rndFloat(max) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return Math.random() * (max - min) + min;
  };

  var generateRandomLevel = function generateRandomLevel(count) {
    var minChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var maxChild = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var parent = arguments.length > 3 ? arguments[3] : undefined;
    var childrenCount = count ? rnd(Math.min(count, maxChild), Math.min(count, minChild)) : 0;
    var items = Array(childrenCount).fill(null).map(function () {
      return {
        children: [],
        parent: parent
      };
    });
    var rest = count - childrenCount;

    if (parent) {
      parent.children = items;
    }

    return {
      rest: rest,
      items: items
    };
  };

  var generateRandomNesting = function generateRandomNesting(count, minChild, maxChild, parent) {
    var levels = [];
    var rest = count;
    var isStopped = false;

    while (rest > 0 && !isStopped) {
      if (!levels.length) {
        var layer = generateRandomLevel(rest, Math.min(minChild, 1), maxChild, parent);
        levels.push([layer.items]);
        rest = layer.rest;
      } else {
        var level = levels[levels.length - 1];
        var innerLevel = [];

        for (var i = 0; i < level.length; i++) {
          for (var j = 0; j < level[i].length; j++) {
            var _layer = generateRandomLevel(rest, minChild, maxChild, level[i][j]);

            rest = _layer.rest;
            innerLevel.push(_layer.items);
          }
        }

        if (!innerLevel.length) {
          isStopped = true;
        } else {
          levels.push(innerLevel);
        }
      }
    }

    console.log('Total count:', levels.reduce(function (acc, level) {
      return level.reduce(function (acc, subLevel) {
        return acc + subLevel.length;
      }, acc);
    }, 0));
    return {
      root: levels[0][0],
      rest: rest
    };
  };

  var map = function map(treeList, cb) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    return cb(treeList, parent).map(function (item) {
      item.children = map(item.children, cb, item);
      return item;
    });
  };

  var generateRandomTree = function generateRandomTree(_ref) {
    var count = _ref.count,
        start = _ref.start,
        end = _ref.end,
        minChild = _ref.minChild,
        maxChild = _ref.maxChild,
        thinning = _ref.thinning,
        colorsMonotony = _ref.colorsMonotony,
        colorsCount = _ref.colorsCount;

    var _generateRandomNestin = generateRandomNesting(count, minChild, maxChild, null),
        nestingArrays = _generateRandomNestin.root;

    var types = Array(colorsCount).fill(null).map(function () {
      return randomString(10);
    });
    var counter = 0;
    var typesCounter = 0;
    var currentType = types[typesCounter];
    var mappedNestingArrays = map(nestingArrays, function (items, parent) {
      var itemsCount = items.length;
      var innerStart = parent && parent.start ? parent.start : start;
      var innerEnd = parent && parent.end ? parent.end : end;
      var timestamps = itemsCount > 1 ? Array(itemsCount - 1).fill(null).map(function () {
        return rndFloat(innerStart, innerEnd);
      }).concat(innerStart, innerEnd).sort(function (a, b) {
        return a - b;
      }) : [innerStart, innerEnd];
      items.forEach(function (item, index) {
        var currentWindow = timestamps[index + 1] - timestamps[index];

        if (counter > colorsMonotony) {
          counter = 0;
          currentType = types[typesCounter];
          typesCounter++;

          if (typesCounter >= types.length) {
            typesCounter = 0;
          }
        }

        item.start = timestamps[index] + rndFloat(currentWindow, 0) * (rndFloat(thinning) / 100);
        item.end = timestamps[index + 1] - rndFloat(currentWindow, 0) * (rndFloat(thinning) / 100);
        item.duration = item.end - item.start;
        item.name = randomString(14);
        item.type = currentType;
        item.parent = null;
        counter++;
      });
      return items;
    });
    console.log('Data:', mappedNestingArrays);
    return mappedNestingArrays;
  };

  var query = location.search;
  var initQuery = function initQuery(flameChart) {
    if (query) {
      var args = query.split('?').map(function (arg) {
        return arg.split('=');
      }).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        acc[key] = value;
        return acc;
      }, {});

      if (args.file) {
        fetch(decodeURIComponent(args.file), {
          method: 'GET',
          mode: 'no-cors'
        }).then(function (res) {
          return res.text();
        }).then(function (data) {
          flameChart.setData(JSON.parse(data));
          flameChart.resetView();
        });
      }
    }
  };

  var wrapper = document.getElementById('wrapper');
  var canvas = document.getElementById('canvas');
  var nodeView = document.getElementById('selected-node');
  var dataInputsContainer = document.getElementById('data-inputs');
  var stylesInputsContainer = document.getElementById('styles-inputs');
  var updateStylesButton = document.getElementById('update-styles-button');
  var updateButton = document.getElementById('update-button');
  var exportButton = document.getElementById('export-button');
  var importButton = document.getElementById('import-button');
  var importInput = document.getElementById('import-input');
  var customStyles = {};

  var createInput = function createInput(_ref, prefix) {
    var name = _ref.name,
        units = _ref.units,
        value = _ref.value,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? 'number' : _ref$type;
    var input = document.createElement('input');
    var label = document.createElement('label');
    var div = document.createElement('div');
    var id = (prefix ? prefix + '-' : '') + name;
    div.classList.add('inputWrapper');
    label.classList.add('inputLabel');
    label.setAttribute('for', id);
    label.innerHTML = "".concat(name).concat(units ? "(".concat(units, ")") : '', ":");
    input.id = id;
    input.value = value;
    input.classList.add('input');
    input.setAttribute('type', type);
    div.appendChild(label);
    div.appendChild(input);
    return {
      div: div,
      input: input,
      label: label
    };
  };

  var addInputs = function addInputs(inputsContainer, inputsDict) {
    var fragment = document.createDocumentFragment();
    inputsDict.forEach(function (item, index) {
      var _createInput = createInput(item),
          div = _createInput.div,
          input = _createInput.input;

      input.addEventListener('change', function (e) {
        return inputsDict[index].value = parseInt(e.target.value);
      });
      fragment.appendChild(div);
    });
    inputsContainer.appendChild(fragment);
  };

  var addStylesInputs = function addStylesInputs(inputsContainer, styles) {
    var fragment = document.createDocumentFragment();
    Object.entries(styles).forEach(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          value = _ref3[1];

      customStyles[key] = _objectSpread2({}, value);
    });
    Object.entries(styles).forEach(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
          component = _ref5[0],
          stylesBlock = _ref5[1];

      var title = document.createElement('div');
      title.innerHTML = component;
      title.classList.add('inputsTitle');
      fragment.appendChild(title);
      Object.entries(stylesBlock).forEach(function (_ref6) {
        var _ref7 = _slicedToArray(_ref6, 2),
            styleName = _ref7[0],
            value = _ref7[1];

        var isNumber = typeof value === 'number';

        var _createInput2 = createInput({
          name: styleName,
          value: value,
          type: isNumber ? 'number' : 'text'
        }, component),
            input = _createInput2.input,
            div = _createInput2.div;

        input.addEventListener('change', function (e) {
          customStyles[component][styleName] = isNumber ? parseInt(e.target.value) : e.target.value;
        });
        fragment.appendChild(div);
      });
    });
    inputsContainer.appendChild(fragment);
  };

  importButton.addEventListener('click', function () {
    importInput.click();
  });

  var download = function download(content, fileName, contentType) {
    var a = document.createElement('a');
    var file = new Blob([content], {
      type: contentType
    });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  };

  var initView = function initView(flameChart, config, styles) {
    addInputs(dataInputsContainer, config);
    addStylesInputs(stylesInputsContainer, styles);
  };
  var getInputValues = function getInputValues(config) {
    return config.reduce(function (acc, _ref8) {
      var name = _ref8.name,
          value = _ref8.value;
      acc[name] = value;
      return acc;
    }, {});
  };
  var setNodeView = function setNodeView(text) {
    nodeView.innerHTML = text;
  };
  var onApplyStyles = function onApplyStyles(cb) {
    updateStylesButton.addEventListener('click', function () {
      cb(customStyles);
    });
  };
  var onUpdate = function onUpdate(cb) {
    updateButton.addEventListener('click', function () {
      updateButton.innerHTML = 'Generating...';
      updateButton.setAttribute('disabled', 'true');
      setTimeout(function () {
        cb();
        updateButton.removeAttribute('disabled');
        updateButton.innerHTML = 'Generate random tree';
      }, 1);
    });
  };
  var onExport = function onExport(cb) {
    exportButton.addEventListener('click', function () {
      var data = cb();
      download(data, 'data.json', 'application/json');
    });
  };
  var onImport = function onImport(cb) {
    importInput.addEventListener('change', function (e) {
      e.target.files[0].text().then(cb);
    });
  };
  var getWrapperWH = function getWrapperWH() {
    var style = window.getComputedStyle(wrapper, null);
    return [parseInt(style.getPropertyValue('width')), parseInt(style.getPropertyValue('height')) - 3];
  };
  var getCanvas = function getCanvas() {
    return canvas;
  };

  var treeConfig = [{
    name: 'count',
    value: 100000
  }, {
    name: 'start',
    value: 500
  }, {
    name: 'end',
    value: 5000
  }, {
    name: 'minChild',
    value: 1
  }, {
    name: 'maxChild',
    value: 3
  }, {
    name: 'thinning',
    units: '%',
    value: 12
  }, {
    name: 'colorsMonotony',
    value: 40
  }, {
    name: 'colorsCount',
    value: 10
  }];
  var marks = [{
    shortName: 'DCL',
    fullName: 'DOMContentLoaded',
    timestamp: 2000,
    color: '#d7c44c'
  }, {
    shortName: 'LE',
    fullName: 'LoadEvent',
    timestamp: 2100,
    color: '#4fd24a'
  }, {
    shortName: 'TTI',
    fullName: 'Time To Interactive',
    timestamp: 3000,
    color: '#4b7ad7'
  }];
  var colors = {
    task: '#696969',
    event: '#a4775b'
  };

  var generateData = function generateData() {
    return generateRandomTree(getInputValues(treeConfig));
  };

  var currentData = query ? [] : generateData();

  var _getWrapperWH = getWrapperWH(),
      _getWrapperWH2 = _slicedToArray(_getWrapperWH, 2),
      width = _getWrapperWH2[0],
      height = _getWrapperWH2[1];

  var canvas$1 = getCanvas();
  canvas$1.width = width;
  canvas$1.height = height;
  var testItems = [{
    name: 'foo',
    intervals: 'default',
    timing: {
      requestStart: 2050,
      responseStart: 2500,
      responseEnd: 2600
    }
  }, {
    name: 'bar',
    intervals: 'default',
    timing: {
      requestStart: 2120,
      responseStart: 2180,
      responseEnd: 2300
    }
  }, {
    name: 'bar2',
    intervals: 'default',
    timing: {
      requestStart: 2120,
      responseStart: 2180,
      responseEnd: 2300
    }
  }, {
    name: 'bar3',
    intervals: 'default',
    timing: {
      requestStart: 2130,
      responseStart: 2180,
      responseEnd: 2320
    }
  }, {
    name: 'bar4',
    intervals: 'default',
    timing: {
      requestStart: 2300,
      responseStart: 2350,
      responseEnd: 2400
    }
  }, {
    name: 'bar5',
    intervals: 'default',
    timing: {
      requestStart: 2500,
      responseStart: 2520,
      responseEnd: 2550
    }
  }];
  var testIntervals = {
    "default": [{
      name: 'waiting',
      color: 'rgb(207,196,152)',
      type: 'block',
      start: 'requestStart',
      end: 'responseStart'
    }, {
      name: 'downloading',
      color: 'rgb(207,180,81)',
      type: 'block',
      start: 'responseStart',
      end: 'responseEnd'
    }]
  };
  var flameChart = new FlameChart({
    canvas: canvas$1,
    data: currentData,
    marks: marks,
    waterfall: {
      items: testItems,
      intervals: testIntervals
    },
    colors: colors
  });
  flameChart.on('select', function (node, type) {
    setNodeView(node ? "".concat(type, "\r\n").concat(JSON.stringify(_objectSpread2(_objectSpread2({}, node), {}, {
      source: _objectSpread2(_objectSpread2({}, node.source), {}, {
        children: '[]'
      }),
      parent: undefined
    }), null, '  ')) : '');
  });
  window.addEventListener('resize', function () {
    flameChart.resize.apply(flameChart, _toConsumableArray(getWrapperWH()));
  });
  onApplyStyles(function (styles) {
    flameChart.setSettings({
      styles: styles
    });
  });
  onUpdate(function () {
    currentData = generateData();
    flameChart.setData(currentData);
  });
  onImport(function (data) {
    currentData = JSON.parse(data);
    flameChart.setData(currentData);
  });
  onExport(function () {
    return JSON.stringify(currentData);
  });
  initQuery(flameChart);
  initView(flameChart, treeConfig, {
    main: defaultRenderStyles,
    timeGrid: defaultTimeGridStyles,
    timeGridPlugin: defaultTimeGridPluginStyles,
    timeframeSelectorPlugin: defaultTimeframeSelectorPluginStyles,
    waterfallPlugin: defaultWaterfallPluginStyles,
    togglePlugin: defaultTogglePluginStyles
  });

}());
