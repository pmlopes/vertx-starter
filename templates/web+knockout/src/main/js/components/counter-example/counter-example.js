import * as ko from 'knockout';

class CounterExampleViewModel {
  constructor() {
    this.currentCount = ko.observable(0);
  }

  incrementCounter() {
    let prevCount = this.currentCount();
    this.currentCount(prevCount + 1);
  }
}

export default {viewModel: CounterExampleViewModel, template: require('./counter-example.html')};
