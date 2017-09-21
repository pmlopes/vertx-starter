import * as ko from 'knockout';
import 'isomorphic-fetch';

class FetchDataViewModel {
  constructor() {
    this.forecasts = ko.observableArray();

    fetch('api/weather-forecasts')
      .then(response => response.json())
      .then(data => {
        this.forecasts(data);
      });
  }
}

export default {viewModel: FetchDataViewModel, template: require('./fetch-data.html')};
