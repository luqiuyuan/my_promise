class MyPromise {

  constructor(func) {
    this.status = 'pending';

    func && func(this._callResolve.bind(this), this._callReject.bind(this));
  }

  resolve(value) {
    this.status = 'resolved';
    this.value = value;

    let result = this._callCallback();

    if (this._isInstanceOfMyPromise(result)) {
      this.returned_promise &&this.returned_promise._merge(result);
    } else {
      this.returned_promise && this.returned_promise._setFunc((resolve, reject) => {
        resolve(result);
      });
    }
  }

  reject(value) {
    this.status = 'rejected';
    this.value = value;

    let result = this._callCallback();

    if (this._isInstanceOfMyPromise(result)) {
      this.returned_promise &&this.returned_promise._merge(result);
    } else {
      this.returned_promise && this.returned_promise._setFunc((resolve, reject) => {
        resolve(result);
      });
    }
  }

  then(resolve_callback, reject_callback) {
    this.resolve_callback = resolve_callback;
    this.reject_callback = reject_callback;
    this.returned_promise = new MyPromise();

    let result = this._callCallback();

    if (this._isInstanceOfMyPromise(result)) {
      this.returned_promise._merge(result);
    } else {
      this.status !== 'pending' && this.returned_promise._setFunc((resolve, reject) => {
        resolve(result);
      });
    }

    return this.returned_promise;
  }

  _callResolve(value) {
    this.resolve(value);
  }
  
  _callReject(value) {
    this.reject(value);
  }

  _setFunc(func) {
    func && func(this.resolve.bind(this), this.reject.bind(this));
  }

  _callCallback() {
    let result;

    if (this.status === 'resolved') {
      if (this.resolve_callback && !this.resolve_callback_called) {
        result = this.resolve_callback(this.value);

        this.resolve_callback_called = true;
      }
    } else if (this.status === 'rejected') {
      if (this.reject_callback && !this.reject_callback_called) {
        result = this.reject_callback(this.value);

        this.reject_callback_called = true;
      }
    }

    return result;
  }

  _merge(target) {
    if (target.status === 'resolved') {
      this.resolve(target.value);
    } else if (target.status === 'rejected') {
      this.reject(target.value);
    } else {
      target.resolve = this.resolve.bind(this);
      target.reject = this.reject.bind(this);
    }
  }

  _isInstanceOfMyPromise(obj) {
    if (obj && obj.__proto__ === MyPromise.prototype)
      return true;
    else
      return false;
  }

}

new MyPromise((resolve, reject) => {
  // resolve("resolve 0");
  // reject("reject 0");
  setTimeout(() => {
    // resolve("resolve 0");
    reject("reject 0");
  }, 500);
})
.then((value) => {
  console.log("resolve callback 1: " + value);
  return "resolve 1";
  // return new MyPromise((resolve, reject) => {
    // resolve("resolve 1");
    // reject("reject 1");
    // setTimeout(() => {
      // resolve("resolve 1");
      // reject("reject 1");
    // }, 500);
  // });
}, (value) => {
  console.log("reject callback 1: " + value);
  return "resolve 1";
  // return new MyPromise((resolve, reject) => {
    // resolve("resolve 1");
    // reject("reject 1");
    // setTimeout(() => {
      // resolve("resolve 1");
      // reject("reject 1");
    // }, 500);
  // });
})
.then((value) => {
  console.log("resolve callback 2: " + value);
  return "resolve 2";
  // return new MyPromise((resolve, reject) => {
    // resolve("resolve 1");
    // reject("reject 1");
    // setTimeout(() => {
      // resolve("resolve 1");
      // reject("reject 1");
    // }, 500);
  // });
}, (value) => {
  console.log("reject callback 2: " + value);
  return "resolve 2";
  // return new MyPromise((resolve, reject) => {
    // resolve("resolve 1");
    // reject("reject 1");
    // setTimeout(() => {
      // resolve("resolve 1");
      // reject("reject 1");
    // }, 500);
  // });
})
.then((value) => {
  console.log("resolve callback 3: " + value);
}, (value) => {
  console.log("reject callback 3: " + value);
});

