import { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faStop } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import alert from "./assets/alert.wav";
import Lettering from "./components/Lettering/Lettering";
import "./App.scss";

class App extends Component {
  constructor(props) {
    super(props);
    this.pulse1 = createRef();
    this.pulse2 = createRef();
    this.audio = new Audio(alert);
  }

  decrementTimerIntervalId;
  firstPulseTimeoutId;
  secondPulseTimeoutId;

  state = {
    break: 300,
    session: 1500,
    timer: 1500,
    isPulseAcive: { first: false, second: false },
    activeInterval: "session",
    isTimerActive: false,
  };

  componentWillUnmount() {
    clearInterval(this.decrementTimerIntervalId);
    clearTimeout(this.firstPulseTimeoutId);
    clearTimeout(this.secondPulseTimeoutId);
  }

  startTimer = () => {
    this.setState(
      (state) => ({
        ...state,
        isTimerActive: true,
        isPulseAcive: { first: false, second: false },
      }),
      () => {
        this.pulse1.current.removeEventListener(
          "animationiteration",
          this.stopFirstPulse
        );

        this.pulse2.current.removeEventListener(
          "animationiteration",
          this.stopSecondPulse
        );

        if (this.state.timer <= 3) {
          this.audio.currentTime = 3 - this.state.timer;
          this.audio.play();
        }
      }
    );

    this.decrementTimerIntervalId = setInterval(this.decrementTimer, 1000);
    this.firstPulseTimeoutId = setTimeout(this.activatePulse1, 1000);
    this.secondPulseTimeoutId = setTimeout(this.activatePulse2, 2000);
  };

  decrementTimer = () => {
    if (this.state.timer === 4) {
      this.audio.play();
    }

    this.setState((state) => ({
      ...state,
      timer: state.timer
        ? state.timer - 1
        : state[this.toggleInterval(state.activeInterval)],
      activeInterval: state.timer
        ? state.activeInterval
        : this.toggleInterval(state.activeInterval),
    }));
  };

