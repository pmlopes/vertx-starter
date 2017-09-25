import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class FetchDataComponent extends Vue {
  forecasts = [];

  mounted() {
    fetch('api/weather-forecasts')
      .then(response => response.json())
      .then(data => {
        this.forecasts = data;
      });
  }
}
