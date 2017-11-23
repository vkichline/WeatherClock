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


class TimeDetails extends React.Component {
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

    formatTime(date, asUtc) {
        let hours = asUtc ? date.getUTCHours() : date.getHours();
        let minutes = asUtc ? date.getUTCMinutes() : date.getMinutes();
        let seconds = asUtc ? date.getUTCSeconds() : date.getSeconds();
        let ispm = hours > 11;
        hours = ispm ? hours - 12 : hours;
        if (hours == 0) hours = 12;
        return hours.toString() + ":" +
            (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" +
            (seconds < 10 ? "0" + seconds : seconds.toString()) + " " +
            (ispm ? "PM" : "AM");
    }

    formatSiderialTime(st) {
        let minute = (st % 1) * 60;
        let hour = Math.trunc(st);
        let second = (minute % 1) * 60;
        minute = Math.trunc(minute);
        second = Math.trunc(second);
        return (hour.toString() + ":" +
            (minute < 10 ? "0" + minute : minute.toString()) + ":" +
                (second < 10 ? "0" + second : second.toString()));
    }

    // From https://www.iiap.res.in/personnel/reks/software/javascript/calclst.php
    calcLST(date) {
        let tzone = -1.0 * date.getTimezoneOffset() / 60.0;
        let lsign = -1;
        let lst = 0.0;
        let olong = Math.abs(tzone * 15.0);
        if (olong > 180) olong = olong - 180;
        olong = Math.abs(olong);
        let hr = date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let year = date.getFullYear();
        let ut = this.modDay(hr - tzone);
        let dno = this.getDayno2K(year, month, day, hr);
        let ws = this.mod2pi(282.9404 + 4.70935 * Math.pow(10.0, -5) * dno);
        let ms = this.mod2pi(356.0470 + 0.9856002585 * dno);
        let meanlong = this.mod2pi(ms + ws);
        let gmst0 = (meanlong) / 15.0;
        lst = this.modDay(gmst0 + ut + lsign * olong / 15.0) + 11.0 + 56.0 / 60.0;
        if (lst >= 24.0) lst = lst - 24.0;
        return lst;
    }
    getDayno2K(yy, mm, dd, hr) {
        let jd = this.julianDay(yy, mm, dd, hr);
        return parseFloat(jd) - 2451543.5;
    }
    modDay(val) {
        let b = val / 24.0;
        let a = 24.0 * (b - this.absFloor(b));
        if (a < 0) a = a + 24.0;
        return a;
    }
    absFloor(val) {
        if (val >= 0.0) return Math.floor(val);
        else return Math.ceil(val);
    }
    mod2pi(angle) {
        let b = angle / 360.0;
        let a = 360.0 * (b - this.absFloor(b));
        if (a < 0) a = 360.0 + a;
        return a;
    }
    getDaysinMonth(mm, yy) {
        mm = parseFloat(mm);
        yy = parseFloat(yy);
        let ndays = 31;
        if ((mm == 4) || (mm == 6) || (mm == 9) || (mm == 11)) ndays = 30;
        if (mm == 2) {
            ndays = 28;
            if ((yy % 4) == 0) ndays = 29;
            if ((yy % 100) == 0) ndays = 28;
            if ((yy % 400) == 0) ndays = 29;
        }
        return ndays;
    }
    julianDay(yy, mm, dd, hh) {
        mm = parseFloat(mm);
        yy = parseFloat(yy);
        dd = parseFloat(dd);
        hh = parseFloat(hh);
        let extra = (100.0 * yy + mm) - 190002.5;
        let jday = 367.0 * yy;
        jday -= Math.floor(7.0 * (yy + Math.floor((mm + 9.0) / 12.0)) / 4.0);
        jday += Math.floor(275.0 * mm / 9.0);
        jday += dd;
        jday += hh / 24.0;
        jday += 1721013.5;
        jday -= 0.5 * extra / Math.abs(extra);
        jday += 0.5;
        return jday;
    }

    // From http://indigotide.com/software/siderealsource.html
    getGMST(now) {
        let year = now.getUTCFullYear();	// get UTC from computer clock date & time (var now)
        let month = now.getUTCMonth() + 1;
        let day = now.getUTCDate();
        let hour = now.getUTCHours();
        let minute = now.getUTCMinutes();
        let second = now.getUTCSeconds();

        if (month == 1 || month == 2) {
            year = year - 1;
            month = month + 12;
        }

        let lc = Math.floor(year / 100);	//integer # days / leap century
        let ly = 2 - lc + Math.floor(lc / 4);	//integer # days / leap year
        let y = Math.floor(365.25 * year);	//integer # days / year
        let m = Math.floor(30.6001 * (month + 1));	//integer # days / month

        // now get julian days since J2000.0
        let jd = ly + y + m - 730550.5 + day + (hour + minute / 60.0 + second / 3600.0) / 24.0;

        // julian centuries since J2000.0
        let jc = jd / 36525.0;

        // Greenwich Mean Sidereal Time (GMST) in degrees
        let GMST = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jc * jc - jc * jc * jc / 38710000;

        if (GMST > 0.0)	// circle goes round and round, adjust if < 0 or > 360 degrees
        {
            while (GMST > 360.0)
                GMST -= 360.0;
        }
        else {
            while (GMST < 0.0)
                GMST += 360.0;
        }
        return GMST;	// in degrees
    }

    // From https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    getDayOfYear(date) {
        let start = new Date(date.getFullYear(), 0, 0);
        let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
        let oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    getSecondOfYear(date) {
        let start = new Date(date.getFullYear(), 0, 0);
        let diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60);
        return Math.floor(diff / 1000);
   }

    render() {
        let date = this.state.time;
        let hour = 0.0 + date.getHours() + (date.getMinutes() / 60.0) + (date.getSeconds() / 3600.0);
        let jday = this.julianDay(date.getFullYear(), date.getMonth(), date.getDate(), hour);
        let st = this.calcLST(date);
        return (
            <div className="time-details">
                <div><span className="title">UTC:</span><span className="value">{this.formatTime(date, true)}</span></div>
                <div><span className="title">Sidereal Time:</span><span className="value">{this.formatSiderialTime(st)}</span></div>
                <div><span className="title">Julian Day:</span><span className="value">{jday.toFixed(4).toLocaleString('en')}</span></div>
                <div><span className="title">GMST:</span><span className="value">{this.getGMST(date).toFixed(4) + "°"}</span></div>
                <div><span className="title">Second:</span><span className="value">{this.getSecondOfYear(date).toLocaleString('en')}</span></div>
                <div><span className="title">Day of Year:</span><span className="value">{this.getDayOfYear(date)}</span></div>
                <div><span className="title">Time Zone:</span><span className="value">{date.getTimezoneOffset() / 60}</span></div>
                <div><span className="title"></span><span className="value"></span></div>
            </div>
        );
    }
}


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
                <div><span className="title">Conditions:</span><span className="value">{channel.item.condition.text}</span></div>
                <div><span className="title">Wind Chill:</span><span className="value">{channel.wind.chill + "°"} {channel.units.temperature}</span></div>
                <div><span className="title">Speed:</span><span className="value">{channel.wind.speed} {channel.units.speed}</span></div>
                <div><span className="title">Direction:</span><span className="value">{channel.wind.direction + "°"}</span></div>
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
                <div className="column1">
                    <TimeDetails />
                </div>
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