  activatePulse1 = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: { ...state.isPulseAcive, first: true },
    }));
  };

  activatePulse2 = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: { ...state.isPulseAcive, second: true },
    }));
  };

  pauseTimer = () => {
    this.decrementTimerIntervalId = clearInterval(
      this.decrementTimerIntervalId
    );
    this.firstPulseTimeoutId = clearTimeout(this.firstPulseTimeoutId);
    this.secondPulseTimeoutId = clearTimeout(this.secondPulseTimeoutId);

    if (this.state.timer <= 3) {
      this.audio.pause();
    }

    this.setState(
      (state) => ({
        ...state,
        isTimerActive: false,
      }),
      () => {
        this.pulse1.current.addEventListener(
          "animationiteration",
          this.stopFirstPulse,
          { once: true }
        );

        this.pulse2.current.addEventListener(
          "animationiteration",
          this.stopSecondPulse,
          { once: true }
        );
      }
    );
  };

  stopFirstPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: {
        ...state.isPulseAcive,
        first: false,
      },
    }));
  };

  stopSecondPulse = () => {
    this.setState((state) => ({
      ...state,
      isPulseAcive: {
        ...state.isPulseAcive,
        second: false,
      },
    }));
  };

  resetTimer = () => {
    this.decrementTimerIntervalId = clearInterval(
      this.decrementTimerIntervalId
    );
    this.firstPulseTimeoutId = clearTimeout(this.firstPulseTimeoutId);
    this.secondPulseTimeoutId = clearTimeout(this.secondPulseTimeoutId);

    if (this.state.timer <= 3) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.setState(
      (state) => ({
        ...state,
        break: 300,
        session: 1500,
        timer: 1500,
        activeInterval: "session",
        isTimerActive: false,
      }),
      () => {
        this.pulse1.current.addEventListener(
          "animationiteration",
          this.stopFirstPulse,
          { once: true }
        );

        this.pulse2.current.addEventListener(
          "animationiteration",
          this.stopSecondPulse,
          { once: true }
        );
      }
    );
  };

  toggleInterval = (activeInterval) => {
    if (activeInterval === "session") {
      return "break";
    } else {
      return "session";
    }
  };

  incrementInterval = (interval) => {
    this.setState((state) => ({
      ...state,
      [interval]: state[interval] === 3600 ? 60 : state[interval] + 60,
      timer:
        this.state.activeInterval === interval
          ? state[interval] === 3600
            ? 60
            : state[interval] + 60
          : state.timer,
    }));
  };

  decrementInterval = (interval) => {
    this.setState((state) => ({
      ...state,
      [interval]: state[interval] === 60 ? 3600 : state[interval] - 60,
      timer:
        this.state.activeInterval === interval
          ? state[interval] === 60
            ? 3600
            : state[interval] - 60
          : state.timer,
    }));
  };

  formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);
  };

  formatInterval = (seconds) => {
    return Math.floor(seconds / 60) + " min";
  };

  render() {
    const pulse1 = classNames({
      timer__pulse: true,
      "timer__pulse--active": this.state.isPulseAcive.first,
      "timer__pulse--secondary": this.state.timer <= 3,
    });

    const pulse2 = classNames({
      timer__pulse: true,
      "timer__pulse--active": this.state.isPulseAcive.second,
      "timer__pulse--secondary": this.state.timer <= 3,
    });

    return (
      <div className="app">
        <div className="sizer">
          <div className="timer">
            <span className={pulse1} ref={this.pulse1}></span>
            <span className={pulse2} ref={this.pulse2}></span>
            <Lettering
              tag="h2"
              angleSpan={45}
              angleOffset={-65}
              radius={65}
              active={this.state.activeInterval === "break"}
              buttons={!this.state.isTimerActive}
              intervalType="break"
              incrementInterval={this.incrementInterval}
              decrementInterval={this.decrementInterval}
            >
              Break
            </Lettering>
            <Lettering
              tag="h2"
              angleSpan={30}
              angleOffset={-57}
              radius={0}
              active={this.state.activeInterval === "break"}
              buttons={false}
              small={true}
            >
              {this.formatInterval(this.state.break)}
            </Lettering>
            <Lettering
              tag="h2"
              angleSpan={45}
              angleOffset={15}
              radius={65}
              active={this.state.activeInterval === "session"}
              buttons={!this.state.isTimerActive}
              intervalType="session"
              incrementInterval={this.incrementInterval}
              decrementInterval={this.decrementInterval}
            >
              Session
            </Lettering>
            <Lettering
              tag="h2"
              angleSpan={30}
              angleOffset={27}
              radius={0}
              active={this.state.activeInterval === "session"}
              buttons={false}
              small={true}
            >
              {this.formatInterval(this.state.session)}
            </Lettering>
            <div className="timer__content">
              <div className="timer__content-time">
                {this.formatTimer(this.state.timer)}
              </div>
              <div className="timer__content-controls">
                <button
                  className="timer__content-controls-button"
                  onClick={
                    !this.state.isTimerActive &&
                    !this.state.isPulseAcive.first &&
                    !this.state.isPulseAcive.second
                      ? this.startTimer
                      : null
                  }
                  aria-label="Play"
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    className="timer__content-controls-button-icon"
                  />
                </button>
                <button
                  className="timer__content-controls-button"
                  onClick={this.state.isTimerActive ? this.pauseTimer : null}
                  aria-label="Pause"
                >
                  <FontAwesomeIcon
                    icon={faPause}
                    className="timer__content-controls-button-icon"
                  />
                </button>
                <button
                  className="timer__content-controls-button"
                  onClick={this.resetTimer}
                  aria-label="Stop"
                >
                  <FontAwesomeIcon
                    icon={faStop}
                    className="timer__content-controls-button-icon"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="timer">
          <span className={pulse1} ref={this.pulse1}></span>
          <span className={pulse2} ref={this.pulse2}></span>
          <Lettering
            tag="h2"
            angleSpan={45}
            angleOffset={-65}
            radius={65}
            active={this.state.activeInterval === "break"}
            buttons={!this.state.isTimerActive}
            intervalType="break"
            incrementInterval={this.incrementInterval}
            decrementInterval={this.decrementInterval}
          >
            Break
          </Lettering>
          <Lettering
            tag="h2"
            angleSpan={30}
            angleOffset={-57}
            radius={0}
            active={this.state.activeInterval === "break"}
            buttons={false}
            small={true}
          >
            {this.formatInterval(this.state.break)}
          </Lettering>
          <Lettering
            tag="h2"
            angleSpan={45}
            angleOffset={15}
            radius={65}
            active={this.state.activeInterval === "session"}
            buttons={!this.state.isTimerActive}
            intervalType="session"
            incrementInterval={this.incrementInterval}
            decrementInterval={this.decrementInterval}
          >
            Session
          </Lettering>
          <Lettering
            tag="h2"
            angleSpan={30}
            angleOffset={27}
            radius={0}
            active={this.state.activeInterval === "session"}
            buttons={false}
            small={true}
          >
            {this.formatInterval(this.state.session)}
          </Lettering>
          <div className="timer__time">
            {this.formatTimer(this.state.timer)}
          </div>
          <div className="timer__controls">
            <button
              className="timer__controls-button"
              onClick={
                !this.state.isTimerActive &&
                !this.state.isPulseAcive.first &&
                !this.state.isPulseAcive.second
                  ? this.startTimer
                  : null
              }
              aria-label="Play"
            >
              <FontAwesomeIcon
                icon={faPlay}
                className="timer__controls-button-icon"
              />
            </button>
            <button
              className="timer__controls-button"
              onClick={this.state.isTimerActive ? this.pauseTimer : null}
              aria-label="Pause"
            >
              <FontAwesomeIcon
                icon={faPause}
                className="timer__controls-button-icon"
              />
            </button>
            <button
              className="timer__controls-button"
              onClick={this.resetTimer}
              aria-label="Stop"
            >
              <FontAwesomeIcon
                icon={faStop}
                className="timer__controls-button-icon"
              />
            </button>
          </div>
        </div> */}
      </div>
    );
  }
}

export default App;
