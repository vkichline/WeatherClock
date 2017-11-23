"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ClockFace = (function (_React$Component) {
    _inherits(ClockFace, _React$Component);

    function ClockFace(props) {
        _classCallCheck(this, ClockFace);

        _get(Object.getPrototypeOf(ClockFace.prototype), "constructor", this).call(this, props);
        this.state = { time: new Date() };
    }

    _createClass(ClockFace, [{
        key: "tick",
        value: function tick() {
            this.setState(function (prevState) {
                return {
                    time: new Date()
                };
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var _this = this;

            this.interval = setInterval(function () {
                return _this.tick();
            }, 1000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }, {
        key: "render",
        value: function render() {
            var time = this.state.time;
            var hours = time.getHours();
            var minutes = time.getMinutes();
            var seconds = time.getSeconds();
            var ispm = hours > 11;
            hours = hours > 12 ? hours - 12 : hours;
            hours = hours == 0 ? 12 : hours;
            var strHours = hours.toString();
            var strMinutes = (minutes < 10 ? "0" : "") + minutes.toString();
            var strSeconds = ":" + (seconds < 10 ? "0" : "") + seconds.toString();
            var strDay = this.props.days[time.getDay()];
            var strMonth = this.props.months[time.getMonth()];
            var strDate = strDay + " " + strMonth + " " + time.getDate() + ", " + time.getFullYear();
            return React.createElement(
                "div",
                { className: "clock-face-container" },
                React.createElement(
                    "table",
                    { className: "clock-face" },
                    React.createElement(
                        "tbody",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "td",
                                { rowSpan: "2", className: "time" },
                                strHours + ":" + strMinutes
                            ),
                            React.createElement(
                                "td",
                                { className: "seconds" },
                                strSeconds
                            )
                        ),
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "td",
                                { className: "ampm" },
                                ispm ? "pm" : "am"
                            )
                        ),
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "td",
                                { colSpan: "2", className: "date" },
                                strDate
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ClockFace;
})(React.Component);

ClockFace.defaultProps = {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    month_abbrev: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};

var WeatherForecast = (function (_React$Component2) {
    _inherits(WeatherForecast, _React$Component2);

    function WeatherForecast() {
        _classCallCheck(this, WeatherForecast);

        _get(Object.getPrototypeOf(WeatherForecast.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(WeatherForecast, [{
        key: "getIconClass",
        value: function getIconClass(weatherCode) {
            // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
            weatherCode = parseInt(weatherCode);
            switch (weatherCode) {
                case 25: // cold
                case 32: // sunny
                case 33: // fair (night)
                case 34: // fair (day)
                case 36: // hot
                case 3200:
                    // not available
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
                case 40:
                    // scattered showers
                    return 'rain';
                case 3: // severe thunderstorms
                case 4: // thunderstorms
                case 37: // isolated thunderstorms
                case 38: // scattered thunderstorms
                case 45: // thundershowers
                case 47:
                    // isolated thundershowers
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
                case 46:
                    // snow showers
                    return 'snow';
                case 15: // blowing snow
                case 19: // dust
                case 20: // foggy
                case 21: // haze
                case 22:
                    // smoky
                    return 'fog';
                case 24: // windy
                case 23:
                    // blustery
                    return 'windy';
                case 26: // cloudy
                case 27: // mostly cloudy (night)
                case 28: // mostly cloudy (day)
                case 31:
                    // clear (night)
                    return 'cloudy';
                case 29: // partly cloudy (night)
                case 30: // partly cloudy (day)
                case 44:
                    // partly cloudy
                    return 'partly-cloudy-day';
            }
        }
    }, {
        key: "render",
        value: function render() {
            var iconClass = "icon-image";
            var channel = this.props.channel;
            if (channel.hasOwnProperty('item') && channel.item.condition.code != "") {
                iconClass = " icon-image " + this.getIconClass(channel.item.condition.code);
            }
            return React.createElement(
                "div",
                { className: "weather-forecast-container" },
                React.createElement(
                    "div",
                    { className: "weather-forecast" },
                    React.createElement(
                        "div",
                        { className: "temperature" },
                        channel.hasOwnProperty('item') ? channel.item.condition.temp + "°" : '?'
                    ),
                    React.createElement(
                        "div",
                        { className: "icon" },
                        React.createElement("img", { className: iconClass, src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=" })
                    )
                )
            );
        }
    }]);

    return WeatherForecast;
})(React.Component);

;

var WeatherDetails = (function (_React$Component3) {
    _inherits(WeatherDetails, _React$Component3);

    function WeatherDetails() {
        _classCallCheck(this, WeatherDetails);

        _get(Object.getPrototypeOf(WeatherDetails.prototype), "constructor", this).apply(this, arguments);
    }

    _createClass(WeatherDetails, [{
        key: "render",
        value: function render() {
            var channel = this.props.channel;
            if (!channel.hasOwnProperty('item')) {
                return React.createElement("div", { className: "weather-details" });
            }
            return React.createElement(
                "div",
                { className: "weather-details" },
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Location:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.location.city
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Wind Chill:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.wind.chill + "°",
                        " ",
                        channel.units.temperature
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Direction:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.wind.direction + "°"
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Speed:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.wind.speed,
                        " ",
                        channel.units.speed
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Humidity:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.atmosphere.humidity + "%"
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Pressure:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.atmosphere.pressure
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Visibility:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.atmosphere.visibility,
                        " ",
                        channel.units.distance
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Sunrise:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.astronomy.sunrise
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Sunset:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.astronomy.sunset
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Latitude:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.item.lat
                    )
                ),
                React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "span",
                        { className: "title" },
                        "Longitude:"
                    ),
                    React.createElement(
                        "span",
                        { className: "value" },
                        channel.item.long
                    )
                )
            );
        }
    }]);

    return WeatherDetails;
})(React.Component);

var WeatherClock = (function (_React$Component4) {
    _inherits(WeatherClock, _React$Component4);

    function WeatherClock(props) {
        _classCallCheck(this, WeatherClock);

        _get(Object.getPrototypeOf(WeatherClock.prototype), "constructor", this).call(this, props);
        this.state = { channel: {} };
    }

    _createClass(WeatherClock, [{
        key: "getForecast",
        value: function getForecast(cb) {
            var statement = 'select * from weather.forecast where woeid=' + this.props.cities[6].key;
            var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;

            // Fetch the latest data.
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        var response = JSON.parse(request.response);
                        var results = response.query.results;
                        cb(results);
                    }
                } else {
                    // Return the initial weather forecast since no data is available.
                }
            };
            request.open('GET', url);
            request.send();
        }
    }, {
        key: "refresh",
        value: function refresh() {
            var that = this;
            this.getForecast(function (results) {
                that.setState({ channel: results.channel });
            });
        }
    }, {
        key: "componentDidMount",
        value: function componentDidMount() {
            var that = this;
            this.refresh();
            this.interval = setInterval(function () {
                return that.refresh();
            }, 3600000);
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearInterval(this.interval);
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "app-container" },
                React.createElement("div", { className: "column1" }),
                React.createElement(
                    "div",
                    { className: "column2" },
                    React.createElement(ClockFace, null),
                    React.createElement(WeatherForecast, { channel: this.state.channel })
                ),
                React.createElement(
                    "div",
                    { className: "column3" },
                    React.createElement(WeatherDetails, { channel: this.state.channel })
                )
            );
        }
    }]);

    return WeatherClock;
})(React.Component);

;
WeatherClock.defaultProps = {
    cities: [{ key: 2357536, label: "Austin, TX" }, { key: 2379574, label: "Chicago, IL" }, { key: 2459115, label: "New York, NY" }, { key: 2475687, label: "Portland, OR" }, { key: 2487956, label: "San Francisco, CA" }, { key: 2490383, label: "Seattle, WA" }, { key: 2433074, label: "Kirkland, WA" }]
};

$(document).ready(function () {
    ReactDOM.render(React.createElement(WeatherClock, null), document.getElementById('mount'));
});

