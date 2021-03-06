import {customElement, inject, bindable} from 'aurelia-framework';

@customElement('test-frame')
@inject(Element)
@bindable('test')
export class TestFrame {
  constructor(element) {
      this._element = element;
  }

  testLoaded() {

  }

  testStarted() {
      this.test.start();
  }

  testEnded() {
      this.test.end();
      this.path = "";
  }

  dispatch(event) {
      if(event.data === "test-start") {
          this.testStarted();
      }
      else if(event.data === "test-end") {
          this.testEnded();
      }
  }

  testChanged(newTest) {
      if(newTest) {
          this.test = newTest;
          this.path = newTest.path;
          if(!this._iframe) {
              this._iframe = this._element.querySelector("iframe");
              this._iframe.addEventListener("load", () => this.testLoaded());
              window.addEventListener("message", (e) => this.dispatch(e));
          }
      }
  }
}
