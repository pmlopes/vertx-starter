import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as WeatherForecastsState from '../store/WeatherForecasts';

class FetchData extends React.Component {
    componentWillMount() {
        // This method runs when the component is first added to the page
        let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
        this.props.requestWeatherForecasts(startDateIndex);
    }

    componentWillReceiveProps(nextProps) {
        // This method runs when incoming props (e.g., route params) change
        let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        this.props.requestWeatherForecasts(startDateIndex);
    }

    render() {
        return <div>
            <h1>Weather forecast</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            { this.renderForecastsTable() }
            { this.renderPagination() }
        </div>;
    }

    renderForecastsTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
            {this.props.forecasts.map(forecast =>
                <tr key={ forecast.dateFormatted }>
                    <td>{ forecast.dateFormatted }</td>
                    <td>{ forecast.temperatureC }</td>
                    <td>{ forecast.temperatureF }</td>
                    <td>{ forecast.summary }</td>
                </tr>
            )}
            </tbody>
        </table>;
    }

    renderPagination() {
        let prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
        let nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

        return <p className='clearfix text-center'>
            <Link className='btn btn-default pull-left' to={ `/fetchdata/${ prevStartDateIndex }` }>Previous</Link>
            <Link className='btn btn-default pull-right' to={ `/fetchdata/${ nextStartDateIndex }` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

export default connect(
    (state) => state.weatherForecasts, // Selects which state properties are merged into the component's props
    WeatherForecastsState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchData);
