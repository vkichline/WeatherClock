////////////////////////////////////////////////////////////////////////////////
//
//  Weather Clock
//
//  A program designed to display a wall clock face on a specific piece of
//  hardware: a Raspberry Pi coupled with a rescued 1600 X 900 laptop screen.
//
//  Van Kichline
//  November 2017
//
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//
//  Utility routines:
//
//  geticonClass is used by a couple components to select the css class to be
//      used to display a specific weather icon.
//
////////////////////////////////////////////////////////////////////////////////

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getIconClass(weatherCode) {
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

////////////////////////////////////////////////////////////////////////////////
//
//  ClockFace class
//  Displays the time, AM/PM, and day/date in center of app
//  Properties: time is a JavaScript Date object.
//
////////////////////////////////////////////////////////////////////////////////

var ClockFace = (function (_React$Component) {
    _inherits(ClockFace, _React$Component);

    function ClockFace(props) {
        _classCallCheck(this, ClockFace);

        _get(Object.getPrototypeOf(ClockFace.prototype), 'constructor', this).call(this, props);
    }

    _createClass(ClockFace, [{
        key: 'render',
        value: function render() {
            var time = this.props.time;
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
                'div',
                { className: 'clock-face-container' },
                React.createElement(
                    'table',
                    { className: 'clock-face' },
                    React.createElement(
                        'tbody',
                        null,
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { rowSpan: '2', className: 'time' },
                                strHours + ":" + strMinutes
                            ),
                            React.createElement(
                                'td',
                                { className: 'seconds' },
                                strSeconds
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { className: 'ampm' },
                                ispm ? "pm" : "am"
                            )
                        ),
                        React.createElement(
                            'tr',
                            null,
                            React.createElement(
                                'td',
                                { colSpan: '2', className: 'date' },
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

////////////////////////////////////////////////////////////////////////////////
//
//  Renders the vertical pane with details about current time.
//  Properties: time is a JavaScript Date object.
//
////////////////////////////////////////////////////////////////////////////////

var TimeDetails = (function (_React$Component2) {
    _inherits(TimeDetails, _React$Component2);

    function TimeDetails(props) {
        _classCallCheck(this, TimeDetails);

        _get(Object.getPrototypeOf(TimeDetails.prototype), 'constructor', this).call(this, props);
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    //  Renders the current temperature and condition icon for local weather.
    //
    ////////////////////////////////////////////////////////////////////////////////

    _createClass(TimeDetails, [{
        key: 'formatTime',
        value: function formatTime(date, asUtc) {
            var hours = asUtc ? date.getUTCHours() : date.getHours();
            var minutes = asUtc ? date.getUTCMinutes() : date.getMinutes();
            var seconds = asUtc ? date.getUTCSeconds() : date.getSeconds();
            var ispm = hours > 11;
            hours = ispm ? hours - 12 : hours;
            if (hours == 0) hours = 12;
            return hours.toString() + ":" + (minutes < 10 ? "0" + minutes : minutes.toString()) + ":" + (seconds < 10 ? "0" + seconds : seconds.toString()) + " " + (ispm ? "PM" : "AM");
        }
    }, {
        key: 'formatSiderialTime',
        value: function formatSiderialTime(st) {
            var minute = st % 1 * 60;
            var hour = Math.trunc(st);
            var second = minute % 1 * 60;
            minute = Math.trunc(minute);
            second = Math.trunc(second);
            return hour.toString() + ":" + (minute < 10 ? "0" + minute : minute.toString()) + ":" + (second < 10 ? "0" + second : second.toString());
        }

        // From https://www.iiap.res.in/personnel/reks/software/javascript/calclst.php
    }, {
        key: 'calcLST',
        value: function calcLST(date) {
            var tzone = -1.0 * date.getTimezoneOffset() / 60.0;
            var lsign = -1;
            var lst = 0.0;
            var olong = Math.abs(tzone * 15.0);
            if (olong > 180) olong = olong - 180;
            olong = Math.abs(olong);
            var hr = date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var ut = this.modDay(hr - tzone);
            var dno = this.getDayno2K(year, month, day, hr);
            var ws = this.mod2pi(282.9404 + 4.70935 * Math.pow(10.0, -5) * dno);
            var ms = this.mod2pi(356.0470 + 0.9856002585 * dno);
            var meanlong = this.mod2pi(ms + ws);
            var gmst0 = meanlong / 15.0;
            lst = this.modDay(gmst0 + ut + lsign * olong / 15.0) + 11.0 + 56.0 / 60.0;
            if (lst >= 24.0) lst = lst - 24.0;
            return lst;
        }
    }, {
        key: 'getDayno2K',
        value: function getDayno2K(yy, mm, dd, hr) {
            var jd = this.julianDay(yy, mm, dd, hr);
            return parseFloat(jd) - 2451543.5;
        }
    }, {
        key: 'modDay',
        value: function modDay(val) {
            var b = val / 24.0;
            var a = 24.0 * (b - this.absFloor(b));
            if (a < 0) a = a + 24.0;
            return a;
        }
    }, {
        key: 'absFloor',
        value: function absFloor(val) {
            if (val >= 0.0) return Math.floor(val);else return Math.ceil(val);
        }
    }, {
        key: 'mod2pi',
        value: function mod2pi(angle) {
            var b = angle / 360.0;
            var a = 360.0 * (b - this.absFloor(b));
            if (a < 0) a = 360.0 + a;
            return a;
        }
    }, {
        key: 'getDaysInMonth',
        value: function getDaysInMonth(mm, yy) {
            mm = parseFloat(mm);
            yy = parseFloat(yy);
            var ndays = 31;
            if (mm == 4 || mm == 6 || mm == 9 || mm == 11) ndays = 30;
            if (mm == 2) {
                ndays = 28;
                if (yy % 4 == 0) ndays = 29;
                if (yy % 100 == 0) ndays = 28;
                if (yy % 400 == 0) ndays = 29;
            }
            return ndays;
        }
    }, {
        key: 'julianDay',
        value: function julianDay(yy, mm, dd, hh) {
            mm = parseFloat(mm);
            yy = parseFloat(yy);
            dd = parseFloat(dd);
            hh = parseFloat(hh);
            var extra = 100.0 * yy + mm - 190002.5;
            var jday = 367.0 * yy;
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
    }, {
        key: 'getGMST',
        value: function getGMST(now) {
            var year = now.getUTCFullYear(); // get UTC from computer clock date & time (var now)
            var month = now.getUTCMonth() + 1;
            var day = now.getUTCDate();
            var hour = now.getUTCHours();
            var minute = now.getUTCMinutes();
            var second = now.getUTCSeconds();

            if (month == 1 || month == 2) {
                year = year - 1;
                month = month + 12;
            }

            var lc = Math.floor(year / 100); //integer # days / leap century
            var ly = 2 - lc + Math.floor(lc / 4); //integer # days / leap year
            var y = Math.floor(365.25 * year); //integer # days / year
            var m = Math.floor(30.6001 * (month + 1)); //integer # days / month

            // now get julian days since J2000.0
            var jd = ly + y + m - 730550.5 + day + (hour + minute / 60.0 + second / 3600.0) / 24.0;

            // julian centuries since J2000.0
            var jc = jd / 36525.0;

            // Greenwich Mean Sidereal Time (GMST) in degrees
            var GMST = 280.46061837 + 360.98564736629 * jd + 0.000387933 * jc * jc - jc * jc * jc / 38710000;

            if (GMST > 0.0) // circle goes round and round, adjust if < 0 or > 360 degrees
                {
                    while (GMST > 360.0) GMST -= 360.0;
                } else {
                while (GMST < 0.0) GMST += 360.0;
            }
            return GMST; // in degrees
        }

        // From https://stackoverflow.com/questions/8619879/javascript-calculate-the-day-of-the-year-1-366
    }, {
        key: 'getDayOfYear',
        value: function getDayOfYear(date) {
            var start = new Date(date.getFullYear(), 0, 0);
            var diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
            var oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        }
    }, {
        key: 'getSecondOfYear',
        value: function getSecondOfYear(date) {
            var start = new Date(date.getFullYear(), 0, 0);
            var diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60;
            return Math.floor(diff / 1000);
        }
    }, {
        key: 'getSecondOfDay',
        value: function getSecondOfDay(date) {
            var start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            var diff = date - start + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60;
            return Math.floor(diff / 1000);
        }
    }, {
        key: 'isLeapYear',
        value: function isLeapYear(date) {
            var year = date.getFullYear();
            return year % 4 == 0 && year % 100 != 0 || year % 400 == 0;
        }
    }, {
        key: 'render',
        value: function render() {
            var date = this.props.time;
            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getDate();
            var hour = 0.0 + date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;
            var jday = this.julianDay(year, month, day, hour);
            var st = this.calcLST(date);
            var doy = this.getDayOfYear(date);
            var soy = this.getSecondOfYear(date);
            var sod = this.getSecondOfDay(date);
            var poy = soy / ((this.isLeapYear(date) ? 355 : 365) * 86400);
            return React.createElement(
                'div',
                { className: 'time-details' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'UTC:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        this.formatTime(date, true)
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Sidereal Time:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        this.formatSiderialTime(st)
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Julian Day:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        jday.toFixed(4).toLocaleString('en')
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'GMST:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        this.getGMST(date).toFixed(4) + "°"
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Sec of Year:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        soy.toLocaleString('en')
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Sec of Day:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        sod.toLocaleString('en')
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        '% of Year:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        (poy * 100.0).toFixed(4) + "%"
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Day of Year:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        doy
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Year:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        year
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Month:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        month
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Day:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        day
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Time Zone:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        date.getTimezoneOffset() / 60
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement('span', { className: 'title' }),
                    React.createElement('span', { className: 'value' })
                )
            );
        }
    }]);

    return TimeDetails;
})(React.Component);

var WeatherStatus = (function (_React$Component3) {
    _inherits(WeatherStatus, _React$Component3);

    function WeatherStatus() {
        _classCallCheck(this, WeatherStatus);

        _get(Object.getPrototypeOf(WeatherStatus.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(WeatherStatus, [{
        key: 'render',
        value: function render() {
            var iconClass = "icon-image";
            var channel = this.props.channel;
            if (channel.hasOwnProperty('item') && channel.item.condition.code != "") {
                iconClass = " icon-image " + getIconClass(channel.item.condition.code);
            }
            return React.createElement(
                'div',
                { className: 'weather-status-container' },
                React.createElement(
                    'div',
                    { className: 'weather-status' },
                    React.createElement(
                        'div',
                        { className: 'temperature' },
                        channel.hasOwnProperty('item') ? channel.item.condition.temp + "°" : '?'
                    ),
                    React.createElement(
                        'div',
                        { className: 'icon' },
                        React.createElement('img', { className: iconClass, src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=' })
                    )
                )
            );
        }
    }]);

    return WeatherStatus;
})(React.Component);

;

////////////////////////////////////////////////////////////////////////////////
//
//  Renders the vertical pane with details from local weather status.
//
////////////////////////////////////////////////////////////////////////////////

var WeatherDetails = (function (_React$Component4) {
    _inherits(WeatherDetails, _React$Component4);

    function WeatherDetails() {
        _classCallCheck(this, WeatherDetails);

        _get(Object.getPrototypeOf(WeatherDetails.prototype), 'constructor', this).apply(this, arguments);
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    //  Renders one day's forecast amoung 7 day outlook.
    //  Displays when, high/low, condition and condition icon.
    //
    ////////////////////////////////////////////////////////////////////////////////

    _createClass(WeatherDetails, [{
        key: 'render',
        value: function render() {
            var channel = this.props.channel;
            if (!channel.hasOwnProperty('item')) {
                return React.createElement('div', { className: 'weather-details' });
            }
            var pressure = channel.atmosphere.pressure * 0.0295301;
            return React.createElement(
                'div',
                { className: 'weather-details' },
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'no-title' },
                        channel.location.city
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'no-title' },
                        channel.item.condition.text
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Wind Chill:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.wind.chill + "°",
                        ' ',
                        channel.units.temperature
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Speed:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.wind.speed,
                        ' ',
                        channel.units.speed
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Direction:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.wind.direction + "°"
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Humidity:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.atmosphere.humidity + "%"
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Pressure:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        pressure.toFixed(2) + " inHg"
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Visibility:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.atmosphere.visibility,
                        ' ',
                        channel.units.distance
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Sunrise:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.astronomy.sunrise
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Sunset:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.astronomy.sunset
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Latitude:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.item.lat
                    )
                ),
                React.createElement(
                    'div',
                    null,
                    React.createElement(
                        'span',
                        { className: 'title' },
                        'Longitude:'
                    ),
                    React.createElement(
                        'span',
                        { className: 'value' },
                        channel.item.long
                    )
                )
            );
        }
    }]);

    return WeatherDetails;
})(React.Component);

var ForecastBlock = (function (_React$Component5) {
    _inherits(ForecastBlock, _React$Component5);

    function ForecastBlock() {
        _classCallCheck(this, ForecastBlock);

        _get(Object.getPrototypeOf(ForecastBlock.prototype), 'constructor', this).apply(this, arguments);
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    //  Renders the 7 day forecast in ForecastBlocks.
    //
    ////////////////////////////////////////////////////////////////////////////////

    _createClass(ForecastBlock, [{
        key: 'render',
        value: function render() {
            var fc = this.props.forecast;
            var when = fc.day + ", " + fc.date;
            var iconClass = "icon-image " + getIconClass(this.props.forecast.code);
            return React.createElement(
                'div',
                { className: 'forecast-block' },
                React.createElement(
                    'div',
                    { className: 'content' },
                    React.createElement(
                        'div',
                        { className: 'center medium' },
                        when
                    ),
                    React.createElement(
                        'div',
                        { className: 'center large' },
                        fc.low,
                        '° / ',
                        fc.high,
                        '°'
                    ),
                    React.createElement(
                        'div',
                        { className: 'center small' },
                        fc.text
                    ),
                    React.createElement('img', { className: iconClass, src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=' })
                )
            );
        }
    }]);

    return ForecastBlock;
})(React.Component);

var WeatherForecast = (function (_React$Component6) {
    _inherits(WeatherForecast, _React$Component6);

    function WeatherForecast() {
        _classCallCheck(this, WeatherForecast);

        _get(Object.getPrototypeOf(WeatherForecast.prototype), 'constructor', this).apply(this, arguments);
    }

    ////////////////////////////////////////////////////////////////////////////////
    //
    //  Main application class
    //  Owns the common timers and sets up the general layout of the clock.
    //  Time and wather changes flow down to components through state changes.
    //
    ////////////////////////////////////////////////////////////////////////////////

    _createClass(WeatherForecast, [{
        key: 'render',
        value: function render() {
            if (this.props.channel.hasOwnProperty("item")) {
                return React.createElement(
                    'div',
                    { className: 'weather-forecast' },
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[0] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[1] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[2] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[3] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[4] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[5] }),
                    React.createElement(ForecastBlock, { forecast: this.props.channel.item.forecast[7] })
                );
            } else {
                return React.createElement('div', { className: 'weather-forecast' });
            }
        }
    }]);

    return WeatherForecast;
})(React.Component);

var WeatherClock = (function (_React$Component7) {
    _inherits(WeatherClock, _React$Component7);

    function WeatherClock(props) {
        _classCallCheck(this, WeatherClock);

        _get(Object.getPrototypeOf(WeatherClock.prototype), 'constructor', this).call(this, props);
        this.state = { channel: {}, time: new Date() };
    }

    _createClass(WeatherClock, [{
        key: 'getForecast',
        value: function getForecast(cb) {
            var statement = 'select * from weather.forecast where woeid=' + this.props.cities[this.props.cityIndex].key;
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
        key: 'refreshWeather',
        value: function refreshWeather() {
            var that = this;
            this.getForecast(function (results) {
                that.setState({ channel: results.channel });
            });
        }
    }, {
        key: 'refreshTime',
        value: function refreshTime() {
            this.setState({ time: new Date() });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            var that = this;
            this.refreshWeather();
            this.weatherInterval = setInterval(function () {
                return that.refreshWeather();
            }, 3600000);
            this.timeInterval = setInterval(function () {
                return that.refreshTime();
            }, 1000);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            clearInterval(this.weatherInterval);
            clearInterval(this.timeInterval);
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                'div',
                { className: 'app-container' },
                React.createElement(
                    'div',
                    { className: 'column1' },
                    React.createElement(TimeDetails, { time: this.state.time })
                ),
                React.createElement(
                    'div',
                    { className: 'column2' },
                    React.createElement(ClockFace, { time: this.state.time }),
                    React.createElement(WeatherStatus, { channel: this.state.channel })
                ),
                React.createElement(
                    'div',
                    { className: 'column3' },
                    React.createElement(WeatherDetails, { channel: this.state.channel })
                ),
                React.createElement(WeatherForecast, { channel: this.state.channel })
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
    ReactDOM.render(React.createElement(WeatherClock, { cityIndex: '6' }), document.getElementById('mount'));
});

