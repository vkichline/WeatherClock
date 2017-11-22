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

    function WeatherForecast(props) {
        _classCallCheck(this, WeatherForecast);

        _get(Object.getPrototypeOf(WeatherForecast.prototype), "constructor", this).call(this, props);
        this.state = { channel: {} };
    }

    _createClass(WeatherForecast, [{
        key: "getForecast",
        value: function getForecast(cb) {
            var statement = 'select * from weather.forecast where woeid=' + '2490383';
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
            this.interval = setInterval(function () {
                return that.refresh();
            }, 3600000);
            this.refresh();
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
                { className: "weather-forecast-container" },
                React.createElement(
                    "div",
                    { className: "weather-forecast" },
                    React.createElement(
                        "div",
                        { className: "temperature" },
                        this.state.channel.hasOwnProperty('item') ? this.state.channel.item.condition.temp : '?'
                    ),
                    React.createElement(
                        "div",
                        { className: "icon" },
                        this.state.channel.hasOwnProperty('item') ? this.state.channel.item.condition.text : '?'
                    )
                )
            );
        }
    }]);

    return WeatherForecast;
})(React.Component);

;

$(document).ready(function () {
    ReactDOM.render(React.createElement(
        "div",
        null,
        React.createElement(ClockFace, null),
        React.createElement(WeatherForecast, null)
    ), document.getElementById('mount'));
});

