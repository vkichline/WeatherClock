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
    constructor(props) {
        super(props);
        this.state = { channel: {} };
    }

    getForecast(cb) {
        let statement = 'select * from weather.forecast where woeid=' + '2490383';
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
        this.getForecast(function(results) {
            that.setState({ channel: results.channel });
        });
    }

    componentDidMount() {
        let that = this;
        this.interval = setInterval(() => that.refresh(), 3600000);
        this.refresh();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <div className="weather-forecast-container">
                <div className="weather-forecast">
                    <div className="temperature">
                        {this.state.channel.hasOwnProperty('item') ?
                            this.state.channel.item.condition.temp : '?'}
                    </div>
                    <div className="icon">
                        {this.state.channel.hasOwnProperty('item') ?
                            this.state.channel.item.condition.text : '?'}
                    </div>
                </div>
            </div>
        );
    }
};


$(document).ready(function () {
    ReactDOM.render(<div><ClockFace /><WeatherForecast/></div>, document.getElementById('mount'));
});