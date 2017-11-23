class ClockFace extends React.Component {
    constructor(props) {
        super(props);
        this.state = { time: new Date() };
    }

    tick() {
        this.setState(prevState => ({
            time: new Date()
        }));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        let time = this.state.time;
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let ispm = hours > 11;
        hours = hours > 12 ? hours - 12 : hours;
        hours = hours == 0 ? 12 : hours;
        let strHours = hours.toString();
        let strMinutes = (minutes < 10 ? "0" : "") + minutes.toString();
        let strSeconds = ":" + (seconds < 10 ? "0" : "") + seconds.toString();
        let strDay = this.props.days[time.getDay()];
        let strMonth = this.props.months[time.getMonth()];
        let strDate = strDay + " " + strMonth + " " + time.getDate() + ", " + time.getFullYear();
        return (
            <div className="clock-face-container">
                <table className="clock-face">
                    <tbody>
                        <tr>
                            <td rowSpan="2" className="time">{strHours + ":" + strMinutes}</td>
                            <td className="seconds">{strSeconds}</td>
                        </tr>
                        <tr>
                            <td className="ampm">{ispm ? "pm" : "am"}</td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="date">{strDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

ClockFace.defaultProps = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    month_abbrev: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};


class WeatherForecast extends React.Component {
    getIconClass(weatherCode) {
        // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
        weatherCode = parseInt(weatherCode);
        switch (weatherCode) {
            case 25: // cold
            case 32: // sunny
            case 33: // fair (night)
            case 34: // fair (day)
            case 36: // hot
            case 3200: // not available
                return 'clear-day';
            case 0: // tornado
            case 1: // tropical storm
            case 2: // hurricane
            case 6: // mixed rain and sleet
            case 8: // freezing drizzle
            case 9: // drizzle
            case 10: // freezing rain
            case 11: // showers
            case 12: // showers
            case 17: // hail
            case 35: // mixed rain and hail
            case 39: // scattered showers
            case 40: // scattered showers
                return 'rain';
            case 3: // severe thunderstorms
            case 4: // thunderstorms
            case 37: // isolated thunderstorms
            case 38: // scattered thunderstorms
            case 45: // thundershowers
            case 47: // isolated thundershowers
                return 'thunderstorms';
            case 5: // mixed rain and snow
            case 7: // mixed snow and sleet
            case 13: // snow flurries
            case 14: // light snow showers
            case 16: // snow
            case 18: // sleet
            case 41: // heavy snow
            case 42: // scattered snow showers
            case 43: // heavy snow
            case 46: // snow showers
                return 'snow';
            case 15: // blowing snow
            case 19: // dust
            case 20: // foggy
            case 21: // haze
            case 22: // smoky
                return 'fog';
            case 24: // windy
            case 23: // blustery
                return 'windy';
            case 26: // cloudy
            case 27: // mostly cloudy (night)
            case 28: // mostly cloudy (day)
            case 31: // clear (night)
                return 'cloudy';
            case 29: // partly cloudy (night)
            case 30: // partly cloudy (day)
            case 44: // partly cloudy
                return 'partly-cloudy-day';
        }
    }

    render() {
        let iconClass = "icon-image";
        let channel = this.props.channel;
        if (channel.hasOwnProperty('item') && channel.item.condition.code != "") {
            iconClass = " icon-image " + this.getIconClass(channel.item.condition.code);
        }
        return (
            <div className="weather-forecast-container">
                <div className="weather-forecast">
                    <div className="temperature">
                        {channel.hasOwnProperty('item') ?
                            channel.item.condition.temp + "°" : '?'}
                    </div>
                    <div className="icon">
                        <img className={iconClass} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=" />
                    </div>
                </div>
            </div>
        );
    }
};


class WeatherDetails extends React.Component {
    render() {
        let channel = this.props.channel;
        if (!channel.hasOwnProperty('item')) {
            return <div className="weather-details"></div>;
        }
        return (
            <div className="weather-details">
                <div><span className="title">Location:</span><span className="value">{channel.location.city}</span></div>
                <div><span className="title">Wind Chill:</span><span className="value">{channel.wind.chill + "°"} {channel.units.temperature}</span></div>
                <div><span className="title">Direction:</span><span className="value">{channel.wind.direction + "°"}</span></div>
                <div><span className="title">Speed:</span><span className="value">{channel.wind.speed} {channel.units.speed}</span></div>
                <div><span className="title">Humidity:</span><span className="value">{channel.atmosphere.humidity + "%"}</span></div>
                <div><span className="title">Pressure:</span><span className="value">{channel.atmosphere.pressure}</span></div>
                <div><span className="title">Visibility:</span><span className="value">{channel.atmosphere.visibility} {channel.units.distance}</span></div>
                <div><span className="title">Sunrise:</span><span className="value">{channel.astronomy.sunrise}</span></div>
                <div><span className="title">Sunset:</span><span className="value">{channel.astronomy.sunset}</span></div>
                <div><span className="title">Latitude:</span><span className="value">{channel.item.lat}</span></div>
                <div><span className="title">Longitude:</span><span className="value">{channel.item.long}</span></div>
            </div>
        );
    }
}


class WeatherClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { channel: {} };
    }

    getForecast(cb) {
        let statement = 'select * from weather.forecast where woeid=' + this.props.cities[6].key;
        let url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;

        // Fetch the latest data.
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    let response = JSON.parse(request.response);
                    let results = response.query.results;
                    cb(results);
                }
            } else {
                // Return the initial weather forecast since no data is available.
            }
        };
        request.open('GET', url);
        request.send();
    }

    refresh() {
        let that = this;
        this.getForecast(function (results) {
            that.setState({ channel: results.channel });
        });
    }

    componentDidMount() {
        let that = this;
        this.refresh();
        this.interval = setInterval(() => that.refresh(), 3600000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="app-container">
                <div className="column1" />
                <div className="column2" >
                    <ClockFace />
                    <WeatherForecast channel={this.state.channel} />
                </div>
                <div className="column3">
                    <WeatherDetails channel={this.state.channel} />
                </div>
            </div>
        );
    }
};
WeatherClock.defaultProps = {
    cities: [
        { key: 2357536, label: "Austin, TX" },
        { key: 2379574, label: "Chicago, IL" },
        { key: 2459115, label: "New York, NY" },
        { key: 2475687, label: "Portland, OR" },
        { key: 2487956, label: "San Francisco, CA" },
        { key: 2490383, label: "Seattle, WA" },
        { key: 2433074, label: "Kirkland, WA" }
    ]
};


$(document).ready(function () {
    ReactDOM.render(<WeatherClock />, document.getElementById('mount'));
});