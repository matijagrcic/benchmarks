import {HttpClient} from 'aurelia-http-client';
import {MicroTest} from 'performanceTest/microTest'
import {MacroTest} from 'performanceTest/macroTest'
import async from 'async';

export class TestList {

    static inject() { return [HttpClient]; }

    constructor(http) {
        this.http = http;
        this.microTests = [];
        this.macroTests = [];
        this.resultsName = "";

        this.http.configure(x => x.withHeader('Content-Type', 'application/json'));
    }

    activate() {
        return this.http.get('/api/tests')
                   .then(message => {
                       var result = JSON.parse(message.response);
                       this.microTests = result.micro.map(name => new MicroTest(name));
                       this.macroTests = result.macro.map(name => new MacroTest(name));
                   });
    }

    saveResults() {

        let testProjection = test => {
            return { name: test.name, elapsed: test.elapsed };
        };

        let resultData = {
            name: this.resultsName,
            microTests: this.microTests.map(testProjection),
            macroTests: this.macroTests.map(testProjection)
        };

        return this.http.post('/api/results', resultData).then(() => this.resultsName = "");
    }

    loaded() {

    }

    runTests() {
        this.runMicroTests()
            .then(() => this.runMacroTests());
    }

    runSingleMicroTest(test) {

        return new Promise((resolve, reject) => {
            test.run().then( () => resolve() );
        });
    }

    runSingleMacroTest(test) {

        return new Promise((resolve, reject) => {
            this.currentMacroTest = test;
            this.currentMacroTest.run().then( () => {
                this.currentMacroTest = null;
                resolve();
            });
      });
    }

    runMacroTests() {

        return new Promise((resolve, reject) => {

            let execute = (test, callback) => this.runSingleMacroTest(test).then(callback);
            async.eachSeries(this.macroTests, execute, resolve);
        });
    }

    runMicroTests() {
        return new Promise((resolve, reject) => {

            let execute = (test, callback) => {
                    test.run().then(() => callback());
            };

            async.eachSeries(this.microTests, execute, resolve);
        });
    }
}
