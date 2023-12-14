const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var style = "";
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
/*! Capacitor: https://capacitorjs.com/ - MIT License */
const createCapacitorPlatforms = (win) => {
  const defaultPlatformMap = /* @__PURE__ */ new Map();
  defaultPlatformMap.set("web", { name: "web" });
  const capPlatforms = win.CapacitorPlatforms || {
    currentPlatform: { name: "web" },
    platforms: defaultPlatformMap
  };
  const addPlatform = (name, platform) => {
    capPlatforms.platforms.set(name, platform);
  };
  const setPlatform = (name) => {
    if (capPlatforms.platforms.has(name)) {
      capPlatforms.currentPlatform = capPlatforms.platforms.get(name);
    }
  };
  capPlatforms.addPlatform = addPlatform;
  capPlatforms.setPlatform = setPlatform;
  return capPlatforms;
};
const initPlatforms = (win) => win.CapacitorPlatforms = createCapacitorPlatforms(win);
const CapacitorPlatforms = /* @__PURE__ */ initPlatforms(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
CapacitorPlatforms.addPlatform;
CapacitorPlatforms.setPlatform;
var ExceptionCode;
(function(ExceptionCode2) {
  ExceptionCode2["Unimplemented"] = "UNIMPLEMENTED";
  ExceptionCode2["Unavailable"] = "UNAVAILABLE";
})(ExceptionCode || (ExceptionCode = {}));
class CapacitorException extends Error {
  constructor(message, code, data) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;
  }
}
const getPlatformId = (win) => {
  var _a, _b;
  if (win === null || win === void 0 ? void 0 : win.androidBridge) {
    return "android";
  } else if ((_b = (_a = win === null || win === void 0 ? void 0 : win.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b.bridge) {
    return "ios";
  } else {
    return "web";
  }
};
const createCapacitor = (win) => {
  var _a, _b, _c, _d, _e;
  const capCustomPlatform = win.CapacitorCustomPlatform || null;
  const cap = win.Capacitor || {};
  const Plugins = cap.Plugins = cap.Plugins || {};
  const capPlatforms = win.CapacitorPlatforms;
  const defaultGetPlatform = () => {
    return capCustomPlatform !== null ? capCustomPlatform.name : getPlatformId(win);
  };
  const getPlatform = ((_a = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _a === void 0 ? void 0 : _a.getPlatform) || defaultGetPlatform;
  const defaultIsNativePlatform = () => getPlatform() !== "web";
  const isNativePlatform = ((_b = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _b === void 0 ? void 0 : _b.isNativePlatform) || defaultIsNativePlatform;
  const defaultIsPluginAvailable = (pluginName) => {
    const plugin = registeredPlugins.get(pluginName);
    if (plugin === null || plugin === void 0 ? void 0 : plugin.platforms.has(getPlatform())) {
      return true;
    }
    if (getPluginHeader(pluginName)) {
      return true;
    }
    return false;
  };
  const isPluginAvailable = ((_c = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _c === void 0 ? void 0 : _c.isPluginAvailable) || defaultIsPluginAvailable;
  const defaultGetPluginHeader = (pluginName) => {
    var _a2;
    return (_a2 = cap.PluginHeaders) === null || _a2 === void 0 ? void 0 : _a2.find((h) => h.name === pluginName);
  };
  const getPluginHeader = ((_d = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _d === void 0 ? void 0 : _d.getPluginHeader) || defaultGetPluginHeader;
  const handleError = (err) => win.console.error(err);
  const pluginMethodNoop = (_target, prop, pluginName) => {
    return Promise.reject(`${pluginName} does not have an implementation of "${prop}".`);
  };
  const registeredPlugins = /* @__PURE__ */ new Map();
  const defaultRegisterPlugin = (pluginName, jsImplementations = {}) => {
    const registeredPlugin = registeredPlugins.get(pluginName);
    if (registeredPlugin) {
      console.warn(`Capacitor plugin "${pluginName}" already registered. Cannot register plugins twice.`);
      return registeredPlugin.proxy;
    }
    const platform = getPlatform();
    const pluginHeader = getPluginHeader(pluginName);
    let jsImplementation;
    const loadPluginImplementation = async () => {
      if (!jsImplementation && platform in jsImplementations) {
        jsImplementation = typeof jsImplementations[platform] === "function" ? jsImplementation = await jsImplementations[platform]() : jsImplementation = jsImplementations[platform];
      } else if (capCustomPlatform !== null && !jsImplementation && "web" in jsImplementations) {
        jsImplementation = typeof jsImplementations["web"] === "function" ? jsImplementation = await jsImplementations["web"]() : jsImplementation = jsImplementations["web"];
      }
      return jsImplementation;
    };
    const createPluginMethod = (impl, prop) => {
      var _a2, _b2;
      if (pluginHeader) {
        const methodHeader = pluginHeader === null || pluginHeader === void 0 ? void 0 : pluginHeader.methods.find((m) => prop === m.name);
        if (methodHeader) {
          if (methodHeader.rtype === "promise") {
            return (options) => cap.nativePromise(pluginName, prop.toString(), options);
          } else {
            return (options, callback) => cap.nativeCallback(pluginName, prop.toString(), options, callback);
          }
        } else if (impl) {
          return (_a2 = impl[prop]) === null || _a2 === void 0 ? void 0 : _a2.bind(impl);
        }
      } else if (impl) {
        return (_b2 = impl[prop]) === null || _b2 === void 0 ? void 0 : _b2.bind(impl);
      } else {
        throw new CapacitorException(`"${pluginName}" plugin is not implemented on ${platform}`, ExceptionCode.Unimplemented);
      }
    };
    const createPluginMethodWrapper = (prop) => {
      let remove;
      const wrapper = (...args) => {
        const p2 = loadPluginImplementation().then((impl) => {
          const fn = createPluginMethod(impl, prop);
          if (fn) {
            const p3 = fn(...args);
            remove = p3 === null || p3 === void 0 ? void 0 : p3.remove;
            return p3;
          } else {
            throw new CapacitorException(`"${pluginName}.${prop}()" is not implemented on ${platform}`, ExceptionCode.Unimplemented);
          }
        });
        if (prop === "addListener") {
          p2.remove = async () => remove();
        }
        return p2;
      };
      wrapper.toString = () => `${prop.toString()}() { [capacitor code] }`;
      Object.defineProperty(wrapper, "name", {
        value: prop,
        writable: false,
        configurable: false
      });
      return wrapper;
    };
    const addListener = createPluginMethodWrapper("addListener");
    const removeListener = createPluginMethodWrapper("removeListener");
    const addListenerNative = (eventName, callback) => {
      const call = addListener({ eventName }, callback);
      const remove = async () => {
        const callbackId = await call;
        removeListener({
          eventName,
          callbackId
        }, callback);
      };
      const p2 = new Promise((resolve) => call.then(() => resolve({ remove })));
      p2.remove = async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      };
      return p2;
    };
    const proxy = new Proxy({}, {
      get(_, prop) {
        switch (prop) {
          case "$$typeof":
            return void 0;
          case "toJSON":
            return () => ({});
          case "addListener":
            return pluginHeader ? addListenerNative : addListener;
          case "removeListener":
            return removeListener;
          default:
            return createPluginMethodWrapper(prop);
        }
      }
    });
    Plugins[pluginName] = proxy;
    registeredPlugins.set(pluginName, {
      name: pluginName,
      proxy,
      platforms: /* @__PURE__ */ new Set([
        ...Object.keys(jsImplementations),
        ...pluginHeader ? [platform] : []
      ])
    });
    return proxy;
  };
  const registerPlugin2 = ((_e = capPlatforms === null || capPlatforms === void 0 ? void 0 : capPlatforms.currentPlatform) === null || _e === void 0 ? void 0 : _e.registerPlugin) || defaultRegisterPlugin;
  if (!cap.convertFileSrc) {
    cap.convertFileSrc = (filePath) => filePath;
  }
  cap.getPlatform = getPlatform;
  cap.handleError = handleError;
  cap.isNativePlatform = isNativePlatform;
  cap.isPluginAvailable = isPluginAvailable;
  cap.pluginMethodNoop = pluginMethodNoop;
  cap.registerPlugin = registerPlugin2;
  cap.Exception = CapacitorException;
  cap.DEBUG = !!cap.DEBUG;
  cap.isLoggingEnabled = !!cap.isLoggingEnabled;
  cap.platform = cap.getPlatform();
  cap.isNative = cap.isNativePlatform();
  return cap;
};
const initCapacitorGlobal = (win) => win.Capacitor = createCapacitor(win);
const Capacitor = /* @__PURE__ */ initCapacitorGlobal(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
const registerPlugin = Capacitor.registerPlugin;
Capacitor.Plugins;
class WebPlugin {
  constructor(config) {
    this.listeners = {};
    this.windowListeners = {};
    if (config) {
      console.warn(`Capacitor WebPlugin "${config.name}" config object was deprecated in v3 and will be removed in v4.`);
      this.config = config;
    }
  }
  addListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listenerFunc);
    const windowListener = this.windowListeners[eventName];
    if (windowListener && !windowListener.registered) {
      this.addWindowListener(windowListener);
    }
    const remove = async () => this.removeListener(eventName, listenerFunc);
    const p2 = Promise.resolve({ remove });
    Object.defineProperty(p2, "remove", {
      value: async () => {
        console.warn(`Using addListener() without 'await' is deprecated.`);
        await remove();
      }
    });
    return p2;
  }
  async removeAllListeners() {
    this.listeners = {};
    for (const listener in this.windowListeners) {
      this.removeWindowListener(this.windowListeners[listener]);
    }
    this.windowListeners = {};
  }
  notifyListeners(eventName, data) {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
  hasListeners(eventName) {
    return !!this.listeners[eventName].length;
  }
  registerWindowListener(windowEventName, pluginEventName) {
    this.windowListeners[pluginEventName] = {
      registered: false,
      windowEventName,
      pluginEventName,
      handler: (event) => {
        this.notifyListeners(pluginEventName, event);
      }
    };
  }
  unimplemented(msg = "not implemented") {
    return new Capacitor.Exception(msg, ExceptionCode.Unimplemented);
  }
  unavailable(msg = "not available") {
    return new Capacitor.Exception(msg, ExceptionCode.Unavailable);
  }
  async removeListener(eventName, listenerFunc) {
    const listeners = this.listeners[eventName];
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listenerFunc);
    this.listeners[eventName].splice(index, 1);
    if (!this.listeners[eventName].length) {
      this.removeWindowListener(this.windowListeners[eventName]);
    }
  }
  addWindowListener(handle) {
    window.addEventListener(handle.windowEventName, handle.handler);
    handle.registered = true;
  }
  removeWindowListener(handle) {
    if (!handle) {
      return;
    }
    window.removeEventListener(handle.windowEventName, handle.handler);
    handle.registered = false;
  }
}
const encode = (str) => encodeURIComponent(str).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
const decode = (str) => str.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
class CapacitorCookiesPluginWeb extends WebPlugin {
  async getCookies() {
    const cookies = document.cookie;
    const cookieMap = {};
    cookies.split(";").forEach((cookie) => {
      if (cookie.length <= 0)
        return;
      let [key, value] = cookie.replace(/=/, "CAP_COOKIE").split("CAP_COOKIE");
      key = decode(key).trim();
      value = decode(value).trim();
      cookieMap[key] = value;
    });
    return cookieMap;
  }
  async setCookie(options) {
    try {
      const encodedKey = encode(options.key);
      const encodedValue = encode(options.value);
      const expires = `; expires=${(options.expires || "").replace("expires=", "")}`;
      const path = (options.path || "/").replace("path=", "");
      const domain = options.url != null && options.url.length > 0 ? `domain=${options.url}` : "";
      document.cookie = `${encodedKey}=${encodedValue || ""}${expires}; path=${path}; ${domain};`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async deleteCookie(options) {
    try {
      document.cookie = `${options.key}=; Max-Age=0`;
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearCookies() {
    try {
      const cookies = document.cookie.split(";") || [];
      for (const cookie of cookies) {
        document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async clearAllCookies() {
    try {
      await this.clearCookies();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
registerPlugin("CapacitorCookies", {
  web: () => new CapacitorCookiesPluginWeb()
});
const readBlobAsBase64 = async (blob) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => {
    const base64String = reader.result;
    resolve(base64String.indexOf(",") >= 0 ? base64String.split(",")[1] : base64String);
  };
  reader.onerror = (error) => reject(error);
  reader.readAsDataURL(blob);
});
const normalizeHttpHeaders = (headers = {}) => {
  const originalKeys = Object.keys(headers);
  const loweredKeys = Object.keys(headers).map((k) => k.toLocaleLowerCase());
  const normalized = loweredKeys.reduce((acc, key, index) => {
    acc[key] = headers[originalKeys[index]];
    return acc;
  }, {});
  return normalized;
};
const buildUrlParams = (params, shouldEncode = true) => {
  if (!params)
    return null;
  const output = Object.entries(params).reduce((accumulator, entry) => {
    const [key, value] = entry;
    let encodedValue;
    let item;
    if (Array.isArray(value)) {
      item = "";
      value.forEach((str) => {
        encodedValue = shouldEncode ? encodeURIComponent(str) : str;
        item += `${key}=${encodedValue}&`;
      });
      item.slice(0, -1);
    } else {
      encodedValue = shouldEncode ? encodeURIComponent(value) : value;
      item = `${key}=${encodedValue}`;
    }
    return `${accumulator}&${item}`;
  }, "");
  return output.substr(1);
};
const buildRequestInit = (options, extra = {}) => {
  const output = Object.assign({ method: options.method || "GET", headers: options.headers }, extra);
  const headers = normalizeHttpHeaders(options.headers);
  const type = headers["content-type"] || "";
  if (typeof options.data === "string") {
    output.body = options.data;
  } else if (type.includes("application/x-www-form-urlencoded")) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options.data || {})) {
      params.set(key, value);
    }
    output.body = params.toString();
  } else if (type.includes("multipart/form-data")) {
    const form = new FormData();
    if (options.data instanceof FormData) {
      options.data.forEach((value, key) => {
        form.append(key, value);
      });
    } else {
      for (const key of Object.keys(options.data)) {
        form.append(key, options.data[key]);
      }
    }
    output.body = form;
    const headers2 = new Headers(output.headers);
    headers2.delete("content-type");
    output.headers = headers2;
  } else if (type.includes("application/json") || typeof options.data === "object") {
    output.body = JSON.stringify(options.data);
  }
  return output;
};
class CapacitorHttpPluginWeb extends WebPlugin {
  async request(options) {
    const requestInit = buildRequestInit(options, options.webFetchExtra);
    const urlParams = buildUrlParams(options.params, options.shouldEncodeUrlParams);
    const url = urlParams ? `${options.url}?${urlParams}` : options.url;
    const response = await fetch(url, requestInit);
    const contentType = response.headers.get("content-type") || "";
    let { responseType = "text" } = response.ok ? options : {};
    if (contentType.includes("application/json")) {
      responseType = "json";
    }
    let data;
    let blob;
    switch (responseType) {
      case "arraybuffer":
      case "blob":
        blob = await response.blob();
        data = await readBlobAsBase64(blob);
        break;
      case "json":
        data = await response.json();
        break;
      case "document":
      case "text":
      default:
        data = await response.text();
    }
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return {
      data,
      headers,
      status: response.status,
      url: response.url
    };
  }
  async get(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "GET" }));
  }
  async post(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "POST" }));
  }
  async put(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PUT" }));
  }
  async patch(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "PATCH" }));
  }
  async delete(options) {
    return this.request(Object.assign(Object.assign({}, options), { method: "DELETE" }));
  }
}
registerPlugin("CapacitorHttp", {
  web: () => new CapacitorHttpPluginWeb()
});
const SplashScreen = registerPlugin("SplashScreen", {
  web: () => __vitePreload(() => import("./web.e5007c2f.js"), true ? [] : void 0).then((m) => new m.SplashScreenWeb())
});
var CameraSource;
(function(CameraSource2) {
  CameraSource2["Prompt"] = "PROMPT";
  CameraSource2["Camera"] = "CAMERA";
  CameraSource2["Photos"] = "PHOTOS";
})(CameraSource || (CameraSource = {}));
var CameraDirection;
(function(CameraDirection2) {
  CameraDirection2["Rear"] = "REAR";
  CameraDirection2["Front"] = "FRONT";
})(CameraDirection || (CameraDirection = {}));
var CameraResultType;
(function(CameraResultType2) {
  CameraResultType2["Uri"] = "uri";
  CameraResultType2["Base64"] = "base64";
  CameraResultType2["DataUrl"] = "dataUrl";
})(CameraResultType || (CameraResultType = {}));
const Camera = registerPlugin("Camera", {
  web: () => __vitePreload(() => import("./web.2d55e311.js"), true ? [] : void 0).then((m) => new m.CameraWeb())
});
const NativeScriptCap = registerPlugin("NativeScriptCap", {
  web: () => __vitePreload(() => import("./web.8d6e7f02.js"), true ? [] : void 0).then((m) => new m.NativeScriptCapWeb())
});
if (typeof window.native === "undefined") {
  const NS_PROXY_ID = "NS$id";
  const NS_PROXY_FUNCTION = "NS$func";
  const NS_PROXY = "NS$proxy";
  const NS_PROXY_PROP = "NS$prop";
  const NS_PROXY_FULL_PROP = "NS$fullProp";
  const NS_PROXY_CHILDREN = "NS$children";
  const NS_PROXY_PARENT = "NS$parent";
  const NS_PROXY_VALUE = "NS$value";
  const NS_PROXY_IS_FUNCTION = "NS$isFunction";
  const NS_FUNCTION_PENDING = "NS$FunctionPending";
  const NS_FUNCTION_PENDING_LIST = "NS$FunctionPendingList";
  const NS_PROXY_HAS_WAITING_VALUE = "NS$hasWaitingValue";
  const NS_MARSHALL_STARTUP = 0;
  const NS_MARSHALL_STRING = 1;
  const NS_MARSHALL_FUNCTION = 2;
  const NS_MARSHALL_CONSTRUCTOR = 3;
  const NS_MARSHALL_GET = 4;
  const NS_MARSHALL_SET = 5;
  const NS_MARSHALL_PLATFORM = 6;
  const NS_MARSHALL_CALLBACK = 7;
  const NS_MARSHALL_CONSOLE = 1e3;
  const native_handler = {
    get: function(target, prop, receiver) {
      if (prop === "isAndroid") {
        return window.native.__func.__android;
      } else if (prop === "isIOS") {
        return window.native.__func.__ios;
      }
      if (prop === "__func") {
        return target;
      } else if (prop === "__isProxy") {
        return true;
      } else if (prop === "run" || prop === "get") {
        return function(value) {
          return NativeScriptProxy.instance.marshallString(value, prop === "get");
        };
      } else {
        return NativeScriptProxy.instance._getter(target, prop, receiver);
      }
    },
    set: function(target, prop, value, receiver) {
      return NativeScriptProxy.instance._setter(target, prop, value, receiver);
    },
    construct: function() {
      throw new Error("You are not supposed to do `new native()`, try nativeLog('hi');");
    },
    apply: function() {
      throw new Error("You are not supposed to do `native()`, try nativeLog('hi');");
    }
  };
  const sub_handler = {
    construct: function(target, argsList, newTarget) {
      target[NS_PROXY_IS_FUNCTION] = true;
      if (typeof target[NS_FUNCTION_PENDING] !== "number") {
        target[NS_FUNCTION_PENDING] = 1;
        target[NS_FUNCTION_PENDING_LIST] = [];
      } else {
        target[NS_FUNCTION_PENDING]++;
      }
      NativeScriptProxy.instance.marshall(NS_MARSHALL_CONSTRUCTOR, target, target[NS_PROXY_PROP], argsList);
      return newTarget;
    },
    get: function(target, prop, receiver) {
      return NativeScriptProxy.instance._getter(target, prop, receiver);
    },
    set: function(target, prop, value, receiver) {
      return NativeScriptProxy.instance._setter(target, prop, value, receiver);
    },
    apply: function(target, _thisArg, argumentsList) {
      {
        nativeLog("Execute:", target[NS_PROXY_FULL_PROP] + "(", argumentsList, ")");
      }
      target[NS_PROXY_IS_FUNCTION] = true;
      if (typeof target[NS_FUNCTION_PENDING] !== "number") {
        target[NS_FUNCTION_PENDING] = 1;
        target[NS_FUNCTION_PENDING_LIST] = [];
      } else {
        target[NS_FUNCTION_PENDING]++;
      }
      NativeScriptProxy.instance.marshall(NS_MARSHALL_FUNCTION, target, target[NS_PROXY_PROP], argumentsList);
      return target[NS_PROXY];
    }
  };
  class NativeScriptProxy {
    constructor() {
      this._id = 0;
      this._trackingId = 0;
      this._callbackId = 0;
      this._callbacks = [];
      if (NativeScriptProxy.instance) {
        return NativeScriptProxy.instance[NS_PROXY];
      }
      NativeScriptProxy.instance = this;
      this._id = 0;
      this._trackingId = 0;
      this._tracking = {};
      const proxy = this.getProxy(null, "native", native_handler);
      this[NS_PROXY] = proxy;
      this[NS_PROXY_FUNCTION] = proxy.__func;
      NativeScriptCap.addListener("fromNativeScript", (info) => {
        this.receiveMessage(info);
      });
      setTimeout(() => {
        this.sendMessage({ cmd: NS_MARSHALL_STARTUP });
      }, 0);
      return proxy;
    }
    sendMessage(msg) {
      {
        nativeLog("Send Message", JSON.stringify(msg));
      }
      NativeScriptCap.notify({ value: JSON.stringify(msg) });
    }
    receiveMessage(msg) {
      {
        nativeLog("Received Message:", JSON.stringify(msg));
      }
      if (msg.tracking === -1) {
        switch (msg.cmd) {
          case NS_MARSHALL_PLATFORM:
            nativeLog("Setting Platform to", msg.platform === true ? "Android" : msg.platform === false ? "ios" : "unknown");
            if (msg.platform) {
              window.native.__func.__android = true;
            } else {
              window.native.__func.__ios = true;
            }
            break;
          case NS_MARSHALL_CALLBACK:
            if (!this._callbacks[msg.id]) {
              nativeLog("Missing Callback", msg.id);
              return;
            }
            this._callbacks[msg.id].apply(null, msg.args);
            break;
          default:
            nativeLog("Unknown Receive message", msg.cmd);
        }
        return;
      }
      if (typeof msg.tracking === "undefined") {
        throw new Error("RM: undefined TID, " + JSON.stringify(msg));
      }
      const callbacks = this._tracking[msg.tracking];
      if (!callbacks) {
        throw new Error("RM: Missing TID, " + JSON.stringify(msg));
      }
      delete this._tracking[msg.tracking];
      if (msg.error) {
        if (callbacks.reject) {
          callbacks.reject(msg.error);
        }
      } else {
        if (callbacks.resolve) {
          if (callbacks.return) {
            if (callbacks.func) {
              callbacks.func[NS_PROXY_HAS_WAITING_VALUE] = typeof msg.result !== "undefined";
              if (typeof msg.result !== "undefined") {
                callbacks.func[NS_PROXY_VALUE] = msg.result;
              }
            }
            callbacks.resolve(callbacks.return);
          } else {
            callbacks.resolve(msg.result);
          }
        } else if (callbacks.func) {
          callbacks.func[NS_PROXY_HAS_WAITING_VALUE] = typeof msg.result !== "undefined";
          if (typeof msg.result !== "undefined") {
            callbacks.func[NS_PROXY_VALUE] = msg.result;
          }
        } else {
          nativeLog("Unknown how to handle the Received results...");
        }
      }
      if (callbacks.func[NS_PROXY_IS_FUNCTION]) {
        if (callbacks.func[NS_FUNCTION_PENDING] > 0) {
          while (callbacks.func[NS_FUNCTION_PENDING_LIST].length) {
            callbacks.func[NS_FUNCTION_PENDING]--;
            const func = callbacks.func[NS_FUNCTION_PENDING_LIST].pop();
            func();
          }
        }
      }
    }
    marshallString(value, returnObject) {
      {
        nativeLog("Marshall String:", value);
      }
      return new Promise((resolve, reject) => {
        let nextObject, wantsResults, func;
        let TID = ++this._trackingId;
        if (returnObject) {
          nextObject = this.getProxy(null, "NATIVE", sub_handler);
          func = nextObject.__func;
          TID = "T" + TID;
          this._tracking[TID] = {
            resolve,
            reject,
            func,
            return: nextObject
          };
          wantsResults = true;
        } else {
          TID = "R" + TID;
          this._tracking[TID] = { resolve, reject };
          wantsResults = false;
        }
        this.sendMessage({
          cmd: NS_MARSHALL_STRING,
          results: wantsResults,
          tracking: TID,
          value,
          parentObject: 0,
          nextObjID: func ? func[NS_PROXY_ID] : 0
        });
      });
    }
    isPromise(p2) {
      return p2 && Object.prototype.toString.call(p2) === "[object Promise]";
    }
    fixArgs(value) {
      return new Promise(async (resolve) => {
        if (value == null) {
          return resolve(null);
        }
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            value[i] = await this.fixArgs(value[i]);
          }
        } else if (typeof value.then === "function") {
          value = await Promise.resolve(value);
        } else if (typeof value === "function") {
          const idx = ++this._callbackId;
          const callId = "__NS_CALLBACK__" + idx;
          this._callbacks[idx] = value;
          value = callId;
        } else if (typeof value === "number" || typeof value === "string") {
          resolve(value);
          return;
        } else {
          const keys = Object.keys(value);
          if (!keys.length) {
            resolve(value.toString());
            return;
          }
          for (let i = 0; i < keys.length; i++) {
            value[keys[i]] = await this.fixArgs(value[keys[i]]);
          }
        }
        resolve(value);
      });
    }
    marshall(type, func, prop, value = null) {
      {
        nativeLog("MARSHALL:", type, prop ? prop : "", value ? value : "");
      }
      return new Promise(async (resolve, reject) => {
        const TID = "R" + ++this._trackingId;
        this._tracking[TID] = { resolve, reject, func };
        let newFunc = func;
        let results = prop;
        while (newFunc[NS_PROXY_PARENT] != null && !newFunc[NS_PROXY_PARENT][NS_PROXY_IS_FUNCTION]) {
          newFunc = newFunc[NS_PROXY_PARENT];
          results = newFunc[NS_PROXY_PROP] + "." + results;
        }
        newFunc = newFunc[NS_PROXY_PARENT];
        const parent = newFunc[NS_PROXY_ID];
        const idx = results.lastIndexOf(".");
        let thisArg;
        if (idx) {
          thisArg = results.substr(0, idx);
        } else {
          thisArg = "global";
        }
        {
          nativeLog("R:", results, parent, thisArg);
        }
        if (value != null) {
          value = await this.fixArgs(value);
        }
        this.sendMessage({
          cmd: type,
          tracking: TID,
          value: results,
          thisArg,
          parentObject: parent,
          nextObjID: func[NS_PROXY_ID],
          extra: value
        });
      });
    }
    getNextId() {
      return this._id++;
    }
    getProxy(parent, prop, proxyClass) {
      if (parent && prop && parent[NS_PROXY_CHILDREN][prop]) {
        return parent[NS_PROXY_CHILDREN][prop][NS_PROXY];
      }
      const func = function() {
      };
      func[NS_PROXY_ID] = this.getNextId();
      func[NS_PROXY_PROP] = prop;
      func[NS_PROXY_CHILDREN] = {};
      func[NS_PROXY_IS_FUNCTION] = parent == null;
      func[NS_PROXY_HAS_WAITING_VALUE] = false;
      if (parent) {
        func[NS_PROXY_PARENT] = parent;
        func[NS_PROXY_FULL_PROP] = parent[NS_PROXY_FULL_PROP] + "." + prop;
        parent[NS_PROXY_CHILDREN][prop] = func;
      } else {
        func[NS_PROXY_FULL_PROP] = prop;
      }
      const newProxy = new Proxy(func, proxyClass);
      func[NS_PROXY] = newProxy;
      return newProxy;
    }
    _getter(target, prop, _receiver) {
      {
        if (typeof prop !== "symbol" && prop !== "__func" && prop !== "__isProxy" && prop !== "then") {
          nativeLog("Getter:", target[NS_PROXY_FULL_PROP] + "." + prop);
        }
      }
      switch (prop) {
        case "then":
          return void 0;
        case "symbol":
          return null;
        case "toString":
          return function() {
            return "[NativeScript Proxy Object]";
          };
        case "__isProxy":
          return true;
        case "__func":
          return target;
        case "set":
          return (value) => {
            return NativeScriptProxy.instance.marshall(NS_MARSHALL_SET, target, target[NS_PROXY_PROP], value);
          };
        case "get":
          nativeLog("Getting Value", target[NS_PROXY_IS_FUNCTION] ? "Function" : "", target[NS_PROXY_HAS_WAITING_VALUE] ? "Waiting" : "");
          if (target[NS_PROXY_IS_FUNCTION] || target[NS_PROXY_HAS_WAITING_VALUE]) {
            if (typeof target[NS_PROXY_VALUE] !== "undefined") {
              const t = Promise.resolve(target[NS_PROXY_VALUE]);
              target[NS_PROXY_VALUE] = void 0;
              target[NS_PROXY_HAS_WAITING_VALUE] = false;
              return t;
            }
            if (target[NS_FUNCTION_PENDING]) {
              return new Promise((resolve) => {
                target[NS_FUNCTION_PENDING_LIST].push(resolve);
              }).then(() => {
                if (target[NS_PROXY_HAS_WAITING_VALUE]) {
                  if (typeof target[NS_PROXY_VALUE] !== "undefined") {
                    const t = Promise.resolve(target[NS_PROXY_VALUE]);
                    target[NS_PROXY_VALUE] = void 0;
                    target[NS_PROXY_HAS_WAITING_VALUE] = false;
                    return t;
                  }
                }
                return NativeScriptProxy.instance.marshall(NS_MARSHALL_GET, target, target[NS_PROXY_PROP]);
              });
            }
          }
          return NativeScriptProxy.instance.marshall(NS_MARSHALL_GET, target, target[NS_PROXY_PROP]);
        default:
          return NativeScriptProxy.instance.getProxy(target, prop, sub_handler);
      }
    }
    _setter(target, prop, value, _receiver) {
      {
        nativeLog("Setter:", target[NS_PROXY_FULL_PROP] + "." + prop, "=", value);
      }
      let newTarget;
      if (target[NS_PROXY_CHILDREN][prop]) {
        newTarget = target[NS_PROXY_CHILDREN][prop];
      } else {
        const tempProxy = NativeScriptProxy.instance.getProxy(target, prop, sub_handler);
        newTarget = tempProxy.__func;
      }
      return NativeScriptProxy.instance.marshall(NS_MARSHALL_SET, newTarget, prop, value);
    }
  }
  window.nativeLog = function(...args) {
    NativeScriptCap.notify({
      value: JSON.stringify({ cmd: NS_MARSHALL_CONSOLE, log: args })
    });
  };
  window.native = new NativeScriptProxy();
}
const native = window.native;
const nativeLog = window.nativeLog;
native.openNativeModalView();
window.customElements.define(
  "capacitor-welcome",
  class extends HTMLElement {
    constructor() {
      super();
      SplashScreen.hide();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>Capacitor</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
          with a single code base.
        </p>
        <h2>Getting Started</h2>
        <p>
          You'll probably need a UI framework to build a full-featured app. Might we recommend
          <a target="_blank" href="http://ionicframework.com/">Ionic</a>?
        </p>
        <p>
          Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for information
          on using native features, building plugins, and more.
        </p>
        <a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
        <h2>Tiny Demo</h2>
        <p>
          This demo shows how to call Capacitor plugins. Say cheese!
        </p>
        <p>
          <button class="button" id="take-photo">Take Photo</button>
        </p>
        <p>
          <img id="image" style="max-width: 100%">
        </p>
      </main>
    </div>
    `;
    }
    connectedCallback() {
      const self2 = this;
      self2.shadowRoot.querySelector("#take-photo").addEventListener("click", async function(e) {
        try {
          const photo = await Camera.getPhoto({
            resultType: "uri"
          });
          const image = self2.shadowRoot.querySelector("#image");
          if (!image) {
            return;
          }
          image.src = photo.webPath;
        } catch (e2) {
          console.warn("User cancelled", e2);
        }
      });
    }
  }
);
window.customElements.define(
  "capacitor-welcome-titlebar",
  class extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: "open" });
      root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
    }
  }
);
export { CameraSource as C, WebPlugin as W, CameraDirection as a, CapacitorException as b };
